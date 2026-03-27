'use client';

import { ArrowRight, X } from 'lucide-react';
import { useVoiceSessionStore } from '@/lib/stores/voice-session-store';
import { playUISound, playGlassSound } from '@/utils/soundGenerator';

/**
 * ControlBar — Bottom-centered horizontal pill.
 * The single control surface: connect, listening indicator, disconnect.
 */
export function ControlBar() {
  const sessionState = useVoiceSessionStore((s) => s.sessionState);
  const connect = useVoiceSessionStore((s) => s.connect);
  const disconnect = useVoiceSessionStore((s) => s.disconnect);

  const isConnected = sessionState === 'connected';
  const isConnecting = sessionState === 'connecting';
  const isIdle = sessionState === 'idle' || sessionState === 'error';

  const handleConnect = () => {
    playGlassSound();
    connect();
  };

  const handleDisconnect = () => {
    playUISound('off', 'avatar');
    disconnect();
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[60] flex justify-center pointer-events-none">
      {/* Idle: Connect pill */}
      {isIdle && (
        <button
          onClick={handleConnect}
          className="start-button inline-flex items-center gap-3 pointer-events-auto shadow-lg shadow-black/20"
        >
          START CONVERSATION
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Connecting: pulsing pill */}
      {isConnecting && (
        <div className="start-button inline-flex items-center gap-3 pointer-events-auto opacity-80 connecting-pulse">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          CONNECTING
        </div>
      )}

      {/* Connected: listening pill with disconnect */}
      {isConnected && (
        <div className="inline-flex items-center gap-0 pointer-events-auto rounded-full shadow-lg shadow-black/20 overflow-hidden">
          {/* Listening indicator */}
          <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/10 px-5 py-3 rounded-l-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8962E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C8962E]" />
            </span>
            <span className="text-xs font-data text-white/80 uppercase tracking-widest">
              Listening
            </span>
          </div>

          {/* Disconnect button */}
          <button
            onClick={handleDisconnect}
            className="bg-red-600/80 hover:bg-red-500 text-white px-4 py-3 rounded-r-full transition-colors duration-200 border border-red-500/30 border-l-0"
            title="Disconnect"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
