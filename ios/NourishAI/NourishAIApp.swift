import SwiftUI
import SwiftData

@main
struct NourishAIApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    let container: ModelContainer

    init() {
        let schema = Schema([
            UserProfile.self,
            DailyNutrition.self,
            FoodEntry.self,
            SavedFood.self,
            DailyWaterIntake.self,
            WaterEntry.self,
        ])
        let config = ModelConfiguration(isStoredInMemoryOnly: false)
        container = try! ModelContainer(for: schema, configurations: [config])
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(container)
    }
}
