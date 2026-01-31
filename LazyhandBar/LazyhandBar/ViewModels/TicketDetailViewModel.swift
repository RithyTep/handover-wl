import Foundation
import AppKit

@MainActor
final class TicketDetailViewModel: ObservableObject {
    let ticket: Ticket
    let appUrl: String

    @Published var comments: [TicketComment] = []
    @Published var transitions: [TicketTransition] = []
    @Published var isLoadingComments = false
    @Published var isLoadingTransitions = false
    @Published var isPostingComment = false
    @Published var isTransitioning = false
    @Published var isUploadingImage = false
    @Published var commentText: String = "To Ticket\nChecking.."
    @Published var attachedImage: NSImage?
    @Published var statusMessage: String?
    @Published var isError = false

    // Cache transitions forever — Jira workflows rarely change
    private static var transitionCache: [String: [TicketTransition]] = [:]
    // Cache comments briefly — preloaded for instant detail view
    private static var commentsCache: [String: (comments: [TicketComment], fetchedAt: Date)] = [:]
    private static let commentsCacheMaxAge: TimeInterval = 60 // 1 minute

    private let apiService = TicketAPIService()

    init(ticket: Ticket, appUrl: String) {
        self.ticket = ticket
        self.appUrl = appUrl
        // Pre-populate from cache so data shows instantly
        if let cached = Self.transitionCache[ticket.key] {
            self.transitions = cached
        }
        if let cached = Self.commentsCache[ticket.key],
           Date().timeIntervalSince(cached.fetchedAt) < Self.commentsCacheMaxAge {
            self.comments = cached.comments
        }
    }

    private var config: AppConfig {
        AppConfig(
            appUrl: appUrl, token: "", channelId: "",
            mentions: "", preset: "day", hour: "17", minute: "16",
            soundEnabled: "true", selectedSound: "Tink",
            widgetEnabled: "false", pollingInterval: "30"
        )
    }

    // MARK: - Preloading (called from TicketListViewModel)

    static func preload(tickets: [Ticket], appUrl: String) {
        let service = TicketAPIService()
        let config = AppConfig(
            appUrl: appUrl, token: "", channelId: "",
            mentions: "", preset: "day", hour: "17", minute: "16",
            soundEnabled: "true", selectedSound: "Tink",
            widgetEnabled: "false", pollingInterval: "30"
        )

        // Preload transitions for ALL tickets (cached forever)
        for ticket in tickets where transitionCache[ticket.key] == nil {
            Task {
                if let response = try? await service.fetchTransitions(
                    ticketKey: ticket.key, config: config
                ) {
                    transitionCache[ticket.key] = response.transitions
                }
            }
        }

        // Preload comments for first 5 tickets
        for ticket in tickets.prefix(5) {
            let existing = commentsCache[ticket.key]
            let isStale = existing == nil
                || Date().timeIntervalSince(existing!.fetchedAt) > commentsCacheMaxAge
            guard isStale else { continue }

            Task {
                if let response = try? await service.fetchComments(
                    ticketKey: ticket.key, config: config
                ) {
                    let reversed = Array(response.comments.reversed())
                    commentsCache[ticket.key] = (comments: reversed, fetchedAt: Date())
                }
            }
        }
    }

    // MARK: - Cache Access

    static func cachedTransitions(for key: String) -> [TicketTransition]? {
        transitionCache[key]
    }

    static func clearTransitionCache(for key: String) {
        transitionCache.removeValue(forKey: key)
    }

    // MARK: - Load Data

    func loadComments() async {
        // Show cache instantly, still refresh in background
        let hadCached = !comments.isEmpty
        if !hadCached { isLoadingComments = true }

        do {
            let response = try await apiService.fetchComments(
                ticketKey: ticket.key, config: config
            )
            let reversed = response.comments.reversed()
            comments = Array(reversed)
            Self.commentsCache[ticket.key] = (comments: comments, fetchedAt: Date())
        } catch {
            if !hadCached { setStatus("Failed to load comments", isError: true) }
        }
        isLoadingComments = false
    }

