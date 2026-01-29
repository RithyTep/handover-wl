import Foundation

@MainActor
final class TicketDetailViewModel: ObservableObject {
    let ticket: Ticket

    @Published var comments: [TicketComment] = []
    @Published var transitions: [TicketTransition] = []
    @Published var isLoadingComments = false
    @Published var isLoadingTransitions = false
    @Published var isPostingComment = false
    @Published var isTransitioning = false
    @Published var commentText: String = "To Ticket\nChecking.."
    @Published var statusMessage: String?
    @Published var isError = false

    private let apiService = TicketAPIService()
    private let appUrl: String

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
        isLoadingTransitions = true
        do {
            let response = try await apiService.fetchTransitions(
                ticketKey: ticket.key, config: config
            )
            transitions = response.transitions
        } catch {
            setStatus("Failed to load transitions", isError: true)
        }
        isLoadingTransitions = false
    }

    // MARK: - Actions

    func transition(to transition: TicketTransition) async {
        isTransitioning = true
        setStatus("Moving to \(transition.name)...", isError: false)

        do {
            let response = try await apiService.transitionTicket(
                ticketKey: ticket.key,
                transitionId: transition.id,
                config: config
            )
            if response.success {
                setStatus("Moved to \(transition.name)", isError: false)
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
        guard !text.isEmpty else { return }

        isPostingComment = true
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
                await loadComments()
            } else {
                setStatus(response.error ?? "Failed to post", isError: true)
            }
        } catch {
            setStatus(error.localizedDescription, isError: true)
        }
        isPostingComment = false
    }

    private func setStatus(_ message: String, isError: Bool) {
        statusMessage = message
        self.isError = isError
    }
}
