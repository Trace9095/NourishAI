// MIGRATION NOTE: This view uses StoreKit 2 directly.
// After adding RevenueCat SPM, update purchase/restore calls to use RevenueCatManager.shared
// See RevenueCatManager.swift for the migration path.

import SwiftUI
import SwiftData
import StoreKit

struct SubscriptionView: View {
    @Environment(\.dismiss) private var dismiss
    @Query private var profiles: [UserProfile]
    @State private var subscriptionManager = SubscriptionManager.shared

    @State private var selectedPlan: Plan = .annual
    @State private var isPurchasing = false
    @State private var errorMessage: String?

    private var profile: UserProfile? { profiles.first }

    enum Plan {
        case monthly, annual
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    VStack(spacing: 12) {
                        Image(systemName: "star.fill")
                            .font(.system(size: 40))
                            .foregroundColor(.brandOrange)

                        Text("Upgrade to Pro")
                            .font(.title.bold())
                            .foregroundColor(.white)

                        Text("Unlock unlimited AI food scanning and premium features")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 20)
                    }
                    .padding(.top, 20)

                    // Feature list
                    VStack(alignment: .leading, spacing: 16) {
                        featureRow(icon: "camera.fill", title: "Unlimited AI Photo Scans", subtitle: "Snap unlimited photos for instant macro analysis")
                        featureRow(icon: "bookmark.fill", title: "Saved Meals Library", subtitle: "Save your favorite meals for one-tap logging")
                        featureRow(icon: "chart.bar.fill", title: "Advanced Analytics", subtitle: "Detailed macro trends, weekly summaries, insights")
                        featureRow(icon: "applewatch", title: "Apple Watch App", subtitle: "Check macros and log water from your wrist")
                        featureRow(icon: "drop.fill", title: "Water Tracking", subtitle: "Track daily hydration with smart reminders")
                        featureRow(icon: "brain.fill", title: "AI Weekly Insights", subtitle: "Personalized nutrition recommendations")
                    }
                    .padding()
                    .background(Color.brandCard)
                    .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
                    .padding(.horizontal, 20)

                    // Plan selection
                    VStack(spacing: 12) {
                        if let annual = subscriptionManager.annualProduct {
                            planCard(
                                plan: .annual,
                                title: "Annual",
                                price: annual.displayPrice + "/year",
                                perMonth: "$3.33/mo",
                                badge: "Save 58%"
                            )
                        } else {
                            planCard(
                                plan: .annual,
                                title: "Annual",
                                price: "$39.99/year",
                                perMonth: "$3.33/mo",
                                badge: "Save 58%"
                            )
                        }

                        if let monthly = subscriptionManager.monthlyProduct {
                            planCard(
                                plan: .monthly,
                                title: "Monthly",
                                price: monthly.displayPrice + "/month",
                                perMonth: nil,
                                badge: nil
                            )
                        } else {
                            planCard(
                                plan: .monthly,
                                title: "Monthly",
                                price: "$7.99/month",
                                perMonth: nil,
                                badge: nil
                            )
                        }
                    }
                    .padding(.horizontal, 20)

                    // Error message
                    if let errorMessage {
                        Text(errorMessage)
                            .font(.caption)
                            .foregroundColor(.red)
                            .padding(.horizontal, 20)
                    }

