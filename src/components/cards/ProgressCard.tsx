import React from 'react';

interface Milestone {
  label: string;
  reached?: boolean;
}

interface ProgressCardProps {
  title?: string;
  subtitle?: string;
  overallProgress?: number;
  currentPhase?: string;
  milestones?: Milestone[];
  streak?: number;
  hoursLogged?: number;
  onAction?: (phrase: string) => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title = 'Your Progress',
  subtitle,
  overallProgress = 0,
  currentPhase,
  milestones = [],
  streak,
  hoursLogged,
  onAction,
}) => {
  const pct = Math.min(100, Math.max(0, overallProgress));

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl" style={{ background: 'linear-gradient(135deg, #C8962E 0%, rgba(200,150,46,0.7) 100%)' }}>
      <div className="p-5 flex flex-col h-full">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="font-hero text-xl font-bold text-white">{title}</h3>
        {subtitle && <p className="font-voice text-sm mt-1 text-white/70">{subtitle}</p>}

        {/* Progress ring */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#fff" strokeWidth="3"
                strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-data text-xl font-bold text-white">{pct}%</span>
            </div>
          </div>
          <div>
            {currentPhase && (
              <div className="font-data text-xs text-white/60 uppercase">Current Phase</div>
            )}
            {currentPhase && (
              <div className="font-voice text-sm text-white font-bold">{currentPhase}</div>
            )}
            <div className="flex gap-3 mt-2">
              {streak != null && streak > 0 && (
                <div className="font-data text-xs text-white/80">🔥 {streak} day streak</div>
              )}
              {hoursLogged != null && hoursLogged > 0 && (
                <div className="font-data text-xs text-white/80">{hoursLogged}h logged</div>
              )}
            </div>
          </div>
        </div>

        {/* Milestones */}
        {milestones.length > 0 && (
          <div className="mt-4 space-y-2 flex-1">
            {milestones.slice(0, 5).map((m, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                  style={{ background: m.reached ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)', color: m.reached ? '#C8962E' : 'rgba(255,255,255,0.5)' }}
                >
                  {m.reached ? '✓' : ''}
                </div>
                <span className="font-voice text-xs" style={{ color: m.reached ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' }}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* View button */}
        <div className="flex justify-end mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <button
            onClick={() => onAction?.('View full progress')}
            className="rounded-full px-5 py-2 text-xs font-data font-bold uppercase tracking-wider"
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};
