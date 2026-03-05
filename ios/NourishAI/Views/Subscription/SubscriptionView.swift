import SwiftUI

struct SubscriptionView: View {
    @Environment(\.dismiss) private var dismiss

    @State private var selectedPlan: Plan = .annual
    @State private var isPurchasing = false

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
                        planCard(
                            plan: .annual,
                            title: "Annual",
                            price: "$39.99/year",
                            perMonth: "$3.33/mo",
                            badge: "Save 58%"
                        )
                        planCard(
                            plan: .monthly,
                            title: "Monthly",
                            price: "$7.99/month",
                            perMonth: nil,
                            badge: nil
                        )
                    }
                    .padding(.horizontal, 20)

                    // Subscribe button
                    Button {
                        subscribe()
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

                    // Legal text
                    VStack(spacing: 4) {
                        Text("7-day free trial, then \(selectedPlan == .annual ? "$39.99/year" : "$7.99/month")")
                            .font(.caption)
                            .foregroundColor(.gray)
                        Text("Cancel anytime. Recurring billing.")
                            .font(.caption2)
                            .foregroundColor(.gray.opacity(0.7))
                        HStack(spacing: 16) {
                            Button("Terms") {}
                                .font(.caption2)
                                .foregroundColor(.brandGreen)
                            Button("Privacy") {}
                                .font(.caption2)
                                .foregroundColor(.brandGreen)
                            Button("Restore Purchases") {}
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

    private func subscribe() {
        isPurchasing = true
        // In real app, this calls StoreKit 2:
        // let productId = selectedPlan == .annual
        //     ? SubscriptionProductID.proAnnual
        //     : SubscriptionProductID.proMonthly
        // await SubscriptionManager.shared.purchase(productId)
    }
}
