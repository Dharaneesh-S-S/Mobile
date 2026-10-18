import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/notifications/notification_service.dart';
import '../models/usage_models.dart';

class UsageNotificationManager {
  static final UsageNotificationManager instance = UsageNotificationManager._internal();
  UsageNotificationManager._internal();

  static const String _keyContinuousEnabled = 'usage_notif_continuous_enabled';
  static const String _keyContinuousThreshold = 'usage_notif_continuous_threshold';
  static const String _keyDailyLimitEnabled = 'usage_notif_daily_limit_enabled';
  static const String _keyAppLimitEnabled = 'usage_notif_app_limit_enabled';
  static const String _keyCategoryLimitEnabled = 'usage_notif_category_limit_enabled';
  static const String _keyReportsEnabled = 'usage_notif_reports_enabled';
  static const String _keyGoalAchievedEnabled = 'usage_notif_goal_achieved_enabled';
  static const String _keyIncreasedUsageEnabled = 'usage_notif_increased_usage_enabled';
  static const String _keyFocusCompletedEnabled = 'usage_notif_focus_completed_enabled';
  static const String _keyPhoneFreeCompletedEnabled = 'usage_notif_phone_free_completed_enabled';

  // Deduplication keys
  static const String _keyLastDailyLimitNotifDate = 'usage_dedup_daily_limit_date';
  static const String _keyLastIncreasedUsageNotifDate = 'usage_dedup_increased_usage_date';
  static const String _keyLastGoalAchievedNotifDate = 'usage_dedup_goal_achieved_date';
  static const String _keyLastContinuousNotifTime = 'usage_dedup_continuous_time';

