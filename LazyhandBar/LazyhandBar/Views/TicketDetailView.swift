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
            // Run concurrently — transitions are instant from cache
            async let c: Void = detailVM.loadComments()
            async let t: Void = detailVM.loadTransitions()
            _ = await (c, t)
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
            SectionHeader(icon: "info.circle", title: "Details")

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

    // MARK: - Transitions (Dropdown)

    private var transitionCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionHeader(icon: "arrow.triangle.swap", title: "Move Status")

            if detailVM.isLoadingTransitions {
                HStack {
                    ProgressView().controlSize(.mini)
                    Text("Loading...")
                        .font(.system(size: 10))
                        .foregroundStyle(Theme.textTertiary)
                }
            } else if detailVM.isTransitioning {
                HStack {
                    ProgressView().controlSize(.mini)
                    Text(detailVM.statusMessage ?? "Transitioning...")
                        .font(.system(size: 10))
                        .foregroundStyle(Theme.accent)
                }
            } else if detailVM.transitions.isEmpty {
                Text("No transitions available")
                    .font(.system(size: 10))
                    .foregroundStyle(Theme.textTertiary)
            } else {
                Menu {
                    ForEach(detailVM.transitions) { transition in
                        Button(transition.statusName ?? transition.name) {
                            Task { await detailVM.transition(to: transition) }
                        }
                    }
                } label: {
                    HStack(spacing: 6) {
                        statusDot
                        Text(detailVM.ticket.status)
                            .font(.system(size: 11, weight: .medium))
                            .foregroundStyle(Theme.textPrimary)
                        Spacer()
                        Image(systemName: "chevron.up.chevron.down")
                            .font(.system(size: 9))
                            .foregroundStyle(Theme.textTertiary)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Theme.cardBg.opacity(0.5))
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Theme.divider, lineWidth: 0.5)
                    )
                }
                .menuStyle(.borderlessButton)
            }
        }
        .cardStyle()
    }

    // MARK: - Quick Comment

    private var commentCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionHeader(icon: "text.bubble", title: "Quick Comment")

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

            // Image preview
            if let image = detailVM.attachedImage {
                HStack(spacing: 8) {
                    Image(nsImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(maxHeight: 60)
                        .clipShape(RoundedRectangle(cornerRadius: 6))
                        .overlay(
                            RoundedRectangle(cornerRadius: 6)
                                .stroke(Theme.divider, lineWidth: 0.5)
                        )

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Image attached")
                            .font(.system(size: 9, weight: .medium))
                            .foregroundStyle(Theme.textSecondary)
                        Button {
                            detailVM.removeImage()
                        } label: {
                            Text("Remove")
                                .font(.system(size: 9))
                                .foregroundStyle(Theme.accentRed)
                        }
                        .buttonStyle(.plain)
                    }

                    Spacer()
                }
                .padding(8)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Theme.bg)
                )
            }

            // Action buttons
            HStack(spacing: 8) {
                // Attach image
                Button { detailVM.attachImage() } label: {
                    Image(systemName: "paperclip")
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.textSecondary)
                }
                .buttonStyle(.plain)
                .help("Attach image file")

                // Paste from clipboard
                Button { detailVM.pasteImage() } label: {
                    Image(systemName: "doc.on.clipboard")
                        .font(.system(size: 11))
                        .foregroundStyle(Theme.textSecondary)
                }
                .buttonStyle(.plain)
                .help("Paste image from clipboard")

                Spacer()

                // Send
                Button {
                    Task { await detailVM.postComment() }
                } label: {
                    HStack(spacing: 4) {
                        if detailVM.isPostingComment || detailVM.isUploadingImage {
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
                .disabled(detailVM.isPostingComment || detailVM.isUploadingImage || (!hasContent))
            }
        }
        .cardStyle()
    }

    private var hasContent: Bool {
        !detailVM.commentText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            || detailVM.attachedImage != nil
    }

    // MARK: - Comments List

    private var commentsListCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 6) {
                SectionHeader(icon: "bubble.left.and.bubble.right", title: "Comments")
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
                        commentBubble(comment)
                    }
                }
            }
        }
        .cardStyle()
    }

    private func commentBubble(_ comment: TicketComment) -> some View {
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

            if !comment.text.isEmpty {
                Text(comment.text)
                    .font(.system(size: 10))
                    .foregroundStyle(Theme.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            // Inline images from Jira comment
            if let images = comment.images, !images.isEmpty {
                VStack(spacing: 6) {
                    ForEach(images, id: \.self) { imagePath in
                        let fullUrl = detailVM.appUrl + imagePath
                        if let url = URL(string: fullUrl) {
                            AsyncImage(url: url) { phase in
                                switch phase {
                                case .success(let image):
                                    image
                                        .resizable()
                                        .aspectRatio(contentMode: .fit)
                                        .frame(maxHeight: 200)
                                        .clipShape(RoundedRectangle(cornerRadius: 6))
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 6)
                                                .stroke(Theme.divider, lineWidth: 0.5)
                                        )
                                case .failure:
                                    HStack(spacing: 4) {
                                        Image(systemName: "photo.badge.exclamationmark")
                                            .font(.system(size: 10))
                                        Text("Failed to load image")
                                            .font(.system(size: 9))
                                    }
                                    .foregroundStyle(Theme.textTertiary)
                                    .padding(6)
                                case .empty:
                                    RoundedRectangle(cornerRadius: 6)
                                        .fill(Theme.bg.opacity(0.5))
                                        .frame(height: 80)
                                        .overlay(ProgressView().controlSize(.small))
                                @unknown default:
                                    EmptyView()
                                }
                            }
                        }
                    }
                }
                .padding(.top, 4)
            }
        }
        .padding(10)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Theme.bg)
        )
        .overlay(alignment: .leading) {
            RoundedRectangle(cornerRadius: 1)
                .fill(Theme.accent.opacity(0.3))
                .frame(width: 2)
        }
    }

    // MARK: - Status Bar

    private var statusBar: some View {
        Group {
            if let message = detailVM.statusMessage {
                Theme.divider.frame(height: 0.5)
                HStack(spacing: 6) {
                    if detailVM.isTransitioning || detailVM.isPostingComment || detailVM.isUploadingImage {
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
            formatter.formatOptions = [.withInternetDateTime]
            guard let date = formatter.date(from: isoString) else {
                return isoString
            }
            return RelativeDateTimeFormatter().localizedString(for: date, relativeTo: Date())
        }
        return RelativeDateTimeFormatter().localizedString(for: date, relativeTo: Date())
    }
}
