import SwiftUI

struct TicketDetailView: View {
    @StateObject private var detailVM: TicketDetailViewModel
    let onBack: () -> Void

    init(ticket: Ticket, appUrl: String, onBack: @escaping () -> Void) {
        _detailVM = StateObject(wrappedValue: TicketDetailViewModel(
            ticket: ticket, appUrl: appUrl
        ))
        self.onBack = onBack
    }

    var body: some View {
        VStack(spacing: 0) {
            header
            Theme.divider.frame(height: 0.5)
            ScrollView {
                VStack(spacing: 10) {
                    summaryCard
                    infoCard
                    transitionCard
                    commentCard
                    commentsListCard
                }
                .padding(16)
            }
            statusBar
        }
        .task {
            await detailVM.loadComments()
            await detailVM.loadTransitions()
        }
    }

    // MARK: - Header

    private var header: some View {
        HStack(spacing: 8) {
            Button(action: onBack) {
                HStack(spacing: 4) {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 11, weight: .semibold))
                    Text("Back")
                        .font(.system(size: 12, weight: .medium))
                }
                .foregroundStyle(Theme.accent)
            }
            .buttonStyle(.plain)

            Text(detailVM.ticket.key)
                .font(.system(size: 14, weight: .bold))
                .foregroundStyle(Theme.textPrimary)

            Spacer()

            if let url = URL(string: detailVM.ticket.jiraUrl) {
                Link(destination: url) {
                    HStack(spacing: 3) {
                        Text("Jira")
                            .font(.system(size: 11, weight: .medium))
                        Image(systemName: "arrow.up.right")
                            .font(.system(size: 9))
                    }
                    .foregroundStyle(Theme.accent)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Capsule().fill(Theme.selectedBg))
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }

    // MARK: - Summary

    private var summaryCard: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(detailVM.ticket.summary)
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(Theme.textPrimary)
                .fixedSize(horizontal: false, vertical: true)

