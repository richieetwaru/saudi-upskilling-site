'use client';

import { useVoiceSessionStore } from '@/lib/stores/voice-session-store';
import { ArrowRight } from 'lucide-react';

export function WelcomeLanding() {
  const connect = useVoiceSessionStore((s) => s.connect);
  const sessionState = useVoiceSessionStore((s) => s.sessionState);

  const isConnecting = sessionState === 'connecting';

  return (
    <div className="min-h-dvh lg:h-dvh lg:overflow-hidden grid grid-rows-[auto_1fr_auto] p-4 md:p-6 lg:p-8">
      {/* Header — spacer */}
      <header className="flex items-center" />

      {/* Content — centered on mobile, left-aligned on desktop */}
      <main className="flex items-center justify-center lg:justify-start">
        <div className="max-w-2xl space-y-6 text-center lg:text-left">
          {/* Badge pill */}
          <div
            className="animate-slide-in-left"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-data tracking-[0.15em] text-white/80 uppercase backdrop-blur-sm border border-white/20">
              SAUDI UPSKILLING INTELLIGENCE
            </span>
          </div>

          {/* Title */}
          <h1
            className="animate-slide-in-left font-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-white"
            style={{ animationDelay: '0.25s' }}
          >
            Achieve Your{' '}
            <span className="text-[#C8962E]">
              Full Potential
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-slide-in-left text-base sm:text-lg md:text-xl text-white/60 max-w-lg mx-auto lg:mx-0"
            style={{ animationDelay: '0.4s' }}
          >
            AI-powered guidance to help candidates navigate upskilling opportunities across Saudi Arabia
          </p>

          {/* START CONVERSATION button */}
          <div
            className="animate-slide-in-left"
            style={{ animationDelay: '0.55s' }}
          >
            <button
              onClick={connect}
              disabled={isConnecting}
              className="start-button inline-flex items-center gap-3 disabled:opacity-60"
            >
              {isConnecting ? 'CONNECTING...' : 'START CONVERSATION'}
              {!isConnecting && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between text-[10px] sm:text-xs font-data text-white/40 uppercase tracking-widest">
        <span>BUILT BY THOUGHTWORKS</span>
        <span>POWERED BY MOBEUS TELEGLASS</span>
      </footer>
    </div>
  );
}
