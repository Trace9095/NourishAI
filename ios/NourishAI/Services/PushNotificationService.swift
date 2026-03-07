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

        let deviceInfo = DeviceRegistration(
            deviceToken: token,
            platform: "ios",
            appVersion: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0",
            osVersion: UIDevice.current.systemVersion,
            deviceModel: UIDevice.current.model,
            timezone: TimeZone.current.identifier,
            locale: Locale.current.identifier
        )

        do {
            guard let url = URL(string: APIConfig.baseURL.replacingOccurrences(of: "/api", with: "") + "/api/device/register") else { return }
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = try JSONEncoder().encode(deviceInfo)

            let (data, response) = try await URLSession.shared.data(for: request)

            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
                if let result = try? JSONDecoder().decode(DeviceRegistrationResponse.self, from: data),
                   let deviceId = result.deviceId {
                    try? KeychainService.saveString(deviceId, forKey: KeychainService.Keys.deviceId)
                }
                print("[NourishAI] Device token registered successfully")
                isRegistered = true
            }
        } catch {
            print("[NourishAI] Device token registration error: \(error.localizedDescription)")
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

// MARK: - Models

private struct DeviceRegistration: Codable {
    let deviceToken: String
    let platform: String
    let appVersion: String
    let osVersion: String
    let deviceModel: String
    let timezone: String
    let locale: String
}

private struct DeviceRegistrationResponse: Decodable {
    let success: Bool
    let deviceId: String?
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