                    // Subscribe button
                    Button {
                        Task { await subscribe() }
                    } label: {
                        HStack {
                            if isPurchasing {
                                ProgressView()
                                    .tint(.brandDark)
                            }
                            Text(isPurchasing ? "Processing..." : "Start Free Trial")
                        }
                        .font(.headline)
                        .foregroundColor(.brandDark)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.brandGreen)
                        .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
                    }
                    .frame(minHeight: Layout.minTouchTarget)
                    .padding(.horizontal, 20)
                    .disabled(isPurchasing)

                    // Subscription title, length, price — Apple Guideline 3.1.2(c)
                    VStack(spacing: 6) {
                        Text(selectedPlan == .annual
                             ? "NourishAI Pro · Annual Subscription"
                             : "NourishAI Pro · Monthly Subscription")
                            .font(.caption.weight(.semibold))
                            .foregroundColor(.gray)

                        Text(selectedPlan == .annual
                             ? "7-day free trial, then $39.99 per year (billed annually)"
                             : "7-day free trial, then $7.99 per month (billed monthly)")
                            .font(.caption)
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)

                        Text("Subscription automatically renews unless cancelled at least 24 hours before the end of the current period. Your Apple ID account will be charged at confirmation of purchase. You can cancel anytime in Settings > Apple ID > Subscriptions.")
                            .font(.caption2)
                            .foregroundColor(.gray.opacity(0.7))
                            .multilineTextAlignment(.center)
                            .fixedSize(horizontal: false, vertical: true)
                            .padding(.horizontal, 8)

                        HStack(spacing: 16) {
                            Link("Terms of Use", destination: URL(string: "https://nourishhealthai.com/terms")!)
                                .font(.caption2)
                                .foregroundColor(.brandGreen)
                            Link("Privacy Policy", destination: URL(string: "https://nourishhealthai.com/privacy")!)
                                .font(.caption2)
                                .foregroundColor(.brandGreen)
                            Button("Restore Purchases") {
                                // TODO: After RevenueCat SPM is added, replace with:
                                // Task { try? await RevenueCatManager.shared.restorePurchases() }
                                Task { await subscriptionManager.restorePurchases() }
                            }
                                .font(.caption2)
                                .foregroundColor(.brandGreen)
                        }
                        .padding(.top, 4)
                    }
                    .padding(.bottom, 20)
                }
            }
            .background(Color.brandDark)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.gray)
                            .font(.title3)
                    }
                    .frame(minWidth: Layout.minTouchTarget, minHeight: Layout.minTouchTarget)
                }
            }
            .task {
                await subscriptionManager.loadProducts()
            }
        }
    }

    private func featureRow(icon: String, title: String, subtitle: String) -> some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.body)
                .foregroundColor(.brandGreen)
                .frame(width: 24)
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline.bold())
                    .foregroundColor(.white)
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
        }
    }

    private func planCard(plan: Plan, title: String, price: String, perMonth: String?, badge: String?) -> some View {
        Button {
            selectedPlan = plan
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 8) {
                        Text(title)
                            .font(.headline)
                            .foregroundColor(.white)
                        if let badge {
                            Text(badge)
                                .font(.caption2.bold())
                                .foregroundColor(.brandDark)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 2)
                                .background(Color.brandGreen)
                                .clipShape(Capsule())
                        }
                    }
                    Text(price)
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    if let perMonth {
                        Text(perMonth)
                            .font(.caption)
                            .foregroundColor(.brandGreen)
                    }
                }
                Spacer()
                Image(systemName: selectedPlan == plan ? "checkmark.circle.fill" : "circle")
                    .font(.title2)
                    .foregroundColor(selectedPlan == plan ? .brandGreen : .gray)
            }
            .padding()
            .background(Color.brandCard)
            .overlay(
                RoundedRectangle(cornerRadius: Layout.cardCornerRadius)
                    .strokeBorder(selectedPlan == plan ? Color.brandGreen : Color.brandCard, lineWidth: 2)
            )
            .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
        }
        .frame(minHeight: Layout.minTouchTarget)
    }

    private func subscribe() async {
        isPurchasing = true
        errorMessage = nil

        let product: Product?
        if selectedPlan == .annual {
            product = subscriptionManager.annualProduct
        } else {
            product = subscriptionManager.monthlyProduct
        }

        guard let product else {
            errorMessage = "Product not available. Please try again."
            isPurchasing = false
            return
        }

        do {
            // TODO: After RevenueCat SPM is added, replace with:
            // try await RevenueCatManager.shared.purchasePackage(rcPackage)
            let success = try await subscriptionManager.purchase(product)
            isPurchasing = false
            if success {
                // Update profile immediately so UI reflects pro status
                profile?.subscriptionTier = "pro"
                profile?.subscriptionExpiresAt = await subscriptionManager.currentSubscriptionExpiry
                dismiss()
            }
        } catch {
            errorMessage = error.localizedDescription
            isPurchasing = false
        }
    }
}
