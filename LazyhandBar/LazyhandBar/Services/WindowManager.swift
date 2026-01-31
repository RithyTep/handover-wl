import AppKit
import SwiftUI

@MainActor
class WindowManager: ObservableObject {
    static let shared = WindowManager()

    @Published private(set) var detailWindows: [String: NSWindowController] = [:]

    private init() {}

    var mainWindow: MainWindowController {
        MainWindowController.shared
    }

    func openDetailWindow(for ticket: Ticket, appUrl: String) {
        let identifier = "detail_\(ticket.key)"

        // Reuse if already open
        if let existing = detailWindows[identifier] {
            existing.window?.makeKeyAndOrderFront(nil)
            return
        }

        // Create new detail window
        let controller = TicketDetailWindowController(ticket: ticket, appUrl: appUrl)
        detailWindows[identifier] = controller
        controller.showWindow(nil)

        // Cleanup on close
        NotificationCenter.default.addObserver(
            forName: NSWindow.willCloseNotification,
            object: controller.window,
            queue: .main
        ) { [weak self] _ in
            Task { @MainActor in
                self?.detailWindows.removeValue(forKey: identifier)
            }
        }
    }

    func closeAllDetailWindows() {
        detailWindows.values.forEach { $0.window?.close() }
        detailWindows.removeAll()
    }
}
