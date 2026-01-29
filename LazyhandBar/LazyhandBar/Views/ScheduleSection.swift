import SwiftUI

struct ScheduleSection: View {
    @ObservedObject var viewModel: AppViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            // Section header
            HStack(spacing: 6) {
                Image(systemName: "clock")
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.accent)
                Text("Schedule")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(Theme.textPrimary)
            }

            // Presets
            HStack(spacing: 6) {
                ForEach(SchedulePreset.allCases) { preset in
                    PresetChip(
                        label: preset.displayLabel,
                        isSelected: viewModel.preset == preset
                    ) {
                        viewModel.preset = preset
                        viewModel.presetChanged()
                    }
                }
            }

            // Custom time
            if viewModel.preset == .custom {
                HStack(spacing: 8) {
                    Text("Time")
                        .font(.system(size: 10))
                        .foregroundStyle(Theme.textTertiary)
                    Stepper(value: $viewModel.hour, in: 0...23) {
                        Text(String(format: "%02d", viewModel.hour))
                            .monospacedDigit()
                            .font(.system(size: 12, weight: .medium))
                            .foregroundStyle(Theme.textPrimary)
                    }
                    .controlSize(.small)

                    Text(":")
                        .foregroundStyle(Theme.textTertiary)

                    Stepper(value: $viewModel.minute, in: 0...59) {
                        Text(String(format: "%02d", viewModel.minute))
                            .monospacedDigit()
                            .font(.system(size: 12, weight: .medium))
                            .foregroundStyle(Theme.textPrimary)
                    }
                    .controlSize(.small)
                }
            }

            // Actions
            HStack(spacing: 8) {
                Button {
                    viewModel.applySchedule()
                } label: {
                    Text("Apply")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundStyle(Theme.bg)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 5)
                        .background(Capsule().fill(Theme.accent))
                }
                .buttonStyle(.plain)

                Button {
                    viewModel.stopSchedule()
                } label: {
                    Text("Stop")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundStyle(Theme.textSecondary)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 5)
                        .background(Capsule().stroke(Theme.divider))
                }
                .buttonStyle(.plain)

                Spacer()

                Button {
                    Task { await viewModel.runNow() }
                } label: {
                    HStack(spacing: 4) {
                        Image(systemName: "play.fill")
                            .font(.system(size: 8))
                        Text("Run")
                            .font(.system(size: 11, weight: .medium))
                    }
                    .foregroundStyle(Theme.accent)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 5)
                    .background(Capsule().fill(Theme.selectedBg))
                }
                .buttonStyle(.plain)
                .disabled(viewModel.isRunning)
            }
        }
        .cardStyle()
        .animation(.easeInOut(duration: 0.2), value: viewModel.preset)
    }
}

// MARK: - Preset Chip

private struct PresetChip: View {
    let label: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.system(size: 11, weight: isSelected ? .semibold : .regular))
                .foregroundStyle(isSelected ? Theme.accent : Theme.textSecondary)
                .padding(.horizontal, 12)
                .padding(.vertical, 5)
                .background(
                    Capsule()
                        .fill(isSelected ? Theme.selectedBg : Color.clear)
                )
                .overlay(
                    Capsule()
                        .stroke(isSelected ? Theme.accent.opacity(0.4) : Theme.divider, lineWidth: 0.5)
                )
        }
        .buttonStyle(.plain)
    }
}
