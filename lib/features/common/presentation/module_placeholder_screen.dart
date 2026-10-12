import 'package:flutter/material.dart';

/// Standard, premium-looking placeholder screen for upcoming modules.
/// Strictly conveys roadmap status without pretending functionality.
class ModulePlaceholderScreen extends StatelessWidget {
  final String title;
  final String stageTag;
  final IconData icon;
  final Color accentColor;
  final String description;
  final List<String> plannedFeatures;
  final List<String> preparedTables;

  const ModulePlaceholderScreen({
    super.key,
    required this.title,
    required this.stageTag,
    required this.icon,
    required this.accentColor,
    required this.description,
    required this.plannedFeatures,
    required this.preparedTables,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Hero Banner Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24.0),
                decoration: BoxDecoration(
                  color: theme.cardTheme.color,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: accentColor.withOpacity(0.3),
                    width: 1.2,
                  ),
                  gradient: LinearGradient(
                    colors: [
                      accentColor.withOpacity(0.08),
                      theme.cardTheme.color ?? theme.colorScheme.surface,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: accentColor.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Icon(icon, size: 28, color: accentColor),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: accentColor.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  stageTag.toUpperCase(),
                                  style: theme.textTheme.labelSmall?.copyWith(
                                    color: accentColor,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                title,
                                style: theme.textTheme.titleLarge,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      description,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Foundation Status Card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(18.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.storage_rounded, size: 20, color: Color(0xFF10B981)),
                          const SizedBox(width: 8),
                          Text(
                            'Stage 1 Storage Foundation Ready',
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'The local SQLite Drift database schema, migrations, DAOs, and cross-entity relational constraints for this module are active and verified in private app storage.',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: theme.colorScheme.onSurface.withOpacity(0.7),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: preparedTables.map((t) {
                          return Chip(
                            label: Text(t, style: const TextStyle(fontSize: 11)),
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            visualDensity: VisualDensity.compact,
                            backgroundColor: theme.colorScheme.surfaceContainerHighest,
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Planned Features List
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(18.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Planned Module Features',
                        style: theme.textTheme.titleMedium,
                      ),
                      const SizedBox(height: 12),
                      ...plannedFeatures.map((feat) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8.0),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Icon(
                                Icons.check_circle_outline_rounded,
                                size: 16,
                                color: accentColor,
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  feat,
                                  style: theme.textTheme.bodyMedium,
                                ),
                              ),
                            ],
                          ),
                        );
                      }),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),
              Center(
                child: Text(
                  'Module interface will be fully built in subsequent development stage.',
                  style: theme.textTheme.labelMedium?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.4),
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
