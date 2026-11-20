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

// Multi-select mode state
final musicMultiSelectModeProvider = StateProvider<bool>((ref) => false);
final musicSelectedSongIdsProvider = StateProvider<Set<int>>((ref) => {});

// Aliases for convenient consumption
final isMultiSelectModeProvider = Provider<bool>((ref) {
  final explicit = ref.watch(musicMultiSelectModeProvider);
  final ids = ref.watch(musicSelectedSongIdsProvider);
  return explicit || ids.isNotEmpty;
});
final selectedSongIdsProvider = musicSelectedSongIdsProvider;

// Sort options for tracks
enum SongSortOption {
  title,
  artist,
  album,
  duration,
  dateAdded,
  year,
}

final songSortOptionProvider = StateProvider<SongSortOption>((ref) => SongSortOption.title);
final songSortAscendingProvider = StateProvider<bool>((ref) => true);

class MusicFolderState {
  final String? folderPath;
  final bool includeSubfolders;
  final int minDurationSeconds;
  final List<String> ignoredFolders;
  final bool hasCompletedOnboarding;
  final bool isScanning;
  final double scanProgress;
  final int trackCount;
  final String? scanStatus;
  final DateTime? lastScanned;

  const MusicFolderState({
    this.folderPath,
    this.includeSubfolders = true,
    this.minDurationSeconds = 30,
    this.ignoredFolders = const [],
    this.hasCompletedOnboarding = false,
    this.isScanning = false,
    this.scanProgress = 0.0,
    this.trackCount = 0,
    this.scanStatus,
    this.lastScanned,
  });

  MusicFolderState copyWith({
    String? folderPath,
    bool? includeSubfolders,
    int? minDurationSeconds,
    List<String>? ignoredFolders,
    bool? hasCompletedOnboarding,
    bool? isScanning,
    double? scanProgress,
    int? trackCount,
    String? scanStatus,
    DateTime? lastScanned,
    bool clearFolder = false,
  }) {
    return MusicFolderState(
      folderPath: clearFolder ? null : (folderPath ?? this.folderPath),
      includeSubfolders: includeSubfolders ?? this.includeSubfolders,
      minDurationSeconds: minDurationSeconds ?? this.minDurationSeconds,
      ignoredFolders: ignoredFolders ?? this.ignoredFolders,
      hasCompletedOnboarding: hasCompletedOnboarding ?? this.hasCompletedOnboarding,
      isScanning: isScanning ?? this.isScanning,
      scanProgress: scanProgress ?? this.scanProgress,
      trackCount: trackCount ?? this.trackCount,
      scanStatus: scanStatus ?? this.scanStatus,
      lastScanned: lastScanned ?? this.lastScanned,
    );
  }
}

// StateNotifier managing music folder selection, recursive scan, and filters
final musicFolderStateProvider = StateNotifierProvider<MusicFolderNotifier, MusicFolderState>((ref) {
  return MusicFolderNotifier(ref);
});

// Backwards-compatible folder path provider
final musicFolderPathProvider = Provider<String?>((ref) {
  return ref.watch(musicFolderStateProvider).folderPath;
});

class MusicFolderNotifier extends StateNotifier<MusicFolderState> {
  final Ref _ref;

  MusicFolderNotifier(this._ref) : super(const MusicFolderState()) {
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final folder = prefs.getString('selected_music_folder');
    final includeSub = prefs.getBool('music_include_subfolders') ?? true;
    final minDuration = prefs.getInt('music_min_duration_seconds') ?? 30;
    final ignored = prefs.getStringList('music_ignored_folders') ?? [];
    final onboardingDone = prefs.getBool('music_has_completed_onboarding') ?? (folder != null);

    state = state.copyWith(
      folderPath: folder,
      includeSubfolders: includeSub,
      minDurationSeconds: minDuration,
      ignoredFolders: ignored,
      hasCompletedOnboarding: onboardingDone,
    );
  }

  Future<void> pickFolder() async {
    final String? path = await FilePicker.platform.getDirectoryPath();
    if (path != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('selected_music_folder', path);
      await prefs.setBool('music_has_completed_onboarding', true);

      state = state.copyWith(
        folderPath: path,
        hasCompletedOnboarding: true,
      );

      await rescan();
    }
  }

