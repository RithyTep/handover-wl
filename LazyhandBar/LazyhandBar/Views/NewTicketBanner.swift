import SwiftUI

struct NewTicketBanner: View {
    let tickets: [Ticket]

    private var displayTicket: Ticket? { tickets.first }
    private var extraCount: Int { max(0, tickets.count - 1) }

    var body: some View {
        HStack(spacing: 12) {
            // Icon
            Image(systemName: "ticket.fill")
                .font(.system(size: 20))
                .foregroundStyle(Theme.accent)
                .frame(width: 40, height: 40)
                .background(
                    RoundedRectangle(cornerRadius: 10)
                        .fill(Theme.selectedBg)
                )

            VStack(alignment: .leading, spacing: 3) {
                HStack(spacing: 4) {
                    Text("New Ticket")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundStyle(Theme.textPrimary)

                    if extraCount > 0 {
                        Text("+\(extraCount) more")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundStyle(Theme.textSecondary)
                    }
                }

                if let ticket = displayTicket {
                    Text(ticket.key)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(Theme.accent)

                    Text(ticket.summary)
                        .font(.system(size: 10))
                        .foregroundStyle(Theme.textSecondary)
                        .lineLimit(1)
                }
            }

            Spacer(minLength: 0)
        }
        .padding(14)
        .frame(width: 340, height: 100)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Theme.bg)
                .shadow(color: .black.opacity(0.3), radius: 16, y: 6)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(Theme.divider, lineWidth: 0.5)
        )
    }
}
