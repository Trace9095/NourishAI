import SwiftUI
import SwiftData

@main
struct NourishAIApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: [
            UserProfile.self,
            DailyNutrition.self,
            FoodEntry.self,
            SavedFood.self,
            DailyWaterIntake.self,
        ])
    }
}
