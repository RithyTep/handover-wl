import SwiftUI
import ServiceManagement

struct PopoverContentView: View {
    @ObservedObject var viewModel: AppViewModel
    @State private var launchAtLogin = SMAppService.mainApp.status == .enabled

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header
            VStack(alignment: .leading, spacing: 2) {
                Text("Lazyhand")
                    .font(.title2)
                    .fontWeight(.semibold)
                Text("Auto-reply scheduler for handover messages")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Divider()

            // Scrollable content
            ScrollView {
                VStack(spacing: 16) {
                    ConnectionSection(viewModel: viewModel)
                    ScheduleSection(viewModel: viewModel)
                }
            }

            Divider()

            // Status
            StatusBar(viewModel: viewModel)

            Divider()

            // Footer
            HStack {
                Toggle("Launch at Login", isOn: $launchAtLogin)
                    .toggleStyle(.switch)
                    .controlSize(.mini)
                    .onChange(of: launchAtLogin) { _, newValue in
                        setLaunchAtLogin(newValue)
                    }

                Spacer()

                Button("Quit") {
                    NSApplication.shared.terminate(nil)
                }
                .buttonStyle(.plain)
                .font(.caption)
                .foregroundStyle(.secondary)
            }
            .font(.caption)
        }
        .padding(16)
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
