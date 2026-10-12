import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../backup/backup_service.dart';
import '../database/app_database.dart';
import '../notifications/notification_service.dart';
import '../security/security_service.dart';

/// Database provider (singleton lifecycle)
final databaseProvider = Provider<AppDatabase>((ref) {
  final db = AppDatabase();
  ref.onDispose(() => db.close());
  return db;
});

/// Security service provider
final securityServiceProvider = Provider<SecurityService>((ref) {
  return SecurityService();
});

/// Backup service provider
final backupServiceProvider = Provider<BackupService>((ref) {
  final db = ref.watch(databaseProvider);
  final security = ref.watch(securityServiceProvider);
  return BackupService(db: db, securityService: security);
});

/// Notification service provider
final notificationServiceProvider = Provider<NotificationService>((ref) {
  return NotificationService.instance;
});

/// Theme mode notifier for switching between System, Dark, and Light themes
class ThemeModeNotifier extends StateNotifier<ThemeMode> {
  ThemeModeNotifier() : super(ThemeMode.dark);

  void setThemeMode(ThemeMode mode) {
    state = mode;
  }

  void toggleTheme() {
    if (state == ThemeMode.dark) {
      state = ThemeMode.light;
    } else {
      state = ThemeMode.dark;
    }
  }
}

final themeModeProvider = StateNotifierProvider<ThemeModeNotifier, ThemeMode>((ref) {
  return ThemeModeNotifier();
});
