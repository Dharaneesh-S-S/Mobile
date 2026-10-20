import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart' as drift;
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/theme/app_colors.dart';
import '../domain/models/calendar_display_item.dart';
import 'event_editor_screen.dart';
import '../../tasks/presentation/pages/task_form_sheet.dart';
import '../../tasks/providers/tasks_providers.dart';

class EventDetailsSheet extends ConsumerStatefulWidget {
  final CalendarDisplayItem item;

  const EventDetailsSheet({super.key, required this.item});

  @override
  ConsumerState<EventDetailsSheet> createState() => _EventDetailsSheetState();
}

class _EventDetailsSheetState extends ConsumerState<EventDetailsSheet> {
  late String? _rsvpStatus;
  late Color _currentColor;

  @override
  void initState() {
    super.initState();
    _rsvpStatus = widget.item.rsvpStatus ?? 'yes';
    _currentColor = widget.item.color;
  }

  String _formatDateTimeRange(DateTime start, DateTime end, bool isAllDay) {
    final dateFormat = DateFormat('EEEE, MMMM d, yyyy');
    final timeFormat = DateFormat('h:mm a');

    if (isAllDay) {
      if (start.year == end.year && start.month == end.month && start.day == end.day) {
        return '${dateFormat.format(start)} • All day';
      }
      return '${DateFormat('MMM d').format(start)} - ${DateFormat('MMM d, yyyy').format(end)} • All day';
    }

    final isSameDay = start.year == end.year && start.month == end.month && start.day == end.day;
    if (isSameDay) {
      return '${dateFormat.format(start)}\n${timeFormat.format(start)} – ${timeFormat.format(end)}';
    }
    return '${DateFormat('MMM d, h:mm a').format(start)} – ${DateFormat('MMM d, h:mm a').format(end)}';
  }

  Future<void> _updateRsvp(String status) async {
    setState(() {
      _rsvpStatus = status;
    });

    if (widget.item.type == CalendarItemType.event ||
        widget.item.type == CalendarItemType.outOfOffice ||
        widget.item.type == CalendarItemType.focusTime ||
        widget.item.type == CalendarItemType.workingLocation ||
        widget.item.type == CalendarItemType.appointmentSchedule) {
      final db = ref.read(databaseProvider);
      final event = await db.calendarDao.getEventById(widget.item.sourceId);
      if (event != null) {
        String desc = event.description ?? '';
        final reg = RegExp(r'\[RSVP:\s*(yes|no|maybe)\]');
        if (reg.hasMatch(desc)) {
          desc = desc.replaceAll(reg, '[RSVP: $status]');
        } else {
          desc = desc.isEmpty ? '[RSVP: $status]' : '$desc\n[RSVP: $status]';
        }
        await db.calendarDao.updateEvent(event.copyWith(
          description: drift.Value(desc),
          updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        ));
      }
    }
  }

