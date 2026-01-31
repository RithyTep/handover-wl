import SwiftUI

struct TicketListView: View {
    @ObservedObject var viewModel: TicketListViewModel
    let appUrl: String
    @State private var isSelectMode = false
    @State private var selectedTicketIds: Set<String> = []
    @State private var isBulkTransitioning = false

    var body: some View {
        ticketListContent
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var emptyDetailPlaceholder: some View {
        VStack(spacing: 14) {
            Image(systemName: "ticket")
                .font(.system(size: 36))
                .foregroundStyle(Theme.textTertiary)
            Text("Select a ticket")
                .font(.system(size: 15))
                .foregroundStyle(Theme.textTertiary)
            HStack(spacing: 14) {
                keyHint("↑↓", "Navigate")
                keyHint("J/K", "Navigate")
                keyHint("⌘⏎", "Send")
                keyHint("⎋", "Close")
            }
            .padding(.top, 8)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private func keyHint(_ key: String, _ label: String) -> some View {
        HStack(spacing: 5) {
            Text(key)
                .font(.system(size: 12, weight: .semibold, design: .monospaced))
                .foregroundStyle(Theme.textPrimary.opacity(0.7))
                .padding(.horizontal, 7)
                .padding(.vertical, 4)
                .background(
                    RoundedRectangle(cornerRadius: 5)
                        .fill(Theme.cardBg)
                        .overlay(
                            RoundedRectangle(cornerRadius: 5)
                                .stroke(Theme.divider.opacity(0.4), lineWidth: 0.5)
                        )
                )
            Text(label)
                .font(.system(size: 12))
                .foregroundStyle(Theme.textTertiary)
        }
    }

    // MARK: - List Content

    private var ticketListContent: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Image(systemName: "ticket")
                    .font(.system(size: 14))
                    .foregroundStyle(Theme.accent)
                Text("Tickets")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundStyle(Theme.textPrimary)

                if viewModel.totalCount > 0 {
                    Text("\(viewModel.totalCount)")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(Theme.bg)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Capsule().fill(Theme.accent))
                }

                Spacer()

                Button {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        isSelectMode.toggle()
                        if !isSelectMode {
                            selectedTicketIds.removeAll()
                            isBulkTransitioning = false
                        }
                    }
                } label: {
                    Text(isSelectMode ? "Done" : "Select")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(Theme.accent)
                }
                .buttonStyle(ScalePressStyle())
                .pointerCursor()

                Button {
                    Task { await refreshTickets() }
                } label: {
                    Image(systemName: "arrow.clockwise")
                        .font(.system(size: 14))
                        .foregroundStyle(Theme.textSecondary)
                        .rotationEffect(.degrees(viewModel.isLoading ? 360 : 0))
                        .animation(
                            viewModel.isLoading
                                ? .linear(duration: 1).repeatForever(autoreverses: false)
                                : .default,
                            value: viewModel.isLoading
                        )
                }
                .buttonStyle(ScalePressStyle())
                .pointerCursor()
                .disabled(viewModel.isLoading)
            }
            .padding(.horizontal, 12)
            .padding(.top, 14)
            .padding(.bottom, 8)

