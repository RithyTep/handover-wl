import Foundation

struct Ticket: Decodable, Identifiable {
    let key: String
    let summary: String
    let status: String
    let assignee: String
    let assigneeAvatar: String?
    let created: String
    let dueDate: String?
    let issueType: String
    let wlMainTicketType: String
    let wlSubTicketType: String
    let customerLevel: String
    let jiraUrl: String
    let savedStatus: String
    let savedAction: String

    var id: String { key }
}

struct TicketListResponse: Decodable {
    let success: Bool
    let tickets: [Ticket]
    let total: Int
    let storage: String?
}

struct TicketErrorResponse: Decodable {
    let success: Bool?
    let error: String?
}

// MARK: - Ticket Detail Models

struct TicketComment: Decodable, Identifiable {
    let author: String
    let text: String
    let created: String

    var id: String { "\(author)-\(created)" }
}

struct TicketCommentsResponse: Decodable {
    let success: Bool
    let comments: [TicketComment]
}

struct TicketTransition: Decodable, Identifiable {
    let id: String
    let name: String
    let statusName: String?
}

struct TicketTransitionsResponse: Decodable {
    let success: Bool
    let transitions: [TicketTransition]
}

struct GenericAPIResponse: Decodable {
    let success: Bool
    let message: String?
    let error: String?
}

struct AttachmentUploadResponse: Decodable {
    let success: Bool
    let filename: String?
    let mimeType: String?
    let error: String?
}

// MARK: - Ticket Attachments

struct TicketAttachment: Decodable, Identifiable {
    let id: String
    let filename: String
    let mimeType: String
    let created: String
    let size: Int
    let author: String
    let thumbnailUrl: String
    let contentUrl: String
}

struct TicketAttachmentsResponse: Decodable {
    let success: Bool
    let attachments: [TicketAttachment]
}
