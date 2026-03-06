import SwiftUI
import SwiftData

struct DashboardView: View {
    @Query private var profiles: [UserProfile]
    @Query(
        filter: #Predicate<DailyNutrition> { daily in
            daily.date >= Calendar.current.startOfDay(for: Date())
        },
        sort: \DailyNutrition.date,
        order: .reverse
    ) private var todayNutrition: [DailyNutrition]

    @State private var showAddFood = false

    private var profile: UserProfile? { profiles.first }
    private var today: DailyNutrition? { todayNutrition.first }

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(spacing: Layout.sectionSpacing) {
                    // Greeting
                    greetingSection

                    // Macro rings
                    macroRingsSection

                    // Quick stats
                    quickStatsRow

                    // Recent meals
                    recentMealsSection
                }
                .padding(.horizontal, Layout.horizontalPadding)
                .padding(.bottom, 100) // room for FAB
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
                            .foregroundColor(.brandGreen)
                    }
                    .frame(minWidth: Layout.minTouchTarget, minHeight: Layout.minTouchTarget)
                }
            }
            .sheet(isPresented: $showAddFood) {
                AddFoodSheet()
            }
        }
    }

    // MARK: - Sections

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

    private var macroRingsSection: some View {
        DashboardRings(
            calories: today?.totalCalories ?? 0,
            targetCalories: profile?.targetCalories ?? 2000,
            protein: today?.totalProtein ?? 0,
            targetProtein: profile?.targetProtein ?? 150,
            carbs: today?.totalCarbs ?? 0,
            targetCarbs: profile?.targetCarbs ?? 250,
            fat: today?.totalFat ?? 0,
            targetFat: profile?.targetFat ?? 65
        )
        .padding()
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
    }

    private var quickStatsRow: some View {
        HStack(spacing: 12) {
            QuickStatCard(
                title: "Water",
                value: "0 ml",
                icon: "drop.fill",
                color: .macroWater
            )
            QuickStatCard(
                title: "Steps",
                value: "--",
                icon: "figure.walk",
                color: .brandGreen
            )
            QuickStatCard(
                title: "Streak",
                value: "0 days",
                icon: "flame.fill",
                color: .brandOrange
            )
        }
    }

    private var recentMealsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recent Meals")
                .font(.headline)
                .foregroundColor(.white)

            if let entries = today?.entries, !entries.isEmpty {
                ForEach(entries.prefix(5), id: \.id) { entry in
                    DashboardMealRow(entry: entry)
                }
            } else {
                Text("No meals logged today. Tap + to add your first meal.")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.brandCard)
                    .clipShape(RoundedRectangle(cornerRadius: Layout.cornerRadius))
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
}

// MARK: - Supporting Views

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
    }
}

struct DashboardMealRow: View {
    let entry: FoodEntry

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: entry.mealType.icon)
                .font(.title3)
                .foregroundColor(.brandGreen)
                .frame(width: 40, height: 40)
                .background(Color.brandGreen.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 10))

            VStack(alignment: .leading, spacing: 2) {
                Text(entry.name)
                    .font(.subheadline.weight(.medium))
                    .foregroundColor(.white)
                    .lineLimit(1)
                Text("\(entry.mealType.displayName) • \(entry.loggedAt.formatted(.dateTime.hour().minute()))")
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
    }
}

struct AddFoodSheet: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List {
                Section {
                    NavigationLink {
                        AIFoodCameraView()
                    } label: {
                        Label("Scan with AI Camera", systemImage: "camera.fill")
                            .foregroundColor(.brandGreen)
                    }
                    NavigationLink {
                        AIFoodChatView()
                    } label: {
                        Label("Describe Your Food", systemImage: "text.bubble.fill")
                            .foregroundColor(.brandOrange)
                    }
                    NavigationLink {
                        BarcodeScanView()
                    } label: {
                        Label("Scan Barcode", systemImage: "barcode.viewfinder")
                    }
                    NavigationLink {
                        ManualEntryView()
                    } label: {
                        Label("Manual Entry", systemImage: "square.and.pencil")
                    }
                }
            }
            .navigationTitle("Add Food")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                        .frame(minWidth: Layout.minTouchTarget, minHeight: Layout.minTouchTarget)
                }
            }
        }
    }
}
