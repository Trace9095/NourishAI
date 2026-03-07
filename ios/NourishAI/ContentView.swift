import SwiftUI
import SwiftData

struct ContentView: View {
    @Query private var profiles: [UserProfile]
    @State private var showOnboarding = false
    @State private var selectedTab = 0

    private var hasCompletedOnboarding: Bool {
        guard let profile = profiles.first else { return false }
        return profile.onboardingComplete
    }

    var body: some View {
        Group {
            if hasCompletedOnboarding {
                MainTabView(selectedTab: $selectedTab)
            } else {
                OnboardingContainerView(showOnboarding: $showOnboarding)
            }
        }
        .preferredColorScheme(.dark)
        .onAppear {
            if !hasCompletedOnboarding {
                showOnboarding = true
            }
        }
        .task {
            // Ensure device is registered with backend on every launch
            if let profile = profiles.first, profile.onboardingComplete, profile.serverUserId == nil {
                do {
                    let response = try await NourishAPIManager.shared.registerDevice()
                    await MainActor.run {
                        profile.serverUserId = response.userId
                    }
                } catch {
                    print("[ContentView] Device registration failed: \(error)")
                }
            }
            // Sync subscription status with StoreKit on launch
            await SubscriptionManager.shared.updatePurchasedProducts()
            if let profile = profiles.first {
                await MainActor.run {
                    profile.subscriptionTier = SubscriptionManager.shared.isPro ? "pro" : "free"
                }
            }
        }
    }
}

struct MainTabView: View {
    @Binding var selectedTab: Int

    var body: some View {
        TabView(selection: $selectedTab) {
            DashboardView()
                .tabItem {
                    Label("Dashboard", systemImage: "chart.pie.fill")
                }
                .tag(0)

            FoodLogView()
                .tabItem {
                    Label("Food Log", systemImage: "fork.knife")
                }
                .tag(1)

            NutritionProgressView()
                .tabItem {
                    Label("Progress", systemImage: "chart.line.uptrend.xyaxis")
                }
                .tag(2)

            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gearshape.fill")
                }
                .tag(3)
        }
        .tint(.brandGreen)
    }
}

#Preview {
    ContentView()
        .modelContainer(for: [UserProfile.self, DailyNutrition.self, FoodEntry.self], inMemory: true)
}
