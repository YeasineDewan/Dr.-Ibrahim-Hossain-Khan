'use client';

import React, { memo } from 'react';
import type { WidgetProps } from '@/lib/dashboard/types';

export const NotificationsWidget = memo(function NotificationsWidget(props: WidgetProps<Record<string, unknown>>) {
  const { data } = props as { data: Record<string, any> };
  const items = data.items ?? [];
  const max = data.max ?? 8;

  if (items.length === 0) {
    return (
      <div style={{ color: '#647985', fontSize: 12, textAlign: 'center', padding: 16 }}>
        No notifications
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflow: 'auto', maxHeight: '100%' }}>
      {items.slice(0, max).map((item: any, i: number) => (
        <div
          key={item.id || i}
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            padding: '8px 10px',
            borderRadius: 8,
            background: item.read ? 'transparent' : 'rgba(59,130,246,0.04)',
            border: `1px solid ${item.read ? 'rgba(148,163,184,0.06)' : 'rgba(59,130,246,0.12)'}`,
          }}
        >
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: item.read ? '#cbd5e1' : '#3b82f6',
            marginTop: 6,
            flexShrink: 0,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: '#0f172a', lineHeight: 1.4, fontWeight: item.read ? 400 : 600 }}>
              {item.title}
            </div>
            <div style={{ fontSize: 11, color: '#647985', marginTop: 2, lineHeight: 1.4 }}>
              {item.body}
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
              {item.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
