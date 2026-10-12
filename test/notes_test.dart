import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:drift/native.dart';
import 'package:drift/drift.dart' hide isNotNull, isNull;
import 'package:personal_hub/core/database/app_database.dart';
import 'package:personal_hub/core/database/daos/note_dao.dart';

void main() {
  late AppDatabase database;
  late NoteDao noteDao;

  setUp(() {
    database = AppDatabase(NativeDatabase.memory());
    noteDao = database.noteDao;
  });

  tearDown(() async {
    await database.close();
  });

  test('Notes CRUD, pinning, archiving, trash recovery', () async {
    // 1. Create a label
    final labelCompanion = NoteLabelsCompanion.insert(
      id: 'label-1',
      name: 'Work',
      createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
    );
    await noteDao.insertLabel(labelCompanion);

    // 2. Create a Text Note
    final noteId = 'note-1';
    final contentJson = jsonEncode([{"insert": "Hello World\n"}]);
    final noteCompanion = NoteItemsCompanion.insert(
      id: noteId,
      title: const Value('Test Note'),
      content: Value(contentJson),
      type: const Value('text'),
      isPinned: const Value(true),
      createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
      updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
    );

    await noteDao.createNote(noteCompanion, ['label-1'], []);

    // 3. Read note and verify
    var noteWithDetails = await noteDao.getNoteById(noteId);
    expect(noteWithDetails, isNotNull);
    expect(noteWithDetails!.note.title, 'Test Note');
    expect(noteWithDetails.note.isPinned, true);
    expect(noteWithDetails.labels.length, 1);
    expect(noteWithDetails.labels.first.name, 'Work');
    expect(noteWithDetails.note.content, contentJson); // Formatting persistence

    // 4. Update note
    final updatedNote = NoteItemEntry(
      id: noteId,
      title: 'Updated Note',
      content: contentJson,
      type: 'text',
      colorValue: null,
      isPinned: true,
      isArchived: false,
      isDeleted: false,
      createdAtUtc: noteWithDetails.note.createdAtUtc,
      updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
    );
    await noteDao.updateNoteWithDetails(updatedNote, [], []); // Remove labels

    noteWithDetails = await noteDao.getNoteById(noteId);
    expect(noteWithDetails!.note.title, 'Updated Note');
    expect(noteWithDetails.labels.isEmpty, true);

    // 5. Create Checklist Note
    final checklistId = 'note-2';
    final checklistCompanion = NoteItemsCompanion.insert(
      id: checklistId,
      title: const Value('Shopping List'),
      type: const Value('checklist'),
      createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
      updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
    );
    final items = [
      ChecklistItemsCompanion.insert(id: 'item-1', noteId: checklistId, itemText: 'Milk', isChecked: const Value(false), sortOrder: const Value(0)),
      ChecklistItemsCompanion.insert(id: 'item-2', noteId: checklistId, itemText: 'Eggs', isChecked: const Value(true), sortOrder: const Value(1)),
    ];
    await noteDao.createNote(checklistCompanion, [], items);

    // 6. Checklist operations
    var checklistNote = await noteDao.getNoteById(checklistId);
    expect(checklistNote!.checklistItems.length, 2);
    expect(checklistNote.checklistItems[1].isChecked, true);

    // Toggle checklist item
    await noteDao.toggleChecklistItem('item-1', true);
    checklistNote = await noteDao.getNoteById(checklistId);
    expect(checklistNote!.checklistItems[0].isChecked, true);

    // 7. Archiving
    await noteDao.toggleArchive(noteId, true);
    noteWithDetails = await noteDao.getNoteById(noteId);
    expect(noteWithDetails!.note.isArchived, true);
    expect(noteWithDetails.note.isPinned, false); // Pin is removed on archive

    // 8. Trash recovery
    await noteDao.moveToTrash(checklistId);
    checklistNote = await noteDao.getNoteById(checklistId);
    expect(checklistNote!.note.isDeleted, true);

    await noteDao.restoreFromTrash(checklistId);
    checklistNote = await noteDao.getNoteById(checklistId);
    expect(checklistNote!.note.isDeleted, false);

    // 9. Permanently delete
    await noteDao.moveToTrash(noteId);
    await noteDao.emptyTrash();
    noteWithDetails = await noteDao.getNoteById(noteId);
    expect(noteWithDetails, isNull);
  });
}
