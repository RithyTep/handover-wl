import Foundation

enum SchedulePreset: String, CaseIterable, Identifiable {
    case off = "off"
    case day = "day"
    case night = "night"
    case custom = "custom"

    var id: String { rawValue }

    var displayLabel: String {
        switch self {
        case .off:    return "Off"
        case .day:    return "Day · 17:16"
        case .night:  return "Night · 23:46"
        case .custom: return "Custom"
        }
    }

    var defaultHour: Int? {
        switch self {
        case .day:   return 17
        case .night: return 23
        default:     return nil
        }
    }

    var defaultMinute: Int? {
        switch self {
        case .day:   return 16
        case .night: return 46
        default:     return nil
        }
    }

    init(fromString value: String) {
        self = SchedulePreset(rawValue: value) ?? .day
    }
}
