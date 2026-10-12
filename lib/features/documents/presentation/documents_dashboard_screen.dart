import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../providers/document_providers.dart';

class DocumentsDashboardScreen extends ConsumerStatefulWidget {
  const DocumentsDashboardScreen({super.key});

  @override
  ConsumerState<DocumentsDashboardScreen> createState() => _DocumentsDashboardScreenState();
}

class _DocumentsDashboardScreenState extends ConsumerState<DocumentsDashboardScreen> {
  String _searchQuery = '';

  void _createProject() {
    final titleController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('New Document'),
        content: TextField(
          controller: titleController,
          decoration: const InputDecoration(labelText: 'Document Name'),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () async {
              if (titleController.text.trim().isNotEmpty) {
                final id = await ref.read(documentNotifierProvider).createProject(titleController.text.trim());
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

  @override
  Widget build(BuildContext context) {
    final docsAsync = ref.watch(allDocumentsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Documents'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: SearchBar(
              hintText: 'Search documents...',
              leading: const Icon(Icons.search),
              onChanged: (val) => setState(() => _searchQuery = val),
            ),
          ),
        ),
      ),
      body: docsAsync.when(
        data: (docs) {
          final filtered = docs.where((d) => d.title.toLowerCase().contains(_searchQuery.toLowerCase())).toList();
          
          if (filtered.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.description_outlined, size: 64, color: Theme.of(context).colorScheme.outline),
                  const SizedBox(height: 16),
                  const Text('No documents found'),
                ],
              ),
            );
          }

          return ListView.builder(
            itemCount: filtered.length,
            itemBuilder: (context, index) {
              final doc = filtered[index];
              return ListTile(
                leading: const Icon(Icons.article),
                title: Text(doc.title),
                subtitle: Text('Last updated: ${DateTime.fromMillisecondsSinceEpoch(doc.updatedAtUtc)}'),
                onTap: () => context.go('/documents/edit/${doc.id}'),
                trailing: PopupMenuButton(
                  itemBuilder: (context) => [
                    const PopupMenuItem(
                      value: 'rename',
                      child: Text('Rename'),
                    ),
                    const PopupMenuItem(
                      value: 'duplicate',
                      child: Text('Duplicate'),
                    ),
                    const PopupMenuItem(
                      value: 'delete',
                      child: Text('Delete'),
                    ),
                  ],
                  onSelected: (val) {
                    if (val == 'rename') {
                      final renameController = TextEditingController(text: doc.title);
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          title: const Text('Rename Document'),
                          content: TextField(
                            controller: renameController,
                            decoration: const InputDecoration(labelText: 'Document Name'),
                            autofocus: true,
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('Cancel'),
                            ),
                            FilledButton(
                              onPressed: () {
                                if (renameController.text.trim().isNotEmpty) {
                                  ref.read(documentNotifierProvider).updateProjectTitle(doc.id, renameController.text.trim());
                                  Navigator.pop(context);
                                }
                              },
                              child: const Text('Rename'),
                            ),
                          ],
                        ),
                      );
                    } else if (val == 'duplicate') {
                      ref.read(documentNotifierProvider).duplicateDocument(doc);
                    } else if (val == 'delete') {
                      ref.read(documentNotifierProvider).deleteDocument(doc.id);
                    }
                  },
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
