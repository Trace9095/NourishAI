import SwiftUI
import SwiftData

struct NutritionProgressView: View {
    @Query(sort: \DailyNutrition.date, order: .reverse) private var dailyData: [DailyNutrition]

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(spacing: Layout.sectionSpacing) {
                    // Weight trend placeholder
                    sectionCard(title: "Weight Trend") {
                        Text("Weight tracking coming soon")
                            .foregroundColor(.gray)
                    }

                    // Macro averages
                    sectionCard(title: "7-Day Averages") {
                        let last7 = Array(dailyData.prefix(7))
                        if last7.isEmpty {
                            Text("Log meals to see your trends")
                                .foregroundColor(.gray)
                        } else {
                            let avgCal = last7.reduce(0) { $0 + $1.totalCalories } / max(last7.count, 1)
                            let avgPro = last7.reduce(0.0) { $0 + $1.totalProtein } / Double(max(last7.count, 1))

                            HStack(spacing: 16) {
                                MacroChip(label: "Avg Cal", value: "\(avgCal)", color: .macroCalories)
                                MacroChip(label: "Avg Pro", value: "\(Int(avgPro))g", color: .macroProtein)
                            }
                        }
                    }

                    // Streak
                    sectionCard(title: "Logging Streak") {
                        HStack {
                            Image(systemName: "flame.fill")
                                .font(.title)
                                .foregroundColor(.brandOrange)
                            Text("\(calculateStreak()) days")
                                .font(.title2.bold())
                                .foregroundColor(.white)
                        }
                    }
                }
                .padding(.horizontal, Layout.horizontalPadding)
            }
            .background(Color.brandDark)
            .navigationTitle("Progress")
        }
    }

    private func sectionCard<Content: View>(title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.headline)
                .foregroundColor(.white)
            content()
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
    }

    private func calculateStreak() -> Int {
        var streak = 0
        var checkDate = Calendar.current.startOfDay(for: Date())
        for daily in dailyData {
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
