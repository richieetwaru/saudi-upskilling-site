import React from 'react';

const C = 'var(--theme-chart-line)';
const getColor = (opacity: number) => `color-mix(in srgb, var(--theme-chart-line) ${opacity}%, transparent)`;

const BAR_COLORS = ['#C8962E', '#3B82F6', '#22C55E', '#A855F7', '#F59E0B', '#EC4899', '#06B6D4', '#F97316'];

interface Bar {
  label: string;
  value: number;
}

interface BarChartCardProps {
  title?: string;
  subtitle?: string;
  bars?: (Bar | string)[];
  unit?: string;
  footer?: string;
}

/** Parse a bar that may arrive as "label:value" string or object */
function parseBar(raw: Bar | string): Bar {
  if (typeof raw === 'object' && raw !== null && 'label' in raw) return raw;
  const str = String(raw);
  const sep = str.includes(';') ? ';' : ':';
  const parts = str.split(sep).map(s => s.trim());
  const numMatch = parts[1]?.match(/[\d.]+/);
  return { label: parts[0] || '', value: numMatch ? parseFloat(numMatch[0]) : 0 };
}

export const BarChartCard: React.FC<BarChartCardProps> = ({
  title,
  subtitle,
  bars: rawBars = [],
  unit = '',
  footer,
}) => {
  const bars = rawBars.map(parseBar).filter(b => b.label);
  const maxVal = bars.length > 0 ? Math.max(...bars.map(b => b.value), 1) : 1;

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

      {/* Bars */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-2.5">
        {bars.slice(0, 8).map((bar, i) => {
          const pct = Math.max(4, (bar.value / maxVal) * 100);
          const color = BAR_COLORS[i % BAR_COLORS.length];
          return (
            <div key={i}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-voice text-xs truncate" style={{ color: getColor(70), maxWidth: '60%' }}>
                  {bar.label}
                </span>
                <span className="font-data text-xs font-bold shrink-0" style={{ color }}>
                  {bar.value}{unit}
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}CC, ${color})` }}
                />
              </div>
            </div>
          );
        })}
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

export default BarChartCard;
