// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'task_dao.dart';

// ignore_for_file: type=lint
mixin _$TaskDaoMixin on DatabaseAccessor<AppDatabase> {
  $TaskListsTable get taskLists => attachedDatabase.taskLists;
  $TaskItemsTable get taskItems => attachedDatabase.taskItems;
  TaskDaoManager get managers => TaskDaoManager(this);
}

class TaskDaoManager {
  final _$TaskDaoMixin _db;
  TaskDaoManager(this._db);
  $$TaskListsTableTableManager get taskLists =>
      $$TaskListsTableTableManager(_db.attachedDatabase, _db.taskLists);
  $$TaskItemsTableTableManager get taskItems =>
      $$TaskItemsTableTableManager(_db.attachedDatabase, _db.taskItems);
}
