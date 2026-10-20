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
  fourDay,
  year,
  day,
  agenda
}

// View & Filter Options (Section 3 & 7)
final showWeekendsProvider = StateProvider<bool>((ref) => true);
final dimPastEventsProvider = StateProvider<bool>((ref) => true);
final showWeekNumbersProvider = StateProvider<bool>((ref) => false);
final showCompletedTasksProvider = StateProvider<bool>((ref) => true);
final visibleCalendarsProvider = StateProvider<Set<String>>((ref) => {
  'events',
  'tasks',
  'birthdays',
  'holidays',
  'transactions',
});
final calendarSearchQueryProvider = StateProvider<String>((ref) => '');
final calendarTypeFilterProvider = StateProvider<CalendarItemType?>((ref) => null);

// Navigation Helpers (Section 1)
void goToToday(WidgetRef ref) {
  ref.read(selectedDateProvider.notifier).state = DateTime.now();
}

void navigateNext(WidgetRef ref) {
  final current = ref.read(selectedDateProvider);
  final view = ref.read(currentViewProvider);
  switch (view) {
    case CalendarViewType.day:
      ref.read(selectedDateProvider.notifier).state = current.add(const Duration(days: 1));
      break;
    case CalendarViewType.fourDay:
      ref.read(selectedDateProvider.notifier).state = current.add(const Duration(days: 4));
      break;
    case CalendarViewType.week:
      ref.read(selectedDateProvider.notifier).state = current.add(const Duration(days: 7));
      break;
    case CalendarViewType.month:
      final nextMonth = DateTime(current.year, current.month + 1, current.day);
      ref.read(selectedDateProvider.notifier).state = nextMonth;
      break;
    case CalendarViewType.year:
      ref.read(selectedDateProvider.notifier).state = DateTime(current.year + 1, current.month, current.day);
      break;
    case CalendarViewType.agenda:
      ref.read(selectedDateProvider.notifier).state = current.add(const Duration(days: 14));
      break;
  }
}

void navigatePrev(WidgetRef ref) {
  final current = ref.read(selectedDateProvider);
  final view = ref.read(currentViewProvider);
  switch (view) {
    case CalendarViewType.day:
      ref.read(selectedDateProvider.notifier).state = current.subtract(const Duration(days: 1));
      break;
    case CalendarViewType.fourDay:
      ref.read(selectedDateProvider.notifier).state = current.subtract(const Duration(days: 4));
      break;
    case CalendarViewType.week:
      ref.read(selectedDateProvider.notifier).state = current.subtract(const Duration(days: 7));
      break;
    case CalendarViewType.month:
      final prevMonth = DateTime(current.year, current.month - 1, current.day);
      ref.read(selectedDateProvider.notifier).state = prevMonth;
      break;
    case CalendarViewType.year:
      ref.read(selectedDateProvider.notifier).state = DateTime(current.year - 1, current.month, current.day);
      break;
    case CalendarViewType.agenda:
      ref.read(selectedDateProvider.notifier).state = current.subtract(const Duration(days: 14));
      break;
  }
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
  final visibleCals = ref.watch(visibleCalendarsProvider);
  final showCompleted = ref.watch(showCompletedTasksProvider);
  final searchQuery = ref.watch(calendarSearchQueryProvider).trim().toLowerCase();
  final typeFilter = ref.watch(calendarTypeFilterProvider);
  
  final Map<String, TaskListEntry> taskListsMap = {
    for (var list in taskLists) list.id: list
  };

  final List<CalendarDisplayItem> items = [];
  
  // 1. Events (Personal, Out of Office, Focus Time, Working Location, Appointment Schedule, Birthday, Holiday)
  for (final e in events) {
    if (e.isCancelled) continue;
    CalendarItemType type = CalendarItemType.event;
    if (e.eventType == 'birthday') type = CalendarItemType.birthday;
    else if (e.eventType == 'holiday') type = CalendarItemType.holiday;
    else if (e.eventType == 'out_of_office') type = CalendarItemType.outOfOffice;
    else if (e.eventType == 'focus_time') type = CalendarItemType.focusTime;
    else if (e.eventType == 'working_location') type = CalendarItemType.workingLocation;
    else if (e.eventType == 'appointment_schedule') type = CalendarItemType.appointmentSchedule;

    // Check calendar category visibility
    if (type == CalendarItemType.birthday && !visibleCals.contains('birthdays')) continue;
    if (type == CalendarItemType.holiday && !visibleCals.contains('holidays')) continue;
    if ((type == CalendarItemType.event ||
         type == CalendarItemType.outOfOffice ||
         type == CalendarItemType.focusTime ||
         type == CalendarItemType.workingLocation ||
         type == CalendarItemType.appointmentSchedule) &&
        !visibleCals.contains('events')) {
      continue;
    }
    
    // Extract video URL if present in description (e.g. meet.chronos.io/...)
    String? videoUrl;
    if (e.description != null && e.description!.contains('meet.chronos.io/')) {
      final reg = RegExp(r'https?://meet\.chronos\.io/[a-zA-Z0-9_\-]+');
      final match = reg.firstMatch(e.description!);
      if (match != null) videoUrl = match.group(0);
    }
    
    Color eventColor = e.colorValue != null ? Color(e.colorValue!) : AppColors.accentCyan;
    if (type == CalendarItemType.outOfOffice) eventColor = Colors.purple;
    if (type == CalendarItemType.focusTime) eventColor = Colors.indigo;
    if (type == CalendarItemType.workingLocation) eventColor = Colors.teal;
    if (type == CalendarItemType.appointmentSchedule) eventColor = Colors.pink;

    items.add(CalendarDisplayItem(
      id: 'evt_${e.id}',
      sourceId: e.id,
      type: type,
      title: e.title,
      description: e.description,
      startTime: DateTime.fromMillisecondsSinceEpoch(e.startTimeUtc, isUtc: true).toLocal(),
      endTime: DateTime.fromMillisecondsSinceEpoch(e.endTimeUtc, isUtc: true).toLocal(),
      isAllDay: e.isAllDay,
      color: eventColor,
      location: e.location,
      videoUrl: videoUrl,
      recurrenceRule: e.recurrenceRule,
    ));
  }
  
  // 2. Tasks
  if (visibleCals.contains('tasks')) {
    for (final t in tasks) {
      if (t.dueDateUtc == null) continue;
      if (!showCompleted && t.isCompleted) continue;
      
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
        endTime: t.hasTime 
            ? DateTime.fromMillisecondsSinceEpoch(t.dueDateUtc! + 3600000, isUtc: true).toLocal()
            : DateTime.fromMillisecondsSinceEpoch(t.dueDateUtc!, isUtc: true).toLocal(),
        isAllDay: !t.hasTime,
        color: listColor,
        isCompleted: t.isCompleted,
      ));
    }
  }
  
  // 3. Transactions
  if (visibleCals.contains('transactions')) {
    for (final tx in transactions) {
      String prefix = '';
      Color txColor = AppColors.accentCyan;
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
  }
  
  // Filter by query and type
  List<CalendarDisplayItem> filtered = items;
  if (typeFilter != null) {
    filtered = filtered.where((i) => i.type == typeFilter).toList();
  }
  if (searchQuery.isNotEmpty) {
    filtered = filtered.where((i) =>
      i.title.toLowerCase().contains(searchQuery) ||
      (i.description?.toLowerCase().contains(searchQuery) ?? false) ||
      (i.location?.toLowerCase().contains(searchQuery) ?? false)
    ).toList();
  }

  // Sort by start time
  filtered.sort((a, b) => a.startTime.compareTo(b.startTime));
  
  return filtered;
});
