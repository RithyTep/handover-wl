import SwiftUI

struct StatusBar: View {
    @ObservedObject var viewModel: AppViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 6) {
                Circle()
                    .fill(statusColor)
                    .frame(width: 8, height: 8)
                Text(viewModel.statusMessage)
                    .font(.caption)
                    .lineLimit(2)
                    .foregroundStyle(viewModel.isError ? .red : .primary)
            }

            if let nextFire = viewModel.scheduler.nextFireDate {
                Text("Next: \(nextFire, style: .relative)")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }

            if let lastRun = viewModel.lastRunTime {
                Text("Last run: \(lastRun, style: .relative)")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
        }
    }

    private var statusColor: Color {
        if viewModel.isRunning { return .orange }
        if viewModel.isError { return .red }
        if viewModel.scheduler.isScheduled { return .green }
        return .gray
    }
}
