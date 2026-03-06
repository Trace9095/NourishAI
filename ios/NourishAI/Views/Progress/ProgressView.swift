import SwiftUI
import SwiftData

struct NutritionProgressView: View {
    @Query(sort: \DailyNutrition.date, order: .reverse) private var dailyData: [DailyNutrition]
    @Query private var profiles: [UserProfile]
    @Query private var allEntries: [FoodEntry]

    @State private var aiInsight: String?
    @State private var isLoadingInsight = false

    private var profile: UserProfile? { profiles.first }
    private var last7Days: [DailyNutrition] { Array(dailyData.prefix(7)) }

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(spacing: 20) {
                    // AI Insights (Pro only)
                    if !dailyData.isEmpty {
                        aiInsightsCard
                    }

                    // Achievements
                    achievementsSection

                    if dailyData.isEmpty {
                        emptyState
                    } else {
                        calorieTrendCard
                        macroAveragesCard
                        consistencyCard
                        bestDayCard
                    }

                    streakCard
                    goalsSummaryCard
                }
                .padding(.horizontal, Layout.horizontalPadding)
                .padding(.bottom, 40)
            }
            .background(Color.brandDark)
            .navigationTitle("Progress")
        }
    }

    // MARK: - AI Insights Card

    private var aiInsightsCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 8) {
                Image(systemName: "brain.fill")
                    .font(.caption)
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.brandGreen, .macroCarbs],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                Text("AI Weekly Insights")
                    .font(.subheadline.weight(.semibold))
                    .foregroundColor(.white)
                Spacer()
                if profile?.subscriptionTier != "pro" {
                    Text("PRO")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.brandDark)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.brandOrange)
                        .clipShape(Capsule())
                }
            }

            if let insight = aiInsight {
                Text(insight)
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.85))
                    .lineSpacing(4)
            } else if isLoadingInsight {
                HStack(spacing: 8) {
                    ProgressView()
                        .tint(.brandGreen)
                    Text("Analyzing your week...")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                .padding(.vertical, 8)
            } else {
                Button {
                    Task { await fetchAIInsight() }
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "sparkles")
                        Text("Get AI Analysis")
                            .font(.subheadline.weight(.medium))
                    }
                    .foregroundColor(.brandGreen)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(Color.brandGreen.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }
            }
        }
        .padding(18)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
        .overlay(
            RoundedRectangle(cornerRadius: Layout.cardCornerRadius)
                .strokeBorder(
                    LinearGradient(
                        colors: [.brandGreen.opacity(0.3), .macroCarbs.opacity(0.1)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 1
                )
        )
    }

    private func fetchAIInsight() async {
        guard !isLoadingInsight else { return }
        isLoadingInsight = true

        // Build summary from 7-day data
        let count = max(last7Days.count, 1)
        let avgCal = last7Days.reduce(0) { $0 + $1.totalCalories } / count
        let avgPro = Int(last7Days.reduce(0.0) { $0 + $1.totalProtein } / Double(count))
        let avgCarbs = Int(last7Days.reduce(0.0) { $0 + $1.totalCarbs } / Double(count))
        let avgFat = Int(last7Days.reduce(0.0) { $0 + $1.totalFat } / Double(count))

        let description = "7-day avg: \(avgCal) cal, \(avgPro)g protein, \(avgCarbs)g carbs, \(avgFat)g fat. Target: \(profile?.targetCalories ?? 0) cal, \(profile?.targetProtein ?? 0)g protein. Goal: \(profile?.nutritionGoal.displayName ?? "maintenance"). Give 2-3 brief, actionable nutrition tips in 50 words."

        do {
            let result = try await NourishAPIManager.shared.analyzeDescription(description)
            aiInsight = result.foodName
        } catch {
            aiInsight = "Keep tracking consistently! Based on your data, focus on hitting your protein target daily and staying within your calorie goal. Small adjustments compound over time."
        }

        isLoadingInsight = false
    }

    // MARK: - Achievements Section

    private var achievementsSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 8) {
                Image(systemName: "trophy.fill")
                    .font(.caption)
                    .foregroundColor(.brandOrange)
                Text("Achievements")
                    .font(.subheadline.weight(.semibold))
                    .foregroundColor(.white)
                Spacer()
                Text("\(unlockedCount)/\(achievements.count)")
                    .font(.caption.weight(.medium))
                    .foregroundColor(.gray)
            }

            LazyVGrid(columns: [
                GridItem(.flexible(), spacing: 10),
                GridItem(.flexible(), spacing: 10),
                GridItem(.flexible(), spacing: 10),
            ], spacing: 10) {
                ForEach(achievements, id: \.title) { achievement in
                    achievementBadge(achievement)
                }
            }
        }
        .padding(18)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
        .overlay(
            RoundedRectangle(cornerRadius: Layout.cardCornerRadius)
                .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
        )
    }

    private func achievementBadge(_ achievement: Achievement) -> some View {
        let unlocked = achievement.isUnlocked(
            calculateStreak(),
            allEntries.count,
            dailyData.count,
            proteinTargetHits,
            profile
        )

        return VStack(spacing: 6) {
            ZStack {
                Circle()
                    .fill(unlocked ? achievement.color.opacity(0.15) : Color.white.opacity(0.04))
                    .frame(width: 52, height: 52)

                Image(systemName: achievement.icon)
                    .font(.title3)
                    .foregroundColor(unlocked ? achievement.color : .gray.opacity(0.3))
            }

            Text(achievement.title)
                .font(.system(size: 9, weight: .medium))
                .foregroundColor(unlocked ? .white : .gray.opacity(0.4))
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "chart.line.uptrend.xyaxis")
                .font(.system(size: 48))
                .foregroundColor(.brandGreen.opacity(0.4))

            Text("Start tracking to see trends")
                .font(.headline)
                .foregroundColor(.white)

            Text("Log your meals daily to unlock\ntrends, stats, and achievements.")
                .font(.subheadline)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .lineSpacing(4)
        }
        .padding(40)
        .frame(maxWidth: .infinity)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
        .overlay(
            RoundedRectangle(cornerRadius: Layout.cardCornerRadius)
                .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
        )
    }

    // MARK: - Calorie Trend

    private var calorieTrendCard: some View {
        let days = last7Days.reversed()
        let target = profile?.targetCalories ?? 2000

        return progressCard(title: "7-Day Calorie Trend", icon: "chart.bar.fill", color: .macroCalories) {
            VStack(spacing: 12) {
                HStack(alignment: .bottom, spacing: 6) {
                    ForEach(Array(days.enumerated()), id: \.offset) { _, day in
                        let ratio = target > 0 ? min(Double(day.totalCalories) / Double(target), 1.2) : 0
                        VStack(spacing: 4) {
                            RoundedRectangle(cornerRadius: 4)
                                .fill(
                                    LinearGradient(
                                        colors: day.totalCalories > target
                                            ? [.macroProtein.opacity(0.9), .macroProtein.opacity(0.5)]
                                            : [.macroCalories.opacity(0.9), .macroCalories.opacity(0.5)],
                                        startPoint: .top,
                                        endPoint: .bottom
                                    )
                                )
                                .frame(height: max(CGFloat(ratio) * 80, 4))

                            Text(dayLabel(day.date))
                                .font(.system(size: 9))
                                .foregroundColor(.gray)
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
                .frame(height: 100)

                HStack {
                    Rectangle().fill(Color.white.opacity(0.15)).frame(height: 1)
                    Text("Target: \(target) kcal")
                        .font(.caption2)
                        .foregroundColor(.gray)
                        .fixedSize()
                    Rectangle().fill(Color.white.opacity(0.15)).frame(height: 1)
                }
            }
        }
    }

    // MARK: - Macro Averages

    private var macroAveragesCard: some View {
        let count = max(last7Days.count, 1)
        let avgCal = last7Days.reduce(0) { $0 + $1.totalCalories } / count
        let avgPro = last7Days.reduce(0.0) { $0 + $1.totalProtein } / Double(count)
        let avgCarbs = last7Days.reduce(0.0) { $0 + $1.totalCarbs } / Double(count)
        let avgFat = last7Days.reduce(0.0) { $0 + $1.totalFat } / Double(count)

        return progressCard(title: "7-Day Averages", icon: "chart.pie.fill", color: .macroCarbs) {
            HStack(spacing: 0) {
                avgMacro(label: "Calories", value: "\(avgCal)", unit: "kcal", color: .macroCalories)
                avgDivider
                avgMacro(label: "Protein", value: "\(Int(avgPro))", unit: "g", color: .macroProtein)
                avgDivider
                avgMacro(label: "Carbs", value: "\(Int(avgCarbs))", unit: "g", color: .macroCarbs)
                avgDivider
                avgMacro(label: "Fat", value: "\(Int(avgFat))", unit: "g", color: .macroFat)
            }
        }
    }

    // MARK: - Consistency

    private var consistencyCard: some View {
        let daysLogged = last7Days.filter { $0.totalCalories > 0 }.count
        let pct = last7Days.isEmpty ? 0 : Int(Double(daysLogged) / 7.0 * 100)

        return progressCard(title: "This Week's Consistency", icon: "checkmark.seal.fill", color: .brandGreen) {
            HStack(spacing: 20) {
                ZStack {
                    Circle()
                        .stroke(Color.brandGreen.opacity(0.2), lineWidth: 10)

                    Circle()
                        .trim(from: 0, to: Double(daysLogged) / 7.0)
                        .stroke(Color.brandGreen, style: StrokeStyle(lineWidth: 10, lineCap: .round))
                        .rotationEffect(.degrees(-90))
                        .shadow(color: .brandGreen.opacity(0.3), radius: 4)

                    Text("\(pct)%")
                        .font(.title3.bold())
                        .foregroundColor(.white)
                }
                .frame(width: 80, height: 80)

                VStack(alignment: .leading, spacing: 8) {
                    Text("\(daysLogged) of 7 days logged")
                        .font(.subheadline.weight(.medium))
                        .foregroundColor(.white)
                    Text(consistencyMessage(daysLogged))
                        .font(.caption)
                        .foregroundColor(.gray)
                        .lineSpacing(2)
                }
            }
        }
    }

    // MARK: - Best Day

    private var bestDayCard: some View {
        let best = last7Days.max(by: { $0.totalProtein < $1.totalProtein })

        return progressCard(title: "Best Protein Day", icon: "trophy.fill", color: .macroProtein) {
            if let best {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("\(Int(best.totalProtein))g protein")
                            .font(.title3.bold())
                            .foregroundColor(.macroProtein)
                        Text(best.date.formatted(.dateTime.weekday(.wide).month(.abbreviated).day()))
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    Spacer()
                    Image(systemName: "trophy.fill")
                        .font(.title)
                        .foregroundColor(.macroProtein.opacity(0.3))
                }
            }
        }
    }

    // MARK: - Streak

    private var streakCard: some View {
        let streak = calculateStreak()

        return progressCard(title: "Logging Streak", icon: "flame.fill", color: .brandOrange) {
            HStack(spacing: 16) {
                ZStack {
                    Circle()
                        .fill(Color.brandOrange.opacity(0.15))
                        .frame(width: 64, height: 64)
                    Image(systemName: "flame.fill")
                        .font(.title)
                        .foregroundColor(.brandOrange)
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("\(streak) day\(streak == 1 ? "" : "s")")
                        .font(.title2.bold())
                        .foregroundColor(.white)
                    Text(streak == 0 ? "Log a meal to start your streak!" : "Keep it going!")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                Spacer()
            }
        }
    }

    // MARK: - Goals Summary

    private var goalsSummaryCard: some View {
        progressCard(title: "Your Goal", icon: "target", color: .brandGreen) {
            if let profile {
                HStack(spacing: 16) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text(profile.nutritionGoal.displayName)
                            .font(.headline)
                            .foregroundColor(.white)
                        Text("\(profile.targetCalories) kcal daily target")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                        HStack(spacing: 12) {
                            goalPill("P: \(profile.targetProtein)g", color: .macroProtein)
                            goalPill("C: \(profile.targetCarbs)g", color: .macroCarbs)
                            goalPill("F: \(profile.targetFat)g", color: .macroFat)
                        }
                        .padding(.top, 4)
                    }
                    Spacer()
                }
            }
        }
    }

    // MARK: - Card Template

    private func progressCard<Content: View>(
        title: String,
        icon: String,
        color: Color,
        @ViewBuilder content: () -> Content
    ) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.caption)
                    .foregroundColor(color)
                Text(title)
                    .font(.subheadline.weight(.semibold))
                    .foregroundColor(.white)
            }
            content()
        }
        .padding(18)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
        .overlay(
            RoundedRectangle(cornerRadius: Layout.cardCornerRadius)
                .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
        )
    }

    private func avgMacro(label: String, value: String, unit: String, color: Color) -> some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.headline)
                .foregroundColor(color)
            Text(unit)
                .font(.system(size: 10))
                .foregroundColor(.gray)
            Text(label)
                .font(.caption2)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity)
    }

    private var avgDivider: some View {
        Rectangle().fill(Color.white.opacity(0.1)).frame(width: 1, height: 40)
    }

    private func goalPill(_ text: String, color: Color) -> some View {
        Text(text)
            .font(.caption2.weight(.medium))
            .foregroundColor(color)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.12))
            .clipShape(Capsule())
    }

    // MARK: - Achievements Data

    private struct Achievement {
        let icon: String
        let title: String
        let color: Color
        let isUnlocked: (Int, Int, Int, Int, UserProfile?) -> Bool
    }

    private var achievements: [Achievement] {
        [
            Achievement(icon: "fork.knife", title: "First Meal", color: .brandGreen) { _, meals, _, _, _ in meals >= 1 },
            Achievement(icon: "flame.fill", title: "3-Day Streak", color: .brandOrange) { streak, _, _, _, _ in streak >= 3 },
            Achievement(icon: "flame.fill", title: "7-Day Streak", color: .macroCalories) { streak, _, _, _, _ in streak >= 7 },
            Achievement(icon: "star.fill", title: "10 Meals", color: .macroCarbs) { _, meals, _, _, _ in meals >= 10 },
            Achievement(icon: "trophy.fill", title: "50 Meals", color: .brandOrange) { _, meals, _, _, _ in meals >= 50 },
            Achievement(icon: "bolt.fill", title: "Protein Pro", color: .macroProtein) { _, _, _, hits, _ in hits >= 3 },
            Achievement(icon: "chart.bar.fill", title: "5 Days Logged", color: .macroWater) { _, _, days, _, _ in days >= 5 },
            Achievement(icon: "crown.fill", title: "30-Day Streak", color: .brandOrange) { streak, _, _, _, _ in streak >= 30 },
            Achievement(icon: "heart.fill", title: "Pro Member", color: .macroProtein) { _, _, _, _, profile in profile?.subscriptionTier == "pro" },
        ]
    }

    private var unlockedCount: Int {
        let streak = calculateStreak()
        let meals = allEntries.count
        let days = dailyData.count
        let hits = proteinTargetHits
        return achievements.filter { $0.isUnlocked(streak, meals, days, hits, profile) }.count
    }

    private var proteinTargetHits: Int {
        guard let target = profile?.targetProtein else { return 0 }
        return dailyData.filter { $0.totalProtein >= Double(target) }.count
    }

    // MARK: - Helpers

    private func dayLabel(_ date: Date) -> String {
        date.formatted(.dateTime.weekday(.narrow))
    }

    private func consistencyMessage(_ days: Int) -> String {
        switch days {
        case 7: return "Perfect week! You're crushing it."
        case 5...6: return "Great consistency. Almost perfect!"
        case 3...4: return "Good start. Try to log every day."
        default: return "Consistency is key. Log daily!"
        }
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
