import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../providers/notes_providers.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/database/daos/note_dao.dart';
import 'widgets/note_card.dart';

class NotesTrashScreen extends ConsumerWidget {
  const NotesTrashScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final trashNotes = ref.watch(trashNotesStreamProvider).valueOrNull ?? [];
    final viewMode = ref.watch(notesViewModeProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Trash'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_forever),
            onPressed: () => _showEmptyTrashDialog(context, ref),
          ),
          IconButton(
            icon: Icon(viewMode == NotesViewMode.grid ? Icons.view_agenda_outlined : Icons.grid_view_outlined),
            onPressed: () {
              ref.read(notesViewModeProvider.notifier).state = 
                  viewMode == NotesViewMode.grid ? NotesViewMode.list : NotesViewMode.grid;
            },
          ),
        ],
      ),
      body: trashNotes.isEmpty
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.delete_outline, size: 100, color: Colors.grey.withOpacity(0.5)),
                  const SizedBox(height: 16),
                  Text('Trash is empty', style: TextStyle(color: Colors.grey.shade600)),
                ],
              ),
            )
          : (viewMode == NotesViewMode.list
              ? ListView.builder(
                  padding: const EdgeInsets.all(8),
                  itemCount: trashNotes.length,
                  itemBuilder: (context, index) => _buildTrashNoteCard(context, ref, trashNotes[index]),
                )
              : MasonryGridView.count(
                  padding: const EdgeInsets.all(8),
                  crossAxisCount: 2,
                  mainAxisSpacing: 8,
                  crossAxisSpacing: 8,
                  itemCount: trashNotes.length,
                  itemBuilder: (context, index) => _buildTrashNoteCard(context, ref, trashNotes[index]),
                )),
    );
  }

  Widget _buildTrashNoteCard(BuildContext context, WidgetRef ref, NoteWithDetails noteDetails) {
    return Stack(
      children: [
        NoteCard(noteDetails: noteDetails),
        Positioned.fill(
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {
                _showRestoreDialog(context, ref, noteDetails.note.id);
              },
            ),
          ),
        )
      ],
    );
  }

  void _showEmptyTrashDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Empty Trash?'),
        content: const Text('All notes in Trash will be permanently deleted.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              ref.read(databaseProvider).noteDao.emptyTrash();
              Navigator.pop(ctx);
            },
            child: const Text('Empty Trash', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _showRestoreDialog(BuildContext context, WidgetRef ref, String noteId) {
    showModalBottomSheet(
      context: context,
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.restore),
              title: const Text('Restore'),
              onTap: () {
                ref.read(databaseProvider).noteDao.restoreFromTrash(noteId);
                Navigator.pop(ctx);
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete_forever, color: Colors.red),
              title: const Text('Delete permanently', style: TextStyle(color: Colors.red)),
              onTap: () {
                Navigator.pop(ctx);
                showDialog(
                  context: context,
                  builder: (ctx2) => AlertDialog(
                    title: const Text('Delete permanently?'),
                    content: const Text('This action cannot be undone.'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx2), child: const Text('Cancel')),
                      TextButton(
                        onPressed: () {
                          ref.read(databaseProvider).noteDao.permanentlyDeleteNote(noteId);
                          Navigator.pop(ctx2);
                        },
                        child: const Text('Delete', style: TextStyle(color: Colors.red)),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
