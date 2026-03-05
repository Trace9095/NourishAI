import SwiftUI
import SwiftData

struct OnboardingContainerView: View {
    @Binding var showOnboarding: Bool
    @Environment(\.modelContext) private var modelContext
    @State private var currentStep = 0
    @State private var name = ""
    @State private var age = 25
    @State private var heightCm: Double = 175
    @State private var weightKg: Double = 75
    @State private var biologicalSex: BiologicalSex = .notSet
    @State private var activityLevel: ActivityLevel = .moderate
    @State private var nutritionGoal: NutritionGoal = .maintenance

    private let totalSteps = 7

    var body: some View {
        ZStack {
            Color.brandDark.ignoresSafeArea()

            VStack(spacing: 0) {
                // Progress bar
                ProgressView(value: Double(currentStep + 1), total: Double(totalSteps))
                    .tint(.brandGreen)
                    .padding(.horizontal)
                    .padding(.top, 8)

                // Step content
                TabView(selection: $currentStep) {
                    welcomeStep.tag(0)
                    nameStep.tag(1)
                    bodyStep.tag(2)
                    sexStep.tag(3)
                    activityStep.tag(4)
                    goalStep.tag(5)
                    summaryStep.tag(6)
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
                .animation(.easeInOut, value: currentStep)
            }
        }
    }

    // MARK: - Steps

    private var welcomeStep: some View {
        OnboardingStepView(
            icon: "leaf.fill",
            iconColor: .brandGreen,
            title: "Welcome to NourishAI",
            subtitle: "AI-powered nutrition tracking that makes hitting your macros effortless.",
            buttonText: "Get Started"
        ) { currentStep = 1 }
    }

    private var nameStep: some View {
        VStack(spacing: 24) {
            Spacer()
            Text("What's your name?")
                .font(.title2.bold())
                .foregroundColor(.white)
            TextField("Your name", text: $name)
                .textFieldStyle(.roundedBorder)
                .font(.title3)
                .padding(.horizontal, 40)
            Spacer()
            nextButton { currentStep = 2 }
        }
    }

    private var bodyStep: some View {
        VStack(spacing: 24) {
            Spacer()
            Text("Tell us about yourself")
                .font(.title2.bold())
                .foregroundColor(.white)

            VStack(spacing: 16) {
                HStack {
                    Text("Age")
                        .foregroundColor(.gray)
                    Spacer()
                    Stepper("\(age)", value: $age, in: 13...100)
                        .foregroundColor(.white)
                }

                HStack {
                    Text("Height")
                        .foregroundColor(.gray)
                    Spacer()
                    Text("\(Int(heightCm)) cm")
                        .foregroundColor(.white)
                }
                Slider(value: $heightCm, in: 120...230, step: 1)
                    .tint(.brandGreen)

                HStack {
                    Text("Weight")
                        .foregroundColor(.gray)
                    Spacer()
                    Text("\(Int(weightKg)) kg")
                        .foregroundColor(.white)
                }
                Slider(value: $weightKg, in: 30...200, step: 0.5)
                    .tint(.brandGreen)
            }
            .padding(.horizontal, 20)

            Spacer()
            nextButton { currentStep = 3 }
        }
    }

    private var sexStep: some View {
        VStack(spacing: 24) {
            Spacer()
            Text("Biological Sex")
                .font(.title2.bold())
                .foregroundColor(.white)
            Text("Used for accurate BMR calculation")
                .font(.subheadline)
                .foregroundColor(.gray)

            ForEach(BiologicalSex.allCases, id: \.self) { sex in
                Button {
                    biologicalSex = sex
                    currentStep = 4
                } label: {
                    Text(sex.displayName)
                        .font(.headline)
                        .foregroundColor(biologicalSex == sex ? .brandDark : .white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(biologicalSex == sex ? Color.brandGreen : Color.brandCard)
                        .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
                }
                .frame(minHeight: Layout.minTouchTarget)
            }
            .padding(.horizontal, 20)
            Spacer()
        }
    }

    private var activityStep: some View {
        VStack(spacing: 24) {
            Spacer()
            Text("Activity Level")
                .font(.title2.bold())
                .foregroundColor(.white)

            ForEach(ActivityLevel.allCases, id: \.self) { level in
                Button {
                    activityLevel = level
                    currentStep = 5
                } label: {
                    Text(level.displayName)
                        .font(.headline)
                        .foregroundColor(activityLevel == level ? .brandDark : .white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(activityLevel == level ? Color.brandGreen : Color.brandCard)
                        .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
                }
                .frame(minHeight: Layout.minTouchTarget)
            }
            .padding(.horizontal, 20)
            Spacer()
        }
    }

    private var goalStep: some View {
        VStack(spacing: 24) {
            Spacer()
            Text("What's your goal?")
                .font(.title2.bold())
                .foregroundColor(.white)

            ForEach(NutritionGoal.allCases, id: \.self) { goal in
                Button {
                    nutritionGoal = goal
                    currentStep = 6
                } label: {
                    Text(goal.displayName)
                        .font(.headline)
                        .foregroundColor(nutritionGoal == goal ? .brandDark : .white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(nutritionGoal == goal ? Color.brandGreen : Color.brandCard)
                        .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
                }
                .frame(minHeight: Layout.minTouchTarget)
            }
            .padding(.horizontal, 20)
            Spacer()
        }
    }

    private var summaryStep: some View {
        let targets = NutritionCalculator.calculateTargets(
            weightKg: weightKg,
            heightCm: heightCm,
            age: age,
            sex: biologicalSex,
            activityLevel: activityLevel,
            goal: nutritionGoal
        )

        return VStack(spacing: 24) {
            Spacer()
            Text("Your Plan")
                .font(.title2.bold())
                .foregroundColor(.white)

            VStack(spacing: 16) {
                targetRow("Calories", value: "\(targets.calories) kcal", color: .macroCalories)
                targetRow("Protein", value: "\(targets.protein)g", color: .macroProtein)
                targetRow("Carbs", value: "\(targets.carbs)g", color: .macroCarbs)
                targetRow("Fat", value: "\(targets.fat)g", color: .macroFat)
            }
            .padding()
            .background(Color.brandCard)
            .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
            .padding(.horizontal, 20)

            Spacer()

            Button {
                completeOnboarding(targets: targets)
            } label: {
                Text("Start Tracking")
                    .font(.headline)
                    .foregroundColor(.brandDark)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.brandGreen)
                    .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
            }
            .frame(minHeight: Layout.minTouchTarget)
            .padding(.horizontal, 20)
            .padding(.bottom, 40)
        }
    }

    // MARK: - Helpers

    private func nextButton(action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text("Continue")
                .font(.headline)
                .foregroundColor(.brandDark)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.brandGreen)
                .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
        }
        .frame(minHeight: Layout.minTouchTarget)
        .padding(.horizontal, 20)
        .padding(.bottom, 40)
    }

    private func targetRow(_ label: String, value: String, color: Color) -> some View {
        HStack {
            Circle().fill(color).frame(width: 10, height: 10)
            Text(label).foregroundColor(.gray)
            Spacer()
            Text(value).foregroundColor(.white).fontWeight(.semibold)
        }
    }

    private func completeOnboarding(targets: NutritionCalculator.MacroTargets) {
        let waterTarget = NutritionCalculator.waterTargetMl(
            weightKg: weightKg,
            activityLevel: activityLevel
        )

        let profile = UserProfile(
            name: name,
            age: age,
            heightCm: heightCm,
            weightKg: weightKg,
            biologicalSex: biologicalSex,
            activityLevel: activityLevel,
            nutritionGoal: nutritionGoal,
            targetCalories: targets.calories,
            targetProtein: targets.protein,
            targetCarbs: targets.carbs,
            targetFat: targets.fat,
            targetWaterMl: waterTarget,
            onboardingComplete: true
        )

        modelContext.insert(profile)

        // Register device with server
        Task {
            try? await NourishAPIManager.shared.registerDevice()
        }

        showOnboarding = false
    }
}

// MARK: - Step Template

struct OnboardingStepView: View {
    let icon: String
    let iconColor: Color
    let title: String
    let subtitle: String
    let buttonText: String
    let action: () -> Void

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            Image(systemName: icon)
                .font(.system(size: 60))
                .foregroundColor(iconColor)
            Text(title)
                .font(.title.bold())
                .foregroundColor(.white)
                .multilineTextAlignment(.center)
            Text(subtitle)
                .font(.body)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
            Spacer()
            Button(action: action) {
                Text(buttonText)
                    .font(.headline)
                    .foregroundColor(.brandDark)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.brandGreen)
                    .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
            }
            .frame(minHeight: Layout.minTouchTarget)
            .padding(.horizontal, 20)
            .padding(.bottom, 40)
        }
    }
}
