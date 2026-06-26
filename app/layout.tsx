import type { Metadata, Viewport } from 'next'
import { Anton, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

const jbMono = JetBrains_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-jbmono',
  display: 'swap',
})

const SITE_URL = 'https://gosong.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'GOSONG — Roast Threads lo sampai gosong 🔥',
  description:
    'Ketik username Threads lo, dapet sertifikat roast yang savage tapi sayang. Gratis, tanpa login. Screenshot & post balik.',
  openGraph: {
    title: 'GOSONG — Roast Threads lo sampai gosong 🔥',
    description: 'Roast vibe Threads lo jadi kartu kece. Gratis, tanpa login.',
    url: SITE_URL,
    siteName: 'GOSONG',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'GOSONG', description: 'Roast Threads lo sampai gosong.' },
}

export const viewport: Viewport = {
  themeColor: '#17110F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // prevent zoom jank inside the Threads in-app browser
}

// Plausible-style analytics: only loads when a domain is configured. This is what
// defines window.plausible, which lib/analytics.ts track() calls (no-op otherwise).
const analyticsDomain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${anton.variable} ${jbMono.variable}`}>
      <body className="min-h-dvh bg-char text-ash antialiased">
        {children}
        {analyticsDomain && (
          <Script
            defer
            data-domain={analyticsDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
