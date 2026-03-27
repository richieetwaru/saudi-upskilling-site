'use client';

import { useVoiceSessionStore } from '@/lib/stores/voice-session-store';
import { ArrowRight } from 'lucide-react';

export function WelcomeLanding() {
  const connect = useVoiceSessionStore((s) => s.connect);
  const sessionState = useVoiceSessionStore((s) => s.sessionState);

  const isConnecting = sessionState === 'connecting';
  const isConnected = sessionState === 'connected';
  const isActive = isConnecting || isConnected;

  return (
    <div className="min-h-dvh lg:h-dvh lg:overflow-hidden flex flex-col p-4 md:p-6 lg:p-8">
      {/* Top spacer */}
      <div className={isActive ? 'flex-1' : 'flex-1 min-h-[25%]'} />

      {/* Content — switches between idle CTA and connected state */}
      {!isActive ? (
        /* ── IDLE: Welcome CTA ── */
        <div className="space-y-5 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
          <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
            <span className="inline-block rounded-full bg-white/10 px-5 py-2 text-xs font-data tracking-[0.15em] text-white/80 uppercase backdrop-blur-sm border border-white/15">
              SAUDI UPSKILLING INTELLIGENCE
            </span>
          </div>

          <h1
            className="animate-slide-in-left font-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1] tracking-tight text-white"
            style={{ animationDelay: '0.25s' }}
          >
            Achieve Your{' '}
            <span className="text-[#C8962E]">Full Potential</span>
          </h1>

          <p
            className="animate-slide-in-left text-sm sm:text-base md:text-lg text-white/50 max-w-md mx-auto lg:mx-0 leading-relaxed"
            style={{ animationDelay: '0.4s' }}
          >
            AI-powered guidance to help candidates navigate upskilling opportunities across Saudi Arabia
          </p>

          <div className="animate-slide-in-left" style={{ animationDelay: '0.55s' }}>
            <button
              onClick={connect}
              className="start-button inline-flex items-center gap-3"
            >
              START CONVERSATION
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ── CONNECTED: Listening state — minimal, avatar is the focus ── */
        <div className="text-center space-y-3 pb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 backdrop-blur-sm border border-white/10 px-4 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8962E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C8962E]" />
            </span>
            <span className="text-xs font-data text-white/70 uppercase tracking-widest">
              {isConnecting ? 'Connecting' : 'Listening'}
            </span>
          </div>

          <p className="text-sm text-white/40 font-voice">
            Ask Magic anything about upskilling in Saudi Arabia
          </p>
        </div>
      )}

      {/* Bottom spacer */}
      <div className="h-6 lg:h-10" />

      {/* Footer */}
      <footer className="flex items-center justify-between text-[10px] sm:text-xs font-data text-white/30 uppercase tracking-widest shrink-0">
        <span>BUILT BY THOUGHTWORKS</span>
        <span>POWERED BY MOBEUS TELEGLASS</span>
      </footer>
    </div>
  );
}
