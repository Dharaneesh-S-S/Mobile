import 'package:app_usage/app_usage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:device_apps/device_apps.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/database/app_database.dart';

// Current view date
final usageDateProvider = StateProvider<DateTime>((ref) => DateTime.now());

// Fetches the usage info for the selected date
final dailyUsageProvider = FutureProvider.family<List<AppUsageInfo>, DateTime>((ref, date) async {
  DateTime endDate = DateTime(date.year, date.month, date.day, 23, 59, 59);
  DateTime startDate = DateTime(date.year, date.month, date.day);
  
  if (endDate.isAfter(DateTime.now())) {
    endDate = DateTime.now();
  }

  try {
    List<AppUsageInfo> infoList = await AppUsage().getAppUsage(startDate, endDate);
    return infoList;
  } catch (e) {
    // If permission is denied or not supported, it might throw an error.
    return [];
  }
});

// A stream that yields all application categories saved in the database
final appCategoriesProvider = StreamProvider<List<AppCategoryEntry>>((ref) {
  final db = ref.watch(databaseProvider);
  return db.usageDao.watchAllCategories();
});

// Provider for installed apps to map package names to app names and icons
final installedAppsProvider = FutureProvider<Map<String, Application>>((ref) async {
  try {
    List<Application> apps = await DeviceApps.getInstalledApplications(
      includeAppIcons: true,
      includeSystemApps: true,
      onlyAppsWithLaunchIntent: true,
    );
    return { for (var app in apps) app.packageName : app };
  } catch (e) {
    return {};
  }
});

// Calculate total usage duration for a given date
final dailyTotalUsageProvider = Provider.family<Duration, DateTime>((ref, date) {
  final usageData = ref.watch(dailyUsageProvider(date)).valueOrNull ?? [];
  
  Duration total = Duration.zero;
  for (var info in usageData) {
    total += info.usage;
  }
  return total;
});

// Watch limits from database
final usageLimitsProvider = StreamProvider<List<UsageLimitEntry>>((ref) {
  final db = ref.watch(databaseProvider);
  return db.usageDao.watchAllLimits();
});
