import SwiftUI
import SwiftData

// MARK: - Chat Message Model

struct ChatMessage: Identifiable, Sendable {
    let id = UUID()
    let role: ChatRole
    let content: String
    let timestamp: Date

    enum ChatRole: Sendable {
        case user, assistant
    }
}

struct NutritionChatView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @Query private var profiles: [UserProfile]

    @State private var messages: [ChatMessage] = []
    @State private var inputText = ""
    @State private var isTyping = false
    @State private var errorMessage: String?
    @State private var messagesUsedToday = 0
    @State private var showSubscription = false

    private let maxFreeMessages = 5

    private var profile: UserProfile? { profiles.first }
    private var isPro: Bool { profile?.subscriptionTier == "pro" }
    private var remainingMessages: Int { max(0, maxFreeMessages - messagesUsedToday) }

    private var todayNutrition: DailyNutrition? {
        let today = Calendar.current.startOfDay(for: Date())
        let descriptor = FetchDescriptor<DailyNutrition>(
            predicate: #Predicate { $0.date >= today }
        )
        return try? modelContext.fetch(descriptor).first
    }

    private let suggestedPrompts = [
        "What should I eat?",
        "Rate my day",
        "How much protein left?",
    ]

    var body: some View {
        NavigationStack {
            ZStack {
                Color.brandDark.ignoresSafeArea()

                VStack(spacing: 0) {
                    messagesCounter
                    chatMessages
                    inputBar
                }
            }
            .navigationTitle("Nutrition Chat")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    // MARK: - Messages Counter

    private var messagesCounter: some View {
        Group {
            if !isPro {
                HStack {
                    Image(systemName: "bubble.left.and.bubble.right")
                        .font(.caption)
                    Text("\(remainingMessages)/\(maxFreeMessages) messages today")
                        .font(.caption)
                    Spacer()
                    if remainingMessages <= 2 {
                        Button {
                            showSubscription = true
                        } label: {
                            Text("Upgrade to Pro")
                                .font(.caption.bold())
                                .foregroundColor(.brandGreen)
                        }
                    }
                }
                .foregroundColor(.gray)
                .padding(.horizontal)
                .padding(.vertical, 8)
                .background(remainingMessages <= 1 ? Color.brandOrange.opacity(0.1) : Color.brandCard)
            }
        }
        .sheet(isPresented: $showSubscription) {
            SubscriptionView()
        }
    }

    // MARK: - Chat Messages

    private var chatMessages: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 12) {
                    if messages.isEmpty {
                        welcomeSection
                    }

                    ForEach(messages) { message in
                        chatBubble(message)
                            .id(message.id)
                    }

                    if isTyping {
                        typingIndicator
                            .id("typing")
                    }
                }
                .padding()
            }
            .onChange(of: messages.count) { _, _ in
                withAnimation {
                    if let last = messages.last {
                        proxy.scrollTo(last.id, anchor: .bottom)
                    }
                }
            }
            .onChange(of: isTyping) { _, typing in
                if typing {
                    withAnimation {
                        proxy.scrollTo("typing", anchor: .bottom)
                    }
                }
            }
        }
    }

    // MARK: - Welcome Section

    private var welcomeSection: some View {
        VStack(spacing: 20) {
            Spacer().frame(height: 40)

            Image(systemName: "bubble.left.and.text.bubble.right")
                .font(.system(size: 48))
                .foregroundColor(.brandGreen)

            Text("Ask me anything about nutrition")
                .font(.headline)
                .foregroundColor(.white)

            Text("I know your goals and what you've eaten today")
                .font(.subheadline)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)

            VStack(spacing: 8) {
                ForEach(suggestedPrompts, id: \.self) { prompt in
                    Button {
                        sendMessage(prompt)
                    } label: {
                        HStack {
                            Text(prompt)
                                .font(.subheadline)
                            Spacer()
                            Image(systemName: "arrow.right")
                                .font(.caption)
                        }
                        .foregroundColor(.brandGreen)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .background(Color.brandGreen.opacity(0.1))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    .frame(minHeight: Layout.minTouchTarget)
                }
            }
            .padding(.top, 8)
        }
    }

    // MARK: - Chat Bubble

    private func chatBubble(_ message: ChatMessage) -> some View {
        HStack {
            if message.role == .user { Spacer(minLength: 60) }

            VStack(alignment: message.role == .user ? .trailing : .leading, spacing: 4) {
                Text(message.content)
                    .font(.body)
                    .foregroundColor(.white)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(message.role == .user ? Color.brandGreen : Color.brandCard)
                    .clipShape(RoundedRectangle(cornerRadius: 16))

                Text(message.timestamp, style: .time)
                    .font(.caption2)
                    .foregroundColor(.gray)
            }

            if message.role == .assistant { Spacer(minLength: 60) }
        }
    }

    // MARK: - Typing Indicator

    private var typingIndicator: some View {
        HStack {
            HStack(spacing: 4) {
                ForEach(0..<3, id: \.self) { index in
                    Circle()
                        .fill(Color.gray)
                        .frame(width: 8, height: 8)
                        .opacity(typingDotOpacity(index))
                        .animation(
                            .easeInOut(duration: 0.6)
                                .repeatForever()
                                .delay(Double(index) * 0.2),
                            value: isTyping
                        )
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.brandCard)
            .clipShape(RoundedRectangle(cornerRadius: 16))

            Spacer()
        }
    }

    private func typingDotOpacity(_ index: Int) -> Double {
        isTyping ? 1.0 : 0.3
    }

    // MARK: - Input Bar

    private var inputBar: some View {
        VStack(spacing: 0) {
            if let error = errorMessage {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.brandOrange)
                    .padding(.horizontal)
                    .padding(.bottom, 4)
            }

            HStack(spacing: 10) {
                TextField("Ask about nutrition...", text: $inputText)
                    .foregroundColor(.white)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(Color.brandCard)
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    .onSubmit {
                        guard !inputText.isEmpty else { return }
                        sendMessage(inputText)
                    }

                Button {
                    guard !inputText.isEmpty else { return }
                    sendMessage(inputText)
                } label: {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.title2)
                        .foregroundColor(inputText.isEmpty ? .gray : .brandGreen)
                }
                .frame(minWidth: Layout.minTouchTarget, minHeight: Layout.minTouchTarget)
                .disabled(inputText.isEmpty || isTyping)
            }
            .padding(.horizontal)
            .padding(.vertical, 8)
        }
        .background(Color.brandDark)
    }

    // MARK: - Helpers

    private func sendMessage(_ text: String) {
        guard !isPro ? remainingMessages > 0 : true else {
            errorMessage = "Daily message limit reached. Upgrade to Pro for unlimited chat."
            return
        }

        let userMessage = ChatMessage(role: .user, content: text, timestamp: Date())
        messages.append(userMessage)
        inputText = ""
        errorMessage = nil
        isTyping = true

        if !isPro {
            messagesUsedToday += 1
        }

        let eaten = todayNutrition
        let targetCal = profile?.targetCalories ?? 2000
        let targetP = profile?.targetProtein ?? 150

        let chatContext = ChatContext(
            dailyCalories: eaten?.totalCalories,
            dailyProtein: eaten?.totalProtein,
            dailyCarbs: eaten?.totalCarbs,
            dailyFat: eaten?.totalFat,
            targetCalories: targetCal,
            targetProtein: targetP,
            goalType: profile?.nutritionGoal.displayName,
            recentFoods: nil
        )

        Task {
            do {
                let response = try await NourishAPIManager.shared.sendChatMessage(
                    message: text,
                    context: chatContext
                )
                await MainActor.run {
                    let assistantMessage = ChatMessage(
                        role: .assistant,
                        content: response.reply,
                        timestamp: Date()
                    )
                    messages.append(assistantMessage)
                    isTyping = false
                }
            } catch {
                await MainActor.run {
                    errorMessage = error.localizedDescription
                    isTyping = false
                }
            }
        }
    }
}
