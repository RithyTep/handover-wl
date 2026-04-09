import AppKit
import Combine
import SwiftUI

@MainActor
class AppDelegate: NSObject, NSApplicationDelegate {
    private var statusItem: NSStatusItem!
    var viewModel: AppViewModel!
    var ticketVM: TicketListViewModel!
    private var popover: NSPopover!
    private var cancellables = Set<AnyCancellable>()

    func applicationDidFinishLaunching(_ notification: Notification) {
        viewModel = AppViewModel()
        ticketVM = TicketListViewModel()

        setupStatusItem()
        setupPopover()

        ticketVM.$ticketCount
            .receive(on: RunLoop.main)
            .sink { [weak self] _ in self?.updateStatusLabel() }
            .store(in: &cancellables)
    }

    // MARK: - Status Item

    private func setupStatusItem() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        guard let button = statusItem.button else { return }
        button.image = NSImage(
            systemSymbolName: "hand.wave",
            accessibilityDescription: "LazyhandBar"
        )
        button.imagePosition = .imageLeading
        button.action = #selector(togglePopover)
        button.target = self
        updateStatusLabel()
    }

    private func updateStatusLabel() {
        guard let button = statusItem.button else { return }
        let count = ticketVM.ticketCount
        button.title = count > 0 ? " \(count)" : ""
    }

    // MARK: - Popover

    private func setupPopover() {
        popover = NSPopover()
        popover.contentSize = NSSize(width: 360, height: 480)
        popover.behavior = .transient
        popover.animates = true

        let content = PopoverContentView(
            viewModel: viewModel,
            ticketVM: ticketVM
        )
        popover.contentViewController = NSHostingController(rootView: content)
    }

    @objc private func togglePopover() {
        guard let button = statusItem.button else { return }

        if popover.isShown {
            popover.performClose(nil)
        } else {
            popover.show(relativeTo: button.bounds, of: button, preferredEdge: .minY)
            NSApp.activate(ignoringOtherApps: true)
        }
    }

    // MARK: - Application Lifecycle

    func applicationSupportsSecureRestorableState(_ app: NSApplication) -> Bool {
        return true
    }

    func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
        if !flag, let button = statusItem.button {
            popover.show(relativeTo: button.bounds, of: button, preferredEdge: .minY)
        }
        return true
    }
}

extension Notification.Name {
    static let submitComment = Notification.Name("submitComment")
}
