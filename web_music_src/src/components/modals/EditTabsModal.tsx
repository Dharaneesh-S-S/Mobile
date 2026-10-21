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
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col text-white space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="font-extrabold text-base font-display">Edit Navigation Tabs</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Reorder or hide navigation tabs displayed in the bottom bar and sidebar.
        </p>

        <div className="space-y-1.5">
          {ALL_AVAILABLE_TABS.map((tab) => {
            const isVisible = tabOrder.includes(tab.id)
            const idx = tabOrder.indexOf(tab.id)
            return (
              <div
                key={tab.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleToggleTab(tab.id)}
                    className={isVisible ? 'text-fuchsia-400' : 'text-slate-600'}
                  >
                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <span className={`text-xs font-bold ${isVisible ? 'text-white' : 'text-slate-500 line-through'}`}>
                    {tab.label}
                  </span>
                </div>

                {isVisible && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === tabOrder.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold shadow-md shadow-fuchsia-600/30"
          >
            Save Tabs
          </button>
        </div>
      </div>
    </div>
  )
}
