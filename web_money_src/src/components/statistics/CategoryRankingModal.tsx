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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full sm:max-w-md bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-1 -ml-1 text-slate-400 hover:text-white"
                aria-label="Back to ranking list"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="text-base font-bold text-white font-display">
                {selectedCategory ? selectedCategory.category.name : title}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedCategory
                  ? `${selectedCategory.records.length} transactions (${selectedCategory.percentage.toFixed(1)}%)`
                  : `Total: ${formatInr(totalPaise, opts)}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-3">
          {selectedCategory ? (
            /* Filtered Records for Selected Category */
            <div className="space-y-1">
              <div className="p-3 bg-slate-800/40 rounded-xl mb-3 border border-slate-700/40 flex items-center justify-between text-xs">
                <span className="text-slate-400">Category Spent:</span>
                <span className="font-bold text-slate-100 font-display">
                  {formatInr(selectedCategory.amountPaise, opts)}
                </span>
              </div>
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
          ) : (
            /* Category Ranking List with Progress Bars */
            items.map((item, idx) => (
              <div
                key={item.category.id}
                onClick={() => setSelectedCategory(item)}
                className="p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 active:bg-slate-800 border border-slate-700/40 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-slate-400 w-4">
                      #{idx + 1}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${item.category.color}22`,
                        border: `1.5px solid ${item.category.color}`,
                      }}
                    >
                      <DynamicIcon
                        name={item.category.icon}
                        className="w-4 h-4"
                        color={item.category.color}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-100 truncate">
                      {item.category.name}
                    </span>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-sm font-bold text-slate-100 font-display">
                      {formatInr(item.amountPaise, opts)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-700/60 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.category.color,
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
