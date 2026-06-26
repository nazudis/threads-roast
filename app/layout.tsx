import type { Metadata, Viewport } from "next";
import { Anton, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

const SITE_URL = "https://gosong.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "GOSONG — Roast Threads lo sampai gosong 🔥",
  description:
    "Ketik username Threads lo, dapet sertifikat roast yang savage tapi sayang. Gratis, tanpa login. Screenshot & post balik.",
  openGraph: {
    title: "GOSONG — Roast Threads lo sampai gosong 🔥",
    description: "Roast vibe Threads lo jadi kartu kece. Gratis, tanpa login.",
    url: SITE_URL,
    siteName: "GOSONG",
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#17110F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // prevent zoom jank inside the Threads in-app browser
};

// Cloudflare Web Analytics: set NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN to
// the token from Cloudflare Dashboard → Analytics & Logs → Web Analytics.
const cloudflareAnalyticsToken =
  process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${anton.variable} ${jbMono.variable}`}>
      <body className="min-h-dvh bg-char text-ash antialiased">
        {children}
        {cloudflareAnalyticsToken && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: cloudflareAnalyticsToken })}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
