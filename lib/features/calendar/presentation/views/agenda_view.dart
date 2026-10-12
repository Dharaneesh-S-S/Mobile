import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../providers/calendar_providers.dart';
import '../../domain/models/calendar_display_item.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../tasks/presentation/pages/task_form_sheet.dart';
import '../../../tasks/providers/tasks_providers.dart';

class AgendaView extends ConsumerWidget {
  const AgendaView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(calendarItemsProvider);
    final now = DateTime.now();
    
    // Filter to future items for agenda
    final futureItems = items.where((i) => i.startTime.isAfter(now.subtract(const Duration(days: 1)))).toList();
    
    if (futureItems.isEmpty) {
      return const Center(child: Text("No upcoming events."));
    }

    return ListView.builder(
      padding: const EdgeInsets.all(8),
      itemCount: futureItems.length,
      itemBuilder: (context, index) {
        final item = futureItems[index];
        final isFirstOfDay = index == 0 || 
            futureItems[index - 1].startTime.day != item.startTime.day ||
            futureItems[index - 1].startTime.month != item.startTime.month;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (isFirstOfDay)
              Padding(
                padding: const EdgeInsets.only(top: 16.0, bottom: 8.0, left: 8.0),
                child: Text(
                  DateFormat('EEEE, MMM d').format(item.startTime),
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.accentCyan),
                ),
              ),
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8), side: BorderSide(color: AppColors.lightBorder)),
              margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              child: ListTile(
                leading: Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(color: item.color, shape: BoxShape.circle),
                ),
                title: Text(item.title, style: const TextStyle(fontWeight: FontWeight.w600)),
                subtitle: Text(
                  item.isAllDay 
                      ? 'All Day' 
                      : '${DateFormat('jm').format(item.startTime)} - ${DateFormat('jm').format(item.endTime)}',
                ),
                trailing: _getIconForType(item.type),
                onTap: () async {
                  if (item.type == CalendarItemType.task) {
                    final tasks = await ref.read(allTasksStreamProvider.future);
                    final task = tasks.firstWhere((t) => t.id == item.sourceId);
                    showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (context) => TaskFormSheet(task: task),
                    );
                  }
                },
              ),
            ),
          ],
        );
      },
    );
  }
  
  Widget _getIconForType(CalendarItemType type) {
    switch (type) {
      case CalendarItemType.birthday:
        return const Icon(Icons.cake, color: Colors.orange, size: 20);
      case CalendarItemType.holiday:
        return const Icon(Icons.flag, color: Colors.green, size: 20);
      case CalendarItemType.task:
        return const Icon(Icons.check_circle_outline, color: AppColors.accentEmerald, size: 20);
      case CalendarItemType.transaction:
        return const Icon(Icons.attach_money, color: Colors.blueGrey, size: 20);
      case CalendarItemType.event:
      default:
        return const SizedBox.shrink();
    }
  }
}
