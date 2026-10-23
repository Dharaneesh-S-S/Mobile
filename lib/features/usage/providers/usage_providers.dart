import 'package:app_usage/app_usage.dart';
import 'package:device_apps/device_apps.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../models/usage_models.dart';
import '../services/app_categorizer.dart';
import '../services/usage_notification_manager.dart';
import '../services/usage_widget_sync.dart';

// Current view date
final usageDateProvider = StateProvider<DateTime>((ref) => DateTime.now());

// Current timeframe (day, week, month)
final usageTimeframeProvider = StateProvider<UsageTimeframe>((ref) => UsageTimeframe.day);

// Last successful refresh timestamp
final lastRefreshTimeProvider = StateProvider<DateTime>((ref) => DateTime.now());

// Search filter query for apps list
final usageAppSearchQueryProvider = StateProvider<String>((ref) => '');

// Sort criteria for apps list
enum AppSortCriteria {
  durationDesc,
  nameAsc,
  categoryAsc,
}
final usageAppSortProvider = StateProvider<AppSortCriteria>((ref) => AppSortCriteria.durationDesc);

// Fetches the usage info for a specific date from Android UsageStatsManager
final dailyUsageProvider = FutureProvider.family<List<AppUsageInfo>, DateTime>((ref, date) async {
  DateTime startDate = DateTime(date.year, date.month, date.day);
  DateTime endDate = DateTime(date.year, date.month, date.day, 23, 59, 59);

  if (endDate.isAfter(DateTime.now())) {
    endDate = DateTime.now();
  }

  try {
    List<AppUsageInfo> infoList = await AppUsage().getAppUsage(startDate, endDate);
    // Filter out zero-usage apps
    return infoList.where((u) => u.usage.inSeconds > 0).toList();
  } catch (e) {
    return [];
  }
});

// Provider for installed apps to map package names to app names and icons
final installedAppsProvider = FutureProvider<Map<String, Application>>((ref) async {
  try {
    List<Application> apps = await DeviceApps.getInstalledApplications(
      includeAppIcons: true,
      includeSystemApps: true,
      onlyAppsWithLaunchIntent: true,
    );
    return {for (var app in apps) app.packageName: app};
  } catch (e) {
    return {};
  }
});

// A stream that yields all application categories saved in the database
final appCategoriesProvider = StreamProvider<List<AppCategoryEntry>>((ref) {
  final db = ref.watch(databaseProvider);
  return db.usageDao.watchAllCategories();
});

// Map of package name to user-customized category
final customCategoriesMapProvider = Provider<Map<String, String>>((ref) {
  final entries = ref.watch(appCategoriesProvider).valueOrNull ?? [];
  return {for (var e in entries) e.packageName: e.categoryName};
});

// Watch limits from database
final usageLimitsProvider = StreamProvider<List<UsageLimitEntry>>((ref) {
  final db = ref.watch(databaseProvider);
  return db.usageDao.watchAllLimits();
});

// Calculate total usage duration for a single date
final dailyTotalUsageProvider = Provider.family<Duration, DateTime>((ref, date) {
  final usageData = ref.watch(dailyUsageProvider(date)).valueOrNull ?? [];
  Duration total = Duration.zero;
  AppUsageInfo? topAppInfo;
  for (var info in usageData) {
    total += info.usage;
    if (topAppInfo == null || info.usage > topAppInfo.usage) {
      topAppInfo = info;
    }
  }

  // If calculating for today, trigger HomeWidget sync asynchronously
  final now = DateTime.now();
  if (date.year == now.year && date.month == now.month && date.day == now.day && total.inSeconds > 0) {
    Future.microtask(() {
      UsageWidgetSync.syncUsage(
        totalScreenTime: total,
        topAppName: topAppInfo?.appName,
        topAppDuration: topAppInfo?.usage,
      );
    });
  }

  return total;
});

// Yesterday total screen time
final yesterdayTotalUsageProvider = Provider<Duration>((ref) {
  final yesterday = DateTime.now().subtract(const Duration(days: 1));
  return ref.watch(dailyTotalUsageProvider(yesterday));
});

// Screen time comparison between Today and Yesterday
class ScreenTimeComparison {
  final Duration today;
  final Duration yesterday;
  final double percentageChange; // e.g. +15.5 or -8.2
  final bool isIncrease;

  const ScreenTimeComparison({
    required this.today,
    required this.yesterday,
    required this.percentageChange,
    required this.isIncrease,
  });
}

