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
        #if DEBUG
        seedScreenshotData(container: container)
        #endif
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(container)
    }

    @MainActor
    private func seedScreenshotData(container: ModelContainer) {
        let context = container.mainContext
        let descriptor = FetchDescriptor<UserProfile>()
        guard (try? context.fetchCount(descriptor)) == 0 else { return }

        let profile = UserProfile(
            name: "Trace",
            age: 28,
            heightCm: 194,
            weightKg: 93,
            biologicalSex: .male,
            activityLevel: .active,
            nutritionGoal: .cut,
            targetCalories: 2777,
            targetProtein: 205,
            targetCarbs: 302,
            targetFat: 83,
            targetWaterMl: 3000,
            onboardingComplete: true,
            subscriptionTier: "pro"
        )
        context.insert(profile)

        let cal = Calendar.current
        let now = Date()

        // Today
        let today = DailyNutrition(
            totalCalories: 1847,
            totalProtein: 142,
            totalCarbs: 198,
            totalFat: 54,
            totalFiber: 22,
            totalSugar: 38,
            totalSodium: 1650
        )
        context.insert(today)

        let meals: [(String, String, MealType, EntryMethod, Int, Double, Double, Double, Int, Int)] = [
            ("Greek Yogurt & Granola Bowl", "1 bowl (350g)", .breakfast, .aiPhoto, 485, 32, 58, 14, 7, 45),
            ("Protein Iced Coffee", "16 oz", .breakfast, .manual, 180, 25, 12, 3, 8, 15),
            ("Grilled Chicken Caesar Salad", "1 large salad", .lunch, .aiPhoto, 620, 48, 28, 32, 12, 30),
            ("RXBAR Protein Bar", "1 bar (52g)", .snack, .barcode, 210, 12, 24, 9, 15, 0),
            ("Banana & Almond Butter", "1 banana + 2 tbsp", .snack, .aiDescription, 352, 25, 76, 6, 16, 30),
        ]

        var entries: [FoodEntry] = []
        let hours = [7, 8, 12, 15, 16]
        for (i, m) in meals.enumerated() {
            let entry = FoodEntry(
                name: m.0,
                servingSize: m.1,
                mealType: m.2,
                entryMethod: m.3,
                calories: m.4,
                protein: m.5,
                carbs: m.6,
                fat: m.7,
                loggedAt: cal.date(bySettingHour: hours[i], minute: 30, second: 0, of: now)!
            )
            entry.dailyNutrition = today
            context.insert(entry)
            entries.append(entry)
        }
        today.entries = entries

        // Past 6 days for progress charts
        for daysAgo in 1...6 {
            let date = cal.date(byAdding: .day, value: -daysAgo, to: cal.startOfDay(for: now))!
            let day = DailyNutrition(
                date: date,
                totalCalories: [2650, 2400, 2890, 2100, 2780, 2550][daysAgo - 1],
                totalProtein: Double([195, 180, 210, 160, 200, 185][daysAgo - 1]),
                totalCarbs: Double([280, 260, 310, 230, 290, 270][daysAgo - 1]),
                totalFat: Double([78, 72, 86, 65, 82, 76][daysAgo - 1])
            )
            context.insert(day)
        }

        let water = DailyWaterIntake(totalMl: 1750)
        context.insert(water)

        try? context.save()
    }
}
