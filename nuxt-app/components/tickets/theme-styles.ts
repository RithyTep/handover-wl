import type { Theme } from '~/enums'

export interface TableThemeStyles {
  container: string
  header: string
  headerRow: string
  headerCell: string
  body: string
  row: (index: number) => string
  cell: (cellIndex: number) => string
  emptyCell: string
}

const defaultStyles: TableThemeStyles = {
  container: 'border border-white/20 rounded-md shadow-xl',
  header: 'bg-background backdrop-blur-md',
  headerRow: 'border-b border-border',
  headerCell: 'text-foreground border-r border-border last:border-r-0',
  body: '',
  row: () => 'border-b border-border hover:bg-muted/50',
  cell: () => 'border-r border-border last:border-r-0',
  emptyCell: 'h-24 text-center text-muted-foreground text-sm',
}

const christmasStyles: TableThemeStyles = {
  container: 'border border-white/20 rounded-md shadow-xl',
  header: 'bg-black/40 backdrop-blur-md',
  headerRow: 'border-b border-white/10',
  headerCell: 'text-white/90 border-r border-white/10 last:border-r-0',
  body: '',
  row: (index) => {
    const rowClasses = ['christmas-row-gold', 'christmas-row-red', 'christmas-row-green']
    return `border-b border-white/10 ${rowClasses[index % 3]} hover:brightness-110`
  },
  cell: (cellIndex) =>
    `border-r border-white/10 last:border-r-0 ${cellIndex === 0 ? 'candy-cane-border' : ''}`,
  emptyCell: 'h-24 text-center text-muted-foreground text-sm',
}

const pixelStyles: TableThemeStyles = {
  container: 'border-2 border-slate-700 bg-slate-900/50 backdrop-blur-sm pixel-shadow',
  header: 'bg-slate-950',
  headerRow: 'border-b-2 border-slate-700',
  headerCell: 'text-slate-400 border-r-2 border-slate-800 last:border-r-0',
  body: 'text-sm divide-y-2 divide-slate-800',
  row: () => 'hover:bg-slate-800/50',
  cell: () => 'border-r-2 border-slate-800 last:border-r-0',
  emptyCell: 'h-24 text-center text-muted-foreground text-sm',
}

const lunarStyles: TableThemeStyles = {
  container: 'lunar-card border border-stone-800/50 shadow-xl',
  header: 'lunar-table-header backdrop-blur-md',
  headerRow: 'border-b border-stone-800/50',
  headerCell: 'text-stone-500 border-r border-stone-800/30 last:border-r-0',
  body: 'text-sm',
  row: () => 'lunar-table-row',
  cell: () => 'lunar-table-cell border-r border-stone-800/30 last:border-r-0 text-stone-300',
  emptyCell: 'h-24 text-center text-muted-foreground text-sm',
}

const codingStyles: TableThemeStyles = {
  container: 'coding-card border border-green-900/30 shadow-xl shadow-green-900/20',
  header: 'coding-table-header backdrop-blur-md',
  headerRow: 'border-b border-green-900/30',
  headerCell: 'text-green-500/70 border-r border-green-900/30 last:border-r-0 font-mono',
  body: 'text-sm font-mono',
  row: () => 'coding-table-row',
  cell: () => 'coding-table-cell border-r border-green-900/30 last:border-r-0 text-green-400/70',
  emptyCell: 'h-24 text-center text-muted-foreground text-sm',
}

const clashStyles: TableThemeStyles = {
  container: 'clash-card',
  header: 'clash-table-header',
  headerRow: 'border-b border-[#9c9c9c]',
  headerCell: 'text-[#fbcc14] border-r border-[#9c9c9c] last:border-r-0',
  body: '',
  row: () => 'clash-table-row',
  cell: () => 'text-white border-r border-[#9c9c9c] last:border-r-0 font-medium dropshadow-sm',
  emptyCell: 'h-24 text-center text-muted-foreground text-sm',
}

