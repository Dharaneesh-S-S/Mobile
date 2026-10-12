import 'package:flutter/material.dart';

/// Design tokens: Curated, high-contrast, modern color palette for Personal Hub.
class AppColors {
  // Common Accents
  static const Color accentCyan = Color(0xFF38BDF8);
  static const Color accentViolet = Color(0xFFA78BFA);
  static const Color accentEmerald = Color(0xFF34D399);
  static const Color accentAmber = Color(0xFFFBBF24);
  static const Color accentRose = Color(0xFFFB7185);

  // Dark Palette
  static const Color darkBackground = Color(0xFF0B0F19);
  static const Color darkSurface = Color(0xFF151C2C);
  static const Color darkSurfaceVariant = Color(0xFF1F293D);
  static const Color darkBorder = Color(0xFF26334D);
  static const Color darkTextPrimary = Color(0xFFF8FAFC);
  static const Color darkTextSecondary = Color(0xFF94A3B8);
  static const Color darkTextTertiary = Color(0xFF64748B);
  static const Color darkError = Color(0xFFF87171);

  // Light Palette
  static const Color lightBackground = Color(0xFFF8FAFC);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceVariant = Color(0xFFF1F5F9);
  static const Color lightBorder = Color(0xFFE2E8F0);
  static const Color lightTextPrimary = Color(0xFF0F172A);
  static const Color lightTextSecondary = Color(0xFF475569);
  static const Color lightTextTertiary = Color(0xFF94A3B8);
  static const Color lightError = Color(0xFFDC2626);

  // Aliases for Tasks UI
  static const Color backgroundBase = lightBackground;
  static const Color backgroundSurface = lightSurface;
  static const Color textPrimary = lightTextPrimary;
  static const Color textSecondary = lightTextSecondary;
  static const Color borderDefault = lightBorder;
}
