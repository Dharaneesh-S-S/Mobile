import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:drift/drift.dart' hide Column;
import '../../providers/tasks_providers.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/theme/app_colors.dart';

class TaskFormSheet extends ConsumerStatefulWidget {
  final TaskItemEntry? task;
  final String? parentTaskId;
  final DateTime? initialDueDate;

  const TaskFormSheet({
    super.key,
    this.task,
    this.parentTaskId,
    this.initialDueDate,
  });

  @override
  ConsumerState<TaskFormSheet> createState() => _TaskFormSheetState();
}

class _TaskFormSheetState extends ConsumerState<TaskFormSheet> {
  late TextEditingController _titleController;
  late TextEditingController _descController;
  final TextEditingController _subtaskController = TextEditingController();
  final List<String> _pendingSubtasks = [];

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
    } else if (widget.initialDueDate != null) {
      _dueDate = widget.initialDueDate;
      _hasTime = false;
    }

    _selectedListId = widget.task?.listId ?? ref.read(selectedListIdProvider);
    _recurrenceRule = widget.task?.recurrenceRule;
  }

  @override
  String? _titleError;
  bool _isSaving = false;

  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _subtaskController.dispose();
    super.dispose();
  }

  Future<void> _saveTask() async {
    final title = _titleController.text.trim();
    if (title.isEmpty) {
      setState(() => _titleError = 'Please enter a task title');
      return;
    }
    if (_isSaving) return;
    setState(() => _isSaving = true);

    try {
      final service = ref.read(taskServiceProvider);
      final lists = ref.read(taskListsStreamProvider).valueOrNull ?? [];

      String? targetListId = _selectedListId;
      if (targetListId == 'all' || targetListId == 'completed' || targetListId == null) {
        targetListId = lists.isNotEmpty ? lists.first.id : null;
      } else if (!lists.any((l) => l.id == targetListId)) {
        targetListId = lists.isNotEmpty ? lists.first.id : null;
      }

      if (widget.task == null) {
        final createdTask = await service.createTask(
          title: title,
          description: _descController.text.trim().isEmpty ? null : _descController.text.trim(),
          listId: targetListId,
          parentTaskId: widget.parentTaskId,
          dueDate: _dueDate,
          hasTime: _hasTime,
          recurrenceRule: _recurrenceRule,
        );

        if (_pendingSubtasks.isNotEmpty) {
          for (final subTitle in _pendingSubtasks) {
            await service.createTask(
              title: subTitle,
              listId: targetListId,
              parentTaskId: createdTask.id,
              dueDate: _dueDate,
              hasTime: _hasTime,
            );
          }
        }
      } else {
        await service.updateTask(
          widget.task!.copyWith(
            title: title,
            description: Value(_descController.text.trim().isEmpty ? null : _descController.text.trim()),
            listId: Value(targetListId),
            dueDateUtc: Value(_dueDate?.toUtc().millisecondsSinceEpoch),
            hasTime: _hasTime,
            recurrenceRule: Value(_recurrenceRule),
          ),
        );
        if (_pendingSubtasks.isNotEmpty) {
          for (final subTitle in _pendingSubtasks) {
            await service.createTask(
              title: subTitle,
              listId: targetListId,
              parentTaskId: widget.task!.id,
              dueDate: _dueDate,
              hasTime: _hasTime,
            );
          }
        }
      }
      if (mounted) {
        Navigator.of(context).pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save task: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  void _showListPickerDialog(BuildContext context, List<TaskListEntry> lists) {
    showDialog(
      context: context,
      builder: (dCtx) => AlertDialog(
        title: const Text('Select Task List'),
        content: SizedBox(
          width: double.maxFinite,
          child: ListView(
            shrinkWrap: true,
            children: [
              for (final l in lists)
                ListTile(
                  leading: CircleAvatar(
                    backgroundColor: Color(l.colorValue),
                    radius: 8,
                  ),
                  title: Text(l.title),
                  selected: _selectedListId == l.id,
                  trailing: _selectedListId == l.id ? const Icon(Icons.check) : null,
                  onTap: () {
                    setState(() => _selectedListId = l.id);
                    Navigator.pop(dCtx);
                  },
                ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.add, color: AppColors.accentEmerald),
                title: const Text('Create new list', style: TextStyle(color: AppColors.accentEmerald)),
                onTap: () {
                  Navigator.pop(dCtx);
                  _showCreateListDialog(context);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showCreateListDialog(BuildContext context) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (dCtx) => AlertDialog(
        title: const Text('New List'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(hintText: 'List name'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dCtx), child: const Text('Cancel')),
          FilledButton(
            onPressed: () async {
              final name = controller.text.trim();
              if (name.isNotEmpty) {
                await ref.read(taskServiceProvider).createList(name, AppColors.accentEmerald.value);
                final updatedLists = await ref.read(taskListsStreamProvider.future);
                final newList = updatedLists.where((l) => l.title == name).firstOrNull;
                if (newList != null && mounted) {
                  setState(() => _selectedListId = newList.id);
                }
                if (dCtx.mounted) Navigator.pop(dCtx);
              }
            },
            child: const Text('Create'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final lists = ref.watch(taskListsStreamProvider).valueOrNull ?? [];

    TaskListEntry? currentList;
    if (_selectedListId != null && _selectedListId != 'all' && _selectedListId != 'completed') {
      currentList = lists.where((l) => l.id == _selectedListId).firstOrNull;
    }
    currentList ??= lists.isNotEmpty ? lists.first : null;

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        ),
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top Bar with Drag Handle and Close button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: const Icon(Icons.close),
                    tooltip: 'Cancel',
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                  Text(
                    widget.task == null ? 'New Task' : 'Edit Task',
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  FilledButton.icon(
                    onPressed: _isSaving ? null : _saveTask,
                    icon: _isSaving
                        ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Icon(Icons.check, size: 16),
                    label: const Text('Save'),
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.accentEmerald,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ],
              ),
              const Divider(height: 16),
              // Title Field
              TextField(
                controller: _titleController,
                autofocus: widget.task == null,
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                decoration: InputDecoration(
                  hintText: 'What needs to be done?',
                  border: InputBorder.none,
                  errorText: _titleError,
                ),
                onChanged: (val) {
                  if (_titleError != null) {
                    setState(() => _titleError = null);
                  }
                },
                onSubmitted: (_) => _saveTask(),
              ),
              // Description Field
              TextField(
                controller: _descController,
                style: theme.textTheme.bodyMedium,
                maxLines: 2,
                minLines: 1,
                decoration: const InputDecoration(
                  hintText: 'Add details or notes',
                  border: InputBorder.none,
                  prefixIcon: Icon(Icons.notes_rounded, size: 20),
                ),
              ),
              const SizedBox(height: 12),
              // Controls Chips (List, Date, Recurrence)
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    // List selector chip
                    ActionChip(
                      avatar: CircleAvatar(
                        radius: 6,
                        backgroundColor: currentList != null ? Color(currentList.colorValue) : AppColors.accentEmerald,
                      ),
                      label: Text(currentList?.title ?? 'My Tasks'),
                      onPressed: () => _showListPickerDialog(context, lists),
                    ),
                    const SizedBox(width: 8),
                    // Date & Time Chip
                    FilterChip(
                      selected: _dueDate != null,
                      avatar: const Icon(Icons.calendar_today_rounded, size: 16),
                      label: Text(
                        _dueDate != null
                            ? (_hasTime
                                ? DateFormat('MMM d, h:mm a').format(_dueDate!)
                                : DateFormat('MMM d').format(_dueDate!))
                            : 'Set Due Date',
                      ),
                      onSelected: (selected) async {
                        if (!selected) {
                          setState(() {
                            _dueDate = null;
                            _hasTime = false;
                          });
                          return;
                        }
                        final date = await showDatePicker(
                          context: context,
                          initialDate: _dueDate ?? DateTime.now(),
                          firstDate: DateTime(2000),
                          lastDate: DateTime(2100),
                        );
                        if (date != null) {
                          setState(() {
                            _dueDate = DateTime(date.year, date.month, date.day, _dueDate?.hour ?? 9, _dueDate?.minute ?? 0);
                          });
                          final time = await showTimePicker(
                            context: context,
                            initialTime: TimeOfDay.fromDateTime(_dueDate!),
                          );
                          if (time != null) {
                            setState(() {
                              _dueDate = DateTime(date.year, date.month, date.day, time.hour, time.minute);
                              _hasTime = true;
                            });
                          }
                        }
                      },
                    ),
                    const SizedBox(width: 8),
                    // Recurrence Chip
                    FilterChip(
                      selected: _recurrenceRule != null,
                      avatar: const Icon(Icons.repeat_rounded, size: 16),
                      label: Text(_recurrenceRule != null ? 'Daily Repeat' : 'Repeat'),
                      onSelected: (val) {
                        setState(() {
                          _recurrenceRule = val ? 'FREQ=DAILY' : null;
                        });
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              // Subtasks section
              if (_pendingSubtasks.isNotEmpty) ...[
                const Text('Subtasks:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 4),
                for (int i = 0; i < _pendingSubtasks.length; i++)
                  Row(
                    children: [
                      const Icon(Icons.subdirectory_arrow_right, size: 18, color: Colors.grey),
                      const SizedBox(width: 6),
                      Expanded(child: Text(_pendingSubtasks[i])),
                      IconButton(
                        icon: const Icon(Icons.remove_circle_outline, size: 18, color: AppColors.lightError),
                        onPressed: () => setState(() => _pendingSubtasks.removeAt(i)),
                      ),
                    ],
                  ),
              ],
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _subtaskController,
                      decoration: const InputDecoration(
                        hintText: 'Add a subtask...',
                        isDense: true,
                        border: InputBorder.none,
                        prefixIcon: Icon(Icons.add, size: 18),
                      ),
                      onSubmitted: (val) {
                        if (val.trim().isNotEmpty) {
                          setState(() {
                            _pendingSubtasks.add(val.trim());
                            _subtaskController.clear();
                          });
                        }
                      },
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      if (_subtaskController.text.trim().isNotEmpty) {
                        setState(() {
                          _pendingSubtasks.add(_subtaskController.text.trim());
                          _subtaskController.clear();
                        });
                      }
                    },
                    child: const Text('Add'),
                  ),
                ],
              ),
              if (widget.task != null) ...[
                const SizedBox(height: 12),
                Align(
                  alignment: Alignment.centerLeft,
                  child: TextButton.icon(
                    style: TextButton.styleFrom(foregroundColor: AppColors.lightError),
                    icon: const Icon(Icons.delete_outline),
                    label: const Text('Delete Task'),
                    onPressed: () {
                      ref.read(taskServiceProvider).deleteTask(widget.task!.id);
                      Navigator.of(context).pop();
                    },
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
