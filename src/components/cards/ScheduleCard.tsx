import React from 'react';

interface ScheduleCardProps {
  title: string;
  company?: string;
  date?: string;
  time?: string;
  format?: string;
  interviewer?: string;
  prepTips?: string[];
  location?: string;
  onAction?: (phrase: string) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  title,
  company,
  date,
  time,
  format,
  interviewer,
  prepTips = [],
  location,
  onAction,
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl" style={{ background: 'rgba(26,58,75,0.9)', border: '1px solid rgba(255,255,255,0.12)' }}>
      <div className="p-5 flex flex-col h-full">
        {/* Calendar icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8962E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="font-hero text-lg font-bold text-white">{title}</h3>
        {company && <div className="font-voice text-sm text-white/60 mt-1">{company}</div>}

        {/* Date/Time block */}
        {(date || time) && (
          <div className="mt-4 rounded-lg p-3 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {date && (
              <div>
                <div className="font-data text-[10px] text-white/40 uppercase">Date</div>
                <div className="font-data text-sm text-white font-bold">{date}</div>
              </div>
            )}
            {time && (
              <div>
                <div className="font-data text-[10px] text-white/40 uppercase">Time</div>
                <div className="font-data text-sm text-white font-bold">{time}</div>
              </div>
            )}
            {format && (
              <div>
                <div className="font-data text-[10px] text-white/40 uppercase">Format</div>
                <div className="font-data text-sm" style={{ color: '#C8962E' }}>{format}</div>
              </div>
            )}
          </div>
        )}

        {/* Interviewer + Location */}
        {(interviewer || location) && (
          <div className="mt-3 space-y-1.5">
            {interviewer && (
              <div className="flex items-center gap-2">
                <span className="font-data text-[10px] text-white/40 uppercase w-20">Interviewer</span>
                <span className="font-voice text-sm text-white/80">{interviewer}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <span className="font-data text-[10px] text-white/40 uppercase w-20">Location</span>
                <span className="font-voice text-sm text-white/80">{location}</span>
              </div>
            )}
          </div>
        )}

        {/* Prep tips */}
        {prepTips.length > 0 && (
          <div className="mt-3 flex-1">
            <div className="font-data text-[10px] text-white/40 uppercase mb-1.5">Quick Prep</div>
            {prepTips.slice(0, 3).map((tip, i) => (
              <div key={i} className="flex items-start gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: '#C8962E' }} />
                <span className="font-voice text-xs text-white/60">{tip}</span>
              </div>
            ))}
          </div>
        )}

        {/* Confirm button */}
        <div className="flex justify-end mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => onAction?.(`Confirm interview for ${title}`)}
            className="rounded-full px-5 py-2 text-xs font-data font-bold uppercase tracking-wider"
            style={{ background: '#1A3A4B', color: '#fff', border: '1px solid #C8962E' }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
