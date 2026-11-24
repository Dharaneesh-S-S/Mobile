import React from 'react'
import { Plus } from 'lucide-react'

interface TakeNoteBarProps {
  onOpenCreateNote: () => void
}

export const TakeNoteBar: React.FC<TakeNoteBarProps> = ({ onOpenCreateNote }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-6 px-3">
      <button
        type="button"
        onClick={onOpenCreateNote}
        className="w-full p-3.5 flex items-center justify-between cursor-pointer bg-[#051211]/90 hover:bg-[#071a18] border border-teal-500/20 hover:border-teal-500/40 rounded-2xl transition-all shadow-md hover:shadow-lg group text-left"
      >
        <span className="text-teal-400/60 group-hover:text-teal-400/90 text-sm font-medium transition-colors">
          Take a note...
        </span>
        <div className="w-8 h-8 rounded-xl bg-teal-500/10 group-hover:bg-teal-500/20 text-[#19E6C8] flex items-center justify-center transition-colors">
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </div>
      </button>
    </div>
  )
}
