import SwiftUI

struct TicketRowView: View {
    let ticket: Ticket
    let onTap: () -> Void

    var body: some View {
        HStack(spacing: 10) {
            // Status indicator
            Circle()
                .fill(statusColor)
                .frame(width: 8, height: 8)

            VStack(alignment: .leading, spacing: 2) {
                // Key + Status
                HStack(spacing: 6) {
                    Text(ticket.key)
                        .font(.system(.caption, design: .monospaced).bold())
                        .foregroundStyle(.tint)

                    Text(ticket.status)
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }

                // Summary
                Text(ticket.summary)
                    .font(.subheadline)
                    .lineLimit(1)
                    .foregroundStyle(.primary)
            }

            Spacer()

            // Avatar
            avatarView
        }
        .padding(.vertical, 4)
        .contentShape(Rectangle())
        .onTapGesture(perform: onTap)
    }

    @ViewBuilder
    private var avatarView: some View {
        if let avatarUrlStr = ticket.assigneeAvatar,
           let url = URL(string: avatarUrlStr) {
            AsyncImage(url: url) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                avatarFallback
            }
            .frame(width: 24, height: 24)
            .clipShape(Circle())
        } else {
            avatarFallback
        }
    }

    private var avatarFallback: some View {
        Text(String(ticket.assignee.prefix(1)).uppercased())
            .font(.caption2.bold())
            .frame(width: 24, height: 24)
            .background(Circle().fill(.quaternary))
    }

    private var statusColor: Color {
        let s = ticket.status.lowercased()
        if s.contains("pending") { return .orange }
        if s.contains("processing") { return .blue }
        if s.contains("done") || s.contains("resolved") { return .green }
        if s.contains("blocked") || s.contains("rejected") { return .red }
        return .secondary
    }
}
