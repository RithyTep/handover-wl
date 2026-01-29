import SwiftUI

struct SettingsView: View {
    @ObservedObject var viewModel: AppViewModel
    @ObservedObject var ticketVM: TicketListViewModel

    var body: some View {
        ScrollView {
            VStack(spacing: 10) {
                ConnectionSection(viewModel: viewModel)
                ScheduleSection(viewModel: viewModel)
                PreferencesSection(viewModel: viewModel, ticketVM: ticketVM)
                StatusSection(viewModel: viewModel)
            }
            .padding(16)
        }
    }
}
