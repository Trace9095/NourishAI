import Foundation

enum NutritionCalculator {

    // MARK: - BMR (Mifflin-St Jeor)

    static func bmr(
        weightKg: Double,
        heightCm: Double,
        age: Int,
        sex: BiologicalSex
    ) -> Double {
        let base = (10 * weightKg) + (6.25 * heightCm) - (5 * Double(age))
        switch sex {
        case .male: return base + 5
        case .female: return base - 161
        case .other, .notSet: return base - 78 // average
        }
    }

    // MARK: - TDEE

    static func tdee(
        weightKg: Double,
        heightCm: Double,
        age: Int,
        sex: BiologicalSex,
        activityLevel: ActivityLevel
    ) -> Double {
        bmr(weightKg: weightKg, heightCm: heightCm, age: age, sex: sex) * activityLevel.multiplier
    }

    // MARK: - Target Macros

    struct MacroTargets: Sendable {
        let calories: Int
        let protein: Int // grams
        let carbs: Int // grams
        let fat: Int // grams
    }

    static func calculateTargets(
        weightKg: Double,
        heightCm: Double,
        age: Int,
        sex: BiologicalSex,
        activityLevel: ActivityLevel,
        goal: NutritionGoal
    ) -> MacroTargets {
        let baseTDEE = tdee(
            weightKg: weightKg,
            heightCm: heightCm,
            age: age,
            sex: sex,
            activityLevel: activityLevel
        )

        let targetCalories = Int(baseTDEE * (1 + goal.calorieAdjustment))

        // Protein: 1.6-2.2g per kg bodyweight
        let proteinMultiplier: Double
        switch goal {
        case .cut: proteinMultiplier = 2.2
        case .maintenance: proteinMultiplier = 1.8
        case .bulk: proteinMultiplier = 2.0
        }
        let proteinGrams = Int(weightKg * proteinMultiplier)

        // Fat: 25-30% of calories
        let fatCalories = Double(targetCalories) * 0.27
        let fatGrams = Int(fatCalories / 9)

        // Carbs: remaining calories
        let proteinCalories = proteinGrams * 4
        let carbCalories = targetCalories - proteinCalories - Int(fatCalories)
        let carbGrams = max(0, carbCalories / 4)

        return MacroTargets(
            calories: targetCalories,
            protein: proteinGrams,
            carbs: carbGrams,
            fat: fatGrams
        )
    }

    // MARK: - Water Target

    static func waterTargetMl(weightKg: Double, activityLevel: ActivityLevel) -> Int {
        let baseMl = weightKg * 33 // 33ml per kg base
        let activityBonus: Double
        switch activityLevel {
        case .sedentary: activityBonus = 0
        case .light: activityBonus = 250
        case .moderate: activityBonus = 500
        case .active: activityBonus = 750
        case .veryActive: activityBonus = 1000
        }
        return Int(baseMl + activityBonus)
    }
}
