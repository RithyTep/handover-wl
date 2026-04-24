import SwiftUI

struct PopoverContentView: View {
    @ObservedObject var viewModel: AppViewModel
    @ObservedObject var ticketVM: TicketListViewModel
    @State private var showSettings = false

    var body: some View {
        VStack(spacing: 0) {
            // Simple header
            HStack {
                Label("Tickets", systemImage: "ticket")
                    .font(.headline)

                if ticketVM.totalCount > 0 {
                    Text("\(ticketVM.totalCount)")
                        .font(.caption.bold())
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(.tint, in: Capsule())
                        .foregroundStyle(.white)
                }

                Spacer()

                Button {
                    showSettings = true
                } label: {
                    Image(systemName: "gearshape")
                }
                .buttonStyle(.borderless)

                Button {
                    Task { await refreshTickets() }
                } label: {
                    Image(systemName: "arrow.clockwise")
                        .rotationEffect(.degrees(ticketVM.isLoading ? 360 : 0))
                        .animation(
                            ticketVM.isLoading ? .linear(duration: 1).repeatForever(autoreverses: false) : .default,
                            value: ticketVM.isLoading
                        )
                }
                .buttonStyle(.borderless)
                .disabled(ticketVM.isLoading)
            }
            .padding()

            Divider()

            // Content - either settings or tickets
            if showSettings {
                SettingsView(viewModel: viewModel, ticketVM: ticketVM)
                    .frame(maxHeight: .infinity)

                Divider()

                HStack {
                    Button("Back to Tickets") {
                        showSettings = false
                    }
                    .buttonStyle(.borderless)

                    Spacer()

                    Button("Quit") {
                        NSApplication.shared.terminate(nil)
                    }
                    .buttonStyle(.borderless)
                    .foregroundStyle(.red)
                }
                .padding()
            } else {
                // Ticket list - direct
                TicketListView(viewModel: ticketVM, appUrl: viewModel.appUrl)
                    .onAppear {
                        if ticketVM.tickets.isEmpty {
                            Task { await refreshTickets() }
                        }
                    }

                Divider()

                // Simple footer
                HStack {
                    Circle()
                        .fill(statusColor)
                        .frame(width: 8, height: 8)

                    Text(viewModel.statusMessage)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)

                    Spacer()

                    Button("Quit") {
                        NSApplication.shared.terminate(nil)
                    }
                    .buttonStyle(.borderless)
                    .font(.caption)
                }
                .padding(.horizontal)
                .padding(.vertical, 8)
            }
        }
        .frame(width: 380, height: showSettings ? 520 : 480)
        .animation(.easeInOut(duration: 0.2), value: showSettings)
    }

    private var statusColor: Color {
        if viewModel.isRunning { return .orange }
        if viewModel.isError { return .red }
        if viewModel.scheduler.isScheduled { return .green }
        return .secondary
    }

    private func refreshTickets() async {
        let config = AppConfig(
            appUrl: viewModel.appUrl, token: "", channelId: "",
            mentions: "", preset: "day", hour: "17", minute: "16",
            soundEnabled: "true", selectedSound: "Tink",
            widgetEnabled: "false", pollingInterval: "30"
        )
        await ticketVM.fetchTickets(config: config)
    }
}
