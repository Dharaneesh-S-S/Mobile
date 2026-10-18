import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:home_widget/home_widget.dart';
import 'package:just_audio/just_audio.dart';
import 'package:just_audio_background/just_audio_background.dart';
import 'package:on_audio_query/on_audio_query.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/providers/core_providers.dart';

final musicPlayerProvider = Provider<AudioPlayer>((ref) {
  final player = AudioPlayer(
    handleInterruptions: true,
    androidApplyAudioAttributes: true,
  );

  ref.onDispose(() {
    player.dispose();
  });
  return player;
});

// Playback sequence stream provider
final sequenceStateProvider = StreamProvider<SequenceState?>((ref) {
  final player = ref.watch(musicPlayerProvider);
  return player.sequenceStateStream;
});

// Player state stream provider (playing, buffering, completed)
final playerStateProvider = StreamProvider<PlayerState>((ref) {
  final player = ref.watch(musicPlayerProvider);
  return player.playerStateStream;
});

// Playback position stream provider
final positionProvider = StreamProvider<Duration>((ref) {
  final player = ref.watch(musicPlayerProvider);
  return player.positionStream;
});

// Current active queue of SongModels
final musicQueueProvider = StateProvider<List<SongModel>>((ref) => []);

// Currently playing SongModel
final currentSongProvider = StateProvider<SongModel?>((ref) => null);

// StateNotifier to control playback actions, queue, and widget sync
class MusicPlaybackController extends StateNotifier<AsyncValue<void>> {
  final Ref _ref;
  final AudioPlayer _player;

  MusicPlaybackController(this._ref, this._player) : super(const AsyncValue.data(null)) {
    _initListeners();
    _restorePreferences();
  }

  void _initListeners() {
    // Listen to current sequence index to update current song, database play count, and HomeWidget
    _player.currentIndexStream.listen((index) {
      if (index != null) {
        final queue = _ref.read(musicQueueProvider);
        if (index >= 0 && index < queue.length) {
          final song = queue[index];
          _ref.read(currentSongProvider.notifier).state = song;
          _syncHomeWidget(song: song, isPlaying: _player.playing);
          _recordPlayCount(song.data);
          _saveLastPlayed(song.data);
        }
      }
    });

    // Listen to playing state to update HomeWidget
    _player.playingStream.listen((isPlaying) {
      final song = _ref.read(currentSongProvider);
      _syncHomeWidget(song: song, isPlaying: isPlaying);
    });
  }

  Future<void> _restorePreferences() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final shuffle = prefs.getBool('music_shuffle_mode') ?? false;
      final loopIndex = prefs.getInt('music_loop_mode') ?? 0;
      final loopModes = [LoopMode.off, LoopMode.all, LoopMode.one];
      final loop = (loopIndex >= 0 && loopIndex < loopModes.length) ? loopModes[loopIndex] : LoopMode.off;

