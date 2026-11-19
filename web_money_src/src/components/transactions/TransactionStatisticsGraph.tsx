import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Layers,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import { formatCompactInr, formatInr } from '../../utils/currency';

export const TransactionStatisticsGraph: React.FC = () => {
  const {
    filteredRecords,
    periodIncome,
    periodExpense,
    periodNet,
    categories,
    settings,
  } = useMoney();

  const [graphMode, setGraphMode] = useState<'trend' | 'categories'>('trend');

  const opts = {
    showDecimals: settings.showDecimals,
    useInternationalGrouping: settings.numberGrouping === 'intl',
  };

  // 1. Group daily cash flow data (Income vs Expense)
  const dailyData = useMemo(() => {
    const dayMap = new Map<
      string,
      {
        dayKey: string;
        dayLabel: string;
        fullDateStr: string;
        income: number;
        expense: number;
        net: number;
      }
    >();

    // Process all filtered records for current period
    for (const r of filteredRecords) {
      if (!r.dateTime) continue;
      const d = new Date(r.dateTime);
      if (isNaN(d.getTime())) continue;

      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const dayKey = `${y}-${m}-${dayNum}`;
      const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;
      const fullDateStr = d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });

      if (!dayMap.has(dayKey)) {
        dayMap.set(dayKey, {
          dayKey,
          dayLabel,
          fullDateStr,
          income: 0,
          expense: 0,
          net: 0,
        });
      }

      const item = dayMap.get(dayKey)!;
      if (r.type === 'income') {
        const val = r.amountPaise / 100;
        item.income += val;
        item.net += val;
      } else if (r.type === 'expense') {
        const val = r.amountPaise / 100;
        item.expense += val;
        item.net -= val;
      } else if (r.type === 'transfer' && r.feePaise) {
        const val = r.feePaise / 100;
        item.expense += val;
        item.net -= val;
      }
    }

    return Array.from(dayMap.values()).sort((a, b) =>
      a.dayKey.localeCompare(b.dayKey)
    );
  }, [filteredRecords]);

  // 2. Group category spending distribution
  const categoryData = useMemo(() => {
    const catMap = new Map<string, { name: string; color: string; amount: number }>();

    for (const r of filteredRecords) {
      if (r.type === 'expense') {
        const cat = categories.find((c) => c.id === r.categoryId) || {
          id: r.categoryId,
          name: 'Others',
          color: '#64748b',
        };
        const cur = catMap.get(cat.id) || {
          name: cat.name,
          color: cat.color || '#19E6C8',
          amount: 0,
        };
        cur.amount += r.amountPaise / 100;
        catMap.set(cat.id, cur);
      }
    }

    const totalExpRupees = periodExpense / 100;
    return Array.from(catMap.values())
      .map((item) => ({
        ...item,
        percentage: totalExpRupees > 0 ? (item.amount / totalExpRupees) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [filteredRecords, categories, periodExpense]);

  const hasData = filteredRecords.length > 0;

  return (
    <div className="mx-2 md:mx-0 mb-4 p-4 sm:p-5 rounded-3xl bg-[#061817]/85 border border-teal-500/20 backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] select-none transition-all">
      {/* Header with Title, Mode Toggle & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-teal-500/15">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#19E6C8] shadow-[0_0_12px_rgba(25,230,200,0.3)]">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white font-display tracking-tight flex items-center gap-2">
              Financial Statistics
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-[#19E6C8] border border-teal-500/25">
                {dailyData.length} Active Days
              </span>
            </h3>
            <p className="text-[10px] text-[#94B5B0] -mt-0.5">
              {graphMode === 'trend'
                ? 'Daily income vs. expense cash flow'
                : 'Top spending categories breakdown'}
            </p>
          </div>
        </div>

        {/* Action Toggle Pills & Stats */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center bg-[#030807] p-0.5 rounded-xl border border-teal-500/20">
            <button
              onClick={() => setGraphMode('trend')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                graphMode === 'trend'
                  ? 'bg-[#19E6C8] text-black font-bold shadow-[0_0_10px_rgba(25,230,200,0.35)]'
                  : 'text-[#94B5B0] hover:text-white'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Cash Flow</span>
            </button>
            <button
              onClick={() => setGraphMode('categories')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                graphMode === 'categories'
                  ? 'bg-[#19E6C8] text-black font-bold shadow-[0_0_10px_rgba(25,230,200,0.35)]'
                  : 'text-[#94B5B0] hover:text-white'
              }`}
            >
              <PieChart className="w-3 h-3" />
              <span>Categories</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Body */}
      {!hasData ? (
        <div className="py-12 flex flex-col items-center justify-center text-center text-[#5B7B76]">
          <BarChart3 className="w-8 h-8 mb-2 opacity-40 text-[#19E6C8]" />
          <span className="text-xs font-semibold text-[#94B5B0]">
            No transaction activity in this period
          </span>
          <span className="text-[10px] text-[#5B7B76] mt-0.5">
            Add a record to visualize your daily statistics and cash flow
          </span>
        </div>
      ) : graphMode === 'trend' ? (
        <div>
          {/* Legend and Summary row */}
          <div className="flex items-center justify-between text-[11px] mb-2 px-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981] shadow-[0_0_6px_#10B981]" />
                <span className="text-[#94B5B0] text-[10px]">Income</span>
                <span className="font-bold text-emerald-400 font-mono text-[10px]">
                  +{formatInr(periodIncome, { showDecimals: false })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444] shadow-[0_0_6px_#EF4444]" />
                <span className="text-[#94B5B0] text-[10px]">Expense</span>
                <span className="font-bold text-red-400 font-mono text-[10px]">
                  {periodExpense > 0 ? `-${formatInr(periodExpense, { showDecimals: false })}` : '₹0'}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-[#94B5B0] hidden sm:block">
              Net Flow:{' '}
              <span
                className={`font-bold font-mono ${
                  periodNet >= 0 ? 'text-[#19E6C8]' : 'text-red-400'
                }`}
              >
                {formatInr(periodNet, { showDecimals: false })}
              </span>
            </div>
          </div>

          {/* Recharts Bar Chart: Dual Bar (Income vs Expense per day) */}
          <div className="w-full h-48 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyData}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                barGap={2}
                barCategoryGap="20%"
              >
                <XAxis
                  dataKey="dayLabel"
                  stroke="#5B7B76"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#0e2624' }}
                />
                <YAxis
                  stroke="#5B7B76"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${formatCompactInr(val * 100, 'short')}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-[#030807] border border-teal-500/30 shadow-2xl text-xs font-sans">
                          <p className="font-bold text-white mb-1.5 border-b border-teal-500/20 pb-1">
                            {data.fullDateStr}
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[#94B5B0] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                                Income:
                              </span>
                              <span className="font-bold text-emerald-400 font-mono">
                                +₹{Math.round(data.income).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[#94B5B0] flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                                Expense:
                              </span>
                              <span className="font-bold text-red-400 font-mono">
                                -₹{Math.round(data.expense).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4 border-t border-teal-500/15 pt-1">
                              <span className="text-white font-medium">Net:</span>
                              <span
                                className={`font-bold font-mono ${
                                  data.net >= 0 ? 'text-[#19E6C8]' : 'text-red-400'
                                }`}
                              >
                                {data.net >= 0 ? '+' : ''}₹
                                {Math.round(data.net).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        /* Categories Distribution Mode */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Donut Chart */}
          <div className="md:col-span-5 h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Spent']}
                  contentStyle={{
                    backgroundColor: '#030807',
                    border: '1px solid rgba(25, 230, 200, 0.3)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[9px] text-[#94B5B0] uppercase font-semibold">
                Total Spent
              </span>
              <span className="text-xs sm:text-sm font-black text-red-400 font-display">
                -{formatInr(periodExpense, { showDecimals: false })}
              </span>
            </div>
          </div>

          {/* Category Bars List */}
          <div className="md:col-span-7 space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-semibold text-white truncate text-[11px]">
                      {cat.name}
                    </span>
                  </div>
                  <span className="font-bold text-[#94B5B0] font-mono text-[11px] shrink-0">
                    ₹{Math.round(cat.amount).toLocaleString('en-IN')}{' '}
                    <span className="text-teal-400 font-normal">
                      ({cat.percentage.toFixed(0)}%)
                    </span>
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#030807] overflow-hidden border border-teal-500/10">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, cat.percentage)}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
