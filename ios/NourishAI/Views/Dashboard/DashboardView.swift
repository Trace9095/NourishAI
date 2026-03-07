import SwiftUI
import SwiftData

struct DashboardView: View {
    @Query private var profiles: [UserProfile]
    @Query(sort: \DailyNutrition.date, order: .reverse)
    private var allNutrition: [DailyNutrition]
    @Query(sort: \DailyWaterIntake.date, order: .reverse)
    private var allWater: [DailyWaterIntake]

    @State private var showAddFood = false
    @State private var showSubscription = false
    @State private var todaySteps: Double = 0
    @State private var todayActiveCalories: Double = 0

    private var profile: UserProfile? { profiles.first }

    private var today: DailyNutrition? {
        let startOfDay = Calendar.current.startOfDay(for: Date())
        return allNutrition.first { $0.date >= startOfDay }
    }

    private var todayWater: DailyWaterIntake? {
        let startOfDay = Calendar.current.startOfDay(for: Date())
        return allWater.first { $0.date >= startOfDay }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(spacing: 20) {
                    // Greeting
                    greetingSection

                    // Calorie hero
                    calorieHeroCard

                    // Macro breakdown
                    macroBreakdownRow

                    // Quick stats
                    quickStatsRow

                    // Pro upgrade banner (free users only)
                    if profile?.subscriptionTier != "pro" {
                        Button {
                            showSubscription = true
                        } label: {
                            HStack(spacing: 14) {
                                Image(systemName: "star.fill")
                                    .font(.title2)
                                    .foregroundColor(.brandOrange)
                                    .frame(width: 44, height: 44)
                                    .background(Color.brandOrange.opacity(0.1))
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Upgrade to Pro")
                                        .font(.subheadline.weight(.semibold))
                                        .foregroundColor(.white)
                                    Text("Unlimited AI scans & premium features")
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                }
                                Spacer()
                                Text("Try Free")
                                    .font(.caption.weight(.semibold))
                                    .foregroundColor(.brandDark)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(Color.brandGreen)
                                    .clipShape(Capsule())
                            }
                            .padding(16)
                            .background(Color.brandCard)
                            .clipShape(RoundedRectangle(cornerRadius: Layout.cornerRadius))
                            .overlay(
                                RoundedRectangle(cornerRadius: Layout.cornerRadius)
                                    .strokeBorder(Color.brandOrange.opacity(0.3), lineWidth: 1)
                            )
                        }
                    }

                    // Discover restaurants
                    NavigationLink {
                        RestaurantMapView()
                    } label: {
                        HStack(spacing: 14) {
                            Image(systemName: "mappin.and.ellipse")
                                .font(.title2)
                                .foregroundColor(.brandGreen)
                                .frame(width: 44, height: 44)
                                .background(Color.brandGreen.opacity(0.1))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Nearby Restaurants")
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundColor(.white)
                                Text("Find healthy options near you")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            }
                            Spacer()
                            Image(systemName: "chevron.right")
                                .font(.caption)
                                .foregroundColor(.gray)
                        }
                        .padding(16)
                        .background(Color.brandCard)
                        .clipShape(RoundedRectangle(cornerRadius: Layout.cornerRadius))
                        .overlay(
                            RoundedRectangle(cornerRadius: Layout.cornerRadius)
                                .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
                        )
                    }

