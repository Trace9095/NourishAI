import SwiftUI
import SwiftData
import PhotosUI

struct MenuScanView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @Query private var profiles: [UserProfile]

    enum ScanState {
        case idle, analyzing, results, error
    }

    enum ScanMode: String, CaseIterable {
        case photo = "Photo"
        case url = "Website URL"
    }

    @State private var scanState: ScanState = .idle
    @State private var scanMode: ScanMode = .photo
    @State private var selectedPhotoItem: PhotosPickerItem?
    @State private var capturedImage: UIImage?
    @State private var analysisResult: NourishAPIManager.MenuAnalysisResponse?
    @State private var errorMessage: String?
    @State private var selectedMealType: MealType = .lunch
    @State private var restaurantURL = ""

    private var profile: UserProfile? { profiles.first }

    var body: some View {
        NavigationStack {
            ZStack {
                Color.brandDark.ignoresSafeArea()

                switch scanState {
                case .idle:
                    idleView
                case .analyzing:
                    analyzingView
                case .results:
                    if let result = analysisResult {
                        resultsView(result)
                    }
                case .error:
                    if let error = errorMessage {
                        errorView(error)
                    }
                }
            }
            .navigationTitle("Menu Scanner")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    // MARK: - Idle

    private var idleView: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Mode picker
                Picker("Scan Mode", selection: $scanMode) {
                    ForEach(ScanMode.allCases, id: \.self) { mode in
                        Text(mode.rawValue).tag(mode)
                    }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, 20)
                .padding(.top, 16)

                if scanMode == .photo {
                    photoModeView
                } else {
                    urlModeView
                }
            }
        }
    }

    private var photoModeView: some View {
        VStack(spacing: 24) {
            RoundedRectangle(cornerRadius: 20)
                .strokeBorder(Color.brandGreen.opacity(0.5), lineWidth: 2)
                .frame(width: 280, height: 240)
                .overlay {
                    VStack(spacing: 16) {
                        Image(systemName: "doc.text.viewfinder")
                            .font(.system(size: 48))
                            .foregroundColor(.brandGreen)
                        Text("Scan a Restaurant Menu")
                            .font(.headline)
                            .foregroundColor(.white)
                        Text("Take a photo to find the healthiest options")
                            .font(.caption)
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 20)
                    }
                }

            mealTypeSelector

            PhotosPicker(selection: $selectedPhotoItem, matching: .images) {
                ZStack {
                    Circle()
                        .fill(Color.brandGreen)
                        .frame(width: 72, height: 72)
                    Circle()
                        .strokeBorder(Color.white, lineWidth: 3)
                        .frame(width: 64, height: 64)
                    Image(systemName: "photo.on.rectangle")
                        .font(.title2)
                        .foregroundColor(.white)
                }
            }
            .frame(minHeight: Layout.minTouchTarget)
            .onChange(of: selectedPhotoItem) { _, newItem in
                guard let newItem else { return }
                Task {
                    if let data = try? await newItem.loadTransferable(type: Data.self),
                       let image = UIImage(data: data) {
                        capturedImage = image
                        analyzeMenu(image)
                    }
                }
            }

            Text("Choose a photo of the menu")
                .font(.caption)
                .foregroundColor(.gray)
        }
    }

    private var urlModeView: some View {
        VStack(spacing: 24) {
            VStack(spacing: 16) {
                Image(systemName: "globe")
                    .font(.system(size: 48))
                    .foregroundColor(.brandGreen)
                Text("Search Restaurant Website")
                    .font(.headline)
                    .foregroundColor(.white)
                Text("Enter a restaurant's website URL and we'll find and analyze their menu")
                    .font(.caption)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 20)
            }
            .padding(.top, 20)

            // URL input
            HStack(spacing: 12) {
                Image(systemName: "link")
                    .foregroundColor(.brandGreen)
                    .frame(width: 20)
                TextField("", text: $restaurantURL, prompt: Text("https://restaurant.com/menu").foregroundColor(.gray.opacity(0.5)))
                    .font(.body)
                    .foregroundColor(.white)
                    .tint(.brandGreen)
                    .textInputAutocapitalization(.never)
                    .keyboardType(.URL)
                    .autocorrectionDisabled()
            }
            .padding(16)
            .background(Color.brandCard)
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .strokeBorder(restaurantURL.isEmpty ? Color.white.opacity(0.08) : Color.brandGreen.opacity(0.5), lineWidth: 1.5)
            )
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .padding(.horizontal, 20)

            mealTypeSelector

            Button {
                analyzeMenuURL()
            } label: {
                HStack {
                    Image(systemName: "magnifyingglass")
                    Text("Analyze Menu")
                }
                .font(.headline)
                .foregroundColor(.brandDark)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(restaurantURL.isEmpty ? Color.gray : Color.brandGreen)
                .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
            }
            .frame(minHeight: Layout.minTouchTarget)
            .disabled(restaurantURL.isEmpty)
            .padding(.horizontal, 20)

            Text("We'll search the website for menu items and nutritional info")
                .font(.caption)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
        }
    }

    // MARK: - Meal Type Selector

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
                    .frame(maxHeight: 200)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
            }

            ProgressView()
                .tint(.brandGreen)
                .scaleEffect(1.5)

            VStack(spacing: 8) {
                Text("Analyzing menu...")
                    .font(.headline)
                    .foregroundColor(.white)
                Text("Finding the healthiest options for you")
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }

            Spacer()
        }
        .padding()
    }

    // MARK: - Results

    private func resultsView(_ result: NourishAPIManager.MenuAnalysisResponse) -> some View {
        ScrollView {
            VStack(spacing: 20) {
                if let image = capturedImage {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFit()
                        .frame(maxHeight: 150)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                }

                // Healthiest Picks
                let healthiest = result.items.filter { result.healthiestPicks.contains($0.name) }
                if !healthiest.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Label("Healthiest Picks", systemImage: "star.fill")
                            .font(.headline)
                            .foregroundColor(.brandGreen)

                        ForEach(healthiest) { item in
                            menuItemCard(item, isHealthiest: true)
                        }
                    }
                }

                // All Items
                let others = result.items.filter { !result.healthiestPicks.contains($0.name) }
                if !others.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("All Items")
                            .font(.headline)
                            .foregroundColor(.white)

                        ForEach(others) { item in
                            menuItemCard(item, isHealthiest: false)
                        }
                    }
                }

                // Retake
                Button {
                    resetScan()
                } label: {
                    Text("Scan Another Menu")
                        .font(.subheadline)
                        .foregroundColor(.brandGreen)
                }
                .frame(minHeight: Layout.minTouchTarget)
                .padding(.bottom, 20)
            }
            .padding()
        }
    }

    private func menuItemCard(_ item: NourishAPIManager.MenuItemAnalysis, isHealthiest: Bool) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(item.name)
                    .font(.headline)
                    .foregroundColor(.white)

                Spacer()

                healthScoreBadge(item.healthScore)
            }

            HStack(spacing: 16) {
                macroLabel("Cal", value: "\(item.estimatedCalories)", color: .macroCalories)
                macroLabel("P", value: "\(Int(item.estimatedProtein))g", color: .macroProtein)
                macroLabel("C", value: "\(Int(item.estimatedCarbs))g", color: .macroCarbs)
                macroLabel("F", value: "\(Int(item.estimatedFat))g", color: .macroFat)
            }

            if let notes = item.healthNotes {
                Text(notes)
                    .font(.caption)
                    .foregroundColor(.gray)
            }

            Button {
                logMenuItem(item)
            } label: {
                Text("Log This Item")
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
        .overlay(
            RoundedRectangle(cornerRadius: Layout.cardCornerRadius)
                .strokeBorder(isHealthiest ? Color.brandGreen.opacity(0.4) : Color.clear, lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
    }

    private func healthScoreBadge(_ score: Int) -> some View {
        let color: Color = switch score {
        case 8...10: .brandGreen
        case 5...7: .brandOrange
        default: .macroProtein
        }

        return Text("\(score)/10")
            .font(.caption.bold())
            .foregroundColor(color)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.15))
            .clipShape(Capsule())
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

    private func analyzeMenu(_ image: UIImage) {
        scanState = .analyzing
        errorMessage = nil

        Task {
            do {
                let result = try await NourishAPIManager.shared.analyzeMenu(image: image)
                await MainActor.run {
                    self.analysisResult = result
                    self.scanState = .results
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.scanState = .error
                }
            }
        }
    }

    private func logMenuItem(_ item: NourishAPIManager.MenuItemAnalysis) {
        let entry = FoodEntry(
            name: item.name,
            servingSize: "1 serving",
            mealType: selectedMealType,
            entryMethod: .aiPhoto,
            calories: item.estimatedCalories,
            protein: item.estimatedProtein,
            carbs: item.estimatedCarbs,
            fat: item.estimatedFat
        )

        modelContext.insert(entry)
        updateDailyNutrition(entry)

        Task {
            try? await HealthKitManager.shared.logNutrition(
                calories: item.estimatedCalories,
                protein: item.estimatedProtein,
                carbs: item.estimatedCarbs,
                fat: item.estimatedFat
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

    private func analyzeMenuURL() {
        // Normalize URL
        var urlString = restaurantURL.trimmingCharacters(in: .whitespacesAndNewlines)
        if !urlString.hasPrefix("http://") && !urlString.hasPrefix("https://") {
            urlString = "https://" + urlString
        }

        scanState = .analyzing
        errorMessage = nil

        Task {
            do {
                let result = try await NourishAPIManager.shared.analyzeMenuURL(url: urlString)
                await MainActor.run {
                    self.analysisResult = result
                    self.scanState = .results
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.scanState = .error
                }
            }
        }
    }

    private func resetScan() {
        capturedImage = nil
        analysisResult = nil
        errorMessage = nil
        selectedPhotoItem = nil
        restaurantURL = ""
        scanState = .idle
    }
}
