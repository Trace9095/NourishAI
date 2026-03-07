import UIKit
import UserNotifications

class AppDelegate: NSObject, UIApplicationDelegate {

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        requestPushNotificationPermission()

        if let notification = launchOptions?[.remoteNotification] as? [String: Any] {
            handleNotificationPayload(notification)
        }

        return true
    }

    // MARK: - Push Notifications

    private func requestPushNotificationPermission() {
        let center = UNUserNotificationCenter.current()
        center.delegate = self

        center.requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
            if let error = error {
                print("[NourishAI] Push notification authorization error: \(error.localizedDescription)")
                return
            }

            if granted {
                DispatchQueue.main.async {
                    UIApplication.shared.registerForRemoteNotifications()
                }
            }
        }
    }

    func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        let tokenString = deviceToken.map { String(format: "%02x", $0) }.joined()

        try? KeychainService.saveString(tokenString, forKey: KeychainService.Keys.deviceToken)

        Task {
            await PushNotificationService.shared.registerDeviceToken(tokenString)
        }

        print("[NourishAI] Device token registered: \(tokenString.prefix(8))...")
    }

    func application(
        _ application: UIApplication,
        didFailToRegisterForRemoteNotificationsWithError error: Error
    ) {
        print("[NourishAI] Failed to register for remote notifications: \(error.localizedDescription)")
    }

    func application(
        _ application: UIApplication,
        didReceiveRemoteNotification userInfo: [AnyHashable: Any],
        fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
    ) {
        handleNotificationPayload(userInfo)
        completionHandler(.newData)
    }

    private func handleNotificationPayload(_ payload: [AnyHashable: Any]) {
        if let deepLink = payload["deepLink"] as? String,
           let url = URL(string: deepLink) {
            DispatchQueue.main.async {
                NotificationCenter.default.post(
                    name: .handleDeepLink,
                    object: nil,
                    userInfo: ["url": url]
                )
            }
        }
    }
}

// MARK: - UNUserNotificationCenterDelegate

extension AppDelegate: UNUserNotificationCenterDelegate {

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        completionHandler([.banner, .badge, .sound])
    }

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        let userInfo = response.notification.request.content.userInfo
        handleNotificationPayload(userInfo)
        completionHandler()
    }
}

// MARK: - Notification Names

extension Notification.Name {
    static let handleDeepLink = Notification.Name("handleDeepLink")
}
