import React from 'react'
import {
  Lightbulb, Bell, FileText, PenTool, Tag,
  Archive, Trash2, Edit2, AlertCircle, Sparkles
} from 'lucide-react'
import { SidebarSection, Label } from '../../types'

interface SidebarProps {
  currentSection: SidebarSection
  onSelectSection: (section: SidebarSection) => void
  isCollapsed: boolean
  labels: Label[]
  onOpenEditLabels: () => void
  trashCount?: number
  onEmptyTrash?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  isCollapsed,
  labels,
  onOpenEditLabels,
  trashCount = 0,
  onEmptyTrash,
}) => {
  const mainNav = [
    { id: 'notes', label: 'Notes', icon: Lightbulb },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'drawings', label: 'Drawings', icon: PenTool },
  ]

  const bottomNav = [
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ]

  return (
    <aside
      className={`h-[calc(100vh-61px)] border-r border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col justify-between py-3 transition-all duration-300 shrink-0 select-none z-20 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* 1. FIXED TOP: Main Section Links (Always visible!) */}
      <div className="px-2 space-y-1 shrink-0 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        {mainNav.map((item) => {
          const Icon = item.icon
          const isActive = currentSection === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
              }`}
              title={item.label}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="text-xs truncate">{item.label}</span>}
            </button>
          )
        })}
      </div>

      {/* 2. SCROLLABLE MIDDLE: Labels list */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {!isCollapsed && (
          <div className="px-3 py-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Labels</span>
            <button
              type="button"
              onClick={onOpenEditLabels}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 rounded transition-colors"
              title="Edit labels"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {labels.map((l) => {
          const sectionKey = `label:${l.name}`
          const isActive = currentSection === sectionKey
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => onSelectSection(sectionKey)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-100/90 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              title={`Label: ${l.name}`}
            >
              <Tag
                className="w-4 h-4 shrink-0"
                style={{ color: l.color || '#6366f1' }}
              />
              {!isCollapsed && <span className="text-xs truncate font-medium">{l.name}</span>}
            </button>
          )
        })}

        {!isCollapsed && (
          <button
            type="button"
            onClick={onOpenEditLabels}
            className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
          >
            <Edit2 className="w-4 h-4 text-slate-400" />
            <span>Edit labels</span>
          </button>
        )}
      </div>

      {/* 3. FIXED BOTTOM: Archive, Trash & Trash Alert */}
      <div className="px-2 pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-1">
        {bottomNav.map((item) => {
          const Icon = item.icon
          const isActive = currentSection === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 shrink-0 text-slate-400" />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-xs">
                  <span className="truncate">{item.label}</span>
                  {item.id === 'trash' && trashCount > 0 && (
                    <span className="text-[10px] bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold px-1.5 py-0.5 rounded-full">
                      {trashCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}

        {/* Trash Banner if in trash */}
        {!isCollapsed && currentSection === 'trash' && trashCount > 0 && (
          <div className="mt-2 p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs space-y-2">
            <div className="flex items-start gap-1.5 text-red-800 dark:text-red-300">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-tight font-medium">
                Notes in Trash are deleted forever after 7 days.
              </p>
            </div>
            <button
              type="button"
              onClick={onEmptyTrash}
              className="w-full py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[11px] transition-colors shadow-2xs"
            >
              Empty Trash Now
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
