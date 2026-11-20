import React from 'react';
import { X, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Record } from '../../types/money';
import { useMoney } from '../../context/MoneyContext';
import { TransactionRow } from '../transactions/TransactionRow';
import { formatTransactionDateTime } from '../../utils/dateUtils';
import { formatInr } from '../../utils/currency';

interface DayDetailsSheetProps {
  date: Date | null;
  onClose: () => void;
}

export const DayDetailsSheet: React.FC<DayDetailsSheetProps> = ({ date, onClose }) => {
  const { records, openAddRecord, settings } = useMoney();

  if (!date) return null;

  const dateIsoPrefix = date.toISOString().split('T')[0];
  const dayRecords = records
    .filter((r) => r.dateTime.startsWith(dateIsoPrefix))
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const { dayHeaderStr } = formatTransactionDateTime(date.toISOString());

  // Calculate day total
  let inc = 0;
  let exp = 0;
  for (const r of dayRecords) {
    if (r.type === 'income') inc += r.amountPaise;
    else if (r.type === 'expense') exp += r.amountPaise;
    else if (r.type === 'transfer' && r.feePaise) exp += r.feePaise;
  }
  const net = inc - exp;

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150 select-none">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="w-full sm:max-w-md bg-[#061817]/95 border border-teal-500/25 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[85vh] z-10 animate-in slide-in-from-bottom-6 duration-200 backdrop-blur-2xl">
        {/* Handle bar on mobile */}
        <div className="w-12 h-1.5 bg-teal-500/25 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-teal-500/15 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#19E6C8]" />
            <h3 className="text-sm font-bold text-white font-display">{dayHeaderStr}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94B5B0] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Day mini summary */}
        <div className="px-5 py-2.5 bg-[#030707]/80 border-b border-teal-500/15 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-[#19E6C8] font-bold text-glow-teal">+{formatInr(inc, opts)}</span>
            <span className="text-[#FF6B6B] font-bold text-glow-coral">
              {exp > 0 ? `-${formatInr(exp, opts)}` : '₹0'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#5B7B76]">Net:</span>
            <span className={`font-bold ${net >= 0 ? 'text-[#19E6C8] text-glow-teal' : 'text-[#FF6B6B] text-glow-coral'}`}>
              {formatInr(net, opts)}
            </span>
          </div>
        </div>

        {/* Records list */}
        <div className="flex-1 overflow-y-auto min-h-[140px] max-h-[380px] divide-y divide-teal-500/10">
          {dayRecords.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#5B7B76]">
              No transactions logged for this day.
            </div>
          ) : (
            dayRecords.map((r) => (
              <TransactionRow
                key={r.id}
                record={r}
                isSelectMode={false}
                isSelected={false}
                onToggleSelect={() => {}}
                onLongPress={() => {}}
              />
            ))
          )}
        </div>

        {/* Bottom Add Action */}
        <div className="p-4 border-t border-teal-500/15 bg-[#061817] shrink-0">
          <button
            onClick={() => {
              onClose();
              openAddRecord({ date: date.toISOString() });
            }}
            className="w-full py-2.5 rounded-xl bg-[#19E6C8] hover:bg-[#2DD4BF] active:scale-98 text-[#030807] font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(25,230,200,0.4)] transition-all cursor-pointer font-mono"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Record for this Day</span>
          </button>
        </div>
      </div>
    </div>
  );
};
