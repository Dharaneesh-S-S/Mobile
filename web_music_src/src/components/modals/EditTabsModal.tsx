import React, { useState } from 'react'
import { X, Check, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react'
import { useMusic } from '../../context/MusicContext'

const ALL_AVAILABLE_TABS = [
  { id: 'home', label: 'Home' },
  { id: 'tracks', label: 'Tracks' },
  { id: 'playlists', label: 'Playlists' },
  { id: 'albums', label: 'Albums' },
  { id: 'artists', label: 'Artists' },
  { id: 'genres', label: 'Genres' },
  { id: 'folders', label: 'Folders' },
]

export const EditTabsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useMusic()
  const [tabOrder, setTabOrder] = useState<string[]>(
    settings.activeTabs || ['home', 'tracks', 'playlists', 'albums', 'artists', 'genres', 'folders']
  )

  if (!isOpen) return null

  const handleToggleTab = (id: string) => {
    if (tabOrder.includes(id)) {
      if (tabOrder.length <= 2) return // keep at least 2 tabs
      setTabOrder(prev => prev.filter(t => t !== id))
    } else {
      setTabOrder(prev => [...prev, id])
    }
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const copy = [...tabOrder]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= copy.length) return
    const [moved] = copy.splice(index, 1)
    copy.splice(targetIdx, 0, moved)
    setTabOrder(copy)
  }

  const handleSave = async () => {
    await updateSettings({ activeTabs: tabOrder })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-sm bg-[#051413]/95 border border-teal-500/25 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col text-[#F4FFFD] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-teal-500/15">
          <h3 className="font-extrabold text-base font-display text-[#F4FFFD]">Edit Navigation Tabs</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#94B5B0] hover:text-[#F4FFFD] hover:bg-teal-500/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#94B5B0]">
          Reorder or hide navigation tabs displayed in the bottom bar and sidebar.
        </p>

        <div className="space-y-1.5">
          {ALL_AVAILABLE_TABS.map((tab) => {
            const isVisible = tabOrder.includes(tab.id)
            const idx = tabOrder.indexOf(tab.id)
            return (
              <div
                key={tab.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#030d0c] border border-teal-500/20"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleToggleTab(tab.id)}
                    className={isVisible ? 'text-[#19E6C8]' : 'text-slate-600'}
                  >
                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <span className={`text-xs font-bold ${isVisible ? 'text-[#F4FFFD]' : 'text-slate-500 line-through'}`}>
                    {tab.label}
                  </span>
                </div>

                {isVisible && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 text-[#94B5B0] hover:text-[#F4FFFD] disabled:opacity-20"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === tabOrder.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 text-[#94B5B0] hover:text-[#F4FFFD] disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-teal-500/15">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold text-[#94B5B0] hover:text-[#F4FFFD]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-full bg-white hover:bg-slate-100 text-[#04100F] text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.22)] transition-all active:scale-95"
          >
            Save Tabs
          </button>
        </div>
      </div>
    </div>
  )
}
