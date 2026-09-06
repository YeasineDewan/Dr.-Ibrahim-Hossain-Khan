import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { WidgetConfig, DashboardLayout, SortConfig, SavedView } from './types';

const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  refreshInterval: 30000,
  dateRange: { from: '', to: '' },
  filters: {},
  density: 'comfortable',
  pinned: false,
};

const STORAGE_KEY = 'dashboard-layout-v1';

function loadLayout(): DashboardLayout | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLayout(layout: DashboardLayout) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
}

export interface DashboardState {
  layout: DashboardLayout | null;
  activeView: string;
  savedViews: SavedView[];
  globalFilters: Record<string, any>;
  sorts: SortConfig[];
  isLoading: boolean;
  error: string | null;

  setLayout: (layout: DashboardLayout) => void;
  updateWidgetPosition: (widgetId: string, x: number, y: number, w: number, h: number) => void;
  updateWidgetConfig: (widgetId: string, config: Partial<WidgetConfig>) => void;
  resetLayout: (templateId?: string) => void;
  setActiveView: (view: string) => void;
  setGlobalFilters: (filters: Record<string, any>) => void;
  setSorts: (sorts: SortConfig[]) => void;
  addSort: (sort: SortConfig) => void;
  removeSort: (key: string) => void;
  addSavedView: (view: SavedView) => void;
  removeSavedView: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      layout: loadLayout() ?? {
        userId: 'current',
        widgets: [],
        updatedAt: new Date().toISOString(),
      },
      activeView: 'Dashboard',
      savedViews: [],
      globalFilters: {},
      sorts: [],
      isLoading: false,
      error: null,

      setLayout: (layout) => {
        saveLayout(layout);
        set({ layout });
      },

      updateWidgetPosition: (widgetId, x, y, w, h) => {
        const layout = get().layout;
        if (!layout) return;
        const updated = {
          ...layout,
          widgets: layout.widgets.map((item) =>
            item.id === widgetId ? { ...item, x, y, w, h } : item
          ),
          updatedAt: new Date().toISOString(),
        };
        saveLayout(updated);
        set({ layout: updated });
      },

      updateWidgetConfig: (widgetId, config) => {
        const layout = get().layout;
        if (!layout) return;
        const updated = {
          ...layout,
          widgets: layout.widgets.map((w) =>
            w.id === widgetId ? { ...w, config: { ...w.config, ...config } } : w
          ),
          updatedAt: new Date().toISOString(),
        };
        saveLayout(updated);
        set({ layout: updated });
      },

      resetLayout: (templateId) => {
        const layout: DashboardLayout = {
          userId: 'current',
          widgets: [],
          updatedAt: new Date().toISOString(),
        };
        saveLayout(layout);
        set({ layout });
      },

      setActiveView: (activeView) => set({ activeView }),

      setGlobalFilters: (globalFilters) => set({ globalFilters }),

      setSorts: (sorts) => set({ sorts }),

      addSort: (sort) => {
        const existing = get().sorts.find((s) => s.key === sort.key);
        let newSorts: SortConfig[];
        if (existing) {
          newSorts = get().sorts.map((s) =>
            s.key === sort.key ? sort : s
          );
        } else {
          newSorts = [...get().sorts, sort];
        }
        set({ sorts: newSorts });
      },

      removeSort: (key) => {
        set({ sorts: get().sorts.filter((s) => s.key !== key) });
      },

      addSavedView: (view) => {
        set({ savedViews: [...get().savedViews, view] });
      },

      removeSavedView: (id) => {
        set({ savedViews: get().savedViews.filter((v) => v.id !== id) });
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    { name: 'dashboard-store' }
  )
);
