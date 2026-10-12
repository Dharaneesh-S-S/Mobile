import 'package:drift/drift.dart';

/// Labels for grouping notes
@DataClassName('NoteLabelEntry')
class NoteLabels extends Table {
  TextColumn get id => text()();
  TextColumn get name => text().withLength(min: 1, max: 64)();
  IntColumn get createdAtUtc => integer()();

  @override
  Set<Column> get primaryKey => {id};
}

/// Note items table
@DataClassName('NoteItemEntry')
@TableIndex(name: 'idx_note_pinned', columns: {#isPinned})
@TableIndex(name: 'idx_note_archived', columns: {#isArchived})
@TableIndex(name: 'idx_note_deleted', columns: {#isDeleted})
class NoteItems extends Table {
  TextColumn get id => text()();
  TextColumn get title => text().withLength(max: 256).nullable()();
  TextColumn get content => text().nullable()(); // WYSIWYG JSON or plaintext
  TextColumn get type => text().withLength(min: 1, max: 32).withDefault(const Constant('text'))(); // 'text' or 'checklist'
  IntColumn get colorValue => integer().nullable()(); // null means default background
  BoolColumn get isPinned => boolean().withDefault(const Constant(false))();
  BoolColumn get isArchived => boolean().withDefault(const Constant(false))();
  BoolColumn get isDeleted => boolean().withDefault(const Constant(false))();
  IntColumn get createdAtUtc => integer()();
  IntColumn get updatedAtUtc => integer()();

  @override
  Set<Column> get primaryKey => {id};
}

/// Cross-reference table for Note <-> Label Many-to-Many relationship
@DataClassName('NoteLabelCrossRefEntry')
class NoteLabelCrossRef extends Table {
  TextColumn get noteId => text().references(NoteItems, #id, onDelete: KeyAction.cascade)();
  TextColumn get labelId => text().references(NoteLabels, #id, onDelete: KeyAction.cascade)();
  
  @override
  Set<Column> get primaryKey => {noteId, labelId};
}

/// Checklist items
@DataClassName('ChecklistItemEntry')
class ChecklistItems extends Table {
  TextColumn get id => text()();
  TextColumn get noteId => text().references(NoteItems, #id, onDelete: KeyAction.cascade)();
  TextColumn get itemText => text()();
  BoolColumn get isChecked => boolean().withDefault(const Constant(false))();
  IntColumn get sortOrder => integer().withDefault(const Constant(0))();
  
  @override
  Set<Column> get primaryKey => {id};
}
