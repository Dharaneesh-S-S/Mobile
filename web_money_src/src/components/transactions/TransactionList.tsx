import React, { useState, useMemo } from 'react';
import {
  Trash2,
  Copy,
  Layers,
  FolderSync,
  X,
  PlusCircle,
  CheckCheck,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { Record } from '../../types/money';
import { OverviewCard } from './OverviewCard';
import { QuickAddBar } from './QuickAddBar';
import { TransactionRow } from './TransactionRow';
import { formatTransactionDateTime } from '../../utils/dateUtils';
import { formatInr } from '../../utils/currency';

interface DayGroup {
  dayKey: string;
  dayNumber: string;
  weekdayStr: string;
  monthYearStr: string;
  records: Record[];
  dayNetPaise: number;
}

export const TransactionList: React.FC = () => {
  const {
    filteredRecords,
    openAddRecord,
    bulkDeleteRecords,
    bulkUpdateRecords,
    duplicateRecord,
    categories,
    wallets,
    settings,
  } = useMoney();

  // Multi-select state
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Category and Wallet change picker modal for bulk actions
  const [bulkCategoryPickerOpen, setBulkCategoryPickerOpen] = useState<boolean>(false);
  const [bulkWalletPickerOpen, setBulkWalletPickerOpen] = useState<boolean>(false);

  // Group records by day
  const dayGroups = useMemo(() => {
    const groupsMap = new Map<string, DayGroup>();

    for (const r of filteredRecords) {
      const { dayNumber, weekdayStr, monthYearStr } = formatTransactionDateTime(r.dateTime);
      const dayKey = r.dateTime.split('T')[0];

      if (!groupsMap.has(dayKey)) {
        groupsMap.set(dayKey, {
          dayKey,
          dayNumber,
          weekdayStr,
          monthYearStr,
          records: [],
          dayNetPaise: 0,
        });
      }

      const grp = groupsMap.get(dayKey)!;
      grp.records.push(r);

      // Add to day's net total (income - expense - fee)
      if (r.type === 'income') {
        grp.dayNetPaise += r.amountPaise;
      } else if (r.type === 'expense') {
        grp.dayNetPaise -= r.amountPaise;
      } else if (r.type === 'transfer' && r.feePaise) {
        grp.dayNetPaise -= r.feePaise;
      }
    }

    return Array.from(groupsMap.values());
  }, [filteredRecords]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size === 0) setIsSelectMode(false);
      return next;
    });
  };

  const handleLongPress = (id: string) => {
    setIsSelectMode(true);
    setSelectedIds(new Set([id]));
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredRecords.length) {
      setSelectedIds(new Set());
      setIsSelectMode(false);
    } else {
      setSelectedIds(new Set(filteredRecords.map((r) => r.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    await bulkDeleteRecords(Array.from(selectedIds));
    setSelectedIds(new Set());
    setIsSelectMode(false);
  };

  const handleBulkDuplicate = async () => {
    for (const id of Array.from(selectedIds)) {
      const rec = filteredRecords.find((r) => r.id === id);
      if (rec) await duplicateRecord(rec);
    }
    setSelectedIds(new Set());
    setIsSelectMode(false);
  };

  const handleBulkCategoryChange = async (catId: string) => {
    await bulkUpdateRecords(Array.from(selectedIds), { categoryId: catId });
    setBulkCategoryPickerOpen(false);
    setSelectedIds(new Set());
    setIsSelectMode(false);
  };

  const handleBulkWalletChange = async (walId: string) => {
    await bulkUpdateRecords(Array.from(selectedIds), { walletId: walId });
    setBulkWalletPickerOpen(false);
    setSelectedIds(new Set());
    setIsSelectMode(false);
  };

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#090d16] overflow-y-auto">
      {/* 1. Period Overview Card */}
      <OverviewCard />

      {/* 2. Quick Add Bar */}
      <QuickAddBar />

      {/* 3. Bulk Action Bar (when in Multi-select Mode) */}
      {isSelectMode && (
        <div className="sticky top-0 z-20 mx-4 mb-3 px-3 py-2.5 rounded-xl bg-slate-900 border border-blue-500/50 shadow-xl flex items-center justify-between gap-2 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSelectMode(false);
                setSelectedIds(new Set());
              }}
              className="p-1 text-slate-400 hover:text-white"
              aria-label="Cancel selection"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-200">
              {selectedIds.size} Selected
            </span>
            <button
              onClick={handleSelectAll}
              className="text-xs text-blue-400 font-medium hover:underline ml-1"
            >
              {selectedIds.size === filteredRecords.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setBulkCategoryPickerOpen(true)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              title="Change category"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Category</span>
            </button>
            <button
              onClick={() => setBulkWalletPickerOpen(true)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              title="Change wallet"
            >
              <FolderSync className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wallet</span>
            </button>
            <button
              onClick={handleBulkDuplicate}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
              title="Copy / Duplicate"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleBulkDelete}
              className="p-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 text-xs flex items-center gap-1"
              title="Delete selected"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Transactions List or Empty State */}
      {filteredRecords.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center select-none">
          <div className="w-20 h-20 rounded-3xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-center mb-4 text-blue-400 shadow-inner">
            <PlusCircle className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-bold text-slate-200">No records in this period</h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1 mb-6 leading-relaxed">
            Tap the button below or the "+" icon to log your income, expenses, or transfers.
          </p>
          <button
            onClick={() => openAddRecord()}
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold shadow-glow-blue transition-all"
          >
            Add Your First Record
          </button>
        </div>
      ) : (
        <div className="flex-1 pb-16">
          {dayGroups.map((grp) => {
            const isDayNetPos = grp.dayNetPaise >= 0;
            const dayNetColor = isDayNetPos ? 'text-blue-400' : 'text-red-400';
            const dayNetText = isDayNetPos
              ? `+${formatInr(grp.dayNetPaise, opts)}`
              : `-${formatInr(Math.abs(grp.dayNetPaise), opts)}`;

            return (
              <div key={grp.dayKey} className="mb-2">
                {/* Day Header */}
                <div className="px-4 py-2 bg-slate-900/60 border-y border-slate-800/50 flex items-center justify-between select-none">
                  {/* Big date number + weekday + month-year */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-100 font-display leading-none">
                      {grp.dayNumber}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <span className="font-semibold text-slate-300">{grp.weekdayStr}</span>
                      <span>{grp.monthYearStr}</span>
                    </div>
                  </div>

                  {/* Day's net total on the right */}
                  <span className={`text-xs sm:text-sm font-bold font-display ${dayNetColor}`}>
                    {dayNetText}
                  </span>
                </div>

                {/* Day's Records */}
                <div className="bg-[#090d16]">
                  {grp.records.map((r) => (
                    <TransactionRow
                      key={r.id}
                      record={r}
                      isSelectMode={isSelectMode}
                      isSelected={selectedIds.has(r.id)}
                      onToggleSelect={handleToggleSelect}
                      onLongPress={handleLongPress}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bulk Category Picker Modal */}
      {bulkCategoryPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white">Select New Category</h4>
              <button
                onClick={() => setBulkCategoryPickerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleBulkCategoryChange(c.id)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-3 text-xs text-slate-200"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Wallet Picker Modal */}
      {bulkWalletPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white">Select New Wallet</h4>
              <button
                onClick={() => setBulkWalletPickerOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {wallets.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleBulkWalletChange(w.id)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-3 text-xs text-slate-200"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: w.color }}
                  />
                  <span>{w.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
