'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ResponseCardProps {
  text?: string;
  avatar?: string;
  live?: boolean;
  isStreaming?: boolean;
}

/**
 * ResponseCard — Displays the agent's spoken text response.
 * Each new character fades in with a subtle animation so it looks like streaming.
 */
export const ResponseCard: React.FC<ResponseCardProps> = ({
  text = '',
  avatar,
  live = false,
  isStreaming = false,
}) => {
  // Track how many characters have been "revealed" so new ones animate in
  const [revealedLen, setRevealedLen] = useState(0);
  const prevTextRef = useRef(text);

  useEffect(() => {
    if (text.length > prevTextRef.current.length) {
      // Text grew — the new chars will animate
      setRevealedLen(prevTextRef.current.length);
      // After animation, mark all as revealed
      const timer = setTimeout(() => setRevealedLen(text.length), 400);
      prevTextRef.current = text;
      return () => clearTimeout(timer);
    }
    if (text !== prevTextRef.current) {
      // Text changed entirely (new response)
      setRevealedLen(0);
      const timer = setTimeout(() => setRevealedLen(text.length), 400);
      prevTextRef.current = text;
      return () => clearTimeout(timer);
    }
  }, [text]);

  // Split into already-revealed and newly-arriving portions
  const revealed = text.slice(0, revealedLen);
  const incoming = text.slice(revealedLen);

  return (
    <div className="flex flex-col h-full p-5 gap-4">
      {/* Avatar + label */}
      <div className="flex items-center gap-3">
        {avatar && (
          <img
            src={avatar}
            alt="Magic"
            className="w-10 h-10 rounded-full object-cover border border-white/20"
          />
        )}
        <span
          className="text-xs font-data uppercase tracking-widest"
          style={{ color: 'var(--theme-accent, #D4A843)' }}
        >
          Magic
        </span>
      </div>

      {/* Streaming response text */}
      <p className="text-white text-lg leading-relaxed flex-1 font-voice">
        {revealed}
        {incoming && (
          <span
            className="response-stream-in"
            style={{
              animation: 'response-fade-in 0.35s ease-out forwards',
            }}
          >
            {incoming}
          </span>
        )}
      </p>

      {/* Swipe hint — only after streaming completes */}
      {!isStreaming && text.length > 0 && (
        <div
          className="mt-auto pt-3 border-t border-white/10"
          style={{ animation: 'fadeIn 0.5s ease both' }}
        >
          <span className="text-white/40 text-xs font-data uppercase tracking-wider">
            Swipe for details →
          </span>
        </div>
      )}
    </div>
  );
};

export default ResponseCard;
