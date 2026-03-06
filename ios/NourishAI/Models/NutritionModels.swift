import Foundation
import SwiftData

// MARK: - Daily Nutrition (aggregated daily totals)

@Model
final class DailyNutrition {
    var id: UUID
    var date: Date
    var totalCalories: Int
    var totalProtein: Double
    var totalCarbs: Double
    var totalFat: Double
    var totalFiber: Double
    var totalSugar: Double
    var totalSodium: Double
    var entries: [FoodEntry]?

    init(
        id: UUID = UUID(),
        date: Date = Calendar.current.startOfDay(for: Date()),
        totalCalories: Int = 0,
        totalProtein: Double = 0,
        totalCarbs: Double = 0,
        totalFat: Double = 0,
        totalFiber: Double = 0,
        totalSugar: Double = 0,
        totalSodium: Double = 0,
        entries: [FoodEntry]? = nil
    ) {
        self.id = id
        self.date = date
        self.totalCalories = totalCalories
        self.totalProtein = totalProtein
        self.totalCarbs = totalCarbs
        self.totalFat = totalFat
        self.totalFiber = totalFiber
        self.totalSugar = totalSugar
        self.totalSodium = totalSodium
        self.entries = entries
    }
}

// MARK: - Food Entry (individual logged meal/food)

@Model
final class FoodEntry {
    var id: UUID
    var name: String
    var brand: String?
    var servingSize: String
    var mealType: MealType
    var entryMethod: EntryMethod
    var calories: Int
    var protein: Double
    var carbs: Double
    var fat: Double
    var fiber: Double
    var sugar: Double
    var sodium: Double
    var barcode: String?
    var imageData: Data?
    var aiConfidence: String?
    var loggedAt: Date
    var dailyNutrition: DailyNutrition?

    init(
        id: UUID = UUID(),
        name: String,
        brand: String? = nil,
        servingSize: String = "1 serving",
        mealType: MealType = .snack,
        entryMethod: EntryMethod = .manual,
        calories: Int = 0,
        protein: Double = 0,
        carbs: Double = 0,
        fat: Double = 0,
        fiber: Double = 0,
        sugar: Double = 0,
        sodium: Double = 0,
        barcode: String? = nil,
        imageData: Data? = nil,
        aiConfidence: String? = nil,
        loggedAt: Date = Date()
    ) {
        self.id = id
        self.name = name
        self.brand = brand
        self.servingSize = servingSize
        self.mealType = mealType
        self.entryMethod = entryMethod
        self.calories = calories
        self.protein = protein
        self.carbs = carbs
        self.fat = fat
        self.fiber = fiber
        self.sugar = sugar
        self.sodium = sodium
        self.barcode = barcode
        self.imageData = imageData
        self.aiConfidence = aiConfidence
        self.loggedAt = loggedAt
    }
}

// MARK: - Saved Food (favorites/frequently used)

@Model
final class SavedFood {
    var id: UUID
    var name: String
    var brand: String?
    var servingSize: String
    var calories: Int
    var protein: Double
    var carbs: Double
    var fat: Double
    var fiber: Double
    var barcode: String?
    var timesUsed: Int
    var lastUsed: Date
    var createdAt: Date

    init(
        id: UUID = UUID(),
        name: String,
        brand: String? = nil,
        servingSize: String = "1 serving",
        calories: Int = 0,
        protein: Double = 0,
        carbs: Double = 0,
        fat: Double = 0,
        fiber: Double = 0,
        barcode: String? = nil,
        timesUsed: Int = 1
    ) {
        self.id = id
        self.name = name
        self.brand = brand
        self.servingSize = servingSize
        self.calories = calories
        self.protein = protein
        self.carbs = carbs
        self.fat = fat
        self.fiber = fiber
        self.barcode = barcode
        self.timesUsed = timesUsed
        self.lastUsed = Date()
        self.createdAt = Date()
    }
}

// MARK: - Water Intake

@Model
final class DailyWaterIntake {
    var id: UUID
    var date: Date
    var totalMl: Int
    var entries: [WaterEntry]?

    init(
        id: UUID = UUID(),
        date: Date = Calendar.current.startOfDay(for: Date()),
        totalMl: Int = 0,
        entries: [WaterEntry]? = nil
    ) {
        self.id = id
        self.date = date
        self.totalMl = totalMl
        self.entries = entries
    }
}

@Model
final class WaterEntry {
    var id: UUID
    var amountMl: Int
    var loggedAt: Date
    var dailyWaterIntake: DailyWaterIntake?

    init(
        id: UUID = UUID(),
        amountMl: Int = 250,
        loggedAt: Date = Date()
    ) {
        self.id = id
        self.amountMl = amountMl
        self.loggedAt = loggedAt
    }
}

// MARK: - Enums

enum MealType: String, Codable, Sendable, CaseIterable {
    case breakfast, lunch, dinner, snack

    var displayName: String {
        switch self {
        case .breakfast: return "Breakfast"
        case .lunch: return "Lunch"
        case .dinner: return "Dinner"
        case .snack: return "Snack"
        }
    }

    var icon: String {
        switch self {
        case .breakfast: return "sunrise.fill"
        case .lunch: return "sun.max.fill"
        case .dinner: return "moon.fill"
        case .snack: return "leaf.fill"
        }
    }
}

enum EntryMethod: String, Codable, Sendable {
    case aiPhoto, aiDescription, barcode, manual, saved
}
