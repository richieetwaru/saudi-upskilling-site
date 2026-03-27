import React from 'react';

interface SkillScore {
  name: string;
  score: number;
  max?: number;
}

interface AssessmentCardProps {
  title?: string;
  subtitle?: string;
  overallScore?: number;
  skills?: SkillScore[];
  recommendation?: string;
  onAction?: (phrase: string) => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  title = 'Skill Assessment',
  subtitle,
  overallScore = 0,
  skills = [],
  recommendation,
  onAction,
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(200,150,46,0.15) 0%, rgba(200,150,46,0.05) 100%)', border: '1px solid rgba(200,150,46,0.2)' }}>
      <div className="p-5 flex flex-col h-full">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#C8962E' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="font-hero text-xl font-bold text-white">{title}</h3>
        {subtitle && <p className="font-voice text-sm mt-1 text-white/60">{subtitle}</p>}

        {/* Overall score ring */}
        {overallScore > 0 && (
          <div className="flex items-center gap-4 mt-4">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#C8962E" strokeWidth="3"
                  strokeDasharray={`${overallScore} ${100 - overallScore}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-data text-lg font-bold text-white">{overallScore}%</span>
              </div>
            </div>
            <div>
              <div className="font-data text-xs text-white/50 uppercase">Overall Score</div>
              <div className="font-voice text-sm text-white/80">
                {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : overallScore >= 40 ? 'Developing' : 'Getting Started'}
              </div>
            </div>
          </div>
        )}

        {/* Skill bars */}
        {skills.length > 0 && (
          <div className="mt-4 space-y-2.5 flex-1">
            {skills.slice(0, 5).map((skill, i) => {
              const pct = Math.min(100, Math.max(0, (skill.score / (skill.max || 100)) * 100));
              return (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="font-voice text-xs text-white/70">{skill.name}</span>
                    <span className="font-data text-xs" style={{ color: '#C8962E' }}>{skill.score}/{skill.max || 100}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #1A3A4B, #C8962E)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recommendation */}
        {recommendation && (
          <p className="font-voice text-xs text-white/50 mt-3">{recommendation}</p>
        )}

        {/* Button */}
        <div className="flex justify-end mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => onAction?.('Start assessment')}
            className="rounded-full px-5 py-2 text-xs font-data font-bold uppercase tracking-wider"
            style={{ background: '#C8962E', color: '#fff' }}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};
