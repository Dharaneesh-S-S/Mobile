import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Star,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  MoreVertical,
} from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import { ListOptionsMenu } from '../lists/ListOptionsMenu';

export const Sidebar: React.FC = () => {
  const {
    lists,
    tasks,
    isSidebarCollapsed,
    activeNavTab,
    setActiveNavTab,
    visibleListIds,
    toggleListVisibility,
    showAllLists,
    setShowCreateListModal,
    setActiveListId,
    activeListId,
    setIsAddingTask,
    setListToRename,
    setListToDelete,
  } = useTasks();

  const [isListsExpanded, setIsListsExpanded] = useState(true);
  const [hoveredListId, setHoveredListId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  if (isSidebarCollapsed) {
    return null;
  }

  // Count active tasks for each list
  const getListActiveCount = (listId: string) => {
    return tasks.filter(t => t.listId === listId && !t.isCompleted).length;
  };

  const handleListClick = (listId: string) => {
    setActiveListId(listId);
    setActiveNavTab('all');
    // Ensure list is visible in board
    if (!visibleListIds.has(listId)) {
      toggleListVisibility(listId);
    }
    // Smooth scroll the column into view
    setTimeout(() => {
      const col = document.getElementById(`list-column-${listId}`);
      if (col) {
        col.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }, 50);
  };

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-[#051211]/90 backdrop-blur-xl border-r border-teal-500/20 text-[#F4FFFD] select-none z-20">
      {/* Prominent "+ Create" White Pill Button */}
      <div className="p-4 pb-2">
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#04100F] font-bold shadow-[0_0_20px_rgba(255,255,255,0.22)] text-xs transition active:scale-95"
          title="Create task"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create</span>
        </button>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="px-3 py-2 space-y-1">
        <button
          onClick={() => {
            setActiveNavTab('all');
            showAllLists();
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold transition ${
            activeNavTab === 'all'
              ? 'bg-[#19E6C8] text-[#030707] font-extrabold shadow-[0_0_20px_rgba(25,230,200,0.35)]'
              : 'text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#F4FFFD]'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${activeNavTab === 'all' ? 'text-[#030707]' : 'text-teal-400'}`} />
          <span>All tasks</span>
        </button>

        <button
          onClick={() => {
            setActiveNavTab('starred');
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold transition ${
            activeNavTab === 'starred'
              ? 'bg-[#19E6C8] text-[#030707] font-extrabold shadow-[0_0_20px_rgba(25,230,200,0.35)]'
              : 'text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#F4FFFD]'
          }`}
        >
          <Star className={`w-4 h-4 ${activeNavTab === 'starred' ? 'text-[#030707] fill-[#030707]' : 'text-[#94B5B0]'}`} />
          <span>Starred</span>
        </button>
      </div>

      {/* Lists Section Header */}
      <div className="mt-3 px-4 py-1.5 flex items-center justify-between text-[11px] font-bold text-teal-400/80 uppercase tracking-wider">
        <span>Lists</span>
        <button
          onClick={() => setIsListsExpanded(!isListsExpanded)}
          className="p-1 rounded hover:bg-teal-500/10 text-teal-400 hover:text-white transition"
        >
          {isListsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Lists Scrollable Container */}
      {isListsExpanded && (
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-thin">
          {lists.map(list => {
            const isVisible = visibleListIds.has(list.id);
            const count = getListActiveCount(list.id);
            const isSelected = activeListId === list.id;

            return (
              <div
                key={list.id}
                onMouseEnter={() => setHoveredListId(list.id)}
                onMouseLeave={() => setHoveredListId(null)}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition relative cursor-pointer ${
                  isSelected
                    ? 'bg-teal-500/15 text-[#19E6C8] border border-teal-500/30 font-bold'
                    : 'text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#F4FFFD]'
                }`}
                onClick={() => handleListClick(list.id)}
              >
                {/* Checkbox to toggle column visibility in the board */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleListVisibility(list.id);
                    }}
                    className="text-[#19E6C8] hover:text-white transition flex-shrink-0"
                    title={isVisible ? 'Hide list column' : 'Show list column'}
                  >
                    {isVisible ? (
                      <CheckSquare className="w-4 h-4 text-[#19E6C8] fill-teal-500/20" />
                    ) : (
                      <Square className="w-4 h-4 text-teal-500/40" />
                    )}
                  </button>
                  <span className="truncate">{list.name}</span>
                </div>

                {/* Task Count on the Right */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[11px] text-teal-400/60 font-medium px-1">
                    {count}
                  </span>

                  {/* Options Menu Button (visible on hover) */}
                  {hoveredListId === list.id && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === list.id ? null : list.id);
                      }}
                      className="p-1 rounded hover:bg-teal-500/20 text-teal-400 hover:text-white"
                      title="List options"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Options Dropdown */}
                {activeMenuId === list.id && (
                  <div
                    className="absolute right-2 top-full mt-1 z-50"
                    onClick={e => e.stopPropagation()}
                  >
                    <ListOptionsMenu onClose={() => setActiveMenuId(null)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* "+ Create new list" button at the bottom */}
      <div className="p-3 border-t border-teal-500/20 mt-auto">
        <button
          onClick={() => setShowCreateListModal(true)}
          className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#19E6C8] hover:text-[#2DD4BF] hover:bg-teal-500/10 rounded-xl w-full transition font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Create new list</span>
        </button>
      </div>
    </aside>
  );
};
