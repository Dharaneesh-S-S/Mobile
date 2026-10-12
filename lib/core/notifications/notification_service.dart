import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;
import '../constants/app_constants.dart';

/// Application-wide local notification service foundation.
/// Provides scheduling, cancellation, rescheduling, and permission management.
/// Individual modules in subsequent stages will configure their own notifications.
class NotificationService {
  static final NotificationService instance = NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notificationsPlugin = FlutterLocalNotificationsPlugin();
  bool _isInitialized = false;

  NotificationService._internal();

  bool get isInitialized => _isInitialized;

  /// Initializes the local notification plugin and configures Android notification channels.
  Future<void> initialize() async {
    if (_isInitialized) return;

    tz.initializeTimeZones();

    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const InitializationSettings initSettings = InitializationSettings(
      android: androidSettings,
    );

    await _notificationsPlugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        // Handled in future stages when background/payload action routing is integrated
      },
    );

    // Create default notification channel
    const AndroidNotificationChannel defaultChannel = AndroidNotificationChannel(
      AppConstants.channelRemindersId,
      AppConstants.channelRemindersName,
      description: AppConstants.channelRemindersDesc,
      importance: Importance.high,
      enableVibration: true,
      playSound: true,
    );

    final androidImplementation = _notificationsPlugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();

    if (androidImplementation != null) {
      await androidImplementation.createNotificationChannel(defaultChannel);
    }

    _isInitialized = true;
  }

  /// Requests notification permissions for Android 13+ (POST_NOTIFICATIONS)
  Future<bool> requestNotificationPermissions() async {
    final androidImplementation = _notificationsPlugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();

    if (androidImplementation != null) {
      final granted = await androidImplementation.requestNotificationsPermission();
      return granted ?? false;
    }
    return true;
  }

  /// Requests exact alarm permission for Android 12+ if scheduling exact reminders
  Future<bool> requestExactAlarmPermission() async {
    final androidImplementation = _notificationsPlugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();

    if (androidImplementation != null) {
      final granted = await androidImplementation.requestExactAlarmsPermission();
      return granted ?? false;
    }
    return true;
  }

  /// Schedules a future notification at a specific UTC timestamp
  Future<void> scheduleNotification({
    required int id,
    required String title,
    required String body,
    required int scheduledUtcMillis,
    String? payload,
    String channelId = AppConstants.channelRemindersId,
    String channelName = AppConstants.channelRemindersName,
  }) async {
    if (!_isInitialized) await initialize();

    final scheduledDate = tz.TZDateTime.fromMillisecondsSinceEpoch(
      tz.local,
      scheduledUtcMillis,
    );

    // If scheduled time has already passed, skip
    if (scheduledDate.isBefore(tz.TZDateTime.now(tz.local))) {
      return;
    }

    final androidDetails = AndroidNotificationDetails(
      channelId,
      channelName,
      importance: Importance.high,
      priority: Priority.high,
      enableVibration: true,
    );

    await _notificationsPlugin.zonedSchedule(
      id,
      title,
      body,
      scheduledDate,
      NotificationDetails(android: androidDetails),
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      payload: payload,
    );
  }

  /// Cancels a scheduled notification by ID
  Future<void> cancelNotification(int id) async {
    await _notificationsPlugin.cancel(id);
  }

  /// Cancels all scheduled notifications
  Future<void> cancelAllNotifications() async {
    await _notificationsPlugin.cancelAll();
  }
}
