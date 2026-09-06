'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardContext } from './DashboardLayoutProvider';
import { useDashboardStore } from '@/lib/dashboard/store';
import type { WidgetProps } from '@/lib/dashboard/types';

function WidgetSkeleton() {
  return (
    <div className="widget-skeleton" style={{
      height: '100%',
      minHeight: 120,
      borderRadius: 12,
      background: 'linear-gradient(90deg, rgba(148,163,184,0.06) 25%, rgba(148,163,184,0.12) 50%, rgba(148,163,184,0.06) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }} />
  );
}

function WidgetError({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="widget-error" style={{
      height: '100%',
      minHeight: 120,
      borderRadius: 12,
      border: '1px solid rgba(239,68,68,0.2)',
      background: 'rgba(239,68,68,0.04)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 16,
    }}>
      <span style={{ color: '#ef4444', fontSize: 12, fontWeight: 600 }}>Failed to load widget</span>
      <span style={{ color: '#647985', fontSize: 11 }}>{error}</span>
      {onRetry && (
        <button onClick={onRetry} style={{
          marginTop: 4,
          padding: '4px 12px',
          borderRadius: 6,
          border: '1px solid rgba(239,68,68,0.3)',
          background: 'transparent',
          color: '#ef4444',
          fontSize: 11,
          cursor: 'pointer',
        }}>
          Retry
        </button>
      )}
    </div>
  );
}

export function WidgetRenderer({
  widgetId,
  data,
  permissionDenied = false,
}: {
  widgetId: string;
  data?: any;
  permissionDenied?: boolean;
}) {
  const { getWidget } = useDashboardContext();
  const updateWidgetConfig = useDashboardStore((s) => s.updateWidgetConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const definition = getWidget(widgetId);
  const config = definition ? (data?.config ?? { refreshInterval: 30000, dateRange: { from: '', to: '' }, filters: {}, density: 'comfortable', pinned: false }) : undefined;

  useEffect(() => {
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [widgetId, data]);

  if (permissionDenied) {
    return (
      <div style={{
        height: '100%',
        minHeight: 120,
        borderRadius: 12,
        border: '1px dashed rgba(100,121,133,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#647985',
        fontSize: 12,
      }}>
        Insufficient permissions
      </div>
    );
  }

  if (!definition) {
    return (
      <div style={{
        height: '100%',
        minHeight: 120,
        borderRadius: 12,
        border: '1px dashed rgba(100,121,133,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#647985',
        fontSize: 12,
      }}>
        Unknown widget: {widgetId}
      </div>
    );
  }

  if (loading) return <WidgetSkeleton />;
  if (error) return <WidgetError error={error} onRetry={() => { setError(null); setLoading(true); }} />;

  const WidgetComponent = definition.component;
  const widgetData = data ?? {};

  return (
    <div className="widget-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <WidgetComponent
        data={widgetData}
        config={config}
        onAction={(action: string, payload: any) => {
          updateWidgetConfig(widgetId, { filters: { ...config.filters, [action]: payload } });
        }}
        onDrillDown={(filter: Record<string, any>) => {
          console.log('[Widget] Drill down:', widgetId, filter);
        }}
        onRefresh={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 500);
        }}
        onExport={(format: 'csv' | 'pdf' | 'png') => {
          console.log('[Widget] Export:', widgetId, format);
        }}
      />
    </div>
  );
}
