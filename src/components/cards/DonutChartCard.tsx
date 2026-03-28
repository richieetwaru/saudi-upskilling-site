import React from 'react';

const C = 'var(--theme-chart-line)';
const getColor = (opacity: number) => `color-mix(in srgb, var(--theme-chart-line) ${opacity}%, transparent)`;

const DONUT_COLORS = ['#C8962E', '#3B82F6', '#22C55E', '#A855F7', '#F59E0B', '#EC4899', '#06B6D4', '#F97316'];

interface Segment {
  label: string;
  value: number;
}

interface DonutChartCardProps {
  title?: string;
  subtitle?: string;
  segments?: (Segment | string)[];
  centerLabel?: string;
  centerValue?: string;
  footer?: string;
}

/** Parse a segment that may arrive as "label:value" string or object */
function parseSegment(raw: Segment | string): Segment {
  if (typeof raw === 'object' && raw !== null && 'label' in raw) return raw;
  const str = String(raw);
  const sep = str.includes(';') ? ';' : ':';
  const parts = str.split(sep).map(s => s.trim());
  const numMatch = parts[1]?.match(/[\d.]+/);
  return { label: parts[0] || '', value: numMatch ? parseFloat(numMatch[0]) : 0 };
}

export const DonutChartCard: React.FC<DonutChartCardProps> = ({
  title,
  subtitle,
  segments: rawSegments = [],
  centerLabel,
  centerValue,
  footer,
}) => {
  const segments = rawSegments.map(parseSegment).filter(s => s.label && s.value > 0);
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  // Build SVG donut arcs
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  const arcs = segments.slice(0, 8).map((seg, i) => {
    const pct = seg.value / total;
    const dashLength = pct * circumference;
    const dashGap = circumference - dashLength;
    const offset = -cumulativeOffset * circumference;
    cumulativeOffset += pct;
    return {
      ...seg,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
      dashArray: `${dashLength} ${dashGap}`,
      dashOffset: offset,
    };
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Title */}
      {title && (
        <h3 className="font-data text-sm uppercase tracking-[0.12em] mb-1" style={{ color: getColor(90) }}>
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="font-voice text-xs mb-3 leading-relaxed" style={{ color: getColor(55) }}>
          {subtitle}
        </p>
      )}

      {/* Donut + Legend */}
      <div className="flex-1 min-h-0 flex items-center gap-4">
        {/* SVG Donut */}
        <div className="shrink-0" style={{ width: '45%', maxWidth: 160 }}>
          <svg viewBox="0 0 100 100" className="w-full">
            {/* Background ring */}
            <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />

            {/* Segment arcs */}
            {arcs.map((arc, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth="12"
                strokeDasharray={arc.dashArray}
                strokeDashoffset={arc.dashOffset}
                strokeLinecap="round"
                className="transition-all duration-700"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            ))}

            {/* Center text */}
            {(centerValue || centerLabel) && (
              <>
                {centerValue && (
                  <text x="50" y={centerLabel ? "46" : "52"} textAnchor="middle" dominantBaseline="middle"
                    className="font-data" style={{ fill: C, fontSize: '14px', fontWeight: 700 }}>
                    {centerValue}
                  </text>
                )}
                {centerLabel && (
                  <text x="50" y={centerValue ? "60" : "52"} textAnchor="middle" dominantBaseline="middle"
                    className="font-voice" style={{ fill: getColor(50), fontSize: '7px' }}>
                    {centerLabel}
                  </text>
                )}
              </>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          {arcs.map((arc, i) => {
            const pct = Math.round((arc.value / total) * 100);
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: arc.color }} />
                <span className="font-voice text-xs truncate flex-1" style={{ color: getColor(70) }}>
                  {arc.label}
                </span>
                <span className="font-data text-[10px] font-bold shrink-0" style={{ color: arc.color }}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {footer && (
        <div className="font-voice text-xs mt-2 pt-2 shrink-0" style={{ color: getColor(50), borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default DonutChartCard;
