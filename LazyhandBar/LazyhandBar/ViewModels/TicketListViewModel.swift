import Foundation
import SwiftUI

@MainActor
final class TicketListViewModel: ObservableObject {
    @Published var tickets: [Ticket] = []
    @Published var totalCount: Int = 0
    @Published var ticketCount: Int = 0
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    @Published var searchText: String = ""
    @Published var lastFetchDate: Date?
    @Published var selectedTicket: Ticket?

    var hasSelectedTicket: Bool { selectedTicket != nil }

    // MARK: - Keyboard Navigation

    func navigateDown() {
        let list = filteredTickets
        guard !list.isEmpty else { return }
        if let current = selectedTicket,
           let idx = list.firstIndex(where: { $0.id == current.id }),
           idx + 1 < list.count {
            selectedTicket = list[idx + 1]
        } else {
            selectedTicket = list.first
        }
    }

    func navigateUp() {
        let list = filteredTickets
        guard !list.isEmpty else { return }
        if let current = selectedTicket,
           let idx = list.firstIndex(where: { $0.id == current.id }),
           idx > 0 {
            selectedTicket = list[idx - 1]
        } else {
            selectedTicket = list.last
        }
    }

    func clearSelection() {
        selectedTicket = nil
    }

    // Preferences (synced from AppViewModel)
    @Published var soundEnabled: Bool = true
    @Published var selectedSound: String = "Tink"
    @Published var widgetEnabled: Bool = false

    private let apiService = TicketAPIService()
    private var knownTicketKeys: Set<String> = []
    private var pollTimer: Timer?
    private var fastCheckTimer: Timer?
    private var isFirstFetch = true
    private var currentAppUrl: String = ""
    private var lastKnownTotal: Int = -1
    private var lastKnownLatestKey: String?
    private var isFastChecking = false

    init() {
        autoStartPolling()
    }

    private func autoStartPolling() {
        let config = ConfigService.shared.load()
        debugLog("Config loaded - appUrl: \(config.appUrl)")
        guard !config.appUrl.isEmpty else {
            debugLog("appUrl is empty, skipping polling")
            return
        }
        soundEnabled = config.isSoundEnabled
        selectedSound = config.selectedSound
        widgetEnabled = config.isWidgetEnabled
        debugLog("Starting polling with URL: \(config.trimmedAppUrl)")
        startBackgroundPolling(
            appUrl: config.trimmedAppUrl,
            interval: config.pollingIntervalSeconds
        )
    }

    private func debugLog(_ message: String) {
        let logFile = FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent(".lazyhand/debug.log")
        let timestamp = ISO8601DateFormatter().string(from: Date())
        let line = "[\(timestamp)] \(message)\n"
        if let data = line.data(using: .utf8) {
            if FileManager.default.fileExists(atPath: logFile.path) {
                if let handle = try? FileHandle(forWritingTo: logFile) {
                    handle.seekToEndOfFile()
                    handle.write(data)
                    handle.closeFile()
                }
            } else {
                try? data.write(to: logFile)
            }
        }
    }

    var filteredTickets: [Ticket] {
        if searchText.isEmpty { return tickets }
        let query = searchText.lowercased()
        return tickets.filter { ticket in
            ticket.key.lowercased().contains(query)
                || ticket.summary.lowercased().contains(query)
                || ticket.assignee.lowercased().contains(query)
                || ticket.status.lowercased().contains(query)
        }
    }

    var latestTicketKey: String? {
        tickets.first?.key
    }

    // MARK: - Fetch

