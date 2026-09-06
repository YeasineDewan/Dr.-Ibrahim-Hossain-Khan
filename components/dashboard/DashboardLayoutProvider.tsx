'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { useDashboardStore } from '@/lib/dashboard/store';
import type { WidgetDefinition, WidgetConfig } from '@/lib/dashboard/types';
import { WIDGET_REGISTRY } from '@/lib/dashboard/registry';

interface DashboardContextValue {
  registerWidget: (def: WidgetDefinition) => void;
  getWidget: (id: string) => WidgetDefinition | undefined;
  updateWidgetConfig: (widgetId: string, config: Partial<WidgetConfig>) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboardContext() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardLayoutProvider');
  return ctx;
}

export function DashboardLayoutProvider({ children }: { children: React.ReactNode }) {
  const updateWidgetConfig = useDashboardStore((s) => s.updateWidgetConfig);
  const registerWidget = useCallback((def: WidgetDefinition) => {
    WIDGET_REGISTRY[def.id] = def;
  }, []);

  const getWidget = useCallback((id: string) => WIDGET_REGISTRY[id], []);

  return (
    <DashboardContext.Provider value={{ registerWidget, getWidget, updateWidgetConfig }}>
      {children}
    </DashboardContext.Provider>
  );
}
