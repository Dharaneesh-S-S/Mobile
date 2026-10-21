import React from 'react';
import * as LucideIcons from 'lucide-react';

export const CATEGORY_ICON_LIST = [
  // Food & Dining
  'Utensils', 'Coffee', 'Pizza', 'Beer', 'Wine', 'Soup', 'Apple', 'Cookie', 'Cake', 'IceCream',
  // Shopping & Essentials
  'ShoppingCart', 'ShoppingBag', 'Tag', 'Gift', 'Store', 'Package', 'Shirt', 'Watch',
  // Bills & Utilities
  'Receipt', 'Zap', 'Droplet', 'Wifi', 'Smartphone', 'Tv', 'Flame', 'Trash2', 'ShieldAlert',
  // Transport & Travel
  'Car', 'Bus', 'Train', 'Plane', 'Bike', 'Fuel', 'Navigation', 'Compass', 'MapPin',
  // Home & Living
  'Home', 'Bed', 'Sofa', 'Key', 'Wrench', 'Hammer', 'Scissors', 'Sparkles',
  // Health & Personal Care
  'HeartPulse', 'Pill', 'Stethoscope', 'Activity', 'Smile', 'Dumbbell', 'Bath',
  // Work, Income & Finance
  'Briefcase', 'Banknote', 'Coins', 'CreditCard', 'DollarSign', 'TrendingUp', 'Award', 'Trophy', 'Vault', 'PiggyBank',
  // Entertainment & Leisure
  'Film', 'Music', 'Gamepad2', 'Headphones', 'Camera', 'BookOpen', 'Palmtree', 'Ticket',
  // Education & Growth
  'GraduationCap', 'Book', 'Bookmark', 'Library', 'PenTool', 'Lightbulb',
  // Miscellaneous
  'MoreHorizontal', 'Calendar', 'Clock', 'Percent', 'Sliders', 'Folder', 'HelpCircle'
] as const;

export const COLOR_PALETTE = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#10b981', // Emerald
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#0ea5e9', // Sky
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#a855f7', // Purple
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#64748b', // Slate
  '#475569', // Dark Slate
];

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const DynamicIcon: React.FC<IconProps> = ({ name, className = 'w-5 h-5', size, color }) => {
  // @ts-ignore
  const Component = LucideIcons[name] || LucideIcons.CircleHelp || LucideIcons.HelpCircle;
  return <Component className={className} size={size} color={color} />;
};
