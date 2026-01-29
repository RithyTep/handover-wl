import SwiftUI

struct PreferencesSection: View {
    @ObservedObject var viewModel: AppViewModel
    @ObservedObject var ticketVM: TicketListViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionHeader(icon: "bell.badge", title: "Preferences")

            // Sound toggle
            HStack {
                Image(systemName: viewModel.soundEnabled ? "speaker.wave.2.fill" : "speaker.slash.fill")
                    .font(.system(size: 11))
                    .foregroundStyle(viewModel.soundEnabled ? Theme.accent : Theme.textTertiary)
                    .frame(width: 16)
                Text("Notification Sound")
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.textPrimary)
                Spacer()
                Toggle("", isOn: $viewModel.soundEnabled)
                    .toggleStyle(.switch)
                    .controlSize(.mini)
                    .labelsHidden()
                    .onChange(of: viewModel.soundEnabled) { _, newValue in
                        ticketVM.soundEnabled = newValue
                        viewModel.saveConfig()
                    }
            }

            // Sound picker
            if viewModel.soundEnabled {
                HStack(spacing: 6) {
                    Text("Sound")
                        .font(.system(size: 10))
                        .foregroundStyle(Theme.textTertiary)
                        .frame(width: 40, alignment: .leading)

                    Picker("", selection: $viewModel.selectedSound) {
                        ForEach(NotificationSoundService.availableSounds, id: \.self) { sound in
                            Text(sound).tag(sound)
                        }
                    }
                    .pickerStyle(.menu)
                    .controlSize(.small)
                    .frame(maxWidth: 120)
                    .onChange(of: viewModel.selectedSound) { _, newValue in
                        ticketVM.selectedSound = newValue
                        viewModel.saveConfig()
                    }

                    Button {
                        NotificationSoundService.play(viewModel.selectedSound)
                    } label: {
                        Image(systemName: "play.circle.fill")
                            .font(.system(size: 14))
                            .foregroundStyle(Theme.accent)
                    }
                    .buttonStyle(.plain)
                }
            }

            Theme.divider.frame(height: 0.5)

            // Widget toggle
            HStack {
                Image(systemName: viewModel.widgetEnabled ? "pip.fill" : "pip")
                    .font(.system(size: 11))
                    .foregroundStyle(viewModel.widgetEnabled ? Theme.accent : Theme.textTertiary)
                    .frame(width: 16)
                Text("Floating Widget")
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.textPrimary)
                Spacer()
                Toggle("", isOn: $viewModel.widgetEnabled)
                    .toggleStyle(.switch)
                    .controlSize(.mini)
                    .labelsHidden()
                    .onChange(of: viewModel.widgetEnabled) { _, newValue in
                        ticketVM.widgetEnabled = newValue
                        viewModel.saveConfig()
                        if newValue {
                            ticketVM.updateWidget()
                        } else {
                            NotificationPanel.shared.dismissWidget()
                        }
                    }
            }

            if viewModel.widgetEnabled {
                Text("Always-on-top pill showing ticket count. Drag to reposition.")
                    .font(.system(size: 9))
                    .foregroundStyle(Theme.textTertiary)
            }
        }
        .cardStyle()
        .animation(.easeInOut(duration: 0.2), value: viewModel.soundEnabled)
        .animation(.easeInOut(duration: 0.2), value: viewModel.widgetEnabled)
    }
}
