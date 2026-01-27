import Foundation

struct AppConfig: Codable, Equatable {
    var appUrl: String
    var token: String
    var channelId: String
    var mentions: String
    var preset: String
    var hour: String
    var minute: String

    static let defaultConfig = AppConfig(
        appUrl: "https://handover-production.rithytep.online",
        token: "",
        channelId: "",
        mentions: "",
        preset: "day",
        hour: "17",
        minute: "16"
    )

    var hourInt: Int {
        get { Int(hour) ?? 17 }
        set { hour = String(newValue) }
    }

    var minuteInt: Int {
        get { Int(minute) ?? 16 }
        set { minute = String(newValue) }
    }

    var trimmedAppUrl: String {
        var url = appUrl.trimmingCharacters(in: .whitespacesAndNewlines)
        if url.hasSuffix("/") { url.removeLast() }
        return url
    }
}
