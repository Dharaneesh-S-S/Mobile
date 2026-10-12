import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/calendar_providers.dart';
import '../../domain/models/calendar_display_item.dart';
import '../../../../core/theme/app_colors.dart';

class WeekView extends ConsumerStatefulWidget {
  const WeekView({super.key});

  @override
  ConsumerState<WeekView> createState() => _WeekViewState();
}

class _WeekViewState extends ConsumerState<WeekView> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final currentHour = DateTime.now().hour;
      final offset = (currentHour * 60.0) - 100;
      if (_scrollController.hasClients && offset > 0) {
        _scrollController.jumpTo(offset);
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final selectedDate = ref.watch(selectedDateProvider);
    final items = ref.watch(calendarItemsProvider);
    
    // Find start of week (Sunday)
    int weekday = selectedDate.weekday;
    if (weekday == 7) weekday = 0;
    final startOfWeek = selectedDate.subtract(Duration(days: weekday));
    
    final weekDates = List.generate(7, (index) => startOfWeek.add(Duration(days: index)));

    return Column(
      children: [
        _buildHeader(weekDates),
        Expanded(
          child: _buildTimeGrid(weekDates, items),
        ),
      ],
    );
  }

  Widget _buildHeader(List<DateTime> weekDates) {
    final days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return Padding(
      padding: const EdgeInsets.only(left: 40.0, top: 8.0, bottom: 8.0),
      child: Row(
        children: List.generate(7, (index) {
          final date = weekDates[index];
          final isToday = date.day == DateTime.now().day && date.month == DateTime.now().month;
          return Expanded(
            child: Column(
              children: [
                Text(days[index], style: const TextStyle(fontSize: 12, color: Colors.grey)),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: isToday ? AppColors.accentCyan : Colors.transparent,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    '${date.day}',
                    style: TextStyle(
                      color: isToday ? Colors.white : AppColors.lightTextPrimary,
                      fontWeight: isToday ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                ),
              ],
            ),
          );
        }),
      ),
    );
  }

  Widget _buildTimeGrid(List<DateTime> weekDates, List<CalendarDisplayItem> items) {
    final hourHeight = 60.0;
    
    return SingleChildScrollView(
      controller: _scrollController,
      child: SizedBox(
        height: 24 * hourHeight,
        child: Stack(
          children: [
            // Background grid lines
            for (int i = 0; i < 24; i++)
              Positioned(
                top: i * hourHeight,
                left: 0,
                right: 0,
                child: Row(
                  children: [
                    SizedBox(
                      width: 40,
                      child: Text(
                        i == 0 ? '12 AM' : (i < 12 ? '$i' : (i == 12 ? '12 PM' : '${i - 12}')),
                        textAlign: TextAlign.end,
                        style: const TextStyle(color: Colors.grey, fontSize: 10),
                      ),
                    ),
                    const SizedBox(width: 4),
                    Expanded(child: Divider(color: AppColors.lightBorder.withOpacity(0.5))),
                  ],
                ),
              ),
              
            // Vertical day dividers
            Positioned.fill(
              left: 44,
              child: Row(
                children: List.generate(7, (index) => Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      border: Border(left: BorderSide(color: AppColors.lightBorder.withOpacity(0.3))),
                    ),
                  ),
                )),
              ),
            ),
            
            // Events
            Positioned.fill(
              left: 44,
              child: LayoutBuilder(
                builder: (context, constraints) {
                  final colWidth = constraints.maxWidth / 7;
                  return Stack(
                    children: [
                      for (final item in items)
                        ..._buildEventWidgets(item, weekDates, hourHeight, colWidth)
                    ],
                  );
                }
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildEventWidgets(CalendarDisplayItem item, List<DateTime> weekDates, double hourHeight, double colWidth) {
    List<Widget> widgets = [];
    if (item.isAllDay) return widgets; // Skip all day for now in week view to simplify

    for (int i = 0; i < 7; i++) {
      final date = weekDates[i];
      if (item.startTime.year == date.year && item.startTime.month == date.month && item.startTime.day == date.day) {
        widgets.add(
          Positioned(
            top: (item.startTime.hour + item.startTime.minute / 60) * hourHeight,
            left: i * colWidth,
            width: colWidth - 2,
            height: ((item.endTime.difference(item.startTime).inMinutes) / 60) * hourHeight,
            child: Container(
              margin: const EdgeInsets.only(left: 2),
              padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 1),
              decoration: BoxDecoration(
                color: item.color.withOpacity(0.8),
                borderRadius: BorderRadius.circular(2),
              ),
              child: Text(
                item.title,
                style: const TextStyle(color: Colors.white, fontSize: 8),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          )
        );
      }
    }
    return widgets;
  }
}
