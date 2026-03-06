import SwiftUI

// MARK: - API Configuration

enum APIConfig {
    #if DEBUG
    static let baseURL = "https://nourish-ai-ten.vercel.app/api"
    #else
    static let baseURL = "https://nourishhealthai.com/api"
    #endif

    static let registerDevice = "\(baseURL)/register-device"
    static let analyzeFood = "\(baseURL)/analyze-food"
    static let analyzeDescription = "\(baseURL)/analyze-description"
    static let lookupBarcode = "\(baseURL)/lookup-barcode"
    static let scanCount = "\(baseURL)/scan-count"
    static let verifySubscription = "\(baseURL)/verify-subscription"
}

// MARK: - Brand Colors

extension Color {
    nonisolated static let brandGreen = Color(hex: "34C759")
    nonisolated static let brandGreenDark = Color(hex: "2AA44A")
    nonisolated static let brandOrange = Color(hex: "FF9500")
    nonisolated static let brandDark = Color(hex: "0A0A14")
    nonisolated static let brandCard = Color(hex: "1A1A2E")
    nonisolated static let brandBorder = Color(hex: "2A2A40")

    // Macro colors
    nonisolated static let macroProtein = Color(hex: "FF6B6B")
    nonisolated static let macroCarbs = Color(hex: "4ECDC4")
    nonisolated static let macroFat = Color(hex: "FFE66D")
    nonisolated static let macroCalories = Color(hex: "FF9500")
    nonisolated static let macroWater = Color(hex: "5AC8FA")

    nonisolated init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Layout Constants

enum Layout {
    static let cornerRadius: CGFloat = 16
    static let cardCornerRadius: CGFloat = 20
    static let buttonCornerRadius: CGFloat = 14
    static let minTouchTarget: CGFloat = 44
    static let horizontalPadding: CGFloat = 20
    static let sectionSpacing: CGFloat = 24
}

// MARK: - Subscription Product IDs

enum SubscriptionProductID {
    static let proMonthly = "com.nourishai.subscription.pro.monthly"
    static let proAnnual = "com.nourishai.subscription.pro.annual"
    static let all: [String] = [proMonthly, proAnnual]
}

// MARK: - App Group

enum AppGroupID {
    static let main = "group.com.epicai.nourishai"
}
