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
  X,
  Trash2,
  Edit2,
} from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import { ListOptionsMenu } from '../lists/ListOptionsMenu';

export const Sidebar: React.FC = () => {
  const {
    lists,
    tasks,
    isSidebarCollapsed,
    toggleSidebar,
    activeNavTab,
    setActiveNavTab,
    visibleListIds,
    toggleListVisibility,
    showAllLists,
    setShowCreateListModal,
    setActiveListId,
    activeListId,
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
    // Auto-close on mobile screen
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      toggleSidebar();
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
    <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-[#051211]/95 backdrop-blur-xl border-r border-teal-500/20 text-[#F4FFFD] select-none z-40 fixed md:relative inset-y-0 left-0 top-14 md:top-0 shadow-2xl md:shadow-none transition-transform duration-200">
      {/* Sidebar Header with Close Button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-teal-500/15">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Zenith Tasks</span>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-lg text-teal-400/70 hover:text-white hover:bg-teal-500/15 transition"
          title="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="px-3 py-2 space-y-1">
        <button
          onClick={() => {
            setActiveNavTab('all');
            showAllLists();
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              toggleSidebar();
            }
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
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              toggleSidebar();
            }
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

      {/* Lists Section Header with New List button */}
      <div className="mt-3 px-3.5 py-1.5 flex items-center justify-between text-[11px] font-bold text-teal-400/80 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span>Lists</span>
          <button
            type="button"
            onClick={() => setShowCreateListModal(true)}
            className="p-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-[#19E6C8] hover:text-white border border-teal-500/30 transition flex items-center gap-1 normal-case tracking-normal font-semibold text-[11px] px-2 py-0.5 cursor-pointer shadow-[0_0_10px_rgba(25,230,200,0.15)] active:scale-95"
            title="Create new list"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New list</span>
          </button>
        </div>
        <button
          onClick={() => setIsListsExpanded(!isListsExpanded)}
          className="p-1 rounded hover:bg-teal-500/10 text-teal-400 hover:text-white transition"
          title={isListsExpanded ? 'Collapse lists' : 'Expand lists'}
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

                {/* Task Count & Actions on the Right */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[11px] text-teal-400/60 font-medium px-1">
                    {count}
                  </span>

                  {/* Delete button: appears when list is clicked/selected or hovered */}
                  {!list.isDefault && (isSelected || hoveredListId === list.id) && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setListToDelete(list);
                      }}
                      className="p-1 rounded-md text-rose-400 hover:text-rose-200 hover:bg-rose-500/25 transition active:scale-95"
                      title={`Delete "${list.name}"`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Options Menu Button (visible when selected or hovered) */}
                  {(isSelected || hoveredListId === list.id) && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === list.id ? null : list.id);
                      }}
                      className="p-1 rounded hover:bg-teal-500/20 text-teal-400 hover:text-white transition"
                      title="List options"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Inline Options Dropdown */}
                {activeMenuId === list.id && (
                  <div
                    className="absolute right-2 top-full mt-1 z-50 w-44 bg-[#051211]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-teal-500/30 py-1 text-xs text-[#F4FFFD] animate-pop-in"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setActiveMenuId(null);
                        setListToRename(list);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-teal-500/15 text-[#F4FFFD] transition text-left"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-teal-400" />
                      <span>Rename list</span>
                    </button>
                    {!list.isDefault && (
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          setListToDelete(list);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 transition text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete list</span>
                      </button>
                    )}
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
