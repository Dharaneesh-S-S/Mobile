import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:drift/native.dart';

import 'package:personal_hub/core/database/app_database.dart';
import 'package:personal_hub/features/tasks/providers/tasks_providers.dart' hide taskListsStreamProvider;
import 'package:personal_hub/features/calendar/providers/calendar_providers.dart';
import 'package:personal_hub/features/calendar/domain/models/calendar_display_item.dart';
import 'package:personal_hub/core/providers/core_providers.dart';

void main() {
  late AppDatabase db;
  late ProviderContainer container;

  setUp(() {
    db = AppDatabase(NativeDatabase.memory());
    container = ProviderContainer(
      overrides: [
        databaseProvider.overrideWithValue(db),
      ],
    );
  });

  tearDown(() async {
    await db.close();
    container.dispose();
  });

  test('Tasks CRUD, lists, subtasks, and calendar sync', () async {
    final service = container.read(taskServiceProvider);
    
    // 1. Create a list
    await service.createList('Work', 0xFF00FF00);
    var lists = await db.taskDao.getAllLists();
    expect(lists.length, 1);
    expect(lists.first.title, 'Work');
    final listId = lists.first.id;

    // 2. Create a task in the list with a due date
    final dueDate = DateTime.utc(2026, 10, 5, 10, 0);
    await service.createTask(
      title: 'Finish report',
      listId: listId,
      dueDate: dueDate,
      hasTime: true,
    );
    
    var tasks = await db.taskDao.getAllTasks();
    expect(tasks.length, 1);
    expect(tasks.first.title, 'Finish report');
    final taskId = tasks.first.id;

    // 3. Create a subtask
    await service.createTask(
      title: 'Read emails',
      parentTaskId: taskId,
    );
    
    tasks = await db.taskDao.getAllTasks();
    expect(tasks.length, 2);
    final subtask = tasks.firstWhere((t) => t.parentTaskId == taskId);
    expect(subtask.title, 'Read emails');

    // 4. Test completion and recurrence
    await service.createTask(
      title: 'Daily Standup',
      dueDate: dueDate,
      recurrenceRule: 'FREQ=DAILY;INTERVAL=1',
    );
    
    tasks = await db.taskDao.getAllTasks();
    final recurringTask = tasks.firstWhere((t) => t.title == 'Daily Standup');
    
    await service.toggleTaskCompletion(recurringTask.id, true);
    
    tasks = await db.taskDao.getAllTasks();
    // One completed instance, one new instance for tomorrow
    expect(tasks.length, 4); // report, emails, old recurring, new recurring
    
    final updatedOldRecurring = tasks.firstWhere((t) => t.id == recurringTask.id);
    expect(updatedOldRecurring.isCompleted, true);
    expect(updatedOldRecurring.recurrenceRule, null);
    
    final newRecurring = tasks.firstWhere((t) => t.id != recurringTask.id && t.title == 'Daily Standup');
    expect(newRecurring.isCompleted, false);
    expect(newRecurring.dueDateUtc, dueDate.add(const Duration(days: 1)).millisecondsSinceEpoch);

    // 5. Test Calendar sync
    // Listen to the provider so it computes
    final sub = container.listen(calendarItemsProvider, (_, __) {});
    
    // Wait for the stream providers to emit
    await container.read(tasksStreamProvider.future);
    await container.read(taskListsStreamProvider.future);
    
    // Wait for providers to update
    await Future.delayed(const Duration(milliseconds: 200));
    
    // Evaluate calendarItemsProvider
    final calendarItems = container.read(calendarItemsProvider);
    sub.close();
    // Should contain "Finish report" and the two "Daily Standup"s (since subtask has no due date)
    final taskItems = calendarItems.where((i) => i.type == CalendarItemType.task).toList();
    print('DEBUG: calendarItems total = ${calendarItems.length}, taskItems = ${taskItems.length}');
    for (var i in calendarItems) {
      print('DEBUG ITEM: ${i.title} - type: ${i.type}');
    }
    expect(taskItems.length, 3);
    
    final reportEvent = taskItems.firstWhere((t) => t.title == 'Finish report');
    expect(reportEvent.color.value, 0xFF00FF00); // Parent list color
    
    // 6. Test list deletion with moving tasks
    await service.createList('Personal', 0xFF0000FF);
    lists = await db.taskDao.getAllLists();
    final personalListId = lists.firstWhere((l) => l.title == 'Personal').id;
    
    await service.deleteList(listId, moveToAnotherListId: personalListId);
    lists = await db.taskDao.getAllLists();
    expect(lists.length, 1);
    
    tasks = await db.taskDao.getAllTasks();
    final reportTask = tasks.firstWhere((t) => t.id == taskId);
    expect(reportTask.listId, personalListId);
    
    // 7. Test task exists only once
    final rawTaskCount = await db.customSelect('SELECT COUNT(*) FROM task_items').getSingle();
    expect(rawTaskCount.data.values.first, 4);
    
    // 8. Test delete task deletes subtasks
    await service.deleteTask(taskId);
    tasks = await db.taskDao.getAllTasks();
    expect(tasks.length, 2); // only recurring tasks left
  });
}
