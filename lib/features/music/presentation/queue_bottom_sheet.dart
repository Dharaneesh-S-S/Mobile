import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:on_audio_query/on_audio_query.dart';
import '../providers/music_player_provider.dart';

class QueueBottomSheet extends ConsumerWidget {
  const QueueBottomSheet({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final queue = ref.watch(musicQueueProvider);
    final currentSong = ref.watch(currentSongProvider);
    final controller = ref.read(musicPlaybackControllerProvider);

    return Container(
      height: MediaQuery.of(context).size.height * 0.7,
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            decoration: BoxDecoration(
              color: Colors.grey.withOpacity(0.4),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Playing Queue', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                    Text('${queue.length} tracks', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          if (queue.isEmpty)
            const Expanded(
              child: Center(
                child: Text('Playback queue is empty.', style: TextStyle(color: Colors.grey)),
              ),
            )
          else
            Expanded(
              child: ReorderableListView.builder(
                padding: const EdgeInsets.only(bottom: 24),
                itemCount: queue.length,
                onReorder: (oldIndex, newIndex) {
                  // Adjust for reorder index
                  if (newIndex > oldIndex) newIndex -= 1;
                  final list = List<SongModel>.from(queue);
                  final item = list.removeAt(oldIndex);
                  list.insert(newIndex, item);
                  ref.read(musicQueueProvider.notifier).state = list;
                },
                itemBuilder: (context, index) {
                  final song = queue[index];
                  final isCurrent = song.id == currentSong?.id;

                  return ListTile(
                    key: ValueKey('${song.id}_$index'),
                    leading: isCurrent
                        ? Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primary,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.graphic_eq, color: Colors.white, size: 20),
                          )
                        : QueryArtworkWidget(
                            id: song.id,
                            type: ArtworkType.AUDIO,
                            nullArtworkWidget: Container(
                              width: 36,
                              height: 36,
                              decoration: BoxDecoration(
                                color: theme.colorScheme.surfaceVariant,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Icon(Icons.music_note, size: 20),
                            ),
                          ),
                    title: Text(
                      song.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                        color: isCurrent ? theme.colorScheme.primary : null,
                      ),
                    ),
                    subtitle: Text(
                      song.artist ?? 'Unknown Artist',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 12),
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove_circle_outline, size: 20, color: Colors.redAccent),
                          onPressed: () => controller.removeFromQueue(index),
                        ),
                        const Icon(Icons.drag_handle, color: Colors.grey),
                      ],
                    ),
                    onTap: () {
                      controller.playSong(song, queue, index: index);
                    },
                  );
                },
              ),
            ),
        ],
      ),
    );
  }
}
