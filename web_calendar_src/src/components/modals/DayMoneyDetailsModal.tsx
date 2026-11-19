import React from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import { formatMoneyFull } from '../../utils/moneyIntegration';

export const DayMoneyDetailsModal: React.FC = () => {
  const { selectedMoneyDate, closeMoneyDetails, moneyStats } = useCalendar();

  if (!selectedMoneyDate) return null;

  const summary = moneyStats[selectedMoneyDate];
  const transactions = summary?.transactions || [];

  // Parse local date for title
  const [year, month, day] = selectedMoneyDate.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const formattedDateStr = dateObj.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const incomePaise = summary?.incomePaise || 0;
  const expensePaise = summary?.expensePaise || 0;
  const netPaise = summary?.netPaise || 0;

  const handleOpenMoneyManager = () => {
    // Open Money Manager in same or new tab
    window.location.href = '/money/';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={closeMoneyDetails} />

      <div className="relative w-full max-w-md bg-[#040e0d] border border-teal-500/25 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[85vh] z-10 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#0e2624] flex items-center justify-between bg-[#030707]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-display shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              ₹
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                {formattedDateStr}
              </h3>
              <p className="text-[11px] text-[#94B5B0]">Financial Activity</p>
            </div>
          </div>
          <button
            onClick={closeMoneyDetails}
            className="p-1.5 rounded-xl text-[#94B5B0] hover:text-white hover:bg-teal-500/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Part Summary Strip */}
        <div className="grid grid-cols-3 gap-2 px-5 py-3.5 bg-[#051413]/80 border-b border-[#0e2624] text-center">
          <div className="p-2 rounded-xl bg-[#030807]/70 border border-[#0e2624]">
            <span className="text-[10px] text-emerald-400 font-medium block mb-0.5">Income</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 font-display truncate block">
              +{formatMoneyFull(incomePaise)}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-[#030807]/70 border border-[#0e2624]">
            <span className="text-[10px] text-red-400 font-medium block mb-0.5">Expense</span>
            <span className="text-xs sm:text-sm font-bold text-red-400 font-display truncate block">
              {expensePaise > 0 ? `-${formatMoneyFull(expensePaise)}` : '₹0'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-[#030807]/70 border border-[#0e2624]">
            <span className="text-[10px] text-slate-300 font-medium block mb-0.5">Total</span>
            <span
              className={`text-xs sm:text-sm font-bold font-display truncate block ${
                netPaise >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {formatMoneyFull(netPaise, true)}
            </span>
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-[160px] max-h-[380px]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#94B5B0] block mb-1">
            Transactions ({transactions.length})
          </span>

          {transactions.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#5B7B76] bg-[#020505]/40 rounded-2xl border border-[#0e2624]/60">
              No transactions recorded for this day.
            </div>
          ) : (
            transactions.map((tx) => {
              const isInc = tx.type === 'income';
              const isExp = tx.type === 'expense';
              const accentColor = tx.categoryColor || (isInc ? '#10B981' : isExp ? '#EF4444' : '#64748B');

              return (
                <div
                  key={tx.id}
                  className="p-3 rounded-2xl bg-[#030807]/80 border border-[#0e2624] hover:border-emerald-500/30 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/5"
                      style={{
                        backgroundColor: `${accentColor}20`,
                        color: accentColor,
                      }}
                    >
                      {isInc ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {tx.description || tx.categoryName || 'Transaction'}
                      </div>
                      <div className="text-[10px] text-[#94B5B0] flex items-center gap-1.5 mt-0.5">
                        {tx.walletName && <span>{tx.walletName}</span>}
                        {tx.memo && (
                          <>
                            <span>•</span>
                            <span className="truncate">{tx.memo}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold font-display ml-2 shrink-0 ${
                      isInc ? 'text-emerald-400' : isExp ? 'text-red-400' : 'text-slate-300'
                    }`}
                  >
                    {isInc
                      ? `+${formatMoneyFull(tx.amountPaise)}`
                      : isExp
                      ? `-${formatMoneyFull(tx.amountPaise)}`
                      : formatMoneyFull(tx.amountPaise)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Action */}
        <div className="p-4 border-t border-[#0e2624] bg-[#030707] flex items-center gap-2">
          <button
            onClick={handleOpenMoneyManager}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
          >
            <span>Open in Money Manager</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
