import SwiftUI

struct TicketRowView: View {
    let ticket: Ticket
    let onTap: () -> Void
    var canQuickMove: Bool = false
    var onQuickMove: (() -> Void)? = nil
    var onSetDueDate: (() -> Void)? = nil
    var isSelected: Bool = false
    @State private var isHovered = false

    var body: some View {
        VStack(alignment: .leading, spacing: 3) {
            // Line 1: key + status + actions + avatar
            HStack(spacing: 6) {
                Text(ticket.key)
                    .font(.system(size: 14, weight: .bold, design: .monospaced))
                    .foregroundStyle(Theme.accent)

                Circle()
                    .fill(statusColor)
                    .frame(width: 6, height: 6)

                Text(ticket.status)
                    .font(.system(size: 12))
                    .foregroundStyle(Theme.textSecondary)
                    .lineLimit(1)

                if ticket.savedStatus != "--" && !ticket.savedStatus.isEmpty {
                    Text("·")
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.textTertiary)
                    Text(ticket.savedStatus)
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.accent)
                        .lineLimit(1)
                }

                Spacer()

                // Quick actions (hover only)
                if isHovered {
                    if canQuickMove {
                        Button {
                            onQuickMove?()
                        } label: {
                            Text("→WL-P")
                                .font(.system(size: 10, weight: .bold, design: .monospaced))
                                .foregroundStyle(Theme.bg)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 3)
                                .background(Capsule().fill(Theme.accent))
                        }
                        .buttonStyle(ScalePressStyle())
                        .pointerCursor()
                        .help("Move to WL - Processing")
                        .transition(.opacity)
                    }

                    if ticket.dueDate == nil {
                        Button {
                            onSetDueDate?()
                        } label: {
                            Text("+Due")
                                .font(.system(size: 10, weight: .bold, design: .monospaced))
                                .foregroundStyle(Theme.bg)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 3)
                                .background(Capsule().fill(Theme.accentRed))
                        }
                        .buttonStyle(ScalePressStyle())
                        .pointerCursor()
                        .help("Set due date to tomorrow")
                        .transition(.opacity)
                    }
                } else if ticket.dueDate == nil {
                    Circle()
                        .fill(Theme.accentRed)
                        .frame(width: 6, height: 6)
                        .help("No due date")
                }

                avatarView
            }

            // Line 2: summary
            Text(ticket.summary)
                .font(.system(size: 13))
                .foregroundStyle(Theme.textPrimary.opacity(0.75))
                .lineLimit(1)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(isSelected ? Theme.selectedBg : (isHovered ? Theme.cardBgHover.opacity(0.5) : Color.clear))
        .contentShape(Rectangle())
        .onTapGesture(perform: onTap)
        .pointerCursor()
        .help(ticket.summary)
        .onHover { hovering in
            withAnimation(.easeInOut(duration: 0.15)) {
                isHovered = hovering
            }
        }
    }

    // MARK: - Avatar

    @ViewBuilder
    private var avatarView: some View {
        if let avatarUrlStr = ticket.assigneeAvatar,
           let url = URL(string: avatarUrlStr) {
            AsyncImage(url: url) { phase in
                switch phase {
                case .success(let image):
                    image.resizable().aspectRatio(contentMode: .fill)
                default:
                    avatarFallback
                }
            }
            .frame(width: 22, height: 22)
            .clipShape(Circle())
        } else {
            avatarFallback
        }
    }

    private var avatarFallback: some View {
        Text(String(ticket.assignee.prefix(1)).uppercased())
            .font(.system(size: 10, weight: .bold))
            .foregroundStyle(Theme.textPrimary)
            .frame(width: 22, height: 22)
            .background(Circle().fill(Theme.accent.opacity(0.25)))
    }

    // MARK: - Helpers

    private var statusColor: Color {
        let s = ticket.status.lowercased()
        if s.contains("pending") { return .orange }
        if s.contains("processing") { return Theme.accent }
        if s.contains("done") || s.contains("resolved") { return .green }
        if s.contains("blocked") || s.contains("rejected") { return Theme.accentRed }
        return Theme.textTertiary
    }
}
