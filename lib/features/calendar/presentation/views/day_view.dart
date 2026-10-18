import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../providers/calendar_providers.dart';
import '../../domain/models/calendar_display_item.dart';
import '../../../../core/theme/app_colors.dart';
import '../calendar_item_handler.dart';

class DayView extends ConsumerStatefulWidget {
  const DayView({super.key});

  @override
  ConsumerState<DayView> createState() => _DayViewState();
}

class _DayViewState extends ConsumerState<DayView> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      // scroll to current hour
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
    
    // Filter items for selected date
    final dayItems = items.where((i) => 
        i.startTime.year == selectedDate.year &&
        i.startTime.month == selectedDate.month &&
        i.startTime.day == selectedDate.day
    ).toList();
    
    final allDayItems = dayItems.where((i) => i.isAllDay).toList();
    final timeItems = dayItems.where((i) => !i.isAllDay).toList();

    return Column(
      children: [
        _buildHeader(selectedDate),
        if (allDayItems.isNotEmpty) _buildAllDaySection(allDayItems),
        Expanded(
          child: _buildTimeGrid(timeItems),
        ),
      ],
    );
  }

  Widget _buildHeader(DateTime date) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Text(
        DateFormat('EEEE, MMM d').format(date),
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildAllDaySection(List<CalendarDisplayItem> items) {
    final theme = Theme.of(context);
    return Container(
      color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.5),
      width: double.infinity,
      padding: const EdgeInsets.all(8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: items.map((item) => GestureDetector(
          onTap: () => openCalendarItem(context, ref, item),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 2.0),
            child: Row(
              children: [
                Container(width: 8, height: 8, decoration: BoxDecoration(color: item.color, shape: BoxShape.circle)),
                const SizedBox(width: 8),
                Expanded(child: Text(item.title, style: const TextStyle(fontWeight: FontWeight.w600))),
              ],
            ),
          ),
        )).toList(),
      ),
    );
  }

  Widget _buildTimeGrid(List<CalendarDisplayItem> items) {
    final hourHeight = 60.0;
    
    return SingleChildScrollView(
      controller: _scrollController,
      child: SizedBox(
        height: 24 * hourHeight,
        child: Stack(
          children: [
            // Background grid
            for (int i = 0; i < 24; i++)
              Positioned(
                top: i * hourHeight,
                left: 0,
                right: 0,
                child: Row(
                  children: [
                    SizedBox(
                      width: 60,
                      child: Text(
                        i == 0 ? '12 AM' : (i < 12 ? '$i AM' : (i == 12 ? '12 PM' : '${i - 12} PM')),
                        textAlign: TextAlign.end,
                        style: const TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Divider(color: AppColors.lightBorder.withOpacity(0.5)),
                    ),
                  ],
                ),
              ),
              
            // Current time indicator
            if (ref.watch(selectedDateProvider).day == DateTime.now().day)
              Positioned(
                top: (DateTime.now().hour + DateTime.now().minute / 60) * hourHeight,
                left: 60,
                right: 0,
                child: Row(
                  children: [
                    Container(width: 8, height: 8, decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle)),
                    Expanded(child: Container(height: 2, color: Colors.red)),
                  ],
                ),
              ),
              
            // Events
            for (final item in items)
              Positioned(
                top: (item.startTime.hour + item.startTime.minute / 60) * hourHeight,
                left: 70,
                right: 10,
                height: ((item.endTime.difference(item.startTime).inMinutes) / 60) * hourHeight,
                child: GestureDetector(
                  onTap: () => openCalendarItem(context, ref, item),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                    decoration: BoxDecoration(
                      color: item.color.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      item.title,
                      style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
