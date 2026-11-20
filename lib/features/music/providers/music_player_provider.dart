import 'dart:async';
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

// Playback speed provider (0.5x to 2.0x)
final playbackSpeedProvider = StateProvider<double>((ref) => 1.0);

// Sleep timer remaining duration (null if disabled)
final sleepTimerRemainingProvider = StateProvider<Duration?>((ref) => null);
final sleepAtEndOfTrackProvider = StateProvider<bool>((ref) => false);

// Equalizer State & Presets
class EqualizerState {
  final bool enabled;
  final String preset;
  final List<double> bandGains;
  final double bassBoost;
  final double virtualizer;

  const EqualizerState({
    this.enabled = true,
    this.preset = 'Normal',
    this.bandGains = const [0.0, 0.0, 0.0, 0.0, 0.0],
    this.bassBoost = 0.0,
    this.virtualizer = 0.0,
  });

  EqualizerState copyWith({
    bool? enabled,
    String? preset,
    List<double>? bandGains,
    double? bassBoost,
    double? virtualizer,
  }) {
    return EqualizerState(
      enabled: enabled ?? this.enabled,
      preset: preset ?? this.preset,
      bandGains: bandGains ?? this.bandGains,
      bassBoost: bassBoost ?? this.bassBoost,
      virtualizer: virtualizer ?? this.virtualizer,
    );
  }
}

final equalizerPresets = <String, List<double>>{
  'Normal': [0.0, 0.0, 0.0, 0.0, 0.0],
  'Pop': [-1.0, 2.0, 4.0, 1.0, -1.0],
  'Rock': [4.0, 2.0, -1.0, 2.0, 4.0],
  'Classical': [3.0, 2.0, -1.0, 2.0, 3.0],
  'Jazz': [2.0, 1.0, 2.0, 2.0, 2.0],
  'Bass Boost': [6.0, 4.0, 2.0, 0.0, 0.0],
  'Treble Boost': [0.0, 0.0, 2.0, 4.0, 6.0],
  'Vocal': [-2.0, 1.0, 4.0, 3.0, 0.0],
  'Custom': [0.0, 0.0, 0.0, 0.0, 0.0],
};

final equalizerStateProvider = StateProvider<EqualizerState>((ref) => const EqualizerState());

// Current active queue of SongModels
final musicQueueProvider = StateProvider<List<SongModel>>((ref) => []);

// Currently playing SongModel
final currentSongProvider = StateProvider<SongModel?>((ref) => null);

// StateNotifier to control playback actions, queue, and widget sync
class MusicPlaybackController extends StateNotifier<AsyncValue<void>> {
  final Ref _ref;
  final AudioPlayer _player;
  Timer? _sleepTimer;

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

