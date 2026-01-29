import SwiftUI

struct ConnectionSection: View {
    @ObservedObject var viewModel: AppViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionHeader(icon: "link", title: "Connection")

            VStack(spacing: 8) {
                FieldRow(label: "App URL") {
                    TextField("https://handover-production...", text: $viewModel.appUrl)
                }
                FieldRow(label: "Token") {
                    SecureField("xoxp-...", text: $viewModel.token)
                }
                FieldRow(label: "Channel") {
                    TextField("C09S9U5ND5X", text: $viewModel.channelId)
                }
                FieldRow(label: "Mentions") {
                    TextField("<@U123> <@U456>", text: $viewModel.mentions)
                }
            }
        }
        .cardStyle()
    }
}

private struct FieldRow<Content: View>: View {
    let label: String
    let content: Content

    init(label: String, @ViewBuilder content: () -> Content) {
        self.label = label
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(label)
                .font(.system(size: 10))
                .foregroundStyle(Theme.textTertiary)
            content
                .textFieldStyle(.plain)
                .font(.system(size: 11))
                .foregroundStyle(Theme.textPrimary)
                .padding(8)
                .background(
                    RoundedRectangle(cornerRadius: 6)
                        .fill(Theme.bg)
                )
                .controlSize(.small)
        }
    }
}
