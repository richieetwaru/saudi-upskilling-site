import React from 'react';

const C = 'var(--theme-chart-line)';
const getColor = (opacity: number) => `color-mix(in srgb, var(--theme-chart-line) ${opacity}%, transparent)`;

const TILE_COLORS = ['#C8962E', '#1A3A4B', '#C8962E', '#1A3A4B', '#C8962E', '#1A3A4B'];

interface Tile {
  label: string;
  value?: string;
  icon?: string;
}

interface TileGridCardProps {
  title?: string;
  subtitle?: string;
  tiles?: Tile[];
  footer?: string;
}

export const TileGridCard: React.FC<TileGridCardProps> = ({
  title,
  subtitle,
  tiles = [],
  footer,
}) => {
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
              className="rounded-lg p-3 flex flex-col justify-between"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Icon or color dot */}
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold mb-2"
                style={{ background: `${color}20`, color }}
              >
                {tile.icon || tile.label.charAt(0)}
              </div>
              <div>
                {tile.value && (
                  <div className="font-data text-base font-bold leading-tight" style={{ color: C }}>
                    {tile.value}
                  </div>
                )}
                <div className="font-voice text-xs leading-tight mt-0.5" style={{ color: getColor(65) }}>
                  {tile.label}
                </div>
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
