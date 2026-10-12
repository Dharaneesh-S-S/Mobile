import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/calendar_tables.dart';

part 'calendar_dao.g.dart';

@DriftAccessor(tables: [CalendarEvents])
class CalendarDao extends DatabaseAccessor<AppDatabase> with _$CalendarDaoMixin {
  CalendarDao(super.db);

  Future<List<CalendarEventEntry>> getAllEvents() => select(calendarEvents).get();

  Stream<List<CalendarEventEntry>> watchAllEvents() => select(calendarEvents).watch();

  Future<List<CalendarEventEntry>> getEventsInRange(int startUtc, int endUtc) {
    return (select(calendarEvents)
          ..where((e) =>
              e.startTimeUtc.isSmallerOrEqualValue(endUtc) &
              e.endTimeUtc.isBiggerOrEqualValue(startUtc) &
              e.isCancelled.equals(false))
          ..orderBy([(e) => OrderingTerm.asc(e.startTimeUtc)]))
        .get();
  }

  Future<CalendarEventEntry?> getEventById(String id) {
    return (select(calendarEvents)..where((e) => e.id.equals(id))).getSingleOrNull();
  }

  Future<int> insertEvent(CalendarEventsCompanion entry) => into(calendarEvents).insert(entry);

  Future<bool> updateEvent(CalendarEventEntry entry) => update(calendarEvents).replace(entry);

  Future<int> deleteEvent(String id) => (delete(calendarEvents)..where((e) => e.id.equals(id))).go();
}
