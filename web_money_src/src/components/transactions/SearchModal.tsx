import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Filter,
  CheckSquare,
  Square,
  ArrowUpDown,
  Tag,
  Check,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { TransactionType, Record } from '../../types/money';
import { TransactionRow } from './TransactionRow';
import { formatInr, parseInrToPaise } from '../../utils/currency';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    closeSearch,
    records,
    categories,
    wallets,
    settings,
  } = useMoney();

  // Filters
  const [query, setQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<TransactionType | 'all'>('all');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [selectedWalletIds, setSelectedWalletIds] = useState<Set<string>>(new Set());
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Selection inside search results
  const [selectedResultIds, setSelectedResultIds] = useState<Set<string>>(new Set());

  // Filter logic
  const matchingRecords = useMemo(() => {
    if (!isSearchOpen) return [];

    const q = query.toLowerCase().trim();
    const minPaise = minAmount ? parseInrToPaise(minAmount) : 0;
    const maxPaise = maxAmount ? parseInrToPaise(maxAmount) : Infinity;

    const startMs = startDate ? new Date(startDate).getTime() : 0;
    const endMs = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity;

    return records.filter((r) => {
      // Type filter
      if (selectedType !== 'all' && r.type !== selectedType) return false;

      // Category filter
      if (selectedCategoryIds.size > 0 && !selectedCategoryIds.has(r.categoryId)) return false;

      // Wallet filter
      if (selectedWalletIds.size > 0 && !selectedWalletIds.has(r.walletId)) return false;

      // Amount range
      if (r.amountPaise < minPaise || r.amountPaise > maxPaise) return false;

      // Date range
      const rTime = new Date(r.dateTime).getTime();
      if (rTime < startMs || rTime > endMs) return false;

      // Text query (description, memo, tags, category name, wallet name)
      if (q) {
        const cat = categories.find((c) => c.id === r.categoryId)?.name.toLowerCase() || '';
        const wal = wallets.find((w) => w.id === r.walletId)?.name.toLowerCase() || '';
        const desc = r.description.toLowerCase();
        const memo = (r.memo || '').toLowerCase();
        const tags = (r.tags || []).join(' ').toLowerCase();

        const matches =
          desc.includes(q) ||
          memo.includes(q) ||
          tags.includes(q) ||
          cat.includes(q) ||
          wal.includes(q);

        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [
    isSearchOpen,
    records,
    query,
    selectedType,
    selectedCategoryIds,
    selectedWalletIds,
    minAmount,
    maxAmount,
    startDate,
    endDate,
    categories,
    wallets,
  ]);

  // Sum of matching transactions
  const { matchIncome, matchExpense, matchSum } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const r of matchingRecords) {
      if (r.type === 'income') inc += r.amountPaise;
      else if (r.type === 'expense') exp += r.amountPaise;
      else if (r.type === 'transfer' && r.feePaise) exp += r.feePaise;
    }
    return {
      matchIncome: inc,
      matchExpense: exp,
      matchSum: inc - exp,
    };
  }, [matchingRecords]);

  // Sum of selected items (if any selected)
  const selectedSum = useMemo(() => {
    if (selectedResultIds.size === 0) return 0;
    let sum = 0;
    for (const id of selectedResultIds) {
      const r = records.find((rec) => rec.id === id);
      if (r) {
        if (r.type === 'income') sum += r.amountPaise;
        else if (r.type === 'expense') sum -= r.amountPaise;
        else if (r.type === 'transfer' && r.feePaise) sum -= r.feePaise;
      }
    }
    return sum;
  }, [selectedResultIds, records]);

  if (!isSearchOpen) return null;

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  const toggleCategoryChip = (catId: string) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const toggleWalletChip = (walId: string) => {
    setSelectedWalletIds((prev) => {
      const next = new Set(prev);
      if (next.has(walId)) next.delete(walId);
      else next.add(walId);
      return next;
    });
  };

  const toggleSelectResult = (id: string) => {
    setSelectedResultIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedResultIds.size === matchingRecords.length) {
      setSelectedResultIds(new Set());
    } else {
      setSelectedResultIds(new Set(matchingRecords.map((r) => r.id)));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030707] flex flex-col text-[#F4FFFD] animate-in fade-in duration-150 ambient-bg-grid select-none">
      {/* Top Search Header */}
      <div className="px-4 pt-3.5 pb-3.5 border-b border-teal-500/20 flex items-center gap-3 shrink-0 bg-[#061817]/90 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#19E6C8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search description, memo, category, tags..."
            autoFocus
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#030707] border border-teal-500/25 text-sm text-white placeholder-[#5B7B76] focus:outline-none focus:border-[#19E6C8] focus:shadow-[0_0_15px_rgba(25,230,200,0.25)] transition-all font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B7B76] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={closeSearch}
          className="text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[#19E6C8] hover:bg-teal-500/20 hover:text-white transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="px-4 py-2.5 border-b border-teal-500/15 bg-[#030707] overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
        {/* Type Filter Chips */}
        {(['all', 'income', 'expense', 'transfer'] as const).map((type) => {
          const isSelected = selectedType === type;
          let chipStyle = 'bg-[#061817] border border-teal-500/15 text-[#94B5B0] hover:text-white hover:border-teal-500/30';
          if (isSelected) {
            if (type === 'income') {
              chipStyle = 'bg-teal-500/20 text-[#19E6C8] border border-teal-500/50 shadow-[0_0_12px_rgba(25,230,200,0.3)] font-bold';
            } else if (type === 'expense') {
              chipStyle = 'bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/50 shadow-[0_0_12px_rgba(255,107,107,0.3)] font-bold';
            } else {
              chipStyle = 'bg-teal-500/20 text-white border border-teal-500/40 font-bold';
            }
          }

          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`text-xs px-3 py-1 rounded-full font-medium capitalize shrink-0 transition-all cursor-pointer ${chipStyle}`}
            >
              {type}
            </button>
          );
        })}

        <div className="h-4 w-px bg-teal-500/20 shrink-0" />

        {/* Categories Chips */}
        {categories.slice(0, 8).map((c) => {
          const isSelected = selectedCategoryIds.has(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggleCategoryChip(c.id)}
              className={`text-xs px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-teal-500/20 text-white border border-[#19E6C8] shadow-[0_0_8px_rgba(25,230,200,0.2)]'
                  : 'bg-[#061817] border border-teal-500/15 text-[#94B5B0] hover:text-white hover:border-teal-500/30'
              }`}
            >
              <div
                className="w-2 h-2 rounded-full shadow-[0_0_6px]"
                style={{ backgroundColor: c.color, boxShadow: `0 0 6px ${c.color}80` }}
              />
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Live Matching Summary Strip */}
      <div className="px-4 py-2 bg-[#061817]/80 border-b border-teal-500/15 flex items-center justify-between text-xs text-[#94B5B0] shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-1.5 text-[#19E6C8] font-medium hover:underline cursor-pointer"
          >
            {selectedResultIds.size > 0 && selectedResultIds.size === matchingRecords.length ? (
              <CheckSquare className="w-4 h-4 text-[#19E6C8]" />
            ) : (
              <Square className="w-4 h-4 text-[#5B7B76]" />
            )}
            <span>
              {matchingRecords.length} {matchingRecords.length === 1 ? 'record' : 'records'}
            </span>
          </button>

          {selectedResultIds.size > 0 && (
            <span className="text-[#94B5B0] font-mono">
              ({selectedResultIds.size} selected)
            </span>
          )}
        </div>

        {/* Live Sum Display */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[#5B7B76]">Sum:</span>
          <span
            className={`font-bold ${
              selectedResultIds.size > 0
                ? selectedSum >= 0
                  ? 'text-[#19E6C8] text-glow-teal'
                  : 'text-[#FF6B6B] text-glow-coral'
                : matchSum >= 0
                ? 'text-[#19E6C8] text-glow-teal'
                : 'text-[#FF6B6B] text-glow-coral'
            }`}
          >
            {selectedResultIds.size > 0
              ? formatInr(selectedSum, opts)
              : formatInr(matchSum, opts)}
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto divide-y divide-teal-500/10">
        {matchingRecords.length === 0 ? (
          <div className="py-20 text-center text-[#5B7B76] text-xs">
            No matching transactions found. Try adjusting filters or search terms.
          </div>
        ) : (
          matchingRecords.map((r) => (
            <TransactionRow
              key={r.id}
              record={r}
              isSelectMode={selectedResultIds.size > 0}
              isSelected={selectedResultIds.has(r.id)}
              onToggleSelect={toggleSelectResult}
              onLongPress={toggleSelectResult}
            />
          ))
        )}
      </div>
    </div>
  );
};
