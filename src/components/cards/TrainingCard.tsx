import React from 'react';

interface TrainingCardProps {
  title: string;
  provider?: string;
  duration?: string;
  format?: string;
  cost?: string;
  level?: string;
  description?: string;
  modules?: string[] | string;
  certificate?: boolean;
  onAction?: (phrase: string) => void;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({
  title,
  provider,
  duration,
  format,
  cost,
  level,
  description,
  modules: rawModules = [],
  certificate,
  onAction,
}) => {
  const modules: string[] = Array.isArray(rawModules)
    ? rawModules
    : typeof rawModules === 'string'
      ? rawModules.split(/[;,]/).map(t => t.trim()).filter(Boolean)
      : [];
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Format + Level badges */}
      <div className="flex items-center gap-2 mb-3">
        {format && (
          <span
            className="rounded-full px-3 py-1 text-[10px] font-data uppercase tracking-wider"
            style={{ background: 'rgba(200,150,46,0.15)', color: '#C8962E' }}
          >
            {format}
          </span>
        )}
        {level && (
          <span
            className="rounded-full px-3 py-1 text-[10px] font-data uppercase tracking-wider"
            style={{ background: 'rgba(26,58,75,0.5)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {level}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-hero text-lg font-bold text-white leading-tight">{title}</h3>

      {/* Provider */}
      {provider && (
        <div className="font-voice text-sm text-white/60 mt-1">{provider}</div>
      )}

      {/* Meta row: duration, cost, certificate */}
      <div className="flex items-center gap-4 mt-3">
        {duration && (
          <div>
            <div className="font-data text-[10px] text-white/40 uppercase">Duration</div>
            <div className="font-data text-sm text-white/90">{duration}</div>
          </div>
        )}
        {cost && (
          <div>
            <div className="font-data text-[10px] text-white/40 uppercase">Cost</div>
            <div className="font-data text-sm" style={{ color: cost.toLowerCase() === 'free' ? '#22c55e' : '#C8962E' }}>{cost}</div>
          </div>
        )}
        {certificate && (
          <div>
            <div className="font-data text-[10px] text-white/40 uppercase">Certificate</div>
            <div className="font-data text-sm text-white/90">Yes</div>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="font-voice text-sm text-white/50 mt-3 leading-relaxed line-clamp-2">
          {description}
        </p>
      )}

      {/* Modules */}
      {modules.length > 0 && (
        <div className="mt-3 space-y-1">
          {modules.slice(0, 4).map((mod, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#C8962E' }} />
              <span className="font-voice text-xs text-white/60">{mod}</span>
            </div>
          ))}
          {modules.length > 4 && (
            <span className="font-data text-[10px] text-white/30">+{modules.length - 4} more modules</span>
          )}
        </div>
      )}

      <div className="flex-1" />

      {/* Start button */}
      <div className="flex justify-end mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => onAction?.(`Start training ${title}`)}
          className="rounded-full px-5 py-2 text-xs font-data font-bold uppercase tracking-wider transition-all duration-200 hover:brightness-110"
          style={{ background: '#C8962E', color: '#fff' }}
        >
          Start
        </button>
      </div>
    </div>
  );
};