      await _player.setShuffleModeEnabled(shuffle);
      await _player.setLoopMode(loop);
    } catch (_) {}
  }

  Future<void> _recordPlayCount(String songPath) async {
    try {
      final db = _ref.read(databaseProvider);
      await db.musicDao.incrementPlayCount(songPath);
    } catch (_) {}
  }

  Future<void> _saveLastPlayed(String songPath) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('music_last_played_path', songPath);
    } catch (_) {}
  }

  Future<void> _syncHomeWidget({SongModel? song, required bool isPlaying}) async {
    try {
      final title = song?.title ?? 'Personal Hub Music';
      final artist = song?.artist ?? 'Tap to open player';

      await HomeWidget.saveWidgetData<String>('title', title);
      await HomeWidget.saveWidgetData<String>('artist', artist);
      await HomeWidget.saveWidgetData<bool>('isPlaying', isPlaying);
      await HomeWidget.updateWidget(
        name: 'MusicWidgetProvider',
        androidName: 'MusicWidgetProvider',
      );
    } catch (e) {
      debugPrint('HomeWidget sync exception: $e');
    }
  }

  AudioSource _buildAudioSource(SongModel song) {
    return AudioSource.uri(
      Uri.parse('file://${song.data}'),
      tag: MediaItem(
        id: song.id.toString(),
        title: song.title,
        artist: song.artist ?? 'Unknown Artist',
        album: song.album ?? 'Unknown Album',
        duration: song.duration != null ? Duration(milliseconds: song.duration!) : null,
        artUri: Uri.parse('content://media/external/audio/media/${song.id}/albumart'),
      ),
    );
  }

  /// Plays a specific song with a given context list / queue
  Future<void> playSong(SongModel song, List<SongModel> contextList, {int? index}) async {
    final playIndex = index ?? contextList.indexWhere((s) => s.id == song.id);
    final targetIndex = playIndex >= 0 ? playIndex : 0;

    _ref.read(musicQueueProvider.notifier).state = List.from(contextList);
    _ref.read(currentSongProvider.notifier).state = song;

    final audioSources = contextList.map(_buildAudioSource).toList();
    final playlist = ConcatenatingAudioSource(children: audioSources);

    try {
      await _player.setAudioSource(playlist, initialIndex: targetIndex);
      await _player.play();
    } catch (e) {
      debugPrint('Playback error: $e');
    }
  }

  /// Plays all songs in the given list, optionally shuffled
  Future<void> playAll(List<SongModel> songs, {bool shuffle = false}) async {
    if (songs.isEmpty) return;

    List<SongModel> targetList = List.from(songs);
    if (shuffle) {
      targetList.shuffle();
    }

    await playSong(targetList.first, targetList, index: 0);
    if (shuffle) {
      await _player.setShuffleModeEnabled(true);
    }
  }

  /// Toggles play / pause
  Future<void> togglePlayPause() async {
    if (_player.playing) {
      await _player.pause();
    } else {
      await _player.play();
    }
  }

  Future<void> seekToNext() async {
    if (_player.hasNext) {
      await _player.seekToNext();
    }
  }

  Future<void> seekToPrevious() async {
    if (_player.hasPrevious) {
      await _player.seekToPrevious();
    } else {
      await _player.seek(Duration.zero);
    }
  }

  Future<void> seek(Duration position) async {
    await _player.seek(position);
  }

  Future<void> toggleShuffle() async {
    final enable = !_player.shuffleModeEnabled;
    if (enable) {
      await _player.shuffle();
    }
    await _player.setShuffleModeEnabled(enable);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('music_shuffle_mode', enable);
  }

  Future<void> cycleLoopMode() async {
    final current = _player.loopMode;
    LoopMode next;
    int index;
    if (current == LoopMode.off) {
      next = LoopMode.all;
      index = 1;
    } else if (current == LoopMode.all) {
      next = LoopMode.one;
      index = 2;
    } else {
      next = LoopMode.off;
      index = 0;
    }
    await _player.setLoopMode(next);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('music_loop_mode', index);
  }

  /// Adds a song to the end of the current play queue
  Future<void> addToQueue(SongModel song) async {
    final currentQueue = _ref.read(musicQueueProvider);
    _ref.read(musicQueueProvider.notifier).state = [...currentQueue, song];

    final audioSource = _player.audioSource;
    if (audioSource is ConcatenatingAudioSource) {
      await audioSource.add(_buildAudioSource(song));
    }
  }

  /// Inserts a song as the next track in the queue
  Future<void> playNext(SongModel song) async {
    final currentQueue = List<SongModel>.from(_ref.read(musicQueueProvider));
    final currentIndex = _player.currentIndex ?? 0;
    final insertIndex = (currentIndex + 1).clamp(0, currentQueue.length);

    currentQueue.insert(insertIndex, song);
    _ref.read(musicQueueProvider.notifier).state = currentQueue;

    final audioSource = _player.audioSource;
    if (audioSource is ConcatenatingAudioSource) {
      await audioSource.insert(insertIndex, _buildAudioSource(song));
    }
  }

  /// Removes a song from the active queue by index
  Future<void> removeFromQueue(int index) async {
    final currentQueue = List<SongModel>.from(_ref.read(musicQueueProvider));
    if (index >= 0 && index < currentQueue.length) {
      currentQueue.removeAt(index);
      _ref.read(musicQueueProvider.notifier).state = currentQueue;

      final audioSource = _player.audioSource;
      if (audioSource is ConcatenatingAudioSource) {
        await audioSource.removeAt(index);
      }
    }
  }
}

final musicPlaybackControllerProvider = Provider<MusicPlaybackController>((ref) {
  final player = ref.watch(musicPlayerProvider);
  return MusicPlaybackController(ref, player);
});