const angkorPixelStyles: TableThemeStyles = {
  container: 'angkor-pixel-table bg-[#1a2f26] border-4 border-[#8b7355]',
  header: 'bg-[#3a2a1a]',
  headerRow: 'border-b-4 border-[#8b7355]',
  headerCell: 'text-[#ffd700] border-r border-[#8b7355] last:border-r-0 bg-[#3a2a1a]',
  body: 'text-sm bg-[#1a2f26]',
  row: (index) =>
    `border-b-2 border-[#3d5a4a] hover:bg-[#3d5a4a] ${index % 2 === 0 ? 'bg-[#243d32]' : 'bg-[#1e3329]'}`,
  cell: () => 'text-[#f5e6d3] border-r border-[#3d5a4a] last:border-r-0 font-medium',
  emptyCell: 'h-24 text-center text-muted-foreground text-sm',
}

const themeStylesMap: Record<string, TableThemeStyles> = {
  christmas: christmasStyles,
  pixel: pixelStyles,
  lunar: lunarStyles,
  coding: codingStyles,
  clash: clashStyles,
  angkor_pixel: angkorPixelStyles,
}

export function getTableThemeStyles(theme: Theme): TableThemeStyles {
  return themeStylesMap[theme] || defaultStyles
}

// Button theme styles
const buttonThemeMap: Record<string, string> = {
  christmas: 'text-white/80 hover:text-white hover:bg-white/10 border-white/20',
  pixel:
    'bg-slate-900 border-2 border-slate-700 hover:border-indigo-500 hover:text-indigo-400 pixel-shadow',
  lunar: 'text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg',
  coding: 'text-green-500/80 bg-black hover:bg-green-900/20 border border-green-900/30 font-mono',
  clash:
    'text-[#fbcc14] bg-[#3f2e21] hover:bg-black/20 border-2 border-[#9c9c9c] clash-btn-primary',
  angkor_pixel:
    'text-[#ffd700] bg-[#3a2a1a] hover:bg-[#4b3a2a] border-4 border-[#8b7355] angkor-pixel-btn',
}

export function getButtonThemeStyles(theme: Theme): string {
  return buttonThemeMap[theme] || 'text-slate-300 hover:bg-slate-800 border-slate-700'
}

// Select/Dropdown theme styles
interface SelectThemeStyles {
  trigger: string
  content: string
}

const selectThemeMap: Record<string, SelectThemeStyles> = {
  christmas: {
    trigger: 'bg-red-900/60 text-white border-2 border-green-600 hover:bg-red-800/70',
    content: 'bg-red-900 border-2 border-green-600 text-white',
  },
  pixel: {
    trigger:
      'bg-slate-900 text-indigo-400 border-2 border-slate-700 hover:border-indigo-500 pixel-shadow',
    content: 'bg-slate-900 border-2 border-slate-700 text-slate-200',
  },
  lunar: {
    trigger: 'bg-red-900/50 text-amber-200 border-2 border-amber-600/50 hover:bg-red-800/60',
    content: 'bg-red-900 border-2 border-amber-600/50 text-amber-100',
  },
  coding: {
    trigger: 'bg-black text-green-400 border-2 border-green-700 hover:border-green-500 font-mono',
    content: 'bg-black border-2 border-green-700 text-green-400 font-mono',
  },
  clash: {
    trigger:
      'bg-[#3f2e21] text-[#fbcc14] border-2 border-[#9c9c9c] hover:bg-[#4f3e31] clash-btn-primary',
    content: 'bg-[#3f2e21] border-2 border-[#9c9c9c] text-[#fbcc14]',
  },
  angkor_pixel: {
    trigger: 'bg-[#3a2a1a] text-[#ffd700] border-4 border-[#8b7355] hover:bg-[#4b3a2a]',
    content: 'bg-[#3a2a1a] border-4 border-[#8b7355] text-[#ffd700]',
  },
}

