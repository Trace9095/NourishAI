import SwiftUI
import SwiftData

struct ManualEntryView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    @State private var foodName = ""
    @State private var calories = ""
    @State private var protein = ""
    @State private var carbs = ""
    @State private var fat = ""
    @State private var fiber = ""
    @State private var sugar = ""
    @State private var servingSize = ""
    @State private var selectedMealType: MealType = .lunch

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Food name
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Food Name")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                        TextField("e.g., Grilled Chicken Breast", text: $foodName)
                            .textFieldStyle(.roundedBorder)
                            .font(.body)
                    }

                    // Meal type
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Meal Type")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                        HStack(spacing: 10) {
                            ForEach(MealType.allCases, id: \.self) { type in
                                Button {
                                    selectedMealType = type
                                } label: {
                                    VStack(spacing: 4) {
                                        Image(systemName: type.icon)
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

                    // Macros
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Nutrition Info")
                            .font(.subheadline)
                            .foregroundColor(.gray)

                        macroField("Calories", value: $calories, unit: "kcal", color: .macroCalories)
                        macroField("Protein", value: $protein, unit: "g", color: .macroProtein)
                        macroField("Carbs", value: $carbs, unit: "g", color: .macroCarbs)
                        macroField("Fat", value: $fat, unit: "g", color: .macroFat)

                        // Optional fields
                        DisclosureGroup("More Details") {
                            macroField("Fiber", value: $fiber, unit: "g", color: .gray)
                            macroField("Sugar", value: $sugar, unit: "g", color: .gray)
                            HStack {
                                Text("Serving Size")
                                    .foregroundColor(.gray)
                                Spacer()
                                TextField("e.g., 1 cup", text: $servingSize)
                                    .textFieldStyle(.roundedBorder)
                                    .frame(width: 120)
                            }
                        }
                        .foregroundColor(.gray)
                    }

                    // Save button
                    Button {
                        saveEntry()
                    } label: {
                        Text("Log Food")
                            .font(.headline)
                            .foregroundColor(.brandDark)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(canSave ? Color.brandGreen : Color.brandGreen.opacity(0.3))
                            .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
                    }
                    .frame(minHeight: Layout.minTouchTarget)
                    .disabled(!canSave)
                }
                .padding()
            }
            .background(Color.brandDark)
            .navigationTitle("Manual Entry")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    private var canSave: Bool {
        !foodName.isEmpty && !calories.isEmpty
    }

    private func macroField(_ label: String, value: Binding<String>, unit: String, color: Color) -> some View {
        HStack {
            Circle().fill(color).frame(width: 10, height: 10)
            Text(label)
                .foregroundColor(.gray)
            Spacer()
            HStack(spacing: 4) {
                TextField("0", text: value)
                    .textFieldStyle(.roundedBorder)
                    .keyboardType(.decimalPad)
                    .frame(width: 80)
                Text(unit)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
        }
    }

    private func saveEntry() {
        let entry = FoodEntry(
            name: foodName,
            servingSize: servingSize.isEmpty ? "1 serving" : servingSize,
            mealType: selectedMealType,
            entryMethod: .manual,
            calories: Int(calories) ?? 0,
            protein: Double(protein) ?? 0,
            carbs: Double(carbs) ?? 0,
            fat: Double(fat) ?? 0,
            fiber: Double(fiber) ?? 0,
            sugar: Double(sugar) ?? 0,
            sodium: 0
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
        } else {
            let daily = DailyNutrition(
                date: today,
                totalCalories: entry.calories,
                totalProtein: entry.protein,
                totalCarbs: entry.carbs,
                totalFat: entry.fat
            )
            modelContext.insert(daily)
        }

        // Push to HealthKit
        Task {
            try? await HealthKitManager.shared.logNutrition(
                calories: entry.calories,
                protein: entry.protein,
                carbs: entry.carbs,
                fat: entry.fat
            )
        }

        dismiss()
    }
}
