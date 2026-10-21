import React, { useState, useMemo } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  ChevronRight,
  Wallet as WalletIcon,
  Flame,
  ArrowRight,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { Category, Record } from '../../types/money';
import { formatInr, formatCompactInr } from '../../utils/currency';
import { DetailedBreakdownModal } from './DetailedBreakdownModal';
import { CategoryRankingModal } from './CategoryRankingModal';

export const StatisticView: React.FC = () => {
  const {
    filteredRecords,
    periodIncome,
    periodExpense,
    periodNet,
    openingBalance,
    endingBalance,
    categories,
    wallets,
    chartStyle,
    toggleChartStyle,
    settings,
  } = useMoney();

  const [structureTab, setStructureTab] = useState<'expense' | 'income'>('expense');
  const [trendMode, setTrendMode] = useState<'bars' | 'net'>('bars');
  const [showDetailedModal, setShowDetailedModal] = useState<boolean>(false);
  const [rankingModalType, setRankingModalType] = useState<'expense' | 'income' | null>(null);

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  // 1. Structure breakdown for Expenses and Incomes
  const { expenseStructure, incomeStructure } = useMemo(() => {
    const expMap = new Map<string, { category: Category; amountPaise: number; records: Record[] }>();
    const incMap = new Map<string, { category: Category; amountPaise: number; records: Record[] }>();

    for (const r of filteredRecords) {
      if (r.type === 'expense') {
        const cat = categories.find((c) => c.id === r.categoryId) || {
          id: r.categoryId,
          name: 'Others',
          type: 'expense',
          icon: 'MoreHorizontal',
          color: '#64748b',
        };
        if (!expMap.has(cat.id)) {
          expMap.set(cat.id, { category: cat, amountPaise: 0, records: [] });
        }
        const item = expMap.get(cat.id)!;
        item.amountPaise += r.amountPaise;
        item.records.push(r);
      } else if (r.type === 'income') {
        const cat = categories.find((c) => c.id === r.categoryId) || {
          id: r.categoryId,
          name: 'Others',
          type: 'income',
          icon: 'MoreHorizontal',
          color: '#64748b',
        };
        if (!incMap.has(cat.id)) {
          incMap.set(cat.id, { category: cat, amountPaise: 0, records: [] });
        }
        const item = incMap.get(cat.id)!;
        item.amountPaise += r.amountPaise;
        item.records.push(r);
      }
    }

    const expList = Array.from(expMap.values())
      .map((item) => ({
        ...item,
        percentage: periodExpense > 0 ? (item.amountPaise / periodExpense) * 100 : 0,
      }))
      .sort((a, b) => b.amountPaise - a.amountPaise);

    const incList = Array.from(incMap.values())
      .map((item) => ({
        ...item,
        percentage: periodIncome > 0 ? (item.amountPaise / periodIncome) * 100 : 0,
      }))
      .sort((a, b) => b.amountPaise - a.amountPaise);

    return { expenseStructure: expList, incomeStructure: incList };
  }, [filteredRecords, categories, periodExpense, periodIncome]);

  const activeStructure = structureTab === 'expense' ? expenseStructure : incomeStructure;
  const activeTotalPaise = structureTab === 'expense' ? periodExpense : periodIncome;

  // Chart data for Donut / Bars
  const pieChartData = useMemo(() => {
    return activeStructure.map((item) => ({
      name: item.category.name,
      value: item.amountPaise / 100, // in Rupees for chart
      color: item.category.color,
      percentage: item.percentage.toFixed(1),
    }));
  }, [activeStructure]);

  // 2. Trend Data (Daily breakdown in selected period)
  const trendData = useMemo(() => {
    const dayMap = new Map<string, { dayLabel: string; income: number; expense: number; net: number }>();

    for (const r of filteredRecords) {
      const day = r.dateTime.split('T')[0];
      const d = new Date(r.dateTime);
      const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;

      if (!dayMap.has(day)) {
        dayMap.set(day, { dayLabel, income: 0, expense: 0, net: 0 });
      }

      const item = dayMap.get(day)!;
      if (r.type === 'income') {
        item.income += r.amountPaise / 100;
        item.net += r.amountPaise / 100;
      } else if (r.type === 'expense') {
        item.expense += r.amountPaise / 100;
        item.net -= r.amountPaise / 100;
      }
    }

    return Array.from(dayMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map((entry) => entry[1]);
  }, [filteredRecords]);

  // 3. Wallet Usage Data
  const walletUsageData = useMemo(() => {
    const walMap = new Map<string, { name: string; spent: number; color: string }>();

    for (const w of wallets) {
      walMap.set(w.id, { name: w.name, spent: 0, color: w.color });
    }

    for (const r of filteredRecords) {
      if (r.type === 'expense' && walMap.has(r.walletId)) {
        const item = walMap.get(r.walletId)!;
        item.spent += r.amountPaise / 100;
      }
    }

    return Array.from(walMap.values()).filter((w) => w.spent > 0);
  }, [wallets, filteredRecords]);

  // 4. Top 5 Expenses
  const topExpenses = useMemo(() => {
    return filteredRecords
      .filter((r) => r.type === 'expense')
      .sort((a, b) => b.amountPaise - a.amountPaise)
      .slice(0, 5);
  }, [filteredRecords]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#090d16] p-4 space-y-4 overflow-y-auto select-none pb-20">
      {/* 1. BALANCE CARD (Opening vs Ending) */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#111827] border border-slate-800 shadow-md">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Period Balance
        </h4>
        <div className="grid grid-cols-2 gap-4 divide-x divide-slate-800">
          <div>
            <span className="text-[11px] text-slate-400">Opening Balance</span>
            <div className="text-base sm:text-lg font-bold text-slate-100 font-display mt-0.5">
              {formatInr(openingBalance, opts)}
            </div>
          </div>
          <div className="pl-4">
            <span className="text-[11px] text-slate-400">Ending Balance</span>
            <div className="text-base sm:text-lg font-bold text-blue-400 font-display mt-0.5">
              {formatInr(endingBalance, opts)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. OVERVIEW CARD + "Show More" */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Cash Flow Overview
          </h4>
          <button
            onClick={() => setShowDetailedModal(true)}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            <span>Show more</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="text-[11px] text-blue-400 font-medium block mb-1">Income</span>
            <span className="text-xs sm:text-sm font-bold text-blue-400 font-display truncate block">
              {formatInr(periodIncome, opts)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="text-[11px] text-red-400 font-medium block mb-1">Expense</span>
            <span className="text-xs sm:text-sm font-bold text-red-400 font-display truncate block">
              {periodExpense > 0 ? `-${formatInr(periodExpense, opts)}` : '₹0'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="text-[11px] text-slate-300 font-medium block mb-1">Total</span>
            <span
              className={`text-xs sm:text-sm font-bold font-display truncate block ${
                periodNet >= 0
                  ? settings.showGreenNet
                    ? 'text-emerald-400'
                    : 'text-white'
                  : 'text-red-400'
              }`}
            >
              {formatInr(periodNet, opts)}
            </span>
          </div>
        </div>
      </div>

      {/* 3 & 4. STRUCTURE CARD (Expense / Income toggle + Donut / Bar toggle) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          {/* Switch tabs: Expense / Income */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setStructureTab('expense')}
              className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${
                structureTab === 'expense'
                  ? 'bg-red-600 text-white shadow-glow-red'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expense
            </button>
            <button
              onClick={() => setStructureTab('income')}
              className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${
                structureTab === 'income'
                  ? 'bg-blue-600 text-white shadow-glow-blue'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Income
            </button>
          </div>

          <button
            onClick={() => setRankingModalType(structureTab)}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            <span>Show ranking</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeStructure.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No {structureTab} recorded for this period.
          </div>
        ) : (
          <div>
            {/* Chart Area */}
            {chartStyle === 'donut' ? (
              <div className="relative w-full h-56 flex items-center justify-center my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#f8fafc',
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>

                {/* Center Label in Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {structureTab === 'expense' ? 'Expense' : 'Income'}
                  </span>
                  <span
                    className={`text-sm font-bold font-display ${
                      structureTab === 'expense' ? 'text-red-400' : 'text-blue-400'
                    }`}
                  >
                    {structureTab === 'expense'
                      ? `-${formatInr(activeTotalPaise, opts)}`
                      : formatInr(activeTotalPaise, opts)}
                  </span>
                </div>
              </div>
            ) : (
              /* Horizontal Bar Chart representation */
              <div className="w-full h-56 my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pieChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={70} stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {pieChartData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Accessible Legend with top categories and percentages */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {activeStructure.slice(0, 6).map((item) => (
                <div key={item.category.id} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/40">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.category.color }}
                    />
                    <span className="text-slate-300 font-medium truncate">{item.category.name}</span>
                  </div>
                  <span className="text-slate-400 font-semibold font-mono ml-2 shrink-0">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. TREND CHART */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Cash Flow Trend
          </h4>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => setTrendMode('bars')}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                trendMode === 'bars' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              In vs Out
            </button>
            <button
              onClick={() => setTrendMode('net')}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                trendMode === 'net' ? 'bg-emerald-600 text-white' : 'text-slate-400'
              }`}
            >
              Net
            </button>
          </div>
        </div>

        {trendData.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">No activity to plot.</div>
        ) : (
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              {trendMode === 'bars' ? (
                <BarChart data={trendData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="dayLabel" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`]}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="income" name="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={trendData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="dayLabel" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Net']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      fontSize: '11px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#10b981' }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 6. WALLET USAGE */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Spending Per Wallet
        </h4>
        {walletUsageData.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">No wallet spending recorded.</div>
        ) : (
          <div className="space-y-3">
            {walletUsageData.map((wal) => {
              const totalSpent = walletUsageData.reduce((acc, w) => acc + w.spent, 0);
              const pct = totalSpent > 0 ? (wal.spent / totalSpent) * 100 : 0;
              return (
                <div key={wal.name}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-200">{wal.name}</span>
                    <span className="font-bold text-slate-100 font-display">
                      ₹{Math.round(wal.spent).toLocaleString('en-IN')} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: wal.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. TOP 5 EXPENSES */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Top Expenses</span>
        </div>

        {topExpenses.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">No expenses in this period.</div>
        ) : (
          <div className="space-y-2">
            {topExpenses.map((r, i) => {
              const cat = categories.find((c) => c.id === r.categoryId);
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/30 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono font-bold text-slate-400 w-3.5">#{i + 1}</span>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat?.color || '#ef4444' }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-200 truncate">{r.description}</span>
                      <span className="text-[10px] text-slate-400">{cat?.name}</span>
                    </div>
                  </div>
                  <span className="font-bold text-red-400 font-display ml-2 shrink-0">
                    -{formatInr(r.amountPaise, opts)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Breakdown Modal */}
      <DetailedBreakdownModal
        isOpen={showDetailedModal}
        onClose={() => setShowDetailedModal(false)}
      />

      {/* Category Ranking Modal */}
      <CategoryRankingModal
        isOpen={rankingModalType !== null}
        onClose={() => setRankingModalType(null)}
        title={rankingModalType === 'expense' ? 'Expense Category Ranking' : 'Income Category Ranking'}
        items={rankingModalType === 'expense' ? expenseStructure : incomeStructure}
        totalPaise={rankingModalType === 'expense' ? periodExpense : periodIncome}
      />
    </div>
  );
};
