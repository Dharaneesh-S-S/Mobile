import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:just_audio/just_audio.dart';

final musicPlayerProvider = Provider<AudioPlayer>((ref) {
  final player = AudioPlayer();
  ref.onDispose(() {
    player.dispose();
  });
  return player;
});

// A provider to manage the playlist queue
final playlistProvider = StateProvider<ConcatenatingAudioSource>((ref) {
  return ConcatenatingAudioSource(children: []);
});

// A provider to easily access the current sequence state (e.g. current track index, etc.)
final sequenceStateProvider = StreamProvider<SequenceState?>((ref) {
  final player = ref.watch(musicPlayerProvider);
  return player.sequenceStateStream;
});

// A provider for the player state (playing, paused, completed, etc.)
final playerStateProvider = StreamProvider<PlayerState>((ref) {
  final player = ref.watch(musicPlayerProvider);
  return player.playerStateStream;
});

// A provider for playback position
final positionProvider = StreamProvider<Duration>((ref) {
  final player = ref.watch(musicPlayerProvider);
  return player.positionStream;
});