                    // Recent meals
                    recentMealsSection
                }
                .padding(.horizontal, Layout.horizontalPadding)
                .padding(.bottom, 100)
            }
            .background(Color.brandDark)
            .navigationTitle("Dashboard")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showAddFood = true
                    } label: {
                        Image(systemName: "plus.circle.fill")
                            .font(.title2)
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [.brandGreen, Color(hex: "2DD870")],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                    }
                    .frame(minWidth: Layout.minTouchTarget, minHeight: Layout.minTouchTarget)
                }
            }
            .sheet(isPresented: $showAddFood) {
                AddFoodSheet()
            }
            .sheet(isPresented: $showSubscription) {
                SubscriptionView()
            }
            .task {
                await fetchHealthKitData()
            }
            .refreshable {
                await fetchHealthKitData()
            }
        }
    }

    private func fetchHealthKitData() async {
        guard profile?.healthKitEnabled == true else { return }
        do {
            todaySteps = try await HealthKitManager.shared.getSteps(for: Date())
            todayActiveCalories = try await HealthKitManager.shared.getActiveCalories(for: Date())
        } catch {
            print("[Dashboard] HealthKit fetch error: \(error)")
        }
    }

    // MARK: - Greeting

    private var greetingSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(greetingText)
                .font(.title2.bold())
                .foregroundColor(.white)
            Text(dateText)
                .font(.subheadline)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.top, 8)
    }

    // MARK: - Calorie Hero Card

    private var calorieHeroCard: some View {
        let currentCal = today?.totalCalories ?? 0
        let targetCal = profile?.targetCalories ?? 2000
        let remaining = max(targetCal - currentCal, 0)
        let progress = targetCal > 0 ? min(Double(currentCal) / Double(targetCal), 1.0) : 0

        return VStack(spacing: 16) {
            ZStack {
                // Background ring
                Circle()
                    .stroke(Color.macroCalories.opacity(0.2), lineWidth: 16)

                // Progress ring
                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(
                        LinearGradient(
                            colors: [.macroCalories, Color(hex: "FFB347")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        style: StrokeStyle(lineWidth: 16, lineCap: .round)
                    )
                    .rotationEffect(.degrees(-90))
                    .animation(.easeInOut(duration: 1.0), value: progress)
                    .shadow(color: .macroCalories.opacity(0.4), radius: 8)

                // Center content
                VStack(spacing: 2) {
                    Text("\(currentCal)")
                        .font(.system(size: 40, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    Text("of \(targetCal) kcal")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            .frame(width: 160, height: 160)

            Text("\(remaining) remaining")
                .font(.subheadline.weight(.medium))
                .foregroundColor(.macroCalories)
        }
        .padding(24)
        .frame(maxWidth: .infinity)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
        .overlay(
            RoundedRectangle(cornerRadius: Layout.cardCornerRadius)
                .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
        )
    }

    // MARK: - Macro Breakdown

    private var macroBreakdownRow: some View {
        HStack(spacing: 12) {
            macroCard(
                label: "Protein",
                current: today?.totalProtein ?? 0,
                target: Double(profile?.targetProtein ?? 150),
                unit: "g",
                color: .macroProtein
            )
            macroCard(
                label: "Carbs",
                current: today?.totalCarbs ?? 0,
                target: Double(profile?.targetCarbs ?? 250),
                unit: "g",
                color: .macroCarbs
            )
            macroCard(
                label: "Fat",
                current: today?.totalFat ?? 0,
                target: Double(profile?.targetFat ?? 65),
                unit: "g",
                color: .macroFat
            )
        }
    }

    private func macroCard(label: String, current: Double, target: Double, unit: String, color: Color) -> some View {
        let progress = target > 0 ? min(current / target, 1.0) : 0

        return VStack(spacing: 10) {
            ZStack {
                Circle()
                    .stroke(color.opacity(0.2), lineWidth: 8)

                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(color, style: StrokeStyle(lineWidth: 8, lineCap: .round))
                    .rotationEffect(.degrees(-90))
                    .animation(.easeInOut(duration: 1.0), value: progress)
                    .shadow(color: color.opacity(0.3), radius: 4)

                Text("\(Int(current))")
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
            }
            .frame(width: 60, height: 60)

            VStack(spacing: 2) {
                Text(label)
                    .font(.caption2.weight(.medium))
                    .foregroundColor(color)
                Text("\(Int(current))/\(Int(target))\(unit)")
                    .font(.system(size: 10))
                    .foregroundColor(.gray)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cornerRadius))
        .overlay(
            RoundedRectangle(cornerRadius: Layout.cornerRadius)
                .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
        )
    }

    // MARK: - Quick Stats

    private var quickStatsRow: some View {
        HStack(spacing: 12) {
            QuickStatCard(
                title: "Water",
                value: formatWaterDisplay(ml: todayWater?.totalMl ?? 0),
                icon: "drop.fill",
                color: .macroWater
            )
            QuickStatCard(
                title: "Steps",
                value: todaySteps > 0 ? formatNumber(todaySteps) : (profile?.healthKitEnabled == true ? "0" : "--"),
                icon: "figure.walk",
                color: .brandGreen
            )
            QuickStatCard(
                title: "Active",
                value: todayActiveCalories > 0 ? "\(Int(todayActiveCalories))" : (profile?.healthKitEnabled == true ? "0" : "--"),
                icon: "flame.fill",
                color: .brandOrange
            )
        }
    }

    private func formatNumber(_ value: Double) -> String {
        if value >= 1000 {
            return String(format: "%.1fk", value / 1000)
        }
        return "\(Int(value))"
    }

    private func formatWaterDisplay(ml: Int) -> String {
        if ml == 0 { return "0 oz" }
        let oz = Double(ml) / 29.5735
        return String(format: "%.0f oz", oz)
    }

    // MARK: - Recent Meals

    private var recentMealsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Recent Meals")
                    .font(.headline)
                    .foregroundColor(.white)
                Spacer()
                if let entries = today?.entries, !entries.isEmpty {
                    Text("\(entries.count) today")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }

            if let entries = today?.entries, !entries.isEmpty {
                ForEach(entries.sorted(by: { $0.loggedAt > $1.loggedAt }).prefix(5), id: \.id) { entry in
                    DashboardMealRow(entry: entry)
                }
            } else {
                VStack(spacing: 12) {
                    Image(systemName: "fork.knife")
                        .font(.title2)
                        .foregroundColor(.gray.opacity(0.5))
                    Text("No meals logged today")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    Text("Tap + to add your first meal")
                        .font(.caption)
                        .foregroundColor(.gray.opacity(0.6))
                }
                .padding(28)
                .frame(maxWidth: .infinity)
                .background(Color.brandCard)
                .clipShape(RoundedRectangle(cornerRadius: Layout.cornerRadius))
                .overlay(
                    RoundedRectangle(cornerRadius: Layout.cornerRadius)
                        .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
                )
            }
        }
    }

    // MARK: - Helpers

    private var greetingText: String {
        let hour = Calendar.current.component(.hour, from: Date())
        let name = profile?.name ?? ""
        let greeting: String
        switch hour {
        case 5..<12: greeting = "Good morning"
        case 12..<17: greeting = "Good afternoon"
        default: greeting = "Good evening"
        }
        return name.isEmpty ? greeting : "\(greeting), \(name)"
    }

    private var dateText: String {
        Date().formatted(.dateTime.weekday(.wide).month(.wide).day())
    }

    private func calculateStreak() -> Int {
        var streak = 0
        var checkDate = Calendar.current.startOfDay(for: Date())
        for daily in allNutrition {
            let dailyDate = Calendar.current.startOfDay(for: daily.date)
            if dailyDate == checkDate {
                streak += 1
                checkDate = Calendar.current.date(byAdding: .day, value: -1, to: checkDate)!
            } else {
                break
            }
        }
        return streak
    }
}

// MARK: - Quick Stat Card

struct QuickStatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(color)
            Text(value)
                .font(.caption.bold())
                .foregroundColor(.white)
            Text(title)
                .font(.caption2)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cornerRadius))
        .overlay(
            RoundedRectangle(cornerRadius: Layout.cornerRadius)
                .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
        )
    }
}