final screenTimeComparisonProvider = Provider<ScreenTimeComparison>((ref) {
  final todayUsage = ref.watch(dailyTotalUsageProvider(DateTime.now()));
  final yesterday = DateTime.now().subtract(const Duration(days: 1));
  final yesterdayUsage = ref.watch(dailyTotalUsageProvider(yesterday));

  if (yesterdayUsage.inSeconds == 0) {
    return ScreenTimeComparison(
      today: todayUsage,
      yesterday: yesterdayUsage,
      percentageChange: 0.0,
      isIncrease: todayUsage.inSeconds > 0,
    );
  }

  final double change = ((todayUsage.inSeconds - yesterdayUsage.inSeconds) / yesterdayUsage.inSeconds) * 100.0;
  return ScreenTimeComparison(
    today: todayUsage,
    yesterday: yesterdayUsage,
    percentageChange: change.abs(),
    isIncrease: change >= 0,
  );
});

// 7-day trend points ending on selected date
final sevenDayTrendProvider = FutureProvider.family<List<DailyUsagePoint>, DateTime>((ref, anchorDate) async {
  List<DailyUsagePoint> points = [];

  for (int i = 6; i >= 0; i--) {
    final d = anchorDate.subtract(Duration(days: i));
    final startDate = DateTime(d.year, d.month, d.day);
    DateTime endDate = DateTime(d.year, d.month, d.day, 23, 59, 59);
    if (endDate.isAfter(DateTime.now())) {
      endDate = DateTime.now();
    }

    Duration total = Duration.zero;
    try {
      final list = await AppUsage().getAppUsage(startDate, endDate);
      for (var item in list) {
        total += item.usage;
      }
    } catch (_) {}

    final label = DateFormat('E').format(d); // e.g. "Mon"
    points.add(DailyUsagePoint(date: d, totalUsage: total, dayLabel: label));
  }

  return points;
});

// Aggregated usage list based on current timeframe (Day, Week, or Month)
final periodAppUsageListProvider = FutureProvider<List<UsageAppItem>>((ref) async {
  final timeframe = ref.watch(usageTimeframeProvider);
  final selectedDate = ref.watch(usageDateProvider);
  final appsMap = ref.watch(installedAppsProvider).valueOrNull ?? {};
  final customCats = ref.watch(customCategoriesMapProvider);

  DateTime startDate;
  DateTime endDate;

  if (timeframe == UsageTimeframe.day) {
    startDate = DateTime(selectedDate.year, selectedDate.month, selectedDate.day);
    endDate = DateTime(selectedDate.year, selectedDate.month, selectedDate.day, 23, 59, 59);
  } else if (timeframe == UsageTimeframe.week) {
    // Week starting Monday
    int weekday = selectedDate.weekday; // 1 = Monday
    startDate = DateTime(selectedDate.year, selectedDate.month, selectedDate.day).subtract(Duration(days: weekday - 1));
    endDate = startDate.add(const Duration(days: 6, hours: 23, minutes: 59, seconds: 59));
  } else {
    // Month
    startDate = DateTime(selectedDate.year, selectedDate.month, 1);
    endDate = DateTime(selectedDate.year, selectedDate.month + 1, 0, 23, 59, 59);
  }

  if (endDate.isAfter(DateTime.now())) {
    endDate = DateTime.now();
  }

  List<AppUsageInfo> rawList = [];
  try {
    rawList = await AppUsage().getAppUsage(startDate, endDate);
  } catch (_) {
    rawList = [];
  }

  Duration totalPeriodUsage = Duration.zero;
  for (var item in rawList) {
    totalPeriodUsage += item.usage;
  }

  final totalSeconds = totalPeriodUsage.inSeconds > 0 ? totalPeriodUsage.inSeconds : 1;

  List<UsageAppItem> result = [];
  for (var raw in rawList) {
    if (raw.usage.inSeconds <= 0) continue;

    final app = appsMap[raw.packageName];
    final appName = app?.appName ?? raw.appName;
    final category = customCats[raw.packageName] ??
        AppCategorizer.inferDefaultCategory(raw.packageName, appName);

    final percentage = (raw.usage.inSeconds / totalSeconds) * 100.0;

    result.add(UsageAppItem(
      packageName: raw.packageName,
      appName: appName,
      usage: raw.usage,
      percentage: percentage,
      category: category,
      iconBytes: app is ApplicationWithIcon ? app.icon : null,
    ));
  }

  // Evaluate notification thresholds on current day
  if (timeframe == UsageTimeframe.day &&
      selectedDate.year == DateTime.now().year &&
      selectedDate.month == DateTime.now().month &&
      selectedDate.day == DateTime.now().day) {
    _evaluateThresholds(ref, totalPeriodUsage, result);
  }

  return result;
});