    func loadTransitions() async {
        // Already populated from cache in init
        if !transitions.isEmpty { return }

        isLoadingTransitions = true
        do {
            let response = try await apiService.fetchTransitions(
                ticketKey: ticket.key, config: config
            )
            transitions = response.transitions
            Self.transitionCache[ticket.key] = response.transitions
        } catch {
            setStatus("Failed to load transitions", isError: true)
        }
        isLoadingTransitions = false
    }

    // MARK: - Actions

    func transition(to transition: TicketTransition) async {
        let displayName = transition.statusName ?? transition.name
        isTransitioning = true
        setStatus("Moving to \(displayName)...", isError: false)

        do {
            let response = try await apiService.transitionTicket(
                ticketKey: ticket.key,
                transitionId: transition.id,
                config: config
            )
            if response.success {
                setStatus("Moved to \(displayName)", isError: false)
                Self.transitionCache.removeValue(forKey: ticket.key)
                // Reload fresh transitions after status change
                transitions = []
                await loadTransitions()
            } else {
                setStatus(response.error ?? "Transition failed", isError: true)
            }
        } catch {
            setStatus(error.localizedDescription, isError: true)
        }
        isTransitioning = false
    }

    func postComment() async {
        let text = commentText.trimmingCharacters(in: .whitespacesAndNewlines)
        let hasText = !text.isEmpty
        let hasImage = attachedImage != nil

        guard hasText || hasImage else { return }

        isPostingComment = true

        // Upload image first if attached
        if hasImage {
            setStatus("Uploading image...", isError: false)
            let uploaded = await uploadAttachedImage()
            if !uploaded {
                isPostingComment = false
                return
            }
        }

        // Post text comment
        if hasText {
            setStatus("Posting comment...", isError: false)
            do {
                let response = try await apiService.postComment(
                    ticketKey: ticket.key,
                    comment: text,
                    config: config
                )
                if response.success {
                    setStatus("Comment posted", isError: false)
                    commentText = "To Ticket\nChecking.."
                    attachedImage = nil
                    await loadComments()
                } else {
                    setStatus(response.error ?? "Failed to post", isError: true)
                }
            } catch {
                setStatus(error.localizedDescription, isError: true)
            }
        } else {
            // Image only, no text
            setStatus("Image attached", isError: false)
            attachedImage = nil
            await loadComments()
        }

        isPostingComment = false
    }

    // MARK: - Image

    func attachImage() {
        let panel = NSOpenPanel()
        panel.allowedContentTypes = [.png, .jpeg, .gif, .bmp, .tiff]
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = false
        panel.title = "Select Image"

        if panel.runModal() == .OK, let url = panel.url {
            if let image = NSImage(contentsOf: url) {
                attachedImage = image
            }
        }
    }

    func pasteImage() {
        let pb = NSPasteboard.general
        guard let image = NSImage(pasteboard: pb) else {
            setStatus("No image in clipboard", isError: true)
            return
        }
        attachedImage = image
    }

    func removeImage() {
        attachedImage = nil
    }

    // MARK: - Private

    private func uploadAttachedImage() async -> Bool {
        guard let image = attachedImage,
              let tiffData = image.tiffRepresentation,
              let bitmap = NSBitmapImageRep(data: tiffData),
              let pngData = bitmap.representation(using: .png, properties: [:]) else {
            setStatus("Failed to process image", isError: true)
            return false
        }

        isUploadingImage = true
        let filename = "screenshot-\(Int(Date().timeIntervalSince1970)).png"

        do {
            let response = try await apiService.uploadAttachment(
                ticketKey: ticket.key,
                imageData: pngData,
                filename: filename,
                config: config
            )
            if response.success {
                setStatus("Image uploaded", isError: false)
                isUploadingImage = false
                return true
            } else {
                setStatus(response.error ?? "Upload failed", isError: true)
                isUploadingImage = false
                return false
            }
        } catch {
            setStatus(error.localizedDescription, isError: true)
            isUploadingImage = false
            return false
        }
    }

    private func setStatus(_ message: String, isError: Bool) {
        statusMessage = message
        self.isError = isError
        // Auto-clear success messages after 3 seconds
        if !isError {
            Task { @MainActor in
                try? await Task.sleep(nanoseconds: 3_000_000_000)
                if self.statusMessage == message {
                    self.statusMessage = nil
                }
            }
        }
    }
}
