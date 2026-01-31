import AppKit
import SwiftUI

@MainActor
class MainWindowController: NSWindowController {
    static let shared = MainWindowController()

    private init() {
        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 500, height: 700),
            styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )
        super.init(window: window)
        configureWindow()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) not implemented")
    }

    private func configureWindow() {
        guard let window = window else { return }

        // Modern macOS appearance
        window.titlebarAppearsTransparent = true
        window.titleVisibility = .hidden
        window.toolbarStyle = .unified
        window.isMovableByWindowBackground = true

        // Visual effects for smooth modern look
        window.isOpaque = false
        window.backgroundColor = .clear
        window.hasShadow = true

        // Always on top (floating level)
        window.level = .floating
        window.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]

        // Window restoration & state
        window.isRestorable = false
        window.identifier = NSUserInterfaceItemIdentifier("MainWindow")

        // Delegate
        window.delegate = self
    }

    func show() {
        if let window = window {
            // Position at top-right of screen (below menu bar)
            if let screen = NSScreen.main {
                let screenFrame = screen.visibleFrame
                let windowWidth = window.frame.width
                let windowHeight = window.frame.height

                let x = screenFrame.maxX - windowWidth - 20
                let y = screenFrame.maxY - windowHeight - 10

                window.setFrameOrigin(NSPoint(x: x, y: y))
            }

            // Smooth fade-in animation
            window.alphaValue = 0
            window.makeKeyAndOrderFront(nil)
            NSApp.activate(ignoringOtherApps: true)

            NSAnimationContext.runAnimationGroup({ context in
                context.duration = 0.15
                context.timingFunction = CAMediaTimingFunction(name: .easeOut)
                window.animator().alphaValue = 1.0
            })
        }
    }

    func toggle() {
        guard let window = window else { return }
        if window.isVisible && window.isKeyWindow {
            hide()
        } else {
            show()
        }
    }

    private func hide() {
        guard let window = window else { return }

        // Smooth fade-out animation
        NSAnimationContext.runAnimationGroup({ context in
            context.duration = 0.12
            context.timingFunction = CAMediaTimingFunction(name: .easeIn)
            window.animator().alphaValue = 0
        }, completionHandler: {
            window.orderOut(nil)
            window.alphaValue = 1.0
        })
    }
}

extension MainWindowController: NSWindowDelegate {
    func windowShouldClose(_ sender: NSWindow) -> Bool {
        // Hide instead of close (menu bar app pattern)
        sender.orderOut(nil)
        return false
    }
}
