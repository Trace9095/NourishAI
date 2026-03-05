import Foundation
import SwiftData

@Model
final class UserProfile: Sendable {
    var id: UUID
    var deviceId: String
    var serverUserId: String?

    // Personal info
    var name: String
    var age: Int
    var heightCm: Double
    var weightKg: Double
    var biologicalSex: BiologicalSex
    var activityLevel: ActivityLevel

    // Nutrition goals
    var nutritionGoal: NutritionGoal
    var targetCalories: Int
    var targetProtein: Int // grams
    var targetCarbs: Int // grams
    var targetFat: Int // grams
    var targetWaterMl: Int

    // Dietary preferences
    var dietaryPreferences: [String]? // vegetarian, vegan, keto, etc.
    var allergies: [String]?

    // App state
    var onboardingComplete: Bool
    var subscriptionTier: String // "free" or "pro"
    var subscriptionExpiresAt: Date?
    var healthKitEnabled: Bool
    var notificationsEnabled: Bool

    // Timestamps
    var createdAt: Date
    var updatedAt: Date

    init(
        id: UUID = UUID(),
        deviceId: String = UUID().uuidString,
        name: String = "",
        age: Int = 25,
        heightCm: Double = 175,
        weightKg: Double = 75,
        biologicalSex: BiologicalSex = .notSet,
        activityLevel: ActivityLevel = .moderate,
        nutritionGoal: NutritionGoal = .maintenance,
        targetCalories: Int = 2000,
        targetProtein: Int = 150,
        targetCarbs: Int = 250,
        targetFat: Int = 65,
        targetWaterMl: Int = 2500,
        dietaryPreferences: [String]? = nil,
        allergies: [String]? = nil,
        onboardingComplete: Bool = false,
        subscriptionTier: String = "free",
        healthKitEnabled: Bool = false,
        notificationsEnabled: Bool = false
    ) {
        self.id = id
        self.deviceId = deviceId
        self.name = name
        self.age = age
        self.heightCm = heightCm
        self.weightKg = weightKg
        self.biologicalSex = biologicalSex
        self.activityLevel = activityLevel
        self.nutritionGoal = nutritionGoal
        self.targetCalories = targetCalories
        self.targetProtein = targetProtein
        self.targetCarbs = targetCarbs
        self.targetFat = targetFat
        self.targetWaterMl = targetWaterMl
        self.dietaryPreferences = dietaryPreferences
        self.allergies = allergies
        self.onboardingComplete = onboardingComplete
        self.subscriptionTier = subscriptionTier
        self.healthKitEnabled = healthKitEnabled
        self.notificationsEnabled = notificationsEnabled
        self.createdAt = Date()
        self.updatedAt = Date()
    }
}

// MARK: - Enums

enum BiologicalSex: String, Codable, Sendable, CaseIterable {
    case male, female, other, notSet

    var displayName: String {
        switch self {
        case .male: return "Male"
        case .female: return "Female"
        case .other: return "Other"
        case .notSet: return "Prefer not to say"
        }
    }
}

enum ActivityLevel: String, Codable, Sendable, CaseIterable {
    case sedentary, light, moderate, active, veryActive

    var displayName: String {
        switch self {
        case .sedentary: return "Sedentary"
        case .light: return "Lightly Active"
        case .moderate: return "Moderately Active"
        case .active: return "Active"
        case .veryActive: return "Very Active"
        }
    }

    var multiplier: Double {
        switch self {
        case .sedentary: return 1.2
        case .light: return 1.375
        case .moderate: return 1.55
        case .active: return 1.725
        case .veryActive: return 1.9
        }
    }
}

enum NutritionGoal: String, Codable, Sendable, CaseIterable {
    case cut, maintenance, bulk

    var displayName: String {
        switch self {
        case .cut: return "Lose Fat"
        case .maintenance: return "Maintain Weight"
        case .bulk: return "Build Muscle"
        }
    }

    var calorieAdjustment: Double {
        switch self {
        case .cut: return -0.20 // 20% deficit
        case .maintenance: return 0
        case .bulk: return 0.15 // 15% surplus
        }
    }
}
