// RevenueCatManager.swift
// NourishAI
//
// RevenueCat Integration — SDK-Ready Scaffold
//
// MIGRATION FROM STOREKIT 2:
// This app has an existing SubscriptionManager.swift using StoreKit 2.
// Migration path:
//   1. Add RevenueCat SPM: File → Add Package Dependencies
//      → https://github.com/RevenueCat/purchases-ios.git
//   2. Set your API key below (from app.revenuecat.com → API Keys → iOS Key)
//   3. In NourishAIApp.swift, replace SubscriptionManager.shared.loadProducts()
//      with RevenueCatManager.shared.configure()
//   4. Replace SubscriptionManager references in views with RevenueCatManager
//   5. Delete or archive SubscriptionManager.swift once RevenueCat is verified working
//
// RevenueCat handles receipt validation, subscription status, and cross-platform sync.

import Foundation
import SwiftUI

// MARK: - RevenueCat Import
// Once SPM package is added, uncomment:
// import RevenueCat

// MARK: - Subscription Tier
enum RCSubscriptionTier: String, CaseIterable {
    case free = "free"
    case proMonthly = "com.epicai.nourishai.pro.monthly"
    case proAnnual = "com.epicai.nourishai.pro.annual"

    var displayName: String {
        switch self {
        case .free: return "Free"
        case .proMonthly: return "Pro Monthly"
        case .proAnnual: return "Pro Annual"
        }
    }

    var price: String {
        switch self {
        case .free: return "Free"
        case .proMonthly: return "$7.99/mo"
        case .proAnnual: return "$59.99/yr"
        }
    }

    var features: [String] {
        switch self {
        case .free:
            return [
                "5 AI meal analyses/day",
                "Basic nutrition tracking",
                "Manual food logging"
            ]
        case .proMonthly, .proAnnual:
            return [
                "Unlimited AI meal analysis",
                "Barcode scanner",
                "Restaurant menu scanning",
                "Personalized macro goals",
                "Advanced progress insights",
                "Priority AI responses"
            ]
        }
    }

    var isPro: Bool {
        return self == .proMonthly || self == .proAnnual
    }
}

// MARK: - Package Model (pre-SDK stub)
struct RCPackage: Identifiable {
    let id = UUID()
    let productIdentifier: String
    let localizedPriceString: String
    let packageType: String // "MONTHLY" or "ANNUAL"
}

// MARK: - RevenueCatManager
@MainActor
final class RevenueCatManager: ObservableObject {

    static let shared = RevenueCatManager()

    // TODO: Get your iOS API key from app.revenuecat.com → [Project] → API Keys
    // Format: appl_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    private let apiKey = "REVENUECAT_IOS_API_KEY_PLACEHOLDER"

    @Published var currentTier: RCSubscriptionTier = .free
    @Published var availablePackages: [RCPackage] = []
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    @Published var isPro: Bool = false

    private init() {}

    // MARK: - Configure
    /// Called from NourishAIApp entry point.
    /// Replaces SubscriptionManager.shared.loadProducts() after migration.
    func configure() {
        // Once RevenueCat SPM is added, replace with:
        // Purchases.configure(withAPIKey: apiKey)
        // Purchases.logLevel = .debug // remove before release
        print("[RevenueCatManager] Configure called — add RevenueCat SPM to activate")
        Task { await checkSubscription() }
    }

    // MARK: - Fetch Offerings
    func fetchOfferings() {
        isLoading = true
        // Once RevenueCat SPM is added, replace with:
        // Purchases.shared.getOfferings { offerings, error in
        //     DispatchQueue.main.async {
        //         if let packages = offerings?.current?.availablePackages {
        //             self.availablePackages = packages.map { ... }
        //         }
        //         self.isLoading = false
        //     }
        // }

        availablePackages = [
            RCPackage(productIdentifier: "com.epicai.nourishai.pro.monthly",
                      localizedPriceString: "$7.99",
                      packageType: "MONTHLY"),
            RCPackage(productIdentifier: "com.epicai.nourishai.pro.annual",
                      localizedPriceString: "$59.99",
                      packageType: "ANNUAL")
        ]
        isLoading = false
    }

    // MARK: - Check Subscription
    func checkSubscription() async {
        // Once RevenueCat SPM is added, replace with:
        // do {
        //     let customerInfo = try await Purchases.shared.customerInfo()
        //     let isActive = customerInfo.entitlements["pro"]?.isActive == true
        //     self.isPro = isActive
        //     self.currentTier = isActive ? .proMonthly : .free
        // } catch {
        //     print("[RevenueCatManager] checkSubscription error: \(error)")
        // }
        print("[RevenueCatManager] checkSubscription — activate SDK to enable")
    }

    // MARK: - Purchase Package
    func purchasePackage(_ package: RCPackage) async throws {
        await MainActor.run { isLoading = true }
        defer { Task { await MainActor.run { self.isLoading = false } } }

        // Once RevenueCat SPM is added, replace with:
        // let (_, customerInfo, userCancelled) = try await Purchases.shared.purchase(package: package)
        // if !userCancelled {
        //     let isActive = customerInfo.entitlements["pro"]?.isActive == true
        //     await MainActor.run {
        //         self.isPro = isActive
        //         self.currentTier = isActive ? .proMonthly : .free
        //     }
        // }
        print("[RevenueCatManager] purchasePackage — activate SDK to enable real purchases")
    }

    // MARK: - Restore Purchases
    func restorePurchases() async throws {
        await MainActor.run { isLoading = true }
        defer { Task { await MainActor.run { self.isLoading = false } } }

        // Once RevenueCat SPM is added, replace with:
        // let customerInfo = try await Purchases.shared.restorePurchases()
        // let isActive = customerInfo.entitlements["pro"]?.isActive == true
        // await MainActor.run {
        //     self.isPro = isActive
        //     self.currentTier = isActive ? .proMonthly : .free
        //     if !isActive { self.errorMessage = "No active subscriptions found." }
        // }
        print("[RevenueCatManager] restorePurchases — activate SDK to enable")
    }

    // MARK: - Sync with Backend
    /// After successful purchase, sync subscription status to NourishAI backend
    func syncSubscriptionToBackend() async {
        // Once activated, call NourishAPIManager to update subscription status
        // await NourishAPIManager.shared.verifySubscription()
        print("[RevenueCatManager] syncSubscriptionToBackend — activate SDK to enable")
    }
}
