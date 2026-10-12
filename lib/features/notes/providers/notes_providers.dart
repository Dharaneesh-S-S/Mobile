import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/database/daos/note_dao.dart';

final activeNotesStreamProvider = StreamProvider.autoDispose<List<NoteWithDetails>>((ref) {
  return ref.watch(databaseProvider).noteDao.watchNotesByStatus(isArchived: false, isDeleted: false);
});

final archivedNotesStreamProvider = StreamProvider.autoDispose<List<NoteWithDetails>>((ref) {
  return ref.watch(databaseProvider).noteDao.watchNotesByStatus(isArchived: true, isDeleted: false);
});

final trashNotesStreamProvider = StreamProvider.autoDispose<List<NoteWithDetails>>((ref) {
  return ref.watch(databaseProvider).noteDao.watchNotesByStatus(isArchived: false, isDeleted: true);
});

final allLabelsStreamProvider = StreamProvider.autoDispose<List<NoteLabelEntry>>((ref) {
  return ref.watch(databaseProvider).noteDao.watchAllLabels();
});

// View modes
enum NotesViewMode { grid, list }

final notesViewModeProvider = StateProvider<NotesViewMode>((ref) => NotesViewMode.grid);

// Search
final notesSearchQueryProvider = StateProvider<String>((ref) => '');

// Filter by label
final notesLabelFilterProvider = StateProvider<String?>((ref) => null);

// Derived filtered notes
final filteredActiveNotesProvider = Provider.autoDispose<List<NoteWithDetails>>((ref) {
  final notes = ref.watch(activeNotesStreamProvider).valueOrNull ?? [];
  final query = ref.watch(notesSearchQueryProvider).toLowerCase();
  final labelId = ref.watch(notesLabelFilterProvider);
  
  return notes.where((note) {
    bool matchesQuery = true;
    if (query.isNotEmpty) {
      final titleMatch = (note.note.title?.toLowerCase() ?? '').contains(query);
      final contentMatch = (note.note.content?.toLowerCase() ?? '').contains(query);
      matchesQuery = titleMatch || contentMatch;
    }
    
    bool matchesLabel = true;
    if (labelId != null) {
      matchesLabel = note.labels.any((l) => l.id == labelId);
    }
    
    return matchesQuery && matchesLabel;
  }).toList();
});

// Pinned notes
final pinnedNotesProvider = Provider.autoDispose<List<NoteWithDetails>>((ref) {
  final notes = ref.watch(filteredActiveNotesProvider);
  return notes.where((n) => n.note.isPinned).toList();
});

// Regular notes
final unpinnedNotesProvider = Provider.autoDispose<List<NoteWithDetails>>((ref) {
  final notes = ref.watch(filteredActiveNotesProvider);
  return notes.where((n) => !n.note.isPinned).toList();
});
