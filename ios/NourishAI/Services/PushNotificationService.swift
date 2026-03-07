import Foundation
import UIKit
import UserNotifications

@MainActor
final class PushNotificationService: ObservableObject {
    static let shared = PushNotificationService()

    @Published var isRegistered = false
    @Published var notificationStatus: UNAuthorizationStatus = .notDetermined

    private init() {
        Task {
            await checkNotificationStatus()
        }
    }

    // MARK: - Permission & Registration

    func checkNotificationStatus() async {
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        notificationStatus = settings.authorizationStatus
        isRegistered = settings.authorizationStatus == .authorized
    }

    func requestPermission() async -> Bool {
        do {
            let granted = try await UNUserNotificationCenter.current()
                .requestAuthorization(options: [.alert, .badge, .sound])

            if granted {
                await MainActor.run {
                    UIApplication.shared.registerForRemoteNotifications()
                }
            }

            await checkNotificationStatus()
            return granted
        } catch {
            print("[NourishAI] Push notification permission error: \(error.localizedDescription)")
            return false
        }
    }

    func registerDeviceToken(_ token: String) async {
        guard !token.isEmpty else { return }

        // Get the app's device UUID (same one NourishAPIManager uses)
        let appDeviceId: String = {
            if let stored = UserDefaults.standard.string(forKey: "nourishai_device_id") {
                return stored
            }
            let newId = UUID().uuidString
            UserDefaults.standard.set(newId, forKey: "nourishai_device_id")
            return newId
        }()

        do {
            guard let url = URL(string: APIConfig.registerDevice) else { return }
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")

            let body: [String: String] = [
                "deviceId": appDeviceId,
                "pushToken": token,
            ]
            request.httpBody = try JSONEncoder().encode(body)

            let (_, response) = try await URLSession.shared.data(for: request)

            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode < 300 {
                print("[NourishAI] Push token registered successfully")
                isRegistered = true
            }
        } catch {
            print("[NourishAI] Push token registration error: \(error.localizedDescription)")
        }
    }

    // MARK: - Notification Categories

    func setupNotificationCategories() {
        let center = UNUserNotificationCenter.current()

        let viewMacrosAction = UNNotificationAction(
            identifier: "VIEW_MACROS",
            title: "View Today's Macros",
            options: [.foreground]
        )
        let logFoodAction = UNNotificationAction(
            identifier: "LOG_FOOD",
            title: "Log Food",
            options: [.foreground]
        )

        let mealReminderCategory = UNNotificationCategory(
            identifier: "MEAL_REMINDER",
            actions: [logFoodAction, viewMacrosAction],
            intentIdentifiers: [],
            options: []
        )

        let scanFoodAction = UNNotificationAction(
            identifier: "SCAN_FOOD",
            title: "Scan Food",
            options: [.foreground]
        )

        let nutritionTipCategory = UNNotificationCategory(
            identifier: "NUTRITION_TIP",
            actions: [scanFoodAction],
            intentIdentifiers: [],
            options: []
        )

        center.setNotificationCategories([
            mealReminderCategory,
            nutritionTipCategory
        ])
    }

    // MARK: - Badge Management

    func updateBadgeCount(_ count: Int) async {
        try? await UNUserNotificationCenter.current().setBadgeCount(count)
    }

    func clearBadge() async {
        try? await UNUserNotificationCenter.current().setBadgeCount(0)
    }

    // MARK: - Local Notifications

    func scheduleMealReminder(mealType: String, hour: Int, minute: Int = 0) async {
        let center = UNUserNotificationCenter.current()

        let content = UNMutableNotificationContent()
        content.title = "Time for \(mealType)!"
        content.body = "Don't forget to log your \(mealType.lowercased()). Tracking keeps you on target."
        content.sound = .default
        content.categoryIdentifier = "MEAL_REMINDER"

        var dateComponents = DateComponents()
        dateComponents.hour = hour
        dateComponents.minute = minute

        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
        let request = UNNotificationRequest(
            identifier: "nourishai-meal-\(mealType.lowercased())",
            content: content,
            trigger: trigger
        )

        try? await center.add(request)
    }

    func cancelAllReminders() {
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
    }
}

// MARK: - Notification Action Handler

extension PushNotificationService {
    func handleNotificationAction(_ actionIdentifier: String, userInfo: [AnyHashable: Any]) {
        switch actionIdentifier {
        case "VIEW_MACROS":
            NotificationCenter.default.post(
                name: .handleDeepLink,
                object: nil,
                userInfo: ["url": URL(string: "nourishai://dashboard")!]
            )

        case "LOG_FOOD":
            NotificationCenter.default.post(
                name: .handleDeepLink,
                object: nil,
                userInfo: ["url": URL(string: "nourishai://log-food")!]
            )

        case "SCAN_FOOD":
            NotificationCenter.default.post(
                name: .handleDeepLink,
                object: nil,
                userInfo: ["url": URL(string: "nourishai://scan")!]
            )

        default:
            break
        }
    }
}
