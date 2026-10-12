import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/usage_tables.dart';

part 'usage_dao.g.dart';

@DriftAccessor(tables: [UsageSessions, AppCategories, UsageLimits])
class UsageDao extends DatabaseAccessor<AppDatabase> with _$UsageDaoMixin {
  UsageDao(super.db);

  Future<List<UsageSessionEntry>> getAllSessions() => select(usageSessions).get();

  Stream<List<UsageSessionEntry>> watchAllSessions() => select(usageSessions).watch();

  Future<int> insertSession(UsageSessionsCompanion session) => into(usageSessions).insert(session);
  
  Future<bool> updateSession(UsageSessionEntry session) => update(usageSessions).replace(session);

  Future<int> deleteSession(String id) => (delete(usageSessions)..where((s) => s.id.equals(id))).go();
  Future<List<UsageSessionEntry>> getSessionsInRange(int startUtc, int endUtc) {
    return (select(usageSessions)
          ..where((s) => s.startTimeUtc.isBiggerOrEqualValue(startUtc) & s.endTimeUtc.isSmallerOrEqualValue(endUtc))
          ..orderBy([(s) => OrderingTerm.desc(s.startTimeUtc)]))
        .get();
  }

  Future<int> getTotalDurationSecondsInRange(int startUtc, int endUtc) async {
    final sessions = await getSessionsInRange(startUtc, endUtc);
    return sessions.fold<int>(0, (sum, s) => sum + s.durationSeconds);
  }

  // Categories
  Future<List<AppCategoryEntry>> getAllCategories() => select(appCategories).get();
  Stream<List<AppCategoryEntry>> watchAllCategories() => select(appCategories).watch();
  Future<int> insertCategory(AppCategoriesCompanion category) => into(appCategories).insert(category, mode: InsertMode.replace);
  Future<int> deleteCategory(String packageName) => (delete(appCategories)..where((c) => c.packageName.equals(packageName))).go();

  // Limits
  Future<List<UsageLimitEntry>> getAllLimits() => select(usageLimits).get();
  Stream<List<UsageLimitEntry>> watchAllLimits() => select(usageLimits).watch();
  Future<int> insertLimit(UsageLimitsCompanion limit) => into(usageLimits).insert(limit, mode: InsertMode.replace);
  Future<bool> updateLimit(UsageLimitEntry limit) => update(usageLimits).replace(limit);
  Future<int> deleteLimit(String id) => (delete(usageLimits)..where((l) => l.id.equals(id))).go();
}
