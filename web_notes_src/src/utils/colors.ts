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
    darkBg: '#0f172a',
    darkBorder: '#1e293b',
    accentColor: '#94a3b8',
  },
  {
    id: 'coral',
    name: 'Coral',
    hex: '#faecea',
    lightBg: '#faecea',
    lightBorder: '#fca5a5',
    darkBg: '#3b1818',
    darkBorder: '#7f1d1d',
    accentColor: '#f87171',
  },
  {
    id: 'peach',
    name: 'Peach',
    hex: '#fbf0e4',
    lightBg: '#fbf0e4',
    lightBorder: '#fdba74',
    darkBg: '#3c1e0e',
    darkBorder: '#9a3412',
    accentColor: '#fb923c',
  },
  {
    id: 'sand',
    name: 'Sand',
    hex: '#fcf4dc',
    lightBg: '#fcf4dc',
    lightBorder: '#fde047',
    darkBg: '#362a0a',
    darkBorder: '#854d0e',
    accentColor: '#facc15',
  },
  {
    id: 'mint',
    name: 'Mint',
    hex: '#e9f6ef',
    lightBg: '#e9f6ef',
    lightBorder: '#6ee7b7',
    darkBg: '#0e2f22',
    darkBorder: '#065f46',
    accentColor: '#34d399',
  },
  {
    id: 'sage',
    name: 'Sage',
    hex: '#eef6ec',
    lightBg: '#eef6ec',
    lightBorder: '#bef264',
    darkBg: '#1b2f15',
    darkBorder: '#3f6212',
    accentColor: '#a3e635',
  },
  {
    id: 'fog',
    name: 'Fog',
    hex: '#e7f3f8',
    lightBg: '#e7f3f8',
    lightBorder: '#7dd3fc',
    darkBg: '#102a38',
    darkBorder: '#075985',
    accentColor: '#38bdf8',
  },
  {
    id: 'storm',
    name: 'Storm',
    hex: '#e9ecf6',
    lightBg: '#e9ecf6',
    lightBorder: '#a5b4fc',
    darkBg: '#161c3b',
    darkBorder: '#3730a3',
    accentColor: '#818cf8',
  },
  {
    id: 'dusk',
    name: 'Dusk',
    hex: '#f2eaf7',
    lightBg: '#f2eaf7',
    lightBorder: '#d8b4fe',
    darkBg: '#2a163b',
    darkBorder: '#6b21a8',
    accentColor: '#c084fc',
  },
  {
    id: 'blossom',
    name: 'Blossom',
    hex: '#fcecf2',
    lightBg: '#fcecf2',
    lightBorder: '#f9a8d4',
    darkBg: '#361224',
    darkBorder: '#9d174d',
    accentColor: '#f472b6',
  },
  {
    id: 'clay',
    name: 'Clay',
    hex: '#f5efe8',
    lightBg: '#f5efe8',
    lightBorder: '#fcd34d',
    darkBg: '#2c2016',
    darkBorder: '#78350f',
    accentColor: '#d97706',
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    hex: '#f1f5f9',
    lightBg: '#f1f5f9',
    lightBorder: '#94a3b8',
    darkBg: '#151c28',
    darkBorder: '#334155',
    accentColor: '#64748b',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    hex: '#e6f7f2',
    lightBg: '#e6f7f2',
    lightBorder: '#6ee7b7',
    darkBg: '#08281e',
    darkBorder: '#064e3b',
    accentColor: '#10b981',
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
