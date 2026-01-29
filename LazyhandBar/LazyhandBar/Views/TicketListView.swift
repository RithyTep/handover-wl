import SwiftUI

struct TicketListView: View {
    @ObservedObject var viewModel: TicketListViewModel
    let appUrl: String
    @State private var selectedTicket: Ticket?

    var body: some View {
        ZStack {
            if let ticket = selectedTicket {
                TicketDetailView(
                    ticket: ticket,
                    appUrl: appUrl,
                    onBack: {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            selectedTicket = nil
                        }
                    }
                )
                .transition(.move(edge: .trailing))
            } else {
                ticketListContent
                    .transition(.move(edge: .leading))
            }
        }
        .animation(.easeInOut(duration: 0.2), value: selectedTicket?.id)
    }

    // MARK: - List Content

    private var ticketListContent: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Image(systemName: "ticket")
                    .foregroundStyle(Theme.accent)
                Text("Tickets")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(Theme.textPrimary)

                if viewModel.totalCount > 0 {
                    Text("\(viewModel.totalCount)")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundStyle(Theme.bg)
                        .padding(.horizontal, 7)
                        .padding(.vertical, 2)
                        .background(Capsule().fill(Theme.accent))
                }

                Spacer()

                Button {
                    Task { await refreshTickets() }
                } label: {
                    Image(systemName: "arrow.clockwise")
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.textSecondary)
                        .rotationEffect(.degrees(viewModel.isLoading ? 360 : 0))
                        .animation(
                            viewModel.isLoading
                                ? .linear(duration: 1).repeatForever(autoreverses: false)
                                : .default,
                            value: viewModel.isLoading
                        )
                }
                .buttonStyle(.plain)
                .disabled(viewModel.isLoading)
            }
            .padding(.horizontal, 16)
            .padding(.top, 12)
            .padding(.bottom, 8)

            // Search
            HStack(spacing: 6) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.textTertiary)
                TextField("Search tickets...", text: $viewModel.searchText)
                    .textFieldStyle(.plain)
                    .font(.system(size: 12))
                    .foregroundStyle(Theme.textPrimary)
                if !viewModel.searchText.isEmpty {
                    Button {
                        viewModel.searchText = ""
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 11))
                            .foregroundStyle(Theme.textTertiary)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 7)
            .background(RoundedRectangle(cornerRadius: 8).fill(Theme.cardBg))
            .padding(.horizontal, 16)
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

            // Updated time
            if let lastFetch = viewModel.lastFetchDate {
                HStack {
                    if viewModel.isLoading {
                        ProgressView()
                            .controlSize(.mini)
                            .scaleEffect(0.7)
                    }
                    Text("Updated \(lastFetch, style: .relative) ago")
                        .font(.system(size: 10))
                        .foregroundStyle(Theme.textTertiary)
                    Spacer()
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 6)
            }
        }
    }

    // MARK: - States

    private var loadingState: some View {
        VStack(spacing: 10) {
            Spacer()
            ProgressView()
                .controlSize(.small)
                .tint(Theme.accent)
            Text("Loading tickets...")
                .font(.system(size: 12))
                .foregroundStyle(Theme.textSecondary)
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    private func errorState(_ error: String) -> some View {
        VStack(spacing: 10) {
            Spacer()
            Image(systemName: "wifi.exclamationmark")
                .font(.title2)
                .foregroundStyle(Theme.textTertiary)
            Text(error)
                .font(.system(size: 11))
                .foregroundStyle(Theme.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            Button("Try Again") {
                Task { await refreshTickets() }
            }
            .buttonStyle(.bordered)
            .controlSize(.small)
            .tint(Theme.accent)
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    private var emptyState: some View {
        VStack(spacing: 8) {
            Spacer()
            Image(systemName: viewModel.searchText.isEmpty ? "tray" : "magnifyingglass")
                .font(.title2)
                .foregroundStyle(Theme.textTertiary)
            Text(viewModel.searchText.isEmpty ? "No Tickets" : "No Results")
                .font(.system(size: 12))
                .foregroundStyle(Theme.textSecondary)
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    private var ticketList: some View {
        ScrollView {
            LazyVStack(spacing: 4) {
                ForEach(viewModel.filteredTickets) { ticket in
                    TicketRowView(ticket: ticket) {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            selectedTicket = ticket
                        }
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 4)
        }
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
