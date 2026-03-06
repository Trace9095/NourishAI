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
        .onAppear {
            if !hasCompletedOnboarding {
                showOnboarding = true
            }
        }
    }
}

struct MainTabView: View {
    @Binding var selectedTab: Int

    var body: some View {
        TabView(selection: $selectedTab) {
            Tab("Dashboard", systemImage: "chart.pie.fill", value: 0) {
                DashboardView()
            }

            Tab("Food Log", systemImage: "fork.knife", value: 1) {
                FoodLogView()
            }

            Tab("Progress", systemImage: "chart.line.uptrend.xyaxis", value: 2) {
                NutritionProgressView()
            }

            Tab("Settings", systemImage: "gearshape.fill", value: 3) {
                SettingsView()
            }
        }
        .tint(.brandGreen)
    }
}

#Preview {
    ContentView()
        .modelContainer(for: [UserProfile.self, DailyNutrition.self, FoodEntry.self], inMemory: true)
}
