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
        guard !config.appUrl.isEmpty else { return }
        soundEnabled = config.isSoundEnabled
        selectedSound = config.selectedSound
        widgetEnabled = config.isWidgetEnabled
        startBackgroundPolling(
            appUrl: config.trimmedAppUrl,
            interval: config.pollingIntervalSeconds
        )
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

        do {
            let response = try await apiService.fetchTickets(config: config)
            let newTickets = detectNewTickets(response.tickets)
            tickets = response.tickets
            totalCount = response.total
            ticketCount = response.total
            lastFetchDate = Date()

            // Sync fast-check state so it doesn't re-trigger
            lastKnownTotal = response.total
            lastKnownLatestKey = response.tickets.first?.key

            // Preload detail data in background for instant taps
            TicketDetailViewModel.preload(tickets: response.tickets, appUrl: config.trimmedAppUrl)

            if !newTickets.isEmpty {
                showNewTicketNotification(newTickets)
            }
        } catch {
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
