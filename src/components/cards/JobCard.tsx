import React from 'react';

interface JobCardProps {
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  type?: string;
  tags?: string[];
  description?: string;
  posted?: string;
  onAction?: (phrase: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  salary,
  type,
  tags = [],
  description,
  posted,
  onAction,
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Type badge */}
      {type && (
        <span
          className="self-start rounded-full px-3 py-1 text-[10px] font-data uppercase tracking-wider mb-3"
          style={{ background: 'rgba(200,150,46,0.15)', color: '#C8962E' }}
        >
          {type}
        </span>
      )}

      {/* Title */}
      <h3 className="font-hero text-lg font-bold text-white leading-tight">{title}</h3>

      {/* Company + Location */}
      {(company || location) && (
        <div className="flex items-center gap-2 mt-1.5 font-voice text-sm text-white/60">
          {company && <span>{company}</span>}
          {company && location && <span className="text-white/30">·</span>}
          {location && <span>{location}</span>}
        </div>
      )}

      {/* Salary */}
      {salary && (
        <div className="font-data text-base font-bold mt-3" style={{ color: '#C8962E' }}>
          {salary}
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="font-voice text-sm text-white/50 mt-3 leading-relaxed line-clamp-3">
          {description}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.slice(0, 4).map((tag, i) => (
            <span
              key={i}
              className="rounded-full px-2.5 py-0.5 text-[10px] font-data"
              style={{ background: 'rgba(26,58,75,0.4)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Posted + Apply */}
      <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {posted && (
          <span className="font-voice text-xs text-white/30">{posted}</span>
        )}
        <button
          onClick={() => onAction?.(`Apply for ${title}`)}
          className="rounded-full px-5 py-2 text-xs font-data font-bold uppercase tracking-wider transition-all duration-200 hover:brightness-110"
          style={{ background: '#C8962E', color: '#fff' }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};
