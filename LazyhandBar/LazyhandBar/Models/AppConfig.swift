import Foundation

struct AppConfig: Codable, Equatable {
    var appUrl: String
    var token: String
    var channelId: String
    var mentions: String
    var preset: String
    var hour: String
    var minute: String
    var soundEnabled: String
    var selectedSound: String
    var widgetEnabled: String
    var pollingInterval: String

    static let defaultConfig = AppConfig(
        appUrl: "https://handover-production.rithytep.online",
        token: "",
        channelId: "",
        mentions: "",
        preset: "day",
        hour: "17",
        minute: "16",
        soundEnabled: "true",
        selectedSound: "Tink",
        widgetEnabled: "false",
        pollingInterval: "30"
    )

    var hourInt: Int {
        get { Int(hour) ?? 17 }
        set { hour = String(newValue) }
    }

    var minuteInt: Int {
        get { Int(minute) ?? 16 }
        set { minute = String(newValue) }
    }

    var isSoundEnabled: Bool {
        get { soundEnabled == "true" }
        set { soundEnabled = newValue ? "true" : "false" }
    }

    var isWidgetEnabled: Bool {
        get { widgetEnabled == "true" }
        set { widgetEnabled = newValue ? "true" : "false" }
    }

    var pollingIntervalSeconds: TimeInterval {
        TimeInterval(Int(pollingInterval) ?? 30)
    }

    var trimmedAppUrl: String {
        var url = appUrl.trimmingCharacters(in: .whitespacesAndNewlines)
        if url.hasSuffix("/") { url.removeLast() }
        return url
    }
}

// Custom decoder for backward compatibility with old config files
extension AppConfig {
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        appUrl = try container.decode(String.self, forKey: .appUrl)
        token = try container.decode(String.self, forKey: .token)
        channelId = try container.decode(String.self, forKey: .channelId)
        mentions = try container.decode(String.self, forKey: .mentions)
        preset = try container.decode(String.self, forKey: .preset)
        hour = try container.decode(String.self, forKey: .hour)
        minute = try container.decode(String.self, forKey: .minute)
        soundEnabled = try container.decodeIfPresent(String.self, forKey: .soundEnabled) ?? "true"
        selectedSound = try container.decodeIfPresent(String.self, forKey: .selectedSound) ?? "Tink"
        widgetEnabled = try container.decodeIfPresent(String.self, forKey: .widgetEnabled) ?? "false"
        pollingInterval = try container.decodeIfPresent(String.self, forKey: .pollingInterval) ?? "30"
    }
}
