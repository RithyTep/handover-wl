import SwiftUI

struct TicketDetailView: View {
    @StateObject private var detailVM: TicketDetailViewModel
    let onClose: () -> Void

    init(ticket: Ticket, appUrl: String, onClose: @escaping () -> Void) {
        _detailVM = StateObject(wrappedValue: TicketDetailViewModel(
            ticket: ticket, appUrl: appUrl
        ))
        self.onClose = onClose
    }

    var body: some View {
        VStack(spacing: 16) {
            // Header
            HStack {
                Text(detailVM.ticket.key)
                    .font(.system(size: 17, weight: .bold, design: .monospaced))
                    .foregroundStyle(Theme.accent)

                Spacer()

                Button(action: onClose) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 18))
                        .foregroundStyle(Theme.textTertiary)
                }
                .buttonStyle(.plain)
            }
            .padding()

            // Title
            Text(detailVM.ticket.summary)
                .font(.system(size: 15))
                .foregroundStyle(Theme.textPrimary)
                .padding(.horizontal)

            Spacer()

            Text("Open in Jira for full details")
                .font(.system(size: 13))
                .foregroundStyle(Theme.textSecondary)

            if let url = URL(string: detailVM.ticket.jiraUrl) {
                Link("Open in Jira", destination: url)
                    .padding()
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.detailBg)
    }
}
