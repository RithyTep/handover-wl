import AppKit

enum NotificationSoundService {
    static let availableSounds = ["Tink", "Glass", "Pop", "Purr", "Submarine", "Hero"]

    static func play(_ soundName: String) {
        guard let sound = NSSound(named: NSSound.Name(soundName)) else { return }
        sound.stop()
        sound.play()
    }
}
