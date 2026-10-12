import 'package:intl/intl.dart';

/// Utilities for consistent UTC timestamp storage and local device timezone presentation.
class DateTimeUtils {
  static final DateFormat _dateFormat = DateFormat('dd MMM yyyy');
  static final DateFormat _timeFormat = DateFormat('hh:mm a');
  static final DateFormat _dateTimeFormat = DateFormat('dd MMM yyyy, hh:mm a');
  static final DateFormat _isoUtcFormat = DateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");

  /// Returns the current time in UTC milliseconds since epoch.
  static int currentUtcMillis() {
    return DateTime.now().toUtc().millisecondsSinceEpoch;
  }

  /// Converts a UTC millisecond timestamp to local [DateTime].
  static DateTime utcMillisToLocal(int utcMillis) {
    return DateTime.fromMillisecondsSinceEpoch(utcMillis, isUtc: true).toLocal();
  }

  /// Converts a [DateTime] (local or UTC) to UTC milliseconds since epoch.
  static int toUtcMillis(DateTime dateTime) {
    return dateTime.toUtc().millisecondsSinceEpoch;
  }

  /// Formats UTC millis as local date string: e.g. "01 Oct 2026".
  static String formatLocalDate(int utcMillis) {
    final local = utcMillisToLocal(utcMillis);
    return _dateFormat.format(local);
  }

  /// Formats UTC millis as local time string: e.g. "01:30 PM".
  static String formatLocalTime(int utcMillis) {
    final local = utcMillisToLocal(utcMillis);
    return _timeFormat.format(local);
  }

  /// Formats UTC millis as local date & time: e.g. "01 Oct 2026, 01:30 PM".
  static String formatLocalDateTime(int utcMillis) {
    final local = utcMillisToLocal(utcMillis);
    return _dateTimeFormat.format(local);
  }

  /// Converts UTC millis to ISO 8601 string for backup / metadata.
  static String toIso8601Utc(int utcMillis) {
    final utc = DateTime.fromMillisecondsSinceEpoch(utcMillis, isUtc: true);
    return _isoUtcFormat.format(utc);
  }
}
