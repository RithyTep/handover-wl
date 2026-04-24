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

    // Preferences
    @Published var soundEnabled: Bool = true
    @Published var selectedSound: String = "Tink"
    @Published var widgetEnabled: Bool = false

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
        soundEnabled = config.isSoundEnabled
        selectedSound = config.selectedSound
        widgetEnabled = config.isWidgetEnabled
    }

    func saveConfig() {
        let config = buildConfig()
        configService.save(config)
    }

    func presetChanged() {
        // Guard: if the user has set a custom time, the preset must not fire.
        // Cancel any active preset timer and wait for an explicit Apply.
        if preset == .custom {
            scheduler.cancel()
            saveConfig()
            return
        }
        if let h = preset.defaultHour { hour = h }
        if let m = preset.defaultMinute { minute = m }
        saveConfig()
        applyScheduleIfNeeded()
    }

    /// Called when the user tweaks hour or minute while on a named preset.
    /// If the value diverges from the preset default, snap to Custom and
    /// cancel the preset timer so it cannot fire alongside the new time.
    func snapToCustomIfNeeded() {
        guard preset != .custom, preset != .off else { return }
        guard let presetH = preset.defaultHour,
              let presetM = preset.defaultMinute else { return }
        if hour != presetH || minute != presetM {
            preset = .custom
            scheduler.cancel()
            saveConfig()
        }
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
                var msg = "✓ Replied (\(count) tickets"
                if ai > 0 { msg += ", \(ai) AI-filled" }
                msg += ")"
                setStatus(msg, isError: false)
            } else {
                let msg = response.message ?? "No reply sent"
                let hint = formatHint(for: msg)
                setStatus(hint, isError: true)
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
            minute: String(minute),
            soundEnabled: soundEnabled ? "true" : "false",
            selectedSound: selectedSound,
            widgetEnabled: widgetEnabled ? "true" : "false",
            pollingInterval: "30"
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

    private func formatHint(for message: String) -> String {
        let lower = message.lowercased()

        if lower.contains("no handover message") || lower.contains("not found") {
            return "⚠ No handover message in channel. Post one first or check Channel ID."
        }
        if lower.contains("channel_not_found") || lower.contains("channel not found") {
            return "⚠ Channel not found. Check your Channel ID in Settings."
        }
        if lower.contains("invalid_auth") || lower.contains("token") {
            return "⚠ Invalid token. Check your Slack Token in Settings."
        }
        if lower.contains("not_in_channel") {
            return "⚠ Bot not in channel. Add the bot to the Slack channel."
        }
        if lower.contains("rate_limit") || lower.contains("rate limit") {
            return "⚠ Rate limited. Wait a moment and try again."
        }

        return "⚠ \(message)"
    }
}
