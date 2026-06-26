export type AnalyticsEvent =
  | 'session_started'
  | 'card_generated'
  | 'reroll_clicked'
  | 'card_shared'

type Props = Record<string, string | number | boolean>

export function track(event: AnalyticsEvent, props?: Props): void {
  if (typeof window === 'undefined') return
  const w = window as Window & { plausible?: (e: string, opts?: { props?: Props }) => void }
  if (typeof w.plausible === 'function') {
    w.plausible(event, props ? { props } : undefined)
  } else if (process.env.NODE_ENV !== 'production') {
    console.debug('[analytics]', event, props ?? {})
  }
}
