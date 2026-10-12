import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/notifications/notification_service.dart';

final taskListsStreamProvider = StreamProvider((ref) {
  return ref.watch(databaseProvider).taskDao.watchAllLists();
});

final allTasksStreamProvider = StreamProvider((ref) {
  return ref.watch(databaseProvider).taskDao.watchAllTasks();
});

final selectedListIdProvider = StateProvider<String?>((ref) => null);

// View model for task tree (grouping subtasks)
class TaskNode {
  final TaskItemEntry task;
  final List<TaskNode> subtasks;
  TaskNode({required this.task, required this.subtasks});
}

final tasksTreeProvider = Provider<List<TaskNode>>((ref) {
  final allTasks = ref.watch(allTasksStreamProvider).valueOrNull ?? [];
  final selectedListId = ref.watch(selectedListIdProvider);

  // Filter out subtasks from root level
  List<TaskItemEntry> rootTasks = allTasks.where((t) => t.parentTaskId == null).toList();
  
  if (selectedListId != null && selectedListId != 'completed' && selectedListId != 'all') {
    rootTasks = rootTasks.where((t) => t.listId == selectedListId).toList();
  }

  if (selectedListId == 'completed') {
    rootTasks = rootTasks.where((t) => t.isCompleted).toList();
  } else {
    rootTasks = rootTasks.where((t) => !t.isCompleted).toList();
  }

  // Build tree
  TaskNode buildNode(TaskItemEntry task) {
    final subtasks = allTasks.where((t) => t.parentTaskId == task.id).map((t) => buildNode(t)).toList();
    return TaskNode(task: task, subtasks: subtasks);
  }

  return rootTasks.map((t) => buildNode(t)).toList();
});

final taskServiceProvider = Provider((ref) => TaskService(ref));

class TaskService {
  final Ref _ref;
  final _uuid = const Uuid();

  TaskService(this._ref);
  
  AppDatabase get _db => _ref.read(databaseProvider);

  Future<void> createList(String title, int colorValue) async {
    final list = TaskListsCompanion(
      id: Value(_uuid.v4()),
      title: Value(title),
      colorValue: Value(colorValue),
      createdAtUtc: Value(DateTime.now().toUtc().millisecondsSinceEpoch),
      sortOrder: Value(0),
    );
    await _db.taskDao.insertList(list);
  }

  Future<void> updateList(TaskListEntry list) async {
    await _db.taskDao.updateList(list);
  }

  Future<void> deleteList(String listId, {String? moveToAnotherListId}) async {
    if (moveToAnotherListId != null) {
      final tasks = await _db.taskDao.getTasksByList(listId);
      for (var t in tasks) {
        await _db.taskDao.updateTask(t.copyWith(listId: Value(moveToAnotherListId)));
      }
    } else {
      final tasks = await _db.taskDao.getTasksByList(listId);
      for (var t in tasks) {
        await _db.taskDao.deleteTask(t.id);
      }
    }
    await _db.taskDao.deleteList(listId);
  }

  Future<void> createTask({
    required String title,
    String? description,
    String? listId,
    String? parentTaskId,
    DateTime? dueDate,
    bool hasTime = false,
    String? recurrenceRule,
    String? reminderOffsets,
  }) async {
    final task = TaskItemsCompanion(
      id: Value(_uuid.v4()),
      title: Value(title),
      description: Value(description),
      listId: Value(listId),
      parentTaskId: Value(parentTaskId),
      dueDateUtc: Value(dueDate?.toUtc().millisecondsSinceEpoch),
      hasTime: Value(hasTime),
      isCompleted: const Value(false),
      recurrenceRule: Value(recurrenceRule),
      reminderOffsets: Value(reminderOffsets),
      createdAtUtc: Value(DateTime.now().toUtc().millisecondsSinceEpoch),
      updatedAtUtc: Value(DateTime.now().toUtc().millisecondsSinceEpoch),
    );
    await _db.taskDao.insertTask(task);
    
    // Attempt to schedule notification
    final inserted = (await _db.taskDao.watchAllTasks().first).firstWhere((t) => t.id == task.id.value);
    _scheduleTaskNotification(inserted);
  }

  Future<void> updateTask(TaskItemEntry task) async {
    final updated = task.copyWith(
      updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch
    );
    await _db.taskDao.updateTask(updated);
    _scheduleTaskNotification(updated);
  }

