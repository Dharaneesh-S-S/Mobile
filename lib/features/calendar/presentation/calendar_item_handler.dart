import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/models/calendar_display_item.dart';
import 'event_details_sheet.dart';
import '../../money/presentation/transaction_editor_screen.dart';
import '../../../core/providers/core_providers.dart';

Future<void> openCalendarItem(BuildContext context, WidgetRef ref, CalendarDisplayItem item) async {
  if (item.type == CalendarItemType.transaction) {
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
    return;
  }

  // Show rich Google Calendar details sheet for events, tasks, outOfOffice, focusTime, workingLocation, appointmentSchedule
  if (context.mounted) {
    showModalBottomSheet(
      context: context,
      useRootNavigator: true,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => EventDetailsSheet(item: item),
    );
  }
}
