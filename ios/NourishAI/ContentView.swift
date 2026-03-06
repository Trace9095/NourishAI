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
