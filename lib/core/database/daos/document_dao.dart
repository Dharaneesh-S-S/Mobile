import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/document_tables.dart';

part 'document_dao.g.dart';

@DriftAccessor(tables: [DocumentItems, DocumentPages])
class DocumentDao extends DatabaseAccessor<AppDatabase> with _$DocumentDaoMixin {
  DocumentDao(super.db);

  Future<List<DocumentItemEntry>> getAllDocuments() =>
      (select(documentItems)..orderBy([(d) => OrderingTerm.desc(d.updatedAtUtc)])).get();

  Stream<List<DocumentItemEntry>> watchAllDocuments() =>
      (select(documentItems)..orderBy([(d) => OrderingTerm.desc(d.updatedAtUtc)])).watch();

  Future<DocumentItemEntry?> getDocumentById(String id) =>
      (select(documentItems)..where((d) => d.id.equals(id))).getSingleOrNull();

  Future<int> insertDocument(DocumentItemsCompanion document) => into(documentItems).insert(document);

  Future<bool> updateDocument(DocumentItemEntry document) => update(documentItems).replace(document);

  Future<int> deleteDocument(String id) => (delete(documentItems)..where((d) => d.id.equals(id))).go();

  // Pages
  Future<List<DocumentPageEntry>> getPagesForDocument(String documentId) =>
      (select(documentPages)..where((p) => p.documentId.equals(documentId))..orderBy([(p) => OrderingTerm.asc(p.pageIndex)])).get();

  Stream<List<DocumentPageEntry>> watchPagesForDocument(String documentId) =>
      (select(documentPages)..where((p) => p.documentId.equals(documentId))..orderBy([(p) => OrderingTerm.asc(p.pageIndex)])).watch();

  Future<int> insertPage(DocumentPagesCompanion page) => into(documentPages).insert(page);

  Future<bool> updatePage(DocumentPageEntry page) => update(documentPages).replace(page);

  Future<int> deletePage(String pageId) => (delete(documentPages)..where((p) => p.id.equals(pageId))).go();
}
