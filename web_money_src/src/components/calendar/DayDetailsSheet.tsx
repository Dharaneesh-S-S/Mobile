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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="w-full sm:max-w-md bg-[#0f172a] border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] z-10 animate-in slide-in-from-bottom-6 duration-200">
        {/* Handle bar on mobile */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white font-display">{dayHeaderStr}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Day mini summary */}
        <div className="px-5 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-blue-400 font-semibold">+{formatInr(inc, opts)}</span>
            <span className="text-red-400 font-semibold">
              {exp > 0 ? `-${formatInr(exp, opts)}` : '₹0'}
            </span>
          </div>
          <div className="flex items-center gap-1 font-display">
            <span className="text-slate-400">Net:</span>
            <span className={`font-bold ${net >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              {formatInr(net, opts)}
            </span>
          </div>
        </div>

        {/* Records list */}
        <div className="flex-1 overflow-y-auto min-h-[140px] max-h-[380px]">
          {dayRecords.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
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
        <div className="p-4 border-t border-slate-800 bg-[#0f172a] shrink-0">
          <button
            onClick={() => {
              onClose();
              openAddRecord({ date: date.toISOString() });
            }}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-glow-blue transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record for this Day</span>
          </button>
        </div>
      </div>
    </div>
  );
};
