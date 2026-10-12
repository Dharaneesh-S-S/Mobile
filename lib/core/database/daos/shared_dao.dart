import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/shared_tables.dart';

part 'shared_dao.g.dart';

@DriftAccessor(tables: [Tags, EntityCrossLinks])
class SharedDao extends DatabaseAccessor<AppDatabase> with _$SharedDaoMixin {
  SharedDao(super.db);

  // Tags Operations
  Future<List<TagEntry>> getAllTags() => select(tags).get();

  Stream<List<TagEntry>> watchAllTags() => select(tags).watch();

  Future<int> insertTag(TagsCompanion entry) => into(tags).insert(entry);

  Future<bool> updateTag(TagEntry entry) => update(tags).replace(entry);

  Future<int> deleteTag(String id) => (delete(tags)..where((t) => t.id.equals(id))).go();

  // Cross-Linking Operations
  Future<int> linkEntities({
    required String id,
    required String sourceType,
    required String sourceId,
    required String targetType,
    required String targetId,
    String relationType = 'linked_to',
    required int createdAtUtc,
  }) {
    return into(entityCrossLinks).insert(
      EntityCrossLinksCompanion.insert(
        id: id,
        sourceType: sourceType,
        sourceId: sourceId,
        targetType: targetType,
        targetId: targetId,
        relationType: Value(relationType),
        createdAtUtc: createdAtUtc,
      ),
    );
  }

  Future<List<EntityCrossLink>> getLinksForEntity(String entityType, String entityId) {
    return (select(entityCrossLinks)
          ..where((l) =>
              (l.sourceType.equals(entityType) & l.sourceId.equals(entityId)) |
              (l.targetType.equals(entityType) & l.targetId.equals(entityId))))
        .get();
  }

  Future<int> removeLink(String id) {
    return (delete(entityCrossLinks)..where((l) => l.id.equals(id))).go();
  }
}
