import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/tasks_providers.dart';
import 'task_form_sheet.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/theme/app_colors.dart';
import 'package:intl/intl.dart';

class TasksPage extends ConsumerWidget {
  const TasksPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final listsAsync = ref.watch(taskListsStreamProvider);
    final selectedListId = ref.watch(selectedListIdProvider);
    final tasksTree = ref.watch(tasksTreeProvider);

    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        title: Text('Tasks', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
        iconTheme: IconThemeData(color: theme.colorScheme.onSurface),
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert),
            onPressed: () {
              final lists = listsAsync.valueOrNull ?? [];
              _showListOptionsMenu(context, ref, selectedListId, lists);
            },
          )
        ],
      ),
      drawer: Drawer(
        backgroundColor: theme.colorScheme.surface,
        child: listsAsync.when(
          data: (lists) {
            return ListView(
              children: [
                DrawerHeader(
                  decoration: const BoxDecoration(color: AppColors.accentEmerald),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: const [
                      Icon(Icons.check_circle_outline_rounded, color: Colors.white, size: 36),
                      SizedBox(height: 8),
                      Text('My Tasks', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                ListTile(
                  leading: const Icon(Icons.all_inbox_rounded),
                  title: const Text('All Tasks'),
                  selected: selectedListId == 'all' || selectedListId == null,
                  onTap: () {
                    ref.read(selectedListIdProvider.notifier).state = 'all';
                    Navigator.pop(context);
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.check_circle_rounded),
                  title: const Text('Completed'),
                  selected: selectedListId == 'completed',
                  onTap: () {
                    ref.read(selectedListIdProvider.notifier).state = 'completed';
                    Navigator.pop(context);
                  },
                ),
                const Divider(),
                for (var list in lists)
                  ListTile(
                    leading: CircleAvatar(
                      radius: 7,
                      backgroundColor: Color(list.colorValue),
                    ),
                    title: Text(list.title),
                    selected: selectedListId == list.id,
                    onTap: () {
                      ref.read(selectedListIdProvider.notifier).state = list.id;
                      Navigator.pop(context);
                    },
                  ),
                ListTile(
                  leading: const Icon(Icons.add, color: AppColors.accentEmerald),
                  title: const Text('Create new list', style: TextStyle(color: AppColors.accentEmerald, fontWeight: FontWeight.w600)),
                  onTap: () {
                    _showCreateListDialog(context, ref);
                  },
                ),
              ],
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (err, stack) => Center(child: Text('Error: $err')),
        ),
      ),
      body: tasksTree.isEmpty 
        ? Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.task_alt_rounded, size: 64, color: theme.colorScheme.primary.withOpacity(0.4)),
                const SizedBox(height: 16),
                Text('No tasks here yet!', style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.7))),
                const SizedBox(height: 16),
                FilledButton.icon(
                  icon: const Icon(Icons.add),
                  label: const Text('Add a Task'),
                  style: FilledButton.styleFrom(backgroundColor: AppColors.accentEmerald),
                  onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      useRootNavigator: true,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (context) => const TaskFormSheet(),
                    );
                  },
                ),
              ],
            ),
          )
        : ListView.builder(
            itemCount: tasksTree.length,
            itemBuilder: (context, index) {
              final node = tasksTree[index];
              return TaskTile(node: node);
            },
          ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.accentEmerald,
        child: const Icon(Icons.add, color: Colors.white),
        onPressed: () {
          showModalBottomSheet(
            context: context,
            useRootNavigator: true,
            isScrollControlled: true,
            backgroundColor: Colors.transparent,
            builder: (context) => const TaskFormSheet(),
          );
        },
      ),
    );
  }

  void _showCreateListDialog(BuildContext context, WidgetRef ref) {
    final titleController = TextEditingController();
    showDialog(
      context: context,
      builder: (dCtx) => AlertDialog(
        backgroundColor: AppColors.backgroundSurface,
        title: const Text('New List', style: TextStyle(color: AppColors.textPrimary)),
        content: TextField(
          controller: titleController,
          autofocus: true,
          style: const TextStyle(color: AppColors.textPrimary),
          decoration: const InputDecoration(
            hintText: 'Enter list title',
            hintStyle: TextStyle(color: AppColors.textSecondary),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dCtx),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              final text = titleController.text.trim();
              if (text.isNotEmpty) {
                ref.read(taskServiceProvider).createList(
                  text, 
                  AppColors.accentEmerald.value,
                );
                Navigator.pop(dCtx);
              }
            },
            child: const Text('Create'),
          ),
        ],
      ),
    );
  }

  void _showListOptionsMenu(BuildContext context, WidgetRef ref, String? selectedListId, List<TaskListEntry> lists) {
    final currentList = (selectedListId != null && selectedListId != 'all' && selectedListId != 'completed')
        ? lists.where((l) => l.id == selectedListId).firstOrNull
        : null;

    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.backgroundSurface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
      builder: (ctx) {
        if (currentList == null) {
          return SafeArea(
            child: Wrap(
              children: [
                ListTile(
                  leading: const Icon(Icons.add, color: AppColors.accentEmerald),
                  title: const Text('Create New List', style: TextStyle(color: AppColors.textPrimary)),
                  onTap: () {
                    Navigator.pop(ctx);
                    _showCreateListDialog(context, ref);
                  },
                ),
              ],
            ),
          );
        }

        return SafeArea(
          child: Wrap(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  'List: ${currentList.title}',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.textPrimary),
                ),
              ),
              const Divider(height: 1, color: AppColors.borderDefault),
              ListTile(
                leading: const Icon(Icons.edit_outlined, color: AppColors.textSecondary),
                title: const Text('Rename List', style: TextStyle(color: AppColors.textPrimary)),
                onTap: () {
                  Navigator.pop(ctx);
                  _showRenameListDialog(context, ref, currentList);
                },
              ),
              ListTile(
                leading: const Icon(Icons.palette_outlined, color: AppColors.textSecondary),
                title: const Text('Change List Color', style: TextStyle(color: AppColors.textPrimary)),
                onTap: () {
                  Navigator.pop(ctx);
                  _showChangeColorDialog(context, ref, currentList);
                },
              ),
              ListTile(
                leading: const Icon(Icons.delete_outline, color: AppColors.lightError),
                title: const Text('Delete List', style: TextStyle(color: AppColors.lightError)),
                onTap: () async {
                  Navigator.pop(ctx);
                  final confirmed = await showDialog<bool>(
                    context: context,
                    builder: (dCtx) => AlertDialog(
                      backgroundColor: AppColors.backgroundSurface,
                      title: const Text('Delete List', style: TextStyle(color: AppColors.textPrimary)),
                      content: Text(
                        'Are you sure you want to delete "${currentList.title}" and its tasks?',
                        style: const TextStyle(color: AppColors.textSecondary),
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(dCtx, false),
                          child: const Text('Cancel'),
                        ),
                        FilledButton(
                          style: FilledButton.styleFrom(backgroundColor: AppColors.lightError),
                          onPressed: () => Navigator.pop(dCtx, true),
                          child: const Text('Delete'),
                        ),
                      ],
                    ),
                  );
                  if (confirmed == true) {
                    await ref.read(taskServiceProvider).deleteList(currentList.id);
                    ref.read(selectedListIdProvider.notifier).state = 'all';
                  }
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _showRenameListDialog(BuildContext context, WidgetRef ref, TaskListEntry list) {
    final controller = TextEditingController(text: list.title);
    showDialog(
      context: context,
      builder: (dCtx) => AlertDialog(
        backgroundColor: AppColors.backgroundSurface,
        title: const Text('Rename List', style: TextStyle(color: AppColors.textPrimary)),
        content: TextField(
          controller: controller,
          autofocus: true,
          style: const TextStyle(color: AppColors.textPrimary),
          decoration: const InputDecoration(hintText: 'List name'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dCtx), child: const Text('Cancel')),
          FilledButton(
            onPressed: () {
              final newTitle = controller.text.trim();
              if (newTitle.isNotEmpty) {
                ref.read(taskServiceProvider).updateList(list.copyWith(title: newTitle));
                Navigator.pop(dCtx);
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showChangeColorDialog(BuildContext context, WidgetRef ref, TaskListEntry list) {
    final colors = [
      AppColors.accentEmerald.value,
      AppColors.accentCyan.value,
      AppColors.accentViolet.value,
      const Color(0xFFF59E0B).value,
      AppColors.lightError.value,
      const Color(0xFFEC4899).value,
      const Color(0xFF6366F1).value,
      const Color(0xFF14B8A6).value,
    ];

    showDialog(
      context: context,
      builder: (dCtx) => AlertDialog(
        backgroundColor: AppColors.backgroundSurface,
        title: const Text('Change List Color', style: TextStyle(color: AppColors.textPrimary)),
        content: Wrap(
          spacing: 12,
          runSpacing: 12,
          children: colors.map((c) => GestureDetector(
            onTap: () {
              ref.read(taskServiceProvider).updateList(list.copyWith(colorValue: c));
              Navigator.pop(dCtx);
            },
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: Color(c),
                shape: BoxShape.circle,
                border: list.colorValue == c ? Border.all(color: Colors.white, width: 3) : null,
              ),
            ),
          )).toList(),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dCtx), child: const Text('Close')),
        ],
      ),
    );
  }
}

class TaskTile extends ConsumerWidget {
  final TaskNode node;
  const TaskTile({super.key, required this.node});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final task = node.task;
    final hasSubtasks = node.subtasks.isNotEmpty;

    String? dueString;
    if (task.dueDateUtc != null) {
      final date = DateTime.fromMillisecondsSinceEpoch(task.dueDateUtc!, isUtc: true).toLocal();
      if (task.hasTime) {
        dueString = DateFormat('MMM d, h:mm a').format(date);
      } else {
        dueString = DateFormat('MMM d').format(date);
      }
    }

    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ListTile(
          leading: Checkbox(
            value: task.isCompleted,
            activeColor: AppColors.accentEmerald,
            shape: const CircleBorder(),
            onChanged: (val) {
              if (val != null) {
                ref.read(taskServiceProvider).toggleTaskCompletion(task.id, val);
              }
            },
          ),
          title: Text(
            task.title,
            style: TextStyle(
              color: task.isCompleted
                  ? theme.colorScheme.onSurface.withOpacity(0.4)
                  : theme.colorScheme.onSurface,
              decoration: task.isCompleted ? TextDecoration.lineThrough : null,
              fontWeight: FontWeight.w500,
            ),
          ),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (task.description != null && task.description!.isNotEmpty)
                Text(
                  task.description!,
                  style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.7)),
                ),
              if (dueString != null)
                Container(
                  margin: const EdgeInsets.only(top: 4),
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.accentEmerald.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    dueString,
                    style: const TextStyle(fontSize: 12, color: AppColors.accentEmerald, fontWeight: FontWeight.w600),
                  ),
                ),
            ],
          ),
          onTap: () {
            showModalBottomSheet(
              context: context,
              useRootNavigator: true,
              isScrollControlled: true,
              backgroundColor: Colors.transparent,
              builder: (context) => TaskFormSheet(task: task),
            );
          },
        ),
        if (hasSubtasks)
          Padding(
            padding: const EdgeInsets.only(left: 48.0),
            child: Column(
              children: node.subtasks.map((sub) => TaskTile(node: sub)).toList(),
            ),
          ),
      ],
    );
  }
}
