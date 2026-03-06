import Foundation
import UIKit

/// Server proxy client — all AI calls go through the website API routes.
/// NO embedded API keys. The server handles Claude API calls.
actor NourishAPIManager {
    static let shared = NourishAPIManager()

    private var deviceId: String {
        if let stored = UserDefaults.standard.string(forKey: "nourishai_device_id") {
            return stored
        }
        let newId = UUID().uuidString
        UserDefaults.standard.set(newId, forKey: "nourishai_device_id")
        return newId
    }

    // MARK: - Register Device

    struct RegisterResponse: Codable, Sendable {
        let userId: String
        let subscriptionTier: String
        let subscriptionExpiresAt: String?
    }

    func registerDevice() async throws -> RegisterResponse {
        let url = URL(string: APIConfig.registerDevice)!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(["deviceId": deviceId])

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode < 300 else {
            throw APIError.registrationFailed
        }
        return try JSONDecoder().decode(RegisterResponse.self, from: data)
    }

    // MARK: - Analyze Food Photo

    struct FoodAnalysis: Codable, Sendable {
        let foods: [AnalyzedFood]?
        let totalCalories: Int?
        let totalProtein: Double?
        let totalCarbs: Double?
        let totalFat: Double?
        let confidence: String?
        let notes: String?
        let raw: String?
        let parseError: Bool?
    }

    struct AnalyzedFood: Codable, Sendable {
        let name: String
        let servingSize: String?
        let calories: Int
        let protein: Double
        let carbs: Double
        let fat: Double
        let fiber: Double?
    }

    struct AnalysisResponse: Codable, Sendable {
        let analysis: FoodAnalysis
        let tokensUsed: Int?
    }

    /// Flattened response for view consumption
    struct FoodAnalysisResponse: Sendable {
        let foodName: String
        let description: String?
        let calories: Int
        let protein: Double
        let carbs: Double
        let fat: Double
        let fiber: Double?
        let sugar: Double?
        let sodium: Double?
        let servingSize: String?
        let confidence: String?
        let notes: String?

        init(from response: AnalysisResponse) {
            let firstFood = response.analysis.foods?.first
            self.foodName = firstFood?.name ?? "Unknown Food"
            self.description = response.analysis.notes
            self.calories = firstFood?.calories ?? response.analysis.totalCalories ?? 0
            self.protein = firstFood?.protein ?? response.analysis.totalProtein ?? 0
            self.carbs = firstFood?.carbs ?? response.analysis.totalCarbs ?? 0
            self.fat = firstFood?.fat ?? response.analysis.totalFat ?? 0
            self.fiber = firstFood?.fiber
            self.sugar = nil
            self.sodium = nil
            self.servingSize = firstFood?.servingSize
            self.confidence = response.analysis.confidence
            self.notes = response.analysis.notes
        }
    }

    func analyzeFood(image: UIImage) async throws -> FoodAnalysisResponse {
        guard let imageData = image.jpegData(compressionQuality: 0.8) else {
            throw APIError.invalidImage
        }

        let base64 = imageData.base64EncodedString()
        let url = URL(string: APIConfig.analyzeFood)!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(deviceId, forHTTPHeaderField: "X-Device-ID")

        let body: [String: String] = [
            "imageBase64": base64,
            "mediaType": "image/jpeg",
        ]
        request.httpBody = try JSONEncoder().encode(body)

        let (data, response) = try await URLSession.shared.data(for: request)
        let httpResponse = response as? HTTPURLResponse

        if httpResponse?.statusCode == 403 {
            throw APIError.scanLimitReached
        }
        if httpResponse?.statusCode == 429 {
            throw APIError.cooldownActive
        }
        guard let statusCode = httpResponse?.statusCode, statusCode < 300 else {
            throw APIError.analysisServerError
        }

        let raw = try JSONDecoder().decode(AnalysisResponse.self, from: data)
        return FoodAnalysisResponse(from: raw)
    }

    // MARK: - Analyze Text Description

    func analyzeDescription(_ description: String) async throws -> FoodAnalysisResponse {
        let url = URL(string: APIConfig.analyzeDescription)!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(deviceId, forHTTPHeaderField: "X-Device-ID")
        request.httpBody = try JSONEncoder().encode(["description": description])

        let (data, response) = try await URLSession.shared.data(for: request)
        let httpResponse = response as? HTTPURLResponse

        if httpResponse?.statusCode == 403 {
            throw APIError.scanLimitReached
        }
        guard let statusCode = httpResponse?.statusCode, statusCode < 300 else {
            throw APIError.analysisServerError
        }

        let raw = try JSONDecoder().decode(AnalysisResponse.self, from: data)
        return FoodAnalysisResponse(from: raw)
    }

    // MARK: - Barcode Lookup

    struct BarcodeResponse: Codable, Sendable {
        let product: BarcodeProduct

        // Convenience accessors for views
        var productName: String { product.name }
        var brand: String? { product.brand.isEmpty ? nil : product.brand }
        var servingSize: String? { product.servingSize.isEmpty ? nil : product.servingSize }
        var calories: Int { product.nutrition.calories }
        var protein: Double { product.nutrition.protein }
        var carbs: Double { product.nutrition.carbs }
        var fat: Double { product.nutrition.fat }
        var fiber: Double? { product.nutrition.fiber > 0 ? product.nutrition.fiber : nil }
        var sugar: Double? { product.nutrition.sugar > 0 ? product.nutrition.sugar : nil }
        var sodium: Double? { product.nutrition.sodium > 0 ? product.nutrition.sodium : nil }
    }

    struct BarcodeProduct: Codable, Sendable {
        let name: String
        let brand: String
        let servingSize: String
        let imageUrl: String?
        let nutrition: BarcodeNutrition
    }

    struct BarcodeNutrition: Codable, Sendable {
        let calories: Int
        let protein: Double
        let carbs: Double
        let fat: Double
        let fiber: Double
        let sugar: Double
        let sodium: Double
    }

    func lookupBarcode(_ barcode: String) async throws -> BarcodeResponse {
        var components = URLComponents(string: APIConfig.lookupBarcode)!
        components.queryItems = [URLQueryItem(name: "barcode", value: barcode)]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue(deviceId, forHTTPHeaderField: "X-Device-ID")

        let (data, response) = try await URLSession.shared.data(for: request)
        let httpResponse = response as? HTTPURLResponse

        if httpResponse?.statusCode == 404 {
            throw APIError.productNotFound
        }
        guard let statusCode = httpResponse?.statusCode, statusCode < 300 else {
            throw APIError.barcodeLookupFailed
        }

        return try JSONDecoder().decode(BarcodeResponse.self, from: data)
    }

    // MARK: - Scan Count

    struct ScanCountResponse: Codable, Sendable {
        let scansUsed: Int
        let scansMax: Int?
        let isPro: Bool
        let canScan: Bool
        let weekResetsAt: String
    }

    func getScanCount() async throws -> ScanCountResponse {
        let url = URL(string: APIConfig.scanCount)!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue(deviceId, forHTTPHeaderField: "X-Device-ID")

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode < 300 else {
            throw APIError.networkError
        }

        return try JSONDecoder().decode(ScanCountResponse.self, from: data)
    }

    // MARK: - Verify Subscription

    func verifySubscription(transactionId: String, productId: String, expiresDate: Date?) async throws {
        let url = URL(string: APIConfig.verifySubscription)!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(deviceId, forHTTPHeaderField: "X-Device-ID")

        var body: [String: String] = [
            "transactionId": transactionId,
            "productId": productId,
        ]
        if let expires = expiresDate {
            body["expiresDate"] = ISO8601DateFormatter().string(from: expires)
        }
        request.httpBody = try JSONEncoder().encode(body)

        let (_, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode < 300 else {
            throw APIError.subscriptionVerificationFailed
        }
    }
}

// MARK: - API Errors

enum APIError: LocalizedError, Sendable {
    case registrationFailed
    case invalidImage
    case scanLimitReached
    case cooldownActive
    case analysisServerError
    case productNotFound
    case barcodeLookupFailed
    case subscriptionVerificationFailed
    case networkError

    var errorDescription: String? {
        switch self {
        case .registrationFailed: return "Failed to register device"
        case .invalidImage: return "Could not process image"
        case .scanLimitReached: return "Weekly scan limit reached. Upgrade to Pro for unlimited scans."
        case .cooldownActive: return "Please wait 30 seconds between scans"
        case .analysisServerError: return "AI analysis temporarily unavailable"
        case .productNotFound: return "Product not found in database"
        case .barcodeLookupFailed: return "Barcode lookup failed"
        case .subscriptionVerificationFailed: return "Could not verify subscription"
        case .networkError: return "Network connection error"
        }
    }
}
