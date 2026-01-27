import SwiftUI

struct ScheduleSection: View {
    @ObservedObject var viewModel: AppViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Schedule")
                .font(.headline)

            // Preset pills
            HStack(spacing: 6) {
                ForEach(SchedulePreset.allCases) { preset in
                    PresetPill(
                        preset: preset,
                        isSelected: viewModel.preset == preset
                    ) {
                        viewModel.preset = preset
                        viewModel.presetChanged()
                    }
                }
            }

            // Custom time inputs
            if viewModel.preset == .custom {
                HStack(spacing: 12) {
                    HStack(spacing: 4) {
                        Text("Hour")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        Stepper(
                            value: $viewModel.hour,
                            in: 0...23
                        ) {
                            Text(String(format: "%02d", viewModel.hour))
                                .monospacedDigit()
                                .frame(width: 24)
                        }
                        .controlSize(.small)
                    }

                    HStack(spacing: 4) {
                        Text("Min")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        Stepper(
                            value: $viewModel.minute,
                            in: 0...59
                        ) {
                            Text(String(format: "%02d", viewModel.minute))
                                .monospacedDigit()
                                .frame(width: 24)
                        }
                        .controlSize(.small)
                    }
                }
            }

            // Action buttons
            HStack(spacing: 8) {
                Button("Apply") {
                    viewModel.applySchedule()
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.small)

                Button("Stop") {
                    viewModel.stopSchedule()
                }
                .buttonStyle(.bordered)
                .controlSize(.small)

                Button("Run Now") {
                    Task { await viewModel.runNow() }
                }
                .buttonStyle(.bordered)
                .controlSize(.small)
                .disabled(viewModel.isRunning)
            }
        }
    }
}

private struct PresetPill: View {
    let preset: SchedulePreset
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(preset.displayLabel)
                .font(.caption)
                .fontWeight(isSelected ? .semibold : .regular)
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background(
                    RoundedRectangle(cornerRadius: 14)
                        .fill(isSelected ? Color.accentColor : Color.clear)
                )
                .foregroundStyle(isSelected ? .white : .primary)
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(
                            isSelected ? Color.clear : Color.secondary.opacity(0.3),
                            lineWidth: 1
                        )
                )
        }
        .buttonStyle(.plain)
    }
}
