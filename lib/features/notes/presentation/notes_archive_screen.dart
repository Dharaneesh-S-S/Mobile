import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../providers/notes_providers.dart';
import 'widgets/note_card.dart';

class NotesArchiveScreen extends ConsumerWidget {
  const NotesArchiveScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final archivedNotes = ref.watch(archivedNotesStreamProvider).valueOrNull ?? [];
    final viewMode = ref.watch(notesViewModeProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Archive'),
        actions: [
          IconButton(
            icon: Icon(viewMode == NotesViewMode.grid ? Icons.view_agenda_outlined : Icons.grid_view_outlined),
            onPressed: () {
              ref.read(notesViewModeProvider.notifier).state = 
                  viewMode == NotesViewMode.grid ? NotesViewMode.list : NotesViewMode.grid;
            },
          ),
        ],
      ),
      body: archivedNotes.isEmpty
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.archive_outlined, size: 100, color: Colors.grey.withOpacity(0.5)),
                  const SizedBox(height: 16),
                  Text('Your archived notes appear here', style: TextStyle(color: Colors.grey.shade600)),
                ],
              ),
            )
          : (viewMode == NotesViewMode.list
              ? ListView.builder(
                  padding: const EdgeInsets.all(8),
                  itemCount: archivedNotes.length,
                  itemBuilder: (context, index) => NoteCard(noteDetails: archivedNotes[index]),
                )
              : MasonryGridView.count(
                  padding: const EdgeInsets.all(8),
                  crossAxisCount: 2,
                  mainAxisSpacing: 8,
                  crossAxisSpacing: 8,
                  itemCount: archivedNotes.length,
                  itemBuilder: (context, index) => NoteCard(noteDetails: archivedNotes[index]),
                )),
    );
  }
}
