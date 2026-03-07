import SwiftUI
import SwiftData

struct AIFoodChatView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    @State private var foodDescription = ""
    @State private var isAnalyzing = false
    @State private var analysisResult: NourishAPIManager.FoodAnalysisResponse?
    @State private var errorMessage: String?
    @State private var selectedMealType: MealType = .lunch

    var body: some View {
        NavigationStack {
            ZStack {
                Color.brandDark.ignoresSafeArea()

                if analysisResult == nil && errorMessage == nil {
                    inputView
                } else if let result = analysisResult {
                    resultView(result)
                } else if let error = errorMessage {
                    errorView(error)
                }
            }
            .navigationTitle("Describe Food")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    // MARK: - Input
    private var inputView: some View {
        VStack(spacing: 24) {
            Spacer()

            Image(systemName: "text.bubble.fill")
                .font(.system(size: 48))
                .foregroundColor(.brandGreen)

            VStack(spacing: 8) {
                Text("Describe Your Meal")
                    .font(.title2.bold())
                    .foregroundColor(.white)
                Text("Tell us what you ate and we'll calculate the macros")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)
            }

            // Text input
            VStack(spacing: 12) {
                TextEditor(text: $foodDescription)
                    .frame(height: 120)
                    .padding(12)
                    .background(Color.brandCard)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .foregroundColor(.white)
                    .overlay(alignment: .topLeading) {
                        if foodDescription.isEmpty {
                            Text("e.g., Grilled chicken breast with brown rice and steamed broccoli")
                                .foregroundColor(.gray.opacity(0.5))
                                .padding(16)
                                .allowsHitTesting(false)
                        }
                    }

                // Meal type selector
                HStack(spacing: 10) {
                    ForEach(MealType.allCases, id: \.self) { type in
                        Button {
                            selectedMealType = type
                        } label: {
                            VStack(spacing: 4) {
                                Image(systemName: type.icon)
                                    .font(.caption)
                                Text(type.displayName)
                                    .font(.caption2)
                            }
                            .foregroundColor(selectedMealType == type ? .brandDark : .gray)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 8)
                            .frame(maxWidth: .infinity)
                            .background(selectedMealType == type ? Color.brandGreen : Color.brandCard)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                        }
                        .frame(minHeight: Layout.minTouchTarget)
                    }
                }
            }
            .padding(.horizontal, 20)

            // Quick suggestions
            VStack(spacing: 8) {
                Text("Quick suggestions:")
                    .font(.caption)
                    .foregroundColor(.gray)
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(suggestions, id: \.self) { suggestion in
                            Button {
                                foodDescription = suggestion
                            } label: {
                                Text(suggestion)
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 8)
                                    .background(Color.brandCard)
                                    .clipShape(Capsule())
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                }
            }

            Spacer()

            // Analyze button
            Button {
                analyzeDescription()
            } label: {
                HStack {
                    if isAnalyzing {
                        ProgressView()
                            .tint(.brandDark)
                    }
                    Text(isAnalyzing ? "Analyzing..." : "Analyze Food")
                }
                .font(.headline)
                .foregroundColor(.brandDark)
                .frame(maxWidth: .infinity)
                .padding()
                .background(foodDescription.isEmpty ? Color.brandGreen.opacity(0.3) : Color.brandGreen)
                .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
            }
            .frame(minHeight: Layout.minTouchTarget)
            .padding(.horizontal, 20)
            .padding(.bottom, 40)
            .disabled(foodDescription.isEmpty || isAnalyzing)
        }
    }

    // MARK: - Result
    private func resultView(_ result: NourishAPIManager.FoodAnalysisResponse) -> some View {
        ScrollView {
            VStack(spacing: 20) {
                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 48))
                    .foregroundColor(.brandGreen)

                Text(result.foodName)
                    .font(.title2.bold())
                    .foregroundColor(.white)

                if let description = result.description {
                    Text(description)
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                }

                // Macros
                VStack(spacing: 12) {
                    macroRow("Calories", value: "\(result.calories) kcal", color: .macroCalories)
                    macroRow("Protein", value: "\(Int(result.protein))g", color: .macroProtein)
                    macroRow("Carbs", value: "\(Int(result.carbs))g", color: .macroCarbs)
                    macroRow("Fat", value: "\(Int(result.fat))g", color: .macroFat)
                    if let fiber = result.fiber {
                        macroRow("Fiber", value: "\(Int(fiber))g", color: .gray)
                    }
                }
                .padding()
                .background(Color.brandCard)
                .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))

                Button {
                    saveFoodEntry(result)
                } label: {
                    Text("Log This Meal")
                        .font(.headline)
                        .foregroundColor(.brandDark)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.brandGreen)
                        .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
                }
                .frame(minHeight: Layout.minTouchTarget)

                Button {
                    reset()
                } label: {
                    Text("Describe Another")
                        .font(.subheadline)
                        .foregroundColor(.brandGreen)
                }
                .frame(minHeight: Layout.minTouchTarget)
            }
            .padding()
        }
    }

    // MARK: - Error
    private func errorView(_ message: String) -> some View {
        VStack(spacing: 24) {
            Spacer()
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 48))
                .foregroundColor(.brandOrange)
            Text("Analysis Failed")
                .font(.headline)
                .foregroundColor(.white)
            Text(message)
                .font(.subheadline)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
            Button {
                reset()
            } label: {
                Text("Try Again")
                    .font(.headline)
                    .foregroundColor(.brandDark)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.brandGreen)
                    .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
            }
            .frame(minHeight: Layout.minTouchTarget)
            .padding(.horizontal, 20)
            Spacer()
        }
    }

    // MARK: - Helpers

    private var suggestions: [String] {
        [
            "2 eggs with toast and avocado",
            "Grilled chicken salad",
            "Protein shake with banana",
            "Steak with sweet potato",
            "Oatmeal with berries",
        ]
    }

    private func macroRow(_ label: String, value: String, color: Color) -> some View {
        HStack {
            Circle().fill(color).frame(width: 10, height: 10)
            Text(label).foregroundColor(.gray)
            Spacer()
            Text(value).foregroundColor(.white).fontWeight(.semibold)
        }
    }

    private func analyzeDescription() {
        isAnalyzing = true
        errorMessage = nil

        Task {
            do {
                let result = try await NourishAPIManager.shared.analyzeDescription(foodDescription)
                await MainActor.run {
                    self.analysisResult = result
                    self.isAnalyzing = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isAnalyzing = false
                }
            }
        }
    }

    private func saveFoodEntry(_ result: NourishAPIManager.FoodAnalysisResponse) {
        let entry = FoodEntry(
            name: result.foodName,
            servingSize: result.servingSize ?? "1 serving",
            mealType: selectedMealType,
            entryMethod: .aiDescription,
            calories: result.calories,
            protein: result.protein,
            carbs: result.carbs,
            fat: result.fat,
            fiber: result.fiber ?? 0,
            sugar: result.sugar ?? 0,
            sodium: result.sodium ?? 0
        )

        modelContext.insert(entry)

        // Update daily nutrition
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

        Task {
            try? await HealthKitManager.shared.logNutrition(
                calories: result.calories,
                protein: result.protein,
                carbs: result.carbs,
                fat: result.fat
            )
        }

        dismiss()
    }

    private func reset() {
        foodDescription = ""
        analysisResult = nil
        errorMessage = nil
        isAnalyzing = false
    }
}
