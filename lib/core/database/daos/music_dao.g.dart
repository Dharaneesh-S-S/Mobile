// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'music_dao.dart';

// ignore_for_file: type=lint
mixin _$MusicDaoMixin on DatabaseAccessor<AppDatabase> {
  $MusicPlaylistsTable get musicPlaylists => attachedDatabase.musicPlaylists;
  $PlaylistSongsTable get playlistSongs => attachedDatabase.playlistSongs;
  $SongMetadataTable get songMetadata => attachedDatabase.songMetadata;
  MusicDaoManager get managers => MusicDaoManager(this);
}

class MusicDaoManager {
  final _$MusicDaoMixin _db;
  MusicDaoManager(this._db);
  $$MusicPlaylistsTableTableManager get musicPlaylists =>
      $$MusicPlaylistsTableTableManager(
        _db.attachedDatabase,
        _db.musicPlaylists,
      );
  $$PlaylistSongsTableTableManager get playlistSongs =>
      $$PlaylistSongsTableTableManager(_db.attachedDatabase, _db.playlistSongs);
  $$SongMetadataTableTableManager get songMetadata =>
      $$SongMetadataTableTableManager(_db.attachedDatabase, _db.songMetadata);
}
