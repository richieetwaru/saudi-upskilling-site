import React from 'react';

interface OfferCardProps {
  title: string;
  company?: string;
  salary?: string;
  startDate?: string;
  status?: string;
  benefits?: string[];
  hrdfFunding?: boolean;
  deadline?: string;
  onAction?: (phrase: string) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  title,
  company,
  salary,
  startDate,
  status = 'Pending',
  benefits: rawBenefits = [],
  hrdfFunding,
  deadline,
  onAction,
}) => {
  const benefits: string[] = Array.isArray(rawBenefits)
    ? rawBenefits
    : typeof rawBenefits === 'string'
      ? rawBenefits.split(/[;,]/).map(t => t.trim()).filter(Boolean)
      : [];
  const statusColor = status.toLowerCase() === 'approved' ? '#22c55e' :
    status.toLowerCase() === 'pending' ? '#C8962E' : '#5A6B75';

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl" style={{ background: 'rgba(255,255,255,0.95)', color: '#1A3A4B' }}>
      <div className="p-5 flex flex-col h-full">
        {/* Status badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#1A3A4B' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8962E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <span
            className="rounded-full px-3 py-1 text-[10px] font-data uppercase tracking-wider font-bold"
            style={{ background: `${statusColor}20`, color: statusColor }}
          >
            {status}
          </span>
        </div>

        {/* Title + Company */}
        <h3 className="font-hero text-xl font-bold" style={{ color: '#1A3A4B' }}>{title}</h3>
        {company && <div className="font-voice text-sm mt-1" style={{ color: '#5A6B75' }}>{company}</div>}

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {salary && (
            <div>
              <div className="font-data text-[10px] uppercase" style={{ color: '#5A6B75' }}>Salary</div>
              <div className="font-data text-sm font-bold" style={{ color: '#C8962E' }}>{salary}</div>
            </div>
          )}
          {startDate && (
            <div>
              <div className="font-data text-[10px] uppercase" style={{ color: '#5A6B75' }}>Start Date</div>
              <div className="font-data text-sm" style={{ color: '#1A3A4B' }}>{startDate}</div>
            </div>
          )}
        </div>

        {/* HRDF Funding */}
        {hrdfFunding && (
          <div className="mt-3 rounded-lg p-2.5 flex items-center gap-2" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <span className="text-sm">✓</span>
            <span className="font-voice text-xs" style={{ color: '#22c55e' }}>HRDF Funding Approved</span>
          </div>
        )}

        {/* Benefits */}
        {benefits.length > 0 && (
          <div className="mt-3 space-y-1.5 flex-1">
            {benefits.slice(0, 4).map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8962E' }} />
                <span className="font-voice text-xs" style={{ color: '#5A6B75' }}>{b}</span>
              </div>
            ))}
          </div>
        )}

        {deadline && (
          <div className="font-data text-xs mt-3" style={{ color: '#C8962E' }}>Respond by: {deadline}</div>
        )}

        {/* Accept button */}
        <div className="flex justify-end mt-4 pt-3" style={{ borderTop: '1px solid #E0E0E0' }}>
          <button
            onClick={() => onAction?.(`Accept offer for ${title}`)}
            className="rounded-full px-5 py-2 text-xs font-data font-bold uppercase tracking-wider"
            style={{ background: '#22c55e', color: '#fff' }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
