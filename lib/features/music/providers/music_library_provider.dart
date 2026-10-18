import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:on_audio_query/on_audio_query.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../models/music_models.dart';

final onAudioQueryProvider = Provider<OnAudioQuery>((ref) {
  return OnAudioQuery();
});

// Currently selected library tab (Songs, Albums, Artists, Genres, Folders, Playlists, Favorites, Recent, Most Played)
final currentMusicTabProvider = StateProvider<MusicTab>((ref) => MusicTab.tracks);

// Search query for music library
final musicSearchQueryProvider = StateProvider<String>((ref) => '');

// Provides the persisted music folder path (null means scan all device audio)
final musicFolderPathProvider = StateNotifierProvider<MusicFolderNotifier, String?>((ref) {
  return MusicFolderNotifier();
});

class MusicFolderNotifier extends StateNotifier<String?> {
  MusicFolderNotifier() : super(null) {
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    state = prefs.getString('selected_music_folder');
  }

  Future<void> pickFolder() async {
    String? path = await FilePicker.platform.getDirectoryPath();
    if (path != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('selected_music_folder', path);
      state = path;
    }
  }

  Future<void> clearFolder() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('selected_music_folder');
    state = null;
  }
}

// Supported audio file extensions
const Set<String> supportedAudioExtensions = {
  '.mp3',
  '.m4a',
  '.flac',
  '.wav',
  '.ogg',
  '.aac',
  '.opus',
};

// Fetches all valid songs, filtered by folder (if set) and supported formats, deduplicated
final songsProvider = FutureProvider<List<SongModel>>((ref) async {
  final folder = ref.watch(musicFolderPathProvider);
  final query = ref.watch(onAudioQueryProvider);

  try {
    bool hasPermission = await query.permissionsStatus();
    if (!hasPermission) {
      hasPermission = await query.permissionsRequest();
    }
    if (!hasPermission) return [];

    final allSongs = await query.querySongs(
      sortType: SongSortType.TITLE,
      orderType: OrderType.ASC_OR_SMALLER,
      uriType: UriType.EXTERNAL,
      ignoreCase: true,
    );

    final Set<String> seenPaths = {};
    final List<SongModel> validSongs = [];

    for (var song in allSongs) {
      final path = song.data;
      if (seenPaths.contains(path)) continue;

      // Check supported audio extension
      final lowerPath = path.toLowerCase();
      final hasValidExt = supportedAudioExtensions.any((ext) => lowerPath.endsWith(ext));
      if (!hasValidExt) continue;

      // Check folder boundary if selected
      if (folder != null && !path.startsWith(folder)) {
        continue;
      }

      // Verify file exists on local storage
      if (File(path).existsSync()) {
        seenPaths.add(path);
        validSongs.add(song);
      }
    }

    return validSongs;
  } catch (e) {
    return [];
  }
});

// Grouped by Album
final albumsProvider = Provider<List<AlbumItem>>((ref) {
  final songs = ref.watch(songsProvider).valueOrNull ?? [];
  final Map<String, List<SongModel>> albumMap = {};
  final Map<String, String> artistMap = {};
  final Map<String, int?> idMap = {};

  for (var s in songs) {
    final albumName = (s.album != null && s.album!.isNotEmpty) ? s.album! : 'Unknown Album';
    albumMap.putIfAbsent(albumName, () => []).add(s);
    artistMap[albumName] = s.artist ?? 'Unknown Artist';
    idMap[albumName] = s.albumId;
  }

  final albums = albumMap.entries.map((e) {
    return AlbumItem(
      album: e.key,
      artist: artistMap[e.key] ?? 'Unknown Artist',
      albumId: idMap[e.key],
      songs: e.value,
    );
  }).toList();

  albums.sort((a, b) => a.album.toLowerCase().compareTo(b.album.toLowerCase()));
  return albums;
});

// Grouped by Artist
final artistsProvider = Provider<List<ArtistItem>>((ref) {
  final songs = ref.watch(songsProvider).valueOrNull ?? [];
  final Map<String, List<SongModel>> artistMap = {};

  for (var s in songs) {
    final artistName = (s.artist != null && s.artist!.isNotEmpty) ? s.artist! : 'Unknown Artist';
    artistMap.putIfAbsent(artistName, () => []).add(s);
  }

  final artists = artistMap.entries.map((e) {
    return ArtistItem(
      artist: e.key,
      songs: e.value,
    );
  }).toList();

  artists.sort((a, b) => a.artist.toLowerCase().compareTo(b.artist.toLowerCase()));
  return artists;
});

