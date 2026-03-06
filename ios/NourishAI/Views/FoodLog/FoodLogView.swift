import SwiftUI
import SwiftData

struct FoodLogView: View {
    @Query(sort: \FoodEntry.loggedAt, order: .reverse) private var allEntries: [FoodEntry]
    @Query private var profiles: [UserProfile]
    @State private var selectedDate = Date()
    @State private var weekOffset = 0

    private var profile: UserProfile? { profiles.first }

    private var filteredEntries: [FoodEntry] {
        let start = Calendar.current.startOfDay(for: selectedDate)
        let end = Calendar.current.date(byAdding: .day, value: 1, to: start)!
        return allEntries.filter { $0.loggedAt >= start && $0.loggedAt < end }
    }

    private var groupedByMeal: [(MealType, [FoodEntry])] {
        MealType.allCases.compactMap { mealType in
            let entries = filteredEntries.filter { $0.mealType == mealType }
            return entries.isEmpty ? nil : (mealType, entries)
        }
    }

    private var weekDays: [Date] {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let baseDate = calendar.date(byAdding: .weekOfYear, value: weekOffset, to: today)!
        let weekday = calendar.component(.weekday, from: baseDate)
        let startOfWeek = calendar.date(byAdding: .day, value: -(weekday - 1), to: baseDate)!
        return (0..<7).map { calendar.date(byAdding: .day, value: $0, to: startOfWeek)! }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(spacing: 16) {
                    // Week selector
                    weekSelector

                    // Daily macro summary card
                    dailySummaryCard

                    // Meals grouped by type
                    if groupedByMeal.isEmpty {
                        emptyState
                    } else {
                        ForEach(groupedByMeal, id: \.0) { mealType, entries in
                            mealSection(mealType: mealType, entries: entries)
                        }
                    }
                }
                .padding(.horizontal, Layout.horizontalPadding)
                .padding(.bottom, 100)
            }
            .background(Color.brandDark)
            .navigationTitle("Food Log")
        }
    }

    // MARK: - Week Selector

    private var weekSelector: some View {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())

        return VStack(spacing: 14) {
            // Month header with arrows
            HStack {
                Button {
                    withAnimation(.easeInOut(duration: 0.25)) { weekOffset -= 1 }
                } label: {
                    Image(systemName: "chevron.left")
                        .font(.body.weight(.semibold))
                        .foregroundColor(.brandGreen)
                        .frame(width: 36, height: 36)
                        .background(Color.brandGreen.opacity(0.1))
                        .clipShape(Circle())
                }

                Spacer()

                Text(monthYearLabel)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)

                Spacer()

                Button {
                    withAnimation(.easeInOut(duration: 0.25)) { weekOffset += 1 }
                } label: {
                    Image(systemName: "chevron.right")
                        .font(.body.weight(.semibold))
                        .foregroundColor(weekOffset >= 0 ? .gray.opacity(0.3) : .brandGreen)
                        .frame(width: 36, height: 36)
                        .background(weekOffset >= 0 ? Color.white.opacity(0.03) : Color.brandGreen.opacity(0.1))
                        .clipShape(Circle())
                }
                .disabled(weekOffset >= 0)
            }

            // Day cells
            HStack(spacing: 0) {
                ForEach(weekDays, id: \.self) { date in
                    let isSelected = calendar.isDate(date, inSameDayAs: selectedDate)
                    let isToday = calendar.isDate(date, inSameDayAs: today)
                    let isFuture = date > today
                    let hasEntries = !entriesForDate(date).isEmpty

                    Button {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            selectedDate = date
                        }
                    } label: {
                        VStack(spacing: 8) {
                            Text(date.formatted(.dateTime.weekday(.narrow)))
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(isFuture ? .gray.opacity(0.3) : .gray)

                            ZStack {
                                if isSelected {
                                    Circle()
                                        .fill(Color.brandGreen)
                                        .frame(width: 38, height: 38)
                                        .shadow(color: .brandGreen.opacity(0.4), radius: 6, y: 2)
                                }

                                Text("\(calendar.component(.day, from: date))")
                                    .font(.system(size: 16, weight: isSelected ? .bold : .medium, design: .rounded))
                                    .foregroundColor(
                                        isSelected ? .white :
                                        isFuture ? .gray.opacity(0.3) :
                                        isToday ? .brandGreen : .white.opacity(0.85)
                                    )
                            }
                            .frame(height: 38)

                            // Activity dot
                            Circle()
                                .fill(hasEntries && !isSelected ? Color.brandGreen.opacity(0.6) : Color.clear)
                                .frame(width: 4, height: 4)
                        }
                    }
                    .disabled(isFuture)
                    .frame(maxWidth: .infinity)
                }
            }
        }
        .padding(.vertical, 12)
        .padding(.horizontal, 8)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
        .overlay(
            RoundedRectangle(cornerRadius: Layout.cardCornerRadius)
                .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
        )
    }

    private var monthYearLabel: String {
        let dates = weekDays
        guard let first = dates.first, let last = dates.last else { return "" }
        let formatter = DateFormatter()
        formatter.dateFormat = "MMMM yyyy"
        let firstMonth = Calendar.current.component(.month, from: first)
        let lastMonth = Calendar.current.component(.month, from: last)
        if firstMonth == lastMonth {
            return formatter.string(from: first)
        }
        let f1 = DateFormatter()
        f1.dateFormat = "MMM"
        let f2 = DateFormatter()
        f2.dateFormat = "MMM yyyy"
        return "\(f1.string(from: first)) - \(f2.string(from: last))"
    }

    private func entriesForDate(_ date: Date) -> [FoodEntry] {
        let start = Calendar.current.startOfDay(for: date)
        let end = Calendar.current.date(byAdding: .day, value: 1, to: start)!
        return allEntries.filter { $0.loggedAt >= start && $0.loggedAt < end }
    }

    // MARK: - Daily Summary Card

    private var dailySummaryCard: some View {
        let totalCal = filteredEntries.reduce(0) { $0 + $1.calories }
        let totalPro = filteredEntries.reduce(0.0) { $0 + $1.protein }
        let totalCarb = filteredEntries.reduce(0.0) { $0 + $1.carbs }
        let totalFatVal = filteredEntries.reduce(0.0) { $0 + $1.fat }
        let targetCal = profile?.targetCalories ?? 2000
        let targetPro = profile?.targetProtein ?? 150
        let targetCarb = profile?.targetCarbs ?? 250
        let targetFatVal = profile?.targetFat ?? 65
        let calProgress = targetCal > 0 ? min(Double(totalCal) / Double(targetCal), 1.0) : 0
        let remaining = max(targetCal - totalCal, 0)

        return VStack(spacing: 16) {
            // Calorie header
            HStack(alignment: .bottom) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("\(totalCal)")
                        .font(.system(size: 36, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    Text("of \(targetCal) kcal")
                        .font(.caption)
                        .foregroundColor(.gray)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 4) {
                    Text("\(remaining)")
                        .font(.system(size: 20, weight: .bold, design: .rounded))
                        .foregroundColor(.macroCalories)
                    Text("remaining")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }

            // Calorie progress bar
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(Color.macroCalories.opacity(0.15))
                        .frame(height: 10)

                    RoundedRectangle(cornerRadius: 6)
                        .fill(
                            LinearGradient(
                                colors: [.macroCalories, Color(hex: "FFB347")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: geo.size.width * calProgress, height: 10)
                        .animation(.easeInOut(duration: 0.8), value: calProgress)
                        .shadow(color: .macroCalories.opacity(0.4), radius: 4, y: 2)
                }
            }
            .frame(height: 10)

            // Divider
            Rectangle()
                .fill(Color.white.opacity(0.06))
                .frame(height: 1)

            // Macro progress bars
            HStack(spacing: 16) {
                macroProgressColumn(
                    label: "Protein",
                    current: Int(totalPro),
                    target: targetPro,
                    unit: "g",
                    color: .macroProtein
                )
                macroProgressColumn(
                    label: "Carbs",
                    current: Int(totalCarb),
                    target: targetCarb,
                    unit: "g",
                    color: .macroCarbs
                )
                macroProgressColumn(
                    label: "Fat",
                    current: Int(totalFatVal),
                    target: targetFatVal,
                    unit: "g",
                    color: .macroFat
                )
            }
        }
        .padding(20)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
        .overlay(
            RoundedRectangle(cornerRadius: Layout.cardCornerRadius)
                .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
        )
    }

    private func macroProgressColumn(label: String, current: Int, target: Int, unit: String, color: Color) -> some View {
        let progress = target > 0 ? min(Double(current) / Double(target), 1.0) : 0

        return VStack(spacing: 8) {
            HStack {
                Text(label)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(color)
                Spacer()
                Text("\(current)/\(target)\(unit)")
                    .font(.system(size: 11, weight: .semibold, design: .rounded))
                    .foregroundColor(.white.opacity(0.8))
            }

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(color.opacity(0.15))
                        .frame(height: 6)

                    RoundedRectangle(cornerRadius: 4)
                        .fill(color)
                        .frame(width: geo.size.width * progress, height: 6)
                        .animation(.easeInOut(duration: 0.8), value: progress)
                        .shadow(color: color.opacity(0.3), radius: 3, y: 1)
                }
            }
            .frame(height: 6)
        }
    }

    // MARK: - Meal Sections

    private func mealSection(mealType: MealType, entries: [FoodEntry]) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: mealType.icon)
                    .font(.body.weight(.semibold))
                    .foregroundColor(.brandGreen)
                    .frame(width: 28, height: 28)
                    .background(Color.brandGreen.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                Text(mealType.displayName)
                    .font(.headline)
                    .foregroundColor(.white)
                Spacer()
                Text("\(entries.reduce(0) { $0 + $1.calories }) cal")
                    .font(.subheadline.weight(.semibold))
                    .foregroundColor(.macroCalories)
            }
            .padding(.top, 4)

            ForEach(entries, id: \.id) { entry in
                MealRow(entry: entry)
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "fork.knife")
                .font(.system(size: 36))
                .foregroundColor(.brandGreen.opacity(0.4))
                .frame(width: 64, height: 64)
                .background(Color.brandGreen.opacity(0.08))
                .clipShape(Circle())
            Text("No meals logged")
                .font(.headline)
                .foregroundColor(.white)
            Text("Start tracking your nutrition by adding your first meal.")
                .font(.subheadline)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
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
}
