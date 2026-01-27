import Foundation

final class ConfigService {
    static let shared = ConfigService()

    private let configDir: URL
    private let configFile: URL
    private let fileManager = FileManager.default

    private init() {
        let home = fileManager.homeDirectoryForCurrentUser
        configDir = home.appendingPathComponent(".lazyhand")
        configFile = configDir.appendingPathComponent("config.json")
    }

    func load() -> AppConfig {
        guard fileManager.fileExists(atPath: configFile.path) else {
            return .defaultConfig
        }

        do {
            let data = try Data(contentsOf: configFile)
            let decoder = JSONDecoder()
            var config = try decoder.decode(AppConfig.self, from: data)
            mergeDefaults(&config)
            return config
        } catch {
            print("[ConfigService] Failed to load config: \(error)")
            return .defaultConfig
        }
    }

    func save(_ config: AppConfig) {
        do {
            if !fileManager.fileExists(atPath: configDir.path) {
                try fileManager.createDirectory(
                    at: configDir,
                    withIntermediateDirectories: true
                )
            }

            let encoder = JSONEncoder()
            encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
            let data = try encoder.encode(config)
            try data.write(to: configFile, options: .atomic)
        } catch {
            print("[ConfigService] Failed to save config: \(error)")
        }
    }

    private func mergeDefaults(_ config: inout AppConfig) {
        let defaults = AppConfig.defaultConfig
        if config.appUrl.isEmpty { config.appUrl = defaults.appUrl }
        if config.preset.isEmpty { config.preset = defaults.preset }
        if config.hour.isEmpty { config.hour = defaults.hour }
        if config.minute.isEmpty { config.minute = defaults.minute }
    }
}
