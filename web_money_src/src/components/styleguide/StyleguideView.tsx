import React, { useState } from 'react';
import {
  GlassCard,
  BentoGrid,
  BentoItem,
  Button,
  EyebrowTag,
  StatTile,
  Input,
  Toggle,
  ProgressBar,
  Accordion,
} from '../ui';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowRight,
  Search,
  ShieldCheck,
  CreditCard,
  Layers,
} from 'lucide-react';
import { formatInr } from '../../utils/currency';

export const StyleguideView: React.FC = () => {
  const [toggleVal, setToggleVal] = useState(true);
  const [inputValue, setInputValue] = useState('₹45,000');

  const colorTokens = [
    { name: 'Canvas Base', hex: '#030707', bg: 'bg-[#030707]', border: 'border-teal-500/30' },
    { name: 'Canvas Surface', hex: '#051211', bg: 'bg-[#051211]', border: 'border-teal-500/30' },
    { name: 'Teal Primary', hex: '#19E6C8', bg: 'bg-[#19E6C8]', border: 'border-white' },
    { name: 'Teal Accent', hex: '#2DD4BF', bg: 'bg-[#2DD4BF]', border: 'border-white' },
    { name: 'Teal Deep', hex: '#0B7F78', bg: 'bg-[#0B7F78]', border: 'border-teal-400/40' },
    { name: 'Coral Expense', hex: '#FF6B6B', bg: 'bg-[#FF6B6B]', border: 'border-white' },
    { name: 'Ice Transfer', hex: '#38BDF8', bg: 'bg-[#38BDF8]', border: 'border-white' },
    { name: 'White Heading', hex: '#F4FFFD', bg: 'bg-[#F4FFFD]', border: 'border-teal-500/40' },
    { name: 'Muted Body', hex: '#94B5B0', bg: 'bg-[#94B5B0]', border: 'border-teal-500/40' },
    { name: 'Dim Meta', hex: '#5B7B76', bg: 'bg-[#5B7B76]', border: 'border-teal-500/40' },
  ];

  const faqItems = [
    {
      id: 'faq-1',
      title: 'How does the futuristic teal glass system work?',
      content:
        'It combines deep obsidian dark canvas (#030707) with 20px hardware-accelerated backdrop blur, thin 1px cyan rim highlights, and subtle radial light bleeds.',
    },
    {
      id: 'faq-2',
      title: 'Are all monetary values in Indian Rupees (₹)?',
      content:
        'Yes. All figures use standard Indian digit grouping (e.g. ₹1,23,456) and are stored in integer paise with zero floating point roundoff errors.',
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div>
        <EyebrowTag icon={<Sparkles className="w-3.5 h-3.5" />}>Design System & UI Tokens</EyebrowTag>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight mt-2">
          RupeeFlow Futuristic Glass Spec
        </h1>
        <p className="text-sm text-[#94B5B0] mt-1 max-w-2xl leading-relaxed">
          Inspired by the reference futuristic fintech aesthetic. High-contrast white pill actions, translucent dark teal glass panels, and glowing metrics.
        </p>
      </div>

      {/* 1. Color Swatches */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
          1. Color Palette Tokens
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {colorTokens.map((c) => (
            <div
              key={c.name}
              className="p-3 rounded-2xl bg-[#061817]/70 border border-teal-500/20 flex flex-col gap-2"
            >
              <div className={`w-full h-12 rounded-xl ${c.bg} ${c.border} border shadow-md`} />
              <div>
                <div className="text-xs font-bold text-white">{c.name}</div>
                <div className="text-[11px] font-mono text-[#5B7B76]">{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Button Hierarchy */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
          2. Button Hierarchy
        </h3>
        <GlassCard className="flex flex-wrap items-center gap-4">
          <Button variant="primary">
            <span>Primary White Pill</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button variant="teal">
            <Sparkles className="w-4 h-4" />
            <span>Neon Teal Pill</span>
          </Button>

          <Button variant="ghost">
            <span>Ghost Teal Pill</span>
          </Button>

          <Button variant="coral">
            <span>Coral Action Pill</span>
          </Button>

          <Button variant="icon" title="Icon Button">
            <Search className="w-4 h-4" />
          </Button>
        </GlassCard>
      </section>

      {/* 3. StatTiles & Financial Currency Figures */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
          3. StatTiles & Rupee Figures (₹)
        </h3>
        <BentoGrid>
          <BentoItem colSpan="lg:col-span-4">
            <StatTile
              variant="featured"
              label="Total Net Balance"
              value={formatInr(12320400)}
              subValue="Updated just now"
              icon={<Wallet className="w-5 h-5" />}
              trend={{ direction: 'up', text: '+18.4% This Month' }}
            />
          </BentoItem>

          <BentoItem colSpan="lg:col-span-4">
            <StatTile
              variant="income"
              label="Period Income"
              value={formatInr(8250000)}
              subValue="Salary & Dividends"
              icon={<TrendingUp className="w-5 h-5" />}
              trend={{ direction: 'up', text: '₹82,500' }}
            />
          </BentoItem>

          <BentoItem colSpan="lg:col-span-4">
            <StatTile
              variant="expense"
              label="Period Expense"
              value={formatInr(1484000)}
              subValue="38 Transactions"
              icon={<TrendingDown className="w-5 h-5" />}
              trend={{ direction: 'down', text: '₹14,840' }}
            />
          </BentoItem>
        </BentoGrid>
      </section>

      {/* 4. BentoGrid & Glass Cards */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
          4. BentoGrid Glass Cards
        </h3>
        <BentoGrid>
          <BentoItem colSpan="lg:col-span-7">
            <GlassCard variant="featured" className="h-full flex flex-col justify-between">
              <div>
                <EyebrowTag>Featured Spotlight Card</EyebrowTag>
                <h4 className="text-xl font-bold text-white font-display mt-3">
                  Autonomous Wealth Intelligence
                </h4>
                <p className="text-xs text-[#94B5B0] mt-1 leading-relaxed max-w-md">
                  Radial cyan glow backlighting with top-edge specular glass reflection line. Automatically highlights elevated data points.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-teal-500/15 flex items-center justify-between">
                <span className="text-xs text-[#5B7B76] font-mono">SPEC: GLASS-CARD-FEATURED</span>
                <Button variant="primary" size="sm">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan="lg:col-span-5">
            <GlassCard className="h-full flex flex-col justify-between">
              <div>
                <EyebrowTag dot={false}>Standard Glass</EyebrowTag>
                <h4 className="text-lg font-bold text-white font-display mt-3">
                  Multi-Account Wallets
                </h4>
                <p className="text-xs text-[#94B5B0] mt-1 leading-relaxed">
                  Smoky translucent teal-black backdrop with 20px blur and 1px border.
                </p>
              </div>

              <div className="space-y-3 mt-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Monthly Budget</span>
                    <span className="text-[#19E6C8] font-bold font-mono">68%</span>
                  </div>
                  <ProgressBar value={68} variant="teal" />
                </div>
              </div>
            </GlassCard>
          </BentoItem>
        </BentoGrid>
      </section>

      {/* 5. Inputs & Controls */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
          5. Forms & Interactive Controls
        </h3>
        <GlassCard className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Transaction Amount"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            leftIcon={<CreditCard className="w-4 h-4" />}
            placeholder="₹0"
          />

          <div className="space-y-4 pt-2">
            <Toggle
              checked={toggleVal}
              onChange={setToggleVal}
              label="Ethereal Glass Glow Effects"
              description="Toggle radial teal gradients and ambient backlights"
            />
          </div>
        </GlassCard>
      </section>

      {/* 6. Accordion Showcase */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
          6. FAQ Accordion
        </h3>
        <Accordion items={faqItems} />
      </section>
    </div>
  );
};
