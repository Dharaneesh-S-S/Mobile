import 'dart:typed_data';
import 'package:flutter/material.dart';

enum UsageTimeframe {
  day,
  week,
  month,
}

class UsageAppItem {
  final String packageName;
  final String appName;
  final Duration usage;
  final double percentage;
  final String category;
  final Uint8List? iconBytes;
  final int? launchCount;

  const UsageAppItem({
    required this.packageName,
    required this.appName,
    required this.usage,
    required this.percentage,
    required this.category,
    this.iconBytes,
    this.launchCount,
  });

  UsageAppItem copyWith({
    String? packageName,
    String? appName,
    Duration? usage,
    double? percentage,
    String? category,
    Uint8List? iconBytes,
    int? launchCount,
  }) {
    return UsageAppItem(
      packageName: packageName ?? this.packageName,
      appName: appName ?? this.appName,
      usage: usage ?? this.usage,
      percentage: percentage ?? this.percentage,
      category: category ?? this.category,
      iconBytes: iconBytes ?? this.iconBytes,
      launchCount: launchCount ?? this.launchCount,
    );
  }
}

class UsageCategorySummary {
  final String categoryName;
  final Duration totalUsage;
  final double percentage;
  final Color color;
  final int appCount;

  const UsageCategorySummary({
    required this.categoryName,
    required this.totalUsage,
    required this.percentage,
    required this.color,
    required this.appCount,
  });
}

class DailyUsagePoint {
  final DateTime date;
  final Duration totalUsage;
  final String dayLabel;

  const DailyUsagePoint({
    required this.date,
    required this.totalUsage,
    required this.dayLabel,
  });
}

class UsageNotificationSettings {
  final bool continuousUseWarningEnabled;
  final int continuousUseThresholdMinutes;
  final bool dailyLimitReachedEnabled;
  final bool appLimitReachedEnabled;
  final bool categoryLimitReachedEnabled;
  final bool dailyWeeklyReportEnabled;
  final bool goalAchievedEnabled;
  final bool increasedUsageWarningEnabled;
  final bool focusSessionCompletedEnabled;
  final bool phoneFreeSessionCompletedEnabled;

  const UsageNotificationSettings({
    this.continuousUseWarningEnabled = true,
    this.continuousUseThresholdMinutes = 60,
    this.dailyLimitReachedEnabled = true,
    this.appLimitReachedEnabled = true,
    this.categoryLimitReachedEnabled = true,
    this.dailyWeeklyReportEnabled = true,
    this.goalAchievedEnabled = true,
    this.increasedUsageWarningEnabled = true,
    this.focusSessionCompletedEnabled = true,
    this.phoneFreeSessionCompletedEnabled = true,
  });
}

class PhoneFreeSchedule {
  final String id;
  final String title;
  final TimeOfDay startTime;
  final TimeOfDay endTime;
  final List<int> daysOfWeek; // 1 = Monday, 7 = Sunday
  final bool isEnabled;

  const PhoneFreeSchedule({
    required this.id,
    required this.title,
    required this.startTime,
    required this.endTime,
    required this.daysOfWeek,
    this.isEnabled = true,
  });
}
