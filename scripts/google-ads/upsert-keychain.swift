import Foundation
import Security

let input = FileHandle.standardInput.readDataToEndOfFile()
_ = try JSONSerialization.jsonObject(with: input)

let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrService as String: "StudioAetherGoogleAdsAPI",
    kSecAttrAccount as String: "oauth-refresh-credentials"
]
let attributes: [String: Any] = [
    kSecValueData as String: input,
    kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock
]

var status = SecItemAdd(query.merging(attributes) { _, new in new } as CFDictionary, nil)
if status == errSecDuplicateItem {
    status = SecItemUpdate(query as CFDictionary, attributes as CFDictionary)
}

guard status == errSecSuccess else {
    fputs("Google Ads Keychain update failed (status \(status)).\n", stderr)
    exit(1)
}

print("Google Ads OAuth credentials saved to the login Keychain.")
