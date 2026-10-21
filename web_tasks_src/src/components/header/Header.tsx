import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Plus,
  Star,
  Maximize2,
  Minimize2,
  X,
  MoreVertical,
  Settings,
  Search,
  Calendar,
  Layers,
  HelpCircle,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import { ListOptionsMenu } from '../lists/ListOptionsMenu';

interface HeaderProps {
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Header: React.FC<HeaderProps> = ({ searchInputRef }) => {
  const {
    lists,
    activeListId,
    setActiveListId,
    activeList,
    layoutMode,
    toggleLayoutMode,
    searchQuery,
    setSearchQuery,
    starredTasksCount,
    todayTasksCount,
    overdueTasksCount,
    setShowCreateListModal,
    setShowSettingsModal,
    setShowShortcutsHelp,
    settings,
    updateSettings,
    setIsAddingTask,
  } = useTasks();

  const [isListDropdownOpen, setIsListDropdownOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsListDropdownOpen(false);
      }
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setIsOptionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getActiveTitle = () => {
    if (activeListId === 'starred') return 'Starred tasks';
    if (activeListId === 'calendar') return 'Calendar View';
    return activeList?.name || 'My Tasks';
  };

  const handleCycleTheme = () => {
    const nextTheme = settings.theme === 'light' ? 'dark' : settings.theme === 'dark' ? 'system' : 'light';
    updateSettings({ theme: nextTheme });
  };

  return (
    <header className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-20 px-3 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-2">
        {/* Left: App Logo + Name (or active list title in sidepanel mode) */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-2 select-none flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
              <CheckCircle2 className="w-5 h-5 stroke-[2.4]" />
            </div>
            {layoutMode === 'fullscreen' && (
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent hidden sm:inline">
                Zenith Tasks
              </span>
            )}
          </div>

          {/* List Switcher Dropdown */}
          <div className="relative min-w-0" ref={dropdownRef}>
            <button
              onClick={() => setIsListDropdownOpen(!isListDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition font-semibold text-sm max-w-[200px] truncate"
              title="Switch task list"
            >
              <span className="truncate">{getActiveTitle()}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isListDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isListDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-popover border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-pop-in">
                {/* Special Views */}
                <div className="px-2 pb-1.5 border-b border-slate-100 dark:border-slate-700/60 mb-1">
                  <button
                    onClick={() => {
                      setActiveListId('starred');
                      setIsListDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm text-left transition ${
                      activeListId === 'starred'
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>Starred</span>
                    </div>
                    {starredTasksCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-medium">
                        {starredTasksCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setActiveListId('calendar');
                      setIsListDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm text-left transition ${
                      activeListId === 'calendar'
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>Calendar view</span>
                    </div>
                  </button>
                </div>

                {/* User Lists */}
                <div className="max-h-60 overflow-y-auto px-1 py-0.5">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Lists
                  </div>
                  {lists.map(list => (
                    <button
                      key={list.id}
                      onClick={() => {
                        setActiveListId(list.id);
                        setIsListDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-sm text-left transition ${
                        activeListId === list.id
                          ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: list.color || '#3b82f6' }}
                        />
                        <span className="truncate">{list.name}</span>
                      </div>
                      {activeListId === list.id && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                    </button>
                  ))}
                </div>

                {/* Create List Button */}
                <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-700/60 px-2">
                  <button
                    onClick={() => {
                      setIsListDropdownOpen(false);
                      setShowCreateListModal(true);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create new list</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Search Box / Toggle */}
          <div className="relative">
            {isSearchActive ? (
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 text-sm border border-blue-500/50 w-44 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="bg-transparent border-none outline-none w-full text-slate-800 dark:text-slate-100 text-xs"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchActive(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsSearchActive(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Search tasks (Press /)"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition"
            title="Add task (Press Enter or a)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>

          {/* List Options Menu (⋮) */}
          <div className="relative" ref={optionsRef}>
            <button
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="List options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {isOptionsOpen && (
              <ListOptionsMenu onClose={() => setIsOptionsOpen(false)} />
            )}
          </div>

          {/* Full Screen / Side Panel Toggle */}
          <button
            onClick={toggleLayoutMode}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden sm:inline-flex"
            title={layoutMode === 'fullscreen' ? 'Collapse to side panel' : 'Open in full screen'}
          >
            {layoutMode === 'fullscreen' ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Theme Quick Toggle */}
          <button
            onClick={handleCycleTheme}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={`Current theme: ${settings.theme}. Click to switch.`}
          >
            {settings.theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : settings.theme === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Laptop className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Settings & shortcuts"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Due / Overdue Banner if any */}
      {(overdueTasksCount > 0 || todayTasksCount > 0) && activeListId !== 'calendar' && (
        <div className="mt-2 flex items-center gap-2 text-[11px] font-medium overflow-x-auto pb-0.5">
          {overdueTasksCount > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {overdueTasksCount} overdue
            </span>
          )}
          {todayTasksCount > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {todayTasksCount} due today
            </span>
          )}
        </div>
      )}
    </header>
  );
};
