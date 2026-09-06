'use client';

import React, { useMemo } from 'react';

interface ChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export function BarChart({ data, color = '#0d9488', height = 200 }: ChartProps) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ width: '100%', height, display: 'flex', alignItems: 'flex-end', gap: 4, padding: '8px 0' }}>
      {data.map((d, i) => {
        const h = max > 0 ? (d.value / max) * 100 : 0;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div
              style={{
                width: '100%',
                height: `${h}%`,
                minHeight: 2,
                background: color,
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.3s ease',
              }}
            />
            <span style={{ fontSize: 10, color: '#647985' }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

interface LineChartProps {
  values: number[];
  labels?: string[];
  color?: string;
  height?: number;
}

export function LineChart({ values, labels, color = '#0d9488', height = 200 }: LineChartProps) {
  const points = useMemo(() => {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    return values.map((v, i) => ({
      x: labels ? i : (i / (values.length - 1)) * 100,
      y: 100 - ((v - min) / range) * 100,
      value: v,
      label: labels?.[i] ?? '',
    }));
  }, [values, labels]);

  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    const w = 100;
    const h = 100;
    const stepX = w / (points.length - 1);
    let d = `M ${points[0].x * stepX / w * 100} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const x = (points[i].x * stepX / w) * 100;
      const y = points[i].y;
      d += ` L ${x} ${y}`;
    }
    return d;
  }, [points]);

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathD} L 100 100 L 0 100 Z`}
          fill={`url(#gradient-${color.replace('#', '')})`}
        />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={(p.x / (values.length - 1 || 1)) * 100}
            cy={p.y}
            r="2"
            fill={color}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {labels && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          {labels.map((l, i) => (
            <span key={i} style={{ fontSize: 10, color: '#647985' }}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function DonutChart({ value, total, label, color = '#0d9488' }: { value: number; total: number; label: string; color?: string }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: 100, height: 100 }}>
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{value}</span>
          <span style={{ fontSize: 10, color: '#647985' }}>of {total}</span>
        </div>
      </div>
      <span style={{ fontSize: 12, color: '#334155', fontWeight: 500 }}>{label}</span>
    </div>
  );
}
