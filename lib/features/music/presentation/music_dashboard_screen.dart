import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:on_audio_query/on_audio_query.dart';

import 'package:just_audio/just_audio.dart';
import 'package:just_audio_background/just_audio_background.dart';

import '../providers/music_library_provider.dart';
import '../providers/music_player_provider.dart';
import 'mini_player.dart';

class MusicDashboardScreen extends ConsumerWidget {
  const MusicDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final folderPath = ref.watch(musicFolderPathProvider);
    final songsAsync = ref.watch(songsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Music Player'),
        actions: [
          IconButton(
            icon: const Icon(Icons.folder_open),
            onPressed: () {
              ref.read(musicFolderPathProvider.notifier).pickFolder();
            },
          ),
        ],
      ),
      body: folderPath == null
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.music_note, size: 64, color: Colors.grey),
                  const SizedBox(height: 16),
                  const Text('No music folder selected'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      ref.read(musicFolderPathProvider.notifier).pickFolder();
                    },
                    child: const Text('Choose Folder'),
                  ),
                ],
              ),
            )
          : songsAsync.when(
              data: (songs) {
                if (songs.isEmpty) {
                  return const Center(child: Text('No songs found in the selected folder.'));
                }
                return Column(
                  children: [
                    Expanded(
                      child: ListView.builder(
                        itemCount: songs.length,
                        itemBuilder: (context, index) {
                          final song = songs[index];
                          return ListTile(
                            leading: QueryArtworkWidget(
                              id: song.id,
                              type: ArtworkType.AUDIO,
                              nullArtworkWidget: const Icon(Icons.music_note),
                            ),
                            title: Text(song.title),
                            subtitle: Text(song.artist ?? 'Unknown Artist'),
                            onTap: () async {
                              final player = ref.read(musicPlayerProvider);
                              final playlist = ConcatenatingAudioSource(
                                children: songs.map((s) {
                                  return AudioSource.uri(
                                    Uri.parse('file://${s.data}'),
                                    tag: MediaItem(
                                      id: s.id.toString(),
                                      title: s.title,
                                      artist: s.artist,
                                      album: s.album,
                                      duration: s.duration != null ? Duration(milliseconds: s.duration!) : null,
                                      artUri: Uri.parse('content://media/external/audio/media/${s.id}/albumart'),
                                    ),
                                  );
                                }).toList(),
                              );
                              await player.setAudioSource(playlist, initialIndex: index);
                              player.play();
                            },
                          );
                        },
                      ),
                    ),
                    const MiniPlayer(),
                  ],
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, stack) => Center(child: Text('Error: $err')),
            ),
    );
  }
}
