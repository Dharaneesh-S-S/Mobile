import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:on_audio_query/on_audio_query.dart';
import 'package:uuid/uuid.dart';
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../providers/music_library_provider.dart';

class PlaylistDialogs {
  /// Opens a dialog to create a new playlist, optionally pre-populating it with songs
  static Future<void> showCreatePlaylistDialog(
    BuildContext context,
    WidgetRef ref, {
    List<SongModel>? initialSongs,
  }) async {
    final controller = TextEditingController();

    await showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: Text(initialSongs != null && initialSongs.isNotEmpty
              ? 'Save Queue as Playlist'
              : 'New Playlist'),
          content: TextField(
            controller: controller,
            autofocus: true,
            decoration: const InputDecoration(
              hintText: 'Playlist name',
              border: OutlineInputBorder(),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () async {
                final name = controller.text.trim();
                if (name.isNotEmpty) {
                  final db = ref.read(databaseProvider);
                  final playlistId = const Uuid().v4();
                  await db.musicDao.insertPlaylist(
                    MusicPlaylistsCompanion.insert(
                      id: playlistId,
                      name: name,
                      createdAt: DateTime.now(),
                    ),
                  );

                  if (initialSongs != null && initialSongs.isNotEmpty) {
                    for (final song in initialSongs) {
                      await db.musicDao.addSongToPlaylist(
                        PlaylistSongsCompanion.insert(
                          playlistId: playlistId,
                          songPath: song.data,
                        ),
                      );
                    }
                  }
                }
                if (ctx.mounted) Navigator.pop(ctx);
              },
              child: const Text('Create'),
            ),
          ],
        );
      },
    );
  }

  /// Opens a dialog to choose a playlist to add a single song to
  static Future<void> showAddToPlaylistDialog(
    BuildContext context,
    WidgetRef ref,
    SongModel song,
  ) async {
    await showAddSongsToPlaylistDialog(context, ref, [song]);
  }

  /// Opens a dialog to choose a playlist to add multiple songs to
  static Future<void> showAddSongsToPlaylistDialog(
    BuildContext context,
    WidgetRef ref,
    List<SongModel> songs,
  ) async {
    final playlistsAsync = ref.read(musicPlaylistsProvider);
    final playlists = playlistsAsync.valueOrNull ?? [];

    await showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: Text(songs.length == 1
              ? 'Add to Playlist'
              : 'Add ${songs.length} Tracks to Playlist'),
          content: SizedBox(
            width: double.maxFinite,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(
                  leading: const Icon(Icons.add, color: Colors.tealAccent),
                  title: const Text('Create New Playlist'),
                  onTap: () {
                    Navigator.pop(ctx);
                    showCreatePlaylistDialog(context, ref, initialSongs: songs);
                  },
                ),
                const Divider(),
                if (playlists.isEmpty)
                  const Padding(
                    padding: EdgeInsets.all(16),
                    child: Text('No playlists yet.', style: TextStyle(color: Colors.grey)),
                  )
                else
                  Flexible(
                    child: ListView.builder(
                      shrinkWrap: true,
                      itemCount: playlists.length,
                      itemBuilder: (context, index) {
                        final pl = playlists[index];
                        return ListTile(
                          leading: const Icon(Icons.queue_music),
                          title: Text(pl.name),
                          onTap: () async {
                            final db = ref.read(databaseProvider);
                            for (final song in songs) {
                              await db.musicDao.addSongToPlaylist(
                                PlaylistSongsCompanion.insert(
                                  playlistId: pl.id,
                                  songPath: song.data,
                                ),
                              );
                            }
                            if (ctx.mounted) {
                              Navigator.pop(ctx);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    songs.length == 1
                                        ? 'Added to ${pl.name}'
                                        : 'Added ${songs.length} tracks to ${pl.name}',
                                  ),
                                ),
                              );
                            }
                          },
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }
}