  Future<UsageNotificationSettings> loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    return UsageNotificationSettings(
      continuousUseWarningEnabled: prefs.getBool(_keyContinuousEnabled) ?? true,
      continuousUseThresholdMinutes: prefs.getInt(_keyContinuousThreshold) ?? 60,
      dailyLimitReachedEnabled: prefs.getBool(_keyDailyLimitEnabled) ?? true,
      appLimitReachedEnabled: prefs.getBool(_keyAppLimitEnabled) ?? true,
      categoryLimitReachedEnabled: prefs.getBool(_keyCategoryLimitEnabled) ?? true,
      dailyWeeklyReportEnabled: prefs.getBool(_keyReportsEnabled) ?? true,
      goalAchievedEnabled: prefs.getBool(_keyGoalAchievedEnabled) ?? true,
      increasedUsageWarningEnabled: prefs.getBool(_keyIncreasedUsageEnabled) ?? true,
      focusSessionCompletedEnabled: prefs.getBool(_keyFocusCompletedEnabled) ?? true,
      phoneFreeSessionCompletedEnabled: prefs.getBool(_keyPhoneFreeCompletedEnabled) ?? true,
    );
  }

  Future<void> saveSettings(UsageNotificationSettings settings) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyContinuousEnabled, settings.continuousUseWarningEnabled);
    await prefs.setInt(_keyContinuousThreshold, settings.continuousUseThresholdMinutes);
    await prefs.setBool(_keyDailyLimitEnabled, settings.dailyLimitReachedEnabled);
    await prefs.setBool(_keyAppLimitEnabled, settings.appLimitReachedEnabled);
    await prefs.setBool(_keyCategoryLimitEnabled, settings.categoryLimitReachedEnabled);
    await prefs.setBool(_keyReportsEnabled, settings.dailyWeeklyReportEnabled);
    await prefs.setBool(_keyGoalAchievedEnabled, settings.goalAchievedEnabled);
    await prefs.setBool(_keyIncreasedUsageEnabled, settings.increasedUsageWarningEnabled);
    await prefs.setBool(_keyFocusCompletedEnabled, settings.focusSessionCompletedEnabled);
    await prefs.setBool(_keyPhoneFreeCompletedEnabled, settings.phoneFreeSessionCompletedEnabled);
  }

  String _todayString() => DateFormat('yyyy-MM-dd').format(DateTime.now());

  /// Checks if daily screen-time limit has been reached and sends a single notification per day
  Future<void> checkDailyLimit({
    required Duration todayUsage,
    required int limitMinutes,
  }) async {
    if (limitMinutes <= 0) return;
    final settings = await loadSettings();
    if (!settings.dailyLimitReachedEnabled) return;

    if (todayUsage.inMinutes >= limitMinutes) {
      final prefs = await SharedPreferences.getInstance();
      final today = _todayString();
      final lastNotified = prefs.getString(_keyLastDailyLimitNotifDate);

      if (lastNotified != today) {
        await prefs.setString(_keyLastDailyLimitNotifDate, today);
        final hours = limitMinutes ~/ 60;
        final mins = limitMinutes % 60;
        final limitStr = hours > 0 ? '${hours}h ${mins}m' : '${mins}m';

        await NotificationService.instance.showNotification(
          id: 6001,
          title: 'Daily Screen Time Limit Reached',
          body: "You have reached your daily screen-time limit of $limitStr. Time to take a mindful break!",
        );
      }
    }
  }

  /// Checks if an individual app's limit has been reached
  Future<void> checkAppLimit({
    required String packageName,
    required String appName,
    required Duration appUsage,
    required int limitMinutes,
  }) async {
    if (limitMinutes <= 0) return;
    final settings = await loadSettings();
    if (!settings.appLimitReachedEnabled) return;

    if (appUsage.inMinutes >= limitMinutes) {
      final prefs = await SharedPreferences.getInstance();
      final today = _todayString();
      final key = 'usage_dedup_app_${packageName}_date';
      final lastNotified = prefs.getString(key);

      if (lastNotified != today) {
        await prefs.setString(key, today);
        final hours = limitMinutes ~/ 60;
        final mins = limitMinutes % 60;
        final limitStr = hours > 0 ? '${hours}h ${mins}m' : '${mins}m';

        await NotificationService.instance.showNotification(
          id: 6100 + (packageName.hashCode % 500).abs(),
          title: '$appName Limit Reached',
          body: "You've spent $limitStr on $appName today, reaching your configured limit.",
        );
      }
    }
  }

  /// Checks if a category's limit has been reached
  Future<void> checkCategoryLimit({
    required String categoryName,
    required Duration categoryUsage,
    required int limitMinutes,
  }) async {
    if (limitMinutes <= 0) return;
    final settings = await loadSettings();
    if (!settings.categoryLimitReachedEnabled) return;

    if (categoryUsage.inMinutes >= limitMinutes) {
      final prefs = await SharedPreferences.getInstance();
      final today = _todayString();
      final key = 'usage_dedup_cat_${categoryName}_date';
      final lastNotified = prefs.getString(key);

      if (lastNotified != today) {
        await prefs.setString(key, today);
        final hours = limitMinutes ~/ 60;
        final mins = limitMinutes % 60;
        final limitStr = hours > 0 ? '${hours}h ${mins}m' : '${mins}m';

        await NotificationService.instance.showNotification(
          id: 6600 + (categoryName.hashCode % 100).abs(),
          title: '$categoryName Limit Reached',
          body: "You've reached your $limitStr daily limit for $categoryName apps.",
        );
      }
    }
  }

  /// Triggers continuous-use reminder if threshold is exceeded
  Future<void> checkContinuousUse({required Duration currentSession}) async {
    final settings = await loadSettings();
    if (!settings.continuousUseWarningEnabled) return;

    if (currentSession.inMinutes >= settings.continuousUseThresholdMinutes) {
      final prefs = await SharedPreferences.getInstance();
      final lastNotifiedEpoch = prefs.getInt(_keyLastContinuousNotifTime) ?? 0;
      final now = DateTime.now().millisecondsSinceEpoch;

      // Throttle to at most once per threshold interval
      if (now - lastNotifiedEpoch > settings.continuousUseThresholdMinutes * 60 * 1000) {
        await prefs.setInt(_keyLastContinuousNotifTime, now);
        await NotificationService.instance.showNotification(
          id: 6002,
          title: 'Continuous Use Reminder',
          body: "You've been actively using your phone for ${settings.continuousUseThresholdMinutes} minutes. Rest your eyes and stretch!",
        );
      }
    }
  }

  /// Alerts the user if today's screen time has significantly increased compared to yesterday
  Future<void> checkIncreasedUsage({
    required Duration todayUsage,
    required Duration yesterdayUsage,
  }) async {
    final settings = await loadSettings();
    if (!settings.increasedUsageWarningEnabled) return;

    // Only alert if yesterday had significant usage and today is > 30% higher
    if (yesterdayUsage.inMinutes >= 60 &&
        todayUsage.inMinutes >= (yesterdayUsage.inMinutes * 1.3).round()) {
      final prefs = await SharedPreferences.getInstance();
      final today = _todayString();
      final lastNotified = prefs.getString(_keyLastIncreasedUsageNotifDate);

      if (lastNotified != today) {
        await prefs.setString(_keyLastIncreasedUsageNotifDate, today);
        await NotificationService.instance.showNotification(
          id: 6003,
          title: 'Usage Spike Detected',
          body: "Screen time today is over 30% higher than yesterday. Check your app activity in Usage Tracker.",
        );
      }
    }
  }

  /// Celebrates achieving the daily screen time goal
  Future<void> notifyGoalAchieved({required int streakCount}) async {
    final settings = await loadSettings();
    if (!settings.goalAchievedEnabled) return;

    final prefs = await SharedPreferences.getInstance();
    final today = _todayString();
    final lastNotified = prefs.getString(_keyLastGoalAchievedNotifDate);

    if (lastNotified != today) {
      await prefs.setString(_keyLastGoalAchievedNotifDate, today);
      await NotificationService.instance.showNotification(
        id: 6004,
        title: 'Daily Screen Time Goal Achieved! 🎉',
        body: streakCount > 1
            ? "Congratulations! You stayed within your daily screen-time goal ($streakCount days in a row!)."
            : "Great job! You stayed within your daily screen-time goal today.",
      );
    }
  }

  /// Notifies when a Focus Session is completed
  Future<void> notifyFocusCompleted({required int minutes}) async {
    final settings = await loadSettings();
    if (!settings.focusSessionCompletedEnabled) return;

    await NotificationService.instance.showNotification(
      id: 6005,
      title: 'Focus Session Completed 🎯',
      body: "You completed your $minutes-minute focus session! Time to take a well-deserved break.",
    );
  }

  /// Notifies when a Phone-Free Session or Bedtime schedule completes
  Future<void> notifyPhoneFreeCompleted({required String scheduleTitle}) async {
    final settings = await loadSettings();
    if (!settings.phoneFreeSessionCompletedEnabled) return;

    await NotificationService.instance.showNotification(
      id: 6006,
      title: 'Phone-Free Session Completed 🌙',
      body: "Your '$scheduleTitle' schedule has concluded. Hope you enjoyed your offline time!",
    );
  }
}
