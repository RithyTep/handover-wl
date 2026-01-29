import SwiftUI

struct TicketRowView: View {
    let ticket: Ticket
    let onTap: () -> Void
    @State private var isHovered = false

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 6) {
                // Top: key + status chip + assignee
                HStack(spacing: 8) {
                    Text(ticket.key)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(Theme.accent)

                    HStack(spacing: 4) {
                        Circle()
                            .fill(statusColor)
                            .frame(width: 6, height: 6)
                        Text(ticket.status)
                            .font(.system(size: 10))
                            .foregroundStyle(Theme.textSecondary)
                    }
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(
                        Capsule().fill(statusColor.opacity(0.12))
                    )

                    Spacer()

                    Text(ticket.assignee)
                        .font(.system(size: 10))
                        .foregroundStyle(Theme.textTertiary)
                        .lineLimit(1)
                }

                // Summary
                Text(ticket.summary)
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.textSecondary)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)

                // Bottom: type + saved status
                HStack(spacing: 6) {
                    Text(ticket.issueType)
                        .font(.system(size: 9, weight: .medium))
                        .foregroundStyle(Theme.textTertiary)

                    Spacer()

                    if ticket.savedStatus != "--" && !ticket.savedStatus.isEmpty {
                        Text(ticket.savedStatus)
                            .font(.system(size: 9, weight: .medium))
                            .foregroundStyle(Theme.accent)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(
                                Capsule().fill(Theme.selectedBg)
                            )
                    }

                    Image(systemName: "chevron.right")
                        .font(.system(size: 8))
                        .foregroundStyle(Theme.textTertiary)
                        .opacity(isHovered ? 1 : 0)
                }
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 10)
                    .fill(isHovered ? Theme.cardBgHover : Theme.cardBg)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Theme.divider.opacity(0.2), lineWidth: 0.5)
            )
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .onHover { hovering in
            withAnimation(.easeInOut(duration: 0.15)) {
                isHovered = hovering
            }
        }
    }

    private var statusColor: Color {
        let s = ticket.status.lowercased()
        if s.contains("pending") { return .orange }
        if s.contains("processing") { return Theme.accent }
        if s.contains("done") || s.contains("resolved") { return .green }
        if s.contains("blocked") || s.contains("rejected") { return Theme.accentRed }
        return Theme.textTertiary
    }
}
