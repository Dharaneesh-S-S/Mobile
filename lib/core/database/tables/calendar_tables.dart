import 'package:drift/drift.dart';

/// Calendar events table
@DataClassName('CalendarEventEntry')
@TableIndex(name: 'idx_cal_start_time', columns: {#startTimeUtc})
class CalendarEvents extends Table {
  TextColumn get id => text()();
  TextColumn get title => text().withLength(min: 1, max: 256)();
  TextColumn get description => text().nullable()();
  IntColumn get startTimeUtc => integer()(); // UTC epoch milliseconds
  IntColumn get endTimeUtc => integer()();   // UTC epoch milliseconds
  BoolColumn get isAllDay => boolean().withDefault(const Constant(false))();
  TextColumn get recurrenceRule => text().nullable()(); // iCal RRULE or structured JSON
  TextColumn get location => text().nullable()();
  IntColumn get colorValue => integer().nullable()();
  BoolColumn get isCancelled => boolean().withDefault(const Constant(false))();
  TextColumn get eventType => text().withDefault(const Constant('event'))(); // 'event', 'birthday', 'holiday'
  TextColumn get reminderOffsets => text().nullable()(); // JSON array of integer minutes before event
  IntColumn get createdAtUtc => integer()();
  IntColumn get updatedAtUtc => integer()();

  @override
  Set<Column> get primaryKey => {id};
}
