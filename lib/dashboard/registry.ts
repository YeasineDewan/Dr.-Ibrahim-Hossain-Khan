import type { WidgetDefinition, LayoutTemplate } from './types';

export const WIDGET_REGISTRY: Record<string, WidgetDefinition> = {};

export function registerWidget(def: WidgetDefinition) {
  WIDGET_REGISTRY[def.id] = def;
}

export function getWidget(id: string): WidgetDefinition | undefined {
  return WIDGET_REGISTRY[id];
}

export function getAllWidgets(): WidgetDefinition[] {
  return Object.values(WIDGET_REGISTRY);
}

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'clinical-focus',
    name: 'Clinical Focus',
    description: 'Emphasizes appointments, patients, and prescriptions',
    widgets: [
      { id: 'kpi-overview', x: 0, y: 0, w: 4, h: 1, config: {} },
      { id: 'appointments-today', x: 0, y: 1, w: 3, h: 2, config: {} },
      { id: 'patients-summary', x: 3, y: 1, w: 3, h: 2, config: {} },
      { id: 'prescriptions-pending', x: 0, y: 3, w: 4, h: 2, config: {} },
      { id: 'follow-ups', x: 4, y: 1, w: 2, h: 2, config: {} },
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Financials, inventory, and chamber management',
    widgets: [
      { id: 'kpi-overview', x: 0, y: 0, w: 4, h: 1, config: {} },
      { id: 'orders-summary', x: 0, y: 1, w: 2, h: 2, config: {} },
      { id: 'chambers-status', x: 2, y: 1, w: 2, h: 2, config: {} },
      { id: 'notifications', x: 4, y: 1, w: 2, h: 2, config: {} },
    ],
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Start from scratch',
    widgets: [],
  },
] as any;
