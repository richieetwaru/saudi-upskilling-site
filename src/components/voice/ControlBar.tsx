'use client';

import { useRef } from 'react';
import { ArrowRight, X, Mic, MicOff } from 'lucide-react';
import { useVoiceSessionStore } from '@/lib/stores/voice-session-store';
import { playUISound, playGlassSound } from '@/utils/soundGenerator';

export function ControlBar() {
  const sessionState = useVoiceSessionStore((s) => s.sessionState);
  const isMuted = useVoiceSessionStore((s) => s.isMuted);
  const connect = useVoiceSessionStore((s) => s.connect);
  const disconnect = useVoiceSessionStore((s) => s.disconnect);
  const toggleMute = useVoiceSessionStore((s) => s.toggleMute);

  const isConnected = sessionState === 'connected';
  const isConnecting = sessionState === 'connecting';
  const isIdle = sessionState === 'idle' || sessionState === 'error';

  // Once connected, button stays at bottom forever (even after disconnect)
  const hasConnectedRef = useRef(false);
  if (isConnected || isConnecting) hasConnectedRef.current = true;

  const handleConnect = () => { playGlassSound(); connect(); };
  const handleDisconnect = () => { playUISound('off', 'avatar'); disconnect(); };
  const handleToggleMute = () => { playUISound(isMuted ? 'on' : 'off', 'mic'); toggleMute(); };

  const bottomOffset = (isIdle && !hasConnectedRef.current) ? 'bottom-[30vh]' : 'bottom-6';

  return (
    <div className={`fixed ${bottomOffset} left-0 right-0 z-[60] flex justify-center pointer-events-none transition-all duration-700 ease-out`}>
      {isIdle && (
        <button
          onClick={handleConnect}
          className="start-button inline-flex items-center gap-3 pointer-events-auto shadow-lg shadow-black/30"
        >
          START CONVERSATION
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {isConnecting && (
        <div className="start-button inline-flex items-center gap-3 pointer-events-auto opacity-80 connecting-pulse">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          CONNECTING
        </div>
      )}

      {isConnected && (
        <div className="inline-flex items-center gap-0 pointer-events-auto rounded-full shadow-lg shadow-black/30 overflow-hidden">
          {/* Listening / Muted indicator */}
          <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/10 px-5 py-3 rounded-l-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isMuted ? 'bg-red-500' : 'bg-[#C8962E]'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isMuted ? 'bg-red-500' : 'bg-[#C8962E]'}`} />
            </span>
            <span className="text-xs font-data text-white/80 uppercase tracking-widest">
              {isMuted ? 'Muted' : 'Listening'}
            </span>
          </div>

          {/* Mute toggle */}
          <button
            onClick={handleToggleMute}
            className={`px-3 py-3 transition-colors duration-200 border-y border-white/10 ${
              isMuted ? 'bg-red-600/30 text-red-400' : 'bg-white/5 text-white/70 hover:text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Disconnect */}
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
