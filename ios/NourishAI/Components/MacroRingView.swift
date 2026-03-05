import SwiftUI

struct MacroRingView: View {
    let current: Double
    let target: Double
    let color: Color
    let label: String
    let unit: String
    var lineWidth: CGFloat = 10
    var size: CGFloat = 80

    private var progress: Double {
        guard target > 0 else { return 0 }
        return min(current / target, 1.0)
    }

    var body: some View {
        VStack(spacing: 6) {
            ZStack {
                // Background track
                Circle()
                    .stroke(color.opacity(0.15), lineWidth: lineWidth)

                // Filled arc
                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(
                        color,
                        style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
                    )
                    .rotationEffect(.degrees(-90))
                    .animation(.easeInOut(duration: 1.0), value: progress)
                    .shadow(color: color.opacity(0.4), radius: 4)

                // Center value
                VStack(spacing: 0) {
                    Text("\(Int(current))")
                        .font(.system(size: size * 0.22, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    Text(unit)
                        .font(.system(size: size * 0.1))
                        .foregroundColor(.gray)
                }
            }
            .frame(width: size, height: size)

            Text(label)
                .font(.caption2)
                .foregroundColor(color)
                .fontWeight(.medium)
        }
    }
}

// MARK: - Dashboard Ring Set

struct DashboardRings: View {
    let calories: Int
    let targetCalories: Int
    let protein: Double
    let targetProtein: Int
    let carbs: Double
    let targetCarbs: Int
    let fat: Double
    let targetFat: Int

    var body: some View {
        HStack(spacing: 16) {
            MacroRingView(
                current: Double(calories),
                target: Double(targetCalories),
                color: .macroCalories,
                label: "Cal",
                unit: "kcal",
                lineWidth: 12,
                size: 90
            )

            VStack(spacing: 12) {
                MacroRingView(
                    current: protein,
                    target: Double(targetProtein),
                    color: .macroProtein,
                    label: "Protein",
                    unit: "g",
                    lineWidth: 8,
                    size: 64
                )
                MacroRingView(
                    current: carbs,
                    target: Double(targetCarbs),
                    color: .macroCarbs,
                    label: "Carbs",
                    unit: "g",
                    lineWidth: 8,
                    size: 64
                )
            }

            MacroRingView(
                current: fat,
                target: Double(targetFat),
                color: .macroFat,
                label: "Fat",
                unit: "g",
                lineWidth: 8,
                size: 64
            )
        }
        .padding()
    }
}

#Preview {
    DashboardRings(
        calories: 1847, targetCalories: 2400,
        protein: 142, targetProtein: 165,
        carbs: 185, targetCarbs: 280,
        fat: 52, targetFat: 80
    )
    .background(Color.brandDark)
}
