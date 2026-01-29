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

    // Spacing scale (4px base)
    enum Spacing {
        static let xxs: CGFloat = 2
        static let xs: CGFloat = 4
        static let sm: CGFloat = 6
        static let md: CGFloat = 8
        static let lg: CGFloat = 12
        static let xl: CGFloat = 16
        static let xxl: CGFloat = 20
    }

    // Font size scale
    enum FontSize {
        static let caption: CGFloat = 9
        static let footnote: CGFloat = 10
        static let subheadline: CGFloat = 11
        static let body: CGFloat = 12
        static let headline: CGFloat = 14
    }
}

// MARK: - Reusable Section Header

struct SectionHeader: View {
    let icon: String
    let title: String

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 11))
                .foregroundStyle(Theme.accent)
            Text(title)
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(Theme.textPrimary)
        }
    }
}

// MARK: - Card Modifier

struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(.horizontal, 14)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Theme.cardBg)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Theme.divider.opacity(0.3), lineWidth: 0.5)
            )
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardStyle())
    }
}
