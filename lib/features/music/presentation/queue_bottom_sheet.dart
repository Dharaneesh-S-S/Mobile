import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:on_audio_query/on_audio_query.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/music_player_provider.dart';
import 'playlist_dialogs.dart';

class QueueBottomSheet extends ConsumerWidget {
  const QueueBottomSheet({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final queue = ref.watch(musicQueueProvider);
    final currentSong = ref.watch(currentSongProvider);
    final controller = ref.read(musicPlaybackControllerProvider);

    return Container(
      height: MediaQuery.of(context).size.height * 0.75,
      decoration: const BoxDecoration(
        color: AppColors.canvasBase,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        border: Border(
          top: BorderSide(color: AppColors.glassBorderGlow, width: 1.2),
          left: BorderSide(color: AppColors.glassBorderFaint, width: 1),
          right: BorderSide(color: AppColors.glassBorderFaint, width: 1),
        ),
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            width: 44,
            height: 4,
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            decoration: BoxDecoration(
              color: AppColors.textTealMuted.withOpacity(0.4),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 12, 10),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Now Playing Queue',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textWhiteHeading,
                          letterSpacing: 0.3,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${queue.length} tracks',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.textTealMuted,
                        ),
                      ),
                    ],
                  ),
                ),
                // Save Queue as Playlist
                if (queue.isNotEmpty) ...[
                  IconButton(
                    icon: const Icon(Icons.playlist_add, color: AppColors.accentMint, size: 22),
                    tooltip: 'Save Queue as Playlist',
                    onPressed: () {
                      PlaylistDialogs.showCreatePlaylistDialog(context, ref, initialSongs: queue);
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_sweep_outlined, color: AppColors.accentRose, size: 22),
                    tooltip: 'Clear Queue',
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          backgroundColor: AppColors.canvasSurface,
                          title: const Text('Clear Queue', style: TextStyle(color: AppColors.textWhiteHeading)),
                          content: const Text(
                            'Are you sure you want to clear all tracks from the queue?',
                            style: TextStyle(color: AppColors.textTealBody),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(ctx),
                              child: const Text('Cancel', style: TextStyle(color: AppColors.textTealMuted)),
                            ),
                            FilledButton(
                              style: FilledButton.styleFrom(backgroundColor: AppColors.accentRose),
                              onPressed: () {
                                Navigator.pop(ctx);
                                controller.clearQueue();
                              },
                              child: const Text('Clear'),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ],
                IconButton(
                  icon: const Icon(Icons.close, color: AppColors.textTealMuted),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.glassBorderFaint),
          if (queue.isEmpty)
            const Expanded(
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.queue_music_outlined, size: 48, color: AppColors.textTealMuted),
                    SizedBox(height: 12),
                    Text(
                      'Playback queue is empty.',
                      style: TextStyle(color: AppColors.textTealMuted, fontSize: 14),
                    ),
                  ],
                ),
              ),
            )
          else
            Expanded(
              child: ReorderableListView.builder(
                padding: const EdgeInsets.only(bottom: 24, top: 4),
                itemCount: queue.length,
                onReorder: (oldIndex, newIndex) {
                  controller.reorderQueue(oldIndex, newIndex);
                },
                itemBuilder: (context, index) {
                  final song = queue[index];
                  final isCurrent = song.id == currentSong?.id;

                  return Dismissible(
                    key: ValueKey('queue_${song.id}_$index'),
                    direction: DismissDirection.endToStart,
                    background: Container(
                      alignment: Alignment.centerRight,
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      color: AppColors.accentRose.withOpacity(0.3),
                      child: const Icon(Icons.delete_outline, color: AppColors.accentRose),
                    ),
                    onDismissed: (_) {
                      controller.removeFromQueue(index);
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 3),
                      decoration: BoxDecoration(
                        color: isCurrent
                            ? AppColors.glowTealDeep.withOpacity(0.35)
                            : AppColors.glassBgSubtle,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isCurrent
                              ? AppColors.glassBorderActive
                              : AppColors.glassBorderFaint,
                        ),
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
                        leading: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: SizedBox(
                            width: 44,
                            height: 44,
                            child: isCurrent
                                ? Container(
                                    color: AppColors.glowTealDeep,
                                    child: const Center(
                                      child: Icon(
                                        Icons.graphic_eq,
                                        color: AppColors.glowTealPrimary,
                                        size: 24,
                                      ),
                                    ),
                                  )
                                : QueryArtworkWidget(
                                    id: song.id,
                                    type: ArtworkType.AUDIO,
                                    nullArtworkWidget: Container(
                                      color: AppColors.canvasElevated,
                                      child: const Icon(
                                        Icons.music_note,
                                        color: AppColors.textTealMuted,
                                        size: 20,
                                      ),
                                    ),
                                  ),
                          ),
                        ),
                        title: Text(
                          song.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: isCurrent ? FontWeight.bold : FontWeight.w500,
                            color: isCurrent
                                ? AppColors.glowTealPrimary
                                : AppColors.textWhiteHeading,
                          ),
                        ),
                        subtitle: Text(
                          song.artist ?? 'Unknown Artist',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 12, color: AppColors.textTealMuted),
                        ),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.close, size: 18, color: AppColors.textTealMuted),
                              tooltip: 'Remove',
                              onPressed: () => controller.removeFromQueue(index),
                            ),
                            ReorderableDragStartListener(
                              index: index,
                              child: const Padding(
                                padding: EdgeInsets.all(8.0),
                                child: Icon(Icons.drag_handle, color: AppColors.textTealMuted),
                              ),
                            ),
                          ],
                        ),
                        onTap: () {
                          controller.playSong(song, queue, index: index);
                        },
                      ),
                    ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }
}
