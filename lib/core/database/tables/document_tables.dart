import 'package:drift/drift.dart';

/// Documents and vector drawing table.
/// Stores structured text and drawing vector coordinates in structured JSON format
/// to avoid duplicate image raster files.
@DataClassName('DocumentItemEntry')
@TableIndex(name: 'idx_doc_mime', columns: {#mimeType})
class DocumentItems extends Table {
  TextColumn get id => text()();
  TextColumn get title => text().withLength(min: 1, max: 256)();
  TextColumn get mimeType => text().withDefault(const Constant('application/json'))(); // 'text/markdown', 'application/json', 'application/pdf'
  TextColumn get filePath => text().nullable()(); // Local storage path if external
  TextColumn get contentStructuredJson => text().nullable()(); // Structured text/vector stroke JSON
  IntColumn get fileSizeBytes => integer().withDefault(const Constant(0))();
  IntColumn get createdAtUtc => integer()();
  IntColumn get updatedAtUtc => integer()();

  @override
  Set<Column> get primaryKey => {id};
}

@DataClassName('DocumentPageEntry')
class DocumentPages extends Table {
  TextColumn get id => text()();
  TextColumn get documentId => text().references(DocumentItems, #id, onDelete: KeyAction.cascade)();
  IntColumn get pageIndex => integer()();
  IntColumn get backgroundColor => integer().withDefault(const Constant(0xFFFFFFFF))(); // Default white
  TextColumn get textContentJson => text().withDefault(const Constant('[]'))(); // Quill JSON
  TextColumn get drawingContentJson => text().withDefault(const Constant('[]'))(); // Vector strokes JSON

  @override
  Set<Column> get primaryKey => {id};
}
