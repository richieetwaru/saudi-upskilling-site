'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { ArrowRight, X, Mic, MicOff, MessageCircle, Headphones, Send } from 'lucide-react';
import { useVoiceSessionStore } from '@/lib/stores/voice-session-store';
import { playUISound } from '@/utils/soundGenerator';

const BTN = 'w-11 h-11 flex items-center justify-center transition-colors duration-200';

export function ControlBar() {
  const sessionState = useVoiceSessionStore((s) => s.sessionState);
  const isMuted = useVoiceSessionStore((s) => s.isMuted);
  const chatMode = useVoiceSessionStore((s) => s.chatMode);
  const connect = useVoiceSessionStore((s) => s.connect);
  const disconnect = useVoiceSessionStore((s) => s.disconnect);
  const toggleMute = useVoiceSessionStore((s) => s.toggleMute);
  const toggleChatMode = useVoiceSessionStore((s) => s.toggleChatMode);
  const sendTextMessage = useVoiceSessionStore((s) => s.sendTextMessage);

  const [chatInput, setChatInput] = useState('');
  const [ready, setReady] = useState(false);

  const isConnected = sessionState === 'connected';
  const isConnecting = sessionState === 'connecting';
  const isIdle = sessionState === 'idle' || sessionState === 'error';

  // Delay showing the Start button by 1s so pre-warm can load
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const hasConnectedRef = useRef(false);
  if (isConnected || isConnecting) hasConnectedRef.current = true;

  const handleConnect = () => { connect(); };
  const handleDisconnect = () => { playUISound('off', 'avatar'); disconnect(); };
  const handleToggleMute = () => { playUISound(isMuted ? 'on' : 'off', 'mic'); toggleMute(); };
  const handleToggleChatMode = () => {
    playUISound(chatMode ? 'on' : 'off', 'chat');
    toggleChatMode();
  };

  const handleSendChat = useCallback(async () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput('');
    await sendTextMessage(text);
  }, [chatInput, sendTextMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  }, [handleSendChat]);

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[60] flex justify-center pointer-events-none transition-all duration-700 ease-out">
      {/* IDLE: Start button (delayed 1s for pre-warm) */}
      {isIdle && ready && (
        <button
          onClick={handleConnect}
          className="start-button inline-flex items-center gap-3 pointer-events-auto shadow-lg shadow-black/30"
        >
          START CONVERSATION
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* CONNECTING: Pulse indicator */}
      {isConnecting && (
        <div className="start-button inline-flex items-center gap-3 pointer-events-auto opacity-80 connecting-pulse">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          CONNECTING
        </div>
      )}

      {/* CONNECTED — VOICE MODE */}
      {isConnected && !chatMode && (
        <div className="inline-flex items-center gap-0 pointer-events-auto rounded-full shadow-lg shadow-black/30 overflow-hidden h-11">
          {/* Listening / Muted indicator */}
          <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/10 px-5 h-full rounded-l-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isMuted ? 'bg-red-500' : 'bg-[#C8962E]'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isMuted ? 'bg-red-500' : 'bg-[#C8962E]'}`} />
            </span>
            <span className="text-xs font-data text-white/80 uppercase tracking-widest">
              {isMuted ? 'Muted' : 'Listening'}
            </span>
          </div>

          {/* Mute toggle — 1:1 square */}
          <button
            onClick={handleToggleMute}
            className={`${BTN} border-y border-white/10 ${
              isMuted ? 'bg-red-600/30 text-red-400' : 'bg-white/5 text-white/70 hover:text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Chat mode toggle — 1:1 square */}
          <button
            onClick={handleToggleChatMode}
            className={`${BTN} border-y border-white/10 bg-white/5 text-white/70 hover:text-white`}
            title="Switch to chat"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          {/* Disconnect — 1:1 square */}
          <button
            onClick={handleDisconnect}
            className={`${BTN} bg-red-600/80 hover:bg-red-500 text-white rounded-r-full border border-red-500/30 border-l-0`}
            title="Disconnect"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CONNECTED — CHAT MODE */}
      {isConnected && chatMode && (
        <div className="inline-flex items-center gap-0 pointer-events-auto rounded-full shadow-lg shadow-black/30 overflow-hidden w-[90vw] max-w-md h-11">
          {/* Text input */}
          <div className="flex-1 flex items-center bg-white/8 backdrop-blur-sm border border-white/10 rounded-l-full overflow-hidden h-full">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-white text-sm px-5 h-full outline-none placeholder-white/40 font-data"
              autoFocus
            />
            {/* Send button — 1:1 square */}
            <button
              onClick={handleSendChat}
              disabled={!chatInput.trim()}
              className={`${BTN} ${
                chatInput.trim()
                  ? 'text-[#C8962E] hover:text-[#D4A843]'
                  : 'text-white/20'
              }`}
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Voice mode toggle — 1:1 square */}
          <button
            onClick={handleToggleChatMode}
            className={`${BTN} border-y border-white/10 bg-white/5 text-white/70 hover:text-white`}
            title="Switch to voice"
          >
            <Headphones className="w-4 h-4" />
          </button>

          {/* Disconnect — 1:1 square */}
          <button
            onClick={handleDisconnect}
            className={`${BTN} bg-red-600/80 hover:bg-red-500 text-white rounded-r-full border border-red-500/30 border-l-0`}
            title="Disconnect"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
