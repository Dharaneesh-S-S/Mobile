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
    <div className="flex-1 flex flex-col min-h-0 bg-transparent p-4 md:p-6 max-w-7xl w-full mx-auto space-y-5 overflow-y-auto select-none pb-20">
      {/* 1 & 2. Top Summary Row: Balance & Cash Flow side-by-side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Balance Card (Opening vs Ending) */}
        <div className="p-4 rounded-3xl glass-card border border-teal-500/15 shadow-md">
          <h4 className="text-xs font-mono font-bold text-[#94B5B0] uppercase tracking-wider mb-3">
            Period Balance
          </h4>
          <div className="grid grid-cols-2 gap-4 divide-x divide-teal-500/15">
            <div>
              <span className="text-[11px] font-mono text-[#5B7B76]">Opening Balance</span>
              <div className="text-base sm:text-xl font-bold text-white font-mono mt-0.5">
                {formatInr(openingBalance, opts)}
              </div>
            </div>
            <div className="pl-4">
              <span className="text-[11px] font-mono text-[#5B7B76]">Ending Balance</span>
              <div className="text-base sm:text-xl font-bold text-[#19E6C8] font-mono mt-0.5 text-glow-teal">
                {formatInr(endingBalance, opts)}
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Overview Card + "Show More" */}
        <div className="p-4 rounded-3xl glass-card border border-teal-500/15 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-mono font-bold text-[#94B5B0] uppercase tracking-wider">
              Cash Flow Overview
            </h4>
            <button
              onClick={() => setShowDetailedModal(true)}
              className="flex items-center gap-1 text-xs text-[#19E6C8] hover:text-[#2DD4BF] font-semibold transition-colors cursor-pointer"
            >
              <span>Show more</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 sm:p-3 rounded-2xl bg-[#061817]/70 border border-teal-500/15">
              <span className="text-[11px] font-mono text-[#19E6C8] font-bold block mb-1">Income</span>
              <span className="text-xs sm:text-base font-bold text-[#19E6C8] font-mono truncate block text-glow-teal">
                {formatInr(periodIncome, opts)}
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-2xl bg-[#061817]/70 border border-teal-500/15">
              <span className="text-[11px] font-mono text-[#FF6B6B] font-bold block mb-1">Expense</span>
              <span className="text-xs sm:text-base font-bold text-[#FF6B6B] font-mono truncate block text-glow-coral">
                {periodExpense > 0 ? `-${formatInr(periodExpense, opts)}` : '₹0'}
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-2xl bg-[#061817]/70 border border-teal-500/15">
              <span className="text-[11px] font-mono text-[#94B5B0] font-bold block mb-1">Net Flow</span>
              <span
                className={`text-xs sm:text-base font-bold font-mono truncate block ${
                  periodNet >= 0
                    ? 'text-[#19E6C8] text-glow-teal'
                    : 'text-[#FF6B6B] text-glow-coral'
                }`}
              >
                {formatInr(periodNet, opts)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 & 4. STRUCTURE CARD: Chart (Left) + Detailed Category Breakdown (Right) on desktop */}
      <div className="p-5 rounded-3xl glass-card border border-teal-500/15 shadow-md">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          {/* Switch tabs: Expense / Income */}
          <div className="flex items-center gap-1 bg-[#030707] p-1 rounded-xl border border-teal-500/20 font-mono">
            <button
              onClick={() => setStructureTab('expense')}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                structureTab === 'expense'
                  ? 'bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/40 shadow-[0_0_10px_rgba(255,107,107,0.3)]'
                  : 'text-[#94B5B0] hover:text-white'
              }`}
            >
              Expense Breakdown
            </button>
            <button
              onClick={() => setStructureTab('income')}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                structureTab === 'income'
                  ? 'bg-teal-500/20 text-[#19E6C8] border border-teal-500/40 shadow-[0_0_10px_rgba(25,230,200,0.3)]'
                  : 'text-[#94B5B0] hover:text-white'
              }`}
            >
              Income Breakdown
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart type toggle */}
            <button
              onClick={toggleChartStyle}
              className="p-1.5 px-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 text-[#19E6C8] text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle Chart Type"
            >
              {chartStyle === 'donut' ? <BarChart3 className="w-3.5 h-3.5" /> : <PieChart className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline font-mono">{chartStyle === 'donut' ? 'Bar Chart' : 'Donut Chart'}</span>
            </button>

            <button
              onClick={() => setRankingModalType(structureTab)}
              className="flex items-center gap-1 text-xs text-[#19E6C8] hover:text-[#2DD4BF] font-semibold transition-colors cursor-pointer"
            >
              <span>Ranking</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {activeStructure.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#5B7B76]">
            No {structureTab} recorded for this period.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left 5 Cols: Chart & Visuals */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {chartStyle === 'donut' ? (
                <div className="relative w-full h-64 flex items-center justify-center my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={3}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                        contentStyle={{
                          backgroundColor: '#061817',
                          border: '1px solid rgba(45,212,191,0.25)',
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: '#F4FFFD',
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>

                  {/* Center Label in Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-[10px] font-mono text-[#94B5B0] uppercase font-bold tracking-wider">
                      {structureTab === 'expense' ? 'Total Spent' : 'Total Inflows'}
                    </span>
                    <span
                      className={`text-base sm:text-lg font-black font-mono ${
                        structureTab === 'expense' ? 'text-[#FF6B6B] text-glow-coral' : 'text-[#19E6C8] text-glow-teal'
                      }`}
                    >
                      {structureTab === 'expense'
                        ? `-${formatInr(activeTotalPaise, opts)}`
                        : formatInr(activeTotalPaise, opts)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={pieChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={80} stroke="#94B5B0" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                        contentStyle={{
                          backgroundColor: '#061817',
                          border: '1px solid rgba(45,212,191,0.25)',
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: '#F4FFFD',
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
            </div>

            {/* Right 7 Cols: Category Ranking & Percentages List */}
            <div className="lg:col-span-7 flex flex-col gap-2.5 max-h-80 overflow-y-auto pr-1">
              {activeStructure.map((item, idx) => (
                <div
                  key={item.category.id}
                  className="p-2.5 rounded-2xl bg-[#061817]/60 border border-teal-500/15 hover:border-teal-500/35 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#5B7B76] font-bold text-[11px] w-4">
                        #{idx + 1}
                      </span>
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_6px]"
                        style={{ backgroundColor: item.category.color, boxShadow: `0 0 6px ${item.category.color}80` }}
                      />
                      <span className="text-[#F4FFFD] font-semibold">{item.category.name}</span>
                      <span className="text-[10px] text-[#5B7B76] font-mono">
                        ({item.records.length} transactions)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#94B5B0] font-mono text-[11px]">
                        {item.percentage.toFixed(1)}%
                      </span>
                      <span className="font-bold text-[#F4FFFD] font-mono">
                        {formatInr(item.amountPaise, opts)}
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-[#030707] border border-teal-500/20 rounded-full overflow-hidden">
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
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5 & 6. Lower Row: Cash Flow Trend & Wallet Usage side-by-side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Trend Chart */}
        <div className="p-4 rounded-3xl glass-card border border-teal-500/15 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-mono font-bold text-[#94B5B0] uppercase tracking-wider">
              Cash Flow Trend
            </h4>
            <div className="flex items-center gap-1 bg-[#030707] p-1 rounded-xl border border-teal-500/20 text-[11px] font-mono">
              <button
                onClick={() => setTrendMode('bars')}
                className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  trendMode === 'bars' ? 'bg-[#19E6C8] text-[#030807] shadow-[0_0_8px_rgba(25,230,200,0.4)]' : 'text-[#94B5B0] hover:text-white'
                }`}
              >
                In vs Out
              </button>
              <button
                onClick={() => setTrendMode('net')}
                className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  trendMode === 'net' ? 'bg-[#19E6C8] text-[#030807] shadow-[0_0_8px_rgba(25,230,200,0.4)]' : 'text-[#94B5B0] hover:text-white'
                }`}
              >
                Net
              </button>
            </div>
          </div>

          {trendData.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#5B7B76]">No activity to plot.</div>
          ) : (
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                {trendMode === 'bars' ? (
                  <BarChart data={trendData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                    <XAxis dataKey="dayLabel" stroke="#5B7B76" fontSize={10} tickLine={false} axisLine={{ stroke: '#0e2624' }} />
                    <YAxis stroke="#5B7B76" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`]}
                      contentStyle={{
                        backgroundColor: '#061817',
                        border: '1px solid rgba(45,212,191,0.25)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#F4FFFD',
                      }}
                    />
                    <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={trendData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                    <XAxis dataKey="dayLabel" stroke="#5B7B76" fontSize={10} tickLine={false} axisLine={{ stroke: '#0e2624' }} />
                    <YAxis stroke="#5B7B76" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Net']}
                      contentStyle={{
                        backgroundColor: '#061817',
                        border: '1px solid rgba(45,212,191,0.25)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#F4FFFD',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="net"
                      stroke="#19E6C8"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#19E6C8', stroke: '#030707', strokeWidth: 1.5 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Wallet Usage & Top Expenses */}
        <div className="p-4 rounded-3xl glass-card border border-teal-500/15 shadow-md flex flex-col gap-4">
          <div>
            <h4 className="text-xs font-mono font-bold text-[#94B5B0] uppercase tracking-wider mb-2.5">
              Spending Per Wallet
            </h4>
            {walletUsageData.length === 0 ? (
              <div className="py-4 text-center text-xs text-[#5B7B76]">No wallet spending recorded.</div>
            ) : (
              <div className="space-y-2.5">
                {walletUsageData.slice(0, 3).map((wal) => {
                  const totalSpent = walletUsageData.reduce((acc, w) => acc + w.spent, 0);
                  const pct = totalSpent > 0 ? (wal.spent / totalSpent) * 100 : 0;
                  return (
                    <div key={wal.name}>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-semibold text-[#F4FFFD]">{wal.name}</span>
                        <span className="font-bold text-white font-mono">
                          ₹{Math.round(wal.spent).toLocaleString('en-IN')} ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#030707] border border-teal-500/20 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300 shadow-[0_0_6px]"
                          style={{ width: `${pct}%`, backgroundColor: wal.color, boxShadow: `0 0 6px ${wal.color}` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Highest Single Expenses at Bottom */}
          <div className="pt-2 border-t border-teal-500/15">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF6B6B] uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-[#FF6B6B]" />
              <span>Highest Single Expenses</span>
            </div>
            {topExpenses.length === 0 ? (
              <div className="py-2 text-center text-xs text-[#5B7B76]">No expenses in this period.</div>
            ) : (
              <div className="space-y-1.5">
                {topExpenses.slice(0, 3).map((r, i) => {
                  const cat = categories.find((c) => c.id === r.categoryId);
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#061817]/60 border border-teal-500/15 hover:border-teal-500/35 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono font-bold text-[#5B7B76] text-[11px]">#{i + 1}</span>
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_6px]"
                          style={{ backgroundColor: cat?.color || '#FF6B6B', boxShadow: `0 0 6px ${cat?.color || '#FF6B6B'}80` }}
                        />
                        <span className="font-semibold text-white truncate">{r.description}</span>
                      </div>
                      <span className="font-bold text-[#FF6B6B] font-mono shrink-0 ml-2 text-glow-coral">
                        -{formatInr(r.amountPaise, opts)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
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
