import React from 'react';

interface CoachCardProps {
  title?: string;
  message: string;
  tip?: string;
  encouragement?: string;
  nextAction?: string;
  onAction?: (phrase: string) => void;
}

export const CoachCard: React.FC<CoachCardProps> = ({
  title = 'Coach Tip',
  message,
  tip,
  encouragement,
  nextAction,
  onAction,
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl" style={{ background: 'rgba(90,107,117,0.15)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="p-5 flex flex-col h-full">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8962E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="font-hero text-lg font-bold text-white">{title}</h3>

        {/* Message */}
        <p className="font-voice text-sm text-white/70 mt-3 leading-relaxed">{message}</p>

        {/* Tip box */}
        {tip && (
          <div className="mt-4 rounded-lg p-3" style={{ background: 'rgba(200,150,46,0.08)', border: '1px solid rgba(200,150,46,0.15)' }}>
            <div className="flex items-start gap-2">
              <span className="font-data text-xs shrink-0 mt-0.5" style={{ color: '#C8962E' }}>TIP</span>
              <span className="font-voice text-xs text-white/70 leading-relaxed">{tip}</span>
            </div>
          </div>
        )}

        {/* Encouragement */}
        {encouragement && (
          <div className="mt-3 font-voice text-sm italic" style={{ color: '#C8962E' }}>
            "{encouragement}"
          </div>
        )}

        <div className="flex-1" />

        {/* Next action */}
        {nextAction && (
          <div className="flex justify-end mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => onAction?.(nextAction)}
              className="rounded-full px-5 py-2 text-xs font-data font-bold uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
