import 'package:app_settings/app_settings.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/usage_models.dart';
import '../services/usage_notification_manager.dart';

class UsageSettingsScreen extends ConsumerStatefulWidget {
  const UsageSettingsScreen({super.key});

  @override
  ConsumerState<UsageSettingsScreen> createState() => _UsageSettingsScreenState();
}

class _UsageSettingsScreenState extends ConsumerState<UsageSettingsScreen> {
  UsageNotificationSettings _settings = const UsageNotificationSettings();
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final s = await UsageNotificationManager.instance.loadSettings();
    if (mounted) {
      setState(() {
        _settings = s;
        _isLoading = false;
      });
    }
  }

  Future<void> _updateSettings(UsageNotificationSettings newSettings) async {
    setState(() => _settings = newSettings);
    await UsageNotificationManager.instance.saveSettings(newSettings);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Usage Settings')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Usage Settings & Alerts'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Section 1: Notification Preferences
          _buildSectionHeader('Notifications & Thresholds', Icons.notifications_active_outlined, theme),
          const SizedBox(height: 8),

          _buildSwitchTile(
            title: 'Daily Screen Time Limit',
            subtitle: 'Alert when total daily screen-time limit is reached',
            value: _settings.dailyLimitReachedEnabled,
            onChanged: (val) => _updateSettings(UsageNotificationSettings(
              continuousUseWarningEnabled: _settings.continuousUseWarningEnabled,
              continuousUseThresholdMinutes: _settings.continuousUseThresholdMinutes,
              dailyLimitReachedEnabled: val,
              appLimitReachedEnabled: _settings.appLimitReachedEnabled,
              categoryLimitReachedEnabled: _settings.categoryLimitReachedEnabled,
              dailyWeeklyReportEnabled: _settings.dailyWeeklyReportEnabled,
              goalAchievedEnabled: _settings.goalAchievedEnabled,
              increasedUsageWarningEnabled: _settings.increasedUsageWarningEnabled,
              focusSessionCompletedEnabled: _settings.focusSessionCompletedEnabled,
              phoneFreeSessionCompletedEnabled: _settings.phoneFreeSessionCompletedEnabled,
            )),
          ),

          _buildSwitchTile(
            title: 'Individual App Limits',
            subtitle: 'Alert when configured per-app usage limits are hit',
            value: _settings.appLimitReachedEnabled,
            onChanged: (val) => _updateSettings(UsageNotificationSettings(
              continuousUseWarningEnabled: _settings.continuousUseWarningEnabled,
              continuousUseThresholdMinutes: _settings.continuousUseThresholdMinutes,
              dailyLimitReachedEnabled: _settings.dailyLimitReachedEnabled,
              appLimitReachedEnabled: val,
              categoryLimitReachedEnabled: _settings.categoryLimitReachedEnabled,
              dailyWeeklyReportEnabled: _settings.dailyWeeklyReportEnabled,
              goalAchievedEnabled: _settings.goalAchievedEnabled,
              increasedUsageWarningEnabled: _settings.increasedUsageWarningEnabled,
              focusSessionCompletedEnabled: _settings.focusSessionCompletedEnabled,
              phoneFreeSessionCompletedEnabled: _settings.phoneFreeSessionCompletedEnabled,
            )),
          ),

          _buildSwitchTile(
            title: 'Category Limits',
            subtitle: 'Alert when category limits (e.g. Social media) are exceeded',
            value: _settings.categoryLimitReachedEnabled,
            onChanged: (val) => _updateSettings(UsageNotificationSettings(
              continuousUseWarningEnabled: _settings.continuousUseWarningEnabled,
              continuousUseThresholdMinutes: _settings.continuousUseThresholdMinutes,
              dailyLimitReachedEnabled: _settings.dailyLimitReachedEnabled,
              appLimitReachedEnabled: _settings.appLimitReachedEnabled,
              categoryLimitReachedEnabled: val,
              dailyWeeklyReportEnabled: _settings.dailyWeeklyReportEnabled,
              goalAchievedEnabled: _settings.goalAchievedEnabled,
              increasedUsageWarningEnabled: _settings.increasedUsageWarningEnabled,
              focusSessionCompletedEnabled: _settings.focusSessionCompletedEnabled,
              phoneFreeSessionCompletedEnabled: _settings.phoneFreeSessionCompletedEnabled,
            )),
          ),

          _buildSwitchTile(
            title: 'Continuous-Use Reminders',
            subtitle: 'Warn after unbroken screen time (Threshold: ${_settings.continuousUseThresholdMinutes} min)',
            value: _settings.continuousUseWarningEnabled,
            onChanged: (val) => _updateSettings(UsageNotificationSettings(
              continuousUseWarningEnabled: val,
              continuousUseThresholdMinutes: _settings.continuousUseThresholdMinutes,
              dailyLimitReachedEnabled: _settings.dailyLimitReachedEnabled,
              appLimitReachedEnabled: _settings.appLimitReachedEnabled,
              categoryLimitReachedEnabled: _settings.categoryLimitReachedEnabled,
              dailyWeeklyReportEnabled: _settings.dailyWeeklyReportEnabled,
              goalAchievedEnabled: _settings.goalAchievedEnabled,
              increasedUsageWarningEnabled: _settings.increasedUsageWarningEnabled,
              focusSessionCompletedEnabled: _settings.focusSessionCompletedEnabled,
              phoneFreeSessionCompletedEnabled: _settings.phoneFreeSessionCompletedEnabled,
            )),
          ),

          if (_settings.continuousUseWarningEnabled)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Row(
                children: [
                  const Text('Threshold: ', style: TextStyle(fontWeight: FontWeight.w500)),
                  Expanded(
                    child: Slider(
                      value: _settings.continuousUseThresholdMinutes.toDouble(),
                      min: 20,
                      max: 180,
                      divisions: 16,
                      label: '${_settings.continuousUseThresholdMinutes}m',
                      onChanged: (val) => _updateSettings(UsageNotificationSettings(
                        continuousUseWarningEnabled: _settings.continuousUseWarningEnabled,
                        continuousUseThresholdMinutes: val.toInt(),
                        dailyLimitReachedEnabled: _settings.dailyLimitReachedEnabled,
                        appLimitReachedEnabled: _settings.appLimitReachedEnabled,
                        categoryLimitReachedEnabled: _settings.categoryLimitReachedEnabled,
                        dailyWeeklyReportEnabled: _settings.dailyWeeklyReportEnabled,
                        goalAchievedEnabled: _settings.goalAchievedEnabled,
                        increasedUsageWarningEnabled: _settings.increasedUsageWarningEnabled,
                        focusSessionCompletedEnabled: _settings.focusSessionCompletedEnabled,
                        phoneFreeSessionCompletedEnabled: _settings.phoneFreeSessionCompletedEnabled,
                      )),
                    ),
                  ),
                  Text('${_settings.continuousUseThresholdMinutes}m',
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                ],
              ),
            ),

          _buildSwitchTile(
            title: 'Usage Spike Warning',
            subtitle: 'Notify if screen time increases by >30% compared to yesterday',
            value: _settings.increasedUsageWarningEnabled,
            onChanged: (val) => _updateSettings(UsageNotificationSettings(
              continuousUseWarningEnabled: _settings.continuousUseWarningEnabled,
              continuousUseThresholdMinutes: _settings.continuousUseThresholdMinutes,
              dailyLimitReachedEnabled: _settings.dailyLimitReachedEnabled,
              appLimitReachedEnabled: _settings.appLimitReachedEnabled,
              categoryLimitReachedEnabled: _settings.categoryLimitReachedEnabled,
              dailyWeeklyReportEnabled: _settings.dailyWeeklyReportEnabled,
              goalAchievedEnabled: _settings.goalAchievedEnabled,
              increasedUsageWarningEnabled: val,
              focusSessionCompletedEnabled: _settings.focusSessionCompletedEnabled,
              phoneFreeSessionCompletedEnabled: _settings.phoneFreeSessionCompletedEnabled,
            )),
          ),

          _buildSwitchTile(
            title: 'Goal Achieved Celebrations',
            subtitle: 'Congratulate when daily screen-time limit is respected',
            value: _settings.goalAchievedEnabled,
            onChanged: (val) => _updateSettings(UsageNotificationSettings(
              continuousUseWarningEnabled: _settings.continuousUseWarningEnabled,
              continuousUseThresholdMinutes: _settings.continuousUseThresholdMinutes,
              dailyLimitReachedEnabled: _settings.dailyLimitReachedEnabled,
              appLimitReachedEnabled: _settings.appLimitReachedEnabled,
              categoryLimitReachedEnabled: _settings.categoryLimitReachedEnabled,
              dailyWeeklyReportEnabled: _settings.dailyWeeklyReportEnabled,
              goalAchievedEnabled: val,
              increasedUsageWarningEnabled: _settings.increasedUsageWarningEnabled,
              focusSessionCompletedEnabled: _settings.focusSessionCompletedEnabled,
              phoneFreeSessionCompletedEnabled: _settings.phoneFreeSessionCompletedEnabled,
            )),
          ),

          _buildSwitchTile(
            title: 'Daily & Weekly Reports',
            subtitle: 'Summarize screen time trends and category breakdowns',
            value: _settings.dailyWeeklyReportEnabled,
            onChanged: (val) => _updateSettings(UsageNotificationSettings(
              continuousUseWarningEnabled: _settings.continuousUseWarningEnabled,
              continuousUseThresholdMinutes: _settings.continuousUseThresholdMinutes,
              dailyLimitReachedEnabled: _settings.dailyLimitReachedEnabled,
              appLimitReachedEnabled: _settings.appLimitReachedEnabled,
              categoryLimitReachedEnabled: _settings.categoryLimitReachedEnabled,
              dailyWeeklyReportEnabled: val,
              goalAchievedEnabled: _settings.goalAchievedEnabled,
              increasedUsageWarningEnabled: _settings.increasedUsageWarningEnabled,
              focusSessionCompletedEnabled: _settings.focusSessionCompletedEnabled,
              phoneFreeSessionCompletedEnabled: _settings.phoneFreeSessionCompletedEnabled,
            )),
          ),

          _buildSwitchTile(
            title: 'Focus Session Completion',
            subtitle: 'Sound an alert when Pomodoro or focus countdown concludes',
            value: _settings.focusSessionCompletedEnabled,
            onChanged: (val) => _updateSettings(UsageNotificationSettings(
              continuousUseWarningEnabled: _settings.continuousUseWarningEnabled,
              continuousUseThresholdMinutes: _settings.continuousUseThresholdMinutes,
              dailyLimitReachedEnabled: _settings.dailyLimitReachedEnabled,
              appLimitReachedEnabled: _settings.appLimitReachedEnabled,
              categoryLimitReachedEnabled: _settings.categoryLimitReachedEnabled,
              dailyWeeklyReportEnabled: _settings.dailyWeeklyReportEnabled,
              goalAchievedEnabled: _settings.goalAchievedEnabled,
              increasedUsageWarningEnabled: _settings.increasedUsageWarningEnabled,
              focusSessionCompletedEnabled: val,
              phoneFreeSessionCompletedEnabled: _settings.phoneFreeSessionCompletedEnabled,
            )),
          ),

          _buildSwitchTile(
            title: 'Phone-Free Session Completion',
            subtitle: 'Notify when scheduled phone-free or bedtime period ends',
            value: _settings.phoneFreeSessionCompletedEnabled,
            onChanged: (val) => _updateSettings(UsageNotificationSettings(
              continuousUseWarningEnabled: _settings.continuousUseWarningEnabled,
              continuousUseThresholdMinutes: _settings.continuousUseThresholdMinutes,
              dailyLimitReachedEnabled: _settings.dailyLimitReachedEnabled,
              appLimitReachedEnabled: _settings.appLimitReachedEnabled,
              categoryLimitReachedEnabled: _settings.categoryLimitReachedEnabled,
              dailyWeeklyReportEnabled: _settings.dailyWeeklyReportEnabled,
              goalAchievedEnabled: _settings.goalAchievedEnabled,
              increasedUsageWarningEnabled: _settings.increasedUsageWarningEnabled,
              focusSessionCompletedEnabled: _settings.focusSessionCompletedEnabled,
              phoneFreeSessionCompletedEnabled: val,
            )),
          ),

          const SizedBox(height: 24),

          // Section 2: Android Battery & Performance Architecture
          _buildSectionHeader('Battery & Performance Architecture', Icons.battery_charging_full_rounded, theme),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: theme.colorScheme.surfaceVariant.withOpacity(0.5),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey.withOpacity(0.2)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.shield_outlined, color: Colors.blue),
                    SizedBox(width: 8),
                    Text('Android Background Execution Notice', style: TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  '• Efficient Lifecycle-Aware Refreshes: Data is queried on-demand when opening the app or pulling down to refresh, eliminating continuous background battery drain.\n\n'
                  '• Zero Aggressive App Blocking: Modern Android (API 29+) prevents third-party apps from killing processes without Device Administration or Accessibility hacks. Personal Hub uses non-intrusive notifications and mindful reminders instead.\n\n'
                  '• Notification Deduplication: Limits and alerts trigger at most once per calendar day to avoid spamming.',
                  style: theme.textTheme.bodyMedium?.copyWith(height: 1.4),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Section 3: Android Permissions & Privacy
          _buildSectionHeader('Android Permissions & Privacy', Icons.security_rounded, theme),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.08),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.verified_user_outlined, color: Color(0xFF10B981)),
                    SizedBox(width: 8),
                    Text('100% On-Device Privacy', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '• Android UsageStatsManager: Used solely to calculate foreground application time on your device.\n'
                  '• Notification Privacy: NotificationListenerService is strictly restricted to counting alerts—message text and contents are never collected or stored.\n'
                  '• Zero Analytics Telemetry: No data leaves your smartphone. Everything stays in your local encrypted database.',
                  style: theme.textTheme.bodySmall?.copyWith(height: 1.4),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.settings_outlined),
                    label: const Text('Check Android Usage Access Settings'),
                    onPressed: () async {
                      if (!kIsWeb) {
                        try {
                          await AppSettings.openAppSettings(type: AppSettingsType.security);
                        } catch (_) {}
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon, ThemeData theme) {
    return Row(
      children: [
        Icon(icon, size: 20, color: theme.colorScheme.primary),
        const SizedBox(width: 8),
        Text(
          title,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.primary,
          ),
        ),
      ],
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return SwitchListTile(
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      value: value,
      onChanged: onChanged,
      contentPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
    );
  }
}
