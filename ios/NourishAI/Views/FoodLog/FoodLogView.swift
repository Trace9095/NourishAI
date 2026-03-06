import SwiftUI
import SwiftData

struct FoodLogView: View {
    @Query(sort: \FoodEntry.loggedAt, order: .reverse) private var allEntries: [FoodEntry]
    @State private var selectedDate = Date()

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

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(spacing: Layout.sectionSpacing) {
                    // Date picker strip
                    datePickerSection

                    // Daily summary
                    dailySummary

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
            }
            .background(Color.brandDark)
            .navigationTitle("Food Log")
        }
    }

    private var datePickerSection: some View {
        DatePicker("Date", selection: $selectedDate, displayedComponents: .date)
            .datePickerStyle(.compact)
            .tint(.brandGreen)
            .foregroundColor(.white)
            .padding()
            .background(Color.brandCard)
            .clipShape(RoundedRectangle(cornerRadius: Layout.cornerRadius))
            .overlay(
                RoundedRectangle(cornerRadius: Layout.cornerRadius)
                    .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
            )
    }

    private var dailySummary: some View {
        let totalCal = filteredEntries.reduce(0) { $0 + $1.calories }
        let totalPro = filteredEntries.reduce(0.0) { $0 + $1.protein }
        let totalCarb = filteredEntries.reduce(0.0) { $0 + $1.carbs }
        let totalFatVal = filteredEntries.reduce(0.0) { $0 + $1.fat }

        return HStack(spacing: 16) {
            MacroChip(label: "Cal", value: "\(totalCal)", color: .macroCalories)
            MacroChip(label: "Pro", value: "\(Int(totalPro))g", color: .macroProtein)
            MacroChip(label: "Carb", value: "\(Int(totalCarb))g", color: .macroCarbs)
            MacroChip(label: "Fat", value: "\(Int(totalFatVal))g", color: .macroFat)
        }
    }

    private func mealSection(mealType: MealType, entries: [FoodEntry]) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: mealType.icon)
                    .foregroundColor(.brandGreen)
                Text(mealType.displayName)
                    .font(.headline)
                    .foregroundColor(.white)
                Spacer()
                Text("\(entries.reduce(0) { $0 + $1.calories }) cal")
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }

            ForEach(entries, id: \.id) { entry in
                MealRow(entry: entry)
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 12) {
            Image(systemName: "fork.knife")
                .font(.largeTitle)
                .foregroundColor(.gray)
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
    }
}

struct MacroChip: View {
    let label: String
    let value: String
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.subheadline.bold())
                .foregroundColor(.white)
            Text(label)
                .font(.caption2)
                .foregroundColor(color)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .background(color.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .strokeBorder(color.opacity(0.2), lineWidth: 1)
        )
    }
}
