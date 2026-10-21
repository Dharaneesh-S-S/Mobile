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
    <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-[#131314] dark:bg-[#131314] border-r border-[#282a2c] text-[#e3e3e3] select-none z-20">
      {/* Prominent "+ Create" Pill Button */}
      <div className="p-4 pb-2">
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#282a2c] hover:bg-[#37393b] text-[#e3e3e3] hover:text-white shadow-md text-sm font-medium transition"
          title="Create task"
        >
          <Plus className="w-5 h-5 text-[#8ab4f8]" />
          <span>Create</span>
        </button>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="px-2 py-1 space-y-0.5">
        <button
          onClick={() => {
            setActiveNavTab('all');
            showAllLists();
          }}
          className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-sm font-medium transition ${
            activeNavTab === 'all'
              ? 'bg-[#004a77] text-[#c2e7ff]'
              : 'text-[#c4c7c5] hover:bg-[#1e1f20]'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-[#8ab4f8]" />
          <span>All tasks</span>
        </button>

        <button
          onClick={() => {
            setActiveNavTab('starred');
          }}
          className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-sm font-medium transition ${
            activeNavTab === 'starred'
              ? 'bg-[#004a77] text-[#c2e7ff]'
              : 'text-[#c4c7c5] hover:bg-[#1e1f20]'
          }`}
        >
          <Star className="w-5 h-5 text-[#c4c7c5]" />
          <span>Starred</span>
        </button>
      </div>

      {/* Lists Section Header */}
      <div className="mt-4 px-4 py-1.5 flex items-center justify-between text-xs font-medium text-[#8e918f]">
        <span>Lists</span>
        <button
          onClick={() => setIsListsExpanded(!isListsExpanded)}
          className="p-1 rounded hover:bg-[#1e1f20] text-[#8e918f] hover:text-[#e3e3e3] transition"
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
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-sm transition relative cursor-pointer ${
                  isSelected
                    ? 'bg-[#1e1f20] text-white font-medium'
                    : 'text-[#c4c7c5] hover:bg-[#1e1f20] hover:text-[#e3e3e3]'
                }`}
                onClick={() => handleListClick(list.id)}
              >
                {/* Checkbox to toggle column visibility in the board */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleListVisibility(list.id);
                    }}
                    className="text-[#8ab4f8] hover:text-white transition flex-shrink-0"
                    title={isVisible ? 'Hide list column' : 'Show list column'}
                  >
                    {isVisible ? (
                      <CheckSquare className="w-4 h-4 text-[#8ab4f8] fill-[#004a77]/30" />
                    ) : (
                      <Square className="w-4 h-4 text-[#8e918f]" />
                    )}
                  </button>
                  <span className="truncate text-xs sm:text-sm">{list.name}</span>
                </div>

                {/* Task Count on the Right */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs text-[#8e918f] font-normal px-1">
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
                      className="p-1 rounded hover:bg-[#282a2c] text-[#8e918f] hover:text-white"
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
      <div className="p-3 border-t border-[#282a2c] mt-auto">
        <button
          onClick={() => setShowCreateListModal(true)}
          className="flex items-center gap-3 px-3 py-2 text-sm text-[#8ab4f8] hover:text-[#c2e7ff] hover:bg-[#1e1f20] rounded-xl w-full transition font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Create new list</span>
        </button>
      </div>
    </aside>
  );
};
