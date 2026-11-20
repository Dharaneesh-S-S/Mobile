import 'dart:io';

class LyricLine {
  final Duration timestamp;
  final String text;

  const LyricLine({
    required this.timestamp,
    required this.text,
  });
}

class LyricsParser {
  /// Parses standard LRC content into timestamped lyric lines
  static List<LyricLine> parseLrc(String content) {
    final List<LyricLine> lines = [];
    final regExp = RegExp(r'\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)');

    for (final rawLine in content.split('\n')) {
      final line = rawLine.trim();
      final match = regExp.firstMatch(line);
      if (match != null) {
        final minutes = int.tryParse(match.group(1) ?? '0') ?? 0;
        final seconds = int.tryParse(match.group(2) ?? '0') ?? 0;
        final millisStr = match.group(3) ?? '0';
        final millis = millisStr.length == 2
            ? (int.tryParse(millisStr) ?? 0) * 10
            : int.tryParse(millisStr) ?? 0;

        final duration = Duration(
          minutes: minutes,
          seconds: seconds,
          milliseconds: millis,
        );
        final text = (match.group(4) ?? '').trim();
        if (text.isNotEmpty) {
          lines.add(LyricLine(timestamp: duration, text: text));
        }
      }
    }

    lines.sort((a, b) => a.timestamp.compareTo(b.timestamp));
    return lines;
  }

  /// Attempts to find and load an .lrc file in the same folder as the song
  static Future<List<LyricLine>?> loadLyricsForSong(String songFilePath) async {
    try {
      final file = File(songFilePath);
      if (!file.existsSync()) return null;

      final lastDot = songFilePath.lastIndexOf('.');
      final basePath = lastDot > 0 ? songFilePath.substring(0, lastDot) : songFilePath;
      final lrcFile = File('$basePath.lrc');

      if (await lrcFile.exists()) {
        final content = await lrcFile.readAsString();
        final parsed = parseLrc(content);
        if (parsed.isNotEmpty) return parsed;
      }
    } catch (_) {}
    return null;
  }
}
