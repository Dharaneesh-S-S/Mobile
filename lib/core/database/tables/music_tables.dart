import 'package:drift/drift.dart';

// Represents user-created playlists
class MusicPlaylists extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  DateTimeColumn get createdAt => dateTime()();

  @override
  Set<Column> get primaryKey => {id};
}

// Represents the association between a song (by path) and a playlist
class PlaylistSongs extends Table {
  TextColumn get playlistId => text().references(MusicPlaylists, #id, onDelete: KeyAction.cascade)();
  TextColumn get songPath => text()();
  IntColumn get sortOrder => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {playlistId, songPath};
}

// Stores favorites and play counts for songs (identified by their absolute path)
class SongMetadata extends Table {
  TextColumn get songPath => text()();
  BoolColumn get isFavorite => boolean().withDefault(const Constant(false))();
  IntColumn get playCount => integer().withDefault(const Constant(0))();
  DateTimeColumn get lastPlayed => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {songPath};
}
