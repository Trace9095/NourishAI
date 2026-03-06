import SwiftUI

struct MealRow: View {
    let entry: FoodEntry

    var body: some View {
        HStack(spacing: 12) {
            // Source indicator
            Image(systemName: entry.entryMethod == .aiPhoto ? "camera.fill" :
                             entry.entryMethod == .aiDescription ? "text.bubble.fill" :
                             entry.entryMethod == .barcode ? "barcode" : "pencil")
                .font(.caption)
                .foregroundColor(.brandGreen)
                .frame(width: 28, height: 28)
                .background(Color.brandGreen.opacity(0.1))
                .clipShape(Circle())

            // Food name and details
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.name)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                    .lineLimit(1)

                if let serving = entry.servingSize {
                    Text(serving)
                        .font(.caption2)
                        .foregroundColor(.gray)
                }
            }

            Spacer()

            // Macros
            VStack(alignment: .trailing, spacing: 2) {
                Text("\(entry.calories) cal")
                    .font(.subheadline.bold())
                    .foregroundColor(.macroCalories)

                HStack(spacing: 6) {
                    Text("P:\(Int(entry.protein))")
                        .foregroundColor(.macroProtein)
                    Text("C:\(Int(entry.carbs))")
                        .foregroundColor(.macroCarbs)
                    Text("F:\(Int(entry.fat))")
                        .foregroundColor(.macroFat)
                }
                .font(.caption2)
            }
        }
        .padding(12)
        .background(Color.brandCard)
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}
