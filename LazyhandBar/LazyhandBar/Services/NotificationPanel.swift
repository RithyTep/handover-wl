import AppKit
import SwiftUI

final class NotificationPanel {
    static let shared = NotificationPanel()

    private var panel: NSPanel?
    private var dismissTimer: Timer?

    // Widget (persistent, draggable)
    private var widgetPanel: NSPanel?
    private let widgetPositionKey = "widgetPosition"

    private init() {}

    // MARK: - Notification (auto-dismiss)

    func show<Content: View>(
        duration: TimeInterval = 3,
        @ViewBuilder content: () -> Content
    ) {
        let view = content()
        DispatchQueue.main.async { [weak self] in
            self?.dismissNotification()
            self?.presentNotificationPanel(duration: duration, content: view)
        }
    }

    func dismissNotification() {
        dismissTimer?.invalidate()
        dismissTimer = nil
        panel?.orderOut(nil)
        panel = nil
    }

    // MARK: - Widget (persistent)

    func showWidget<Content: View>(@ViewBuilder content: () -> Content) {
        let view = content()
        DispatchQueue.main.async { [weak self] in
            self?.dismissWidget()
            self?.presentWidgetPanel(content: view)
        }
    }

    func updateWidget<Content: View>(@ViewBuilder content: () -> Content) {
        guard let widgetPanel else {
            showWidget(content: content)
            return
        }
        let view = content()
        DispatchQueue.main.async {
            let hostingView = NSHostingView(rootView: view)
            hostingView.setFrameSize(widgetPanel.contentView?.frame.size ?? NSSize(width: 220, height: 44))
            widgetPanel.contentView = hostingView
        }
    }

    func dismissWidget() {
        guard let widgetPanel else { return }
        saveWidgetPosition(widgetPanel.frame.origin)
        NSAnimationContext.runAnimationGroup({ ctx in
            ctx.duration = 0.2
            widgetPanel.animator().alphaValue = 0
        }, completionHandler: { [weak self] in
            self?.widgetPanel?.orderOut(nil)
            self?.widgetPanel = nil
        })
    }

    var isWidgetVisible: Bool {
        widgetPanel != nil
    }

    // MARK: - Private: Notification

    private func presentNotificationPanel<Content: View>(
        duration: TimeInterval,
        content: Content
    ) {
        guard let screen = NSScreen.main else { return }

        let hostingView = NSHostingView(rootView: content)
        hostingView.setFrameSize(NSSize(width: 340, height: 100))

        let panelRect = NSRect(
            x: screen.visibleFrame.maxX - 356,
            y: screen.visibleFrame.maxY - 116,
            width: 340,
            height: 100
        )

        let newPanel = NSPanel(
            contentRect: panelRect,
            styleMask: [.nonactivatingPanel, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )
        newPanel.isOpaque = false
        newPanel.backgroundColor = .clear
        newPanel.hasShadow = true
        newPanel.level = .floating
        newPanel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        newPanel.isMovableByWindowBackground = false
        newPanel.contentView = hostingView

        newPanel.alphaValue = 0
        newPanel.orderFrontRegardless()
        NSAnimationContext.runAnimationGroup { ctx in
            ctx.duration = 0.25
            newPanel.animator().alphaValue = 1
        }

        self.panel = newPanel

        dismissTimer = Timer.scheduledTimer(
            withTimeInterval: duration,
            repeats: false
        ) { [weak self] _ in
            self?.animateDismissNotification()
        }
    }

    private func animateDismissNotification() {
        guard let panel else { return }
        NSAnimationContext.runAnimationGroup({ ctx in
            ctx.duration = 0.3
            panel.animator().alphaValue = 0
        }, completionHandler: { [weak self] in
            self?.panel?.orderOut(nil)
            self?.panel = nil
        })
    }

    // MARK: - Private: Widget

    private func presentWidgetPanel<Content: View>(content: Content) {
        guard let screen = NSScreen.main else { return }

        let widgetSize = NSSize(width: 220, height: 44)
        let hostingView = NSHostingView(rootView: content)
        hostingView.setFrameSize(widgetSize)

        let origin = loadWidgetPosition() ?? NSPoint(
            x: screen.visibleFrame.midX - widgetSize.width / 2,
            y: screen.visibleFrame.maxY - widgetSize.height - 8
        )

        let panelRect = NSRect(origin: origin, size: widgetSize)

        let newPanel = NSPanel(
            contentRect: panelRect,
            styleMask: [.nonactivatingPanel, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )
        newPanel.isOpaque = false
        newPanel.backgroundColor = .clear
        newPanel.hasShadow = true
        newPanel.level = .floating
        newPanel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        newPanel.isMovableByWindowBackground = true
        newPanel.contentView = hostingView

        newPanel.alphaValue = 0
        newPanel.orderFrontRegardless()
        NSAnimationContext.runAnimationGroup { ctx in
            ctx.duration = 0.25
            newPanel.animator().alphaValue = 1
        }

        self.widgetPanel = newPanel
    }

    // MARK: - Widget Position Persistence

    private func saveWidgetPosition(_ point: NSPoint) {
        UserDefaults.standard.set(
            ["x": point.x, "y": point.y],
            forKey: widgetPositionKey
        )
    }

    private func loadWidgetPosition() -> NSPoint? {
        guard let dict = UserDefaults.standard.dictionary(forKey: widgetPositionKey),
              let x = dict["x"] as? CGFloat,
              let y = dict["y"] as? CGFloat else {
            return nil
        }
        return NSPoint(x: x, y: y)
    }
}
