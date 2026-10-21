export interface NotePatternOption {
  id: string
  name: string
  svgDataUri: string
}

export const NOTE_PATTERNS: NotePatternOption[] = [
  {
    id: 'none',
    name: 'None',
    svgDataUri: '',
  },
  {
    id: 'groceries',
    name: 'Groceries',
    svgDataUri: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.12' fill-rule='evenodd'%3E%3Cpath d='M8 6h6v4H8V6zm14 0h6v4h-6V6zm-14 8h6v4H8v-4zm14 0h6v4h-6v-4zm-14 8h6v4H8v-4zm14 0h6v4h-6v-4zm-14 8h6v4H8v-4zm14 0h6v4h-6v-4z' /%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    id: 'food',
    name: 'Food',
    svgDataUri: `url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='10' cy='10' r='4'/%3E%3Ccircle cx='32' cy='10' r='3'/%3E%3Ccircle cx='20' cy='30' r='5'/%3E%3Cpath d='M30 26l6 6M36 26l-6 6' stroke='%23f97316' stroke-width='1.5' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    id: 'music',
    name: 'Music',
    svgDataUri: `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238b5cf6' fill-opacity='0.12'%3E%3Cpath d='M12 28v-8l12-4v8m-12 4a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm12-4a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' stroke='%238b5cf6' stroke-width='1.5' fill='none'/%3E%3Ccircle cx='38' cy='36' r='3'/%3E%3Cpath d='M38 33v-10l6-2v6' stroke='%238b5cf6' stroke-width='1.5' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    id: 'travel',
    name: 'Travel',
    svgDataUri: `url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230ea5e9' fill-opacity='0.1'%3E%3Cpath d='M14 26l12-8 12 8-12 12-12-12z' stroke='%230ea5e9' stroke-width='1.5' fill='none'/%3E%3Ccircle cx='26' cy='26' r='4'/%3E%3Cpath d='M26 6v4m0 32v4M6 26h4m32 0h4' stroke='%230ea5e9' stroke-width='1.5' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    id: 'places',
    name: 'Places',
    svgDataUri: `url("data:image/svg+xml,%3Csvg width='46' height='46' viewBox='0 0 46 46' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Cpath d='M16 20a6 6 0 1 1 12 0c0 4.5-6 11-6 11s-6-6.5-6-11z' stroke='%2310b981' stroke-width='1.5' fill='none'/%3E%3Ccircle cx='22' cy='20' r='2' fill='%2310b981'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    id: 'notes',
    name: 'Notes',
    svgDataUri: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2364748b' fill-opacity='0.08'%3E%3Crect x='6' y='6' width='14' height='18' rx='2' stroke='%2364748b' stroke-width='1.2' fill='none'/%3E%3Cpath d='M9 11h8M9 15h8M9 19h5' stroke='%2364748b' stroke-width='1' stroke-linecap='round'/%3E%3Crect x='22' y='18' width='12' height='16' rx='2' stroke='%2364748b' stroke-width='1.2' fill='none'/%3E%3Cpath d='M25 23h6M25 27h6' stroke='%2364748b' stroke-width='1' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    id: 'celebration',
    name: 'Celebration',
    svgDataUri: `url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ec4899' fill-opacity='0.12'%3E%3Cpath d='M22 6l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z'/%3E%3Ccircle cx='10' cy='32' r='2'/%3E%3Ccircle cx='34' cy='28' r='2.5'/%3E%3C/g%3E%3C/svg%3E")`,
  },
]

export function getNotePattern(patternId?: string): NotePatternOption {
  if (!patternId) return NOTE_PATTERNS[0]
  return NOTE_PATTERNS.find((p) => p.id === patternId) || NOTE_PATTERNS[0]
}
