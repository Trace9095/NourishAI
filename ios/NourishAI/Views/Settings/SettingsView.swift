import SwiftUI
import SwiftData

struct SettingsView: View {
    @Query private var profiles: [UserProfile]
    @State private var showSubscription = false
    @State private var healthKitRequested = false

    private var profile: UserProfile? { profiles.first }

    var body: some View {
        NavigationStack {
            List {
                // Profile section
                Section("Profile") {
                    if let profile {
                        LabeledContent("Name", value: profile.name)
                        LabeledContent("Age", value: "\(profile.age)")
                        LabeledContent("Height", value: "\(Int(profile.heightCm)) cm")
                        LabeledContent("Weight", value: "\(Int(profile.weightKg)) kg")
                        LabeledContent("Goal", value: profile.nutritionGoal.displayName)
                        LabeledContent("Activity", value: profile.activityLevel.displayName)
                    }
                }

                // Targets section
                Section("Daily Targets") {
                    if let profile {
                        LabeledContent("Calories", value: "\(profile.targetCalories) kcal")
                        LabeledContent("Protein", value: "\(profile.targetProtein)g")
                        LabeledContent("Carbs", value: "\(profile.targetCarbs)g")
                        LabeledContent("Fat", value: "\(profile.targetFat)g")
                        LabeledContent("Water", value: "\(profile.targetWaterMl) ml")
                    }
                }

                // Integrations
                Section("Integrations") {
                    Button {
                        requestHealthKit()
                    } label: {
                        HStack {
                            Label("Apple Health", systemImage: "heart.fill")
                            Spacer()
                            if profile?.healthKitEnabled == true {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundColor(.brandGreen)
                            } else {
                                Text("Connect")
                                    .foregroundColor(.brandGreen)
                            }
                        }
                    }
                    .frame(minHeight: Layout.minTouchTarget)
                }

                // Subscription
                Section("Subscription") {
                    Button {
                        showSubscription = true
                    } label: {
                        HStack {
                            Label("NourishAI Pro", systemImage: "star.fill")
                                .foregroundColor(.brandOrange)
                            Spacer()
                            Text(profile?.subscriptionTier == "pro" ? "Active" : "Upgrade")
                                .foregroundColor(.brandGreen)
                        }
                    }
                    .frame(minHeight: Layout.minTouchTarget)
                }

                // About
                Section("About") {
                    LabeledContent("Version", value: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0")
                    Link("Privacy Policy", destination: URL(string: "https://nourishhealthai.com/privacy")!)
                        .frame(minHeight: Layout.minTouchTarget)
                    Link("Terms of Service", destination: URL(string: "https://nourishhealthai.com/terms")!)
                        .frame(minHeight: Layout.minTouchTarget)
                    HStack {
                        Text("Built by")
                        Link("Epic AI", destination: URL(string: "https://epicai.ai")!)
                            .foregroundColor(.brandGreen)
                    }
                }
            }
            .navigationTitle("Settings")
            .sheet(isPresented: $showSubscription) {
                SubscriptionView()
            }
        }
    }

    private func requestHealthKit() {
        Task {
            do {
                try await HealthKitManager.shared.requestAuthorization()
                if let profile {
                    profile.healthKitEnabled = true

                    // Pull height and weight from HealthKit
                    if let height = try await HealthKitManager.shared.getHeight() {
                        profile.heightCm = height
                    }
                    if let weight = try await HealthKitManager.shared.getWeight() {
                        profile.weightKg = weight
                    }
                    if let age = await HealthKitManager.shared.getAge() {
                        profile.age = age
                    }
                }
            } catch {
                print("HealthKit auth error: \(error)")
            }
        }
    }
}
