import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:on_audio_query/on_audio_query.dart';
import 'package:file_picker/file_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';

final onAudioQueryProvider = Provider<OnAudioQuery>((ref) {
  return OnAudioQuery();
});

// Provides the persisted music folder path
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
}

// Fetches all songs that are within the selected folder
final songsProvider = FutureProvider<List<SongModel>>((ref) async {
  final folder = ref.watch(musicFolderPathProvider);
  final query = ref.watch(onAudioQueryProvider);
  
  if (folder == null) return [];

  try {
    // Request permissions if needed
    bool hasPermission = await query.permissionsStatus();
    if (!hasPermission) {
      hasPermission = await query.permissionsRequest();
    }
    if (!hasPermission) return [];

    final allSongs = await query.querySongs(
      sortType: null,
      orderType: OrderType.ASC_OR_SMALLER,
      uriType: UriType.EXTERNAL,
      ignoreCase: true,
    );

    // Filter recursively by checking if the path starts with the folder
    final filtered = allSongs.where((song) {
      final data = song.data; // the absolute file path
      return data.startsWith(folder);
    }).toList();
    
    return filtered;
  } catch (e) {
    return [];
  }
});
