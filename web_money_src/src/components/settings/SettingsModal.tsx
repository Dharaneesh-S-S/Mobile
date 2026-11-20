import React, { useState } from 'react';
import {
  X,
  Moon,
  Sun,
  Laptop,
  Lock,
  Download,
  Upload,
  Database,
  Trash2,
  Check,
  Shield,
  Smartphone,
  Calendar,
  IndianRupee,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { useMoney } from '../../context/MoneyContext';
import {
  exportRecordsToCsv,
  exportFullBackupJson,
  restoreFullBackupJson,
  downloadFile,
  parseRawCsv,
  mapCsvRowsToRecords,
} from '../../utils/exportImport';
import { db } from '../../db';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    closeSettings,
    settings,
    updateSettings,
    wallets,
    accounts,
    categories,
    records,
    loadDemoData,
    clearDemoData,
    resetDatabase,
    showToast,
    openCategoryManager,
  } = useMoney();

  // Passcode setup state
  const [showPasscodeSetup, setShowPasscodeSetup] = useState<boolean>(false);
  const [newPasscode, setNewPasscode] = useState<string>('');

  // CSV Import state
  const [csvImportData, setCsvImportData] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [colDateIdx, setColDateIdx] = useState<number>(0);
  const [colDescIdx, setColDescIdx] = useState<number>(1);
  const [colAmtIdx, setColAmtIdx] = useState<number>(2);

  if (!isSettingsOpen) return null;

  const handleExportCsv = () => {
    const csvStr = exportRecordsToCsv(records, wallets, categories);
    downloadFile(csvStr, `rupeeflow_records_${Date.now()}.csv`, 'text/csv');
    showToast({ type: 'success', text: 'CSV export downloaded' });
  };

  const handleExportBackup = async () => {
    const jsonStr = await exportFullBackupJson();
    downloadFile(jsonStr, `rupeeflow_backup_${Date.now()}.json`, 'application/json');
    showToast({ type: 'success', text: 'Full JSON backup downloaded' });
  };

  const handleRestoreBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const res = await restoreFullBackupJson(reader.result);
        if (res.success) {
          showToast({ type: 'success', text: 'Backup restored successfully' });
          closeSettings();
        } else {
          showToast({ type: 'error', text: res.error || 'Restore failed' });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleCsvFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const parsed = parseRawCsv(reader.result);
        if (parsed.headers.length > 0 && parsed.rows.length > 0) {
          setCsvImportData(parsed);
          // auto detect headers
          parsed.headers.forEach((h, idx) => {
            const lower = h.toLowerCase();
            if (lower.includes('date')) setColDateIdx(idx);
            else if (lower.includes('desc') || lower.includes('memo') || lower.includes('title')) setColDescIdx(idx);
            else if (lower.includes('amount') || lower.includes('rs') || lower.includes('inr')) setColAmtIdx(idx);
          });
        } else {
          showToast({ type: 'error', text: 'Empty or invalid CSV file' });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmCsvImport = async () => {
    if (!csvImportData) return;

    const mapping = {
      dateColIndex: colDateIdx,
      descriptionColIndex: colDescIdx,
      amountColIndex: colAmtIdx,
    };

    const defaultWalletId = settings.defaultWalletId || wallets[0]?.id || 'wal-upi';
    const res = mapCsvRowsToRecords(
      csvImportData.rows,
      mapping,
      settings.defaultAccountId,
      defaultWalletId,
      categories,
      records
    );

    if (res.recordsToImport.length > 0) {
      await db.records.bulkPut(res.recordsToImport);
      showToast({
        type: 'success',
        text: `Imported ${res.recordsToImport.length} records (${res.duplicateCount} duplicates skipped)`,
      });
    } else {
      showToast({ type: 'info', text: 'No new records to import (all skipped or invalid)' });
    }

    setCsvImportData(null);
  };

  const handleSavePasscode = () => {
    if (newPasscode.length >= 4 && newPasscode.length <= 6) {
      updateSettings({
        passcode: newPasscode,
        isPasscodeEnabled: true,
      });
      showToast({ type: 'success', text: 'Passcode protection enabled' });
      setShowPasscodeSetup(false);
      setNewPasscode('');
    } else {
      showToast({ type: 'warning', text: 'Passcode must be 4 to 6 digits' });
    }
  };

  const handleDisablePasscode = () => {
    updateSettings({ isPasscodeEnabled: false, passcode: undefined });
    showToast({ type: 'info', text: 'Passcode disabled' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={closeSettings} />
      <div className="w-full sm:max-w-md bg-[#061817]/95 border border-teal-500/25 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 z-10 max-h-[88vh] flex flex-col backdrop-blur-xl animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-500/15 shrink-0">
          <h3 className="text-base font-bold text-white font-display">Settings</h3>
          <button onClick={closeSettings} className="p-1 rounded-lg text-[#94B5B0] hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-5 py-3">
          {/* 1. Theme */}
          <div>
            <label className="text-xs font-semibold text-[#94B5B0] block mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {(['dark', 'light', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => updateSettings({ theme: t })}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    settings.theme === t
                      ? 'bg-[#19E6C8] text-[#030707] font-bold shadow-glow-teal'
                      : 'bg-[#030707] text-[#94B5B0] hover:text-white border border-teal-500/15'
                  }`}
                >
                  {t === 'dark' ? <Moon className="w-3.5 h-3.5" /> : t === 'light' ? <Sun className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Currency & Number Grouping */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#94B5B0] block">Currency & Number Formatting</label>
            <div className="p-3 bg-[#030707]/60 rounded-2xl border border-teal-500/15 space-y-3">
              {/* Digit grouping */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white">Indian Digit Grouping</span>
                  <p className="text-[10px] text-[#5B7B76]">e.g. 1,23,456 instead of 123,456</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({
                      numberGrouping: settings.numberGrouping === 'in' ? 'intl' : 'in',
                    })
                  }
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.numberGrouping === 'in' ? 'bg-[#19E6C8]' : 'bg-[#061817] border border-teal-500/30'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      settings.numberGrouping === 'in' ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Show Decimals */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white">Show Decimals</span>
                  <p className="text-[10px] text-[#5B7B76]">Display paise (.00)</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSettings({ showDecimals: !settings.showDecimals })}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.showDecimals ? 'bg-[#19E6C8]' : 'bg-[#061817] border border-teal-500/30'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      settings.showDecimals ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Positive Net in Green */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white">Positive Net in Green</span>
                  <p className="text-[10px] text-[#5B7B76]">Highlight savings surplus in emerald</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSettings({ showGreenNet: !settings.showGreenNet })}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.showGreenNet ? 'bg-[#19E6C8]' : 'bg-[#061817] border border-teal-500/30'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      settings.showGreenNet ? 'left-5' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Calendar & Cycle Settings */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#94B5B0] block">Date & Cycle Settings</label>
            <div className="p-3 bg-[#030707]/60 rounded-2xl border border-teal-500/15 space-y-3">
              {/* Week Start Day */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-white">Week Starts On</span>
                <select
                  value={settings.weekStartDay}
                  onChange={(e) => updateSettings({ weekStartDay: parseInt(e.target.value) as 0 | 1 })}
                  className="px-2.5 py-1 rounded-lg bg-[#061817] border border-teal-500/25 text-xs text-white focus:border-[#19E6C8] outline-none"
                >
                  <option value={0}>Sunday</option>
                  <option value={1}>Monday</option>
                </select>
              </div>

              {/* Month Start Day (Salary cycle) */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-white">Month Start Day</span>
                  <p className="text-[10px] text-[#5B7B76]">e.g. 25th for salary cycle</p>
                </div>
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={settings.monthStartDay}
                  onChange={(e) => updateSettings({ monthStartDay: parseInt(e.target.value) || 1 })}
                  className="w-14 px-2 py-1 rounded-lg bg-[#061817] border border-teal-500/25 text-xs text-white text-center font-bold focus:border-[#19E6C8] outline-none"
                />
              </div>

              {/* Compact calendar numbers mode */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-white">Calendar Cell Format</span>
                <select
                  value={settings.compactCalendarFormat}
                  onChange={(e) => updateSettings({ compactCalendarFormat: e.target.value as any })}
                  className="px-2.5 py-1 rounded-lg bg-[#061817] border border-teal-500/25 text-xs text-white focus:border-[#19E6C8] outline-none"
                >
                  <option value="lakhs">Lakhs / K (1.2L, 1.5K)</option>
                  <option value="full">Exact (24,387)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Passcode Security */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94B5B0] block">Security</label>
            <div className="p-3 bg-[#030707]/60 rounded-2xl border border-teal-500/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#19E6C8]" />
                <div>
                  <span className="text-xs font-semibold text-white">Passcode Lock</span>
                  <p className="text-[10px] text-[#5B7B76]">
                    {settings.isPasscodeEnabled ? 'Passcode enabled (4-6 digits)' : 'No passcode set'}
                  </p>
                </div>
              </div>
              {settings.isPasscodeEnabled ? (
                <button
                  onClick={handleDisablePasscode}
                  className="px-3 py-1 rounded-xl bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/30 text-xs font-semibold cursor-pointer"
                >
                  Disable
                </button>
              ) : (
                <button
                  onClick={() => setShowPasscodeSetup(true)}
                  className="px-3 py-1 rounded-xl bg-[#19E6C8] text-[#030707] text-xs font-bold shadow-glow-teal hover:bg-[#19E6C8]/90 cursor-pointer"
                >
                  Set PIN
                </button>
              )}
            </div>

            {/* Passcode setup drawer */}
            {showPasscodeSetup && (
              <div className="p-3 bg-[#030707] rounded-2xl border border-teal-500/25 space-y-2">
                <span className="text-xs font-semibold text-white">Enter New 4-6 Digit PIN</span>
                <input
                  type="password"
                  maxLength={6}
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  placeholder="••••"
                  autoFocus
                  className="w-full px-3 py-2 rounded-xl bg-[#061817] border border-teal-500/25 text-sm text-center font-bold text-white tracking-widest focus:border-[#19E6C8] outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPasscodeSetup(false)}
                    className="flex-1 py-1.5 rounded-lg bg-[#061817] border border-teal-500/15 text-xs font-semibold text-[#94B5B0] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePasscode}
                    className="flex-1 py-1.5 rounded-lg bg-[#19E6C8] text-[#030707] text-xs font-bold shadow-glow-teal hover:bg-[#19E6C8]/90 cursor-pointer"
                  >
                    Activate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 5. Data Management (Export & Import) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94B5B0] block">Data Backup & Export</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportCsv}
                className="p-3 rounded-2xl glass-card border border-teal-500/15 hover:border-teal-500/30 flex items-center justify-center gap-2 text-xs font-semibold text-white hover:bg-teal-950/40 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#19E6C8]" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleExportBackup}
                className="p-3 rounded-2xl glass-card border border-teal-500/15 hover:border-teal-500/30 flex items-center justify-center gap-2 text-xs font-semibold text-white hover:bg-teal-950/40 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#19E6C8]" />
                <span>JSON Backup</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="p-3 rounded-2xl glass-card border border-teal-500/15 hover:border-teal-500/30 flex items-center justify-center gap-2 text-xs font-semibold text-white hover:bg-teal-950/40 cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Import CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFilePick}
                  className="hidden"
                />
              </label>

              <label className="p-3 rounded-2xl glass-card border border-teal-500/15 hover:border-teal-500/30 flex items-center justify-center gap-2 text-xs font-semibold text-white hover:bg-teal-950/40 cursor-pointer transition-all">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Restore JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreBackupFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* CSV Mapping Drawer */}
          {csvImportData && (
            <div className="p-4 bg-[#030707] rounded-2xl border border-teal-500/25 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase">Map CSV Columns</h4>
              <p className="text-[11px] text-[#94B5B0]">Found {csvImportData.rows.length} rows. Select column mapping:</p>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] text-[#94B5B0] block mb-0.5">Date Column</label>
                  <select
                    value={colDateIdx}
                    onChange={(e) => setColDateIdx(parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#061817] border border-teal-500/25 text-white focus:border-[#19E6C8] outline-none"
                  >
                    {csvImportData.headers.map((h, i) => (
                      <option key={i} value={i}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#94B5B0] block mb-0.5">Description Column</label>
                  <select
                    value={colDescIdx}
                    onChange={(e) => setColDescIdx(parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#061817] border border-teal-500/25 text-white focus:border-[#19E6C8] outline-none"
                  >
                    {csvImportData.headers.map((h, i) => (
                      <option key={i} value={i}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#94B5B0] block mb-0.5">Amount Column (₹)</label>
                  <select
                    value={colAmtIdx}
                    onChange={(e) => setColAmtIdx(parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#061817] border border-teal-500/25 text-white focus:border-[#19E6C8] outline-none"
                  >
                    {csvImportData.headers.map((h, i) => (
                      <option key={i} value={i}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setCsvImportData(null)}
                  className="flex-1 py-1.5 rounded-lg bg-[#061817] border border-teal-500/15 text-[#94B5B0] hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCsvImport}
                  className="flex-1 py-1.5 rounded-lg bg-[#19E6C8] text-[#030707] text-xs font-bold shadow-glow-teal hover:bg-[#19E6C8]/90 cursor-pointer"
                >
                  Import {csvImportData.rows.length} Rows
                </button>
              </div>
            </div>
          )}

          {/* 6. Demo Data & Reset */}
          <div className="space-y-2 pt-2 border-t border-teal-500/15">
            <label className="text-xs font-semibold text-[#94B5B0] block">Sample Demo Data</label>
            <div className="flex gap-2">
              <button
                onClick={loadDemoData}
                className="flex-1 py-2.5 rounded-2xl bg-teal-500/15 hover:bg-teal-500/25 text-[#19E6C8] border border-teal-500/30 text-xs font-semibold transition-all cursor-pointer"
              >
                Load Sample Data (2 Months)
              </button>
              <button
                onClick={clearDemoData}
                className="py-2.5 px-3 rounded-2xl bg-[#030707] hover:bg-teal-950/40 text-[#94B5B0] hover:text-white border border-teal-500/15 text-xs font-semibold transition-all cursor-pointer"
              >
                Clear Demo Records
              </button>
            </div>

            <button
              onClick={() => {
                const conf = window.confirm('Are you sure you want to completely erase all data and reset?');
                if (conf) resetDatabase();
              }}
              className="w-full py-2.5 rounded-2xl bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all mt-2 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset & Delete All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
