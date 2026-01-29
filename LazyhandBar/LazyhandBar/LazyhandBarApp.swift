import SwiftUI

@main
struct LazyhandBarApp: App {
    @StateObject private var viewModel = AppViewModel()
    @StateObject private var ticketVM = TicketListViewModel()

    var body: some Scene {
        MenuBarExtra {
            PopoverContentView(viewModel: viewModel, ticketVM: ticketVM)
                .frame(width: 380, height: 600)
        } label: {
            menuBarLabel
        }
        .menuBarExtraStyle(.window)
    }

    private var menuBarLabel: some View {
        HStack(spacing: 2) {
            Image(systemName: "hand.wave")
                .symbolRenderingMode(.monochrome)
            if ticketVM.ticketCount > 0 {
                Text("\(ticketVM.ticketCount)")
                    .font(.system(size: 10, weight: .bold))
                    .monospacedDigit()
            }
        }
    }

}
