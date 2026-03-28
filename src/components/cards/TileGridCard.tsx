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

export const TileGridCard: React.FC<TileGridCardProps> = ({
  title,
  subtitle,
  tiles: rawTiles = [],
  footer,
}) => {
  const tiles = rawTiles.map(parseTile);

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
                background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                border: `1px solid ${color}25`,
              }}
            >
              {/* Large icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                style={{ background: `${color}20` }}
              >
                {tile.icon || tile.label.charAt(0).toUpperCase()}
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
