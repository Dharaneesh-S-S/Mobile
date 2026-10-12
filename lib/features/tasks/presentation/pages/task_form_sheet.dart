import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/tasks_providers.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/theme/app_colors.dart';
import 'package:intl/intl.dart';
import 'package:drift/drift.dart' hide Column;

class TaskFormSheet extends ConsumerStatefulWidget {
  final TaskItemEntry? task;
  final String? parentTaskId;

  const TaskFormSheet({super.key, this.task, this.parentTaskId});

  @override
  ConsumerState<TaskFormSheet> createState() => _TaskFormSheetState();
}

class _TaskFormSheetState extends ConsumerState<TaskFormSheet> {
  late TextEditingController _titleController;
  late TextEditingController _descController;
  DateTime? _dueDate;
  bool _hasTime = false;
  String? _selectedListId;
  String? _recurrenceRule;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.task?.title ?? '');
    _descController = TextEditingController(text: widget.task?.description ?? '');
    
    if (widget.task?.dueDateUtc != null) {
      _dueDate = DateTime.fromMillisecondsSinceEpoch(widget.task!.dueDateUtc!, isUtc: true).toLocal();
      _hasTime = widget.task!.hasTime;
    }
    
    _selectedListId = widget.task?.listId ?? ref.read(selectedListIdProvider);
    _recurrenceRule = widget.task?.recurrenceRule;
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    super.dispose();
  }

  void _saveTask() {
    if (_titleController.text.isEmpty) return;

    final service = ref.read(taskServiceProvider);
    
    if (widget.task == null) {
      service.createTask(
        title: _titleController.text,
        description: _descController.text,
        listId: _selectedListId == 'all' || _selectedListId == 'completed' ? null : _selectedListId,
        parentTaskId: widget.parentTaskId,
        dueDate: _dueDate,
        hasTime: _hasTime,
        recurrenceRule: _recurrenceRule,
      );
    } else {
      service.updateTask(
        widget.task!.copyWith(
          title: _titleController.text,
          description: Value(_descController.text),
          listId: Value(_selectedListId == 'all' || _selectedListId == 'completed' ? null : _selectedListId),
          dueDateUtc: Value(_dueDate?.toUtc().millisecondsSinceEpoch),
          hasTime: _hasTime,
          recurrenceRule: Value(_recurrenceRule),
        )
      );
    }
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final lists = ref.watch(taskListsStreamProvider).valueOrNull ?? [];

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        decoration: const BoxDecoration(
          color: AppColors.backgroundSurface,
          borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _titleController,
              autofocus: widget.task == null,
              style: const TextStyle(color: AppColors.textPrimary, fontSize: 18),
              decoration: const InputDecoration(
                hintText: 'New task',
                hintStyle: TextStyle(color: AppColors.textSecondary),
                border: InputBorder.none,
              ),
              onSubmitted: (_) => _saveTask(),
            ),
            TextField(
              controller: _descController,
              style: const TextStyle(color: AppColors.textPrimary, fontSize: 14),
              decoration: const InputDecoration(
                hintText: 'Add details',
                hintStyle: TextStyle(color: AppColors.textSecondary),
                border: InputBorder.none,
              ),
            ),
            const SizedBox(height: 16),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  // List selector
                  if (lists.isNotEmpty)
                    ActionChip(
                      backgroundColor: AppColors.backgroundBase,
                      label: Text(
                        lists.firstWhere((l) => l.id == _selectedListId, orElse: () => lists.first).title,
                        style: const TextStyle(color: AppColors.textPrimary),
                      ),
                      avatar: const Icon(Icons.list, size: 16, color: AppColors.textSecondary),
                      onPressed: () {
                        // Show list picker
                      },
                    ),
                  const SizedBox(width: 8),
                  // Date picker
                  ActionChip(
                    backgroundColor: _dueDate != null ? AppColors.accentEmerald.withOpacity(0.2) : AppColors.backgroundBase,
                    label: Text(
                      _dueDate != null 
                        ? (_hasTime ? DateFormat('MMM d, h:mm a').format(_dueDate!) : DateFormat('MMM d').format(_dueDate!))
                        : 'Add Date',
                      style: TextStyle(color: _dueDate != null ? AppColors.accentEmerald : AppColors.textPrimary),
                    ),
                    avatar: Icon(Icons.calendar_today, size: 16, color: _dueDate != null ? AppColors.accentEmerald : AppColors.textSecondary),
                    onPressed: () async {
                      final date = await showDatePicker(
                        context: context,
                        initialDate: _dueDate ?? DateTime.now(),
                        firstDate: DateTime(2000),
                        lastDate: DateTime(2100),
                      );
                      if (date != null) {
                        setState(() {
                          _dueDate = DateTime(date.year, date.month, date.day, _dueDate?.hour ?? 0, _dueDate?.minute ?? 0);
                        });
                        // Ask for time optionally
                        final time = await showTimePicker(context: context, initialTime: TimeOfDay.now());
                        if (time != null) {
                          setState(() {
                            _dueDate = DateTime(date.year, date.month, date.day, time.hour, time.minute);
                            _hasTime = true;
                          });
                        } else {
                           setState(() {
                            _hasTime = false;
                           });
                        }
                      }
                    },
                  ),
                  const SizedBox(width: 8),
                  // Recurrence
                   ActionChip(
                    backgroundColor: _recurrenceRule != null ? AppColors.accentEmerald.withOpacity(0.2) : AppColors.backgroundBase,
                    label: Text(
                      _recurrenceRule != null ? 'Recurring' : 'No repeat',
                      style: TextStyle(color: _recurrenceRule != null ? AppColors.accentEmerald : AppColors.textPrimary),
                    ),
                    avatar: Icon(Icons.repeat, size: 16, color: _recurrenceRule != null ? AppColors.accentEmerald : AppColors.textSecondary),
                    onPressed: () {
                      // simple toggle for now
                      setState(() {
                        if (_recurrenceRule == null) {
                          _recurrenceRule = 'FREQ=DAILY';
                        } else {
                          _recurrenceRule = null;
                        }
                      });
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (widget.task != null)
                  IconButton(
                    icon: const Icon(Icons.delete, color: AppColors.lightError),
                    onPressed: () {
                      ref.read(taskServiceProvider).deleteTask(widget.task!.id);
                      Navigator.pop(context);
                    },
                  )
                else
                  const SizedBox.shrink(),
                ElevatedButton(
                  onPressed: _saveTask,
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentEmerald),
                  child: const Text('Save', style: TextStyle(color: Colors.white)),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
