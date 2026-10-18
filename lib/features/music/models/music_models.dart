import 'package:on_audio_query/on_audio_query.dart';

enum MusicTab {
  tracks,
  albums,
  artists,
  genres,
  folders,
  playlists,
  favorites,
  recent,
  mostPlayed,
}

class AlbumItem {
  final String album;
  final String artist;
  final int? albumId;
  final List<SongModel> songs;

  const AlbumItem({
    required this.album,
    required this.artist,
    this.albumId,
    required this.songs,
  });

  int get songCount => songs.length;
  Duration get totalDuration {
    int totalMs = 0;
    for (var s in songs) {
      totalMs += (s.duration ?? 0);
    }
    return Duration(milliseconds: totalMs);
  }
}

class ArtistItem {
  final String artist;
  final List<SongModel> songs;

  const ArtistItem({
    required this.artist,
    required this.songs,
  });

  int get songCount => songs.length;
  Set<String> get albums => {for (var s in songs) s.album ?? 'Unknown Album'};
}

class GenreItem {
  final String genre;
  final List<SongModel> songs;

  const GenreItem({
    required this.genre,
    required this.songs,
  });

  int get songCount => songs.length;
}

class FolderItem {
  final String folderPath;
  final String folderName;
  final List<SongModel> songs;

  const FolderItem({
    required this.folderPath,
    required this.folderName,
    required this.songs,
  });

  int get songCount => songs.length;
}
