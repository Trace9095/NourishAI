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
                Section {
                    if let profile {
                        settingsRow("Name", value: profile.name)
                        settingsRow("Age", value: "\(profile.age)")
                        settingsRow("Height", value: "\(Int(profile.heightCm)) cm")
                        settingsRow("Weight", value: "\(Int(profile.weightKg)) kg")
                        settingsRow("Goal", value: profile.nutritionGoal.displayName)
                        settingsRow("Activity", value: profile.activityLevel.displayName)
                    }
                } header: {
                    Text("Profile").foregroundColor(.gray)
                }
                .listRowBackground(Color.brandCard)

                // Targets section
                Section {
                    if let profile {
                        settingsRow("Calories", value: "\(profile.targetCalories) kcal", color: .macroCalories)
                        settingsRow("Protein", value: "\(profile.targetProtein)g", color: .macroProtein)
                        settingsRow("Carbs", value: "\(profile.targetCarbs)g", color: .macroCarbs)
                        settingsRow("Fat", value: "\(profile.targetFat)g", color: .macroFat)
                        settingsRow("Water", value: "\(profile.targetWaterMl) ml", color: .macroWater)
                    }
                } header: {
                    Text("Daily Targets").foregroundColor(.gray)
                }
                .listRowBackground(Color.brandCard)

                // Integrations
                Section {
                    Button {
                        requestHealthKit()
                    } label: {
                        HStack {
                            Label("Apple Health", systemImage: "heart.fill")
                                .foregroundColor(.macroProtein)
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
                } header: {
                    Text("Integrations").foregroundColor(.gray)
                }
                .listRowBackground(Color.brandCard)

                // Subscription
                Section {
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
                } header: {
                    Text("Subscription").foregroundColor(.gray)
                }
                .listRowBackground(Color.brandCard)

                // About
                Section {
                    settingsRow("Version", value: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0")
                    Link("Privacy Policy", destination: URL(string: "https://nourishhealthai.com/privacy")!)
                        .foregroundColor(.brandGreen)
                        .frame(minHeight: Layout.minTouchTarget)
                    Link("Terms of Service", destination: URL(string: "https://nourishhealthai.com/terms")!)
                        .foregroundColor(.brandGreen)
                        .frame(minHeight: Layout.minTouchTarget)
                    HStack {
                        Text("Built by")
                            .foregroundColor(.gray)
                        Link("Epic AI", destination: URL(string: "https://epicai.ai")!)
                            .foregroundColor(.brandGreen)
                    }
                } header: {
                    Text("About").foregroundColor(.gray)
                }
                .listRowBackground(Color.brandCard)
            }
            .scrollContentBackground(.hidden)
            .background(Color.brandDark)
            .navigationTitle("Settings")
            .foregroundColor(.white)
            .sheet(isPresented: $showSubscription) {
                SubscriptionView()
            }
        }
    }

    private func settingsRow(_ label: String, value: String, color: Color = .white) -> some View {
        HStack {
            Text(label)
                .foregroundColor(.gray)
            Spacer()
            Text(value)
                .foregroundColor(color)
                .fontWeight(.medium)
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
