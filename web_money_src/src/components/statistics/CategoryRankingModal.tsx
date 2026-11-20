import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Category, Record } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { DynamicIcon } from '../common/IconHelper';
import { TransactionRow } from '../transactions/TransactionRow';
import { formatInr } from '../../utils/currency';

interface CategoryRankingItem {
  category: Category;
  amountPaise: number;
  percentage: number;
  records: Record[];
}

interface CategoryRankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: CategoryRankingItem[];
  totalPaise: number;
}

export const CategoryRankingModal: React.FC<CategoryRankingModalProps> = ({
  isOpen,
  onClose,
  title,
  items,
  totalPaise,
}) => {
  const { settings } = useMoney();
  const [selectedCategory, setSelectedCategory] = useState<CategoryRankingItem | null>(null);

  if (!isOpen) return null;

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150 select-none">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full sm:max-w-md bg-[#061817]/95 border border-teal-500/25 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5 z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-500/15 shrink-0">
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-1 -ml-1 text-[#94B5B0] hover:text-white cursor-pointer"
                aria-label="Back to ranking list"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="text-base font-bold text-white font-display">
                {selectedCategory ? selectedCategory.category.name : title}
              </h3>
              <p className="text-xs text-[#94B5B0] font-mono">
                {selectedCategory
                  ? `${selectedCategory.records.length} transactions (${selectedCategory.percentage.toFixed(1)}%)`
                  : `Total: ${formatInr(totalPaise, opts)}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#94B5B0] hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-3">
          {selectedCategory ? (
            /* Filtered Records for Selected Category */
            <div className="space-y-1">
              <div className="p-3 bg-[#030707] rounded-xl mb-3 border border-teal-500/15 flex items-center justify-between text-xs font-mono">
                <span className="text-[#94B5B0]">Category Spent:</span>
                <span className="font-bold text-white">
                  {formatInr(selectedCategory.amountPaise, opts)}
                </span>
              </div>
              <div className="divide-y divide-teal-500/10">
                {selectedCategory.records.map((r) => (
                  <TransactionRow
                    key={r.id}
                    record={r}
                    isSelectMode={false}
                    isSelected={false}
                    onToggleSelect={() => {}}
                    onLongPress={() => {}}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Category Ranking List with Progress Bars */
            items.map((item, idx) => (
              <div
                key={item.category.id}
                onClick={() => setSelectedCategory(item)}
                className="p-3 rounded-2xl glass-card bg-[#061817]/60 hover:bg-teal-950/30 border border-teal-500/15 hover:border-teal-400/40 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-[#5B7B76] w-4">
                      #{idx + 1}
                    </span>
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${item.category.color}22`,
                        borderColor: `${item.category.color}40`,
                        boxShadow: `0 0 8px ${item.category.color}30`,
                      }}
                    >
                      <DynamicIcon
                        name={item.category.icon}
                        className="w-4 h-4"
                        color={item.category.color}
                      />
                    </div>
                    <span className="text-sm font-semibold text-white truncate">
                      {item.category.name}
                    </span>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-sm font-bold text-white font-mono">
                      {formatInr(item.amountPaise, opts)}
                    </span>
                    <span className="text-[11px] text-[#94B5B0] font-mono">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-[#030707] border border-teal-500/20 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300 shadow-[0_0_6px]"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.category.color,
                      boxShadow: `0 0 6px ${item.category.color}`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
