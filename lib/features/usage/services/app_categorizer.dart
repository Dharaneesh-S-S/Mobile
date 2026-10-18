import 'package:flutter/material.dart';

class AppCategorizer {
  static const String categorySocial = 'Social media';
  static const String categoryEntertainment = 'Entertainment';
  static const String categoryProductivity = 'Productivity';
  static const String categoryGames = 'Games';
  static const String categoryEducation = 'Education';
  static const String categoryCommunication = 'Communication';
  static const String categoryOther = 'Other';

  static const List<String> defaultCategories = [
    categorySocial,
    categoryEntertainment,
    categoryProductivity,
    categoryGames,
    categoryEducation,
    categoryCommunication,
    categoryOther,
  ];

  static Color getCategoryColor(String category) {
    switch (category) {
      case categorySocial:
        return const Color(0xFF8B5CF6); // Purple
      case categoryEntertainment:
        return const Color(0xFFF43F5E); // Rose
      case categoryProductivity:
        return const Color(0xFF10B981); // Emerald
      case categoryGames:
        return const Color(0xFFF59E0B); // Amber
      case categoryEducation:
        return const Color(0xFF0EA5E9); // Sky blue
      case categoryCommunication:
        return const Color(0xFF14B8A6); // Teal
      case categoryOther:
      default:
        return const Color(0xFF64748B); // Slate
    }
  }

  static IconData getCategoryIcon(String category) {
    switch (category) {
      case categorySocial:
        return Icons.people_outline;
      case categoryEntertainment:
        return Icons.movie_outlined;
      case categoryProductivity:
        return Icons.check_circle_outline;
      case categoryGames:
        return Icons.sports_esports_outlined;
      case categoryEducation:
        return Icons.school_outlined;
      case categoryCommunication:
        return Icons.chat_bubble_outline;
      case categoryOther:
      default:
        return Icons.category_outlined;
    }
  }

  /// Maps a package name to a default category based on package prefix or well-known bundle IDs
  static String inferDefaultCategory(String packageName, String appName) {
    final pkg = packageName.toLowerCase();
    final name = appName.toLowerCase();

    // Social Media
    if (pkg.contains('instagram') ||
        pkg.contains('facebook') ||
        pkg.contains('twitter') ||
        pkg.contains('snapchat') ||
        pkg.contains('reddit') ||
        pkg.contains('tiktok') ||
        pkg.contains('pinterest') ||
        pkg.contains('linkedin') ||
        name.contains('instagram') ||
        name.contains('facebook') ||
        name.contains('twitter') ||
        name.contains('tiktok') ||
        name.contains('reddit')) {
      return categorySocial;
    }

    // Communication
    if (pkg.contains('whatsapp') ||
        pkg.contains('telegram') ||
        pkg.contains('messaging') ||
        pkg.contains('dialer') ||
        pkg.contains('discord') ||
        pkg.contains('skype') ||
        pkg.contains('zoom') ||
        pkg.contains('viber') ||
        name.contains('whatsapp') ||
        name.contains('telegram') ||
        name.contains('messages') ||
        name.contains('phone') ||
        name.contains('discord')) {
      return categoryCommunication;
    }

    // Entertainment
    if (pkg.contains('youtube') ||
        pkg.contains('netflix') ||
        pkg.contains('spotify') ||
        pkg.contains('primevideo') ||
        pkg.contains('twitch') ||
        pkg.contains('disney') ||
        pkg.contains('vlc') ||
        pkg.contains('hotstar') ||
        pkg.contains('music') ||
        name.contains('youtube') ||
        name.contains('netflix') ||
        name.contains('spotify') ||
        name.contains('prime video')) {
      return categoryEntertainment;
    }

    // Productivity
    if (pkg.contains('gmail') ||
        pkg.contains('docs') ||
        pkg.contains('sheets') ||
        pkg.contains('notion') ||
        pkg.contains('slack') ||
        pkg.contains('keep') ||
        pkg.contains('calendar') ||
        pkg.contains('tasks') ||
        pkg.contains('office') ||
        name.contains('gmail') ||
        name.contains('calendar') ||
        name.contains('notes') ||
        name.contains('drive') ||
        name.contains('files')) {
      return categoryProductivity;
    }

    // Education
    if (pkg.contains('duolingo') ||
        pkg.contains('coursera') ||
        pkg.contains('khanacademy') ||
        pkg.contains('udemy') ||
        pkg.contains('quizlet') ||
        name.contains('duolingo') ||
        name.contains('learning')) {
      return categoryEducation;
    }

    // Games
    if (pkg.contains('game') ||
        pkg.contains('supercell') ||
        pkg.contains('king.') ||
        pkg.contains('roblox') ||
        pkg.contains('epicgames') ||
        pkg.contains('minecraft') ||
        name.contains('game')) {
      return categoryGames;
    }

    return categoryOther;
  }
}
