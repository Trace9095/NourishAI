import SwiftUI
import SwiftData
import StoreKit

struct SettingsView: View {
    @Environment(\.openURL) private var openURL
    @Query private var profiles: [UserProfile]
    @State private var showSubscription = false
    @State private var showDisclaimer = false
    @State private var healthKitRequested = false
    @State private var isEditing = false
    @State private var subscriptionExpiry: Date?
    @State private var currentPlanName: String?

    // Editing state
    @State private var editName = ""
    @State private var editAge = ""
    @State private var editHeightFeet = 5
    @State private var editHeightInches = 10
    @State private var editWeight = ""
    @State private var editGoal: NutritionGoal = .maintenance
    @State private var editActivity: ActivityLevel = .moderate
    @State private var editCalories = ""
    @State private var editProtein = ""
    @State private var editCarbs = ""
    @State private var editFat = ""

    private var profile: UserProfile? { profiles.first }

    var body: some View {
        NavigationStack {
            List {
                // Profile section
                Section {
                    if let profile {
                        if isEditing {
                            editableTextField("Name", text: $editName)
                            editableTextField("Age", text: $editAge, keyboard: .numberPad)
                            HStack {
                                Text("Height")
                                    .foregroundColor(.gray)
                                Spacer()
                                Picker("Feet", selection: $editHeightFeet) {
                                    ForEach(4...7, id: \.self) { Text("\($0)'") }
                                }
                                .pickerStyle(.menu)
                                .tint(.brandGreen)
                                Picker("Inches", selection: $editHeightInches) {
                                    ForEach(0...11, id: \.self) { Text("\($0)\"") }
                                }
                                .pickerStyle(.menu)
                                .tint(.brandGreen)
                            }
                            editableTextField("Weight (lbs)", text: $editWeight, keyboard: .decimalPad)
                            HStack {
                                Text("Goal")
                                    .foregroundColor(.gray)
                                Spacer()
                                Picker("Goal", selection: $editGoal) {
                                    ForEach(NutritionGoal.allCases, id: \.self) {
                                        Text($0.displayName)
                                    }
                                }
                                .pickerStyle(.menu)
                                .tint(.brandGreen)
                            }
                            HStack {
                                Text("Activity")
                                    .foregroundColor(.gray)
                                Spacer()
                                Picker("Activity", selection: $editActivity) {
                                    ForEach(ActivityLevel.allCases, id: \.self) {
                                        Text($0.displayName)
                                    }
                                }
                                .pickerStyle(.menu)
                                .tint(.brandGreen)
                            }
                        } else {
                            settingsRow("Name", value: profile.name)
                            settingsRow("Age", value: "\(profile.age)")
                            settingsRow("Height", value: formatHeight(cm: profile.heightCm))
                            settingsRow("Weight", value: formatWeight(kg: profile.weightKg))
                            settingsRow("Goal", value: profile.nutritionGoal.displayName)
                            settingsRow("Activity", value: profile.activityLevel.displayName)
                        }
                    }
                } header: {
                    Text("Profile").foregroundColor(.gray)
                }
                .listRowBackground(Color.brandCard)

                // Targets section
                Section {
                    if let profile {
                        if isEditing {
                            editableTextField("Calories", text: $editCalories, keyboard: .numberPad, color: .macroCalories)
                            editableTextField("Protein (g)", text: $editProtein, keyboard: .numberPad, color: .macroProtein)
                            editableTextField("Carbs (g)", text: $editCarbs, keyboard: .numberPad, color: .macroCarbs)
                            editableTextField("Fat (g)", text: $editFat, keyboard: .numberPad, color: .macroFat)
                        } else {
                            settingsRow("Calories", value: "\(profile.targetCalories) kcal", color: .macroCalories)
                            settingsRow("Protein", value: "\(profile.targetProtein)g", color: .macroProtein)
                            settingsRow("Carbs", value: "\(profile.targetCarbs)g", color: .macroCarbs)
                            settingsRow("Fat", value: "\(profile.targetFat)g", color: .macroFat)
                            settingsRow("Water", value: formatWater(ml: profile.targetWaterMl), color: .macroWater)
                        }
                    }
                    if !isEditing {
                        Button {
                            recalculateTargets()
                        } label: {
                            HStack {
                                Image(systemName: "arrow.triangle.2.circlepath")
                                Text("Recalculate Targets")
                            }
                            .foregroundColor(.brandGreen)
                        }
                        .frame(minHeight: Layout.minTouchTarget)
                    }
                } header: {
                    Text("Daily Targets").foregroundColor(.gray)
                }
                .listRowBackground(Color.brandCard)

                // Integrations
                Section {
                    Button {
                        requestHealthKit()
                    } label: {
                        HStack {
                            Label("Apple Health", systemImage: "heart.fill")
                                .foregroundColor(.macroProtein)
                            Spacer()
                            if profile?.healthKitEnabled == true {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundColor(.brandGreen)
                            } else {
                                Text("Enable")
                                    .foregroundColor(.brandGreen)
                            }
                        }
                    }
                    .frame(minHeight: Layout.minTouchTarget)
                } header: {
                    Text("Integrations").foregroundColor(.gray)
                }
                .listRowBackground(Color.brandCard)

                // Subscription
                Section {
                    if profile?.subscriptionTier == "pro" {
                        HStack {
                            Label("NourishAI Pro", systemImage: "star.fill")
                                .foregroundColor(.brandOrange)
                            Spacer()
                            HStack(spacing: 4) {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundColor(.brandGreen)
                                Text("Active")
                                    .foregroundColor(.brandGreen)
                            }
                        }
                        if let planName = currentPlanName {
                            settingsRow("Plan", value: planName, color: .brandOrange)
                        }
                        if let expiry = subscriptionExpiry {
                            settingsRow("Renews", value: expiry.formatted(.dateTime.month(.abbreviated).day().year()), color: .gray)
                        }
                        Button {
                            Task {
                                try? await AppStore.showManageSubscriptions(in: UIApplication.shared.connectedScenes.first as! UIWindowScene)
                            }
                        } label: {
                            HStack {
                                Text("Manage Subscription")
                                    .foregroundColor(.brandGreen)
                                Spacer()
                                Image(systemName: "arrow.up.forward")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            }
                        }
                        .frame(minHeight: Layout.minTouchTarget)
                    } else {
                        // Upgrade CTA for free users
                        Button {
                            showSubscription = true
                        } label: {
                            VStack(spacing: 12) {
                                HStack {
                                    Image(systemName: "star.fill")
                                        .font(.title2)
                                        .foregroundColor(.brandOrange)
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Upgrade to Pro")
                                            .font(.headline)
                                            .foregroundColor(.white)
                                        Text("Unlimited AI scans, premium chat, and more")
                                            .font(.caption)
                                            .foregroundColor(.gray)
                                    }
                                    Spacer()
                                }
                                HStack {
                                    Text("Start Free Trial")
                                        .font(.subheadline.weight(.semibold))
                                        .foregroundColor(.brandDark)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 10)
                                        .background(Color.brandGreen)
                                        .clipShape(RoundedRectangle(cornerRadius: 10))
                                }
                            }
                        }
                        .frame(minHeight: Layout.minTouchTarget)
                    }
                } header: {
                    Text("Subscription").foregroundColor(.gray)
                }
                .listRowBackground(Color.brandCard)

                // About
                Section {
                    settingsRow("Version", value: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0")
                    Button {
                        showDisclaimer = true
                    } label: {
                        HStack {
                            Label("Health Sources & Disclaimer", systemImage: "cross.circle")
                                .foregroundColor(.macroProtein)
                            Spacer()
                            Image(systemName: "chevron.right")
                                .font(.caption)
                                .foregroundColor(.gray)
                        }
                    }
                    .frame(minHeight: Layout.minTouchTarget)
                    Link("Privacy Policy", destination: URL(string: "https://nourishhealthai.com/privacy")!)
                        .foregroundColor(.brandGreen)
                        .frame(minHeight: Layout.minTouchTarget)
                    Link("Terms of Use", destination: URL(string: "https://nourishhealthai.com/terms")!)
                        .foregroundColor(.brandGreen)
                        .frame(minHeight: Layout.minTouchTarget)
                    HStack {
                        Text("Built by")
                            .foregroundColor(.gray)
                        Link("Epic AI", destination: URL(string: "https://epicai.ai")!)
                            .foregroundColor(.brandGreen)
                    }
                } header: {
                    Text("About").foregroundColor(.gray)
                }
                .listRowBackground(Color.brandCard)
            }
            .scrollContentBackground(.hidden)
            .background(Color.brandDark)
            .navigationTitle("Settings")
            .foregroundColor(.white)
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button(isEditing ? "Save" : "Edit") {
                        if isEditing {
                            saveEdits()
                        } else {
                            startEditing()
                        }
                    }
                    .foregroundColor(.brandGreen)
                    .fontWeight(.semibold)
                }
                if isEditing {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Cancel") {
                            isEditing = false
                        }
                        .foregroundColor(.gray)
                    }
                }
            }
            .sheet(isPresented: $showSubscription) {
                SubscriptionView()
            }
            .sheet(isPresented: $showDisclaimer) {
                HealthDisclaimerView()
            }
            .task {
                await refreshSubscriptionDetails()
            }
            .onChange(of: showSubscription) { _, isShowing in
                if !isShowing {
                    // Refresh subscription details when paywall sheet closes
                    Task { await refreshSubscriptionDetails() }
                }
            }
        }
    }

    private func settingsRow(_ label: String, value: String, color: Color = .white) -> some View {
        HStack {
            Text(label)
                .foregroundColor(.gray)
            Spacer()
            Text(value)
                .foregroundColor(color)
                .fontWeight(.medium)
        }
    }

    private func editableTextField(_ label: String, text: Binding<String>, keyboard: UIKeyboardType = .default, color: Color = .white) -> some View {
        HStack {
            Text(label)
                .foregroundColor(.gray)
            Spacer()
            TextField("", text: text)
                .foregroundColor(color)
                .fontWeight(.medium)
                .multilineTextAlignment(.trailing)
                .keyboardType(keyboard)
        }
    }

    private func startEditing() {
        guard let profile else { return }
        editName = profile.name
        editAge = "\(profile.age)"
        let totalInches = profile.heightCm / 2.54
        editHeightFeet = Int(totalInches) / 12
        editHeightInches = Int(totalInches) % 12
        editWeight = "\(Int(profile.weightKg * 2.20462))"
        editGoal = profile.nutritionGoal
        editActivity = profile.activityLevel
        editCalories = "\(profile.targetCalories)"
        editProtein = "\(profile.targetProtein)"
        editCarbs = "\(profile.targetCarbs)"
        editFat = "\(profile.targetFat)"
        isEditing = true
    }

    private func saveEdits() {
        guard let profile else { return }
        profile.name = editName
        profile.age = Int(editAge) ?? profile.age
        let totalInches = Double(editHeightFeet * 12 + editHeightInches)
        profile.heightCm = totalInches * 2.54
        if let lbs = Double(editWeight) {
            profile.weightKg = lbs / 2.20462
        }
        profile.nutritionGoal = editGoal
        profile.activityLevel = editActivity
        profile.targetCalories = Int(editCalories) ?? profile.targetCalories
        profile.targetProtein = Int(editProtein) ?? profile.targetProtein
        profile.targetCarbs = Int(editCarbs) ?? profile.targetCarbs
        profile.targetFat = Int(editFat) ?? profile.targetFat
        isEditing = false
    }

    private func recalculateTargets() {
        guard let profile else { return }
        let calc = NutritionCalculator.calculateTargets(
            weightKg: profile.weightKg,
            heightCm: profile.heightCm,
            age: profile.age,
            sex: profile.biologicalSex,
            activityLevel: profile.activityLevel,
            goal: profile.nutritionGoal
        )
        profile.targetCalories = calc.calories
        profile.targetProtein = calc.protein
        profile.targetCarbs = calc.carbs
        profile.targetFat = calc.fat
    }

    private func formatHeight(cm: Double) -> String {
        let totalInches = cm / 2.54
        let feet = Int(totalInches) / 12
        let inches = Int(totalInches) % 12
        return "\(feet)'\(inches)\""
    }

    private func formatWeight(kg: Double) -> String {
        let lbs = Int(kg * 2.20462)
        return "\(lbs) lbs"
    }

    private func formatWater(ml: Int) -> String {
        let oz = Double(ml) / 29.5735
        return String(format: "%.0f oz", oz)
    }

    private func refreshSubscriptionDetails() async {
        subscriptionExpiry = await SubscriptionManager.shared.currentSubscriptionExpiry
        if let productID = await SubscriptionManager.shared.currentProductID {
            currentPlanName = productID.contains("annual") ? "Pro Annual" : "Pro Monthly"
        }
    }

    private func requestHealthKit() {
        Task {
            do {
                try await HealthKitManager.shared.requestAuthorization()
                if let profile {
                    profile.healthKitEnabled = true

                    // Pull height and weight from HealthKit
                    if let height = try await HealthKitManager.shared.getHeight() {
                        profile.heightCm = height
                    }
                    if let weight = try await HealthKitManager.shared.getWeight() {
                        profile.weightKg = weight
                    }
                    if let age = await HealthKitManager.shared.getAge() {
                        profile.age = age
                    }
                }
            } catch {
                print("HealthKit auth error: \(error)")
            }
        }
    }
}
