import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart' as drift;
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/money_providers.dart';

class CategoriesScreen extends ConsumerStatefulWidget {
  const CategoriesScreen({super.key});

  @override
  ConsumerState<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends ConsumerState<CategoriesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final categoriesAsync = ref.watch(categoriesStreamProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Categories'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Expense'),
            Tab(text: 'Income'),
          ],
        ),
      ),
      body: categoriesAsync.when(
        data: (categories) {
          final expenseCategories = categories.where((c) => c.isExpense).toList();
          final incomeCategories = categories.where((c) => !c.isExpense).toList();

          return TabBarView(
            controller: _tabController,
            children: [
              _buildCategoryList(expenseCategories, isExpense: true),
              _buildCategoryList(incomeCategories, isExpense: false),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.accentEmerald,
        onPressed: () {
          final isExpense = _tabController.index == 0;
          _showCategoryDialog(context, ref, null, isExpense: isExpense);
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildCategoryList(List<MoneyCategoryEntry> list, {required bool isExpense}) {
    if (list.isEmpty) {
      return Center(
        child: Text('No ${isExpense ? "expense" : "income"} categories. Tap + to add.'),
      );
    }
    return ListView.builder(
      itemCount: list.length,
      itemBuilder: (context, index) {
        final cat = list[index];
        return ListTile(
          leading: CircleAvatar(
            backgroundColor: Color(cat.colorValue).withOpacity(0.2),
            child: Icon(Icons.category, color: Color(cat.colorValue)),
          ),
          title: Text(cat.name, style: const TextStyle(fontWeight: FontWeight.w600)),
          trailing: IconButton(
            icon: const Icon(Icons.delete_outline, color: AppColors.lightError),
            onPressed: () async {
              final confirmed = await showDialog<bool>(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text('Delete Category'),
                  content: Text('Are you sure you want to delete "${cat.name}"? Historical transactions will retain their record.'),
                  actions: [
                    TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
                    FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: AppColors.lightError),
                      onPressed: () => Navigator.pop(ctx, true),
                      child: const Text('Delete'),
                    ),
                  ],
                ),
              );
              if (confirmed == true) {
                await ref.read(databaseProvider).moneyDao.deleteCategory(cat.id);
              }
            },
          ),
          onTap: () => _showCategoryDialog(context, ref, cat, isExpense: isExpense),
        );
      },
    );
  }

  void _showCategoryDialog(BuildContext context, WidgetRef ref, MoneyCategoryEntry? existing, {required bool isExpense}) {
    final nameController = TextEditingController(text: existing?.name ?? '');
    Color selectedColor = existing != null ? Color(existing.colorValue) : (isExpense ? AppColors.lightError : AppColors.accentCyan);

    final availableColors = [
      AppColors.accentCyan,
      AppColors.accentEmerald,
      AppColors.lightError,
      Colors.orange,
      Colors.purple,
      Colors.indigo,
      Colors.pink,
      Colors.teal,
    ];

    String? nameError;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          title: Text(existing == null ? 'Add Category' : 'Edit Category'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  labelText: 'Category Name',
                  errorText: nameError,
                ),
                autofocus: true,
                onChanged: (val) {
                  if (nameError != null) {
                    setDialogState(() => nameError = null);
                  }
                },
              ),
              const SizedBox(height: 16),
              const Align(
                alignment: Alignment.centerLeft,
                child: Text('Color', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: availableColors.map((c) {
                  return GestureDetector(
                    onTap: () => setDialogState(() => selectedColor = c),
                    child: Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: c,
                        shape: BoxShape.circle,
                        border: selectedColor == c ? Border.all(color: Colors.white, width: 2) : null,
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            FilledButton(
              onPressed: () async {
                final name = nameController.text.trim();
                if (name.isEmpty) {
                  setDialogState(() => nameError = 'Please enter a category name');
                  return;
                }

                try {
                  final db = ref.read(databaseProvider);
                  if (existing != null) {
                    await db.moneyDao.updateCategory(
                      existing.copyWith(name: name, colorValue: selectedColor.value),
                    );
                  } else {
                    await db.moneyDao.insertCategory(
                      MoneyCategoriesCompanion.insert(
                        id: const Uuid().v4(),
                        name: name,
                        iconName: const drift.Value('category'),
                        colorValue: drift.Value(selectedColor.value),
                        isExpense: drift.Value(isExpense),
                        createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
                      ),
                    );
                  }
                  if (ctx.mounted) Navigator.pop(ctx);
                } catch (e) {
                  if (ctx.mounted) {
                    ScaffoldMessenger.of(ctx).showSnackBar(
                      SnackBar(content: Text('Failed to save category: $e')),
                    );
                  }
                }
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
  }
}
