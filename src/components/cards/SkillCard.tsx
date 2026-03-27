import React from 'react';

interface SkillCardProps {
  name: string;
  level?: string;
  progress?: number;
  category?: string;
  demand?: string;
  description?: string;
  relatedJobs?: string[];
  onAction?: (phrase: string) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  name,
  level,
  progress = 0,
  category,
  demand,
  description,
  relatedJobs = [],
  onAction,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Category badge */}
      {category && (
        <span
          className="self-start rounded-full px-3 py-1 text-[10px] font-data uppercase tracking-wider mb-3"
          style={{ background: 'rgba(26,58,75,0.5)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {category}
        </span>
      )}

      {/* Skill name */}
      <h3 className="font-hero text-lg font-bold text-white leading-tight">{name}</h3>

      {/* Level + Demand */}
      {(level || demand) && (
        <div className="flex items-center gap-3 mt-2">
          {level && (
            <span className="font-data text-xs uppercase tracking-wider" style={{ color: '#C8962E' }}>
              {level}
            </span>
          )}
          {demand && (
            <span className="font-data text-xs text-white/50">
              {demand} demand
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      {progress > 0 && (
        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span className="font-data text-[10px] text-white/40 uppercase">Proficiency</span>
            <span className="font-data text-[10px]" style={{ color: '#C8962E' }}>{clampedProgress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${clampedProgress}%`, background: 'linear-gradient(90deg, #1A3A4B, #C8962E)' }}
            />
          </div>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="font-voice text-sm text-white/50 mt-3 leading-relaxed line-clamp-2">
          {description}
        </p>
      )}

      {/* Related jobs */}
      {relatedJobs.length > 0 && (
        <div className="mt-3">
          <span className="font-data text-[10px] text-white/40 uppercase tracking-wider">Related roles</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {relatedJobs.slice(0, 3).map((job, i) => (
              <span
                key={i}
                className="rounded-full px-2.5 py-0.5 text-[10px] font-voice"
                style={{ background: 'rgba(200,150,46,0.1)', color: '#C8962E', border: '1px solid rgba(200,150,46,0.2)' }}
              >
                {job}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1" />

      {/* Update button */}
      <div className="flex justify-end mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => onAction?.(`Update skill ${name}`)}
          className="rounded-full px-5 py-2 text-xs font-data font-bold uppercase tracking-wider transition-all duration-200 hover:brightness-110"
          style={{ background: '#1A3A4B', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          Update
        </button>
      </div>
    </div>
  );
};
