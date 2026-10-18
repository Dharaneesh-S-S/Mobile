import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart' as drift;
import '../../../core/database/app_database.dart';
import '../../../core/providers/core_providers.dart';
import '../../../core/theme/app_colors.dart';
import '../providers/money_providers.dart';
import 'wallets_screen.dart';

class TransactionEditorScreen extends ConsumerStatefulWidget {
  final MoneyTransactionEntry? existingTx;
  const TransactionEditorScreen({super.key, this.existingTx});

  @override
  ConsumerState<TransactionEditorScreen> createState() => _TransactionEditorScreenState();
}

class _TransactionEditorScreenState extends ConsumerState<TransactionEditorScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _descController = TextEditingController();

  String _txType = 'expense'; // 'income', 'expense', 'transfer'
  DateTime _date = DateTime.now();
  TimeOfDay _time = TimeOfDay.now();
  
  String? _accountId;
  String? _toAccountId; // For transfers
  String? _categoryId;

  @override
  void initState() {
    super.initState();
    final tx = widget.existingTx;
    if (tx != null) {
      _txType = tx.type;
      _amountController.text = (tx.amountPaise / 100).toStringAsFixed(2);
      _descController.text = tx.note ?? '';
      _accountId = tx.accountId;
      _toAccountId = tx.toAccountId;
      _categoryId = tx.categoryId;
      final dt = DateTime.fromMillisecondsSinceEpoch(tx.transactionTimeUtc, isUtc: true).toLocal();
      _date = dt;
      _time = TimeOfDay.fromDateTime(dt);
    } else {
      // Pick first account by default if available
      WidgetsBinding.instance.addPostFrameCallback((_) async {
        final db = ref.read(databaseProvider);
        final accs = await db.moneyDao.getAllAccounts();
        if (accs.isNotEmpty && mounted) {
          setState(() {
            _accountId = accs.first.id;
          });
        }
      });
    }
  }

  @override
  void dispose() {
    _amountController.dispose();
    _descController.dispose();
    super.dispose();
  }

  Future<void> _saveTransaction() async {
    if (!_formKey.currentState!.validate()) return;
    if (_accountId == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please select an account')));
      return;
    }
    if (_txType == 'transfer' && _toAccountId == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please select a destination account')));
      return;
    }
    if (_txType == 'transfer' && _accountId == _toAccountId) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Source and destination accounts must be different')));
      return;
    }

    final amtDouble = double.tryParse(_amountController.text) ?? 0.0;
    if (amtDouble <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Invalid amount')));
      return;
    }
    final amountPaise = (amtDouble * 100).round();

    final dt = DateTime(_date.year, _date.month, _date.day, _time.hour, _time.minute);
    final utc = dt.toUtc().millisecondsSinceEpoch;

    final db = ref.read(databaseProvider);

    final entry = MoneyTransactionEntry(
      id: widget.existingTx?.id ?? const Uuid().v4(),
      accountId: _accountId!,
      toAccountId: _txType == 'transfer' ? _toAccountId : null,
      categoryId: _txType == 'transfer' ? null : _categoryId,
      amountPaise: amountPaise,
      type: _txType,
      transactionTimeUtc: utc,
      note: _descController.text.isEmpty ? null : _descController.text,
      linkedCalendarEventId: widget.existingTx?.linkedCalendarEventId,
      linkedTaskId: widget.existingTx?.linkedTaskId,
      createdAtUtc: widget.existingTx?.createdAtUtc ?? DateTime.now().toUtc().millisecondsSinceEpoch,
    );

    if (widget.existingTx != null) {
      await db.moneyDao.updateTransactionRecord(entry);
    } else {
      await db.moneyDao.recordTransaction(
        MoneyTransactionsCompanion.insert(
          id: entry.id,
          accountId: entry.accountId,
          toAccountId: entry.toAccountId == null ? const drift.Value.absent() : drift.Value(entry.toAccountId),
          categoryId: entry.categoryId == null ? const drift.Value.absent() : drift.Value(entry.categoryId),
          amountPaise: entry.amountPaise,
          type: drift.Value(entry.type),
          transactionTimeUtc: entry.transactionTimeUtc,
          note: entry.note == null ? const drift.Value.absent() : drift.Value(entry.note),
          createdAtUtc: entry.createdAtUtc,
        )
      );
    }

    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final accounts = ref.watch(accountsStreamProvider).valueOrNull ?? [];
    final categories = ref.watch(categoriesStreamProvider).valueOrNull ?? [];
    
    // Filter categories by type
    final filteredCategories = categories.where((c) => c.isExpense == (_txType == 'expense')).toList();

    final effectiveAccountId = accounts.any((a) => a.id == _accountId)
        ? _accountId
        : (accounts.isNotEmpty ? accounts.first.id : null);
    final effectiveToAccountId = accounts.any((a) => a.id == _toAccountId)
        ? _toAccountId
        : null;
    final effectiveCategoryId = filteredCategories.any((c) => c.id == _categoryId)
        ? _categoryId
        : (filteredCategories.isNotEmpty ? filteredCategories.first.id : null);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.close),
          tooltip: 'Close',
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(widget.existingTx == null ? 'New Transaction' : 'Edit Transaction'),
        actions: [
          if (widget.existingTx != null)
            IconButton(
              icon: const Icon(Icons.delete, color: AppColors.lightError),
              onPressed: () async {
                await ref.read(databaseProvider).moneyDao.deleteTransaction(widget.existingTx!.id);
                if (mounted) Navigator.pop(context);
              },
            ),
          TextButton(
            onPressed: () {
              _accountId ??= effectiveAccountId;
              _categoryId ??= effectiveCategoryId;
              _saveTransaction();
            },
            child: const Text('Save'),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(value: 'income', label: Text('Income')),
                ButtonSegment(value: 'expense', label: Text('Expense')),
                ButtonSegment(value: 'transfer', label: Text('Transfer')),
              ],
              selected: {_txType},
              onSelectionChanged: (set) {
                setState(() {
                  _txType = set.first;
                  _categoryId = null; // Reset category when switching type
                });
              },
            ),
            const SizedBox(height: 24),
            TextFormField(
              controller: _amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
              decoration: const InputDecoration(
                prefixText: '₹ ',
                labelText: 'Amount',
              ),
              validator: (v) => v!.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            if (accounts.isEmpty)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.lightError.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.lightError),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.warning_amber_rounded, color: AppColors.lightError),
                    const SizedBox(width: 8),
                    const Expanded(
                      child: Text('No wallets available. Create one to proceed.'),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const WalletsScreen()));
                      },
                      child: const Text('Add Wallet'),
                    ),
                  ],
                ),
              )
            else
              DropdownButtonFormField<String>(
                value: effectiveAccountId,
                decoration: InputDecoration(
                  labelText: _txType == 'transfer' ? 'From Wallet' : 'Wallet',
                  prefixIcon: const Icon(Icons.account_balance_wallet_outlined),
                ),
                items: accounts.map((a) => DropdownMenuItem(value: a.id, child: Text(a.name))).toList(),
                onChanged: (v) => setState(() => _accountId = v),
                validator: (v) => (v == null && effectiveAccountId == null) ? 'Required' : null,
              ),
            if (_txType == 'transfer') ...[
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: effectiveToAccountId,
                decoration: const InputDecoration(
                  labelText: 'To Wallet',
                  prefixIcon: Icon(Icons.swap_horiz_rounded),
                ),
                items: accounts.map((a) => DropdownMenuItem(value: a.id, child: Text(a.name))).toList(),
                onChanged: (v) => setState(() => _toAccountId = v),
                validator: (v) => v == null ? 'Required' : null,
              ),
            ] else ...[
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: effectiveCategoryId,
                decoration: const InputDecoration(
                  labelText: 'Category',
                  prefixIcon: Icon(Icons.category_outlined),
                ),
                items: filteredCategories.map((c) => DropdownMenuItem(value: c.id, child: Text(c.name))).toList(),
                onChanged: (v) => setState(() => _categoryId = v),
              ),
            ],
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text(DateFormat('MMM d, yyyy').format(_date)),
                    leading: const Icon(Icons.calendar_today),
                    onTap: () async {
                      final d = await showDatePicker(context: context, initialDate: _date, firstDate: DateTime(2000), lastDate: DateTime(2100));
                      if (d != null) setState(() => _date = d);
                    },
                  ),
                ),
                Expanded(
                  child: ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text(_time.format(context)),
                    leading: const Icon(Icons.access_time),
                    onTap: () async {
                      final t = await showTimePicker(context: context, initialTime: _time);
                      if (t != null) setState(() => _time = t);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _descController,
              decoration: const InputDecoration(labelText: 'Memo / Description'),
              maxLines: 2,
            ),
          ],
        ),
      ),
    );
  }
}
