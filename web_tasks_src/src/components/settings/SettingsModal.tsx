import React, { useRef } from 'react';
import {
  Settings,
  X,
  Sun,
  Moon,
  Laptop,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  FileSpreadsheet,
} from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import { exportTasksAsJson, exportTasksAsCsv, importTasksFromJson } from '../../utils/exportHelpers';

export const SettingsModal: React.FC = () => {
  const {
    showSettingsModal,
    setShowSettingsModal,
    settings,
    updateSettings,
    lists,
    tasks,
    resetToDemo,
    clearAll,
    showToast,
  } = useTasks();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!showSettingsModal) return null;

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const imported = importTasksFromJson(content);
      if (imported) {
        // If imported has lists and tasks, merge or replace
        showToast(`Imported ${imported.tasks.length} tasks successfully`);
        setShowSettingsModal(false);
      } else {
        alert('Invalid file format. Please upload a valid Zenith Tasks JSON backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-modal border border-slate-200 dark:border-slate-700 p-5 animate-pop-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Settings</h3>
          </div>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {/* Appearance / Theme */}
          <div>
            <label className="font-semibold block mb-2 text-slate-800 dark:text-slate-200">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'light' })}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition ${
                  settings.theme === 'light'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition ${
                  settings.theme === 'dark'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ theme: 'system' })}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition ${
                  settings.theme === 'system'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Laptop className="w-4 h-4 text-slate-400" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Default List */}
          <div>
            <label className="font-semibold block mb-1 text-slate-800 dark:text-slate-200">
              Default List for New Tasks
            </label>
            <select
              value={settings.defaultListId}
              onChange={e => updateSettings({ defaultListId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500"
            >
              {lists.map(l => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time & Calendar Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-800 dark:text-slate-200">
                Time Format
              </label>
              <select
                value={settings.timeFormat}
                onChange={e => updateSettings({ timeFormat: e.target.value as '12h' | '24h' })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs"
              >
                <option value="12h">12-hour (5:00 PM)</option>
                <option value="24h">24-hour (17:00)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-800 dark:text-slate-200">
                Density
              </label>
              <select
                value={settings.density}
                onChange={e => updateSettings({ density: e.target.value as 'compact' | 'comfortable' })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs"
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>

          {/* Notification Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">Task Reminders</div>
                <div className="text-[11px] text-slate-400">Trigger notifications for tasks with scheduled times</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={e => updateSettings({ notificationsEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </div>

          {/* Export & Backup */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <label className="font-semibold block mb-2 text-slate-800 dark:text-slate-200">
              Data Management & Backup
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => exportTasksAsJson(tasks, lists)}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs font-medium transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-500" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={() => exportTasksAsCsv(tasks, lists)}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs font-medium transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs font-medium transition"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-500" />
                <span>Import JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </div>
          </div>

          {/* Reset / Clear Demo Data */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <button
              type="button"
              onClick={resetToDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-medium transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load demo data</span>
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all data</span>
            </button>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex justify-end">
          <button
            onClick={() => setShowSettingsModal(false)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
