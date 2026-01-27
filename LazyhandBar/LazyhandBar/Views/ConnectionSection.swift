import SwiftUI

struct ConnectionSection: View {
    @ObservedObject var viewModel: AppViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Connection")
                .font(.headline)

            LabeledField("App URL") {
                TextField("https://handover-production...", text: $viewModel.appUrl)
            }

            LabeledField("Slack User Token") {
                SecureField("xoxp-...", text: $viewModel.token)
            }

            LabeledField("Channel ID") {
                TextField("C09S9U5ND5X", text: $viewModel.channelId)
            }

            LabeledField("Mentions") {
                TextField("<@U123> <@U456>", text: $viewModel.mentions)
            }
        }
    }
}

private struct LabeledField<Content: View>: View {
    let label: String
    let content: Content

    init(_ label: String, @ViewBuilder content: () -> Content) {
        self.label = label
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
            content
                .textFieldStyle(.roundedBorder)
                .controlSize(.small)
        }
    }
}
