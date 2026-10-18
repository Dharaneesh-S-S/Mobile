import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/core_providers.dart';
import '../domain/models/calendar_display_item.dart';
import 'event_editor_screen.dart';
import '../../tasks/presentation/pages/task_form_sheet.dart';
import '../../tasks/providers/tasks_providers.dart';
import '../../money/presentation/transaction_editor_screen.dart';

Future<void> openCalendarItem(BuildContext context, WidgetRef ref, CalendarDisplayItem item) async {
  if (item.type == CalendarItemType.task) {
    final tasks = await ref.read(allTasksStreamProvider.future);
    final task = tasks.where((t) => t.id == item.sourceId).firstOrNull;
    if (task != null && context.mounted) {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.transparent,
        builder: (context) => TaskFormSheet(task: task),
      );
    }
  } else if (item.type == CalendarItemType.event ||
      item.type == CalendarItemType.birthday ||
      item.type == CalendarItemType.holiday) {
    final event = await ref.read(databaseProvider).calendarDao.getEventById(item.sourceId);
    if (event != null && context.mounted) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => EventEditorScreen(existingEvent: event),
        ),
      );
    }
  } else if (item.type == CalendarItemType.transaction) {
    final allTxs = await ref.read(databaseProvider).moneyDao.getAllTransactions();
    final tx = allTxs.where((t) => t.id == item.sourceId).firstOrNull;
    if (tx != null && context.mounted) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => TransactionEditorScreen(existingTx: tx),
        ),
      );
    }
  }
}
