import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/note_tables.dart';

part 'note_dao.g.dart';

class NoteWithDetails {
  final NoteItemEntry note;
  final List<NoteLabelEntry> labels;
  final List<ChecklistItemEntry> checklistItems;

  NoteWithDetails({
    required this.note,
    required this.labels,
    required this.checklistItems,
  });
}

@DriftAccessor(tables: [NoteLabels, NoteItems, NoteLabelCrossRef, ChecklistItems])
class NoteDao extends DatabaseAccessor<AppDatabase> with _$NoteDaoMixin {
  NoteDao(super.db);

  // LABELS
  Stream<List<NoteLabelEntry>> watchAllLabels() => select(noteLabels).watch();
  
  Future<List<NoteLabelEntry>> getAllLabels() => select(noteLabels).get();

  Future<int> insertLabel(NoteLabelsCompanion label) => into(noteLabels).insert(label);

  Future<bool> updateLabel(NoteLabelEntry label) => update(noteLabels).replace(label);

  Future<int> deleteLabel(String id) => (delete(noteLabels)..where((l) => l.id.equals(id))).go();

  // NOTES
  Stream<List<NoteWithDetails>> watchNotesByStatus({bool isArchived = false, bool isDeleted = false}) {
    final notesQuery = select(noteItems)
      ..where((n) => n.isArchived.equals(isArchived) & n.isDeleted.equals(isDeleted))
      ..orderBy([(n) => OrderingTerm.desc(n.isPinned), (n) => OrderingTerm.desc(n.updatedAtUtc)]);
    
    return notesQuery.watch().asyncMap((notes) async {
      final List<NoteWithDetails> detailedNotes = [];
      for (final note in notes) {
        detailedNotes.add(await _getDetailsForNote(note));
      }
      return detailedNotes;
    });
  }

  Future<NoteWithDetails> _getDetailsForNote(NoteItemEntry note) async {
    final labelsQuery = select(noteLabels).join([
      innerJoin(noteLabelCrossRef, noteLabelCrossRef.labelId.equalsExp(noteLabels.id)),
    ])..where(noteLabelCrossRef.noteId.equals(note.id));
    
    final labels = await labelsQuery.map((row) => row.readTable(noteLabels)).get();
    
    final checklist = await (select(checklistItems)
          ..where((c) => c.noteId.equals(note.id))
          ..orderBy([(c) => OrderingTerm.asc(c.sortOrder)]))
        .get();
        
    return NoteWithDetails(
      note: note,
      labels: labels,
      checklistItems: checklist,
    );
  }

  Future<NoteWithDetails?> getNoteById(String id) async {
    final note = await (select(noteItems)..where((n) => n.id.equals(id))).getSingleOrNull();
    if (note == null) return null;
    return _getDetailsForNote(note);
  }

  Future<void> createNote(NoteItemsCompanion note, List<String> labelIds, List<ChecklistItemsCompanion> checklist) async {
    await transaction(() async {
      await into(noteItems).insert(note);
      
      final noteId = note.id.value;
      for (final labelId in labelIds) {
        await into(noteLabelCrossRef).insert(NoteLabelCrossRefCompanion(
          noteId: Value(noteId),
          labelId: Value(labelId),
        ));
      }
      
      for (final item in checklist) {
        await into(checklistItems).insert(item.copyWith(noteId: Value(noteId)));
      }
    });
  }

  Future<void> updateNoteWithDetails(NoteItemEntry note, List<String> labelIds, List<ChecklistItemEntry> checklist) async {
    await transaction(() async {
      await update(noteItems).replace(note);
      
      // Update labels
      await (delete(noteLabelCrossRef)..where((ref) => ref.noteId.equals(note.id))).go();
      for (final labelId in labelIds) {
        await into(noteLabelCrossRef).insert(NoteLabelCrossRefCompanion(
          noteId: Value(note.id),
          labelId: Value(labelId),
        ));
      }
      
      // Update checklist
      await (delete(checklistItems)..where((c) => c.noteId.equals(note.id))).go();
      for (final item in checklist) {
        await into(checklistItems).insert(item);
      }
    });
  }
  
  Future<void> updateNoteOnly(NoteItemEntry note) async {
    await update(noteItems).replace(note);
  }

  Future<void> moveToTrash(String id) async {
    await (update(noteItems)..where((n) => n.id.equals(id))).write(NoteItemsCompanion(
      isDeleted: const Value(true),
      isPinned: const Value(false),
      updatedAtUtc: Value(DateTime.now().toUtc().millisecondsSinceEpoch),
    ));
  }
  
  Future<void> restoreFromTrash(String id) async {
    await (update(noteItems)..where((n) => n.id.equals(id))).write(NoteItemsCompanion(
      isDeleted: const Value(false),
      updatedAtUtc: Value(DateTime.now().toUtc().millisecondsSinceEpoch),
    ));
  }
  
  Future<void> toggleArchive(String id, bool archive) async {
    await (update(noteItems)..where((n) => n.id.equals(id))).write(NoteItemsCompanion(
      isArchived: Value(archive),
      isPinned: archive ? const Value(false) : const Value(false),
      updatedAtUtc: Value(DateTime.now().toUtc().millisecondsSinceEpoch),
    ));
  }
  
  Future<void> togglePin(String id, bool pin) async {
    await (update(noteItems)..where((n) => n.id.equals(id))).write(NoteItemsCompanion(
      isPinned: Value(pin),
      isArchived: pin ? const Value(false) : const Value(false),
      updatedAtUtc: Value(DateTime.now().toUtc().millisecondsSinceEpoch),
    ));
  }

  Future<int> permanentlyDeleteNote(String id) => (delete(noteItems)..where((n) => n.id.equals(id))).go();
  
  Future<int> emptyTrash() => (delete(noteItems)..where((n) => n.isDeleted.equals(true))).go();
  
  Future<void> toggleChecklistItem(String id, bool isChecked) async {
    await (update(checklistItems)..where((c) => c.id.equals(id))).write(ChecklistItemsCompanion(
      isChecked: Value(isChecked),
    ));
  }
}
