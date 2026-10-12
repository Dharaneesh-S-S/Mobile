// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'document_dao.dart';

// ignore_for_file: type=lint
mixin _$DocumentDaoMixin on DatabaseAccessor<AppDatabase> {
  $DocumentItemsTable get documentItems => attachedDatabase.documentItems;
  $DocumentPagesTable get documentPages => attachedDatabase.documentPages;
  DocumentDaoManager get managers => DocumentDaoManager(this);
}

class DocumentDaoManager {
  final _$DocumentDaoMixin _db;
  DocumentDaoManager(this._db);
  $$DocumentItemsTableTableManager get documentItems =>
      $$DocumentItemsTableTableManager(_db.attachedDatabase, _db.documentItems);
  $$DocumentPagesTableTableManager get documentPages =>
      $$DocumentPagesTableTableManager(_db.attachedDatabase, _db.documentPages);
}
