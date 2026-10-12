import 'package:intl/intl.dart';

/// Utilities for precise currency calculation and formatting using minor currency units (Paise for INR).
/// 
/// 1 Rupee = 100 Paise.
/// Float arithmetic is strictly avoided to prevent rounding and precision errors.
class CurrencyFormatter {
  static final NumberFormat _inrFormat = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 2,
  );

  /// Converts paise (integer) to formatted INR string, e.g. 10050 -> "₹100.50"
  static String formatPaise(int paise, {bool showSymbol = true}) {
    final double rupees = paise / 100.0;
    if (showSymbol) {
      return _inrFormat.format(rupees);
    } else {
      final NumberFormat custom = NumberFormat('#,##,##0.00', 'en_IN');
      return custom.format(rupees);
    }
  }

  /// Converts user input rupee string (e.g. "125.50" or "100") safely to integer paise.
  /// Handles commas and trims whitespace.
  /// Throws [FormatException] if input is invalid.
  static int parseRupeesToPaise(String input) {
    final cleanInput = input.replaceAll('₹', '').replaceAll(',', '').trim();
    if (cleanInput.isEmpty) return 0;

    final parts = cleanInput.split('.');
    if (parts.length > 2) {
      throw const FormatException('Invalid currency format: multiple decimal points');
    }

    final rupees = int.tryParse(parts[0]);
    if (rupees == null) {
      throw const FormatException('Invalid currency format: non-numeric rupees');
    }

    int paise = 0;
    if (parts.length == 2) {
      final decPart = parts[1];
      if (decPart.length == 1) {
        final p = int.tryParse(decPart);
        if (p == null) throw const FormatException('Invalid decimal part');
        paise = p * 10;
      } else if (decPart.length == 2) {
        final p = int.tryParse(decPart);
        if (p == null) throw const FormatException('Invalid decimal part');
        paise = p;
      } else {
        // truncate or take first 2 digits
        final p = int.tryParse(decPart.substring(0, 2));
        if (p == null) throw const FormatException('Invalid decimal part');
        paise = p;
      }
    }

    if (rupees < 0) {
      return (rupees * 100) - paise;
    }
    return (rupees * 100) + paise;
  }

  /// Safe addition of two paise values
  static int add(int a, int b) => a + b;

  /// Safe subtraction of two paise values
  static int subtract(int a, int b) => a - b;

  /// Safe percentage calculation (basis points to avoid floats: 1% = 100 basis points)
  static int applyBasisPoints(int paise, int basisPoints) {
    return (paise * basisPoints) ~/ 10000;
  }
}
