import AppKit
import Combine
import SwiftUI

@MainActor
class AppDelegate: NSObject, NSApplicationDelegate {
    private var statusItem: NSStatusItem!
    private var viewModel: AppViewModel!
    private var ticketVM: TicketListViewModel!
    private var cancellables = Set<AnyCancellable>()

    func applicationDidFinishLaunching(_ notification: Notification) {
        viewModel = AppViewModel()
        ticketVM = TicketListViewModel()

        setupStatusItem()
        setupMenuBar()
        setupMainWindow()

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
        button.action = #selector(toggleMainWindow)
        button.target = self
        updateStatusLabel()
    }

    private func updateStatusLabel() {
        guard let button = statusItem.button else { return }
        let count = ticketVM.ticketCount
        button.title = count > 0 ? " \(count)" : ""
    }

    // MARK: - Menu Bar

    private func setupMenuBar() {
        let menu = NSMenu()

        menu.addItem(NSMenuItem(
            title: "Show LazyhandBar",
            action: #selector(showMainWindow),
            keyEquivalent: ""
        ))

        menu.addItem(NSMenuItem.separator())

        menu.addItem(NSMenuItem(
            title: "New Ticket Window",
            action: #selector(newTicketWindow),
            keyEquivalent: "n"
        ))

        menu.addItem(NSMenuItem.separator())

        menu.addItem(NSMenuItem(
            title: "Quit LazyhandBar",
            action: #selector(NSApplication.terminate(_:)),
            keyEquivalent: "q"
        ))

        statusItem.menu = menu
    }

    // MARK: - Main Window

    private func setupMainWindow() {
        let mainWindow = MainWindowController.shared

        let content = PopoverContentView(
            viewModel: viewModel,
            ticketVM: ticketVM
        )
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .preferredColorScheme(.dark)

        mainWindow.window?.contentView = NSHostingView(rootView: content)
    }

    @objc private func toggleMainWindow() {
        MainWindowController.shared.toggle()
    }

    @objc private func showMainWindow() {
        MainWindowController.shared.show()
    }

    @objc private func newTicketWindow() {
        guard let ticket = ticketVM.selectedTicket else { return }
        WindowManager.shared.openDetailWindow(for: ticket, appUrl: viewModel.appUrl)
    }

    // MARK: - Application Lifecycle

    func applicationSupportsSecureRestorableState(_ app: NSApplication) -> Bool {
        return true
    }

    func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
        if !flag {
            MainWindowController.shared.show()
        }
        return true
    }
}

// MARK: - Notifications

extension Notification.Name {
    static let submitComment = Notification.Name("submitComment")
}
