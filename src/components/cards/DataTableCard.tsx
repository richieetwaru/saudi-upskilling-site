import React from 'react';

const C = 'var(--theme-chart-line)';
const getColor = (opacity: number) => `color-mix(in srgb, var(--theme-chart-line) ${opacity}%, transparent)`;

interface HeaderStat {
  label: string;
  value: string;
  change?: string;
}

interface Row {
  cells: string[];
}

interface DataTableCardProps {
  title?: string;
  headerStats?: HeaderStat[];
  columns?: string[];
  rows?: Row[];
  footer?: string;
}

export const DataTableCard: React.FC<DataTableCardProps> = ({
  title,
  headerStats = [],
  columns = [],
  rows = [],
  footer,
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header stat area */}
      {headerStats.length > 0 && (
        <div
          className="rounded-lg p-3 mb-3 flex items-center gap-4"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {headerStats.map((stat, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="font-data text-lg font-bold" style={{ color: C }}>{stat.value}</div>
              <div className="font-voice text-xs mt-0.5" style={{ color: getColor(60) }}>{stat.label}</div>
              {stat.change && (
                <div className="font-data text-xs mt-0.5" style={{ color: stat.change.startsWith('-') ? '#ef4444' : '#22c55e' }}>
                  {stat.change}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Title */}
      {title && (
        <h3 className="font-data text-sm uppercase tracking-[0.12em] mb-2" style={{ color: getColor(90) }}>
          {title}
        </h3>
      )}

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full">
          {columns.length > 0 && (
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="font-data text-xs uppercase tracking-wider text-left pb-2 pr-3"
                    style={{ color: getColor(50), borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {(row.cells || []).map((cell, ci) => (
                  <td
                    key={ci}
                    className="font-voice text-sm py-2 pr-3"
                    style={{
                      color: ci === 0 ? C : getColor(75),
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {footer && (
        <div className="font-voice text-xs mt-2 pt-2" style={{ color: getColor(50), borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {footer}
        </div>
      )}
    </div>
  );
};
