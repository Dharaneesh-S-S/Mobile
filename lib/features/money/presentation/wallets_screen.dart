import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart' as drift;
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/money_providers.dart';

class WalletsScreen extends ConsumerWidget {
  const WalletsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final accountsAsync = ref.watch(accountsStreamProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Wallets & Accounts'),
      ),
      body: accountsAsync.when(
        data: (accounts) {
          if (accounts.isEmpty) {
            return const Center(child: Text('No wallets found. Create one!'));
          }
          return ListView.builder(
            itemCount: accounts.length,
            itemBuilder: (context, index) {
              final acc = accounts[index];
              return ListTile(
                leading: const CircleAvatar(child: Icon(Icons.account_balance_wallet)),
                title: Text(acc.name),
                subtitle: Text(acc.accountType),
                trailing: Text('₹${(acc.balancePaise / 100).toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.accentEmerald)),
                onTap: () {
                  _showWalletDialog(context, ref, acc);
                },
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.accentEmerald,
        onPressed: () => _showWalletDialog(context, ref, null),
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showWalletDialog(BuildContext context, WidgetRef ref, MoneyAccountEntry? existing) {
    final nameController = TextEditingController(text: existing?.name ?? '');
    String selectedType = existing?.accountType ?? 'bank';
    final balanceController = TextEditingController(text: existing != null ? (existing.balancePaise / 100).toStringAsFixed(2) : '0');

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text(existing == null ? 'New Wallet' : 'Edit Wallet'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: const InputDecoration(labelText: 'Wallet Name (e.g. HDFC Bank, Cash)'),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: selectedType,
                decoration: const InputDecoration(labelText: 'Wallet Type'),
                items: const [
                  DropdownMenuItem(value: 'bank', child: Text('Bank Account')),
                  DropdownMenuItem(value: 'cash', child: Text('Cash')),
                  DropdownMenuItem(value: 'wallet', child: Text('Digital Wallet / UPI')),
                  DropdownMenuItem(value: 'credit_card', child: Text('Credit Card')),
                ],
                onChanged: (v) {
                  if (v != null) setDialogState(() => selectedType = v);
                },
              ),
              if (existing == null) ...[
                const SizedBox(height: 12),
                TextField(
                  controller: balanceController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(labelText: 'Initial Balance (₹)'),
                ),
              ],
            ],
          ),
          actions: [
            if (existing != null)
              TextButton(
                onPressed: () async {
                  await ref.read(databaseProvider).moneyDao.deleteAccount(existing.id);
                  if (context.mounted) Navigator.pop(context);
                },
                child: const Text('Delete', style: TextStyle(color: AppColors.lightError)),
              ),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () async {
                final name = nameController.text.trim();
                if (name.isEmpty) return;

                if (existing != null) {
                  await ref.read(databaseProvider).moneyDao.updateAccount(
                    existing.copyWith(name: name, accountType: selectedType),
                  );
                } else {
                  final balanceDouble = double.tryParse(balanceController.text) ?? 0.0;
                  final balancePaise = (balanceDouble * 100).round();
                  
                  await ref.read(databaseProvider).moneyDao.insertAccount(
                    MoneyAccountsCompanion.insert(
                      id: const Uuid().v4(),
                      name: name,
                      accountType: selectedType,
                      balancePaise: drift.Value(balancePaise),
                      createdAtUtc: DateTime.now().toUtc().millisecondsSinceEpoch,
                    ),
                  );
                }
                if (context.mounted) Navigator.pop(context);
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
  }
}
