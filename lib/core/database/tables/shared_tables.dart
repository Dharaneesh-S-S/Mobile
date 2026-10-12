import 'package:drift/drift.dart';

/// Shared tags across all modules (Calendar, Tasks, Notes, Documents, Money)
@DataClassName('TagEntry')
class Tags extends Table {
  TextColumn get id => text()();
  TextColumn get name => text().withLength(min: 1, max: 64)();
  IntColumn get colorValue => integer().withDefault(const Constant(0xFF4FD1C5))();
  IntColumn get createdAtUtc => integer()();

  @override
  Set<Column> get primaryKey => {id};
}

/// Entity cross-linking table.
/// Allows any module entity (Calendar Event, Task Item, Transaction, Note, Document)
/// to reference another entity without duplicating records.
@DataClassName('EntityCrossLink')
@TableIndex(name: 'idx_source_entity', columns: {#sourceType, #sourceId})
@TableIndex(name: 'idx_target_entity', columns: {#targetType, #targetId})
class EntityCrossLinks extends Table {
  TextColumn get id => text()();
  TextColumn get sourceType => text()(); // 'calendar', 'task', 'money', 'note', 'document'
  TextColumn get sourceId => text()();
  TextColumn get targetType => text()();
  TextColumn get targetId => text()();
  TextColumn get relationType => text().withDefault(const Constant('linked_to'))(); // 'linked_to', 'parent_of', 'payment_for'
  IntColumn get createdAtUtc => integer()();

  @override
  Set<Column> get primaryKey => {id};
}
