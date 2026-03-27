'use client';

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

  if (isActive) return null;

  return (
    <div className="min-h-dvh lg:h-dvh lg:overflow-hidden flex flex-col">
      {/* Spacer for top */}
      <div className="flex-1 min-h-[30%]" />

      {/* Static welcome carousel */}
      <div
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide shrink-0"
        style={{ height: '50vh' }}
      >
        {WELCOME_CARDS.map((card, i) => (
          <div
            key={i}
            className="snap-start shrink-0 px-4"
            style={{ width: '100vw', height: '50vh' }}
          >
            <div
              className="h-full rounded-xl p-5 flex flex-col overflow-hidden"
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
      <div className="flex items-center justify-center gap-2 py-2 shrink-0">
        {WELCOME_CARDS.map((_, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: i === 0 ? 20 : 8,
              height: 8,
              background: i === 0 ? '#C8962E' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      {/* Spacer for bottom control bar */}
      <div className="h-16" />
    </div>
  );
}
