import React from 'react';

const C = 'var(--theme-chart-line)';
const getColor = (opacity: number) => `color-mix(in srgb, var(--theme-chart-line) ${opacity}%, transparent)`;

const TILE_COLORS = ['#C8962E', '#3B82F6', '#22C55E', '#A855F7', '#F59E0B', '#EC4899'];

interface Tile {
  label: string;
  value?: string;
  icon?: string;
}

interface TileGridCardProps {
  title?: string;
  subtitle?: string;
  tiles?: (Tile | string)[];
  footer?: string;
}

/** Parse a tile that may arrive as a raw string "label:value:icon" or ";"-separated */
function parseTile(raw: Tile | string): Tile {
  if (typeof raw === 'object' && raw !== null && 'label' in raw) return raw;
  const str = String(raw);
  // Try colon-separated first (DSL format), then semicolon
  const sep = str.includes(';') ? ';' : ':';
  const parts = str.split(sep).map(s => s.trim());
  return {
    label: parts[0] || '',
    value: parts[1] && parts[1] !== '—' && parts[1] !== '-' ? parts[1] : undefined,
    icon: parts[2] && parts[2] !== '—' && parts[2] !== '-' ? parts[2] : undefined,
  };
}

/* ── SVG line icon factory ── */
const svg = (c: string, d: React.ReactNode) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

/* Keyword → line icon. Matched against the LABEL, not the emoji. */
const ICON_KEYWORDS: [string[], (c: string) => React.ReactNode][] = [
  // Technology / tech / IT / digital / computer / software
  [['tech', 'digital', 'software', 'computer', 'it '],
    (c) => svg(c, <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/><line x1="9" y1="17" x2="9" y2="20"/><line x1="15" y1="17" x2="15" y2="20"/></>)],
  // Healthcare / health / medical
  [['health', 'medical'],
    (c) => svg(c, <><path d="M12 2L2 7v15h20V7L12 2z"/><path d="M12 8v8"/><path d="M8 12h8"/></>)],
  // Finance / financial / banking
  [['financ', 'banking', 'bank'],
    (c) => svg(c, <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>)],
  // Energy / power / oil / gas
  [['energy', 'power', 'oil', 'gas'],
    (c) => svg(c, <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>)],
  // Tourism / entertainment / travel / hospitality
  [['tourism', 'entertainment', 'travel', 'hospitality'],
    (c) => svg(c, <><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>)],
  // Jobs / positions / career / open
  [['job', 'position', 'career', 'open'],
    (c) => svg(c, <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="2" y1="13" x2="22" y2="13"/></>)],
  // Skills / skill / demand / competenc
  [['skill', 'demand', 'competenc'],
    (c) => svg(c, <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>)],
  // Salary / pay / compensation / SAR
  [['salary', 'pay', 'compensation', 'sar', 'wage'],
    (c) => svg(c, <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>)],
  // Training / program / course / learn
  [['training', 'program', 'course', 'learn'],
    (c) => svg(c, <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>)],
  // Education / academic / university
  [['education', 'academic', 'universit', 'degree'],
    (c) => svg(c, <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></>)],
  // Target / goal / free / available
  [['target', 'goal', 'free', 'available'],
    (c) => svg(c, <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>)],
  // Construction / building / infrastructure
  [['construct', 'building', 'infrastructure'],
    (c) => svg(c, <><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 22v-4h6v4"/></>)],
  // Security / cyber / shield
  [['security', 'cyber', 'shield'],
    (c) => svg(c, <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>)],
];

/** Resolve label → SVG line icon. Ignores the emoji icon field entirely. */
function resolveIcon(label: string, color: string): React.ReactNode {
  const lower = label.toLowerCase();
  for (const [keywords, render] of ICON_KEYWORDS) {
    if (keywords.some(kw => lower.includes(kw))) return render(color);
  }
  // Fallback: styled letter initial
  return <span className="text-lg font-bold" style={{ color }}>{label.charAt(0).toUpperCase()}</span>;
}

export const TileGridCard: React.FC<TileGridCardProps> = ({
  title,
  subtitle,
  tiles: rawTiles = [],
  footer,
}) => {
  const tiles = rawTiles.map(parseTile).filter(t => t.label.length > 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Title area */}
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

      {/* Tile grid */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-2 auto-rows-fr">
        {tiles.slice(0, 6).map((tile, i) => {
          const color = TILE_COLORS[i % TILE_COLORS.length];
          return (
            <div
              key={i}
              className="rounded-xl p-4 flex flex-col justify-between"
              role="listitem"
              aria-label={`${tile.label}${tile.value ? `, ${tile.value}` : ''}`}
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              {/* Line icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{
                  background: `${color}18`,
                  border: `1px solid ${color}30`,
                }}
                aria-hidden="true"
              >
                {resolveIcon(tile.label, color)}
              </div>

              {/* Label + value */}
              <div>
                <div className="font-hero text-sm font-semibold leading-tight" style={{ color: C }}>
                  {tile.label}
                </div>
                {tile.value && (
                  <div className="font-data text-xs font-bold mt-1" style={{ color }}>
                    {tile.value}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer text */}
      {footer && (
        <div className="font-voice text-xs mt-2 pt-2" style={{ color: getColor(50), borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {footer}
        </div>
      )}
    </div>
  );
};
