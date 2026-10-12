import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/music_tables.dart';

part 'music_dao.g.dart';

@DriftAccessor(tables: [MusicPlaylists, PlaylistSongs, SongMetadata])
class MusicDao extends DatabaseAccessor<AppDatabase> with _$MusicDaoMixin {
  MusicDao(super.db);

  // Playlists
  Future<List<MusicPlaylist>> getAllPlaylists() => select(musicPlaylists).get();
  Stream<List<MusicPlaylist>> watchAllPlaylists() => select(musicPlaylists).watch();
  Future<int> insertPlaylist(MusicPlaylistsCompanion playlist) => into(musicPlaylists).insert(playlist);
  Future<bool> updatePlaylist(MusicPlaylist playlist) => update(musicPlaylists).replace(playlist);
  Future<int> deletePlaylist(MusicPlaylist playlist) => delete(musicPlaylists).delete(playlist);

  // Playlist Songs
  Stream<List<PlaylistSong>> watchSongsForPlaylist(String playlistId) {
    return (select(playlistSongs)..where((t) => t.playlistId.equals(playlistId))
      ..orderBy([(t) => OrderingTerm(expression: t.sortOrder)])).watch();
  }
  Future<int> addSongToPlaylist(PlaylistSongsCompanion song) => into(playlistSongs).insert(song);
  Future<int> removeSongFromPlaylist(String playlistId, String songPath) {
    return (delete(playlistSongs)..where((t) => t.playlistId.equals(playlistId) & t.songPath.equals(songPath))).go();
  }

  // Song Metadata (favorites, play count)
  Stream<SongMetadataData?> watchSongMetadata(String path) {
    return (select(songMetadata)..where((t) => t.songPath.equals(path))).watchSingleOrNull();
  }
  Future<SongMetadataData?> getSongMetadata(String path) {
    return (select(songMetadata)..where((t) => t.songPath.equals(path))).getSingleOrNull();
  }
  
  Future<void> toggleFavorite(String path) async {
    final meta = await getSongMetadata(path);
    if (meta == null) {
      await into(songMetadata).insert(SongMetadataCompanion.insert(
        songPath: path,
        isFavorite: const Value(true),
      ));
    } else {
      await update(songMetadata).replace(meta.copyWith(isFavorite: !meta.isFavorite));
    }
  }

  Future<void> incrementPlayCount(String path) async {
    final meta = await getSongMetadata(path);
    if (meta == null) {
      await into(songMetadata).insert(SongMetadataCompanion.insert(
        songPath: path,
        playCount: const Value(1),
        lastPlayed: Value(DateTime.now()),
      ));
    } else {
      await update(songMetadata).replace(meta.copyWith(
        playCount: meta.playCount + 1,
        lastPlayed: Value(DateTime.now()),
      ));
    }
  }
}