// MARK: - Meal Row

struct DashboardMealRow: View {
    let entry: FoodEntry

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: entry.mealType.icon)
                .font(.body)
                .foregroundColor(.brandGreen)
                .frame(width: 40, height: 40)
                .background(Color.brandGreen.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 10))

            VStack(alignment: .leading, spacing: 2) {
                Text(entry.name)
                    .font(.subheadline.weight(.medium))
                    .foregroundColor(.white)
                    .lineLimit(1)
                Text("\(entry.mealType.displayName) \u{2022} \(entry.loggedAt.formatted(.dateTime.hour().minute()))")
                    .font(.caption)
                    .foregroundColor(.gray)
            }

            Spacer()

            Text("\(entry.calories) cal")
                .font(.subheadline.bold())
                .foregroundColor(.macroCalories)
        }
        .padding(12)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cornerRadius))
        .overlay(
            RoundedRectangle(cornerRadius: Layout.cornerRadius)
                .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
        )
    }
}

// MARK: - Add Food Sheet

struct AddFoodSheet: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List {
                Section {
                    addFoodRow(
                        icon: "camera.fill",
                        color: .brandGreen,
                        title: "Scan with AI Camera",
                        subtitle: "Take a photo for instant macros"
                    ) {
                        AIFoodCameraView()
                    }
                    addFoodRow(
                        icon: "text.bubble.fill",
                        color: .brandOrange,
                        title: "Describe Your Food",
                        subtitle: "Tell AI what you ate"
                    ) {
                        AIFoodChatView()
                    }
                    addFoodRow(
                        icon: "barcode.viewfinder",
                        color: .macroWater,
                        title: "Scan Barcode",
                        subtitle: "Look up packaged foods"
                    ) {
                        BarcodeScanView()
                    }
                    addFoodRow(
                        icon: "square.and.pencil",
                        color: .macroCarbs,
                        title: "Manual Entry",
                        subtitle: "Enter macros manually"
                    ) {
                        ManualEntryView()
                    }
                    addFoodRow(
                        icon: "doc.text.magnifyingglass",
                        color: .macroProtein,
                        title: "Scan Restaurant Menu",
                        subtitle: "Get health insights for menu items"
                    ) {
                        MenuScanView()
                    }
                    addFoodRow(
                        icon: "lightbulb.fill",
                        color: .brandOrange,
                        title: "Food Ideas",
                        subtitle: "AI suggestions based on remaining macros"
                    ) {
                        FoodIdeasView()
                    }
                    addFoodRow(
                        icon: "bubble.left.and.bubble.right.fill",
                        color: .brandGreen,
                        title: "Ask AI Nutritionist",
                        subtitle: "Chat about your nutrition goals"
                    ) {
                        NutritionChatView()
                    }
                }
                .listRowBackground(Color.brandCard)
            }
            .scrollContentBackground(.hidden)
            .background(Color.brandDark)
            .navigationTitle("Add Food")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                        .foregroundColor(.brandGreen)
                        .frame(minWidth: Layout.minTouchTarget, minHeight: Layout.minTouchTarget)
                }
            }
        }
    }

    private func addFoodRow<Destination: View>(
        icon: String,
        color: Color,
        title: String,
        subtitle: String,
        @ViewBuilder destination: () -> Destination
    ) -> some View {
        NavigationLink {
            destination()
        } label: {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .font(.body)
                    .foregroundColor(color)
                    .frame(width: 36, height: 36)
                    .background(color.opacity(0.2))
                    .clipShape(RoundedRectangle(cornerRadius: 8))

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline.weight(.semibold))
                        .foregroundColor(.white)
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            .padding(.vertical, 4)
        }
    }
}
