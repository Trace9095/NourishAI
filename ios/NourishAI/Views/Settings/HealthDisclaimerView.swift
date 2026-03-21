import SwiftUI

// MARK: - Health Disclaimer & Citations Sheet
// Apple App Store Guideline 1.4.1 compliance
// Shows medical disclaimer + citation sources for all nutrition recommendations

struct HealthDisclaimerView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {

                    // Medical disclaimer card
                    disclaimerCard

                    // Calculation methodology
                    citationsSection

                    // Data sources
                    dataSourcesSection

                    // Footer
                    Text("NourishAI does not store your health data on servers. All nutrition tracking is local to your device.")
                        .font(.caption2)
                        .foregroundColor(.gray.opacity(0.6))
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: .infinity)
                        .padding(.top, 8)
                        .padding(.bottom, 24)
                }
                .padding(.horizontal, 20)
                .padding(.top, 20)
            }
            .background(Color.brandDark)
            .navigationTitle("Health Sources")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.gray)
                            .font(.title3)
                    }
                    .frame(minWidth: Layout.minTouchTarget, minHeight: Layout.minTouchTarget)
                }
            }
        }
    }

    // MARK: - Disclaimer Card

    private var disclaimerCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 10) {
                Image(systemName: "cross.circle.fill")
                    .font(.title2)
                    .foregroundColor(.macroProtein)
                Text("Not Medical Advice")
                    .font(.headline)
                    .foregroundColor(.white)
            }

            Text("NourishAI is a nutrition tracking tool, not a medical device or clinical service. Information provided by this app is for general wellness purposes only.")
                .font(.subheadline)
                .foregroundColor(.gray)
                .fixedSize(horizontal: false, vertical: true)

            Text("Always consult a qualified healthcare professional, registered dietitian, or licensed nutritionist before making significant changes to your diet, especially if you have a medical condition, are pregnant, nursing, or have a history of disordered eating.")
                .font(.caption)
                .foregroundColor(.gray.opacity(0.8))
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(16)
        .background(Color.macroProtein.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: Layout.cardCornerRadius))
        .overlay(
            RoundedRectangle(cornerRadius: Layout.cardCornerRadius)
                .strokeBorder(Color.macroProtein.opacity(0.25), lineWidth: 1)
        )
    }

    // MARK: - Citations Section

    private var citationsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            sectionHeader("Calculation Methodology")

            citationRow(
                number: "1",
                title: "Calorie Target — Mifflin-St Jeor Equation",
                description: "Basal Metabolic Rate (BMR) is calculated using the Mifflin-St Jeor equation, the most validated formula for estimating resting energy expenditure in adults.",
                citation: "Mifflin MD, et al. (1990). A new predictive equation for resting energy expenditure in healthy individuals. American Journal of Clinical Nutrition, 51(2), 241–247."
            )

            citationRow(
                number: "2",
                title: "Activity Multipliers (TDEE)",
                description: "Total Daily Energy Expenditure is calculated by applying validated activity factors to the BMR estimate.",
                citation: "Harris JA, Benedict FG. (1918). A biometric study of human basal metabolism. Proceedings of the National Academy of Sciences, 4(12), 370–373. Updated activity factors per the ACSM (American College of Sports Medicine)."
            )

            citationRow(
                number: "3",
                title: "Macro Split Targets",
                description: "Protein, carbohydrate, and fat recommendations follow evidence-based dietary reference intakes adjusted for fitness goals.",
                citation: "U.S. Department of Agriculture & U.S. Department of Health and Human Services. Dietary Guidelines for Americans, 2020–2025. 9th Edition. USDA. Position of the Academy of Nutrition and Dietetics: Dietary Fatty Acids for Healthy Adults (2014)."
            )

            citationRow(
                number: "4",
                title: "Protein Recommendations",
                description: "Protein targets are adjusted based on activity level and fitness goal (fat loss, maintenance, muscle gain) using evidence-based sports nutrition guidelines.",
                citation: "Stokes T, et al. (2018). Recent Perspectives Regarding the Role of Dietary Protein for the Promotion of Muscle Hypertrophy. Nutrients, 10(2), 180. International Society of Sports Nutrition (ISSN) Position Stand: Protein and Exercise."
            )

            citationRow(
                number: "5",
                title: "Water Intake Estimates",
                description: "Daily hydration targets are estimated based on body weight and activity level.",
                citation: "National Academies of Sciences, Engineering, and Medicine. (2005). Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate. The National Academies Press."
            )
        }
    }

    // MARK: - Data Sources

    private var dataSourcesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            sectionHeader("Food Data Sources")

            infoRow(
                icon: "barcode",
                title: "Barcode Lookup",
                detail: "Open Food Facts — open-source, community-maintained food database (world.openfoodfacts.org). Data is crowd-sourced and may contain errors."
            )

            infoRow(
                icon: "camera.fill",
                title: "AI Food Analysis",
                detail: "Nutrition estimates from photos are generated by Claude AI (Anthropic). AI-generated nutrition data is an estimate and should not be used for precise medical dietary management."
            )

            infoRow(
                icon: "text.bubble.fill",
                title: "AI Nutrition Chat",
                detail: "Responses are generated by Claude AI and are for informational purposes only. AI responses do not constitute medical advice."
            )
        }
    }

    // MARK: - Helpers

    private func sectionHeader(_ title: String) -> some View {
        Text(title)
            .font(.headline)
            .foregroundColor(.white)
    }

    private func citationRow(number: String, title: String, description: String, citation: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .top, spacing: 10) {
                Text(number)
                    .font(.caption.bold())
                    .foregroundColor(.brandGreen)
                    .frame(width: 20, height: 20)
                    .background(Color.brandGreen.opacity(0.12))
                    .clipShape(Circle())

                Text(title)
                    .font(.subheadline.weight(.semibold))
                    .foregroundColor(.white)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Text(description)
                .font(.caption)
                .foregroundColor(.gray)
                .fixedSize(horizontal: false, vertical: true)
                .padding(.leading, 30)

            Text(citation)
                .font(.caption2)
                .foregroundColor(.gray.opacity(0.7))
                .italic()
                .fixedSize(horizontal: false, vertical: true)
                .padding(.leading, 30)
        }
        .padding(14)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private func infoRow(icon: String, title: String, detail: String) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon)
                .font(.body)
                .foregroundColor(.brandGreen)
                .frame(width: 24)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.subheadline.weight(.semibold))
                    .foregroundColor(.white)
                Text(detail)
                    .font(.caption)
                    .foregroundColor(.gray)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .padding(14)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