// Grouped by Genre
final genresProvider = Provider<List<GenreItem>>((ref) {
  final songs = ref.watch(songsProvider).valueOrNull ?? [];
  final Map<String, List<SongModel>> genreMap = {};

  for (var s in songs) {
    final genreName = (s.genre != null && s.genre!.isNotEmpty) ? s.genre! : 'Uncategorized';
    genreMap.putIfAbsent(genreName, () => []).add(s);
  }

  final genres = genreMap.entries.map((e) {
    return GenreItem(
      genre: e.key,
      songs: e.value,
    );
  }).toList();

  genres.sort((a, b) => a.genre.toLowerCase().compareTo(b.genre.toLowerCase()));
  return genres;
});

// Grouped by Folders
final foldersProvider = Provider<List<FolderItem>>((ref) {
  final songs = ref.watch(songsProvider).valueOrNull ?? [];
  final Map<String, List<SongModel>> folderMap = {};

  for (var s in songs) {
    final file = File(s.data);
    final parentDir = file.parent.path;
    folderMap.putIfAbsent(parentDir, () => []).add(s);
  }

  final folders = folderMap.entries.map((e) {
    final dirName = e.key.split(Platform.pathSeparator).last;
    return FolderItem(
      folderPath: e.key,
      folderName: dirName.isNotEmpty ? dirName : 'Music Folder',
      songs: e.value,
    );
  }).toList();

  folders.sort((a, b) => a.folderName.toLowerCase().compareTo(b.folderName.toLowerCase()));
  return folders;
});

// Playlists stream from SQLite
final musicPlaylistsProvider = StreamProvider<List<MusicPlaylist>>((ref) {
  final db = ref.watch(databaseProvider);
  return db.musicDao.watchAllPlaylists();
});

// Songs in a specific playlist
final playlistSongsProvider = StreamProvider.family<List<SongModel>, String>((ref, playlistId) {
  final db = ref.watch(databaseProvider);
  final allSongs = ref.watch(songsProvider).valueOrNull ?? [];

  return db.musicDao.watchSongsForPlaylist(playlistId).map((playlistEntries) {
    final pathMap = {for (var s in allSongs) s.data: s};
    final List<SongModel> songsInPlaylist = [];

    for (var entry in playlistEntries) {
      final match = pathMap[entry.songPath];
      if (match != null) {
        songsInPlaylist.add(match);
      }
    }
    return songsInPlaylist;
  });
});

// Favorites songs stream
final favoriteSongsProvider = FutureProvider<List<SongModel>>((ref) async {
  final db = ref.watch(databaseProvider);
  final allSongs = ref.watch(songsProvider).valueOrNull ?? [];
  final pathMap = {for (var s in allSongs) s.data: s};

  final allMetadata = await db.select(db.songMetadata).get();
  final favPaths = allMetadata.where((m) => m.isFavorite).map((m) => m.songPath).toSet();

  return allSongs.where((s) => favPaths.contains(s.data)).toList();
});

// Recently Played songs
final recentlyPlayedSongsProvider = FutureProvider<List<SongModel>>((ref) async {
  final db = ref.watch(databaseProvider);
  final allSongs = ref.watch(songsProvider).valueOrNull ?? [];
  final pathMap = {for (var s in allSongs) s.data: s};

  final allMetadata = await db.select(db.songMetadata).get();
  final recentMeta = allMetadata.where((m) => m.lastPlayed != null).toList()
    ..sort((a, b) => b.lastPlayed!.compareTo(a.lastPlayed!));

  final List<SongModel> result = [];
  for (var m in recentMeta) {
    final s = pathMap[m.songPath];
    if (s != null) result.add(s);
  }
  return result;
});

// Most Played songs
final mostPlayedSongsProvider = FutureProvider<List<SongModel>>((ref) async {
  final db = ref.watch(databaseProvider);
  final allSongs = ref.watch(songsProvider).valueOrNull ?? [];
  final pathMap = {for (var s in allSongs) s.data: s};

  final allMetadata = await db.select(db.songMetadata).get();
  final mostPlayedMeta = allMetadata.where((m) => m.playCount > 0).toList()
    ..sort((a, b) => b.playCount.compareTo(a.playCount));

  final List<SongModel> result = [];
  for (var m in mostPlayedMeta) {
    final s = pathMap[m.songPath];
    if (s != null) result.add(s);
  }
  return result;
});
