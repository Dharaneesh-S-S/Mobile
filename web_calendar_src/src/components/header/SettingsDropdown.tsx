import React from 'react';
import {
  Settings as SettingsIcon,
  Trash2,
  Sliders,
  Keyboard,
  Printer,
  Sparkles,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react';
import { Settings } from '../../types/calendar';

interface SettingsDropdownProps {
  settings: Settings;
  onOpenSettings: (tab?: string) => void;
  onOpenTrash: () => void;
  onOpenDensityColor: () => void;
  onOpenShortcuts: () => void;
  onToggleTheme: () => void;
  onResetDemo: () => void;
  onClearDemo: () => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  settings,
  onOpenSettings,
  onOpenTrash,
  onOpenDensityColor,
  onOpenShortcuts,
  onToggleTheme,
  onResetDemo,
  onClearDemo,
  onClearAll,
  onClose,
}) => {
  return (
    <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#051211] p-2 shadow-2xl border border-teal-500/20 z-50 animate-in fade-in zoom-in-95 duration-150 text-[#F4FFFD]">
      <div className="space-y-0.5 text-xs text-[#94B5B0]">
        <button
          type="button"
          onClick={() => {
            onOpenSettings('general');
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-500/10 hover:text-[#F4FFFD] transition-colors text-left"
        >
          <SettingsIcon className="w-4 h-4 text-[#19E6C8]" />
          <span className="font-semibold text-[#F4FFFD]">Settings</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenTrash();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-500/10 hover:text-[#F4FFFD] transition-colors text-left"
        >
          <Trash2 className="w-4 h-4 text-[#19E6C8]" />
          <span className="font-semibold text-[#F4FFFD]">Trash</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenDensityColor();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-500/10 hover:text-[#F4FFFD] transition-colors text-left"
        >
          <Sliders className="w-4 h-4 text-[#19E6C8]" />
          <div className="flex-1 flex justify-between items-center">
            <span className="font-semibold text-[#F4FFFD]">Density and color</span>
            <span className="text-[10px] text-teal-400/60 capitalize">{settings.density}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onToggleTheme();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-500/10 hover:text-[#F4FFFD] transition-colors text-left"
        >
          <Moon className="w-4 h-4 text-[#19E6C8]" />
          <div className="flex-1 flex justify-between items-center">
            <span className="font-semibold text-[#F4FFFD]">Dark theme</span>
            <span className="text-[10px] text-[#19E6C8] font-bold uppercase tracking-wide">
              {settings.theme === 'dark' ? 'On' : 'Off'}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            window.print();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-500/10 hover:text-[#F4FFFD] transition-colors text-left"
        >
          <Printer className="w-4 h-4 text-teal-400/60" />
          <span className="font-semibold text-[#F4FFFD]">Print view</span>
        </button>

        <div className="my-1.5 border-t border-teal-500/15" />

        <button
          type="button"
          onClick={() => {
            onOpenShortcuts();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-teal-500/10 hover:text-[#F4FFFD] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Keyboard className="w-4 h-4 text-[#19E6C8]" />
            <span className="font-semibold text-[#F4FFFD]">Keyboard shortcuts</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-[#030707] rounded border border-teal-500/30 font-mono text-[#19E6C8] font-bold">
            ?
          </kbd>
        </button>

        <div className="my-1.5 border-t border-teal-500/15" />

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset to initial sample demo data? This will restore sample events.')) {
              onResetDemo();
              onClose();
            }
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-teal-500/15 text-[#19E6C8] transition-colors text-left font-bold"
        >
          <Sparkles className="w-4 h-4" />
          <span>Restore Demo Data</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Clear all demo data and sample events?')) {
              onClearDemo();
              onClose();
            }
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-teal-500/10 text-[#94B5B0] hover:text-[#F4FFFD] transition-colors text-left"
        >
          <RefreshCw className="w-4 h-4 text-teal-400/60" />
          <span className="font-medium">Clear Demo Data</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all calendar data?')) {
              onClearAll();
              onClose();
            }
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-950/20 text-red-400 transition-colors text-left"
        >
          <Trash2 className="w-4 h-4" />
          <span className="font-medium">Clear All Data</span>
        </button>
      </div>
    </div>
  );
};
