import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/constants/app_constants.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/utils/date_time_utils.dart';
import '../../pattern_lock/presentation/pattern_change_sheet.dart';
import '../../pattern_lock/providers/pattern_lock_provider.dart';

/// App-wide settings for Appearance, Security (Pattern Lock), Backup & Restore, and App Info.
class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _isExporting = false;
  bool _isRestoring = false;

  void _handleChangeTheme(ThemeMode? mode) {
    if (mode != null) {
      ref.read(themeModeProvider.notifier).setThemeMode(mode);
    }
  }

  void _handleChangePattern() async {
    final result = await PatternChangeSheet.show(
      context,
      mode: ChangeFlowMode.changePattern,
    );
    if (result == true && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Pattern lock successfully updated!'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _handleTogglePattern(bool enabled) async {
    final result = await PatternChangeSheet.show(
      context,
      mode: enabled ? ChangeFlowMode.enablePattern : ChangeFlowMode.disablePattern,
    );
    if (result == true && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            enabled ? 'Pattern lock enabled!' : 'Pattern lock disabled.',
          ),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _handleExportBackup() async {
    setState(() => _isExporting = true);
    try {
      final backupService = ref.read(backupServiceProvider);
      final backupFile = await backupService.exportEncryptedBackup();
      await backupService.shareBackupFile(backupFile);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Encrypted backup generated successfully.'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Export failed: ${e.toString()}'),
            backgroundColor: Theme.of(context).colorScheme.error,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isExporting = false);
    }
  }

  void _handleRestoreBackup() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.any,
      );

      if (result == null || result.files.single.path == null) {
        return;
      }

      setState(() => _isRestoring = true);
      final file = File(result.files.single.path!);
      final backupService = ref.read(backupServiceProvider);

      // 1. Validate backup integrity before asking confirmation
      final validation = await backupService.validateBackupFile(file);

      if (!validation.isValid) {
        if (mounted) {
          showDialog(
            context: context,
            builder: (ctx) => AlertDialog(
              title: const Row(
                children: [
                  Icon(Icons.error_outline_rounded, color: Colors.red),
                  SizedBox(width: 8),
                  Text('Backup Invalid'),
                ],
              ),
              content: Text(
                validation.errorMessage ?? 'The selected file is not a valid or authentic Personal Hub backup.',
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: const Text('OK'),
                ),
              ],
            ),
          );
        }
        return;
      }

      // 2. Ask user for explicit confirmation before destructive overwrite
      if (mounted) {
        final confirmed = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Row(
              children: [
                Icon(Icons.warning_amber_rounded, color: Colors.amber),
                SizedBox(width: 8),
                Text('Confirm Restore'),
              ],
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Backup created on: ${DateTimeUtils.formatLocalDateTime(validation.timestampUtc)}',
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),
                const Text('Records to be restored:'),
                const SizedBox(height: 6),
                ...validation.recordCounts.entries.map((e) {
                  return Padding(
                    padding: const EdgeInsets.only(left: 8.0, bottom: 2.0),
                    child: Text('• ${e.key}: ${e.value}'),
                  );
                }),
                const SizedBox(height: 16),
                const Text(
                  'WARNING: Restoring will overwrite existing data in the database with the backup records. This action cannot be undone.',
                  style: TextStyle(color: Colors.red, fontWeight: FontWeight.w600, fontSize: 13),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(ctx).pop(false),
                child: const Text('Cancel'),
              ),
              FilledButton(
                style: FilledButton.styleFrom(backgroundColor: Colors.red),
                onPressed: () => Navigator.of(ctx).pop(true),
                child: const Text('Overwrite & Restore'),
              ),
            ],
          ),
        );

        if (confirmed == true) {
          await backupService.restoreValidatedBackup(validation);
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Backup restored successfully! All data updated.'),
                behavior: SnackBarBehavior.floating,
              ),
            );
          }
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Restore failed: ${e.toString()}'),
            backgroundColor: Theme.of(context).colorScheme.error,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isRestoring = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currentThemeMode = ref.watch(themeModeProvider);
    final lockState = ref.watch(patternLockProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16.0),
          children: [
            // 1. Appearance Section
            _buildSectionHeader('Appearance', Icons.palette_outlined),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  children: [
                    RadioListTile<ThemeMode>(
                      title: const Text('Dark Mode (Default)'),
                      subtitle: const Text('High contrast obsidian midnight aesthetic'),
                      value: ThemeMode.dark,
                      groupValue: currentThemeMode,
                      onChanged: _handleChangeTheme,
                    ),
                    const Divider(height: 1),
                    RadioListTile<ThemeMode>(
                      title: const Text('Light Mode'),
                      subtitle: const Text('Clean crisp day theme'),
                      value: ThemeMode.light,
                      groupValue: currentThemeMode,
                      onChanged: _handleChangeTheme,
                    ),
                    const Divider(height: 1),
                    RadioListTile<ThemeMode>(
                      title: const Text('System Default'),
                      subtitle: const Text('Follow Android device system setting'),
                      value: ThemeMode.system,
                      groupValue: currentThemeMode,
                      onChanged: _handleChangeTheme,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // 2. Security (Pattern Lock) Section
            _buildSectionHeader('Security & Privacy', Icons.security_rounded),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  children: [
                    SwitchListTile(
                      title: const Text('3×3 Pattern Lock'),
                      subtitle: Text(
                        lockState.isEnabled
                            ? 'Active — Required on app startup'
                            : 'Disabled — App opens directly',
                      ),
                      value: lockState.isEnabled,
                      onChanged: (val) => _handleTogglePattern(val),
                    ),
                    if (lockState.isEnabled) ...[
                      const Divider(height: 1),
                      ListTile(
                        leading: const Icon(Icons.password_rounded),
                        title: const Text('Change Pattern Lock'),
                        subtitle: const Text('Verify current pattern and draw a new one'),
                        trailing: const Icon(Icons.chevron_right_rounded),
                        onTap: _handleChangePattern,
                      ),
                    ],
                    const Divider(height: 1),
                    Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: Row(
                        children: [
                          Icon(Icons.lock_clock_outlined, size: 18, color: theme.colorScheme.primary),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Sensitive keys and pattern hashes are securely sealed in Android Keystore.',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                fontSize: 12,
                                color: theme.colorScheme.onSurface.withOpacity(0.6),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // 3. Backup & Restore Section
            _buildSectionHeader('Backup & Restore', Icons.backup_outlined),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'All-In-One Encrypted Local Backups',
                      style: theme.textTheme.titleMedium,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Export your SQLite database, entity cross-links, and app metadata into a single encrypted file. Backups can be restored anytime with strict integrity validation.',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _isExporting ? null : _handleExportBackup,
                            icon: _isExporting
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(strokeWidth: 2),
                                  )
                                : const Icon(Icons.upload_file_rounded),
                            label: Text(_isExporting ? 'Exporting...' : 'Export Backup'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: _isRestoring ? null : _handleRestoreBackup,
                            icon: _isRestoring
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(strokeWidth: 2),
                                  )
                                : const Icon(Icons.download_rounded),
                            label: Text(_isRestoring ? 'Restoring...' : 'Restore Backup'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // 4. App Information Section
            _buildSectionHeader('Application Information', Icons.info_outline_rounded),
            Card(
              child: Column(
                children: [
                  ListTile(
                    title: const Text('Application'),
                    trailing: Text(
                      AppConstants.appName,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    title: const Text('Version'),
                    trailing: Text(
                      AppConstants.appVersion,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ),
                  const Divider(height: 1),
                  const ListTile(
                    title: Text('Database Engine'),
                    trailing: Text('SQLite via Drift 2.31', style: TextStyle(fontWeight: FontWeight.w600)),
                  ),
                  const Divider(height: 1),
                  const ListTile(
                    title: Text('Architecture'),
                    trailing: Text('Stage 1 — Foundation & App Shell', style: TextStyle(fontWeight: FontWeight.w600)),
                  ),
                  const Divider(height: 1),
                  const ListTile(
                    title: Text('Connectivity Mode'),
                    trailing: Text('100% Fully Offline', style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.w600)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(left: 4.0, bottom: 8.0),
      child: Row(
        children: [
          Icon(icon, size: 18, color: theme.colorScheme.primary),
          const SizedBox(width: 8),
          Text(
            title,
            style: theme.textTheme.labelMedium?.copyWith(
              color: theme.colorScheme.primary,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}
