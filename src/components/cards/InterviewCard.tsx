import React from 'react';

interface Tip {
  text: string;
  type?: 'tip' | 'question' | 'warning';
}

interface InterviewCardProps {
  title: string;
  role?: string;
  difficulty?: string;
  tips?: Tip[];
  questions?: string[];
  description?: string;
  onAction?: (phrase: string) => void;
}

const TYPE_STYLES: Record<string, { bg: string; dot: string }> = {
  tip: { bg: 'rgba(200,150,46,0.08)', dot: '#C8962E' },
  question: { bg: 'rgba(26,58,75,0.3)', dot: '#60a5fa' },
  warning: { bg: 'rgba(239,68,68,0.08)', dot: '#ef4444' },
};

export const InterviewCard: React.FC<InterviewCardProps> = ({
  title,
  role,
  difficulty,
  tips = [],
  questions = [],
  description,
  onAction,
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Difficulty badge */}
      {difficulty && (
        <span
          className="self-start rounded-full px-3 py-1 text-[10px] font-data uppercase tracking-wider mb-3"
          style={{
            background: difficulty.toLowerCase() === 'easy' ? 'rgba(34,197,94,0.15)' :
              difficulty.toLowerCase() === 'hard' ? 'rgba(239,68,68,0.15)' : 'rgba(200,150,46,0.15)',
            color: difficulty.toLowerCase() === 'easy' ? '#22c55e' :
              difficulty.toLowerCase() === 'hard' ? '#ef4444' : '#C8962E',
          }}
        >
          {difficulty}
        </span>
      )}

      {/* Title */}
      <h3 className="font-hero text-lg font-bold text-white leading-tight">{title}</h3>

      {/* Role */}
      {role && (
        <div className="font-voice text-sm text-white/60 mt-1">{role}</div>
      )}

      {/* Description */}
      {description && (
        <p className="font-voice text-sm text-white/50 mt-2 leading-relaxed line-clamp-2">
          {description}
        </p>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <div className="mt-3 space-y-2 flex-1 min-h-0 overflow-auto">
          {tips.slice(0, 4).map((tip, i) => {
            const style = TYPE_STYLES[tip.type || 'tip'] || TYPE_STYLES.tip;
            return (
              <div
                key={i}
                className="rounded-lg p-2.5 flex items-start gap-2"
                style={{ background: style.bg }}
              >
                <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: style.dot }} />
                <span className="font-voice text-xs text-white/70 leading-relaxed">{tip.text}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Questions */}
      {questions.length > 0 && tips.length === 0 && (
        <div className="mt-3 space-y-2 flex-1 min-h-0 overflow-auto">
          {questions.slice(0, 4).map((q, i) => (
            <div
              key={i}
              className="rounded-lg p-2.5 flex items-start gap-2"
              style={{ background: 'rgba(26,58,75,0.3)' }}
            >
              <span className="font-data text-xs shrink-0 mt-0.5" style={{ color: '#C8962E' }}>Q{i + 1}</span>
              <span className="font-voice text-xs text-white/70 leading-relaxed">{q}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-0" />

      {/* Practice button */}
      <div className="flex justify-end mt-4 pt-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => onAction?.(`Practice interview for ${role || title}`)}
          className="rounded-full px-5 py-2 text-xs font-data font-bold uppercase tracking-wider transition-all duration-200 hover:brightness-110"
          style={{ background: '#1A3A4B', color: '#fff', border: '1px solid #C8962E' }}
        >
          Practice
        </button>
      </div>
    </div>
  );
};
