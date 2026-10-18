import 'package:drift/drift.dart' hide isNull, isNotNull;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:on_audio_query/on_audio_query.dart';
import 'package:personal_hub/core/database/app_database.dart';
import 'package:personal_hub/features/music/models/music_models.dart';
import 'package:personal_hub/features/music/providers/music_library_provider.dart';

void main() {
  group('Stage 7 — Local Music Player & Storage Tests', () {
    late AppDatabase db;

    setUp(() {
      db = AppDatabase(NativeDatabase.memory());
    });

    tearDown(() async {
      await db.close();
    });

    test('Drift MusicDao Playlist CRUD and song association', () async {
      final initialPlaylists = await db.musicDao.getAllPlaylists();
      expect(initialPlaylists, isEmpty);

      // 1. Create Playlist
      await db.musicDao.insertPlaylist(
        MusicPlaylistsCompanion.insert(
          id: 'pl_favorites',
          name: 'Chill Vibes',
          createdAt: DateTime.now(),
        ),
      );

      var playlists = await db.musicDao.getAllPlaylists();
      expect(playlists.length, equals(1));
      expect(playlists.first.name, equals('Chill Vibes'));

      // 2. Add Songs to Playlist
      await db.musicDao.addSongToPlaylist(
        PlaylistSongsCompanion.insert(
          playlistId: 'pl_favorites',
          songPath: '/storage/emulated/0/Music/track1.mp3',
          sortOrder: const Value(0),
        ),
      );
      await db.musicDao.addSongToPlaylist(
        PlaylistSongsCompanion.insert(
          playlistId: 'pl_favorites',
          songPath: '/storage/emulated/0/Music/track2.flac',
          sortOrder: const Value(1),
        ),
      );

      final songsInPl = await db.musicDao.watchSongsForPlaylist('pl_favorites').first;
      expect(songsInPl.length, equals(2));
      expect(songsInPl[0].songPath, equals('/storage/emulated/0/Music/track1.mp3'));
      expect(songsInPl[1].songPath, equals('/storage/emulated/0/Music/track2.flac'));

      // 3. Remove a song from playlist
      await db.musicDao.removeSongFromPlaylist('pl_favorites', '/storage/emulated/0/Music/track1.mp3');
      final updatedSongs = await db.musicDao.watchSongsForPlaylist('pl_favorites').first;
      expect(updatedSongs.length, equals(1));
      expect(updatedSongs.first.songPath, equals('/storage/emulated/0/Music/track2.flac'));

      // 4. Delete playlist
      await db.musicDao.deletePlaylist(playlists.first);
      playlists = await db.musicDao.getAllPlaylists();
      expect(playlists, isEmpty);
    });

    test('Drift MusicDao SongMetadata favorite toggles and play count increment', () async {
      const songPath = '/storage/emulated/0/Music/masterpiece.mp3';

      // Initially no metadata
      var meta = await db.musicDao.getSongMetadata(songPath);
      expect(meta, isNull);

      // Toggle favorite -> should create row with isFavorite = true
      await db.musicDao.toggleFavorite(songPath);
      meta = await db.musicDao.getSongMetadata(songPath);
      expect(meta, isNotNull);
      expect(meta!.isFavorite, isTrue);

      // Toggle favorite again -> isFavorite becomes false
      await db.musicDao.toggleFavorite(songPath);
      meta = await db.musicDao.getSongMetadata(songPath);
      expect(meta!.isFavorite, isFalse);

      // Toggle favorite third time -> isFavorite becomes true again
      await db.musicDao.toggleFavorite(songPath);
      meta = await db.musicDao.getSongMetadata(songPath);
      expect(meta!.isFavorite, isTrue);

      // Increment play count
      expect(meta.playCount, equals(0));
      await db.musicDao.incrementPlayCount(songPath);
      meta = await db.musicDao.getSongMetadata(songPath);
      expect(meta!.playCount, equals(1));
      expect(meta.lastPlayed, isNotNull);

      // Increment again
      await db.musicDao.incrementPlayCount(songPath);
      meta = await db.musicDao.getSongMetadata(songPath);
      expect(meta!.playCount, equals(2));
    });

    test('Supported audio extensions includes all standard lossless and lossy formats', () {
      expect(supportedAudioExtensions.contains('.mp3'), isTrue);
      expect(supportedAudioExtensions.contains('.m4a'), isTrue);
      expect(supportedAudioExtensions.contains('.flac'), isTrue);
      expect(supportedAudioExtensions.contains('.wav'), isTrue);
      expect(supportedAudioExtensions.contains('.ogg'), isTrue);
      expect(supportedAudioExtensions.contains('.aac'), isTrue);
      expect(supportedAudioExtensions.contains('.opus'), isTrue);
      expect(supportedAudioExtensions.contains('.exe'), isFalse);
    });

    test('AlbumItem, ArtistItem, and FolderItem models calculate metrics properly', () {
      final song1 = SongModel({
        '_id': 1,
        '_data': '/storage/emulated/0/Music/Rock/song1.mp3',
        'title': 'Song 1',
        'artist': 'Queen',
        'album': 'A Night at the Opera',
        'duration': 180000, // 3 mins
      });

      final song2 = SongModel({
        '_id': 2,
        '_data': '/storage/emulated/0/Music/Rock/song2.mp3',
        'title': 'Song 2',
        'artist': 'Queen',
        'album': 'A Night at the Opera',
        'duration': 240000, // 4 mins
      });

      // Album item
      final album = AlbumItem(
        album: 'A Night at the Opera',
        artist: 'Queen',
        songs: [song1, song2],
      );
      expect(album.songCount, equals(2));
      expect(album.totalDuration.inMinutes, equals(7));

      // Artist item
      final artist = ArtistItem(
        artist: 'Queen',
        songs: [song1, song2],
      );
      expect(artist.songCount, equals(2));
      expect(artist.albums.contains('A Night at the Opera'), isTrue);

      // Folder item
      final folder = FolderItem(
        folderPath: '/storage/emulated/0/Music/Rock',
        folderName: 'Rock',
        songs: [song1, song2],
      );
      expect(folder.songCount, equals(2));
      expect(folder.folderName, equals('Rock'));
    });
  });
}
