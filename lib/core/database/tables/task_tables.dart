import 'package:drift/drift.dart';

/// Task lists / projects table
@DataClassName('TaskListEntry')
class TaskLists extends Table {
  TextColumn get id => text()();
  TextColumn get title => text().withLength(min: 1, max: 128)();
  IntColumn get colorValue => integer().withDefault(const Constant(0xFF10B981))();
  TextColumn get iconName => text().withDefault(const Constant('checklist'))();
  IntColumn get sortOrder => integer().withDefault(const Constant(0))();
  IntColumn get createdAtUtc => integer()();

  @override
  Set<Column> get primaryKey => {id};
}

/// Task items table
@DataClassName('TaskItemEntry')
@TableIndex(name: 'idx_task_due_date', columns: {#dueDateUtc})
@TableIndex(name: 'idx_task_completed', columns: {#isCompleted})
class TaskItems extends Table {
  TextColumn get id => text()();
  TextColumn get listId => text().nullable().references(TaskLists, #id, onDelete: KeyAction.setNull)();
  TextColumn get parentTaskId => text().nullable()(); // For subtasks
  TextColumn get title => text().withLength(min: 1, max: 256)();
  TextColumn get description => text().nullable()();
  IntColumn get dueDateUtc => integer().nullable()(); // UTC epoch milliseconds
  BoolColumn get hasTime => boolean().withDefault(const Constant(false))(); // false if Date-only
  BoolColumn get isCompleted => boolean().withDefault(const Constant(false))();
  IntColumn get priority => integer().withDefault(const Constant(1))(); // 0: None, 1: Low, 2: Medium, 3: High
  TextColumn get recurrenceRule => text().nullable()(); // Recurrence rule
  TextColumn get reminderOffsets => text().nullable()(); // JSON array of integers

  IntColumn get createdAtUtc => integer()();
  IntColumn get updatedAtUtc => integer()();

  @override
  Set<Column> get primaryKey => {id};
}
