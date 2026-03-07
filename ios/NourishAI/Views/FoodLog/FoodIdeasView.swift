import SwiftUI
import SwiftData

struct FoodIdeasView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @Query private var profiles: [UserProfile]

    @State private var isLoading = false
    @State private var suggestions: [NourishAPIManager.FoodSuggestion] = []
    @State private var errorMessage: String?
    @State private var selectedMealType: MealType = .lunch

    private var profile: UserProfile? { profiles.first }

    private var todayNutrition: DailyNutrition? {
        let today = Calendar.current.startOfDay(for: Date())
        let descriptor = FetchDescriptor<DailyNutrition>(
            predicate: #Predicate { $0.date >= today }
        )
        return try? modelContext.fetch(descriptor).first
    }

    private var timeOfDay: String {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 5..<12: return "morning"
        case 12..<17: return "afternoon"
        case 17..<21: return "evening"
        default: return "night"
        }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Color.brandDark.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: Layout.sectionSpacing) {
                        remainingMacrosCard
                        getIdeasSection
                        if !suggestions.isEmpty {
                            suggestionsSection
                        }
                        if let error = errorMessage {
                            errorBanner(error)
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle("Food Ideas")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    // MARK: - Remaining Macros

    private var remainingMacrosCard: some View {
        let eaten = todayNutrition
        let targetCal = profile?.targetCalories ?? 2000
        let targetP = profile?.targetProtein ?? 150
        let targetC = profile?.targetCarbs ?? 250
        let targetF = profile?.targetFat ?? 65

        let remainCal = targetCal - (eaten?.totalCalories ?? 0)
        let remainP = Double(targetP) - (eaten?.totalProtein ?? 0)
        let remainC = Double(targetC) - (eaten?.totalCarbs ?? 0)
        let remainF = Double(targetF) - (eaten?.totalFat ?? 0)

        return VStack(spacing: 12) {
            Text("Remaining Today")
                .font(.headline)
                .foregroundColor(.white)

            HStack(spacing: 16) {
                macroRemaining("Cal", remaining: remainCal, color: .macroCalories)
                macroRemaining("Protein", remaining: Int(remainP), color: .macroProtein)
                macroRemaining("Carbs", remaining: Int(remainC), color: .macroCarbs)
                macroRemaining("Fat", remaining: Int(remainF), color: .macroFat)
            }
        }
        .padding()
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
    }

    private func macroRemaining(_ label: String, remaining: Int, color: Color) -> some View {
        VStack(spacing: 4) {
            Text("\(max(0, remaining))")
                .font(.title3.bold())
                .foregroundColor(remaining > 0 ? color : .gray)
            Text(label == "Cal" ? "kcal" : "g")
                .font(.caption2)
                .foregroundColor(.gray)
            Text(label)
                .font(.caption2)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Get Ideas

    private var getIdeasSection: some View {
        VStack(spacing: 12) {
            Text("Good \(timeOfDay)! What should you eat?")
                .font(.subheadline)
                .foregroundColor(.gray)

            Button {
                fetchSuggestions()
            } label: {
                HStack {
                    if isLoading {
                        ProgressView()
                            .tint(.brandDark)
                    } else {
                        Image(systemName: "sparkles")
                    }
                    Text(isLoading ? "Thinking..." : "Get AI Suggestions")
                        .font(.headline)
                }
                .foregroundColor(.brandDark)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.brandGreen)
                .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
            }
            .frame(minHeight: Layout.minTouchTarget)
            .disabled(isLoading)
        }
    }

    // MARK: - Suggestions

    private var suggestionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Suggestions for You")
                .font(.headline)
                .foregroundColor(.white)

            ForEach(suggestions) { suggestion in
                suggestionCard(suggestion)
            }
        }
    }

    private func suggestionCard(_ suggestion: NourishAPIManager.FoodSuggestion) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(suggestion.name)
                    .font(.headline)
                    .foregroundColor(.white)

                Spacer()

                // Prep time badge
                Label("\(suggestion.prepTime)m", systemImage: "clock")
                    .font(.caption)
                    .foregroundColor(.brandGreen)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.brandGreen.opacity(0.15))
                    .clipShape(Capsule())
            }

            Text(suggestion.description)
                .font(.subheadline)
                .foregroundColor(.gray)
                .lineLimit(2)

            HStack(spacing: 16) {
                macroLabel("Cal", value: "\(suggestion.calories)", color: .macroCalories)
                macroLabel("P", value: "\(Int(suggestion.protein))g", color: .macroProtein)
                macroLabel("C", value: "\(Int(suggestion.carbs))g", color: .macroCarbs)
                macroLabel("F", value: "\(Int(suggestion.fat))g", color: .macroFat)

                Spacer()

                // Difficulty badge
                Text(suggestion.difficulty)
                    .font(.caption2)
                    .foregroundColor(.brandOrange)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.brandOrange.opacity(0.15))
                    .clipShape(Capsule())
            }

            Button {
                logSuggestion(suggestion)
            } label: {
                Text("Log This Meal")
                    .font(.subheadline.bold())
                    .foregroundColor(.brandDark)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(Color.brandGreen)
                    .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
            }
            .frame(minHeight: Layout.minTouchTarget)
        }
        .padding()
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
    }

    private func macroLabel(_ label: String, value: String, color: Color) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.caption.bold())
                .foregroundColor(color)
            Text(label)
                .font(.caption2)
                .foregroundColor(.gray)
        }
    }

    // MARK: - Error

    private func errorBanner(_ message: String) -> some View {
        VStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle")
                .font(.title2)
                .foregroundColor(.brandOrange)
            Text(message)
                .font(.subheadline)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)

            Button {
                fetchSuggestions()
            } label: {
                Text("Try Again")
                    .font(.subheadline)
                    .foregroundColor(.brandGreen)
            }
            .frame(minHeight: Layout.minTouchTarget)
        }
        .padding()
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
    }

    // MARK: - Helpers

    private func fetchSuggestions() {
        isLoading = true
        errorMessage = nil

        let eaten = todayNutrition
        let targetCal = profile?.targetCalories ?? 2000
        let targetP = profile?.targetProtein ?? 150
        let targetC = profile?.targetCarbs ?? 250
        let targetF = profile?.targetFat ?? 65

        let remainingCalories = targetCal - (eaten?.totalCalories ?? 0)
        let remainingProtein = Double(targetP) - (eaten?.totalProtein ?? 0)
        let remainingCarbs = Double(targetC) - (eaten?.totalCarbs ?? 0)
        let remainingFat = Double(targetF) - (eaten?.totalFat ?? 0)

        let prefs = (profile?.dietaryPreferences ?? []) + (profile?.allergies ?? [])

        Task {
            do {
                let result = try await NourishAPIManager.shared.getSuggestions(
                    remainingCalories: remainingCalories,
                    remainingProtein: remainingProtein,
                    remainingCarbs: remainingCarbs,
                    remainingFat: remainingFat,
                    timeOfDay: timeOfDay,
                    preferences: prefs.isEmpty ? nil : prefs
                )
                await MainActor.run {
                    self.suggestions = result.suggestions
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isLoading = false
                }
            }
        }
    }

    private func logSuggestion(_ suggestion: NourishAPIManager.FoodSuggestion) {
        let entry = FoodEntry(
            name: suggestion.name,
            servingSize: "1 serving",
            mealType: selectedMealType,
            entryMethod: .manual,
            calories: suggestion.calories,
            protein: suggestion.protein,
            carbs: suggestion.carbs,
            fat: suggestion.fat
        )

        modelContext.insert(entry)
        updateDailyNutrition(entry)

        Task {
            try? await HealthKitManager.shared.logNutrition(
                calories: suggestion.calories,
                protein: suggestion.protein,
                carbs: suggestion.carbs,
                fat: suggestion.fat
            )
        }

        dismiss()
    }

    private func updateDailyNutrition(_ entry: FoodEntry) {
        let today = Calendar.current.startOfDay(for: Date())
        let descriptor = FetchDescriptor<DailyNutrition>(
            predicate: #Predicate { $0.date >= today }
        )

        if let existing = try? modelContext.fetch(descriptor).first {
            existing.totalCalories += entry.calories
            existing.totalProtein += entry.protein
            existing.totalCarbs += entry.carbs
            existing.totalFat += entry.fat
            entry.dailyNutrition = existing
            if existing.entries == nil { existing.entries = [] }
            existing.entries?.append(entry)
        } else {
            let daily = DailyNutrition(
                date: today,
                totalCalories: entry.calories,
                totalProtein: entry.protein,
                totalCarbs: entry.carbs,
                totalFat: entry.fat,
                entries: [entry]
            )
            entry.dailyNutrition = daily
            modelContext.insert(daily)
        }
    }
}
