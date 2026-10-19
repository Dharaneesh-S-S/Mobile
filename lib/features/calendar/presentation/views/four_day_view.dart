import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/calendar_providers.dart';
import '../../domain/models/calendar_display_item.dart';
import '../../../../core/theme/app_colors.dart';
import '../calendar_item_handler.dart';

class FourDayView extends ConsumerStatefulWidget {
  const FourDayView({super.key});

  @override
  ConsumerState<FourDayView> createState() => _FourDayViewState();
}

class _FourDayViewState extends ConsumerState<FourDayView> {
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

    final fourDates = List.generate(4, (index) => selectedDate.add(Duration(days: index)));

    return Column(
      children: [
        _buildHeader(fourDates),
        Expanded(
          child: _buildTimeGrid(fourDates, items),
        ),
      ],
    );
  }

  Widget _buildHeader(List<DateTime> fourDates) {
    final days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Padding(
      padding: const EdgeInsets.only(left: 40.0, top: 8.0, bottom: 8.0),
      child: Row(
        children: List.generate(4, (index) {
          final date = fourDates[index];
          final isToday = date.day == DateTime.now().day &&
              date.month == DateTime.now().month &&
              date.year == DateTime.now().year;
          final dayName = days[date.weekday % 7];

          return Expanded(
            child: Column(
              children: [
                Text(dayName, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: isToday ? AppColors.accentCyan : Colors.transparent,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    '${date.day}',
                    style: TextStyle(
                      color: isToday ? Colors.white : Theme.of(context).colorScheme.onSurface,
                      fontWeight: isToday ? FontWeight.bold : FontWeight.w600,
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

  Widget _buildTimeGrid(List<DateTime> fourDates, List<CalendarDisplayItem> items) {
    const hourHeight = 60.0;

    return SingleChildScrollView(
      controller: _scrollController,
      child: SizedBox(
        height: 24 * hourHeight,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Time Labels Column
            SizedBox(
              width: 40,
              child: Stack(
                children: List.generate(24, (hour) {
                  return Positioned(
                    top: hour * hourHeight - 8,
                    left: 4,
                    child: Text(
                      '${hour.toString().padLeft(2, '0')}:00',
                      style: const TextStyle(fontSize: 10, color: Colors.grey),
                    ),
                  );
                }),
              ),
            ),

            // 4 Day Columns
            Expanded(
              child: Row(
                children: List.generate(4, (dayIndex) {
                  final date = fourDates[dayIndex];
                  final dayItems = items.where((i) =>
                      !i.isAllDay &&
                      i.startTime.year == date.year &&
                      i.startTime.month == date.month &&
                      i.startTime.day == date.day).toList();

                  final isToday = date.day == DateTime.now().day &&
                      date.month == DateTime.now().month &&
                      date.year == DateTime.now().year;

                  return Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        border: Border(
                          left: BorderSide(color: Colors.grey.withOpacity(0.15)),
                          right: dayIndex == 3
                              ? BorderSide(color: Colors.grey.withOpacity(0.15))
                              : BorderSide.none,
                        ),
                      ),
                      child: Stack(
                        children: [
                          // Hour lines
                          ...List.generate(24, (hour) {
                            return Positioned(
                              top: hour * hourHeight,
                              left: 0,
                              right: 0,
                              child: Divider(
                                height: 1,
                                color: Colors.grey.withOpacity(0.12),
                              ),
                            );
                          }),

                          // Red Current Time Line Indicator
                          if (isToday)
                            Positioned(
                              top: (DateTime.now().hour * 60 + DateTime.now().minute) *
                                  (hourHeight / 60.0),
                              left: 0,
                              right: 0,
                              child: Row(
                                children: [
                                  Container(
                                    width: 6,
                                    height: 6,
                                    decoration: const BoxDecoration(
                                      color: Colors.red,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  Expanded(
                                    child: Container(
                                      height: 1.5,
                                      color: Colors.red,
                                    ),
                                  ),
                                ],
                              ),
                            ),

                          // Event cards
                          ...dayItems.map((item) {
                            final startMinutes = item.startTime.hour * 60 + item.startTime.minute;
                            final endMinutes = item.endTime.hour * 60 + item.endTime.minute;
                            final duration = (endMinutes - startMinutes).clamp(20, 1440);

                            final top = startMinutes * (hourHeight / 60.0);
                            final height = duration * (hourHeight / 60.0);

                            return Positioned(
                              top: top,
                              left: 2,
                              right: 2,
                              height: height,
                              child: GestureDetector(
                                onTap: () => openCalendarItem(context, ref, item),
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    color: item.color.withOpacity(0.85),
                                    borderRadius: BorderRadius.circular(6),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.08),
                                        blurRadius: 2,
                                        offset: const Offset(0, 1),
                                      ),
                                    ],
                                  ),
                                  child: Text(
                                    item.title,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ),
                            );
                          }),
                        ],
                      ),
                    ),
                  );
                }),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
