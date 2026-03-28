import React from 'react';

const C = 'var(--theme-chart-line)';
const getColor = (opacity: number) => `color-mix(in srgb, var(--theme-chart-line) ${opacity}%, transparent)`;

interface DataPoint {
  label: string;
  value: number;
}

interface SpotlightCardProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  tag?: string;
  points?: (DataPoint | string)[];
  caption?: string;
}

/** Parse a point that may arrive as string "label:value" or object */
function parsePoint(raw: DataPoint | string): DataPoint {
  if (typeof raw === 'object' && raw !== null && 'label' in raw) return raw;
  const str = String(raw);
  const sep = str.includes(';') ? ';' : ':';
  const parts = str.split(sep).map(s => s.trim());
  // Extract first number from value string (e.g. "34% YoY" → 34)
  const numMatch = parts[1]?.match(/[\d.]+/);
  return { label: parts[0] || '', value: numMatch ? parseFloat(numMatch[0]) : 0 };
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  title,
  subtitle,
  imageUrl,
  tag,
  points: rawPoints = [],
  caption,
}) => {
  const points = (rawPoints as (DataPoint | string)[]).map(parsePoint).filter(p => p.label);
  const maxVal = points.length > 0 ? Math.max(...points.map(p => p.value), 1) : 1;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top section: avatar/image + title */}
      <div className="flex items-center gap-3 mb-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || ''}
            className="w-12 h-12 rounded-full object-cover shrink-0"
            style={{ border: '2px solid rgba(255,255,255,0.15)' }}
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-data text-lg font-bold"
            style={{ background: 'rgba(200,150,46,0.2)', color: '#C8962E' }}
          >
            {(title || '?').charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {tag && (
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-data uppercase tracking-wider mb-1"
              style={{ background: 'rgba(200,150,46,0.15)', color: '#C8962E' }}
            >
              {tag}
            </span>
          )}
          {title && (
            <div className="font-data text-sm font-bold truncate" style={{ color: C }}>{title}</div>
          )}
          {subtitle && (
            <div className="font-voice text-xs truncate" style={{ color: getColor(55) }}>{subtitle}</div>
          )}
        </div>
      </div>

      {/* Chart area — SVG area chart */}
      {points.length > 0 && (
        <div className="flex-1 min-h-0 relative">
          <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="spotGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C8962E" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#C8962E" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[25, 50, 75].map(y => (
              <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            ))}

            {/* Area fill */}
            <path
              d={(() => {
                if (points.length < 2) return '';
                const step = 200 / (points.length - 1);
                let d = `M0,${100 - (points[0].value / maxVal) * 80}`;
                points.forEach((p, i) => {
                  if (i === 0) return;
                  d += ` L${i * step},${100 - (p.value / maxVal) * 80}`;
                });
                d += ` L200,100 L0,100 Z`;
                return d;
              })()}
              fill="url(#spotGrad)"
            />

            {/* Line */}
            <path
              d={(() => {
                if (points.length < 2) return '';
                const step = 200 / (points.length - 1);
                let d = `M0,${100 - (points[0].value / maxVal) * 80}`;
                points.forEach((p, i) => {
                  if (i === 0) return;
                  d += ` L${i * step},${100 - (p.value / maxVal) * 80}`;
                });
                return d;
              })()}
              fill="none"
              stroke="#C8962E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dots */}
            {points.map((p, i) => {
              const step = 200 / (points.length - 1);
              const x = i * step;
              const y = 100 - (p.value / maxVal) * 80;
              return <circle key={i} cx={x} cy={y} r="3" fill="#C8962E" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />;
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-1">
            {points.map((p, i) => (
              <span key={i} className="font-data text-[9px]" style={{ color: getColor(40) }}>
                {p.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Caption */}
      {caption && (
        <div className="font-voice text-xs mt-2" style={{ color: getColor(50) }}>
          {caption}
        </div>
      )}
    </div>
  );
};
