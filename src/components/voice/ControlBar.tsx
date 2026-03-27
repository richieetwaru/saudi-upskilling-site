'use client';

import { Mic, MicOff, MessageCircle, X } from 'lucide-react';
import { useVoiceSessionStore } from '@/lib/stores/voice-session-store';
import { assets } from '@/assets';
import { playUISound, playGlassSound } from '@/utils/soundGenerator';

export function ControlBar() {
  const sessionState = useVoiceSessionStore((s) => s.sessionState);
  const isMuted = useVoiceSessionStore((s) => s.isMuted);
  const isChatPanelOpen = useVoiceSessionStore((s) => s.isChatPanelOpen);
  const connect = useVoiceSessionStore((s) => s.connect);
  const disconnect = useVoiceSessionStore((s) => s.disconnect);
  const toggleMute = useVoiceSessionStore((s) => s.toggleMute);
  const toggleChatPanel = useVoiceSessionStore((s) => s.toggleChatPanel);
  const avatarThumbnailUrl = useVoiceSessionStore((s) => s.avatarThumbnailUrl);

  const isConnected = sessionState === 'connected';
  const isConnecting = sessionState === 'connecting';
  const isIdle = sessionState === 'idle' || sessionState === 'error';

  const iconColor = 'text-white/70 hover:text-white';
  const iconBg = 'bg-white/10 hover:bg-white/20';

  const handleConnect = () => {
    playGlassSound();
    connect();
  };

  const handleToggleChat = () => {
    playUISound(isChatPanelOpen ? 'off' : 'on', 'chat');
    toggleChatPanel();
  };

  const handleToggleMute = () => {
    playUISound(isMuted ? 'on' : 'off', 'mic');
    toggleMute();
  };

  const handleDisconnect = () => {
    playUISound('off', 'avatar');
    disconnect();
  };

  const zIndex = isChatPanelOpen ? 'z-[100]' : 'z-[60]';

  return (
    <div className={`fixed top-4 right-4 md:top-6 md:right-8 ${zIndex} inline-flex items-center gap-2 sm:gap-3 transition-all duration-300 ease-in-out`}>

      {/* Mic toggle */}
      {isConnected && (
        <button
          onClick={handleToggleMute}
          className={`p-2 rounded-full transition-all duration-200 ${
            isMuted
              ? 'text-red-500 hover:text-red-400'
              : `${iconBg} ${iconColor}`
          }`}
          title={isMuted ? 'Unmute mic' : 'Mute mic'}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      )}

      {/* Connecting indicator */}
      {isConnecting && (
        <button
          disabled
          className="start-button inline-flex items-center gap-2 text-sm opacity-80 connecting-pulse"
        >
          CONNECTING...
        </button>
      )}

      {/* Disconnect */}
      {isConnected && (
        <button
          onClick={handleDisconnect}
          className="bg-red-600 text-white p-2.5 rounded-full hover:bg-red-500 transition-colors duration-300 shadow-lg shadow-red-600/30"
          title="Disconnect"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Avatar thumbnail */}
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
          isConnecting
            ? 'border-white/40 bg-white/5 animate-pulse'
            : isConnected
              ? 'border-white/60 shadow-lg'
              : 'border-white/30 shadow-lg'
        }`}
        onClick={isIdle ? handleConnect : undefined}
      >
        <img
          src={avatarThumbnailUrl || assets.avatarProfile}
          alt="Magic"
          className={`w-full h-full object-cover rounded-full transition-all duration-300 ${
            isIdle ? 'brightness-90 hover:brightness-100' :
            isConnecting ? '' : ''
          }`}
        />
      </div>
    </div>
  );
}
