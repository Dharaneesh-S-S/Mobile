import 'package:flutter/material.dart';

/// Design tokens: Curated Futuristic Teal Glass Fintech palette per DESIGN_SPEC.md.
class AppColors {
  // Canvas & Backgrounds (Obsidian & Deep Teal)
  static const Color canvasBase = Color(0xFF030707);
  static const Color canvasSurface = Color(0xFF051211);
  static const Color canvasElevated = Color(0xFF081A18);

  // Neon & Glow Accents
  static const Color glowTealPrimary = Color(0xFF19E6C8);
  static const Color glowTealSecondary = Color(0xFF0D9488);
  static const Color glowTealDeep = Color(0xFF064E3B);
  static const Color accentCyan = Color(0xFF19E6C8);
  static const Color accentMint = Color(0xFF2DD4BF);
  static const Color accentEmerald = Color(0xFF2DD4BF);
  static const Color accentViolet = Color(0xFF0D9488);
  static const Color accentAmber = Color(0xFFFBBF24);
  static const Color accentRose = Color(0xFFFF6B6B);
  static const Color accentTransfer = Color(0xFF38BDF8);

  // Glass Surfaces & Translucent Tints
  static const Color glassBgSubtle = Color(0x73061211);
  static const Color glassBgMedium = Color(0xA6081817);
  static const Color glassBgElevated = Color(0xD10C201E);
  static const Color glassBorderFaint = Color(0x1F2DD4BF);
  static const Color glassBorderGlow = Color(0x4D2DD4BF);
  static const Color glassBorderActive = Color(0x8C19E6C8);

  // Typography Tokens
  static const Color textWhiteHeading = Color(0xFFF4FFFD);
  static const Color textTealBody = Color(0xFF94B5B0);
  static const Color textTealMuted = Color(0xFF5B7B76);
  static const Color textTealDim = Color(0xFF354F4B);
  static const Color textAccentCyan = Color(0xFF2DD4BF);

  // Financial Semantics (Indian Rupee ₹)
  static const Color semanticIncome = Color(0xFF19E6C8);
  static const Color semanticExpense = Color(0xFFFF6B6B);
  static const Color semanticTransfer = Color(0xFF38BDF8);
  static const Color semanticNetSavings = Color(0xFF2DD4BF);

  // Dark Palette (Main App Theme Aliases)
  static const Color darkBackground = canvasBase;
  static const Color darkSurface = canvasSurface;
  static const Color darkSurfaceVariant = canvasElevated;
  static const Color darkBorder = glassBorderFaint;
  static const Color darkTextPrimary = textWhiteHeading;
  static const Color darkTextSecondary = textTealBody;
  static const Color darkTextTertiary = textTealMuted;
  static const Color darkError = semanticExpense;

  // Light Palette
  static const Color lightBackground = Color(0xFFF4F9F8);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceVariant = Color(0xFFE6F2F0);
  static const Color lightBorder = Color(0xFFCFE3E0);
  static const Color lightTextPrimary = Color(0xFF04100F);
  static const Color lightTextSecondary = Color(0xFF2D5550);
  static const Color lightTextTertiary = Color(0xFF5B7B76);
  static const Color lightError = Color(0xFFDC2626);

  // Aliases for Tasks UI
  static const Color backgroundBase = darkBackground;
  static const Color backgroundSurface = darkSurface;
  static const Color textPrimary = darkTextPrimary;
  static const Color textSecondary = darkTextSecondary;
  static const Color borderDefault = darkBorder;
}
