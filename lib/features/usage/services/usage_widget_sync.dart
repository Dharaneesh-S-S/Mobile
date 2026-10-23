import 'package:flutter/foundation.dart';
import 'package:home_widget/home_widget.dart';

class UsageWidgetSync {
  /// Syncs daily screen time and top app data to Android home screen widgets
  static Future<void> syncUsage({
    required Duration totalScreenTime,
    String? topAppName,
    Duration? topAppDuration,
    String? status,
  }) async {
    try {
      final hours = totalScreenTime.inHours;
      final minutes = totalScreenTime.inMinutes.remainder(60);

      String formattedScreenTime;
      if (hours > 0) {
        formattedScreenTime = '${hours}h ${minutes}m';
      } else if (minutes > 0) {
        formattedScreenTime = '${minutes}m';
      } else {
        formattedScreenTime = '0m';
      }

      String topAppFormatted;
      if (topAppName != null && topAppName.isNotEmpty) {
        if (topAppDuration != null && topAppDuration.inMinutes > 0) {
          final topH = topAppDuration.inHours;
          final topM = topAppDuration.inMinutes.remainder(60);
          final topDurStr = topH > 0 ? '${topH}h ${topM}m' : '${topM}m';
          topAppFormatted = 'Top: $topAppName ($topDurStr)';
        } else {
          topAppFormatted = 'Top: $topAppName';
        }
      } else {
        topAppFormatted = 'No usage recorded yet';
      }

      final usageStatus = status ?? (totalScreenTime.inHours >= 6 ? 'High Usage' : 'Healthy');

      await HomeWidget.saveWidgetData<String>('screenTime', formattedScreenTime);
      await HomeWidget.saveWidgetData<String>('topApp', topAppFormatted);
      await HomeWidget.saveWidgetData<String>('usageStatus', usageStatus);
      await HomeWidget.saveWidgetData<int>('screenTimeMinutes', totalScreenTime.inMinutes);

      // Trigger updates for both dedicated Usage widget and combined Music+Usage widget
      await HomeWidget.updateWidget(
        name: 'UsageWidgetProvider',
        androidName: 'UsageWidgetProvider',
      );
      await HomeWidget.updateWidget(
        name: 'CombinedWidgetProvider',
        androidName: 'CombinedWidgetProvider',
      );
    } catch (e) {
      debugPrint('UsageWidgetSync exception: $e');
    }
  }
}