  Future<void> clearFolder() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('selected_music_folder');
    state = state.copyWith(clearFolder: true);
    _ref.invalidate(songsProvider);
  }

  Future<void> setIncludeSubfolders(bool include) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('music_include_subfolders', include);
    state = state.copyWith(includeSubfolders: include);
    _ref.invalidate(songsProvider);
  }

  Future<void> setMinDurationSeconds(int seconds) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('music_min_duration_seconds', seconds);
    state = state.copyWith(minDurationSeconds: seconds);
    _ref.invalidate(songsProvider);
  }

  Future<void> addIgnoredFolder(String folderPath) async {
    final updated = [...state.ignoredFolders, folderPath];
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('music_ignored_folders', updated);
    state = state.copyWith(ignoredFolders: updated);
    _ref.invalidate(songsProvider);
  }

  Future<void> removeIgnoredFolder(String folderPath) async {
    final updated = state.ignoredFolders.where((f) => f != folderPath).toList();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('music_ignored_folders', updated);
    state = state.copyWith(ignoredFolders: updated);
    _ref.invalidate(songsProvider);
  }

  Future<void> completeOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('music_has_completed_onboarding', true);
    state = state.copyWith(hasCompletedOnboarding: true);
  }

  Future<void> rescan() async {
    final folder = state.folderPath;
    if (folder == null) return;

    state = state.copyWith(
      isScanning: true,
      scanProgress: 0.1,
      scanStatus: 'Scanning music folder...',
    );

    try {
      final dir = Directory(folder);
      if (!dir.existsSync()) {
        state = state.copyWith(
          isScanning: false,
          scanStatus: 'Selected folder does not exist',
        );
        return;
      }

      int count = 0;
      final Set<String> foundPaths = {};

      await for (final entity in dir.list(recursive: state.includeSubfolders, followLinks: false)) {
        if (entity is File) {
          final lower = entity.path.toLowerCase();
          final isIgnored = state.ignoredFolders.any((ig) => entity.path.startsWith(ig));
          if (!isIgnored && supportedAudioExtensions.any((ext) => lower.endsWith(ext))) {
            count++;
            foundPaths.add(entity.path);
          }
        }
      }

      state = state.copyWith(
        isScanning: false,
        scanProgress: 1.0,
        trackCount: count,
        scanStatus: 'Scan complete ($count tracks found)',
        lastScanned: DateTime.now(),
      );

      _ref.invalidate(songsProvider);
    } catch (e) {
      state = state.copyWith(
        isScanning: false,
        scanStatus: 'Scan error: $e',
      );
    }
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

// Fetches all valid songs, filtered by folder (if set), min duration, ignored folders, and sorted
final songsProvider = FutureProvider<List<SongModel>>((ref) async {
  final folderState = ref.watch(musicFolderStateProvider);
  final folder = folderState.folderPath;
  final query = ref.watch(onAudioQueryProvider);
  final sortOption = ref.watch(songSortOptionProvider);
  final sortAscending = ref.watch(songSortAscendingProvider);

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
      if (folder != null) {
        if (!path.startsWith(folder)) continue;

        if (!folderState.includeSubfolders) {
          // If subfolders not included, song must be directly inside folder
          final songDir = File(path).parent.path;
          if (songDir != folder) continue;
        }
      }

      // Check ignored folders
      if (folderState.ignoredFolders.any((ig) => path.startsWith(ig))) {
        continue;
      }

      // Minimum duration filter (in milliseconds)
      final durationMs = song.duration ?? 0;
      if (durationMs > 0 && durationMs < (folderState.minDurationSeconds * 1000)) {
        continue;
      }

      // Verify file exists on local storage
      if (File(path).existsSync()) {
        seenPaths.add(path);
        validSongs.add(song);
      }
    }

    // Sort valid songs based on user's active sort option
    validSongs.sort((a, b) {
      int cmp = 0;
      switch (sortOption) {
        case SongSortOption.title:
          cmp = (a.title).toLowerCase().compareTo((b.title).toLowerCase());
          break;
        case SongSortOption.artist:
          cmp = (a.artist ?? '').toLowerCase().compareTo((b.artist ?? '').toLowerCase());
          break;
        case SongSortOption.album:
          cmp = (a.album ?? '').toLowerCase().compareTo((b.album ?? '').toLowerCase());
          break;
        case SongSortOption.duration:
          cmp = (a.duration ?? 0).compareTo(b.duration ?? 0);
          break;
        case SongSortOption.dateAdded:
          cmp = (a.dateAdded ?? 0).compareTo(b.dateAdded ?? 0);
          break;
        case SongSortOption.year:
          cmp = (a.composer ?? '').compareTo(b.composer ?? '');
          break;
      }
      return sortAscending ? cmp : -cmp;
    });

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
