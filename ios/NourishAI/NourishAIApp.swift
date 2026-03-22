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

        // RevenueCat (activate after adding SPM package from https://github.com/RevenueCat/purchases-ios.git)
        // RevenueCatManager.shared.configure()
        // Note: SubscriptionManager products are loaded lazily in SubscriptionView via .task { }
        // After migration, RevenueCatManager.shared.configure() replaces that lazy load.
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(container)
    }
}
