import AppKit
import SwiftUI

@MainActor
class TicketDetailWindowController: NSWindowController {
    private let ticket: Ticket
    private let appUrl: String

    init(ticket: Ticket, appUrl: String) {
        self.ticket = ticket
        self.appUrl = appUrl

        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 700, height: 900),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )

        super.init(window: window)
        configureWindow()
        setupContent()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) not implemented")
    }

    private func configureWindow() {
        guard let window = window else { return }

        window.title = ticket.key
        window.subtitle = ticket.summary
        window.titlebarAppearsTransparent = false

        // Tab support - can merge with main window
        window.tabbingMode = .preferred
        window.tabbingIdentifier = "LazyhandBarWindow"

        // Center or restore position
        window.center()
        window.isRestorable = true
        window.identifier = NSUserInterfaceItemIdentifier("DetailWindow_\(ticket.key)")
    }

    private func setupContent() {
        let contentView = TicketDetailView(
            ticket: ticket,
            appUrl: appUrl,
            onClose: { [weak self] in
                self?.window?.close()
            }
        )
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.detailBg)
        .preferredColorScheme(.dark)

        window?.contentView = NSHostingView(rootView: contentView)
    }
}
