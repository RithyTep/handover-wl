import Foundation

final class HandoverAPIService {
    private struct RequestBody: Encodable {
        let token: String
        let channelId: String
        let limit: Int
        let mentions: String
    }

    func runHandover(config: AppConfig) async throws -> HandoverResponse {
        guard !config.token.isEmpty else {
            throw HandoverError.missingConfig("Slack User Token")
        }
        guard !config.channelId.isEmpty else {
            throw HandoverError.missingConfig("Slack Channel ID")
        }

        let urlString = config.trimmedAppUrl + "/api/handover-reply"
        guard let url = URL(string: urlString) else {
            throw HandoverError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 60

        let body = RequestBody(
            token: config.token,
            channelId: config.channelId,
            limit: 10,
            mentions: config.mentions
        )
        request.httpBody = try JSONEncoder().encode(body)

        let (data, httpResponse) = try await URLSession.shared.data(for: request)

        guard let http = httpResponse as? HTTPURLResponse else {
            throw HandoverError.invalidResponse
        }

        if http.statusCode >= 400 {
            let errorBody = try? JSONDecoder().decode(
                HandoverErrorResponse.self, from: data
            )
            throw HandoverError.apiError(
                statusCode: http.statusCode,
                message: errorBody?.error ?? "Request failed"
            )
        }

        return try JSONDecoder().decode(HandoverResponse.self, from: data)
    }
}
