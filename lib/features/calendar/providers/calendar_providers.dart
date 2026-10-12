import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/core_providers.dart';
import '../domain/models/calendar_display_item.dart';
import '../../../core/database/app_database.dart';
import '../../../core/theme/app_colors.dart';

final selectedDateProvider = StateProvider<DateTime>((ref) => DateTime.now());

final currentViewProvider = StateProvider<CalendarViewType>((ref) => CalendarViewType.month);

enum CalendarViewType {
  month,
  week,
  day,
  agenda
}

final eventsStreamProvider = StreamProvider((ref) => ref.watch(databaseProvider).calendarDao.watchAllEvents());
final tasksStreamProvider = StreamProvider((ref) => ref.watch(databaseProvider).taskDao.watchAllTasks());
final taskListsStreamProvider = StreamProvider((ref) => ref.watch(databaseProvider).taskDao.watchAllLists());
final transactionsStreamProvider = StreamProvider((ref) => ref.watch(databaseProvider).moneyDao.watchAllTransactions());

final calendarItemsProvider = Provider<List<CalendarDisplayItem>>((ref) {
  final events = ref.watch(eventsStreamProvider).valueOrNull ?? [];
  final tasks = ref.watch(tasksStreamProvider).valueOrNull ?? [];
  final taskLists = ref.watch(taskListsStreamProvider).valueOrNull ?? [];
  final transactions = ref.watch(transactionsStreamProvider).valueOrNull ?? [];
  
  final Map<String, TaskListEntry> taskListsMap = {
    for (var list in taskLists) list.id: list
  };

  final List<CalendarDisplayItem> items = [];
  
  for (final e in events) {
    if (e.isCancelled) continue;
    CalendarItemType type = CalendarItemType.event;
    if (e.eventType == 'birthday') type = CalendarItemType.birthday;
    if (e.eventType == 'holiday') type = CalendarItemType.holiday;
    
    items.add(CalendarDisplayItem(
      id: 'evt_${e.id}',
      sourceId: e.id,
      type: type,
      title: e.title,
      description: e.description,
      startTime: DateTime.fromMillisecondsSinceEpoch(e.startTimeUtc, isUtc: true).toLocal(),
      endTime: DateTime.fromMillisecondsSinceEpoch(e.endTimeUtc, isUtc: true).toLocal(),
      isAllDay: e.isAllDay,
      color: e.colorValue != null ? Color(e.colorValue!) : AppColors.accentCyan,
      location: e.location,
    ));
  }
  
  for (final t in tasks) {
    if (t.dueDateUtc == null) continue;
    // Don't show subtasks as independent calendar events unless they have their own due date? 
    // The requirement says "Subtasks must remain associated with their parent task and must not become duplicate Calendar events unless explicitly supported by the user's due-date settings."
    // Assuming any task (including subtask) with a dueDateUtc gets on the calendar. If users don't want it, they won't set a due date on the subtask.
    
    final listColor = (t.listId != null && taskListsMap.containsKey(t.listId))
        ? Color(taskListsMap[t.listId!]!.colorValue)
        : AppColors.accentEmerald;

    items.add(CalendarDisplayItem(
      id: 'tsk_${t.id}',
      sourceId: t.id,
      type: CalendarItemType.task,
      title: t.title,
      description: t.description,
      startTime: DateTime.fromMillisecondsSinceEpoch(t.dueDateUtc!, isUtc: true).toLocal(),
      // Use hasTime to determine if it's all day
      endTime: t.hasTime 
          ? DateTime.fromMillisecondsSinceEpoch(t.dueDateUtc! + 3600000, isUtc: true).toLocal() // +1 hr default if has time
          : DateTime.fromMillisecondsSinceEpoch(t.dueDateUtc!, isUtc: true).toLocal(), // same as start if all day
      isAllDay: !t.hasTime,
      color: listColor,
      isCompleted: t.isCompleted,
    ));
  }
  
  for (final tx in transactions) {
    String prefix = '';
    Color txColor = AppColors.accentCyan; // income
    if (tx.type == 'expense') {
      prefix = '-';
      txColor = AppColors.lightError;
    } else if (tx.type == 'transfer') {
      prefix = '↔';
      txColor = Colors.grey;
    } else {
      prefix = '+';
    }

    items.add(CalendarDisplayItem(
      id: 'tx_${tx.id}',
      sourceId: tx.id,
      type: CalendarItemType.transaction,
      title: '$prefix ${(tx.amountPaise / 100).toStringAsFixed(2)}',
      description: tx.note,
      startTime: DateTime.fromMillisecondsSinceEpoch(tx.transactionTimeUtc, isUtc: true).toLocal(),
      endTime: DateTime.fromMillisecondsSinceEpoch(tx.transactionTimeUtc + 1800000, isUtc: true).toLocal(),
      isAllDay: false,
      color: txColor,
    ));
  }
  
  // Sort by start time
  items.sort((a, b) => a.startTime.compareTo(b.startTime));
  
  return items;
});
