import { CARD, COLORS, COPY } from '@/lib/cardTokens'
import type { CardInput } from './parseCardInput'
import { initials } from '@/lib/initials'

// Pure JSX returning a Satori-compatible tree. No CSS filters / grid / blend modes.
// Satori rules: every multi-child element needs display:flex; avoid multiple text nodes
// in a single element (use template literals instead of JSX interpolation).
export function CardImage({ input }: { input: CardInput }) {
  const { username, roast, photoDataUrl, label, color, serial } = input
  return (
    <div
      style={{
        width: CARD.width,
        height: CARD.height,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.char,
        backgroundImage: `radial-gradient(60% 45% at 50% 12%, rgba(255,59,31,0.28), transparent 70%), radial-gradient(90% 60% at 50% 112%, ${COLORS.oxblood}, transparent 70%)`,
        padding: 64,
        fontFamily: 'JetBrains Mono',
        color: COLORS.ash,
        position: 'relative',
      }}
    >
      {/* Header band */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 26, letterSpacing: 4, color: COLORS.ashDim }}>{COPY.tagline}</div>
        <div style={{ fontSize: 26, color: color }}>{serial}</div>
      </div>

      {/* Big ROAST wordmark */}
      <div
        style={{
          display: 'flex',
          fontFamily: 'Anton',
          fontSize: 230,
          lineHeight: '0.9',
          color: COLORS.vermillion,
          letterSpacing: 4,
          marginTop: 8,
        }}
      >
        ROAST
      </div>

      {/* Photo + handle row */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 24 }}>
        <div
          style={{
            display: 'flex',
            width: 220,
            height: 220,
            borderRadius: 16,
            border: `8px solid ${COLORS.vermillion}`,
            boxShadow: `0 0 0 4px ${COLORS.char}, 0 0 60px rgba(255,59,31,0.45)`,
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: COLORS.char2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {photoDataUrl ? (
            <div style={{ display: 'flex', position: 'relative', width: 220, height: 220 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoDataUrl} width={220} height={220} style={{ objectFit: 'cover' }} alt="" />
              {/* red tint overlay approximates the screen duotone */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(177,26,18,0.32)',
                  display: 'flex',
                }}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', fontFamily: 'Anton', fontSize: 96, color: COLORS.vermillion }}>
              {initials(username)}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 28 }}>
          {/* Use template literal to avoid multiple text node children */}
          <div style={{ fontSize: 44, fontWeight: 700, color: COLORS.ash }}>{`@${username}`}</div>
          <div
            style={{
              display: 'flex',
              marginTop: 14,
              padding: '10px 18px',
              backgroundColor: color,
              color: COLORS.char,
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: 2,
              borderRadius: 6,
              transform: 'rotate(-3deg)',
            }}
          >
            {label}
          </div>
        </div>
      </div>

      {/* Roast body — template literal to keep single text node */}
      <div
        style={{
          display: 'flex',
          marginTop: 36,
          fontSize: 40,
          lineHeight: '1.45',
          color: COLORS.ash,
          flex: 1,
        }}
      >
        {`"${roast}"`}
      </div>

      {/* Perforated footer watermark */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `3px dashed ${COLORS.ashDim}`,
          paddingTop: 22,
        }}
      >
        <div style={{ display: 'flex', fontFamily: 'Anton', fontSize: 44, color: COLORS.vermillion, letterSpacing: 2 }}>
          {COPY.brandName}
        </div>
        {/* Template literal for multi-value text to avoid multiple text node children */}
        <div style={{ fontSize: 26, color: COLORS.ashDim }}>{`${COPY.handle} · ${COPY.footnote}`}</div>
      </div>
    </div>
  )
}