const defaultSelectStyles: SelectThemeStyles = {
  trigger: 'bg-slate-800 text-slate-200 border border-slate-600 hover:bg-slate-700',
  content: 'bg-slate-800 border border-slate-600 text-slate-200',
}

export function getSelectThemeStyles(theme: Theme): SelectThemeStyles {
  return selectThemeMap[theme] || defaultSelectStyles
}

// Mobile card theme styles
export const mobileCardThemeStyles: Record<string, Record<string, string>> = {
  card: {
    christmas: 'border-white/20',
    lunar: 'border-stone-800/50 lunar-card',
    coding: 'border-green-900/30 coding-card',
    clash: 'clash-card',
    angkor_pixel: 'angkor-pixel-mobile-card',
    pixel: 'border-slate-700 bg-slate-900',
    default: 'border-slate-700 bg-slate-900 default-mobile-card',
  },
  header: {
    christmas: 'border-white/20 bg-black/10',
    lunar: 'border-stone-800/50 bg-stone-900/30',
    coding: 'border-green-900/30 bg-black/50',
    clash: 'clash-table-header',
    angkor_pixel: 'border-[#8b7355] bg-[#3a2a1a]',
    pixel: 'border-slate-600 bg-slate-800/90',
    default: 'border-slate-600 bg-slate-800/90',
  },
  indexNumber: {
    christmas: 'text-white/80',
    lunar: 'text-stone-500',
    coding: 'text-green-600/70 font-mono',
    clash: 'text-[#fbcc14]',
    angkor_pixel: 'text-[#d4af37]',
    pixel: 'text-slate-300',
    default: 'text-slate-300',
  },
  ticketLink: {
    christmas: 'text-white hover:text-white/80',
    lunar: 'text-amber-400 hover:text-amber-300',
    coding: 'text-green-500/80 hover:text-green-400 font-mono',
    clash: 'text-white hover:text-[#fbcc14]',
    angkor_pixel: 'text-[#ffd700] hover:text-[#fff0a0]',
    pixel: 'text-sky-400 hover:text-sky-300',
    default: 'text-sky-400 hover:text-sky-300',
  },
  avatarRing: {
    christmas: 'ring-white/30',
    lunar: 'ring-stone-700',
    coding: 'ring-green-900/50',
    clash: 'ring-[#fbcc14]',
    angkor_pixel: 'ring-[#8b7355]',
    pixel: 'ring-slate-600',
    default: 'ring-slate-600',
  },
  avatarPlaceholder: {
    christmas: 'bg-white/20 text-white',
    lunar: 'bg-stone-800 text-stone-400',
    coding: 'bg-green-900/30 text-green-500/80 font-mono',
    clash: 'bg-black/30 text-[#fbcc14] font-bold',
    angkor_pixel: 'bg-[#3a2a1a] text-[#ffd700] font-bold',
    pixel: 'bg-slate-600 text-white',
    default: 'bg-slate-600 text-white',
  },
  summary: {
    christmas: 'text-white/90',
    lunar: 'text-stone-300',
    coding: 'text-green-400/80',
    clash: 'text-white/90',
    angkor_pixel: 'text-[#f5e6d3]',
    pixel: 'text-slate-100',
    default: 'text-slate-100',
  },
  label: {
    christmas: 'text-white/70',
    lunar: 'text-stone-500',
    coding: 'text-green-600/70 font-mono',
    clash: 'text-[#fbcc14]',
    angkor_pixel: 'text-[#d4af37]',
    pixel: 'text-slate-400',
    default: 'text-slate-400',
  },
}

export function getMobileCardThemeStyle(
  category: keyof typeof mobileCardThemeStyles,
  theme: Theme
): string {
  return mobileCardThemeStyles[category][theme] || mobileCardThemeStyles[category].default
}

export function getChristmasRowClass(index: number): string {
  if (index % 3 === 0) return 'christmas-row-gold'
  if (index % 3 === 1) return 'christmas-row-red'
  return 'christmas-row-green'
}
