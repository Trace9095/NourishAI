import SwiftUI
import SwiftData

struct AIFoodCameraView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @Query private var profiles: [UserProfile]

    @State private var capturedImage: UIImage?
    @State private var isAnalyzing = false
    @State private var analysisResult: NourishAPIManager.FoodAnalysisResponse?
    @State private var errorMessage: String?
    @State private var showCamera = true
    @State private var selectedMealType: MealType = .lunch

    private var profile: UserProfile? { profiles.first }

    var body: some View {
        NavigationStack {
            ZStack {
                Color.brandDark.ignoresSafeArea()

                if showCamera && capturedImage == nil {
                    cameraPlaceholder
                } else if isAnalyzing {
                    analyzingView
                } else if let result = analysisResult {
                    resultView(result)
                } else if let error = errorMessage {
                    errorView(error)
                }
            }
            .navigationTitle("AI Food Scan")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    // MARK: - Camera placeholder (real camera requires Xcode UIKit bridge)
    private var cameraPlaceholder: some View {
        VStack(spacing: 24) {
            Spacer()

            // Camera viewfinder frame
            RoundedRectangle(cornerRadius: 20)
                .strokeBorder(Color.brandGreen.opacity(0.5), lineWidth: 2)
                .frame(width: 280, height: 280)
                .overlay {
                    VStack(spacing: 16) {
                        Image(systemName: "camera.fill")
                            .font(.system(size: 48))
                            .foregroundColor(.brandGreen)
                        Text("Point camera at your food")
                            .font(.headline)
                            .foregroundColor(.white)
                        Text("Take a clear photo for best results")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                }

            // Meal type selector
            mealTypeSelector

            // Capture button
            Button {
                // In real app, this captures from camera
                // For now, use photo picker
                simulateCapture()
            } label: {
                ZStack {
                    Circle()
                        .fill(Color.brandGreen)
                        .frame(width: 72, height: 72)
                    Circle()
                        .strokeBorder(Color.white, lineWidth: 3)
                        .frame(width: 64, height: 64)
                }
            }
            .frame(minHeight: Layout.minTouchTarget)

            Text("Or use the photo library")
                .font(.caption)
                .foregroundColor(.gray)

            Spacer()
        }
    }

    private var mealTypeSelector: some View {
        HStack(spacing: 12) {
            ForEach(MealType.allCases, id: \.self) { type in
                Button {
                    selectedMealType = type
                } label: {
                    VStack(spacing: 4) {
                        Image(systemName: type.icon)
                            .font(.title3)
                        Text(type.displayName)
                            .font(.caption2)
                    }
                    .foregroundColor(selectedMealType == type ? .brandDark : .gray)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(selectedMealType == type ? Color.brandGreen : Color.brandCard)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }
                .frame(minHeight: Layout.minTouchTarget)
            }
        }
        .padding(.horizontal)
    }

    // MARK: - Analyzing
    private var analyzingView: some View {
        VStack(spacing: 24) {
            Spacer()

            if let image = capturedImage {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(maxHeight: 250)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
            }

            ProgressView()
                .tint(.brandGreen)
                .scaleEffect(1.5)

            VStack(spacing: 8) {
                Text("Analyzing your meal...")
                    .font(.headline)
                    .foregroundColor(.white)
                Text("AI is identifying every food item")
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }

            Spacer()
        }
        .padding()
    }

    // MARK: - Result
    private func resultView(_ result: NourishAPIManager.FoodAnalysisResponse) -> some View {
        ScrollView {
            VStack(spacing: 20) {
                if let image = capturedImage {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFit()
                        .frame(maxHeight: 200)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                }

                // Food name
                Text(result.foodName)
                    .font(.title2.bold())
                    .foregroundColor(.white)

                if let description = result.description {
                    Text(description)
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                }

                // Macro breakdown
                VStack(spacing: 12) {
                    macroRow("Calories", value: "\(result.calories) kcal", color: .macroCalories)
                    macroRow("Protein", value: "\(Int(result.protein))g", color: .macroProtein)
                    macroRow("Carbs", value: "\(Int(result.carbs))g", color: .macroCarbs)
                    macroRow("Fat", value: "\(Int(result.fat))g", color: .macroFat)
                    if let fiber = result.fiber {
                        macroRow("Fiber", value: "\(Int(fiber))g", color: .gray)
                    }
                    if let sugar = result.sugar {
                        macroRow("Sugar", value: "\(Int(sugar))g", color: .gray)
                    }
                }
                .padding()
                .background(Color.brandCard)
                .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))

                // Serving info
                if let serving = result.servingSize {
                    Text("Serving: \(serving)")
                        .font(.caption)
                        .foregroundColor(.gray)
                }

                // Confirm button
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

                // Retake button
                Button {
                    resetScan()
                } label: {
                    Text("Retake Photo")
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
                resetScan()
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

    private func macroRow(_ label: String, value: String, color: Color) -> some View {
        HStack {
            Circle().fill(color).frame(width: 10, height: 10)
            Text(label).foregroundColor(.gray)
            Spacer()
            Text(value).foregroundColor(.white).fontWeight(.semibold)
        }
    }

    private func simulateCapture() {
        // In real app, this would use UIImagePickerController or AVCaptureSession
        // For now, just show the analyzing state with a placeholder
    }

    private func analyzeImage(_ image: UIImage) {
        isAnalyzing = true
        errorMessage = nil

        Task {
            do {
                let result = try await NourishAPIManager.shared.analyzeFood(image: image)
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
            calories: result.calories,
            protein: result.protein,
            carbs: result.carbs,
            fat: result.fat,
            fiber: result.fiber ?? 0,
            sugar: result.sugar ?? 0,
            sodium: result.sodium ?? 0,
            servingSize: result.servingSize,
            mealType: selectedMealType,
            entryMethod: .aiPhoto
        )

        modelContext.insert(entry)

        // Update daily nutrition
        updateDailyNutrition(entry)

        // Push to HealthKit
        Task {
            try? await HealthKitManager.shared.writeDietaryEnergy(calories: Double(result.calories))
            try? await HealthKitManager.shared.writeProtein(grams: result.protein)
            try? await HealthKitManager.shared.writeCarbs(grams: result.carbs)
            try? await HealthKitManager.shared.writeFat(grams: result.fat)
        }

        dismiss()
    }

    private func updateDailyNutrition(_ entry: FoodEntry) {
        // Find or create today's daily nutrition
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
    }

    private func resetScan() {
        capturedImage = nil
        analysisResult = nil
        errorMessage = nil
        isAnalyzing = false
        showCamera = true
    }
}
