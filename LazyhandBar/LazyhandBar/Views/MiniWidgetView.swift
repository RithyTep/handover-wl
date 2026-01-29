import SwiftUI

struct MiniWidgetView: View {
    let ticketCount: Int
    let latestTicketKey: String?
    let isPolling: Bool

    var body: some View {
        HStack(spacing: 10) {
            // Pulse dot
            Circle()
                .fill(isPolling ? Theme.accent : Theme.textTertiary)
                .frame(width: 8, height: 8)
                .shadow(color: isPolling ? Theme.accent.opacity(0.6) : .clear, radius: 4)

            // Ticket count
            HStack(spacing: 4) {
                Image(systemName: "ticket.fill")
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.accent)
                Text("\(ticketCount)")
                    .font(.system(size: 13, weight: .bold))
                    .monospacedDigit()
                    .foregroundStyle(Theme.textPrimary)
            }

            // Divider
            RoundedRectangle(cornerRadius: 1)
                .fill(Theme.divider)
                .frame(width: 1, height: 20)

            // Latest ticket
            if let key = latestTicketKey {
                Text(key)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundStyle(Theme.accent)
                    .lineLimit(1)
            } else {
                Text("No tickets")
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.textTertiary)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(
            Capsule()
                .fill(Theme.bg)
                .shadow(color: .black.opacity(0.4), radius: 12, y: 4)
        )
        .overlay(
            Capsule()
                .stroke(Theme.divider, lineWidth: 0.5)
        )
    }
}
