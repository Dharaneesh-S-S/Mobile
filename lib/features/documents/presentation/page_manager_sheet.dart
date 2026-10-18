import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/database/app_database.dart';
import '../providers/document_providers.dart';

class PageManagerSheet extends ConsumerWidget {
  final String documentId;
  final int currentPageIndex;
  final ValueChanged<int> onSelectPage;

  const PageManagerSheet({
    super.key,
    required this.documentId,
    required this.currentPageIndex,
    required this.onSelectPage,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final pagesAsync = ref.watch(documentPagesProvider(documentId));

    return Container(
      height: MediaQuery.of(context).size.height * 0.65,
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            decoration: BoxDecoration(
              color: Colors.grey.withOpacity(0.4),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Manage Pages', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: pagesAsync.when(
              data: (pages) {
                return ReorderableListView.builder(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  itemCount: pages.length,
                  onReorder: (oldIndex, newIndex) {
                    ref.read(documentNotifierProvider).reorderPages(documentId, oldIndex, newIndex);
                  },
                  itemBuilder: (context, index) {
                    final page = pages[index];
                    final isCurrent = index == currentPageIndex;

                    return ListTile(
                      key: ValueKey(page.id),
                      leading: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Color(page.backgroundColor),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(
                            color: isCurrent ? theme.colorScheme.primary : Colors.grey.withOpacity(0.4),
                            width: isCurrent ? 2.5 : 1,
                          ),
                        ),
                        child: Center(
                          child: Text(
                            '${index + 1}',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: isCurrent ? theme.colorScheme.primary : Colors.black87,
                            ),
                          ),
                        ),
                      ),
                      title: Text(
                        'Page ${index + 1}',
                        style: TextStyle(fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal),
                      ),
                      subtitle: Text(
                        isCurrent ? 'Currently viewing' : 'Tap to navigate',
                        style: const TextStyle(fontSize: 12),
                      ),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.copy, size: 20),
                            tooltip: 'Duplicate Page',
                            onPressed: () {
                              ref.read(documentNotifierProvider).duplicatePage(page);
                            },
                          ),
                          if (pages.length > 1)
                            IconButton(
                              icon: const Icon(Icons.delete_outline, size: 20, color: Colors.redAccent),
                              tooltip: 'Delete Page',
                              onPressed: () {
                                _confirmDeletePage(context, ref, page);
                              },
                            ),
                          const Icon(Icons.drag_handle, color: Colors.grey),
                        ],
                      ),
                      onTap: () {
                        onSelectPage(index);
                        Navigator.pop(context);
                      },
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(child: Text('Error: $e')),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                icon: const Icon(Icons.add),
                label: const Text('Add New Page'),
                onPressed: () {
                  pagesAsync.whenData((pages) {
                    ref.read(documentNotifierProvider).addPage(documentId, pages.length);
                  });
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _confirmDeletePage(BuildContext context, WidgetRef ref, DocumentPageEntry page) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Page?'),
        content: Text('Are you sure you want to delete Page ${page.pageIndex + 1}?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Navigator.pop(ctx);
              ref.read(documentNotifierProvider).deletePage(page.id, documentId);
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
