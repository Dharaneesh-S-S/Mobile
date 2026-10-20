import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart' as drift;
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/theme/app_colors.dart';
import '../domain/models/calendar_display_item.dart';
import 'event_editor_screen.dart';

class QuickCreateSheet extends ConsumerStatefulWidget {
  final DateTime initialDate;

  const QuickCreateSheet({super.key, required this.initialDate});

  @override
  ConsumerState<QuickCreateSheet> createState() => _QuickCreateSheetState();
}

class _QuickCreateSheetState extends ConsumerState<QuickCreateSheet> {
  final _titleController = TextEditingController();
  final _locationController = TextEditingController();
  CalendarItemType _selectedType = CalendarItemType.event;
  bool _isAllDay = false;
  bool _addVideoMeet = false;
  String _workingLocationTag = 'Office';

  late DateTime _startDate;
  late TimeOfDay _startTime;
  late DateTime _endDate;
  late TimeOfDay _endTime;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _startDate = DateTime(widget.initialDate.year, widget.initialDate.month, widget.initialDate.day);
    _endDate = _startDate;
    final nextHour = (now.hour + 1) % 24;
    _startTime = TimeOfDay(hour: nextHour, minute: 0);
    _endTime = TimeOfDay(hour: (nextHour + 1) % 24, minute: 0);
  }

  @override
  void dispose() {
    _titleController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _saveQuickItem() async {
    final title = _titleController.text.trim();
    if (title.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a title')),
      );
      return;
    }

    final db = ref.read(databaseProvider);
    final nowUtc = DateTime.now().toUtc().millisecondsSinceEpoch;

    final startDt = DateTime(
      _startDate.year,
      _startDate.month,
      _startDate.day,
      _isAllDay ? 0 : _startTime.hour,
      _isAllDay ? 0 : _startTime.minute,
    );
    final endDt = DateTime(
      _endDate.year,
      _endDate.month,
      _endDate.day,
      _isAllDay ? 23 : _endTime.hour,
      _isAllDay ? 59 : _endTime.minute,
    );

    if (_selectedType == CalendarItemType.task) {
      final taskId = const Uuid().v4();
      await db.taskDao.insertTask(TaskItemsCompanion(
        id: drift.Value(taskId),
        title: drift.Value(title),
        description: drift.Value(_locationController.text.isNotEmpty ? _locationController.text : null),
        dueDateUtc: drift.Value(startDt.toUtc().millisecondsSinceEpoch),
        hasTime: drift.Value(!_isAllDay),
        isCompleted: const drift.Value(false),
        priority: const drift.Value(1),
        createdAtUtc: drift.Value(nowUtc),
        updatedAtUtc: drift.Value(nowUtc),
      ));
    } else {
      final eventId = const Uuid().v4();
      String eventTypeStr = 'event';
      int colorVal = AppColors.accentCyan.value;

      switch (_selectedType) {
        case CalendarItemType.outOfOffice:
          eventTypeStr = 'out_of_office';
          colorVal = Colors.purple.value;
          break;
        case CalendarItemType.focusTime:
          eventTypeStr = 'focus_time';
          colorVal = Colors.indigo.value;
          break;
        case CalendarItemType.workingLocation:
          eventTypeStr = 'working_location';
          colorVal = Colors.teal.value;
          break;
        case CalendarItemType.appointmentSchedule:
          eventTypeStr = 'appointment_schedule';
          colorVal = Colors.pink.value;
          break;
        case CalendarItemType.birthday:
          eventTypeStr = 'birthday';
          break;
        case CalendarItemType.holiday:
          eventTypeStr = 'holiday';
          break;
        default:
          eventTypeStr = 'event';
      }

      String? desc;
      if (_addVideoMeet) {
        final meetId = const Uuid().v4().substring(0, 8);
        desc = 'Google Meet / Chronos Video: https://meet.chronos.io/$meetId';
      }

      String? loc = _locationController.text.trim();
      if (_selectedType == CalendarItemType.workingLocation) {
        loc = _workingLocationTag;
      }

      await db.calendarDao.insertEvent(CalendarEventsCompanion(
        id: drift.Value(eventId),
        title: drift.Value(title),
        description: drift.Value(desc),
        startTimeUtc: drift.Value(startDt.toUtc().millisecondsSinceEpoch),
        endTimeUtc: drift.Value(endDt.toUtc().millisecondsSinceEpoch),
        isAllDay: drift.Value(_isAllDay),
        location: drift.Value(loc.isNotEmpty ? loc : null),
        colorValue: drift.Value(colorVal),
        eventType: drift.Value(eventTypeStr),
        createdAtUtc: drift.Value(nowUtc),
        updatedAtUtc: drift.Value(nowUtc),
      ));
    }

    if (mounted) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Created ${_selectedType.name}: $title')),
      );
    }
  }

  void _openFullEditor() {
    Navigator.pop(context);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (ctx) => EventEditorScreen(
          initialDate: _startDate,
          initialType: _selectedType,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
        top: 16,
        left: 20,
        right: 20,
      ),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Grab handle
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Colors.grey.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              // Title input
              TextField(
                controller: _titleController,
                autofocus: true,
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                decoration: InputDecoration(
                  hintText: 'Add title',
                  hintStyle: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w400,
                    color: Colors.grey.withOpacity(0.6),
                  ),
                  border: InputBorder.none,
                ),
              ),

              const SizedBox(height: 8),

              // Type Selector Chips (Horizontal scroll)
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildTypeChip('Event', CalendarItemType.event, Icons.event),
                    const SizedBox(width: 8),
                    _buildTypeChip('Task', CalendarItemType.task, Icons.task_alt),
                    const SizedBox(width: 8),
                    _buildTypeChip('Out of office', CalendarItemType.outOfOffice, Icons.do_not_disturb_on_outlined),
                    const SizedBox(width: 8),
                    _buildTypeChip('Focus time', CalendarItemType.focusTime, Icons.self_improvement),
                    const SizedBox(width: 8),
                    _buildTypeChip('Working location', CalendarItemType.workingLocation, Icons.location_city),
                    const SizedBox(width: 8),
                    _buildTypeChip('Appointment schedule', CalendarItemType.appointmentSchedule, Icons.schedule_send),
                  ],
                ),
              ),

              const SizedBox(height: 16),
              const Divider(height: 1),
              const SizedBox(height: 12),

              // Date & Time Row
              Row(
                children: [
                  const Icon(Icons.access_time_rounded, size: 20, color: Colors.grey),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          DateFormat('EEEE, MMMM d').format(_startDate),
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                        ),
                        if (!_isAllDay) ...[
                          const SizedBox(height: 2),
                          Text(
                            '${_startTime.format(context)} – ${_endTime.format(context)}',
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark ? Colors.white60 : Colors.black54,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      const Text('All day', style: TextStyle(fontSize: 12)),
                      Switch(
                        value: _isAllDay,
                        onChanged: (val) => setState(() => _isAllDay = val),
                      ),
                    ],
                  ),
                ],
              ),

              // Video call toggle for events
              if (_selectedType == CalendarItemType.event) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.videocam_outlined, size: 20, color: AppColors.accentCyan),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Text('Add video conferencing', style: TextStyle(fontSize: 14)),
                    ),
                    Switch(
                      value: _addVideoMeet,
                      activeColor: AppColors.accentCyan,
                      onChanged: (val) => setState(() => _addVideoMeet = val),
                    ),
                  ],
                ),
              ],

              // Working Location Selector
              if (_selectedType == CalendarItemType.workingLocation) ...[
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Icon(Icons.location_city, size: 20, color: Colors.teal),
                    const SizedBox(width: 12),
                    const Text('Location:', style: TextStyle(fontWeight: FontWeight.w600)),
                    const SizedBox(width: 12),
                    ...['Office', 'Home', 'Elsewhere'].map((loc) {
                      final isSel = _workingLocationTag == loc;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(loc, style: const TextStyle(fontSize: 12)),
                          selected: isSel,
                          onSelected: (val) {
                            if (val) setState(() => _workingLocationTag = loc);
                          },
                        ),
                      );
                    }),
                  ],
                ),
              ],

              // Location input for regular events
              if (_selectedType == CalendarItemType.event || _selectedType == CalendarItemType.appointmentSchedule) ...[
                const SizedBox(height: 8),
                TextField(
                  controller: _locationController,
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.location_on_outlined, size: 20),
                    hintText: 'Add location or room',
                    border: InputBorder.none,
                    isDense: true,
                  ),
                ),
              ],

              const SizedBox(height: 16),

              // Bottom Actions: "More options" and "Save"
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton(
                    onPressed: _openFullEditor,
                    child: const Text('More options'),
                  ),
                  FilledButton(
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.accentCyan,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _saveQuickItem,
                    child: const Text('Save', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTypeChip(String label, CalendarItemType type, IconData icon) {
    final isSelected = _selectedType == type;
    Color activeColor = AppColors.accentCyan;
    if (type == CalendarItemType.outOfOffice) activeColor = Colors.purple;
    if (type == CalendarItemType.focusTime) activeColor = Colors.indigo;
    if (type == CalendarItemType.workingLocation) activeColor = Colors.teal;
    if (type == CalendarItemType.appointmentSchedule) activeColor = Colors.pink;
    if (type == CalendarItemType.task) activeColor = AppColors.accentEmerald;

    return ChoiceChip(
      avatar: Icon(icon, size: 14, color: isSelected ? Colors.white : activeColor),
      label: Text(label),
      selected: isSelected,
      selectedColor: activeColor,
      labelStyle: TextStyle(
        fontSize: 12,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        color: isSelected ? Colors.white : null,
      ),
      onSelected: (val) {
        if (val) setState(() => _selectedType = type);
      },
    );
  }
}
