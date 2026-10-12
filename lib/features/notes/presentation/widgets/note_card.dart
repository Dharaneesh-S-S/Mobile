import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/daos/note_dao.dart';

class NoteCard extends ConsumerWidget {
  final NoteWithDetails noteDetails;

  const NoteCard({super.key, required this.noteDetails});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final note = noteDetails.note;
    final labels = noteDetails.labels;
    final checklist = noteDetails.checklistItems;
    
    Color bgColor = note.colorValue != null ? Color(note.colorValue!) : Theme.of(context).cardColor;

    return Card(
      color: bgColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.withOpacity(0.3), width: 1),
      ),
      elevation: 0,
      margin: const EdgeInsets.all(4),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {
          context.push('/notes/edit', extra: {'note': noteDetails});
        },
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              if (note.title != null && note.title!.isNotEmpty) ...[
                Text(
                  note.title!,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
              ],
              if (note.type == 'text' && note.content != null && note.content!.isNotEmpty) ...[
                // For a true Google Keep experience, we would parse quill delta here.
                // For MVP, we can strip JSON/HTML or just show a text preview if it's plain text.
                Text(
                  _extractPlainText(note.content!),
                  style: const TextStyle(fontSize: 14),
                  maxLines: 8,
                  overflow: TextOverflow.fade,
                ),
                const SizedBox(height: 8),
              ] else if (note.type == 'checklist' && checklist.isNotEmpty) ...[
                ...checklist.take(5).map((item) => Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      item.isChecked ? Icons.check_box : Icons.check_box_outline_blank,
                      size: 16,
                      color: item.isChecked ? Colors.grey : Colors.black87,
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        item.itemText,
                        style: TextStyle(
                          fontSize: 14,
                          decoration: item.isChecked ? TextDecoration.lineThrough : null,
                          color: item.isChecked ? Colors.grey : Colors.black87,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                )),
                if (checklist.length > 5)
                  Padding(
                    padding: const EdgeInsets.only(top: 4.0),
                    child: Text('+ ${checklist.length - 5} more items', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                  ),
                const SizedBox(height: 8),
              ],
              if (labels.isNotEmpty)
                Wrap(
                  spacing: 4,
                  runSpacing: 4,
                  children: labels.map((l) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey.withOpacity(0.5)),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(l.name, style: const TextStyle(fontSize: 10)),
                  )).toList(),
                ),
            ],
          ),
        ),
      ),
    );
  }

  String _extractPlainText(String content) {
    // Basic extraction if it's quill delta JSON (looks like [{"insert": "text\n"}])
    if (content.startsWith('[') && content.contains('"insert"')) {
      try {
        // Quick and dirty regex for simple text preview, 
        // a real app would parse the JSON properly.
        final regex = RegExp(r'"insert":"(.*?)"');
        final matches = regex.allMatches(content);
        final sb = StringBuffer();
        for (final m in matches) {
          String text = m.group(1) ?? '';
          text = text.replaceAll(r'\n', '\n');
          sb.write(text);
        }
        return sb.toString().trim();
      } catch (_) {
        return '...';
      }
    }
    return content;
  }
}