// Category summaries calculated from periodAppUsageListProvider
final categorySummariesProvider = Provider<List<UsageCategorySummary>>((ref) {
  final appItems = ref.watch(periodAppUsageListProvider).valueOrNull ?? [];
  if (appItems.isEmpty) return [];

  Duration totalPeriodDuration = Duration.zero;
  final Map<String, Duration> catDurations = {};
  final Map<String, int> catCounts = {};

  for (var item in appItems) {
    totalPeriodDuration += item.usage;
    catDurations[item.category] = (catDurations[item.category] ?? Duration.zero) + item.usage;
    catCounts[item.category] = (catCounts[item.category] ?? 0) + 1;
  }

  final totalSec = totalPeriodDuration.inSeconds > 0 ? totalPeriodDuration.inSeconds : 1;

  final List<UsageCategorySummary> summaries = [];
  catDurations.forEach((category, duration) {
    summaries.add(UsageCategorySummary(
      categoryName: category,
      totalUsage: duration,
      percentage: (duration.inSeconds / totalSec) * 100.0,
      color: AppCategorizer.getCategoryColor(category),
      appCount: catCounts[category] ?? 1,
    ));
  });

  summaries.sort((a, b) => b.totalUsage.compareTo(a.totalUsage));
  return summaries;
});

// Total screen time for currently selected timeframe
final periodTotalDurationProvider = Provider<Duration>((ref) {
  final appItems = ref.watch(periodAppUsageListProvider).valueOrNull ?? [];
  Duration total = Duration.zero;
  for (var item in appItems) {
    total += item.usage;
  }
  return total;
});

// Daily average for currently selected timeframe
final dailyAverageUsageProvider = Provider<Duration>((ref) {
  final timeframe = ref.watch(usageTimeframeProvider);
  final totalDuration = ref.watch(periodTotalDurationProvider);

  if (timeframe == UsageTimeframe.day) {
    return totalDuration;
  } else if (timeframe == UsageTimeframe.week) {
    return Duration(seconds: (totalDuration.inSeconds / 7).round());
  } else {
    final date = ref.watch(usageDateProvider);
    final daysInMonth = DateTime(date.year, date.month + 1, 0).day;
    return Duration(seconds: (totalDuration.inSeconds / daysInMonth).round());
  }
});

// Usage streak: consecutive days staying under daily limit
final usageStreakProvider = FutureProvider<int>((ref) async {
  final limits = ref.watch(usageLimitsProvider).valueOrNull ?? [];
  final dailyLimitEntry = limits.where((l) => l.targetId == 'daily' || l.limitType == 'daily_total').firstOrNull;

  if (dailyLimitEntry == null || dailyLimitEntry.limitDurationMinutes <= 0) {
    return 0;
  }

  final limitSec = dailyLimitEntry.limitDurationMinutes * 60;
  int streak = 0;
  final now = DateTime.now();

  // Check past 14 days
  for (int i = 1; i <= 14; i++) {
    final d = now.subtract(Duration(days: i));
    final startDate = DateTime(d.year, d.month, d.day);
    final endDate = DateTime(d.year, d.month, d.day, 23, 59, 59);

    try {
      final list = await AppUsage().getAppUsage(startDate, endDate);
      Duration total = Duration.zero;
      for (var u in list) {
        total += u.usage;
      }
      if (total.inSeconds <= limitSec) {
        streak++;
      } else {
        break;
      }
    } catch (_) {
      break;
    }
  }

  return streak;
});

// Evaluate limits and trigger non-intrusive notifications
void _evaluateThresholds(
  Ref ref,
  Duration totalUsage,
  List<UsageAppItem> apps,
) async {
  final limits = ref.read(usageLimitsProvider).valueOrNull ?? [];
  if (limits.isEmpty) return;

  final notifManager = UsageNotificationManager.instance;

  for (var limit in limits) {
    if (limit.limitType == 'daily_total' || limit.targetId == 'daily') {
      await notifManager.checkDailyLimit(
        todayUsage: totalUsage,
        limitMinutes: limit.limitDurationMinutes,
      );
    } else if (limit.limitType == 'app') {
      final app = apps.where((a) => a.packageName == limit.targetId).firstOrNull;
      if (app != null) {
        await notifManager.checkAppLimit(
          packageName: app.packageName,
          appName: app.appName,
          appUsage: app.usage,
          limitMinutes: limit.limitDurationMinutes,
        );
      }
    } else if (limit.limitType == 'category') {
      Duration catUsage = Duration.zero;
      for (var a in apps) {
        if (a.category == limit.targetId) {
          catUsage += a.usage;
        }
      }
      await notifManager.checkCategoryLimit(
        categoryName: limit.targetId,
        categoryUsage: catUsage,
        limitMinutes: limit.limitDurationMinutes,
      );
    } else if (limit.limitType == 'continuous') {
      await notifManager.checkContinuousUse(
        currentSession: totalUsage,
      );
    }
  }
}

// Utility duration formatter
String formatUsageDuration(Duration duration) {
  if (duration.inSeconds <= 0) return '0m';
  final hours = duration.inHours;
  final minutes = duration.inMinutes.remainder(60);

  if (hours > 0) {
    return '${hours}h ${minutes}m';
  }
  return '${minutes}m';
}
