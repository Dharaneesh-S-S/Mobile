import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/task_tables.dart';

part 'task_dao.g.dart';

@DriftAccessor(tables: [TaskLists, TaskItems])
class TaskDao extends DatabaseAccessor<AppDatabase> with _$TaskDaoMixin {
  TaskDao(super.db);

  // Lists
  Future<List<TaskListEntry>> getAllLists() => select(taskLists).get();

  Stream<List<TaskListEntry>> watchAllLists() => select(taskLists).watch();

  Future<int> insertList(TaskListsCompanion list) => into(taskLists).insert(list);
  
  Future<bool> updateList(TaskListEntry list) => update(taskLists).replace(list);

  Future<int> deleteList(String id) => (delete(taskLists)..where((l) => l.id.equals(id))).go();

  // Tasks
  Future<List<TaskItemEntry>> getAllTasks() =>
      (select(taskItems)..orderBy([(t) => OrderingTerm.asc(t.dueDateUtc)])).get();

  Stream<List<TaskItemEntry>> watchAllTasks() =>
      (select(taskItems)..orderBy([(t) => OrderingTerm.asc(t.dueDateUtc)])).watch();

  Future<List<TaskItemEntry>> getTasksByList(String listId) =>
      (select(taskItems)..where((t) => t.listId.equals(listId))).get();

  Future<int> insertTask(TaskItemsCompanion task) => into(taskItems).insert(task);

  Future<bool> updateTask(TaskItemEntry task) => update(taskItems).replace(task);

  Future<void> toggleTaskCompletion(String taskId, bool isCompleted, int updatedAtUtc) async {
    await (update(taskItems)..where((t) => t.id.equals(taskId))).write(
      TaskItemsCompanion(
        isCompleted: Value(isCompleted),
        updatedAtUtc: Value(updatedAtUtc),
      ),
    );
  }

  Future<int> deleteTask(String id) => (delete(taskItems)..where((t) => t.id.equals(id))).go();
}