  Future<void> toggleTaskCompletion(String taskId, bool isCompleted) async {
    final task = (await _db.taskDao.watchAllTasks().first).firstWhere((t) => t.id == taskId);
    
    final now = DateTime.now().toUtc().millisecondsSinceEpoch;
    
    if (isCompleted && task.recurrenceRule != null && task.recurrenceRule!.isNotEmpty) {
       await _generateNextRecurringInstance(task);
       
       await (_db.update(_db.taskItems)..where((t) => t.id.equals(taskId)))
          .write(TaskItemsCompanion(
            isCompleted: Value(isCompleted),
            updatedAtUtc: Value(now),
            recurrenceRule: const Value(null),
          ));
    } else {
       await _db.taskDao.toggleTaskCompletion(taskId, isCompleted, now);
    }
    
    // Update notification
    final updatedTask = task.copyWith(isCompleted: isCompleted);
    _scheduleTaskNotification(updatedTask);
  }
  
  Future<void> _scheduleTaskNotification(TaskItemEntry task) async {
    try {
      final id = task.id.hashCode;
      
      // Cancel existing
      await NotificationService.instance.cancelNotification(id);
      
      // If completed or no due date, don't schedule
      if (task.isCompleted || task.dueDateUtc == null) return;
      
      // Assume notification at exact due time for simplicity, or 9 AM if no time
      int notifyTime = task.dueDateUtc!;
      if (!task.hasTime) {
        final date = DateTime.fromMillisecondsSinceEpoch(task.dueDateUtc!, isUtc: true).toLocal();
        notifyTime = DateTime(date.year, date.month, date.day, 9, 0).toUtc().millisecondsSinceEpoch;
      }
      
      // Don't schedule past notifications
      if (notifyTime > DateTime.now().toUtc().millisecondsSinceEpoch) {
        await NotificationService.instance.scheduleNotification(
          id: id,
          title: 'Task Reminder',
          body: task.title,
          scheduledUtcMillis: notifyTime,
        );
      }
    } catch (e) {
      // Ignore notification errors in tests
    }
  }
  
  Future<void> _generateNextRecurringInstance(TaskItemEntry task) async {
      // Basic implementation of generating next instance.
      // E.g., rule format: "FREQ=DAILY;INTERVAL=1"
      if (task.dueDateUtc == null) return;
      
      final rule = task.recurrenceRule!.toUpperCase();
      DateTime nextDate = DateTime.fromMillisecondsSinceEpoch(task.dueDateUtc!, isUtc: true);
      
      if (rule.contains('FREQ=DAILY')) {
        nextDate = nextDate.add(const Duration(days: 1));
      } else if (rule.contains('FREQ=WEEKLY')) {
        nextDate = nextDate.add(const Duration(days: 7));
      } else if (rule.contains('FREQ=MONTHLY')) {
        nextDate = DateTime.utc(nextDate.year, nextDate.month + 1, nextDate.day, nextDate.hour, nextDate.minute);
      } else if (rule.contains('FREQ=YEARLY')) {
        nextDate = DateTime.utc(nextDate.year + 1, nextDate.month, nextDate.day, nextDate.hour, nextDate.minute);
      } else {
        return; // Unsupported
      }
      
      // Clone task for next occurrence
      final newTask = TaskItemsCompanion(
        id: Value(_uuid.v4()),
        title: Value(task.title),
        description: Value(task.description),
        listId: Value(task.listId),
        parentTaskId: Value(task.parentTaskId),
        dueDateUtc: Value(nextDate.millisecondsSinceEpoch),
        hasTime: Value(task.hasTime),
        isCompleted: const Value(false),
        recurrenceRule: Value(task.recurrenceRule), // Keep recurrence for the new one
        reminderOffsets: Value(task.reminderOffsets),
        createdAtUtc: Value(DateTime.now().toUtc().millisecondsSinceEpoch),
        updatedAtUtc: Value(DateTime.now().toUtc().millisecondsSinceEpoch),
      );
      
      await _db.taskDao.insertTask(newTask);
      
      // Clear recurrence rule from the current completed task so it becomes just a completed instance
      await _db.taskDao.updateTask(task.copyWith(
        recurrenceRule: const Value(null)
      ));
  }

  Future<void> deleteTask(String taskId) async {
    await _db.taskDao.deleteTask(taskId);
    try {
      await NotificationService.instance.cancelNotification(taskId.hashCode);
    } catch (e) {
      // Ignore
    }
    // Delete subtasks as well
    final allTasks = await _db.taskDao.watchAllTasks().first;
    final subtasks = allTasks.where((t) => t.parentTaskId == taskId);
    for (var sub in subtasks) {
      await deleteTask(sub.id);
    }
  }
}
