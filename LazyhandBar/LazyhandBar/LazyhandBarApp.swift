import SwiftUI

@main
struct LazyhandBarApp: App {
    @StateObject private var viewModel = AppViewModel()

    var body: some Scene {
        MenuBarExtra("Lazyhand", systemImage: "hand.wave.fill") {
            PopoverContentView(viewModel: viewModel)
                .frame(width: 360, height: 560)
        }
        .menuBarExtraStyle(.window)
    }
}