    func fetchTickets(config: AppConfig) async {
        isLoading = true
        errorMessage = nil

        debugLog("Fetching from: \(config.trimmedAppUrl)")

        do {
            let response = try await apiService.fetchTickets(config: config)
            debugLog("Got \(response.tickets.count) tickets, total: \(response.total)")
            let newTickets = detectNewTickets(response.tickets)
            tickets = response.tickets
            totalCount = response.total
            ticketCount = response.total
            lastFetchDate = Date()

            // Sync fast-check state so it doesn't re-trigger
            lastKnownTotal = response.total
            lastKnownLatestKey = response.tickets.first?.key

            // Keep selected ticket data fresh
            if let selected = selectedTicket,
               let updated = response.tickets.first(where: { $0.key == selected.key }) {
                selectedTicket = updated
            }

            // Preload detail data in background for instant taps
            TicketDetailViewModel.preload(tickets: response.tickets, appUrl: config.trimmedAppUrl)

            if !newTickets.isEmpty {
                showNewTicketNotification(newTickets)
            }
        } catch {
            debugLog("Error: \(error)")
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    // MARK: - Background Polling (app-level)

    func startBackgroundPolling(appUrl: String, interval: TimeInterval = 30) {
        currentAppUrl = appUrl
        stopPolling()

        // Fetch immediately
        let config = buildConfig(appUrl: appUrl)
        Task { await fetchTickets(config: config) }

        // Full refresh on interval (fallback, keeps data fresh)
        pollTimer = Timer.scheduledTimer(
            withTimeInterval: interval,
            repeats: true
        ) { [weak self] _ in
            guard let self else { return }
            Task { @MainActor in
                let cfg = self.buildConfig(appUrl: self.currentAppUrl)
                await self.fetchTickets(config: cfg)
            }
        }

        // Fast event check every 5 seconds (lightweight, ~200ms)
        startFastCheck()
    }

    func updatePollingUrl(_ appUrl: String) {
        currentAppUrl = appUrl
    }

    func stopPolling() {
        pollTimer?.invalidate()
        pollTimer = nil
        fastCheckTimer?.invalidate()
        fastCheckTimer = nil
    }

    // MARK: - Fast Event Check (5-second lightweight poll)

    private func startFastCheck() {
        fastCheckTimer?.invalidate()
        fastCheckTimer = Timer.scheduledTimer(
            withTimeInterval: 5,
            repeats: true
        ) { [weak self] _ in
            guard let self else { return }
            Task { @MainActor in
                await self.performFastCheck()
            }
        }
    }

    private func performFastCheck() async {
        guard !isFastChecking, !isLoading else { return }
        isFastChecking = true
        defer { isFastChecking = false }

        let config = buildConfig(appUrl: currentAppUrl)
        guard let poll = try? await apiService.pollCheck(config: config),
              poll.success else { return }

        let totalChanged = lastKnownTotal != -1 && poll.total != lastKnownTotal
        let keyChanged = lastKnownLatestKey != nil && poll.latestKey != lastKnownLatestKey

        lastKnownTotal = poll.total
        lastKnownLatestKey = poll.latestKey

        // Something changed → trigger immediate full fetch
        if totalChanged || keyChanged {
            await fetchTickets(config: config)
        }
    }

    // MARK: - New Ticket Detection

    private func detectNewTickets(_ fetched: [Ticket]) -> [Ticket] {
        let fetchedKeys = Set(fetched.map(\.key))

        if isFirstFetch {
            isFirstFetch = false
            knownTicketKeys = fetchedKeys
            return []
        }

        let newKeys = fetchedKeys.subtracting(knownTicketKeys)
        knownTicketKeys = fetchedKeys

        guard !newKeys.isEmpty else { return [] }
        return fetched.filter { newKeys.contains($0.key) }
    }

    private func showNewTicketNotification(_ newTickets: [Ticket]) {
        // Play sound
        if soundEnabled {
            NotificationSoundService.play(selectedSound)
        }

        // Show banner
        NotificationPanel.shared.show(duration: 3) {
            NewTicketBanner(tickets: newTickets)
        }

        // Update widget if visible
        if widgetEnabled {
            updateWidget()
        }
    }

    func updateWidget() {
        let count = ticketCount
        let key = latestTicketKey
        let polling = pollTimer != nil
        NotificationPanel.shared.updateWidget {
            MiniWidgetView(
                ticketCount: count,
                latestTicketKey: key,
                isPolling: polling
            )
        }
    }

    // MARK: - Quick Actions

    func quickTransition(ticket: Ticket, statusName: String) async {
        guard let transitions = TicketDetailViewModel.cachedTransitions(for: ticket.key),
              let target = transitions.first(where: {
                  ($0.statusName ?? $0.name) == statusName
              }) else { return }

        let config = buildConfig(appUrl: currentAppUrl)
        do {
            let response = try await apiService.transitionTicket(
                ticketKey: ticket.key,
                transitionId: target.id,
                config: config
            )
            if response.success {
                TicketDetailViewModel.clearTransitionCache(for: ticket.key)
                await fetchTickets(config: config)
            }
        } catch { }
    }

    func bulkTransition(ticketKeys: Set<String>, statusName: String) async {
        let config = buildConfig(appUrl: currentAppUrl)
        for key in ticketKeys {
            guard let transitions = TicketDetailViewModel.cachedTransitions(for: key),
                  let target = transitions.first(where: {
                      ($0.statusName ?? $0.name) == statusName
                  }) else { continue }

            _ = try? await apiService.transitionTicket(
                ticketKey: key,
                transitionId: target.id,
                config: config
            )
            TicketDetailViewModel.clearTransitionCache(for: key)
        }
        await fetchTickets(config: config)
    }

    func setDueDate(ticketKey: String, dueDate: String) async {
        let config = buildConfig(appUrl: currentAppUrl)
        _ = try? await apiService.setDueDate(
            ticketKey: ticketKey,
            dueDate: dueDate,
            config: config
        )
        await fetchTickets(config: config)
    }

    // MARK: - Private

    private func buildConfig(appUrl: String) -> AppConfig {
        AppConfig(
            appUrl: appUrl, token: "", channelId: "",
            mentions: "", preset: "day", hour: "17", minute: "16",
            soundEnabled: soundEnabled ? "true" : "false",
            selectedSound: selectedSound,
            widgetEnabled: widgetEnabled ? "true" : "false",
            pollingInterval: "30"
        )
    }
}