          // If sleep timer is set to end of current track, pause at completion
          if (_ref.read(sleepAtEndOfTrackProvider)) {
            // Check if track advanced due to end of track
          }
        }
      }
    });

    // Listen to playing state to update HomeWidget
    _player.playingStream.listen((isPlaying) {
      final song = _ref.read(currentSongProvider);
      _syncHomeWidget(song: song, isPlaying: isPlaying);
    });

    // Listen to completion for sleep-at-end-of-track
    _player.playerStateStream.listen((state) {
      if (state.processingState == ProcessingState.completed) {
        if (_ref.read(sleepAtEndOfTrackProvider)) {
          _player.pause();
          _ref.read(sleepAtEndOfTrackProvider.notifier).state = false;
        }
      }
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
      final title = song?.title ?? 'Personal Music';
      final artist = song?.artist ?? 'Tap to open player';
      final album = song?.album ?? '';

      int progressPercent = 0;
      if (_player.duration != null && _player.duration!.inMilliseconds > 0) {
        progressPercent = ((_player.position.inMilliseconds / _player.duration!.inMilliseconds) * 100).toInt().clamp(0, 100);
      }

      await HomeWidget.saveWidgetData<String>('title', title);
      await HomeWidget.saveWidgetData<String>('artist', artist);
      await HomeWidget.saveWidgetData<String>('album', album);
      await HomeWidget.saveWidgetData<bool>('isPlaying', isPlaying);
      await HomeWidget.saveWidgetData<int>('progressPercent', progressPercent);

      // Update Small, Medium, Large & Combined widgets
      await HomeWidget.updateWidget(
        name: 'MusicWidgetProvider',
        androidName: 'MusicWidgetProvider',
      );
      await HomeWidget.updateWidget(
        name: 'MusicSmallWidgetProvider',
        androidName: 'MusicSmallWidgetProvider',
      );
      await HomeWidget.updateWidget(
        name: 'MusicLargeWidgetProvider',
        androidName: 'MusicLargeWidgetProvider',
      );
      await HomeWidget.updateWidget(
        name: 'CombinedWidgetProvider',
        androidName: 'CombinedWidgetProvider',
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

  /// Adds multiple songs to the end of the current play queue
  Future<void> addMultipleToQueue(List<SongModel> songs) async {
    final currentQueue = _ref.read(musicQueueProvider);
    _ref.read(musicQueueProvider.notifier).state = [...currentQueue, ...songs];

    final audioSource = _player.audioSource;
    if (audioSource is ConcatenatingAudioSource) {
      for (final song in songs) {
        await audioSource.add(_buildAudioSource(song));
      }
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

  /// Reorders items in the active queue
  Future<void> reorderQueue(int oldIndex, int newIndex) async {
    final currentQueue = List<SongModel>.from(_ref.read(musicQueueProvider));
    if (oldIndex < newIndex) {
      newIndex -= 1;
    }
    final item = currentQueue.removeAt(oldIndex);
    currentQueue.insert(newIndex, item);
    _ref.read(musicQueueProvider.notifier).state = currentQueue;

    final audioSource = _player.audioSource;
    if (audioSource is ConcatenatingAudioSource) {
      await audioSource.move(oldIndex, newIndex);
    }
  }

  /// Clears the active queue
  Future<void> clearQueue() async {
    _ref.read(musicQueueProvider.notifier).state = [];
    _ref.read(currentSongProvider.notifier).state = null;
    await _player.stop();
  }

  /// Sets playback speed (0.5x to 2.0x) with pitch preservation
  Future<void> setPlaybackSpeed(double speed) async {
    final clamped = speed.clamp(0.5, 2.0);
    _ref.read(playbackSpeedProvider.notifier).state = clamped;
    await _player.setSpeed(clamped);
  }

  /// Starts sleep timer with volume fade-out
  void startSleepTimer(int minutes) {
    cancelSleepTimer();
    _ref.read(sleepAtEndOfTrackProvider.notifier).state = false;

    int remainingSeconds = minutes * 60;
    _ref.read(sleepTimerRemainingProvider.notifier).state = Duration(seconds: remainingSeconds);

    _sleepTimer = Timer.periodic(const Duration(seconds: 1), (timer) async {
      remainingSeconds--;
      if (remainingSeconds <= 0) {
        timer.cancel();
        _sleepTimer = null;
        _ref.read(sleepTimerRemainingProvider.notifier).state = null;
        await _player.pause();
        await _player.setVolume(1.0);
      } else {
        _ref.read(sleepTimerRemainingProvider.notifier).state = Duration(seconds: remainingSeconds);
        // Fade volume smoothly during final 20 seconds
        if (remainingSeconds <= 20) {
          final volume = (remainingSeconds / 20.0).clamp(0.0, 1.0);
          await _player.setVolume(volume);
        }
      }
    });
  }

  void cancelSleepTimer() {
    _sleepTimer?.cancel();
    _sleepTimer = null;
    _ref.read(sleepTimerRemainingProvider.notifier).state = null;
    _ref.read(sleepAtEndOfTrackProvider.notifier).state = false;
    _player.setVolume(1.0);
  }

  void toggleSleepAtEndOfTrack() {
    final current = _ref.read(sleepAtEndOfTrackProvider);
    cancelSleepTimer();
    _ref.read(sleepAtEndOfTrackProvider.notifier).state = !current;
  }

  void setEqualizerPreset(String preset) {
    final gains = equalizerPresets[preset] ?? equalizerPresets['Normal']!;
    final current = _ref.read(equalizerStateProvider);
    _ref.read(equalizerStateProvider.notifier).state = current.copyWith(
      preset: preset,
      bandGains: List.from(gains),
    );
  }

  void setEqualizerBand(int bandIndex, double gain) {
    final current = _ref.read(equalizerStateProvider);
    final gains = List<double>.from(current.bandGains);
    if (bandIndex >= 0 && bandIndex < gains.length) {
      gains[bandIndex] = gain.clamp(-10.0, 10.0);
      _ref.read(equalizerStateProvider.notifier).state = current.copyWith(
        preset: 'Custom',
        bandGains: gains,
      );
    }
  }

  void setBassBoost(double value) {
    final current = _ref.read(equalizerStateProvider);
    _ref.read(equalizerStateProvider.notifier).state = current.copyWith(
      bassBoost: value.clamp(0.0, 1.0),
    );
  }

  void setVirtualizer(double value) {
    final current = _ref.read(equalizerStateProvider);
    _ref.read(equalizerStateProvider.notifier).state = current.copyWith(
      virtualizer: value.clamp(0.0, 1.0),
    );
  }
}

final musicPlaybackControllerProvider = Provider<MusicPlaybackController>((ref) {
  final player = ref.watch(musicPlayerProvider);
  return MusicPlaybackController(ref, player);
});
