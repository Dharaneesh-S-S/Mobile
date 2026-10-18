import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../core/database/app_database.dart';
import '../providers/document_providers.dart';

class DocumentsDashboardScreen extends ConsumerStatefulWidget {
  const DocumentsDashboardScreen({super.key});

  @override
  ConsumerState<DocumentsDashboardScreen> createState() => _DocumentsDashboardScreenState();
}

class _DocumentsDashboardScreenState extends ConsumerState<DocumentsDashboardScreen> {
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _createProject() {
    final titleController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('New Document'),
        content: TextField(
          controller: titleController,
          decoration: const InputDecoration(
            labelText: 'Document Name',
            border: OutlineInputBorder(),
          ),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () async {
              final title = titleController.text.trim();
              if (title.isNotEmpty) {
                final id = await ref.read(documentNotifierProvider).createProject(title);
                if (context.mounted) {
                  Navigator.pop(context);
                  context.go('/documents/edit/$id');
                }
              }
            },
            child: const Text('Create'),
          ),
        ],
      ),
    );
  }

  void _showDeleteConfirmation(DocumentItemEntry doc) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Document?'),
        content: Text('Are you sure you want to permanently delete "${doc.title}" and all its pages?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              ref.read(documentNotifierProvider).deleteDocument(doc.id);
              Navigator.pop(ctx);
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final docsAsync = ref.watch(allDocumentsProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Word & Drawing Documents'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(64),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: SearchBar(
              controller: _searchController,
              hintText: 'Search documents by title...',
              leading: const Icon(Icons.search),
              trailing: [
                if (_searchQuery.isNotEmpty)
                  IconButton(
                    icon: const Icon(Icons.clear, size: 18),
                    onPressed: () {
                      _searchController.clear();
                      setState(() => _searchQuery = '');
                    },
                  ),
              ],
              onChanged: (val) => setState(() => _searchQuery = val.trim()),
            ),
          ),
        ),
      ),
      body: docsAsync.when(
        data: (docs) {
          final filtered = docs.where((d) {
            if (_searchQuery.isEmpty) return true;
            return d.title.toLowerCase().contains(_searchQuery.toLowerCase());
          }).toList();

          if (filtered.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.description_outlined, size: 64, color: theme.colorScheme.outline),
                    const SizedBox(height: 16),
                    Text(
                      _searchQuery.isNotEmpty
                          ? 'No documents matching "$_searchQuery".'
                          : 'No documents yet.\nCreate your first document with text and freehand drawing.',
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: filtered.length,
            itemBuilder: (context, index) {
              final doc = filtered[index];
              final updatedDate = DateTime.fromMillisecondsSinceEpoch(doc.updatedAtUtc);

              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                elevation: 1,
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  leading: Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(Icons.article_outlined, color: theme.colorScheme.primary),
                  ),
                  title: Text(doc.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(
                    'Modified: ${DateFormat('MMM d, yyyy • h:mm a').format(updatedDate)}',
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  onTap: () => context.go('/documents/edit/${doc.id}'),
                  trailing: PopupMenuButton<String>(
                    onSelected: (val) {
                      if (val == 'rename') {
                        final renameController = TextEditingController(text: doc.title);
                        showDialog(
                          context: context,
                          builder: (ctx) => AlertDialog(
                            title: const Text('Rename Document'),
                            content: TextField(
                              controller: renameController,
                              decoration: const InputDecoration(labelText: 'Document Name'),
                              autofocus: true,
                            ),
                            actions: [
                              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                              FilledButton(
                                onPressed: () {
                                  if (renameController.text.trim().isNotEmpty) {
                                    ref.read(documentNotifierProvider).updateProjectTitle(
                                          doc.id,
                                          renameController.text.trim(),
                                        );
                                    Navigator.pop(ctx);
                                  }
                                },
                                child: const Text('Rename'),
                              ),
                            ],
                          ),
                        );
                      } else if (val == 'duplicate') {
                        ref.read(documentNotifierProvider).duplicateDocument(doc);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Document duplicated')),
                        );
                      } else if (val == 'delete') {
                        _showDeleteConfirmation(doc);
                      }
                    },
                    itemBuilder: (context) => [
                      const PopupMenuItem(
                        value: 'rename',
                        child: Row(
                          children: [
                            Icon(Icons.edit_outlined, size: 18),
                            SizedBox(width: 8),
                            Text('Rename'),
                          ],
                        ),
                      ),
                      const PopupMenuItem(
                        value: 'duplicate',
                        child: Row(
                          children: [
                            Icon(Icons.copy, size: 18),
                            SizedBox(width: 8),
                            Text('Duplicate'),
                          ],
                        ),
                      ),
                      const PopupMenuItem(
                        value: 'delete',
                        child: Row(
                          children: [
                            Icon(Icons.delete_outline, size: 18, color: Colors.red),
                            SizedBox(width: 8),
                            Text('Delete', style: TextStyle(color: Colors.red)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Error: $err')),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _createProject,
        icon: const Icon(Icons.add),
        label: const Text('New Document'),
      ),
    );
  }
}
