/// Application constants for Personal Hub
class AppConstants {
  static const String appName = 'Personal Hub';
  static const String appVersion = '1.0.0+1';
  static const int schemaVersion = 1;

  // Pattern Lock Constants
  static const int minPatternLength = 4;
  static const int maxPatternLength = 9;

  // Storage Keys for Secure Storage
  static const String keyPatternHash = 'secure_pattern_hash';
  static const String keyPatternSalt = 'secure_pattern_salt';
  static const String keyPatternEnabled = 'secure_pattern_enabled';
  static const String keyBackupEncryptionKey = 'secure_backup_key';

  // Notification Channel IDs
  static const String channelRemindersId = 'personal_hub_reminders';
  static const String channelRemindersName = 'Personal Hub Reminders';
  static const String channelRemindersDesc = 'Notifications for tasks, calendar events, and bills';

  // Backup format version
  static const int backupFormatVersion = 1;
}
