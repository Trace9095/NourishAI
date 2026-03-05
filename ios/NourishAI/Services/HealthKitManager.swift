import Foundation
import HealthKit

/// Manages all HealthKit interactions — reads body metrics, writes nutrition data.
/// All HealthKit operations are local-only (no server involvement).
actor HealthKitManager {
    static let shared = HealthKitManager()

    private let healthStore = HKHealthStore()

    var isAvailable: Bool {
        HKHealthStore.isHealthDataAvailable()
    }

    // MARK: - Authorization

    private var readTypes: Set<HKObjectType> {
        Set([
            HKQuantityType(.height),
            HKQuantityType(.bodyMass),
            HKQuantityType(.activeEnergyBurned),
            HKQuantityType(.basalEnergyBurned),
            HKQuantityType(.stepCount),
            HKQuantityType(.dietaryEnergyConsumed),
            HKQuantityType(.dietaryProtein),
            HKQuantityType(.dietaryCarbohydrates),
            HKQuantityType(.dietaryFatTotal),
            HKCharacteristicType(.biologicalSex),
            HKCharacteristicType(.dateOfBirth),
            HKCategoryType(.sleepAnalysis),
        ])
    }

    private var writeTypes: Set<HKSampleType> {
        Set([
            HKQuantityType(.dietaryEnergyConsumed),
            HKQuantityType(.dietaryProtein),
            HKQuantityType(.dietaryCarbohydrates),
            HKQuantityType(.dietaryFatTotal),
            HKQuantityType(.dietaryFiber),
            HKQuantityType(.dietarySugar),
            HKQuantityType(.dietarySodium),
            HKQuantityType(.dietaryWater),
            HKQuantityType(.bodyMass),
        ])
    }

    func requestAuthorization() async throws {
        guard isAvailable else { return }
        try await healthStore.requestAuthorization(toShare: writeTypes, read: readTypes)
    }

    // MARK: - Read Body Metrics

    func getHeight() async throws -> Double? {
        try await getMostRecentQuantity(.height, unit: .meterUnit(with: .centi))
    }

    func getWeight() async throws -> Double? {
        try await getMostRecentQuantity(.bodyMass, unit: .gramUnit(with: .kilo))
    }

    func getBiologicalSex() -> HKBiologicalSex? {
        try? healthStore.biologicalSex().biologicalSex
    }

    func getDateOfBirth() -> DateComponents? {
        try? healthStore.dateOfBirthComponents()
    }

    func getAge() -> Int? {
        guard let dob = getDateOfBirth(),
              let birthDate = Calendar.current.date(from: dob) else { return nil }
        return Calendar.current.dateComponents([.year], from: birthDate, to: Date()).year
    }

    func getSteps(for date: Date) async throws -> Double {
        try await getDailySum(.stepCount, unit: .count(), date: date)
    }

    func getActiveCalories(for date: Date) async throws -> Double {
        try await getDailySum(.activeEnergyBurned, unit: .kilocalorie(), date: date)
    }

    // MARK: - Write Nutrition Data

    func logNutrition(
        calories: Int,
        protein: Double,
        carbs: Double,
        fat: Double,
        fiber: Double = 0,
        sugar: Double = 0,
        sodium: Double = 0,
        date: Date = Date()
    ) async throws {
        var samples: [HKQuantitySample] = []

        if calories > 0 {
            samples.append(makeSample(.dietaryEnergyConsumed, value: Double(calories), unit: .kilocalorie(), date: date))
        }
        if protein > 0 {
            samples.append(makeSample(.dietaryProtein, value: protein, unit: .gram(), date: date))
        }
        if carbs > 0 {
            samples.append(makeSample(.dietaryCarbohydrates, value: carbs, unit: .gram(), date: date))
        }
        if fat > 0 {
            samples.append(makeSample(.dietaryFatTotal, value: fat, unit: .gram(), date: date))
        }
        if fiber > 0 {
            samples.append(makeSample(.dietaryFiber, value: fiber, unit: .gram(), date: date))
        }
        if sugar > 0 {
            samples.append(makeSample(.dietarySugar, value: sugar, unit: .gram(), date: date))
        }
        if sodium > 0 {
            samples.append(makeSample(.dietarySodium, value: sodium, unit: .gramUnit(with: .milli), date: date))
        }

        guard !samples.isEmpty else { return }
        try await healthStore.save(samples)
    }

    func logWater(ml: Int, date: Date = Date()) async throws {
        let sample = makeSample(.dietaryWater, value: Double(ml), unit: .literUnit(with: .milli), date: date)
        try await healthStore.save(sample)
    }

    func logWeight(kg: Double, date: Date = Date()) async throws {
        let sample = makeSample(.bodyMass, value: kg, unit: .gramUnit(with: .kilo), date: date)
        try await healthStore.save(sample)
    }

    // MARK: - Private Helpers

    private func getMostRecentQuantity(_ type: HKQuantityTypeIdentifier, unit: HKUnit) async throws -> Double? {
        let quantityType = HKQuantityType(type)
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
        let predicate = HKQuery.predicateForSamples(withStart: nil, end: Date(), options: .strictEndDate)

        return try await withCheckedThrowingContinuation { continuation in
            let query = HKSampleQuery(
                sampleType: quantityType,
                predicate: predicate,
                limit: 1,
                sortDescriptors: [sortDescriptor]
            ) { _, samples, error in
                if let error {
                    continuation.resume(throwing: error)
                    return
                }
                let value = (samples?.first as? HKQuantitySample)?.quantity.doubleValue(for: unit)
                continuation.resume(returning: value)
            }
            healthStore.execute(query)
        }
    }

    private func getDailySum(_ type: HKQuantityTypeIdentifier, unit: HKUnit, date: Date) async throws -> Double {
        let start = Calendar.current.startOfDay(for: date)
        let end = Calendar.current.date(byAdding: .day, value: 1, to: start)!
        let predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: .strictStartDate)

        return try await withCheckedThrowingContinuation { continuation in
            let query = HKStatisticsQuery(
                quantityType: HKQuantityType(type),
                quantitySamplePredicate: predicate,
                options: .cumulativeSum
            ) { _, result, error in
                if let error {
                    continuation.resume(throwing: error)
                    return
                }
                let value = result?.sumQuantity()?.doubleValue(for: unit) ?? 0
                continuation.resume(returning: value)
            }
            healthStore.execute(query)
        }
    }

    private func makeSample(_ type: HKQuantityTypeIdentifier, value: Double, unit: HKUnit, date: Date) -> HKQuantitySample {
        HKQuantitySample(
            type: HKQuantityType(type),
            quantity: HKQuantity(unit: unit, doubleValue: value),
            start: date,
            end: date
        )
    }
}
