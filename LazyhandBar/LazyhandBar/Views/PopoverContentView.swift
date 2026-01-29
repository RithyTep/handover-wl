import SwiftUI
import ServiceManagement

enum PopoverTab: Int, CaseIterable {
    case tickets
    case settings
}

struct PopoverContentView: View {
    @ObservedObject var viewModel: AppViewModel
    @ObservedObject var ticketVM: TicketListViewModel
    @State private var selectedTab: PopoverTab = .tickets
    @State private var launchAtLogin = SMAppService.mainApp.status == .enabled

    var body: some View {
        VStack(spacing: 0) {
            // Tab picker
            tabPicker
                .padding(.horizontal, 16)
                .padding(.top, 14)
                .padding(.bottom, 10)

            Theme.divider.frame(height: 0.5)

            // Content
            Group {
                switch selectedTab {
                case .tickets:
                    TicketListView(viewModel: ticketVM, appUrl: viewModel.appUrl)
                        .onAppear {
                            if ticketVM.tickets.isEmpty {
                                Task { await loadTickets() }
                            }
                        }
                case .settings:
                    SettingsView(viewModel: viewModel, ticketVM: ticketVM)
                }
            }

            Theme.divider.frame(height: 0.5)

            // Footer
            footer
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
        }
        .background(Theme.bg)
        .preferredColorScheme(.dark)
    }

    // MARK: - Tab Picker

    private var tabPicker: some View {
        HStack(spacing: 0) {
            tabItem("Tickets", icon: "list.bullet.rectangle", tab: .tickets)
            tabItem("Settings", icon: "gearshape", tab: .settings)
        }
        .background(RoundedRectangle(cornerRadius: 10).fill(Theme.cardBg))
    }

    private func tabItem(_ title: String, icon: String, tab: PopoverTab) -> some View {
        let isActive = selectedTab == tab
        return Button {
            withAnimation(.easeInOut(duration: 0.15)) {
                selectedTab = tab
            }
        } label: {
            HStack(spacing: 5) {
                Image(systemName: icon)
                    .font(.system(size: 10))
                Text(title)
                    .font(.system(size: 12, weight: .medium))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 7)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(isActive ? Theme.accent : Color.clear)
            )
            .foregroundStyle(isActive ? Theme.bg : Theme.textSecondary)
        }
        .buttonStyle(.plain)
        .padding(2)
    }

    // MARK: - Footer

    private var footer: some View {
        HStack(spacing: 12) {
            Button {
                withAnimation {
                    selectedTab = .settings
                }
            } label: {
                Image(systemName: "gearshape.fill")
                    .font(.system(size: 14))
                    .foregroundStyle(Theme.textSecondary)
            }
            .buttonStyle(.plain)

            Button {
                // Toggle widget
                viewModel.widgetEnabled.toggle()
                viewModel.saveConfig()
                ticketVM.widgetEnabled = viewModel.widgetEnabled
                if viewModel.widgetEnabled {
                    ticketVM.updateWidget()
                } else {
                    NotificationPanel.shared.dismissWidget()
                }
            } label: {
                Image(systemName: viewModel.widgetEnabled ? "pip.fill" : "pip")
                    .font(.system(size: 14))
                    .foregroundStyle(viewModel.widgetEnabled ? Theme.accent : Theme.textSecondary)
            }
            .buttonStyle(.plain)

            // Status dot
            Circle()
                .fill(statusColor)
                .frame(width: 8, height: 8)

            Spacer()

            Toggle("Login", isOn: $launchAtLogin)
                .toggleStyle(.switch)
                .controlSize(.mini)
                .labelsHidden()
                .onChange(of: launchAtLogin) { _, newValue in
                    setLaunchAtLogin(newValue)
                }

            Button("Quit") {
                NSApplication.shared.terminate(nil)
            }
            .buttonStyle(.plain)
            .font(.system(size: 12))
            .foregroundStyle(Theme.textSecondary)
        }
    }

    private var statusColor: Color {
        if viewModel.isRunning { return .orange }
        if viewModel.isError { return Theme.accentRed }
        if viewModel.scheduler.isScheduled { return Theme.accent }
        return Theme.textTertiary
    }

    // MARK: - Actions

    private func loadTickets() async {
        let config = AppConfig(
            appUrl: viewModel.appUrl, token: "", channelId: "",
            mentions: "", preset: "day", hour: "17", minute: "16",
            soundEnabled: "true", selectedSound: "Tink",
            widgetEnabled: "false", pollingInterval: "30"
        )
        await ticketVM.fetchTickets(config: config)
    }

    private func setLaunchAtLogin(_ enabled: Bool) {
        do {
            if enabled {
                try SMAppService.mainApp.register()
            } else {
                try SMAppService.mainApp.unregister()
            }
        } catch {
            print("[LaunchAtLogin] Error: \(error)")
            launchAtLogin = SMAppService.mainApp.status == .enabled
        }
    }
}
