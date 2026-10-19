import React from 'react';
import { User, Shield, LogOut, CheckCircle2 } from 'lucide-react';

interface ProfileMenuProps {
  onClose: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onClose }) => {
  return (
    <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-2xl border border-gray-100 dark:border-gray-700 z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100 dark:border-gray-700">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
            CC
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800" />
        </div>
        <h4 className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
          Chronos Workspace User
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">user@chronos.local</p>
        <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
          <Shield className="w-3 h-3" />
          Pro Offline Workspace
        </span>
      </div>

      <div className="pt-3 space-y-1 text-xs text-gray-700 dark:text-gray-200">
        <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-100">Local Storage Sync</p>
              <p className="text-[10px] text-gray-400">Zero-latency offline mode</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
        >
          <User className="w-4 h-4 text-gray-500" />
          <span>Manage Account & Preferences</span>
        </button>

        <button
          type="button"
          onClick={() => {
            alert('Chronos runs locally with no external backend required.');
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors text-red-600 dark:text-red-400"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};
