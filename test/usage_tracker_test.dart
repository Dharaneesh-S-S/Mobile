import 'package:drift/drift.dart' as drift;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:personal_hub/core/database/app_database.dart';
import 'package:personal_hub/features/usage/models/usage_models.dart';
import 'package:personal_hub/features/usage/providers/focus_session_provider.dart';
import 'package:personal_hub/features/usage/providers/usage_providers.dart';
import 'package:personal_hub/features/usage/services/app_categorizer.dart';

void main() {
  group('Stage 6 — Android Mobile Usage Tracker Tests', () {
    late AppDatabase db;

    setUp(() {
      db = AppDatabase(NativeDatabase.memory());
    });

    tearDown(() async {
      await db.close();
    });

    test('AppCategorizer heuristic inference and category constants', () {
      expect(
        AppCategorizer.inferDefaultCategory('com.instagram.android', 'Instagram'),
        equals(AppCategorizer.categorySocial),
      );
      expect(
        AppCategorizer.inferDefaultCategory('com.google.android.youtube', 'YouTube'),
        equals(AppCategorizer.categoryEntertainment),
      );
      expect(
        AppCategorizer.inferDefaultCategory('com.google.android.gm', 'Gmail'),
        equals(AppCategorizer.categoryProductivity),
      );
      expect(
        AppCategorizer.inferDefaultCategory('com.whatsapp', 'WhatsApp'),
        equals(AppCategorizer.categoryCommunication),
      );
      expect(
        AppCategorizer.inferDefaultCategory('com.duolingo', 'Duolingo'),
        equals(AppCategorizer.categoryEducation),
      );
      expect(
        AppCategorizer.inferDefaultCategory('com.king.candycrushsaga', 'Candy Crush'),
        equals(AppCategorizer.categoryGames),
      );
      expect(
        AppCategorizer.inferDefaultCategory('com.example.unknownapp', 'Unknown App'),
        equals(AppCategorizer.categoryOther),
      );

      // Verify colors and icons exist for all categories
      for (final cat in AppCategorizer.defaultCategories) {
        final color = AppCategorizer.getCategoryColor(cat);
        final icon = AppCategorizer.getCategoryIcon(cat);
        expect(color, isNotNull);
        expect(icon, isNotNull);
      }
    });

    test('Duration formatter and ScreenTimeComparison calculation', () {
      expect(formatUsageDuration(Duration.zero), equals('0m'));
      expect(formatUsageDuration(const Duration(minutes: 45)), equals('45m'));
      expect(formatUsageDuration(const Duration(hours: 3, minutes: 20)), equals('3h 20m'));

      // Comparison increase
      const comp1 = ScreenTimeComparison(
        today: Duration(hours: 4),
        yesterday: Duration(hours: 2),
        percentageChange: 100.0,
        isIncrease: true,
      );
      expect(comp1.isIncrease, isTrue);
      expect(comp1.percentageChange, equals(100.0));

      // Comparison decrease
      const comp2 = ScreenTimeComparison(
        today: Duration(hours: 2),
        yesterday: Duration(hours: 4),
        percentageChange: 50.0,
        isIncrease: false,
      );
      expect(comp2.isIncrease, isFalse);
      expect(comp2.percentageChange, equals(50.0));
    });

    test('Drift UsageDao Category overrides persist and update correctly', () async {
      final initialCategories = await db.usageDao.getAllCategories();
      expect(initialCategories, isEmpty);

      // Insert custom category override
      await db.usageDao.insertCategory(
        AppCategoriesCompanion.insert(
          packageName: 'com.custom.notes',
          categoryName: AppCategorizer.categoryProductivity,
        ),
      );

      var categories = await db.usageDao.getAllCategories();
      expect(categories.length, equals(1));
      expect(categories.first.packageName, equals('com.custom.notes'));
      expect(categories.first.categoryName, equals(AppCategorizer.categoryProductivity));

      // Update category override to Education
      await db.usageDao.insertCategory(
        AppCategoriesCompanion.insert(
          packageName: 'com.custom.notes',
          categoryName: AppCategorizer.categoryEducation,
        ),
      );

      categories = await db.usageDao.getAllCategories();
      expect(categories.length, equals(1));
      expect(categories.first.categoryName, equals(AppCategorizer.categoryEducation));

      // Delete override
      await db.usageDao.deleteCategory('com.custom.notes');
      categories = await db.usageDao.getAllCategories();
      expect(categories, isEmpty);
    });

    test('Drift UsageDao Daily, App, and Category Limits persist and delete', () async {
      // 1. Daily Total Screen Time Goal
      await db.usageDao.insertLimit(
        UsageLimitsCompanion.insert(
          id: 'daily_goal',
          targetId: 'daily',
          limitType: 'daily_total',
          limitDurationMinutes: 240, // 4 hours
        ),
      );

      // 2. Per-App Limit (YouTube: 60 mins)
      await db.usageDao.insertLimit(
        UsageLimitsCompanion.insert(
          id: 'app_limit_youtube',
          targetId: 'com.google.android.youtube',
          limitType: 'app',
          limitDurationMinutes: 60,
        ),
      );

      // 3. Category Limit (Social media: 90 mins)
      await db.usageDao.insertLimit(
        UsageLimitsCompanion.insert(
          id: 'cat_limit_social',
          targetId: AppCategorizer.categorySocial,
          limitType: 'category',
          limitDurationMinutes: 90,
        ),
      );

      // 4. Continuous-use Limit (45 mins)
      await db.usageDao.insertLimit(
        UsageLimitsCompanion.insert(
          id: 'continuous_limit',
          targetId: 'continuous',
          limitType: 'continuous',
          limitDurationMinutes: 45,
        ),
      );

      final allLimits = await db.usageDao.getAllLimits();
      expect(allLimits.length, equals(4));

      final daily = allLimits.where((l) => l.targetId == 'daily').first;
      expect(daily.limitDurationMinutes, equals(240));

      final app = allLimits.where((l) => l.targetId == 'com.google.android.youtube').first;
      expect(app.limitDurationMinutes, equals(60));

      final cat = allLimits.where((l) => l.targetId == AppCategorizer.categorySocial).first;
      expect(cat.limitDurationMinutes, equals(90));

      // Delete a limit
      await db.usageDao.deleteLimit('app_limit_youtube');
      final updatedLimits = await db.usageDao.getAllLimits();
      expect(updatedLimits.length, equals(3));
      expect(updatedLimits.any((l) => l.id == 'app_limit_youtube'), isFalse);
    });

    test('Drift UsageDao UsageSessions range queries and duration calculation', () async {
      final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;

      // Session 1: 30 minutes (1800 seconds)
      await db.usageDao.insertSession(
        UsageSessionsCompanion.insert(
          id: 'session_1',
          packageName: 'com.google.android.youtube',
          appName: 'YouTube',
          startTimeUtc: now - 3600,
          endTimeUtc: now - 1800,
          durationSeconds: 1800,
          createdAtUtc: now,
        ),
      );

      // Session 2: 15 minutes (900 seconds)
      await db.usageDao.insertSession(
        UsageSessionsCompanion.insert(
          id: 'session_2',
          packageName: 'com.whatsapp',
          appName: 'WhatsApp',
          startTimeUtc: now - 1800,
          endTimeUtc: now - 900,
          durationSeconds: 900,
          createdAtUtc: now,
        ),
      );

      final sessions = await db.usageDao.getSessionsInRange(now - 7200, now);
      expect(sessions.length, equals(2));

      final totalDuration = await db.usageDao.getTotalDurationSecondsInRange(now - 7200, now);
      expect(totalDuration, equals(2700)); // 1800 + 900 = 2700 seconds (45 minutes)
    });

    test('FocusSessionNotifier starts, tracks progress, and pauses correctly', () {
      final notifier = FocusSessionNotifier();

      expect(notifier.state.isActive, isFalse);
      expect(notifier.state.totalMinutes, equals(25));

      // Start 30-minute session
      notifier.startSession(minutes: 30, label: 'Deep Reading');
      expect(notifier.state.isActive, isTrue);
      expect(notifier.state.totalMinutes, equals(30));
      expect(notifier.state.remainingSeconds, equals(1800));
      expect(notifier.state.formattedRemaining, equals('30:00'));
      expect(notifier.state.progress, equals(0.0));

      // Pause
      notifier.pauseSession();
      expect(notifier.state.isActive, isFalse);

      // Resume
      notifier.resumeSession();
      expect(notifier.state.isActive, isTrue);

      // Stop
      notifier.stopSession();
      expect(notifier.state.isActive, isFalse);
      expect(notifier.state.remainingSeconds, equals(1800));

      notifier.dispose();
    });
  });
}
