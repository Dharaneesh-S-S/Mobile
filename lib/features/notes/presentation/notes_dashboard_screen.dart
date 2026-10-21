import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:go_router/go_router.dart';
import '../providers/notes_providers.dart';
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/database/daos/note_dao.dart';
import 'widgets/note_card.dart';
import 'notes_web_view.dart';

class NotesDashboardScreen extends ConsumerWidget {
  const NotesDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (kIsWeb) {
      return const Scaffold(
        body: SafeArea(
          child: AuraNotesWebView(),
        ),
      );
    }
    final searchController = TextEditingController(text: ref.read(notesSearchQueryProvider));
    final viewMode = ref.watch(notesViewModeProvider);
    final pinnedNotes = ref.watch(pinnedNotesProvider);
    final unpinnedNotes = ref.watch(unpinnedNotesProvider);
    
    final labels = ref.watch(allLabelsStreamProvider).valueOrNull ?? [];
    final activeLabel = ref.watch(notesLabelFilterProvider);

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: searchController,
          decoration: const InputDecoration(
            hintText: 'Search your notes',
            border: InputBorder.none,
            icon: Icon(Icons.search),
          ),
          onChanged: (val) => ref.read(notesSearchQueryProvider.notifier).state = val,
        ),
        actions: [
          IconButton(
            icon: Icon(viewMode == NotesViewMode.grid ? Icons.view_agenda_outlined : Icons.grid_view_outlined),
            onPressed: () {
              ref.read(notesViewModeProvider.notifier).state = 
                  viewMode == NotesViewMode.grid ? NotesViewMode.list : NotesViewMode.grid;
            },
          ),
          PopupMenuButton(
            icon: const Icon(Icons.more_vert),
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'archive',
                child: Text('Archive'),
              ),
              const PopupMenuItem(
                value: 'trash',
                child: Text('Trash'),
              ),
            ],
            onSelected: (val) {
              if (val == 'archive') {
                context.push('/notes/archive');
              } else if (val == 'trash') {
                context.push('/notes/trash');
              }
            },
          )
        ],
      ),
      drawer: Drawer(
        child: ListView(
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Colors.blue),
              child: Text('Notes', style: TextStyle(color: Colors.white, fontSize: 24)),
            ),
            ListTile(
              leading: const Icon(Icons.lightbulb_outline),
              title: const Text('Notes'),
              selected: activeLabel == null,
              onTap: () {
                ref.read(notesLabelFilterProvider.notifier).state = null;
                Navigator.pop(context);
              },
            ),
            const Divider(),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Text('LABELS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            ),
            ...labels.map((label) => ListTile(
              leading: const Icon(Icons.label_outline),
              title: Text(label.name),
              selected: activeLabel == label.id,
              onTap: () {
                ref.read(notesLabelFilterProvider.notifier).state = label.id;
                Navigator.pop(context);
              },
            )),
            ListTile(
              leading: const Icon(Icons.add),
              title: const Text('Create new label'),
              onTap: () {
                Navigator.pop(context);
                _showCreateLabelDialog(context, ref);
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.archive_outlined),
              title: const Text('Archive'),
              onTap: () {
                Navigator.pop(context);
                context.push('/notes/archive');
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete_outline),
              title: const Text('Trash'),
              onTap: () {
                Navigator.pop(context);
                context.push('/notes/trash');
              },
            ),
          ],
        ),
      ),
      body: CustomScrollView(
        slivers: [
          if (pinnedNotes.isNotEmpty) ...[
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: Text('PINNED', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              ),
            ),
            _buildNotesGrid(pinnedNotes, viewMode),
          ],
          if (unpinnedNotes.isNotEmpty) ...[
            if (pinnedNotes.isNotEmpty)
              const SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text('OTHERS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ),
            _buildNotesGrid(unpinnedNotes, viewMode),
          ],
          if (pinnedNotes.isEmpty && unpinnedNotes.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.lightbulb_outline, size: 100, color: Colors.grey.withOpacity(0.5)),
                    const SizedBox(height: 16),
                    Text(
                      activeLabel == null ? 'Notes you add appear here' : 'No notes with this label',
                      style: TextStyle(color: Colors.grey.shade600),
                    ),
                  ],
                ),
              ),
            )
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          context.push('/notes/edit');
        },
        child: const Icon(Icons.add),
      ),
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        child: Row(
          children: [
            IconButton(
              icon: const Icon(Icons.check_box_outlined),
              onPressed: () {
                context.push('/notes/edit', extra: {'type': 'checklist'});
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotesGrid(List<NoteWithDetails> notes, NotesViewMode mode) {
    if (mode == NotesViewMode.list) {
      return SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) => NoteCard(noteDetails: notes[index]),
          childCount: notes.length,
        ),
      );
    } else {
      return SliverMasonryGrid.count(
        crossAxisCount: 2,
        mainAxisSpacing: 8,
        crossAxisSpacing: 8,
        childCount: notes.length,
        itemBuilder: (context, index) {
          return NoteCard(noteDetails: notes[index]);
        },
      );
    }
  }

  void _showCreateLabelDialog(BuildContext context, WidgetRef ref) {
    final ctrl = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('New Label'),
        content: TextField(
          controller: ctrl,
          autofocus: true,
          decoration: const InputDecoration(hintText: 'Enter label name'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              if (ctrl.text.trim().isNotEmpty) {
                ref.read(databaseProvider).noteDao.insertLabel(
                  NoteLabelsCompanion.insert(
                    id: DateTime.now().millisecondsSinceEpoch.toString(),
                    name: ctrl.text.trim(),
                    createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
                  )
                );
              }
              Navigator.pop(ctx);
            },
            child: const Text('Create'),
          ),
        ],
      ),
    );
  }
}
