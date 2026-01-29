import Foundation
import AppKit

@MainActor
final class TicketDetailViewModel: ObservableObject {
    let ticket: Ticket

    @Published var comments: [TicketComment] = []
    @Published var transitions: [TicketTransition] = []
    @Published var attachments: [TicketAttachment] = []
    @Published var isLoadingComments = false
    @Published var isLoadingTransitions = false
    @Published var isLoadingAttachments = false
    @Published var isPostingComment = false
    @Published var isTransitioning = false
    @Published var isUploadingImage = false
    @Published var commentText: String = "To Ticket\nChecking.."
    @Published var attachedImage: NSImage?
    @Published var statusMessage: String?
    @Published var isError = false

    // Cache transitions forever — Jira workflows rarely change
    private static var transitionCache: [String: [TicketTransition]] = [:]

    private let apiService = TicketAPIService()
    let appUrl: String

    init(ticket: Ticket, appUrl: String) {
        self.ticket = ticket
        self.appUrl = appUrl
    }

    private var config: AppConfig {
        AppConfig(
            appUrl: appUrl, token: "", channelId: "",
            mentions: "", preset: "day", hour: "17", minute: "16",
            soundEnabled: "true", selectedSound: "Tink",
            widgetEnabled: "false", pollingInterval: "30"
        )
    }

    // MARK: - Load Data

    func loadComments() async {
        isLoadingComments = true
        do {
            let response = try await apiService.fetchComments(
                ticketKey: ticket.key, config: config
            )
            comments = response.comments.reversed()
        } catch {
            setStatus("Failed to load comments", isError: true)
        }
        isLoadingComments = false
    }

    func loadTransitions() async {
        // Return cached transitions if available
        if let cached = Self.transitionCache[ticket.key] {
            transitions = cached
            return
        }

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

    func loadAttachments() async {
        isLoadingAttachments = true
        do {
            let response = try await apiService.fetchAttachments(
                ticketKey: ticket.key, config: config
            )
            attachments = response.attachments
        } catch {
            setStatus("Failed to load attachments", isError: true)
        }
        isLoadingAttachments = false
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
    }
}
