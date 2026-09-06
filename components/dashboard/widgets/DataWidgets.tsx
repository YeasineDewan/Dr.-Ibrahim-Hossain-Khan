'use client';

import React, { useState, useMemo } from 'react';
import type { WidgetProps } from '@/lib/dashboard/types';

export function DataTableWidget({ data, onAction, config }: WidgetProps) {
  const columns = data.columns ?? [];
  const rows = data.rows ?? [];
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = rows;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((row: any) =>
        columns.some((col: any) => String(row[col.key] ?? '').toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      result = [...result].sort((a: any, b: any) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (av === bv) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [rows, columns, search, sortKey, sortDir]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (rows.length === 0) {
    return (
      <div style={{ color: '#647985', fontSize: 12, textAlign: 'center', padding: 24 }}>
        No data available
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', minHeight: 0 }}>
      {config?.filters?.showSearch !== false && (
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid rgba(148,163,184,0.2)',
            background: 'rgba(15,23,42,0.02)',
            fontSize: 12,
            color: '#0f172a',
            outline: 'none',
          }}
        />
      )}
      <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              {columns.map((col: any) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 6px',
                    borderBottom: '1px solid rgba(148,163,184,0.12)',
                    color: '#647985',
                    fontWeight: 600,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '.04em',
                    cursor: 'pointer',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                  {sortKey === col.key && <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row: any, i: number) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
                {columns.map((col: any) => (
                  <td key={col.key} style={{ padding: '6px 6px', color: '#0f172a' }}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11, color: '#647985', textAlign: 'right' }}>
        {filtered.length} of {rows.length} rows
      </div>
    </div>
  );
}

export function PillListWidget({ data }: WidgetProps) {
  const items = data.items ?? [];
  const max = data.max ?? 10;
  const tone = data.tone ?? 'teal';

  const toneMap: Record<string, { bg: string; text: string; border: string }> = {
    teal: { bg: 'rgba(20,184,166,0.1)', text: '#0f766e', border: 'rgba(20,184,166,0.2)' },
    blue: { bg: 'rgba(59,130,246,0.1)', text: '#1d4ed8', border: 'rgba(59,130,246,0.2)' },
    gold: { bg: 'rgba(245,158,11,0.1)', text: '#b45309', border: 'rgba(245,158,11,0.2)' },
    coral: { bg: 'rgba(236,72,153,0.1)', text: '#be185d', border: 'rgba(236,72,153,0.2)' },
  };

  const colors = toneMap[tone] || toneMap.teal;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {items.slice(0, max).map((item: any, i: number) => (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 10px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 500,
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
          }}
        >
          {item.label}
          {item.count !== undefined && <span style={{ opacity: 0.8 }}>({item.count})</span>}
        </span>
      ))}
      {items.length > max && (
        <span style={{ fontSize: 11, color: '#647985', alignSelf: 'center' }}>
          +{items.length - max} more
        </span>
      )}
    </div>
  );
}
