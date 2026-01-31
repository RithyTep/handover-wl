import SwiftUI

enum Theme {
    // Backgrounds
    static let bg = Color(red: 0.11, green: 0.11, blue: 0.18)
    static let cardBg = Color(red: 0.15, green: 0.15, blue: 0.23)
    static let cardBgHover = Color(red: 0.18, green: 0.18, blue: 0.27)
    static let selectedBg = Color(red: 0.16, green: 0.26, blue: 0.25)
    static let detailBg = Color(red: 0.09, green: 0.09, blue: 0.15)
    static let sectionBg = Color(red: 0.12, green: 0.12, blue: 0.19)
    static let inputBg = Color(red: 0.13, green: 0.13, blue: 0.21)

    // Accent
    static let accent = Color(red: 0.31, green: 0.80, blue: 0.76)
    static let accentRed = Color(red: 1.0, green: 0.42, blue: 0.42)
    static let accentBlue = Color(red: 0.40, green: 0.60, blue: 0.95)

    // Text
    static let textPrimary = Color.white
    static let textSecondary = Color(white: 0.55)
    static let textTertiary = Color(white: 0.38)
    static let textPlaceholder = Color(white: 0.45)

    // Borders & Dividers
    static let divider = Color(white: 0.25)
    static let border = Color(white: 0.20)
    static let borderSubtle = Color(white: 0.15)

    // Layout constants
    enum Layout {
        static let popoverHeight: CGFloat = 860
        static let ticketsWidth: CGFloat = 1400
        static let settingsWidth: CGFloat = 480
        static let listCompactWidth: CGFloat = 320
        static let detailContentWidth: CGFloat = 720
        static let metadataSidebarWidth: CGFloat = 300
    }

    // Spacing scale (Jira-inspired, more generous)
    enum Spacing {
        static let xxs: CGFloat = 4
        static let xs: CGFloat = 8
        static let sm: CGFloat = 12
        static let md: CGFloat = 16
        static let lg: CGFloat = 20
        static let xl: CGFloat = 24
        static let xxl: CGFloat = 32
        static let xxxl: CGFloat = 40
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

// MARK: - Pointer Cursor

struct PointerCursor: ViewModifier {
    func body(content: Content) -> some View {
        content.onHover { hovering in
            if hovering {
                NSCursor.pointingHand.push()
            } else {
                NSCursor.pop()
            }
        }
    }
}

// MARK: - Scale Press Button Style

struct ScalePressStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.96 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardStyle())
    }

    func pointerCursor() -> some View {
        modifier(PointerCursor())
    }
}
