// Shared by the on-screen card (RoastCard) and the OG export (CardImage),
// so both renders stay visually identical.

export const CARD = { width: 1080, height: 1350 } as const // 4:5 portrait

export const COLORS = {
  char: '#17110F',       // warm near-black background (NOT pure #000)
  char2: '#241612',      // slightly lifted panel
  oxblood: '#430D0D',    // deep base red
  ember: '#B11A12',      // mid red
  vermillion: '#FF3B1F', // hot accent red
  hazard: '#F5C518',     // single hazard-yellow accent
  ash: '#ECE0D6',        // warm off-white text
  ashDim: '#A89486',     // muted label text
} as const

export const COPY = {
  brandName: 'GOSONG',
  handle: '@gosong.app',
  tagline: 'SERTIFIKAT KEMATANGAN THREADS',
  footnote: 'di-roast otomatis · disajikan panas',
} as const

export type SeverityTier = { min: number; label: string; color: string }

// Ascending by `min`. Higher score = more "burnt" = more savage.
export const SEVERITY_TIERS: readonly SeverityTier[] = [
  { min: 0, label: 'SETENGAH MATANG', color: COLORS.hazard },
  { min: 40, label: 'MEDIUM WELL', color: '#FF7A1A' },
  { min: 65, label: 'WELL DONE', color: COLORS.vermillion },
  { min: 85, label: 'GOSONG', color: COLORS.ember },
] as const
