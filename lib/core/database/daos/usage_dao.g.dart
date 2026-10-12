// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'usage_dao.dart';

// ignore_for_file: type=lint
mixin _$UsageDaoMixin on DatabaseAccessor<AppDatabase> {
  $UsageSessionsTable get usageSessions => attachedDatabase.usageSessions;
  $AppCategoriesTable get appCategories => attachedDatabase.appCategories;
  $UsageLimitsTable get usageLimits => attachedDatabase.usageLimits;
  UsageDaoManager get managers => UsageDaoManager(this);
}

class UsageDaoManager {
  final _$UsageDaoMixin _db;
  UsageDaoManager(this._db);
  $$UsageSessionsTableTableManager get usageSessions =>
      $$UsageSessionsTableTableManager(_db.attachedDatabase, _db.usageSessions);
  $$AppCategoriesTableTableManager get appCategories =>
      $$AppCategoriesTableTableManager(_db.attachedDatabase, _db.appCategories);
  $$UsageLimitsTableTableManager get usageLimits =>
      $$UsageLimitsTableTableManager(_db.attachedDatabase, _db.usageLimits);
}
