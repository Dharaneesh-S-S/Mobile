import React from 'react';
import { X, Printer, Download, FileText, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { formatInr } from '../../utils/currency';
import { DynamicIcon } from '../common/IconHelper';

export const MonthlyReportModal: React.FC = () => {
  const {
    isMonthlyReportOpen,
    closeMonthlyReport,
    currentAccount,
    dateRange,
    periodIncome,
    periodExpense,
    periodNet,
    openingBalance,
    endingBalance,
    filteredRecords,
    categories,
    wallets,
    settings,
  } = useMoney();

  if (!isMonthlyReportOpen) return null;

  const opts = {
    showDecimals: true,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  // Group top expense categories
  const categorySpending = categories
    .filter((c) => c.type === 'expense')
    .map((c) => {
      const total = filteredRecords
        .filter((r) => r.type === 'expense' && r.categoryId === c.id)
        .reduce((sum, r) => sum + r.amountPaise, 0);
      return {
        category: c,
        amountPaise: total,
        percentage: periodExpense > 0 ? (total / periodExpense) * 100 : 0,
      };
    })
    .filter((item) => item.amountPaise > 0)
    .sort((a, b) => b.amountPaise - a.amountPaise);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={closeMonthlyReport} />
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 print:fixed print:inset-0 print:bg-white print:text-black print:p-8 print:max-h-none print:border-none print:shadow-none">
        {/* Header - Not printed */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white font-display">Monthly Financial Statement</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-glow-blue transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button onClick={closeMonthlyReport} className="p-1.5 rounded-xl text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Statement Document */}
        <div className="flex-1 overflow-y-auto space-y-6 py-4 print:overflow-visible">
          {/* Statement Header */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-black text-white font-display tracking-tight print:text-slate-900">
                RupeeFlow Statement
              </h1>
              <p className="text-xs text-slate-400 mt-1 print:text-slate-600">
                Account: <strong className="text-slate-200 print:text-slate-900">{currentAccount?.name}</strong> • Currency: INR (₹)
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-blue-400 block uppercase print:text-blue-700">
                Statement Period
              </span>
              <span className="text-sm font-semibold text-slate-200 font-display print:text-slate-800">
                {dateRange.label}
              </span>
            </div>
          </div>

          {/* Cashflow Summary Box */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <div>
              <span className="text-[11px] text-slate-400 block print:text-slate-600">Total Income</span>
              <span className="text-base font-bold text-blue-400 font-display print:text-blue-700">
                {formatInr(periodIncome, opts)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block print:text-slate-600">Total Expense</span>
              <span className="text-base font-bold text-red-400 font-display print:text-red-700">
                {periodExpense > 0 ? `-${formatInr(periodExpense, opts)}` : '₹0.00'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block print:text-slate-600">Net Surplus / Saved</span>
              <span className={`text-base font-bold font-display ${periodNet >= 0 ? 'text-emerald-400 print:text-emerald-700' : 'text-red-400 print:text-red-700'}`}>
                {formatInr(periodNet, opts)}
              </span>
            </div>
          </div>

          {/* Balance Reconcile Table */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider print:text-slate-800">
              Account Ledger Reconciliation
            </h4>
            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden print:border-slate-300 print:divide-slate-200">
              <div className="flex justify-between p-2.5 bg-slate-950/40 print:bg-slate-100">
                <span className="text-slate-400 print:text-slate-600">Opening Balance (Start of Period)</span>
                <span className="font-bold text-slate-100 font-display print:text-slate-900">{formatInr(openingBalance, opts)}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950/40 print:bg-slate-100">
                <span className="text-slate-400 print:text-slate-600">Net Period Transactions</span>
                <span className="font-bold text-slate-100 font-display print:text-slate-900">{formatInr(periodNet, opts)}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-900 font-bold print:bg-slate-200">
                <span className="text-slate-200 print:text-slate-900">Closing Balance (End of Period)</span>
                <span className="text-blue-400 font-display print:text-blue-700">{formatInr(endingBalance, opts)}</span>
              </div>
            </div>
          </div>

          {/* Top Category Spending Ranking */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider print:text-slate-800">
              Expense Category Breakdown
            </h4>
            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden print:border-slate-300 print:divide-slate-200">
              {categorySpending.length === 0 ? (
                <div className="p-4 text-center text-slate-500">No expenses recorded for this period.</div>
              ) : (
                categorySpending.map((item) => (
                  <div key={item.category.id} className="flex justify-between items-center p-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.category.color }} />
                      <span className="font-semibold text-slate-200 print:text-slate-900">{item.category.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 font-mono print:text-slate-600">{item.percentage.toFixed(1)}%</span>
                      <span className="font-bold text-slate-100 font-display print:text-slate-900">{formatInr(item.amountPaise, opts)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between print:border-slate-300 print:text-slate-500">
            <span>Generated securely by RupeeFlow on {new Date().toLocaleDateString()}</span>
            <span>No ads • On-device IndexedDB storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