  Future<void> _duplicateItem() async {
    final db = ref.read(databaseProvider);
    if (widget.item.type == CalendarItemType.event ||
        widget.item.type == CalendarItemType.outOfOffice ||
        widget.item.type == CalendarItemType.focusTime ||
        widget.item.type == CalendarItemType.workingLocation ||
        widget.item.type == CalendarItemType.appointmentSchedule ||
        widget.item.type == CalendarItemType.birthday ||
        widget.item.type == CalendarItemType.holiday) {
      final event = await db.calendarDao.getEventById(widget.item.sourceId);
      if (event != null) {
        final newId = const Uuid().v4();
        await db.calendarDao.insertEvent(CalendarEventsCompanion(
          id: drift.Value(newId),
          title: drift.Value('${event.title} (Copy)'),
          description: drift.Value(event.description),
          startTimeUtc: drift.Value(event.startTimeUtc),
          endTimeUtc: drift.Value(event.endTimeUtc),
          isAllDay: drift.Value(event.isAllDay),
          recurrenceRule: drift.Value(event.recurrenceRule),
          location: drift.Value(event.location),
          colorValue: drift.Value(event.colorValue),
          eventType: drift.Value(event.eventType),
          reminderOffsets: drift.Value(event.reminderOffsets),
          createdAtUtc: drift.Value(DateTime.now().toUtc().millisecondsSinceEpoch),
          updatedAtUtc: drift.Value(DateTime.now().toUtc().millisecondsSinceEpoch),
        ));
        if (mounted) {
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Event duplicated')),
          );
        }
      }
    }
  }

  Future<void> _deleteItem() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Calendar Entry?'),
        content: Text('Are you sure you want to delete "${widget.item.title}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: AppColors.lightError),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      final db = ref.read(databaseProvider);
      if (widget.item.type == CalendarItemType.task) {
        await db.taskDao.deleteTask(widget.item.sourceId);
      } else {
        await db.calendarDao.deleteEvent(widget.item.sourceId);
      }
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Item deleted')),
        );
      }
    }
  }

  void _showColorPicker() {
    final colors = [
      AppColors.accentCyan,
      AppColors.accentViolet,
      AppColors.accentEmerald,
      AppColors.lightError,
      Colors.orange,
      Colors.pink,
      Colors.indigo,
      Colors.teal,
      Colors.amber,
      Colors.purple,
    ];

    showModalBottomSheet(
      context: context,
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Change Event Color', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 16),
              Wrap(
                spacing: 14,
                runSpacing: 14,
                children: colors.map((c) {
                  final isSelected = c.value == _currentColor.value;
                  return GestureDetector(
                    onTap: () async {
                      setState(() => _currentColor = c);
                      Navigator.pop(ctx);
                      final db = ref.read(databaseProvider);
                      final event = await db.calendarDao.getEventById(widget.item.sourceId);
                      if (event != null) {
                        await db.calendarDao.updateEvent(event.copyWith(
                          colorValue: drift.Value(c.value),
                          updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
                        ));
                      }
                    },
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: c,
                        shape: BoxShape.circle,
                        border: isSelected ? Border.all(color: Colors.white, width: 3) : null,
                        boxShadow: [
                          BoxShadow(
                            color: c.withOpacity(0.4),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: isSelected ? const Icon(Icons.check, color: Colors.white) : null,
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getTypeIcon(CalendarItemType type) {
    switch (type) {
      case CalendarItemType.task:
        return Icons.task_alt;
      case CalendarItemType.outOfOffice:
        return Icons.do_not_disturb_on_outlined;
      case CalendarItemType.focusTime:
        return Icons.self_improvement_rounded;
      case CalendarItemType.workingLocation:
        return Icons.location_city_rounded;
      case CalendarItemType.appointmentSchedule:
        return Icons.schedule_send_rounded;
      case CalendarItemType.birthday:
        return Icons.cake_outlined;
      case CalendarItemType.holiday:
        return Icons.celebration_outlined;
      case CalendarItemType.transaction:
        return Icons.attach_money_rounded;
      case CalendarItemType.event:
        return Icons.event;
    }
  }

  String _getTypeLabel(CalendarItemType type) {
    switch (type) {
      case CalendarItemType.task:
        return 'Task';
      case CalendarItemType.outOfOffice:
        return 'Out of Office';
      case CalendarItemType.focusTime:
        return 'Focus Time';
      case CalendarItemType.workingLocation:
        return 'Working Location';
      case CalendarItemType.appointmentSchedule:
        return 'Appointment Schedule';
      case CalendarItemType.birthday:
        return 'Birthday';
      case CalendarItemType.holiday:
        return 'Holiday';
      case CalendarItemType.transaction:
        return 'Transaction';
      case CalendarItemType.event:
        return 'Event';
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final item = widget.item;
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.85,
      ),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // Grab handle
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(top: 12, bottom: 8),
                  decoration: BoxDecoration(
                    color: Colors.grey.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              // Header actions bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: _currentColor.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: _currentColor.withOpacity(0.4)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(_getTypeIcon(item.type), size: 14, color: _currentColor),
                          const SizedBox(width: 6),
                          Text(
                            _getTypeLabel(item.type),
                            style: TextStyle(
                              color: _currentColor,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Spacer(),
                    // Color button
                    if (item.type != CalendarItemType.task && item.type != CalendarItemType.transaction)
                      IconButton(
                        icon: const Icon(Icons.palette_outlined, size: 20),
                        tooltip: 'Change Color',
                        onPressed: _showColorPicker,
                      ),
                    // Duplicate button
                    if (item.type != CalendarItemType.task && item.type != CalendarItemType.transaction)
                      IconButton(
                        icon: const Icon(Icons.copy_outlined, size: 20),
                        tooltip: 'Duplicate',
                        onPressed: _duplicateItem,
                      ),
                    // Edit button
                    IconButton(
                      icon: const Icon(Icons.edit_outlined, size: 20),
                      tooltip: 'Edit',
                      onPressed: () async {
                        Navigator.pop(context);
                        if (item.type == CalendarItemType.task) {
                          final tasks = await ref.read(allTasksStreamProvider.future);
                          final task = tasks.where((t) => t.id == item.sourceId).firstOrNull;
                          if (task != null && context.mounted) {
                            showModalBottomSheet(
                              context: context,
                              useRootNavigator: true,
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                              builder: (ctx) => TaskFormSheet(task: task),
                            );
                          }
                        } else {
                          final event = await ref.read(databaseProvider).calendarDao.getEventById(item.sourceId);
                          if (event != null && context.mounted) {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (ctx) => EventEditorScreen(existingEvent: event),
                              ),
                            );
                          }
                        }
                      },
                    ),
                    // Delete button
                    IconButton(
                      icon: const Icon(Icons.delete_outline, size: 20, color: AppColors.lightError),
                      tooltip: 'Delete',
                      onPressed: _deleteItem,
                    ),
                    // Close button
                    IconButton(
                      icon: const Icon(Icons.close, size: 20),
                      tooltip: 'Close',
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),

              const Divider(height: 1),

              // Title and Color Tag
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 14,
                      height: 14,
                      margin: const EdgeInsets.only(top: 6, right: 14),
                      decoration: BoxDecoration(
                        color: _currentColor,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                    Expanded(
                      child: Text(
                        item.title,
                        style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          fontSize: 22,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Date and time
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.access_time_rounded, size: 20, color: Colors.grey),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        _formatDateTimeRange(item.startTime, item.endTime, item.isAllDay),
                        style: TextStyle(
                          fontSize: 14,
                          color: isDark ? Colors.white70 : Colors.black87,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Recurrence rule
              if (item.recurrenceRule != null && item.recurrenceRule!.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
                  child: Row(
                    children: [
                      const Icon(Icons.repeat_rounded, size: 20, color: Colors.grey),
                      const SizedBox(width: 14),
                      Text(
                        'Repeats: ${item.recurrenceRule}',
                        style: const TextStyle(fontSize: 14, color: Colors.grey),
                      ),
                    ],
                  ),
                ),

              // Video call button (meet.chronos.io)
              if (item.videoUrl != null && item.videoUrl!.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 8),
                  child: Row(
                    children: [
                      const Icon(Icons.videocam_rounded, size: 20, color: AppColors.accentCyan),
                      const SizedBox(width: 14),
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: const Icon(Icons.video_call_rounded, color: AppColors.accentCyan),
                          label: const Text('Join Video Call (Chronos Meet)'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppColors.accentCyan,
                            side: const BorderSide(color: AppColors.accentCyan),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () {
                            Clipboard.setData(ClipboardData(text: item.videoUrl!));
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Video link copied: ${item.videoUrl}')),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),

              // Location
              if (item.location != null && item.location!.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  child: Row(
                    children: [
                      const Icon(Icons.location_on_outlined, size: 20, color: Colors.grey),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Text(
                          item.location!,
                          style: const TextStyle(fontSize: 14),
                        ),
                      ),
                    ],
                  ),
                ),

              // Out of office notice
              if (item.type == CalendarItemType.outOfOffice)
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.purple.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.purple.withOpacity(0.3)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.info_outline, color: Colors.purple, size: 20),
                      SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'Automatically declines new meetings during this period.',
                          style: TextStyle(color: Colors.purple, fontSize: 13, fontWeight: FontWeight.w500),
                        ),
                      ),
                    ],
                  ),
                ),

              // Focus time notice
              if (item.type == CalendarItemType.focusTime)
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.indigo.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.indigo.withOpacity(0.3)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.self_improvement, color: Colors.indigo, size: 20),
                      SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'Focus Session • Silence notifications and block distraction.',
                          style: TextStyle(color: Colors.indigo, fontSize: 13, fontWeight: FontWeight.w500),
                        ),
                      ),
                    ],
                  ),
                ),

              // Appointment Schedule booking link
              if (item.type == CalendarItemType.appointmentSchedule)
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.pink.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.pink.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.link, color: Colors.pink, size: 20),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Text(
                          'Shareable Booking Page active (30m slots)',
                          style: TextStyle(color: Colors.pink, fontSize: 13, fontWeight: FontWeight.w500),
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: 'https://chronos.io/book/${item.sourceId}'));
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Booking link copied!')),
                          );
                        },
                        child: const Text('Copy Link'),
                      ),
                    ],
                  ),
                ),

              // Task Checkbox (if Task)
              if (item.type == CalendarItemType.task)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Checkbox(
                      value: item.isCompleted,
                      activeColor: AppColors.accentEmerald,
                      onChanged: (val) async {
                        final db = ref.read(databaseProvider);
                        await db.taskDao.toggleTaskCompletion(
                          item.sourceId,
                          val ?? false,
                          DateTime.now().toUtc().millisecondsSinceEpoch,
                        );
                        if (mounted) Navigator.pop(context);
                      },
                    ),
                    title: Text(
                      item.isCompleted ? 'Completed Task' : 'Mark as Complete',
                      style: TextStyle(
                        color: item.isCompleted ? Colors.grey : null,
                        decoration: item.isCompleted ? TextDecoration.lineThrough : null,
                      ),
                    ),
                  ),
                ),

              // Description
              if (item.description != null && item.description!.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.notes_rounded, size: 20, color: Colors.grey),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Text(
                          item.description!,
                          style: TextStyle(
                            fontSize: 14,
                            height: 1.4,
                            color: isDark ? Colors.white70 : Colors.black87,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

              // RSVP Section (for Events)
              if (item.type == CalendarItemType.event) ...[
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 20),
                  child: Divider(),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Going?',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.grey),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          _buildRsvpChoice('Yes', 'yes', Icons.check_circle_rounded),
                          const SizedBox(width: 10),
                          _buildRsvpChoice('Maybe', 'maybe', Icons.help_outline_rounded),
                          const SizedBox(width: 10),
                          _buildRsvpChoice('No', 'no', Icons.cancel_outlined),
                        ],
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRsvpChoice(String label, String value, IconData icon) {
    final isSelected = _rsvpStatus == value;
    return Expanded(
      child: InkWell(
        onTap: () => _updateRsvp(value),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.accentCyan.withOpacity(0.18) : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? AppColors.accentCyan : Colors.grey.withOpacity(0.3),
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 16,
                color: isSelected ? AppColors.accentCyan : Colors.grey,
              ),
              const SizedBox(width: 6),
              Text(
                label,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  color: isSelected ? AppColors.accentCyan : null,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
