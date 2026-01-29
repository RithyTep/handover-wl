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

    // Lightweight poll check — only returns total count + latest key (~200ms)
    func pollCheck(config: AppConfig) async throws -> TicketPollResponse {
        let urlString = config.trimmedAppUrl + "/api/tickets-poll"
        guard let url = URL(string: urlString) else {
            throw HandoverError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 10

        let (data, httpResponse) = try await URLSession.shared.data(for: request)

        guard let http = httpResponse as? HTTPURLResponse, http.statusCode < 400 else {
            throw HandoverError.invalidResponse
        }

        return try JSONDecoder().decode(TicketPollResponse.self, from: data)
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

    func fetchAttachments(ticketKey: String, config: AppConfig) async throws -> TicketAttachmentsResponse {
        let urlString = config.trimmedAppUrl + "/api/ticket-attachments?key=\(ticketKey)"
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

        return try JSONDecoder().decode(TicketAttachmentsResponse.self, from: data)
    }

    func uploadAttachment(ticketKey: String, imageData: Data, filename: String, config: AppConfig) async throws -> AttachmentUploadResponse {
        let urlString = config.trimmedAppUrl + "/api/upload-attachment"
        guard let url = URL(string: urlString) else {
            throw HandoverError.invalidURL
        }

        let boundary = UUID().uuidString
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 60

        var body = Data()

        // ticket_key field
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"ticket_key\"\r\n\r\n".data(using: .utf8)!)
        body.append("\(ticketKey)\r\n".data(using: .utf8)!)

        // file field
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"file\"; filename=\"\(filename)\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: image/png\r\n\r\n".data(using: .utf8)!)
        body.append(imageData)
        body.append("\r\n".data(using: .utf8)!)

        // End boundary
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)

        request.httpBody = body

        let (data, httpResponse) = try await URLSession.shared.data(for: request)

        guard let http = httpResponse as? HTTPURLResponse, http.statusCode < 400 else {
            let errorBody = try? JSONDecoder().decode(AttachmentUploadResponse.self, from: data)
            throw HandoverError.apiError(
                statusCode: (httpResponse as? HTTPURLResponse)?.statusCode ?? 500,
                message: errorBody?.error ?? "Failed to upload attachment"
            )
        }

        return try JSONDecoder().decode(AttachmentUploadResponse.self, from: data)
    }
}
