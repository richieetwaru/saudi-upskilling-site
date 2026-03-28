import type { Metadata, Viewport } from 'next';
import './globals.css';
import { VoiceSessionProvider } from '@/components/voice/VoiceSessionProvider';
import { BackgroundLayer } from '@/components/voice/BackgroundLayer';
import { SceneLayout } from '@/components/voice/SceneLayout';
import { ControlBar } from '@/components/voice/ControlBar';
import { ChatPanel } from '@/components/voice/ChatPanel';

const siteName = 'Saudi Upskilling Intelligence';
const siteDescription =
  'AI-powered guidance to help candidates navigate upskilling opportunities across Saudi Arabia — aligned with Vision 2030.';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saudi-upskilling.mobeus.ai';

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [
    { name: 'ThoughtWorks' },
    { name: 'Mobeus AI' },
  ],
  keywords: [
    'Saudi Arabia',
    'upskilling',
    'Vision 2030',
    'workforce development',
    'career pathways',
    'training programs',
    'AI assistant',
    'Mobeus',
    'ThoughtWorks',
  ],
  creator: 'ThoughtWorks',
  publisher: 'Mobeus AI',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Saudi Upskilling Intelligence — Achieve Your Full Potential',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
  },
  metadataBase: new URL(siteUrl),
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1A3A4B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="screen-orientation" content="portrait" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <VoiceSessionProvider>
          <BackgroundLayer />
          <div id="scene-root" className="relative z-[2] lg:h-dvh">
            <SceneLayout>{children}</SceneLayout>
          </div>
          <ControlBar />
          <ChatPanel />
        </VoiceSessionProvider>
      </body>
    </html>
  );
}
