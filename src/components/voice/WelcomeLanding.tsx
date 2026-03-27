'use client';

import { useVoiceSessionStore } from '@/lib/stores/voice-session-store';
import { ArrowRight } from 'lucide-react';

export function WelcomeLanding() {
  const connect = useVoiceSessionStore((s) => s.connect);
  const sessionState = useVoiceSessionStore((s) => s.sessionState);

  const isConnecting = sessionState === 'connecting';

  return (
    <div className="min-h-dvh lg:h-dvh lg:overflow-hidden flex flex-col p-4 md:p-6 lg:p-8">
      {/* Top spacer — keeps content in the bottom portion (portrait layout) */}
      <div className="flex-1 min-h-[40%]" />

      {/* Content — centered on mobile, left-aligned on desktop */}
      <div className="space-y-5 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
        {/* Badge pill */}
        <div
          className="animate-slide-in-left"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="inline-block rounded-full bg-white/10 px-5 py-2 text-xs font-data tracking-[0.15em] text-white/80 uppercase backdrop-blur-sm border border-white/15">
            SAUDI UPSKILLING INTELLIGENCE
          </span>
        </div>

        {/* Title */}
        <h1
          className="animate-slide-in-left font-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1] tracking-tight text-white"
          style={{ animationDelay: '0.25s' }}
        >
          Achieve Your{' '}
          <span className="text-[#C8962E]">Full Potential</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-slide-in-left text-sm sm:text-base md:text-lg text-white/50 max-w-md mx-auto lg:mx-0 leading-relaxed"
          style={{ animationDelay: '0.4s' }}
        >
          AI-powered guidance to help candidates navigate upskilling opportunities across Saudi Arabia
        </p>

        {/* CTA pill button */}
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

      {/* Bottom spacer */}
      <div className="h-8 lg:h-12" />

      {/* Footer */}
      <footer className="flex items-center justify-between text-[10px] sm:text-xs font-data text-white/30 uppercase tracking-widest shrink-0">
        <span>BUILT BY THOUGHTWORKS</span>
        <span>POWERED BY MOBEUS TELEGLASS</span>
      </footer>
    </div>
  );
}
