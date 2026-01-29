import SwiftUI

struct StatusSection: View {
    @ObservedObject var viewModel: AppViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionHeader(icon: "info.circle", title: "Status")

            // Status row
            HStack(spacing: 8) {
                Circle()
                    .fill(statusColor)
                    .frame(width: 8, height: 8)

                Text(viewModel.statusMessage)
                    .font(.system(size: 11))
                    .foregroundStyle(viewModel.isError
                        ? Theme.accentRed
                        : Theme.textPrimary)
                    .lineLimit(2)
            }

            // Schedule info
            if viewModel.scheduler.isScheduled || viewModel.lastRunTime != nil {
                Theme.divider.frame(height: 0.5)

                VStack(alignment: .leading, spacing: 4) {
                    if let nextFire = viewModel.scheduler.nextFireDate {
                        InfoRow(icon: "calendar.badge.clock", label: "Next") {
                            Text(nextFire, style: .relative)
                        }
                    }
                    if let lastRun = viewModel.lastRunTime {
                        InfoRow(icon: "checkmark.circle", label: "Last") {
                            Text(lastRun, style: .relative)
                        }
                    }
                }
            }
        }
        .cardStyle()
    }

    private var statusColor: Color {
        if viewModel.isRunning { return .orange }
        if viewModel.isError { return Theme.accentRed }
        if viewModel.scheduler.isScheduled { return Theme.accent }
        return Theme.textTertiary
    }
}

private struct InfoRow<Content: View>: View {
    let icon: String
    let label: String
    let content: Content

    init(icon: String, label: String, @ViewBuilder content: () -> Content) {
        self.icon = icon
        self.label = label
        self.content = content()
    }

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 9))
                .foregroundStyle(Theme.textTertiary)
            Text(label)
                .font(.system(size: 10))
                .foregroundStyle(Theme.textTertiary)
            content
                .font(.system(size: 10))
                .foregroundStyle(Theme.textSecondary)
        }
    }
}
