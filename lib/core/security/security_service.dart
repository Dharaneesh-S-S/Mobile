import 'dart:convert';
import 'dart:math';
import 'dart:typed_data';
import 'package:crypto/crypto.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/app_constants.dart';

/// Secure storage and cryptographic hashing service for application-wide pattern lock
/// and backup encryption keys. Sensitive material is stored in Android Keystore.
class SecurityService {
  final FlutterSecureStorage _storage;

  SecurityService({FlutterSecureStorage? storage})
      : _storage = storage ??
            const FlutterSecureStorage(
              aOptions: AndroidOptions(
                encryptedSharedPreferences: true,
              ),
            );

  /// Checks if a pattern has been set at least once.
  Future<bool> isPatternSet() async {
    final hash = await _storage.read(key: AppConstants.keyPatternHash);
    return hash != null && hash.isNotEmpty;
  }

  /// Checks if pattern lock is currently enabled.
  Future<bool> isPatternEnabled() async {
    final enabled = await _storage.read(key: AppConstants.keyPatternEnabled);
    if (enabled == null) return false;
    return enabled == 'true';
  }

  /// Sets a new pattern lock.
  /// Derives a secure salt and computes iterative HMAC-SHA256 hash.
  /// Never stores the plaintext pattern!
  Future<void> setPattern(String pattern) async {
    if (pattern.length < AppConstants.minPatternLength) {
      throw ArgumentError('Pattern must be at least ${AppConstants.minPatternLength} points');
    }

    final salt = _generateRandomSalt(32);
    final hash = _hashPattern(pattern, salt);

    await _storage.write(key: AppConstants.keyPatternSalt, value: base64Encode(salt));
    await _storage.write(key: AppConstants.keyPatternHash, value: hash);
    await _storage.write(key: AppConstants.keyPatternEnabled, value: 'true');
  }

  /// Verifies whether the input pattern matches the stored hash.
  Future<bool> verifyPattern(String pattern) async {
    final storedHash = await _storage.read(key: AppConstants.keyPatternHash);
    final storedSaltBase64 = await _storage.read(key: AppConstants.keyPatternSalt);

    if (storedHash == null || storedSaltBase64 == null) {
      return false;
    }

    final salt = base64Decode(storedSaltBase64);
    final computedHash = _hashPattern(pattern, salt);

    // Constant-time comparison to prevent timing attacks
    return _constantTimeEquals(computedHash, storedHash);
  }

  /// Changes the pattern lock after verifying the existing pattern.
  Future<bool> changePattern({
    required String currentPattern,
    required String newPattern,
  }) async {
    final isCurrentValid = await verifyPattern(currentPattern);
    if (!isCurrentValid) {
      return false;
    }

    await setPattern(newPattern);
    return true;
  }

  /// Disables pattern lock after verifying the existing pattern.
  Future<bool> disablePattern(String currentPattern) async {
    final isCurrentValid = await verifyPattern(currentPattern);
    if (!isCurrentValid) {
      return false;
    }

    await _storage.write(key: AppConstants.keyPatternEnabled, value: 'false');
    return true;
  }

  /// Re-enables pattern lock after verifying pattern.
  Future<bool> enablePattern(String currentPattern) async {
    final isCurrentValid = await verifyPattern(currentPattern);
    if (!isCurrentValid) {
      return false;
    }

    await _storage.write(key: AppConstants.keyPatternEnabled, value: 'true');
    return true;
  }

  /// Generates or retrieves a 256-bit AES master key for backup encryption.
  Future<String> getOrCreateBackupKey() async {
    var key = await _storage.read(key: AppConstants.keyBackupEncryptionKey);
    if (key == null) {
      final randomBytes = _generateRandomSalt(32);
      key = base64Encode(randomBytes);
      await _storage.write(key: AppConstants.keyBackupEncryptionKey, value: key);
    }
    return key;
  }

  // --- Cryptographic Helpers ---

  Uint8List _generateRandomSalt(int length) {
    final random = Random.secure();
    final values = List<int>.generate(length, (_) => random.nextInt(256));
    return Uint8List.fromList(values);
  }

  /// Iterative HMAC-SHA256 key stretching (PBKDF2-style)
  String _hashPattern(String pattern, Uint8List salt) {
    var current = Hmac(sha256, salt).convert(utf8.encode(pattern)).bytes;
    for (int i = 0; i < 5000; i++) {
      current = Hmac(sha256, salt).convert(current).bytes;
    }
    return base64Encode(current);
  }

  bool _constantTimeEquals(String a, String b) {
    if (a.length != b.length) return false;
    int result = 0;
    for (int i = 0; i < a.length; i++) {
      result |= a.codeUnitAt(i) ^ b.codeUnitAt(i);
    }
    return result == 0;
  }
}
