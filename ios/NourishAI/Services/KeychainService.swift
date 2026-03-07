import Foundation
import Security

final class KeychainService {
    enum KeychainError: Error, LocalizedError {
        case duplicateEntry
        case itemNotFound
        case unexpectedStatus(OSStatus)
        case dataConversionError
        case encodingError
        var errorDescription: String? {
            switch self {
            case .duplicateEntry: return "Item already exists in Keychain"
            case .itemNotFound: return "Item not found in Keychain"
            case .unexpectedStatus(let status): return "Keychain error: \(status)"
            case .dataConversionError: return "Failed to convert data"
            case .encodingError: return "Failed to encode data"
            }
        }
    }

    private static let service = Bundle.main.bundleIdentifier ?? "com.epicai.nourishai"

    static func save(key: String, data: Data) throws {
        let deleteQuery: [CFString: Any] = [kSecClass: kSecClassGenericPassword, kSecAttrService: service, kSecAttrAccount: key]
        SecItemDelete(deleteQuery as CFDictionary)
        let query: [CFString: Any] = [kSecClass: kSecClassGenericPassword, kSecAttrService: service, kSecAttrAccount: key, kSecValueData: data, kSecAttrAccessible: kSecAttrAccessibleWhenUnlockedThisDeviceOnly]
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else { throw KeychainError.unexpectedStatus(status) }
    }

    static func load(key: String) throws -> Data {
        let query: [CFString: Any] = [kSecClass: kSecClassGenericPassword, kSecAttrService: service, kSecAttrAccount: key, kSecReturnData: true, kSecMatchLimit: kSecMatchLimitOne]
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        guard status == errSecSuccess, let data = result as? Data else {
            if status == errSecItemNotFound { throw KeychainError.itemNotFound }
            throw KeychainError.unexpectedStatus(status)
        }
        return data
    }

    static func delete(key: String) {
        let query: [CFString: Any] = [kSecClass: kSecClassGenericPassword, kSecAttrService: service, kSecAttrAccount: key]
        SecItemDelete(query as CFDictionary)
    }

    static func exists(key: String) -> Bool {
        let query: [CFString: Any] = [kSecClass: kSecClassGenericPassword, kSecAttrService: service, kSecAttrAccount: key, kSecReturnData: false]
        return SecItemCopyMatching(query as CFDictionary, nil) == errSecSuccess
    }

    static func saveString(_ value: String, forKey key: String) throws {
        guard let data = value.data(using: .utf8) else { throw KeychainError.encodingError }
        try save(key: key, data: data)
    }

    static func loadString(forKey key: String) throws -> String {
        let data = try load(key: key)
        guard let string = String(data: data, encoding: .utf8) else { throw KeychainError.dataConversionError }
        return string
    }

    static func loadStringOptional(forKey key: String) -> String? { try? loadString(forKey: key) }

    static func save<T: Encodable>(_ object: T, forKey key: String) throws {
        let data = try JSONEncoder().encode(object)
        try save(key: key, data: data)
    }

    static func load<T: Decodable>(forKey key: String) throws -> T {
        let data = try load(key: key)
        return try JSONDecoder().decode(T.self, from: data)
    }

    static func clearAll() {
        let query: [CFString: Any] = [kSecClass: kSecClassGenericPassword, kSecAttrService: service]
        SecItemDelete(query as CFDictionary)
    }
}

extension KeychainService {
    enum Keys {
        static let deviceToken = "deviceToken"
        static let deviceId = "backendDeviceId"
        static let accessToken = "accessToken"
        static let refreshToken = "refreshToken"
        static let userEmail = "userEmail"
        static let encryptionKey = "encryptionKey"
    }
}
