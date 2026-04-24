import SwiftUI

struct TicketListView: View {
    @ObservedObject var viewModel: TicketListViewModel
    let appUrl: String

    // Force view refresh when tickets change
    private var ticketIds: String {
        viewModel.tickets.map(\.key).joined()
    }

    var body: some View {
        VStack(spacing: 0) {
            // Search
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundStyle(.secondary)
                TextField("Search...", text: $viewModel.searchText)
                    .textFieldStyle(.plain)
                if !viewModel.searchText.isEmpty {
                    Button {
                        viewModel.searchText = ""
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(.secondary)
                    }
                    .buttonStyle(.borderless)
                }
            }
            .padding(8)
            .background(.quaternary, in: RoundedRectangle(cornerRadius: 8))
            .padding(.horizontal)
            .padding(.bottom, 8)

            // Content
            if viewModel.isLoading && viewModel.tickets.isEmpty {
                Spacer()
                ProgressView("Loading...")
                Spacer()
            } else if let error = viewModel.errorMessage {
                Spacer()
                VStack(spacing: 8) {
                    Image(systemName: "wifi.exclamationmark")
                        .font(.title2)
                        .foregroundStyle(.secondary)
                    Text(error)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding()
                Spacer()
            } else if viewModel.filteredTickets.isEmpty {
                Spacer()
                VStack(spacing: 8) {
                    Image(systemName: "tray")
                        .font(.title2)
                        .foregroundStyle(.secondary)
                    Text(viewModel.searchText.isEmpty ? "No tickets" : "No results")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    // Debug info
                    Text("raw: \(viewModel.tickets.count), filtered: \(viewModel.filteredTickets.count)")
                        .font(.caption2)
                        .foregroundStyle(.tertiary)
                    Text("search: '\(viewModel.searchText)'")
                        .font(.caption2)
                        .foregroundStyle(.tertiary)
                }
                Spacer()
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(viewModel.filteredTickets) { ticket in
                            TicketRowView(ticket: ticket) {
                                openTicket(ticket)
                            }
                            Divider()
                        }
                    }
                }
            }
        }
        .id(ticketIds) // Force refresh when tickets change
    }

    private func openTicket(_ ticket: Ticket) {
        if let url = URL(string: ticket.jiraUrl) {
            NSWorkspace.shared.open(url)
        }
    }
}
