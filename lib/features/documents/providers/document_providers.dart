import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart' as drift;

import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';

// Provider for all document projects
final allDocumentsProvider = StreamProvider<List<DocumentItemEntry>>((ref) {
  final db = ref.watch(databaseProvider);
  return db.documentDao.watchAllDocuments();
});

// Provider for pages of a specific document
final documentPagesProvider = StreamProvider.family<List<DocumentPageEntry>, String>((ref, documentId) {
  final db = ref.watch(databaseProvider);
  return db.documentDao.watchPagesForDocument(documentId);
});

class DocumentNotifier {
  final AppDatabase _db;

  DocumentNotifier(this._db);

  Future<String> createProject(String title) async {
    final docId = const Uuid().v4();
    await _db.documentDao.insertDocument(
      DocumentItemsCompanion.insert(
        id: docId,
        title: title,
        createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
      ),
    );

    // Create initial page
    await addPage(docId, 0);

    return docId;
  }

  Future<void> addPage(String documentId, int index) async {
    final pageId = const Uuid().v4();
    await _db.documentDao.insertPage(
      DocumentPagesCompanion.insert(
        id: pageId,
        documentId: documentId,
        pageIndex: index,
        backgroundColor: const drift.Value(0xFFFFFFFF), // Default white
      ),
    );
  }

  Future<void> updateProjectTitle(String documentId, String title) async {
    final doc = await (_db.select(_db.documentItems)..where((d) => d.id.equals(documentId))).getSingleOrNull();
    if (doc != null) {
      await _db.documentDao.updateDocument(
        doc.copyWith(
          title: title,
          updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        ),
      );
    }
  }

  Future<void> updatePageContent(String pageId, String textJson, String drawingJson) async {
    final page = await (_db.select(_db.documentPages)..where((p) => p.id.equals(pageId))).getSingleOrNull();
    if (page != null) {
      await _db.documentDao.updatePage(
        page.copyWith(
          textContentJson: textJson,
          drawingContentJson: drawingJson,
        ),
      );
    }
  }

  Future<void> updatePageBackground(String pageId, int colorValue) async {
    final page = await (_db.select(_db.documentPages)..where((p) => p.id.equals(pageId))).getSingleOrNull();
    if (page != null) {
      await _db.documentDao.updatePage(
        page.copyWith(
          backgroundColor: colorValue,
        ),
      );
    }
  }

  Future<void> deleteDocument(String id) async {
    await _db.documentDao.deleteDocument(id);
  }

  Future<void> duplicateDocument(DocumentItemEntry original) async {
    final newDocId = const Uuid().v4();
    await _db.documentDao.insertDocument(
      DocumentItemsCompanion.insert(
        id: newDocId,
        title: '${original.title} (Copy)',
        createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
        updatedAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
      ),
    );

    final pages = await _db.documentDao.getPagesForDocument(original.id);
    for (var page in pages) {
      await _db.documentDao.insertPage(
        DocumentPagesCompanion.insert(
          id: const Uuid().v4(),
          documentId: newDocId,
          pageIndex: page.pageIndex,
          backgroundColor: drift.Value(page.backgroundColor),
          textContentJson: drift.Value(page.textContentJson),
          drawingContentJson: drift.Value(page.drawingContentJson),
        ),
      );
    }
  }
}

final documentNotifierProvider = Provider<DocumentNotifier>((ref) {
  return DocumentNotifier(ref.watch(databaseProvider));
});
