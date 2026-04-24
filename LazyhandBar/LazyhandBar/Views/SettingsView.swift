import SwiftUI

struct SettingsView: View {
    @ObservedObject var viewModel: AppViewModel
    @ObservedObject var ticketVM: TicketListViewModel

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                // Connection
                GroupBox("Connection") {
                    VStack(alignment: .leading, spacing: 10) {
                        LabeledContent("App URL") {
                            TextField("https://...", text: $viewModel.appUrl)
                                .textFieldStyle(.roundedBorder)
                        }
                        LabeledContent("Token") {
                            SecureField("API Token", text: $viewModel.token)
                                .textFieldStyle(.roundedBorder)
                        }
                        LabeledContent("Channel ID") {
                            TextField("C0123456789", text: $viewModel.channelId)
                                .textFieldStyle(.roundedBorder)
                        }
                        LabeledContent("Mentions") {
                            TextField("@user1, @user2", text: $viewModel.mentions)
                                .textFieldStyle(.roundedBorder)
                        }

                        Button("Save Connection") {
                            viewModel.saveConfig()
                            viewModel.statusMessage = "Connection saved."
                        }
                        .buttonStyle(.borderedProminent)
                    }
                }

                // Schedule
                GroupBox("Schedule") {
                    VStack(alignment: .leading, spacing: 10) {
                        Picker("Preset", selection: $viewModel.preset) {
                            ForEach(SchedulePreset.allCases) { preset in
                                Text(preset.displayLabel).tag(preset)
                            }
                        }
                        .onChange(of: viewModel.preset) { _, _ in
                            viewModel.presetChanged()
                        }

                        if viewModel.preset != .off {
                            HStack {
                                Text("Time:")
                                Picker("", selection: $viewModel.hour) {
                                    ForEach(0..<24, id: \.self) {
                                        Text(String(format: "%02d", $0)).tag($0)
                                    }
                                }
                                .frame(width: 70)
                                .onChange(of: viewModel.hour) { _, _ in
                                    viewModel.snapToCustomIfNeeded()
                                }
                                Text(":")
                                Picker("", selection: $viewModel.minute) {
                                    ForEach(0..<60, id: \.self) {
                                        Text(String(format: "%02d", $0)).tag($0)
                                    }
                                }
                                .frame(width: 70)
                                .onChange(of: viewModel.minute) { _, _ in
                                    viewModel.snapToCustomIfNeeded()
                                }
                            }
                        }

                        HStack {
                            Button("Apply Schedule") {
                                viewModel.applySchedule()
                            }
                            .buttonStyle(.borderedProminent)

                            Button("Run Now") {
                                Task { await viewModel.runNow() }
                            }
                            .disabled(viewModel.isRunning)

                            if viewModel.preset != .off {
                                Button("Stop") {
                                    viewModel.stopSchedule()
                                }
                                .foregroundStyle(.red)
                            }
                        }

                        // Schedule status
                        if viewModel.scheduler.isScheduled {
                            HStack {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundStyle(.green)
                                Text("Schedule active")
                                    .foregroundStyle(.green)
                            }
                            .font(.caption)
                        }

                        if let nextFire = viewModel.scheduler.nextFireDate {
                            HStack {
                                Image(systemName: "clock")
                                Text("Next run: \(nextFire.formatted(date: .abbreviated, time: .shortened))")
                            }
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        }
                    }
                }

                // Preferences
                GroupBox("Preferences") {
                    Toggle("Sound notifications", isOn: $viewModel.soundEnabled)
                        .onChange(of: viewModel.soundEnabled) { _, _ in
                            viewModel.saveConfig()
                        }
                }

                // Status
                GroupBox("Status") {
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Circle()
                                .fill(statusColor)
                                .frame(width: 8, height: 8)
                            Text(viewModel.statusMessage)
                                .foregroundStyle(viewModel.isError ? .red : .primary)
                        }

                        if let lastRun = viewModel.lastRunTime {
                            Text("Last run: \(lastRun.formatted(date: .abbreviated, time: .shortened))")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
            .padding()
        }
    }

    private var statusColor: Color {
        if viewModel.isRunning { return .orange }
        if viewModel.isError { return .red }
        if viewModel.scheduler.isScheduled { return .green }
        return .secondary
    }
}
