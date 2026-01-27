import Foundation
import SwiftUI

@MainActor
final class AppViewModel: ObservableObject {
    // Config fields
    @Published var appUrl: String = ""
    @Published var token: String = ""
    @Published var channelId: String = ""
    @Published var mentions: String = ""
    @Published var preset: SchedulePreset = .day
    @Published var hour: Int = 17
    @Published var minute: Int = 16

    // State
    @Published var statusMessage: String = "Ready."
    @Published var isError: Bool = false
    @Published var isRunning: Bool = false
    @Published var lastRunTime: Date?

    // Services
    private let configService = ConfigService.shared
    private let apiService = HandoverAPIService()
    let scheduler = SchedulerService()

    init() {
        loadConfig()
        setupSchedulerCallback()
        applyScheduleIfNeeded()
    }

    func loadConfig() {
        let config = configService.load()
        appUrl = config.appUrl
        token = config.token
        channelId = config.channelId
        mentions = config.mentions
        preset = SchedulePreset(fromString: config.preset)
        hour = config.hourInt
        minute = config.minuteInt
    }

    func saveConfig() {
        let config = buildConfig()
        configService.save(config)
    }

    func presetChanged() {
        if let h = preset.defaultHour { hour = h }
        if let m = preset.defaultMinute { minute = m }
        saveConfig()
        applyScheduleIfNeeded()
    }

    func applySchedule() {
        saveConfig()
        applyScheduleIfNeeded()
        if preset == .off {
            setStatus("Schedule off.", isError: false)
        } else {
            let time = String(format: "%02d:%02d", hour, minute)
            setStatus("Scheduled daily at \(time).", isError: false)
        }
    }

    func stopSchedule() {
        scheduler.cancel()
        preset = .off
        saveConfig()
        setStatus("Schedule stopped.", isError: false)
    }

    func runNow() async {
        isRunning = true
        setStatus("Running...", isError: false)

        do {
            let config = buildConfig()
            let response = try await apiService.runHandover(config: config)
            lastRunTime = Date()

            if response.replied {
                let count = response.ticketsProcessed ?? 0
                let ai = response.aiFilled ?? 0
                var msg = "Replied (\(count) tickets"
                if ai > 0 { msg += ", \(ai) AI-filled" }
                msg += ")"
                setStatus(msg, isError: false)
            } else {
                setStatus(response.message ?? "No reply sent.", isError: false)
            }
        } catch {
            setStatus(error.localizedDescription, isError: true)
        }

        isRunning = false
    }

    // MARK: - Private

    private func buildConfig() -> AppConfig {
        AppConfig(
            appUrl: appUrl,
            token: token,
            channelId: channelId,
            mentions: mentions,
            preset: preset.rawValue,
            hour: String(hour),
            minute: String(minute)
        )
    }

    private func applyScheduleIfNeeded() {
        if preset == .off {
            scheduler.cancel()
        } else {
            scheduler.schedule(hour: hour, minute: minute)
        }
    }

    private func setupSchedulerCallback() {
        scheduler.onFire = { [weak self] in
            guard let self else { return }
            Task { @MainActor in
                await self.runNow()
            }
        }
    }

    private func setStatus(_ message: String, isError: Bool) {
        statusMessage = message
        self.isError = isError
    }
}
