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
      className={`h-[calc(100vh-61px)] border-r border-teal-500/20 bg-[#051211]/90 backdrop-blur-xl flex flex-col justify-between py-3 transition-all duration-300 shrink-0 select-none z-20 text-[#F4FFFD] ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* 1. FIXED TOP: Main Section Links (Always visible!) */}
      <div className="px-2 space-y-1 shrink-0 pb-3 border-b border-teal-500/20">
        {mainNav.map((item) => {
          const Icon = item.icon
          const isActive = currentSection === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-full transition-all ${
                isActive
                  ? 'bg-[#19E6C8] text-[#030707] font-extrabold shadow-[0_0_20px_rgba(25,230,200,0.35)]'
                  : 'text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#F4FFFD] font-semibold'
              }`}
              title={item.label}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#030707]' : 'text-teal-400'}`} />
              {!isCollapsed && <span className="text-xs truncate">{item.label}</span>}
            </button>
          )
        })}
      </div>

      {/* 2. SCROLLABLE MIDDLE: Labels list */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {!isCollapsed && (
          <div className="px-3 py-1 flex items-center justify-between text-[11px] font-bold text-teal-400 uppercase tracking-wider">
            <span>Labels</span>
            <button
              type="button"
              onClick={onOpenEditLabels}
              className="hover:text-[#19E6C8] p-0.5 rounded transition-colors"
              title="Edit labels"
            >
              <Edit2 className="w-3.5 h-3.5 text-teal-400/70" />
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
                  ? 'bg-teal-500/20 text-[#19E6C8] font-bold border border-teal-500/30'
                  : 'text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#F4FFFD]'
              }`}
              title={`Label: ${l.name}`}
            >
              <Tag
                className="w-4 h-4 shrink-0 text-[#19E6C8]"
              />
              {!isCollapsed && <span className="text-xs truncate font-medium">{l.name}</span>}
            </button>
          )
        })}

        {!isCollapsed && (
          <button
            type="button"
            onClick={onOpenEditLabels}
            className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-teal-400/80 hover:bg-teal-500/10 hover:text-[#19E6C8] text-xs font-semibold transition-colors"
          >
            <Edit2 className="w-4 h-4 text-teal-400/60" />
            <span>Edit labels</span>
          </button>
        )}
      </div>

      {/* 3. FIXED BOTTOM: Archive, Trash & Trash Alert */}
      <div className="px-2 pt-2 border-t border-teal-500/20 shrink-0 space-y-1">
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
                  ? 'bg-teal-500/20 text-[#19E6C8] font-bold border border-teal-500/30'
                  : 'text-[#94B5B0] hover:bg-teal-500/10 hover:text-[#F4FFFD] font-semibold'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 shrink-0 text-teal-400" />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-xs">
                  <span className="truncate">{item.label}</span>
                  {item.id === 'trash' && trashCount > 0 && (
                    <span className="text-[10px] bg-rose-950/60 text-rose-400 font-bold px-1.5 py-0.5 rounded-full border border-rose-800/40">
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
          <div className="mt-2 p-2.5 bg-rose-950/40 border border-rose-800/40 rounded-xl text-xs space-y-2">
            <div className="flex items-start gap-1.5 text-rose-300">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-tight font-medium">
                Notes in Trash are deleted forever after 7 days.
              </p>
            </div>
            <button
              type="button"
              onClick={onEmptyTrash}
              className="w-full py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] transition-colors shadow-2xs"
            >
              Empty Trash Now
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
