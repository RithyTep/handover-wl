import Foundation

struct HandoverResponse: Decodable {
    let replied: Bool
    let message: String?
    let ticketsProcessed: Int?
    let aiFilled: Int?
    let handoverMessageTs: String?
    let replyTs: String?
    let sentAt: String?
}

struct HandoverErrorResponse: Decodable {
    let error: String?
    let success: Bool?
}

enum HandoverError: LocalizedError {
    case invalidURL
    case invalidResponse
    case apiError(statusCode: Int, message: String)
    case missingConfig(String)

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid app URL"
        case .invalidResponse:
            return "Invalid response from server"
        case .apiError(let code, let message):
            return "API error (\(code)): \(message)"
        case .missingConfig(let field):
            return "Missing \(field)"
        }
    }
}
