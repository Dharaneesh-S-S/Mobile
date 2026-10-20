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
    <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-gray-800 p-2 shadow-2xl border border-gray-100 dark:border-gray-700 z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="space-y-0.5 text-xs text-gray-700 dark:text-gray-200">
        <button
          type="button"
          onClick={() => {
            onOpenSettings('general');
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <SettingsIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Settings</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenTrash();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Trash</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenDensityColor();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <Sliders className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div className="flex-1 flex justify-between items-center">
            <span className="font-medium">Density and color</span>
            <span className="text-[10px] text-gray-400 capitalize">{settings.density}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onToggleTheme();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
          <div className="flex-1 flex justify-between items-center">
            <span className="font-medium">Dark theme</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">
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
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <Printer className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Print view</span>
        </button>

        <div className="my-1.5 border-t border-gray-100 dark:border-gray-700" />

        <button
          type="button"
          onClick={() => {
            onOpenShortcuts();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Keyboard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="font-medium">Keyboard shortcuts</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 font-mono text-gray-500">
            ?
          </kbd>
        </button>

        <div className="my-1.5 border-t border-gray-100 dark:border-gray-700" />

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset to initial sample demo data? This will restore sample events.')) {
              onResetDemo();
              onClose();
            }
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors text-left"
        >
          <Sparkles className="w-4 h-4" />
          <span className="font-medium">Restore Demo Data</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Clear all demo data and sample events?')) {
              onClearDemo();
              onClose();
            }
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors text-left"
        >
          <RefreshCw className="w-4 h-4 text-gray-400" />
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
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors text-left"
        >
          <Trash2 className="w-4 h-4" />
          <span className="font-medium">Clear All Data</span>
        </button>
      </div>
    </div>
  );
};
