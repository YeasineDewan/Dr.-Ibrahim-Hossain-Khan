'use client';

import React, { useMemo } from 'react';
import type { WidgetProps } from '@/lib/dashboard/types';

export function KPICardWidget({ data, config }: WidgetProps) {
  const value = data.value ?? 0;
  const delta = data.delta ?? 0;
  const label = data.label ?? 'KPI';
  const trend = data.trend ?? [];
  const tone = data.tone ?? 'teal';

  const toneColors: Record<string, { positive: string; negative: string; bg: string }> = {
    teal: { positive: '#0d9488', negative: '#ef4444', bg: 'rgba(20,184,166,0.08)' },
    blue: { positive: '#2563eb', negative: '#ef4444', bg: 'rgba(59,130,246,0.08)' },
    gold: { positive: '#d97706', negative: '#ef4444', bg: 'rgba(245,158,11,0.08)' },
    coral: { positive: '#e77761', negative: '#ef4444', bg: 'rgba(244,114,182,0.08)' },
  };

  const colors = toneColors[tone] || toneColors.teal;
  const isPositive = delta >= 0;

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      background: colors.bg,
      border: `1px solid ${colors.bg}`,
    }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#647985', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          {label}
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1.2, marginTop: 4 }}>
          {value.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: isPositive ? colors.positive : colors.negative, marginTop: 2, fontWeight: 500 }}>
          {isPositive ? '↑' : '↓'} {Math.abs(delta)}%
        </div>
      </div>
      {trend.length > 0 && (
        <svg width="100%" height={40} viewBox={`0 0 ${trend.length * 8} 40`} preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={colors.positive}
            strokeWidth="2"
            points={trend.map((v: number, i: number) => `${i * 8},${40 - (v / 100) * 40}`).join(' ')}
          />
        </svg>
      )}
    </div>
  );
}

export function SparklineWidget({ data }: WidgetProps) {
  const values = data.values ?? [];
  const color = data.color ?? '#0d9488';

  if (values.length === 0) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((v: number, i: number) => `${(i / (values.length - 1)) * 100},${100 - ((v - min) / range) * 100}`)
    .join(' ');

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      <polyline fill="none" stroke={color} strokeWidth="3" points={points} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function ActivityFeedWidget({ data }: WidgetProps) {
  const items = data.items ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto', maxHeight: '100%' }}>
      {items.length === 0 && (
        <div style={{ color: '#647985', fontSize: 12, textAlign: 'center', padding: 16 }}>No recent activity</div>
      )}
      {items.map((item: Record<string, any>, i: number) => (
        <div key={i} style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          padding: '8px 0',
          borderBottom: i < items.length - 1 ? '1px solid rgba(148,163,184,0.08)' : 'none',
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(20,184,166,0.1)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#0d9488',
            flexShrink: 0,
          }}>
            {(item.user ?? '?')[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: '#0f172a', lineHeight: 1.4 }}>
              <strong>{item.user}</strong> {item.action}
            </div>
            <div style={{ fontSize: 11, color: '#647985', marginTop: 2 }}>
              {item.target} · {item.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
