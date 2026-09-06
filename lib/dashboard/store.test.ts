import { describe, it, expect, beforeEach } from 'vitest';
import { useDashboardStore } from './store';

describe('DashboardStore', () => {
  beforeEach(() => {
    useDashboardStore.setState({
      layout: {
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
    });
  });

  it('should initialize with default state', () => {
    const state = useDashboardStore.getState();
    expect(state.activeView).toBe('Dashboard');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should update widget position', () => {
    const { updateWidgetPosition, layout } = useDashboardStore.getState();
    const testLayout = {
      ...layout,
      widgets: [
        { id: 'widget-1', x: 0, y: 0, w: 2, h: 1, config: { refreshInterval: 30000, dateRange: { from: '', to: '' }, filters: {}, density: 'comfortable' as const, pinned: false } },
      ],
    };
    useDashboardStore.setState({ layout: testLayout });

    updateWidgetPosition('widget-1', 2, 1, 2, 1);
    const updated = useDashboardStore.getState().layout;
    expect(updated.widgets[0].x).toBe(2);
    expect(updated.widgets[0].y).toBe(1);
  });

  it('should add and remove sorts', () => {
    const { addSort, removeSort } = useDashboardStore.getState();

    addSort({ key: 'name', direction: 'asc', label: 'Name' });
    expect(useDashboardStore.getState().sorts).toHaveLength(1);
    expect(useDashboardStore.getState().sorts[0].key).toBe('name');

    addSort({ key: 'date', direction: 'desc', label: 'Date' });
    expect(useDashboardStore.getState().sorts).toHaveLength(2);

    removeSort('name');
    expect(useDashboardStore.getState().sorts).toHaveLength(1);
    expect(useDashboardStore.getState().sorts[0].key).toBe('date');
  });

  it('should add and remove saved views', () => {
    const { addSavedView, removeSavedView } = useDashboardStore.getState();

    const view = {
      id: 'view-1',
      name: 'Test View',
      filters: {},
      sorts: [],
      createdAt: new Date().toISOString(),
    };

    addSavedView(view);
    expect(useDashboardStore.getState().savedViews).toHaveLength(1);

    removeSavedView('view-1');
    expect(useDashboardStore.getState().savedViews).toHaveLength(0);
  });

  it('should update widget config', () => {
    const { updateWidgetConfig, layout } = useDashboardStore.getState();
    const testLayout = {
      ...layout,
      widgets: [
        { id: 'widget-1', x: 0, y: 0, w: 2, h: 1, config: { refreshInterval: 30000, dateRange: { from: '', to: '' }, filters: {}, density: 'comfortable' as const, pinned: false } },
      ],
    };
    useDashboardStore.setState({ layout: testLayout });

    updateWidgetConfig('widget-1', { refreshInterval: 60000 });
    const updated = useDashboardStore.getState().layout;
    expect(updated.widgets[0].config.refreshInterval).toBe(60000);
  });

  it('should reset layout', () => {
    const { resetLayout, layout } = useDashboardStore.getState();
    const testLayout = {
      ...layout,
      widgets: [
        { id: 'widget-1', x: 0, y: 0, w: 2, h: 1, config: { refreshInterval: 30000, dateRange: { from: '', to: '' }, filters: {}, density: 'comfortable' as const, pinned: false } },
      ],
    };
    useDashboardStore.setState({ layout: testLayout });

    resetLayout('custom');
    expect(useDashboardStore.getState().layout.widgets).toHaveLength(0);
  });

  it('should set loading and error states', () => {
    const { setLoading, setError } = useDashboardStore.getState();

    setLoading(true);
    expect(useDashboardStore.getState().isLoading).toBe(true);

    setError('Test error');
    expect(useDashboardStore.getState().error).toBe('Test error');

    setLoading(false);
    setError(null);
    expect(useDashboardStore.getState().isLoading).toBe(false);
    expect(useDashboardStore.getState().error).toBe(null);
  });
});
