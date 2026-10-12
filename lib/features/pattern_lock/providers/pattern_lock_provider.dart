import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/security/security_service.dart';

class PatternLockState {
  final bool isInitialized;
  final bool isSet;
  final bool isEnabled;
  final bool isUnlocked;
  final String? errorMessage;

  const PatternLockState({
    this.isInitialized = false,
    this.isSet = false,
    this.isEnabled = false,
    this.isUnlocked = false,
    this.errorMessage,
  });

  PatternLockState copyWith({
    bool? isInitialized,
    bool? isSet,
    bool? isEnabled,
    bool? isUnlocked,
    String? errorMessage,
    bool clearError = false,
  }) {
    return PatternLockState(
      isInitialized: isInitialized ?? this.isInitialized,
      isSet: isSet ?? this.isSet,
      isEnabled: isEnabled ?? this.isEnabled,
      isUnlocked: isUnlocked ?? this.isUnlocked,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

class PatternLockNotifier extends StateNotifier<PatternLockState> {
  final SecurityService _securityService;

  PatternLockNotifier(this._securityService) : super(const PatternLockState()) {
    initialize();
  }

  Future<void> initialize() async {
    final isSet = await _securityService.isPatternSet();
    final isEnabled = await _securityService.isPatternEnabled();

    state = state.copyWith(
      isInitialized: true,
      isSet: isSet,
      isEnabled: isEnabled,
      // If no pattern is set or pattern is disabled, user is unlocked by default
      isUnlocked: !isEnabled,
      clearError: true,
    );
  }

  /// Sets up a new pattern on first launch
  Future<bool> setupPattern(String pattern) async {
    if (pattern.length < AppConstants.minPatternLength) {
      state = state.copyWith(
        errorMessage: 'Connect at least ${AppConstants.minPatternLength} dots',
      );
      return false;
    }

    try {
      await _securityService.setPattern(pattern);
      state = state.copyWith(
        isSet: true,
        isEnabled: true,
        isUnlocked: true,
        clearError: true,
      );
      return true;
    } catch (e) {
      state = state.copyWith(errorMessage: 'Failed to save pattern: ${e.toString()}');
      return false;
    }
  }

  /// Verifies pattern and unlocks app
  Future<bool> unlock(String pattern) async {
    final isValid = await _securityService.verifyPattern(pattern);
    if (isValid) {
      state = state.copyWith(isUnlocked: true, clearError: true);
      return true;
    } else {
      state = state.copyWith(errorMessage: 'Incorrect pattern. Try again.');
      return false;
    }
  }

  /// Changes existing pattern after verifying current pattern
  Future<bool> changePattern({
    required String currentPattern,
    required String newPattern,
  }) async {
    if (newPattern.length < AppConstants.minPatternLength) {
      state = state.copyWith(
        errorMessage: 'New pattern must connect at least ${AppConstants.minPatternLength} dots',
      );
      return false;
    }

    final success = await _securityService.changePattern(
      currentPattern: currentPattern,
      newPattern: newPattern,
    );

    if (success) {
      state = state.copyWith(clearError: true);
      return true;
    } else {
      state = state.copyWith(errorMessage: 'Current pattern was incorrect.');
      return false;
    }
  }

  /// Disables pattern lock after verifying current pattern
  Future<bool> disablePattern(String currentPattern) async {
    final success = await _securityService.disablePattern(currentPattern);
    if (success) {
      state = state.copyWith(
        isEnabled: false,
        isUnlocked: true,
        clearError: true,
      );
      return true;
    } else {
      state = state.copyWith(errorMessage: 'Incorrect pattern.');
      return false;
    }
  }

  /// Enables pattern lock after verifying pattern
  Future<bool> enablePattern(String currentPattern) async {
    final success = await _securityService.enablePattern(currentPattern);
    if (success) {
      state = state.copyWith(isEnabled: true, clearError: true);
      return true;
    } else {
      state = state.copyWith(errorMessage: 'Incorrect pattern.');
      return false;
    }
  }

  void clearError() {
    if (state.errorMessage != null) {
      state = state.copyWith(clearError: true);
    }
  }

  void relock() {
    if (state.isEnabled) {
      state = state.copyWith(isUnlocked: false);
    }
  }
}

final patternLockProvider =
    StateNotifierProvider<PatternLockNotifier, PatternLockState>((ref) {
  final security = ref.watch(securityServiceProvider);
  return PatternLockNotifier(security);
});