            HStack(spacing: 6) {
                statusDot
                Text(detailVM.ticket.status)
                    .font(.system(size: 10, weight: .medium))
                    .foregroundStyle(Theme.textSecondary)
                Text("·")
                    .foregroundStyle(Theme.textTertiary)
                Text(detailVM.ticket.assignee)
                    .font(.system(size: 10))
                    .foregroundStyle(Theme.textTertiary)
            }
        }
        .cardStyle()
    }

    // MARK: - Info

    private var infoCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 6) {
                Image(systemName: "info.circle")
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.accent)
                Text("Details")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(Theme.textPrimary)
            }

            VStack(spacing: 6) {
                detailRow("Type", detailVM.ticket.issueType)
                detailRow("Created", formatDate(detailVM.ticket.created))
                if let due = detailVM.ticket.dueDate {
                    detailRow("Due", formatDate(due))
                }
                detailRow("WL Type", "\(detailVM.ticket.wlMainTicketType) > \(detailVM.ticket.wlSubTicketType)")
                detailRow("Customer", detailVM.ticket.customerLevel)
                if detailVM.ticket.savedStatus != "--" {
                    detailRow("Saved", detailVM.ticket.savedStatus)
                }
                if detailVM.ticket.savedAction != "--" {
                    detailRow("Action", detailVM.ticket.savedAction)
                }
            }
        }
        .cardStyle()
    }

    // MARK: - Transitions

    private var transitionCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 6) {
                Image(systemName: "arrow.triangle.swap")
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.accent)
                Text("Move Status")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(Theme.textPrimary)
            }

            if detailVM.isLoadingTransitions {
                HStack {
                    ProgressView().controlSize(.mini)
                    Text("Loading transitions...")
                        .font(.system(size: 10))
                        .foregroundStyle(Theme.textTertiary)
                }
            } else if detailVM.transitions.isEmpty {
                Text("No transitions available")
                    .font(.system(size: 10))
                    .foregroundStyle(Theme.textTertiary)
            } else {
                FlowLayout(spacing: 6) {
                    ForEach(detailVM.transitions) { transition in
                        Button {
                            Task { await detailVM.transition(to: transition) }
                        } label: {
                            Text(transition.name)
                                .font(.system(size: 10, weight: .medium))
                                .foregroundStyle(Theme.accent)
                                .padding(.horizontal, 10)
                                .padding(.vertical, 5)
                                .background(
                                    Capsule().fill(Theme.selectedBg)
                                )
                                .overlay(
                                    Capsule().stroke(Theme.accent.opacity(0.3), lineWidth: 0.5)
                                )
                        }
                        .buttonStyle(.plain)
                        .disabled(detailVM.isTransitioning)
                    }
                }
            }
        }
        .cardStyle()
    }

    // MARK: - Quick Comment

    private var commentCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 6) {
                Image(systemName: "text.bubble")
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.accent)
                Text("Quick Comment")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(Theme.textPrimary)
            }

            TextEditor(text: $detailVM.commentText)
                .font(.system(size: 11))
                .foregroundStyle(Theme.textPrimary)
                .scrollContentBackground(.hidden)
                .frame(height: 50)
                .padding(8)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Theme.bg)
                )

            HStack {
                Spacer()
                Button {
                    Task { await detailVM.postComment() }
                } label: {
                    HStack(spacing: 4) {
                        if detailVM.isPostingComment {
                            ProgressView().controlSize(.mini)
                        } else {
                            Image(systemName: "paperplane.fill")
                                .font(.system(size: 9))
                        }
                        Text("Send")
                            .font(.system(size: 11, weight: .medium))
                    }
                    .foregroundStyle(Theme.bg)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 5)
                    .background(Capsule().fill(Theme.accent))
                }
                .buttonStyle(.plain)
                .disabled(detailVM.isPostingComment || detailVM.commentText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
        }
        .cardStyle()
    }

    // MARK: - Comments List

    private var commentsListCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 6) {
                Image(systemName: "bubble.left.and.bubble.right")
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.accent)
                Text("Comments")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(Theme.textPrimary)
                if !detailVM.comments.isEmpty {
                    Text("\(detailVM.comments.count)")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundStyle(Theme.bg)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 1)
                        .background(Capsule().fill(Theme.accent))
                }
                Spacer()
                Button {
                    Task { await detailVM.loadComments() }
                } label: {
                    Image(systemName: "arrow.clockwise")
                        .font(.system(size: 10))
                        .foregroundStyle(Theme.textSecondary)
                }
                .buttonStyle(.plain)
                .disabled(detailVM.isLoadingComments)
            }

            if detailVM.isLoadingComments && detailVM.comments.isEmpty {
                HStack {
                    Spacer()
                    ProgressView().controlSize(.small)
                    Spacer()
                }
                .padding(.vertical, 10)
            } else if detailVM.comments.isEmpty {
                Text("No comments yet")
                    .font(.system(size: 10))
                    .foregroundStyle(Theme.textTertiary)
                    .padding(.vertical, 6)
            } else {
                VStack(spacing: 8) {
                    ForEach(detailVM.comments) { comment in
                        VStack(alignment: .leading, spacing: 4) {
                            HStack {
                                Text(comment.author)
                                    .font(.system(size: 10, weight: .semibold))
                                    .foregroundStyle(Theme.textPrimary)
                                Spacer()
                                Text(formatDate(comment.created))
                                    .font(.system(size: 9))
                                    .foregroundStyle(Theme.textTertiary)
                            }
                            Text(comment.text)
                                .font(.system(size: 10))
                                .foregroundStyle(Theme.textSecondary)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                        .padding(10)
                        .background(
                            RoundedRectangle(cornerRadius: 8)
                                .fill(Theme.bg)
                        )
                    }
                }
            }
        }
        .cardStyle()
    }

    // MARK: - Status Bar

    private var statusBar: some View {
        Group {
            if let message = detailVM.statusMessage {
                Theme.divider.frame(height: 0.5)
                HStack(spacing: 6) {
                    if detailVM.isTransitioning || detailVM.isPostingComment {
                        ProgressView().controlSize(.mini)
                    }
                    Text(message)
                        .font(.system(size: 10))
                        .foregroundStyle(detailVM.isError ? Theme.accentRed : Theme.accent)
                    Spacer()
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 6)
            }
        }
    }

    // MARK: - Helpers

    private var statusDot: some View {
        let s = detailVM.ticket.status.lowercased()
        let color: Color = {
            if s.contains("pending") { return .orange }
            if s.contains("processing") { return Theme.accent }
            if s.contains("done") || s.contains("resolved") { return .green }
            if s.contains("blocked") || s.contains("rejected") { return Theme.accentRed }
            return Theme.textTertiary
        }()
        return Circle().fill(color).frame(width: 6, height: 6)
    }

    private func detailRow(_ label: String, _ value: String) -> some View {
        HStack {
            Text(label)
                .font(.system(size: 10))
                .foregroundStyle(Theme.textTertiary)
                .frame(width: 65, alignment: .leading)
            Text(value)
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(Theme.textSecondary)
            Spacer()
        }
    }

    private func formatDate(_ isoString: String) -> String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        guard let date = formatter.date(from: isoString) else {
            // Try without fractional seconds
            formatter.formatOptions = [.withInternetDateTime]
            guard let date = formatter.date(from: isoString) else {
                return isoString
            }
            return RelativeDateTimeFormatter().localizedString(for: date, relativeTo: Date())
        }
        return RelativeDateTimeFormatter().localizedString(for: date, relativeTo: Date())
    }
}

// MARK: - Flow Layout (for transition buttons wrapping)

struct FlowLayout: Layout {
    var spacing: CGFloat = 6

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = layout(proposal: proposal, subviews: subviews)
        return result.size
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = layout(proposal: proposal, subviews: subviews)
        for (index, subview) in subviews.enumerated() {
            subview.place(at: CGPoint(
                x: bounds.minX + result.positions[index].x,
                y: bounds.minY + result.positions[index].y
            ), proposal: .unspecified)
        }
    }

    private func layout(proposal: ProposedViewSize, subviews: Subviews) -> (size: CGSize, positions: [CGPoint]) {
        let maxWidth = proposal.width ?? .infinity
        var positions: [CGPoint] = []
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0
        var totalHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > maxWidth, x > 0 {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            positions.append(CGPoint(x: x, y: y))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
            totalHeight = y + rowHeight
        }

        return (CGSize(width: maxWidth, height: totalHeight), positions)
    }
}
