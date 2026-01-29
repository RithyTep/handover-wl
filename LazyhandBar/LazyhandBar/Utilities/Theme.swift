import SwiftUI

enum Theme {
    // Backgrounds
    static let bg = Color(red: 0.11, green: 0.11, blue: 0.18)
    static let cardBg = Color(red: 0.15, green: 0.15, blue: 0.23)
    static let cardBgHover = Color(red: 0.18, green: 0.18, blue: 0.27)
    static let selectedBg = Color(red: 0.16, green: 0.26, blue: 0.25)

    // Accent
    static let accent = Color(red: 0.31, green: 0.80, blue: 0.76)
    static let accentRed = Color(red: 1.0, green: 0.42, blue: 0.42)

    // Text
    static let textPrimary = Color.white
    static let textSecondary = Color(white: 0.55)
    static let textTertiary = Color(white: 0.38)

    // Divider
    static let divider = Color(white: 0.25)
}

// MARK: - Card Modifier

struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(14)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Theme.cardBg)
            )
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardStyle())
    }
}
