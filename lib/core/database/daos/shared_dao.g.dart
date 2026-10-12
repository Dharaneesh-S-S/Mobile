// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'shared_dao.dart';

// ignore_for_file: type=lint
mixin _$SharedDaoMixin on DatabaseAccessor<AppDatabase> {
  $TagsTable get tags => attachedDatabase.tags;
  $EntityCrossLinksTable get entityCrossLinks =>
      attachedDatabase.entityCrossLinks;
  SharedDaoManager get managers => SharedDaoManager(this);
}

class SharedDaoManager {
  final _$SharedDaoMixin _db;
  SharedDaoManager(this._db);
  $$TagsTableTableManager get tags =>
      $$TagsTableTableManager(_db.attachedDatabase, _db.tags);
  $$EntityCrossLinksTableTableManager get entityCrossLinks =>
      $$EntityCrossLinksTableTableManager(
        _db.attachedDatabase,
        _db.entityCrossLinks,
      );
}
