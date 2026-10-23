export interface NoteColorOption {
  id: string
  name: string
  hex: string
  lightBg: string
  lightBorder: string
  darkBg: string
  darkBorder: string
  accentColor: string
}

export const NOTE_COLORS: NoteColorOption[] = [
  {
    id: 'default',
    name: 'Default',
    hex: '#ffffff',
    lightBg: '#ffffff',
    lightBorder: '#e2e8f0',
    darkBg: '#051211',
    darkBorder: 'rgba(45, 212, 191, 0.20)',
    accentColor: '#19E6C8',
  },
  {
    id: 'coral',
    name: 'Coral',
    hex: '#faecea',
    lightBg: '#faecea',
    lightBorder: '#fca5a5',
    darkBg: '#180a0a',
    darkBorder: 'rgba(255, 107, 107, 0.30)',
    accentColor: '#FF6B6B',
  },
  {
    id: 'peach',
    name: 'Peach',
    hex: '#fbf0e4',
    lightBg: '#fbf0e4',
    lightBorder: '#fdba74',
    darkBg: '#180f08',
    darkBorder: 'rgba(251, 146, 60, 0.30)',
    accentColor: '#fb923c',
  },
  {
    id: 'sand',
    name: 'Sand',
    hex: '#fcf4dc',
    lightBg: '#fcf4dc',
    lightBorder: '#fde047',
    darkBg: '#141408',
    darkBorder: 'rgba(234, 179, 8, 0.30)',
    accentColor: '#facc15',
  },
  {
    id: 'mint',
    name: 'Mint',
    hex: '#e9f6ef',
    lightBg: '#e9f6ef',
    lightBorder: '#6ee7b7',
    darkBg: '#051815',
    darkBorder: 'rgba(45, 212, 191, 0.35)',
    accentColor: '#2DD4BF',
  },
  {
    id: 'sage',
    name: 'Sage',
    hex: '#eef6ec',
    lightBg: '#eef6ec',
    lightBorder: '#bef264',
    darkBg: '#061a15',
    darkBorder: 'rgba(20, 184, 166, 0.30)',
    accentColor: '#14B8A6',
  },
  {
    id: 'fog',
    name: 'Fog',
    hex: '#e7f3f8',
    lightBg: '#e7f3f8',
    lightBorder: '#7dd3fc',
    darkBg: '#051820',
    darkBorder: 'rgba(56, 189, 248, 0.30)',
    accentColor: '#38BDF8',
  },
  {
    id: 'storm',
    name: 'Storm',
    hex: '#e9ecf6',
    lightBg: '#e9ecf6',
    lightBorder: '#a5b4fc',
    darkBg: '#05141c',
    darkBorder: 'rgba(45, 212, 191, 0.25)',
    accentColor: '#2DD4BF',
  },
  {
    id: 'dusk',
    name: 'Dusk',
    hex: '#f2eaf7',
    lightBg: '#f2eaf7',
    lightBorder: '#d8b4fe',
    darkBg: '#081216',
    darkBorder: 'rgba(45, 212, 191, 0.25)',
    accentColor: '#19E6C8',
  },
  {
    id: 'blossom',
    name: 'Blossom',
    hex: '#fcecf2',
    lightBg: '#fcecf2',
    lightBorder: '#f9a8d4',
    darkBg: '#180a14',
    darkBorder: 'rgba(244, 114, 182, 0.30)',
    accentColor: '#f472b6',
  },
  {
    id: 'clay',
    name: 'Clay',
    hex: '#f5efe8',
    lightBg: '#f5efe8',
    lightBorder: '#fcd34d',
    darkBg: '#140e09',
    darkBorder: 'rgba(217, 119, 6, 0.30)',
    accentColor: '#d97706',
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    hex: '#f1f5f9',
    lightBg: '#f1f5f9',
    lightBorder: '#94a3b8',
    darkBg: '#030707',
    darkBorder: 'rgba(45, 212, 191, 0.15)',
    accentColor: '#94B5B0',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    hex: '#e6f7f2',
    lightBg: '#e6f7f2',
    lightBorder: '#6ee7b7',
    darkBg: '#041613',
    darkBorder: 'rgba(25, 230, 200, 0.35)',
    accentColor: '#19E6C8',
  },
]

export function getNoteColor(colorId?: string): NoteColorOption {
  if (!colorId) return NOTE_COLORS[0]
  const directMatch = NOTE_COLORS.find((c) => c.id === colorId)
  if (directMatch) return directMatch

  // Match hex if supplied directly
  const hexMatch = NOTE_COLORS.find((c) => c.hex.toLowerCase() === colorId.toLowerCase() || c.darkBg.toLowerCase() === colorId.toLowerCase())
  if (hexMatch) return hexMatch

  return NOTE_COLORS[0]
}

export function getCardThemeStyles(colorId?: string, isDark: boolean = true) {
  const opt = getNoteColor(colorId)
  const isDefault = !colorId || colorId === 'default'

  if (isDefault) {
    return {
      className: isDark
        ? 'bg-slate-900/90 border-slate-800/90 text-slate-100 shadow-md hover:border-indigo-500/40'
        : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:border-indigo-400',
      style: {},
      accentColor: opt.accentColor,
    }
  }

  return {
    className: isDark ? 'text-slate-100 shadow-md' : 'text-slate-900 shadow-sm',
    style: {
      backgroundColor: isDark ? opt.darkBg : opt.lightBg,
      borderColor: isDark ? opt.darkBorder : opt.lightBorder,
    },
    accentColor: opt.accentColor,
  }
}
