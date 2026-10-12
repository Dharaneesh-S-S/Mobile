// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'note_dao.dart';

// ignore_for_file: type=lint
mixin _$NoteDaoMixin on DatabaseAccessor<AppDatabase> {
  $NoteLabelsTable get noteLabels => attachedDatabase.noteLabels;
  $NoteItemsTable get noteItems => attachedDatabase.noteItems;
  $NoteLabelCrossRefTable get noteLabelCrossRef =>
      attachedDatabase.noteLabelCrossRef;
  $ChecklistItemsTable get checklistItems => attachedDatabase.checklistItems;
  NoteDaoManager get managers => NoteDaoManager(this);
}

class NoteDaoManager {
  final _$NoteDaoMixin _db;
  NoteDaoManager(this._db);
  $$NoteLabelsTableTableManager get noteLabels =>
      $$NoteLabelsTableTableManager(_db.attachedDatabase, _db.noteLabels);
  $$NoteItemsTableTableManager get noteItems =>
      $$NoteItemsTableTableManager(_db.attachedDatabase, _db.noteItems);
  $$NoteLabelCrossRefTableTableManager get noteLabelCrossRef =>
      $$NoteLabelCrossRefTableTableManager(
        _db.attachedDatabase,
        _db.noteLabelCrossRef,
      );
  $$ChecklistItemsTableTableManager get checklistItems =>
      $$ChecklistItemsTableTableManager(
        _db.attachedDatabase,
        _db.checklistItems,
      );
}
