import React, { useState } from 'react';
import {
  GlassCard,
  BentoGrid,
  BentoItem,
  Button,
  EyebrowTag,
  Accordion,
} from '../ui';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  PieChart,
  Wallet,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  FileSpreadsheet,
  FileText,
  CreditCard,
  RotateCcw,
  Target,
  Smartphone,
} from 'lucide-react';
import { formatInr } from '../../utils/currency';

interface LandingViewProps {
  onEnterApp: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeTestimonial, setActiveTestimonial] = useState(1);

  const testimonials = [
    {
      id: 0,
      name: 'Rohan Sharma',
      role: 'Product Designer, Bengaluru',
      text: 'The futuristic dark teal interface is incredible. Finally a money tracker that feels like a spacecraft dashboard rather than a dull spreadsheet.',
      highlight: 'Saved ₹42,000 in 3 months',
    },
    {
      id: 1,
      name: 'Priya Narang',
      role: 'Tech Consultant, Mumbai',
      text: 'RupeeFlow handles integer paise calculations and Indian digit formatting effortlessly. The bento calendar and spending visualizer are masterpieces.',
      highlight: 'Budget adherence up by 65%',
    },
    {
      id: 2,
      name: 'Vikram Mehta',
      role: 'Architect & Investor, Delhi',
      text: 'Having multi-account wallets with Sodexo, Credit cards, and Cash categorized automatically gives me total peace of mind every single day.',
      highlight: 'Zero manual reconciliation',
    },
  ];

  const faqItems = [
    {
      id: 'faq-1',
      title: 'What makes RupeeFlow different from standard expense apps?',
      content:
        'RupeeFlow combines Indian Rupee (₹) native formatting, 100% offline IndexedDB storage (zero tracking, zero third-party servers), integer paise arithmetic, and a high-end futuristic glass aesthetic.',
    },
    {
      id: 'faq-2',
      title: 'Is my financial data secure?',
      content:
        'All data is stored purely locally in your browser’s IndexedDB database. Nothing ever leaves your device. You can export complete encrypted JSON backups or CSV/PDF reports anytime.',
    },
    {
      id: 'faq-3',
      title: 'Can I track debts, loans, and recurring subscriptions?',
      content:
        'Yes. RupeeFlow features a dedicated Debt Snowball tracker, recurring monthly bill automations with next-due projections, and multi-wallet balance transfers.',
    },
    {
      id: 'faq-4',
      title: 'How does the Indian digit grouping work?',
      content:
        'Every monetary figure adheres strictly to the Indian numbering system via Intl.NumberFormat("en-IN") (e.g., ₹1,23,456 instead of 123,456).',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#030707] text-[#F4FFFD] font-sans antialiased overflow-x-hidden selection:bg-[#19E6C8] selection:text-black">
      {/* 1. Floating Top Glass Navigation Pill */}
      <header className="sticky top-4 z-50 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="glass-panel rounded-full px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-2xl border border-teal-500/25">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onEnterApp}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#19E6C8] to-[#0D9488] p-[1px] shadow-[0_0_15px_rgba(25,230,200,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-[#030807] rounded-full flex items-center justify-center font-display font-black text-[#19E6C8] text-sm">
                ₹
              </div>
            </div>
            <span className="font-extrabold text-base tracking-tight font-display text-white">
              RupeeFlow
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#94B5B0]">
            <a href="#features" className="hover:text-[#19E6C8] transition-colors">
              Features
            </a>
            <a href="#intelligence" className="hover:text-[#19E6C8] transition-colors">
              Intelligence
            </a>
            <a href="#pricing" className="hover:text-[#19E6C8] transition-colors">
              Plans
            </a>
            <a href="#faq" className="hover:text-[#19E6C8] transition-colors">
              FAQ
            </a>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={onEnterApp}>
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 space-y-28 pb-24">
        {/* 2. Hero Section */}
        <section className="text-center space-y-6 relative">
          {/* Ambient Glow */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] pointer-events-none opacity-40 blur-3xl -z-10"
            style={{
              background:
                'radial-gradient(circle, rgba(25, 230, 200, 0.35) 0%, rgba(13, 148, 136, 0.15) 50%, transparent 75%)',
            }}
          />

          <div className="inline-block">
            <EyebrowTag icon={<Sparkles className="w-3 h-3" />}>Next-Gen Personal Finance</EyebrowTag>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white font-display tracking-tight max-w-4xl mx-auto leading-[1.08]">
            Money Mastered. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#19E6C8] to-[#2DD4BF]">
              Stress is Gone.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#94B5B0] max-w-xl mx-auto leading-relaxed">
            Personal money manager designed for Indian Rupees (₹). Real-time bento analytics, multi-wallet cash flow, and 100% private offline storage.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={onEnterApp}>
              <span>Open RupeeFlow Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="lg" onClick={onEnterApp}>
              <span>Explore Demo Data</span>
            </Button>
          </div>

          {/* Hero Dashboard Preview Card with Ambient Glow */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="glass-card-featured rounded-[32px] p-4 sm:p-6 shadow-2xl relative">
              {/* Inner Mock Dashboard */}
              <div className="rounded-2xl bg-[#030807]/90 p-4 sm:p-6 border border-teal-500/20 text-left space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-teal-500/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#19E6C8]/10 border border-[#19E6C8]/30 flex items-center justify-center text-[#19E6C8] font-bold">
                      ₹
                    </div>
                    <div>
                      <div className="text-xs text-[#5B7B76]">Portfolio Balance</div>
                      <div className="text-2xl font-black text-white font-display text-glow-teal">
                        {formatInr(12320400)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#19E6C8] bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                      +18.4% This Month
                    </span>
                    <Button variant="primary" size="sm" onClick={onEnterApp}>
                      + New Record
                    </Button>
                  </div>
                </div>

                {/* Mini Stat Stream */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#061817]/80 border border-teal-500/15">
                    <div className="text-[11px] text-[#5B7B76] uppercase tracking-wider font-semibold">
                      Monthly Income
                    </div>
                    <div className="text-lg font-bold text-[#19E6C8] mt-1 font-display">
                      +₹82,500
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#061817]/80 border border-teal-500/15">
                    <div className="text-[11px] text-[#5B7B76] uppercase tracking-wider font-semibold">
                      Monthly Expenses
                    </div>
                    <div className="text-lg font-bold text-[#FF6B6B] mt-1 font-display">
                      -₹14,840
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#061817]/80 border border-teal-500/15">
                    <div className="text-[11px] text-[#5B7B76] uppercase tracking-wider font-semibold">
                      Net Savings Rate
                    </div>
                    <div className="text-lg font-bold text-white mt-1 font-display">
                      82.0%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Bento Grid: Why Individuals & Families Choose RupeeFlow */}
        <section id="features" className="space-y-8">
          <div className="text-center space-y-2">
            <EyebrowTag>Autonomous Intelligence</EyebrowTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Why Individuals Choose RupeeFlow?
            </h2>
            <p className="text-sm text-[#94B5B0] max-w-lg mx-auto">
              A modern suite designed to handle personal expenses, budgets, savings goals, and multi-wallet transfers.
            </p>
          </div>

          <BentoGrid>
            {/* Card 1: Growth, Not Spreadsheets */}
            <BentoItem colSpan="lg:col-span-7">
              <GlassCard variant="featured" className="h-full flex flex-col justify-between">
                <div>
                  <EyebrowTag dot={false}>Advantage 01</EyebrowTag>
                  <h3 className="text-2xl font-bold text-white font-display mt-3">
                    Clarity, Not Spreadsheets
                  </h3>
                  <p className="text-xs text-[#94B5B0] mt-1.5 leading-relaxed max-w-md">
                    Seamless cash flow tracking with automated daily grouping, instant rupee calculations, and lightning-fast search by tag or note.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-teal-500/15 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#19E6C8] font-mono">
                    <Zap className="w-4 h-4" />
                    <span>Real-Time Paise Engine</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={onEnterApp}>
                    View Live Feed
                  </Button>
                </div>
              </GlassCard>
            </BentoItem>

            {/* Card 2: Smarter Accounting */}
            <BentoItem colSpan="lg:col-span-5">
              <GlassCard className="h-full flex flex-col justify-between">
                <div>
                  <EyebrowTag dot={false}>Advantage 02</EyebrowTag>
                  <h3 className="text-xl font-bold text-white font-display mt-3">
                    Smarter Categorization
                  </h3>
                  <p className="text-xs text-[#94B5B0] mt-1.5 leading-relaxed">
                    Custom category icons, color palettes, and budget limits that alert you before overspending.
                  </p>
                </div>

                <div className="mt-6 p-3 rounded-2xl bg-[#030807]/60 border border-teal-500/15 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white font-medium">Food & Dining</span>
                    <span className="text-[#19E6C8] font-mono font-bold">₹7,209 / ₹12,000</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#061817] rounded-full overflow-hidden">
                    <div className="w-[60%] h-full bg-[#19E6C8] rounded-full shadow-[0_0_8px_#19E6C8]" />
                  </div>
                </div>
              </GlassCard>
            </BentoItem>

            {/* Card 3: Multi-Wallet Architecture */}
            <BentoItem colSpan="lg:col-span-5">
              <GlassCard className="h-full flex flex-col justify-between">
                <div>
                  <EyebrowTag dot={false}>Advantage 03</EyebrowTag>
                  <h3 className="text-xl font-bold text-white font-display mt-3">
                    Multi-Wallet Balances
                  </h3>
                  <p className="text-xs text-[#94B5B0] mt-1.5 leading-relaxed">
                    Track Cash, Bank accounts, Credit cards, and Meal cards side-by-side with transfer fees and debts.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#061817]/60 border border-teal-500/15">
                    <div className="text-[10px] text-[#5B7B76]">HDFC Bank</div>
                    <div className="text-xs font-bold text-white mt-0.5">₹84,200</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#061817]/60 border border-teal-500/15">
                    <div className="text-[10px] text-[#5B7B76]">ICICI Credit</div>
                    <div className="text-xs font-bold text-[#FF6B6B] mt-0.5">-₹12,450</div>
                  </div>
                </div>
              </GlassCard>
            </BentoItem>

            {/* Card 4: 100% Private & Offline */}
            <BentoItem colSpan="lg:col-span-7">
              <GlassCard variant="featured" className="h-full flex flex-col justify-between">
                <div>
                  <EyebrowTag dot={false}>Advantage 04</EyebrowTag>
                  <h3 className="text-2xl font-bold text-white font-display mt-3">
                    Bank-Grade Local Privacy
                  </h3>
                  <p className="text-xs text-[#94B5B0] mt-1.5 leading-relaxed max-w-md">
                    Zero cloud leaks. Your data stays 100% in local IndexedDB. Export encrypted JSON or formatted PDF statements anytime.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#19E6C8] font-mono">
                    <ShieldCheck className="w-4 h-4" />
                    <span>IndexedDB Local Engine</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#94B5B0] font-mono ml-auto">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Excel & PDF Ready</span>
                  </div>
                </div>
              </GlassCard>
            </BentoItem>
          </BentoGrid>
        </section>

        {/* 4. Testimonials Carousel with Glowing Center Card */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <EyebrowTag>Testimonials</EyebrowTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Why Teams & Individuals Love RupeeFlow
            </h2>
            <p className="text-sm text-[#94B5B0]">
              Empowering thousands across India to take charge of their daily expenses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {testimonials.map((t, idx) => {
              const isCenter = idx === activeTestimonial;
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`cursor-pointer transition-all duration-300 ${
                    isCenter ? 'md:scale-105 z-20' : 'md:scale-95 opacity-70 hover:opacity-100'
                  }`}
                >
                  <GlassCard
                    variant={isCenter ? 'featured' : 'standard'}
                    className="p-6 h-full flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="text-xs font-mono font-bold text-[#19E6C8] uppercase tracking-wider">
                        {t.highlight}
                      </div>
                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        "{t.text}"
                      </p>
                    </div>

                    <div className="border-t border-teal-500/15 pt-3">
                      <div className="text-xs font-bold text-white">{t.name}</div>
                      <div className="text-[11px] text-[#5B7B76]">{t.role}</div>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTestimonial((p) => (p === 0 ? 2 : p - 1))}
              className="p-2 rounded-full border border-teal-500/20 text-[#5B7B76] hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTestimonial((p) => (p === 2 ? 0 : p + 1))}
              className="p-2 rounded-full border border-teal-500/20 text-[#5B7B76] hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 5. Pricing Cards with Glowing Center Card */}
        <section id="pricing" className="space-y-8">
          <div className="text-center space-y-3">
            <EyebrowTag>Transparent Pricing</EyebrowTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Choose the Right Plan for You
            </h2>

            {/* Monthly / Yearly Toggle */}
            <div className="flex items-center justify-center pt-2">
              <div className="p-1 rounded-full bg-[#061817] border border-teal-500/25 inline-flex items-center gap-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-[#19E6C8] text-black shadow-[0_0_15px_rgba(25,230,200,0.4)]'
                      : 'text-[#94B5B0] hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    billingCycle === 'yearly'
                      ? 'bg-[#19E6C8] text-black shadow-[0_0_15px_rgba(25,230,200,0.4)]'
                      : 'text-[#94B5B0] hover:text-white'
                  }`}
                >
                  Yearly (Save 20%)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Starter Plan */}
            <GlassCard className="p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs font-bold text-[#5B7B76] uppercase tracking-wider">
                  Starter Free
                </div>
                <div className="text-3xl font-extrabold text-white mt-2 font-display">
                  ₹0{' '}
                  <span className="text-xs text-[#5B7B76] font-normal font-sans">/ forever</span>
                </div>
                <p className="text-xs text-[#94B5B0] mt-2">
                  Complete money tracking with zero ads and unlimited transactions.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19E6C8]" />
                    <span>Unlimited Transactions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19E6C8]" />
                    <span>3 Wallets & Accounts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19E6C8]" />
                    <span>Monthly Calendar & Stats</span>
                  </li>
                </ul>
              </div>

              <Button variant="ghost" onClick={onEnterApp}>
                Start Free
              </Button>
            </GlassCard>

            {/* Pro Plan (Elevated & Glowing Center Card) */}
            <GlassCard variant="featured" className="p-6 flex flex-col justify-between space-y-6 md:-translate-y-2 border-teal-400">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#19E6C8] uppercase tracking-wider font-mono">
                    PRO STUDIO
                  </span>
                  <span className="text-[10px] font-bold bg-[#19E6C8] text-black px-2 py-0.5 rounded-full">
                    MOST POPULAR
                  </span>
                </div>

                <div className="text-4xl font-extrabold text-white mt-2 font-display text-glow-teal">
                  {billingCycle === 'monthly' ? '₹99' : '₹79'}{' '}
                  <span className="text-xs text-[#94B5B0] font-normal font-sans">/ month</span>
                </div>
                <p className="text-xs text-[#94B5B0] mt-2">
                  Advanced financial intelligence, debt tracker, and recurring automations.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19E6C8]" />
                    <span>Unlimited Accounts & Wallets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19E6C8]" />
                    <span>Automated Recurring Subscriptions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19E6C8]" />
                    <span>Debt Snowball & Savings Goals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19E6C8]" />
                    <span>Encrypted Backups & PDF Exports</span>
                  </li>
                </ul>
              </div>

              <Button variant="primary" onClick={onEnterApp}>
                Launch Pro Experience
              </Button>
            </GlassCard>

            {/* Family Plan */}
            <GlassCard className="p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs font-bold text-[#5B7B76] uppercase tracking-wider">
                  Family Suite
                </div>
                <div className="text-3xl font-extrabold text-white mt-2 font-display">
                  {billingCycle === 'monthly' ? '₹199' : '₹159'}{' '}
                  <span className="text-xs text-[#5B7B76] font-normal font-sans">/ month</span>
                </div>
                <p className="text-xs text-[#94B5B0] mt-2">
                  Up to 5 accounts with shared household budgets and statements.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19E6C8]" />
                    <span>Up to 5 Household Profiles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19E6C8]" />
                    <span>All Pro Intelligence Features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19E6C8]" />
                    <span>Priority Support</span>
                  </li>
                </ul>
              </div>

              <Button variant="ghost" onClick={onEnterApp}>
                Choose Family Plan
              </Button>
            </GlassCard>
          </div>
        </section>

        {/* 6. FAQ Accordion */}
        <section id="faq" className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <EyebrowTag>Support & Clarity</EyebrowTag>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion items={faqItems} />
        </section>

        {/* 7. Final Glowing CTA Card */}
        <section className="pt-8">
          <div className="glass-card-featured rounded-[36px] p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
            {/* Glowing Icon Tile */}
            <div className="w-16 h-16 rounded-3xl bg-[#030807] border border-[#19E6C8]/40 shadow-[0_0_30px_rgba(25,230,200,0.5)] flex items-center justify-center mx-auto text-[#19E6C8]">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight max-w-2xl mx-auto">
              Ready to Change Your Financial Life?
            </h2>

            <p className="text-sm text-[#94B5B0] max-w-md mx-auto leading-relaxed">
              Join thousands who track every single rupee with complete privacy and futuristic ease.
            </p>

            <div className="pt-2">
              <Button variant="primary" size="lg" onClick={onEnterApp}>
                <span>Launch RupeeFlow Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-teal-500/15 py-8 text-center text-xs text-[#5B7B76]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white font-display">RupeeFlow</span>
            <span>• Futuristic Personal Money Studio</span>
          </div>
          <div>All figures in Indian Rupees (₹) • 100% Private Offline Storage</div>
        </div>
      </footer>
    </div>
  );
};
