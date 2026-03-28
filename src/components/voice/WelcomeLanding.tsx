'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useVoiceSessionStore } from '@/lib/stores/voice-session-store';

const WELCOME_CARDS = [
  {
    style: 'glass',
    title: 'Saudi Upskilling Intelligence',
    body: 'AI-powered guidance to help you navigate career opportunities across Saudi Arabia, aligned with Vision 2030.',
  },
  {
    style: 'gold',
    title: '340+ Programs Available',
    body: 'From Saudi Digital Academy to Tuwaiq — free bootcamps, certifications, and on-the-job training across 6 key sectors.',
  },
  {
    style: 'glass',
    title: 'Your AI Career Coach',
    body: 'Magic guides you through skills assessment, job matching, interview prep, and offer management — all by voice.',
  },
  {
    style: 'white',
    title: 'How It Works',
    body: 'Tap Start Conversation to connect with Magic. Describe your goals, and get personalized recommendations instantly.',
  },
  {
    style: 'glass',
    title: 'Vision 2030 Aligned',
    body: 'Focused on technology, healthcare, finance, energy, and tourism — the sectors driving Saudi Arabia\'s transformation.',
  },
];

export function WelcomeLanding() {
  const sessionState = useVoiceSessionStore((s) => s.sessionState);
  const isConnecting = sessionState === 'connecting';
  const isConnected = sessionState === 'connected';
  const isActive = isConnecting || isConnected;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIdx(Math.min(idx, WELCOME_CARDS.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (isActive) return null;

  return (
    <div className="fixed inset-0 z-[2] flex flex-col overflow-hidden">
      {/* Top spacer — 30% keeps face visible */}
      <div style={{ minHeight: '28%', flex: '1 1 auto' }} />

      {/* Horizontal snap carousel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide shrink-0"
        style={{ height: '48%' }}
      >
        {WELCOME_CARDS.map((card, i) => (
          <div
            key={i}
            className="snap-start shrink-0 px-4 flex items-stretch"
            style={{ width: '100%', minWidth: '100%' }}
          >
            <div
              className="flex-1 rounded-xl p-5 flex flex-col overflow-hidden"
              style={
                card.style === 'white'
                  ? { background: 'rgba(255,255,255,0.92)', color: '#1A3A4B' }
                  : card.style === 'gold'
                    ? { background: 'linear-gradient(135deg, rgba(200,150,46,0.2) 0%, rgba(200,150,46,0.05) 100%)', border: '1px solid rgba(200,150,46,0.25)', color: '#fff' }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(2px)', color: '#fff' }
              }
            >
              <div className="flex-1">
                <h3
                  className="font-hero text-xl font-bold leading-tight"
                  style={{ color: card.style === 'white' ? '#1A3A4B' : '#fff' }}
                >
                  {card.title}
                </h3>
                <p
                  className="font-voice text-sm mt-3 leading-relaxed"
                  style={{ color: card.style === 'white' ? '#5A6B75' : 'rgba(255,255,255,0.6)' }}
                >
                  {card.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 py-3 shrink-0">
        {WELCOME_CARDS.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIdx ? 20 : 8,
              height: 8,
              background: i === activeIdx ? '#C8962E' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      {/* Bottom spacer for control bar */}
      <div className="h-16 shrink-0" />
    </div>
  );
}
