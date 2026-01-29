import Foundation

final class TicketAPIService {
    func fetchTickets(config: AppConfig) async throws -> TicketListResponse {
        let urlString = config.trimmedAppUrl + "/api/tickets"
        guard let url = URL(string: urlString) else {
            throw HandoverError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 30

        let (data, httpResponse) = try await URLSession.shared.data(for: request)

        guard let http = httpResponse as? HTTPURLResponse else {
            throw HandoverError.invalidResponse
        }

        if http.statusCode >= 400 {
            let errorBody = try? JSONDecoder().decode(
                TicketErrorResponse.self, from: data
            )
            throw HandoverError.apiError(
                statusCode: http.statusCode,
                message: errorBody?.error ?? "Failed to fetch tickets"
            )
        }

        return try JSONDecoder().decode(TicketListResponse.self, from: data)
    }

    func fetchComments(ticketKey: String, config: AppConfig) async throws -> TicketCommentsResponse {
        let urlString = config.trimmedAppUrl + "/api/ticket-comments?key=\(ticketKey)"
        guard let url = URL(string: urlString) else {
            throw HandoverError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 30

        let (data, httpResponse) = try await URLSession.shared.data(for: request)

        guard let http = httpResponse as? HTTPURLResponse, http.statusCode < 400 else {
            throw HandoverError.invalidResponse
        }

        return try JSONDecoder().decode(TicketCommentsResponse.self, from: data)
    }

    func fetchTransitions(ticketKey: String, config: AppConfig) async throws -> TicketTransitionsResponse {
        let urlString = config.trimmedAppUrl + "/api/ticket-transitions?key=\(ticketKey)"
        guard let url = URL(string: urlString) else {
            throw HandoverError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 30

        let (data, httpResponse) = try await URLSession.shared.data(for: request)

        guard let http = httpResponse as? HTTPURLResponse, http.statusCode < 400 else {
            throw HandoverError.invalidResponse
        }

        return try JSONDecoder().decode(TicketTransitionsResponse.self, from: data)
    }

    func transitionTicket(ticketKey: String, transitionId: String, config: AppConfig) async throws -> GenericAPIResponse {
        let urlString = config.trimmedAppUrl + "/api/transition-ticket"
        guard let url = URL(string: urlString) else {
            throw HandoverError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 30
        request.httpBody = try JSONEncoder().encode([
            "ticket_key": ticketKey,
            "transition_id": transitionId,
        ])

        let (data, httpResponse) = try await URLSession.shared.data(for: request)

        guard let http = httpResponse as? HTTPURLResponse, http.statusCode < 400 else {
            let errorBody = try? JSONDecoder().decode(GenericAPIResponse.self, from: data)
            throw HandoverError.apiError(
                statusCode: (httpResponse as? HTTPURLResponse)?.statusCode ?? 500,
                message: errorBody?.error ?? "Transition failed"
            )
        }

        return try JSONDecoder().decode(GenericAPIResponse.self, from: data)
    }

    func postComment(ticketKey: String, comment: String, config: AppConfig) async throws -> GenericAPIResponse {
        let urlString = config.trimmedAppUrl + "/api/post-jira-comment"
        guard let url = URL(string: urlString) else {
            throw HandoverError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 30
        request.httpBody = try JSONEncoder().encode([
            "ticket_key": ticketKey,
            "comment_text": comment,
        ])

        let (data, httpResponse) = try await URLSession.shared.data(for: request)

        guard let http = httpResponse as? HTTPURLResponse, http.statusCode < 400 else {
            let errorBody = try? JSONDecoder().decode(GenericAPIResponse.self, from: data)
            throw HandoverError.apiError(
                statusCode: (httpResponse as? HTTPURLResponse)?.statusCode ?? 500,
                message: errorBody?.error ?? "Failed to post comment"
            )
        }

        return try JSONDecoder().decode(GenericAPIResponse.self, from: data)
    }
}
