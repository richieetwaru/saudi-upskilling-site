'use client';

import { useVoiceSessionStore } from '@/lib/stores/voice-session-store';

export function WelcomeLanding() {
  const sessionState = useVoiceSessionStore((s) => s.sessionState);
  const isConnecting = sessionState === 'connecting';
  const isConnected = sessionState === 'connected';
  const isActive = isConnecting || isConnected;

  return (
    <div className="min-h-dvh lg:h-dvh lg:overflow-hidden flex flex-col p-4 md:p-6 lg:p-8">
      {/* Top spacer */}
      <div className="flex-1 min-h-[25%]" />

      {/* Content — only show when idle (not connected) */}
      {!isActive && (
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
        </div>
      )}

      {/* Spacer for bottom control bar */}
      <div className="flex-1" />
    </div>
  );
}
