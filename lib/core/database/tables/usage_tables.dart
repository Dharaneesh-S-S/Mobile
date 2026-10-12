import 'package:drift/drift.dart';

/// Device / application usage sessions table
@DataClassName('UsageSessionEntry')
@TableIndex(name: 'idx_usage_package', columns: {#packageName})
@TableIndex(name: 'idx_usage_start_time', columns: {#startTimeUtc})
class UsageSessions extends Table {
  TextColumn get id => text()();
  TextColumn get packageName => text().withLength(min: 1, max: 256)();
  TextColumn get appName => text().withLength(min: 1, max: 128)();
  IntColumn get startTimeUtc => integer()();
  IntColumn get endTimeUtc => integer()();
  IntColumn get durationSeconds => integer()();
  IntColumn get createdAtUtc => integer()();

  @override
  Set<Column> get primaryKey => {id};
}

@DataClassName('AppCategoryEntry')
class AppCategories extends Table {
  TextColumn get packageName => text().withLength(min: 1, max: 256)();
  TextColumn get categoryName => text().withLength(min: 1, max: 128)();
  
  @override
  Set<Column> get primaryKey => {packageName};
}

@DataClassName('UsageLimitEntry')
class UsageLimits extends Table {
  TextColumn get id => text()();
  TextColumn get targetId => text()(); // "daily", packageName, or categoryName
  TextColumn get limitType => text()(); // "daily_total", "app", "category", "continuous"
  IntColumn get limitDurationMinutes => integer()();
  
  @override
  Set<Column> get primaryKey => {id};
}
