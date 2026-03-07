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
    @State private var appeared = false

    private let totalSteps = 7

    var body: some View {
        ZStack {
            Color.brandDark.ignoresSafeArea()

            // Ambient gradient orbs
            ambientBackground

            VStack(spacing: 0) {
                // Progress bar
                progressBar
                    .padding(.horizontal, 24)
                    .padding(.top, 12)

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
                .animation(.spring(response: 0.5, dampingFraction: 0.85), value: currentStep)
            }
        }
        .onAppear { withAnimation(.easeOut(duration: 0.8)) { appeared = true } }
    }

    // MARK: - Ambient Background

    private var ambientBackground: some View {
        ZStack {
            Circle()
                .fill(Color.brandGreen.opacity(0.06))
                .frame(width: 400, height: 400)
                .blur(radius: 80)
                .offset(x: -80, y: -200)

            Circle()
                .fill(Color.brandOrange.opacity(0.04))
                .frame(width: 300, height: 300)
                .blur(radius: 60)
                .offset(x: 120, y: 300)
        }
    }

    // MARK: - Progress Bar

    private var progressBar: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: 4)
                    .fill(Color.white.opacity(0.08))
                    .frame(height: 4)

                RoundedRectangle(cornerRadius: 4)
                    .fill(
                        LinearGradient(
                            colors: [.brandGreen, .brandGreen.opacity(0.8)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .frame(width: geo.size.width * (Double(currentStep + 1) / Double(totalSteps)), height: 4)
                    .animation(.spring(response: 0.4), value: currentStep)
            }
        }
        .frame(height: 4)
    }

    // MARK: - Welcome Step

    private var welcomeStep: some View {
        VStack(spacing: 0) {
            Spacer()

            // Icon with glow
            ZStack {
                Circle()
                    .fill(Color.brandGreen.opacity(0.12))
                    .frame(width: 140, height: 140)
                    .blur(radius: 20)

                Image(systemName: "leaf.fill")
                    .font(.system(size: 72, weight: .medium))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.brandGreen, Color(hex: "2DD870")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .shadow(color: .brandGreen.opacity(0.4), radius: 20, y: 10)
            }
            .scaleEffect(appeared ? 1 : 0.5)
            .opacity(appeared ? 1 : 0)

            Spacer().frame(height: 32)

            Text("Welcome to")
                .font(.title2)
                .foregroundColor(.gray)
                .opacity(appeared ? 1 : 0)
                .offset(y: appeared ? 0 : 20)

            Text("NourishAI")
                .font(.system(size: 42, weight: .bold, design: .rounded))
                .foregroundStyle(
                    LinearGradient(
                        colors: [.white, .white.opacity(0.85)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .padding(.top, 4)
                .opacity(appeared ? 1 : 0)
                .offset(y: appeared ? 0 : 20)

            Text("AI-powered nutrition tracking that\nmakes hitting your macros effortless.")
                .font(.body)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .lineSpacing(4)
                .padding(.top, 12)
                .padding(.horizontal, 40)
                .opacity(appeared ? 1 : 0)
                .offset(y: appeared ? 0 : 20)

            Spacer()

            // Feature pills
            HStack(spacing: 12) {
                featurePill(icon: "camera.fill", text: "AI Scan")
                featurePill(icon: "chart.pie.fill", text: "Macros")
                featurePill(icon: "heart.fill", text: "Health")
            }
            .opacity(appeared ? 1 : 0)
            .padding(.bottom, 32)

            primaryButton("Get Started") { currentStep = 1 }
                .padding(.bottom, 50)
                .opacity(appeared ? 1 : 0)
                .offset(y: appeared ? 0 : 30)
        }
        .padding(.horizontal, 24)
    }

    // MARK: - Name Step

    private var nameStep: some View {
        VStack(spacing: 0) {
            Spacer()

            stepIcon("person.fill", color: .macroWater)

            Text("What should we call you?")
                .font(.title2.bold())
                .foregroundColor(.white)
                .padding(.top, 20)

            Text("Personalize your experience")
                .font(.subheadline)
                .foregroundColor(.gray)
                .padding(.top, 4)

            // Custom dark text field
            HStack(spacing: 12) {
                Image(systemName: "person.fill")
                    .foregroundColor(.brandGreen)
                    .frame(width: 20)
                TextField("", text: $name, prompt: Text("Your name").foregroundColor(.gray.opacity(0.6)))
                    .font(.title3)
                    .foregroundColor(.white)
                    .tint(.brandGreen)
            }
            .padding(16)
            .background(Color.brandCard)
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .strokeBorder(
                        name.isEmpty ? Color.white.opacity(0.08) : Color.brandGreen.opacity(0.5),
                        lineWidth: 1.5
                    )
            )
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .padding(.horizontal, 20)
            .padding(.top, 32)

            Spacer()
            primaryButton("Continue") { currentStep = 2 }
                .padding(.bottom, 50)
        }
        .padding(.horizontal, 24)
    }

    // MARK: - Body Step

    private var bodyStep: some View {
        VStack(spacing: 0) {
            Spacer().frame(height: 40)

            stepIcon("figure.stand", color: .macroProtein)

            Text("About you")
                .font(.title2.bold())
                .foregroundColor(.white)
                .padding(.top, 20)

            Text("For accurate nutrition calculations")
                .font(.subheadline)
                .foregroundColor(.gray)
                .padding(.top, 4)

            VStack(spacing: 20) {
                // Age
                bodyMetricCard(
                    icon: "calendar",
                    label: "Age",
                    valueText: "\(age) years"
                ) {
                    Stepper("", value: $age, in: 13...100)
                        .labelsHidden()
                        .tint(.brandGreen)
                }

                // Height
                bodyMetricCard(
                    icon: "ruler",
                    label: "Height",
                    valueText: formatHeight(cm: heightCm)
                ) {
                    Slider(value: $heightCm, in: 120...230, step: 1)
                        .tint(.brandGreen)
                }

                // Weight
                bodyMetricCard(
                    icon: "scalemass",
                    label: "Weight",
                    valueText: formatWeight(kg: weightKg)
                ) {
                    Slider(value: $weightKg, in: 30...200, step: 0.5)
                        .tint(.brandGreen)
                }
            }
            .padding(.top, 28)
            .padding(.horizontal, 4)

            Spacer()
            primaryButton("Continue") { currentStep = 3 }
                .padding(.bottom, 50)
        }
        .padding(.horizontal, 24)
    }

    // MARK: - Sex Step

    private var sexStep: some View {
        VStack(spacing: 0) {
            Spacer()

            stepIcon("heart.text.square", color: .macroCarbs)

            Text("Biological Sex")
                .font(.title2.bold())
                .foregroundColor(.white)
                .padding(.top, 20)

            Text("Used for accurate BMR calculation")
                .font(.subheadline)
                .foregroundColor(.gray)
                .padding(.top, 4)

            VStack(spacing: 10) {
                sexOption(.male, icon: "figure.stand", label: "Male")
                sexOption(.female, icon: "figure.stand.dress", label: "Female")
                sexOption(.other, icon: "figure.wave", label: "Other")
                sexOption(.notSet, icon: "hand.raised.fill", label: "Prefer not to say")
            }
            .padding(.top, 28)
            .padding(.horizontal, 4)

            Spacer()
        }
        .padding(.horizontal, 24)
    }

    // MARK: - Activity Step

    private var activityStep: some View {
        VStack(spacing: 0) {
            Spacer().frame(height: 40)

            stepIcon("flame.fill", color: .brandOrange)

            Text("Activity Level")
                .font(.title2.bold())
                .foregroundColor(.white)
                .padding(.top, 20)

            Text("How active are you on most days?")
                .font(.subheadline)
                .foregroundColor(.gray)
                .padding(.top, 4)

            VStack(spacing: 8) {
                activityOption(.sedentary, icon: "chair.lounge.fill", desc: "Little to no exercise")
                activityOption(.light, icon: "figure.walk", desc: "Light exercise 1-3 days/week")
                activityOption(.moderate, icon: "figure.run", desc: "Moderate exercise 3-5 days/week")
                activityOption(.active, icon: "dumbbell.fill", desc: "Hard exercise 6-7 days/week")
                activityOption(.veryActive, icon: "bolt.heart.fill", desc: "Athlete / very intense training")
            }
            .padding(.top, 24)
            .padding(.horizontal, 4)

            Spacer()
        }
        .padding(.horizontal, 24)
    }

    // MARK: - Goal Step

    private var goalStep: some View {
        VStack(spacing: 0) {
            Spacer()

            stepIcon("target", color: .brandGreen)

            Text("What's your goal?")
                .font(.title2.bold())
                .foregroundColor(.white)
                .padding(.top, 20)

            Text("We'll customize your macro targets")
                .font(.subheadline)
                .foregroundColor(.gray)
                .padding(.top, 4)

            VStack(spacing: 12) {
                goalCard(
                    .cut,
                    icon: "arrow.down.circle.fill",
                    color: .macroProtein,
                    title: "Lose Fat",
                    desc: "20% calorie deficit for steady fat loss"
                )
                goalCard(
                    .maintenance,
                    icon: "equal.circle.fill",
                    color: .macroCarbs,
                    title: "Maintain Weight",
                    desc: "Stay at your current weight"
                )
                goalCard(
                    .bulk,
                    icon: "arrow.up.circle.fill",
                    color: .brandGreen,
                    title: "Build Muscle",
                    desc: "15% calorie surplus for lean gains"
                )
            }
            .padding(.top, 28)
            .padding(.horizontal, 4)

            Spacer()
        }
        .padding(.horizontal, 24)
    }

    // MARK: - Summary Step

    private var summaryStep: some View {
        let targets = NutritionCalculator.calculateTargets(
            weightKg: weightKg,
            heightCm: heightCm,
            age: age,
            sex: biologicalSex,
            activityLevel: activityLevel,
            goal: nutritionGoal
        )

        return VStack(spacing: 0) {
            Spacer().frame(height: 40)

            stepIcon("checkmark.seal.fill", color: .brandGreen)

            Text("Your Plan is Ready")
                .font(.title2.bold())
                .foregroundColor(.white)
                .padding(.top, 20)

            Text("Personalized daily targets")
                .font(.subheadline)
                .foregroundColor(.gray)
                .padding(.top, 4)

            // Targets card
            VStack(spacing: 0) {
                // Calories — hero
                VStack(spacing: 4) {
                    Text("\(targets.calories)")
                        .font(.system(size: 48, weight: .bold, design: .rounded))
                        .foregroundColor(.macroCalories)
                    Text("daily calories")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                }
                .padding(.vertical, 20)

                Divider().overlay(Color.white.opacity(0.1))

                // Macros row
                HStack(spacing: 0) {
                    summaryMacro(value: "\(targets.protein)g", label: "Protein", color: .macroProtein)
                    summaryMacroDivider
                    summaryMacro(value: "\(targets.carbs)g", label: "Carbs", color: .macroCarbs)
                    summaryMacroDivider
                    summaryMacro(value: "\(targets.fat)g", label: "Fat", color: .macroFat)
                }
                .padding(.vertical, 16)
            }
            .background(Color.brandCard)
            .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
            .overlay(
                RoundedRectangle(cornerRadius: Layout.cardCornerRadius)
                    .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
            )
            .padding(.top, 28)
            .padding(.horizontal, 4)

            // Goal badge
            HStack(spacing: 8) {
                Image(systemName: "target")
                    .foregroundColor(.brandGreen)
                Text("Goal: \(nutritionGoal.displayName)")
                    .font(.subheadline.weight(.medium))
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(Color.brandGreen.opacity(0.1))
            .clipShape(Capsule())
            .padding(.top, 16)

            Spacer()

            primaryButton("Start Tracking") {
                completeOnboarding(targets: targets)
            }
            .padding(.bottom, 50)
        }
        .padding(.horizontal, 24)
    }

    // MARK: - Reusable Components

    private func stepIcon(_ systemName: String, color: Color) -> some View {
        ZStack {
            Circle()
                .fill(color.opacity(0.12))
                .frame(width: 80, height: 80)

            Image(systemName: systemName)
                .font(.system(size: 36))
                .foregroundColor(color)
        }
    }

    private func featurePill(icon: String, text: String) -> some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.caption2)
            Text(text)
                .font(.caption.weight(.medium))
        }
        .foregroundColor(.white.opacity(0.7))
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .background(Color.white.opacity(0.1))
        .clipShape(Capsule())
    }

    private func primaryButton(_ title: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
                .font(.headline)
                .foregroundColor(.brandDark)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [.brandGreen, Color(hex: "2DD870")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .clipShape(RoundedRectangle(cornerRadius: Layout.buttonCornerRadius))
                .shadow(color: .brandGreen.opacity(0.3), radius: 12, y: 6)
        }
        .frame(minHeight: Layout.minTouchTarget)
    }

    private func bodyMetricCard<Control: View>(
        icon: String,
        label: String,
        valueText: String,
        @ViewBuilder control: () -> Control
    ) -> some View {
        VStack(spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(.brandGreen)
                    .frame(width: 20)
                Text(label)
                    .font(.subheadline)
                    .foregroundColor(.gray)
                Spacer()
                Text(valueText)
                    .font(.title3.bold())
                    .foregroundColor(.white)
            }
            control()
        }
        .padding(16)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .strokeBorder(Color.white.opacity(0.1), lineWidth: 1)
        )
    }

    private func sexOption(_ sex: BiologicalSex, icon: String, label: String) -> some View {
        Button {
            biologicalSex = sex
            withAnimation(.spring(response: 0.3)) { currentStep = 4 }
        } label: {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .font(.title3)
                    .foregroundColor(biologicalSex == sex ? .brandGreen : .gray)
                    .frame(width: 28)
                Text(label)
                    .font(.body.weight(.medium))
                    .foregroundColor(.white)
                Spacer()
                if biologicalSex == sex {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.brandGreen)
                }
            }
            .padding(16)
            .background(biologicalSex == sex ? Color.brandGreen.opacity(0.1) : Color.brandCard)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .strokeBorder(
                        biologicalSex == sex ? Color.brandGreen.opacity(0.4) : Color.white.opacity(0.1),
                        lineWidth: 1.5
                    )
            )
        }
        .frame(minHeight: Layout.minTouchTarget)
    }

    private func activityOption(_ level: ActivityLevel, icon: String, desc: String) -> some View {
        Button {
            activityLevel = level
            withAnimation(.spring(response: 0.3)) { currentStep = 5 }
        } label: {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .font(.title3)
                    .foregroundColor(activityLevel == level ? .brandOrange : .gray)
                    .frame(width: 28)
                VStack(alignment: .leading, spacing: 2) {
                    Text(level.displayName)
                        .font(.subheadline.weight(.semibold))
                        .foregroundColor(.white)
                    Text(desc)
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                Spacer()
                if activityLevel == level {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.brandOrange)
                }
            }
            .padding(14)
            .background(activityLevel == level ? Color.brandOrange.opacity(0.08) : Color.brandCard)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .strokeBorder(
                        activityLevel == level ? Color.brandOrange.opacity(0.4) : Color.white.opacity(0.1),
                        lineWidth: 1.5
                    )
            )
        }
        .frame(minHeight: Layout.minTouchTarget)
    }

    private func goalCard(_ goal: NutritionGoal, icon: String, color: Color, title: String, desc: String) -> some View {
        Button {
            nutritionGoal = goal
            withAnimation(.spring(response: 0.3)) { currentStep = 6 }
        } label: {
            HStack(spacing: 16) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)
                    .frame(width: 32)

                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.headline)
                        .foregroundColor(.white)
                    Text(desc)
                        .font(.caption)
                        .foregroundColor(.gray)
                }

                Spacer()

                if nutritionGoal == goal {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(color)
                        .font(.title3)
                }
            }
            .padding(18)
            .background(nutritionGoal == goal ? color.opacity(0.08) : Color.brandCard)
            .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
            .overlay(
                RoundedRectangle(cornerRadius: Layout.cardCornerRadius)
                    .strokeBorder(
                        nutritionGoal == goal ? color.opacity(0.4) : Color.white.opacity(0.1),
                        lineWidth: 1.5
                    )
            )
        }
        .frame(minHeight: Layout.minTouchTarget)
    }

    private func summaryMacro(value: String, label: String, color: Color) -> some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title3.bold())
                .foregroundColor(color)
            Text(label)
                .font(.caption)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity)
    }

    private var summaryMacroDivider: some View {
        Rectangle()
            .fill(Color.white.opacity(0.1))
            .frame(width: 1, height: 36)
    }

    // MARK: - Helpers

    private func formatHeight(cm: Double) -> String {
        let totalInches = cm / 2.54
        let feet = Int(totalInches / 12)
        let inches = Int(totalInches.truncatingRemainder(dividingBy: 12))
        return "\(feet)'\(inches)\" (\(Int(cm)) cm)"
    }

    private func formatWeight(kg: Double) -> String {
        let lbs = kg * 2.205
        return "\(Int(lbs)) lbs (\(Int(kg)) kg)"
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
            onboardingComplete: true,
            healthKitEnabled: true
        )

        modelContext.insert(profile)

        Task {
            // Register device with backend
            try? await NourishAPIManager.shared.registerDevice()
            // Request HealthKit access immediately
            try? await HealthKitManager.shared.requestAuthorization()
        }

        showOnboarding = false
    }
}