            // Search
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 13))
                    .foregroundStyle(Theme.textTertiary)
                TextField("Search tickets...", text: $viewModel.searchText)
                    .textFieldStyle(.plain)
                    .font(.system(size: 15))
                    .foregroundStyle(Theme.textPrimary)
                if !viewModel.searchText.isEmpty {
                    Button {
                        viewModel.searchText = ""
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 13))
                            .foregroundStyle(Theme.textTertiary)
                    }
                    .buttonStyle(ScalePressStyle())
                    .pointerCursor()
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(RoundedRectangle(cornerRadius: 8).fill(Theme.cardBg))
            .padding(.horizontal, 12)
            .padding(.bottom, 10)

            // Content
            if viewModel.isLoading && viewModel.tickets.isEmpty {
                loadingState
            } else if let error = viewModel.errorMessage {
                errorState(error)
            } else if viewModel.filteredTickets.isEmpty {
                emptyState
            } else {
                ticketList
            }

            // Bulk action bar
            if isSelectMode && !selectedTicketIds.isEmpty {
                bulkActionBar
            }

            // Updated time
            if let lastFetch = viewModel.lastFetchDate {
                HStack {
                    if viewModel.isLoading {
                        ProgressView()
                            .controlSize(.mini)
                            .scaleEffect(0.7)
                    }
                    Text("Updated \(lastFetch, style: .relative) ago")
                        .font(.system(size: 11))
                        .foregroundStyle(Theme.textTertiary)
                    Spacer()
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
            }
        }
    }

    // MARK: - States

    private var loadingState: some View {
        VStack(spacing: 12) {
            Spacer()
            ProgressView()
                .controlSize(.small)
                .tint(Theme.accent)
            Text("Loading tickets...")
                .font(.system(size: 14))
                .foregroundStyle(Theme.textSecondary)
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    private func errorState(_ error: String) -> some View {
        VStack(spacing: 12) {
            Spacer()
            Image(systemName: "wifi.exclamationmark")
                .font(.title2)
                .foregroundStyle(Theme.textTertiary)
            Text(error)
                .font(.system(size: 13))
                .foregroundStyle(Theme.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            Button("Try Again") {
                Task { await refreshTickets() }
            }
            .buttonStyle(.bordered)
            .controlSize(.small)
            .tint(Theme.accent)
            .pointerCursor()
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    private var emptyState: some View {
        VStack(spacing: 10) {
            Spacer()
            Image(systemName: viewModel.searchText.isEmpty ? "tray" : "magnifyingglass")
                .font(.title2)
                .foregroundStyle(Theme.textTertiary)
            Text(viewModel.searchText.isEmpty ? "No Tickets" : "No Results")
                .font(.system(size: 14))
                .foregroundStyle(Theme.textSecondary)
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Ticket List

    private var ticketList: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 0) {
                    ForEach(viewModel.filteredTickets) { ticket in
                        VStack(spacing: 0) {
                            HStack(spacing: 6) {
                                if isSelectMode {
                                    Image(systemName: selectedTicketIds.contains(ticket.key)
                                          ? "checkmark.circle.fill" : "circle")
                                        .font(.system(size: 13))
                                        .foregroundStyle(
                                            selectedTicketIds.contains(ticket.key)
                                            ? Theme.accent : Theme.textTertiary
                                        )
                                        .pointerCursor()
                                        .transition(.scale.combined(with: .opacity))
                                }

                                TicketRowView(
                                    ticket: ticket,
                                    onTap: {
                                        if isSelectMode {
                                            toggleSelection(ticket.key)
                                        } else {
                                            withAnimation(.easeInOut(duration: 0.2)) {
                                                viewModel.selectedTicket = ticket
                                            }
                                        }
                                    },
                                    canQuickMove: !isSelectMode && canQuickMove(ticket),
                                    onQuickMove: {
                                        Task {
                                            await viewModel.quickTransition(
                                                ticket: ticket, statusName: "WL - Processing"
                                            )
                                        }
                                    },
                                    onSetDueDate: {
                                        Task {
                                            await viewModel.setDueDate(
                                                ticketKey: ticket.key, dueDate: tomorrowString()
                                            )
                                        }
                                    },
                                    isSelected: viewModel.selectedTicket?.id == ticket.id
                                )
                            }
                            .animation(.easeInOut(duration: 0.2), value: isSelectMode)

                            Theme.divider.opacity(0.3).frame(height: 0.5)
                                .padding(.horizontal, 10)
                        }
                        .id(ticket.id)
                    }
                }
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
            }
            .onChange(of: viewModel.selectedTicket?.id) { _, newId in
                if let id = newId {
                    withAnimation(.easeInOut(duration: 0.15)) {
                        proxy.scrollTo(id, anchor: .center)
                    }
                }
            }
        }
    }

    // MARK: - Bulk Action Bar

    private var bulkActionBar: some View {
        HStack(spacing: 8) {
            Text("\(selectedTicketIds.count) selected")
                .font(.system(size: 13, weight: .medium))
                .foregroundStyle(Theme.textSecondary)

            Spacer()

            if isBulkTransitioning {
                ProgressView().controlSize(.mini)
                Text("Moving...")
                    .font(.system(size: 12))
                    .foregroundStyle(Theme.accent)
            } else {
                Menu {
                    Button("WL - Processing") { performBulkTransition("WL - Processing") }
                    Button("WL - Pending") { performBulkTransition("WL - Pending") }
                    Button("TS - Pending") { performBulkTransition("TS - Pending") }
                    Button("Games - Pending") { performBulkTransition("Games - Pending") }
                } label: {
                    HStack(spacing: 5) {
                        Image(systemName: "arrow.right.circle.fill")
                            .font(.system(size: 12))
                        Text("Move to\u{2026}")
                            .font(.system(size: 13, weight: .medium))
                    }
                    .foregroundStyle(Theme.bg)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 7)
                    .background(Capsule().fill(Theme.accent))
                }
                .menuStyle(.borderlessButton)
                .pointerCursor()
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .background(Theme.cardBg)
    }

    // MARK: - Helpers

    private func openInNewWindow(_ ticket: Ticket) {
        WindowManager.shared.openDetailWindow(for: ticket, appUrl: appUrl)
    }

    private func toggleSelection(_ key: String) {
        if selectedTicketIds.contains(key) {
            selectedTicketIds.remove(key)
        } else {
            selectedTicketIds.insert(key)
        }
    }

    private func canQuickMove(_ ticket: Ticket) -> Bool {
        guard ticket.status != "WL - Processing" else { return false }
        return TicketDetailViewModel.cachedTransitions(for: ticket.key)?
            .contains(where: { ($0.statusName ?? $0.name) == "WL - Processing" }) ?? false
    }

    private func performBulkTransition(_ statusName: String) {
        isBulkTransitioning = true
        let keys = selectedTicketIds
        Task {
            await viewModel.bulkTransition(ticketKeys: keys, statusName: statusName)
            isBulkTransitioning = false
            isSelectMode = false
            selectedTicketIds.removeAll()
        }
    }

    private func tomorrowString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Date())!
        return formatter.string(from: tomorrow)
    }

    private func refreshTickets() async {
        let config = AppConfig(
            appUrl: appUrl, token: "", channelId: "",
            mentions: "", preset: "day", hour: "17", minute: "16",
            soundEnabled: "true", selectedSound: "Tink",
            widgetEnabled: "false", pollingInterval: "30"
        )
        await viewModel.fetchTickets(config: config)
    }
}
