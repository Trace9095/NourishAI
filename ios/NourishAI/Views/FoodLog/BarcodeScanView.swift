import SwiftUI
import SwiftData

struct BarcodeScanView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss

    @State private var scannedBarcode: String?
    @State private var isLooking = false
    @State private var lookupResult: NourishAPIManager.BarcodeResponse?
    @State private var errorMessage: String?
    @State private var selectedMealType: MealType = .lunch
    @State private var manualBarcode = ""

    var body: some View {
        NavigationStack {
            ZStack {
                Color.brandDark.ignoresSafeArea()

                if lookupResult == nil && errorMessage == nil {
                    scannerView
                } else if isLooking {
                    lookingUpView
                } else if let result = lookupResult {
                    resultView(result)
                } else if let error = errorMessage {
                    errorView(error)
                }
            }
            .navigationTitle("Barcode Scanner")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    // MARK: - Scanner placeholder
    private var scannerView: some View {
        VStack(spacing: 24) {
            Spacer()

            // Scanner viewfinder
            RoundedRectangle(cornerRadius: 20)
                .strokeBorder(Color.brandGreen.opacity(0.5), lineWidth: 2)
                .frame(width: 280, height: 200)
                .overlay {
                    VStack(spacing: 16) {
                        Image(systemName: "barcode.viewfinder")
                            .font(.system(size: 48))
                            .foregroundColor(.brandGreen)
                        Text("Scan product barcode")
                            .font(.headline)
                            .foregroundColor(.white)
                        Text("Position barcode within the frame")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                }

            // Meal type
            mealTypePicker

            // Manual entry option
            VStack(spacing: 12) {
                Text("Or enter barcode manually")
                    .font(.caption)
                    .foregroundColor(.gray)
                HStack(spacing: 8) {
                    TextField("Barcode number", text: $manualBarcode)
                        .textFieldStyle(.roundedBorder)
                        .keyboardType(.numberPad)
                    Button {
                        lookupBarcode(manualBarcode)
                    } label: {
                        Text("Look Up")
                            .font(.subheadline.bold())
                            .foregroundColor(.brandDark)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                            .background(Color.brandGreen)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                    }
                    .frame(minHeight: Layout.minTouchTarget)
                    .disabled(manualBarcode.count < 8)
                }
                .padding(.horizontal, 20)
            }

            Spacer()
        }
    }

    private var mealTypePicker: some View {
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

    // MARK: - Looking up
    private var lookingUpView: some View {
        VStack(spacing: 24) {
            Spacer()
            ProgressView()
                .tint(.brandGreen)
                .scaleEffect(1.5)
            Text("Looking up product...")
                .font(.headline)
                .foregroundColor(.white)
            if let barcode = scannedBarcode {
                Text(barcode)
                    .font(.caption.monospaced())
                    .foregroundColor(.gray)
            }
            Spacer()
        }
    }

    // MARK: - Result
    private func resultView(_ result: NourishAPIManager.BarcodeResponse) -> some View {
        ScrollView {
            VStack(spacing: 20) {
                // Product name
                Text(result.productName)
                    .font(.title2.bold())
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)

                if let brand = result.brand {
                    Text(brand)
                        .font(.subheadline)
                        .foregroundColor(.gray)
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
                }
                .padding()
                .background(Color.brandCard)
                .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))

                if let serving = result.servingSize {
                    Text("Serving: \(serving)")
                        .font(.caption)
                        .foregroundColor(.gray)
                }

                // Confirm button
                Button {
                    saveEntry(result)
                } label: {
                    Text("Log This Food")
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
                    Text("Scan Another")
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
            Image(systemName: "barcode")
                .font(.system(size: 48))
                .foregroundColor(.brandOrange)
            Text("Product Not Found")
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

    private func macroRow(_ label: String, value: String, color: Color) -> some View {
        HStack {
            Circle().fill(color).frame(width: 10, height: 10)
            Text(label).foregroundColor(.gray)
            Spacer()
            Text(value).foregroundColor(.white).fontWeight(.semibold)
        }
    }

    private func lookupBarcode(_ barcode: String) {
        scannedBarcode = barcode
        isLooking = true
        errorMessage = nil

        Task {
            do {
                let result = try await NourishAPIManager.shared.lookupBarcode(barcode)
                await MainActor.run {
                    self.lookupResult = result
                    self.isLooking = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isLooking = false
                }
            }
        }
    }

    private func saveEntry(_ result: NourishAPIManager.BarcodeResponse) {
        let entry = FoodEntry(
            name: result.productName,
            calories: result.calories,
            protein: result.protein,
            carbs: result.carbs,
            fat: result.fat,
            fiber: result.fiber ?? 0,
            sugar: result.sugar ?? 0,
            sodium: 0,
            servingSize: result.servingSize,
            mealType: selectedMealType,
            entryMethod: .barcode
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
                calories: result.calories,
                protein: result.protein,
                carbs: result.carbs,
                fat: result.fat
            )
        }

        dismiss()
    }

    private func reset() {
        scannedBarcode = nil
        lookupResult = nil
        errorMessage = nil
        isLooking = false
        manualBarcode = ""
    }
}
