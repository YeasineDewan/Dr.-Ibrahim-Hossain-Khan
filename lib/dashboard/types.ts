export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface WidgetPermission {
  resource: string;
  action: 'read' | 'write' | 'admin';
}

export interface WidgetDefinition {
  id: string;
  title: string;
  titleBn?: string;
  component: React.ComponentType<WidgetProps>;
  defaultSize: WidgetSize;
  defaultGridArea?: { x: number; y: number; w: number; h: number };
  permissions?: WidgetPermission[];
  dataDependencies?: string[];
  refreshInterval?: number;
  configurable?: boolean;
  exportable?: boolean;
}

export interface WidgetProps {
  data: any;
  config: WidgetConfig;
  onAction?: (action: string, payload: any) => void;
  onDrillDown?: (filter: Record<string, any>) => void;
  onRefresh?: () => void;
  onExport?: (format: 'csv' | 'pdf' | 'png') => void;
  permissionDenied?: boolean;
}

export interface WidgetConfig {
  refreshInterval: number;
  dateRange: { from: string; to: string };
  filters: Record<string, any>;
  density: 'compact' | 'comfortable' | 'spacious';
  pinned: boolean;
}

export interface DashboardLayout {
  userId: string;
  widgets: {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    config: WidgetConfig;
  }[];
  updatedAt: string;
}

export interface LayoutTemplate {
  id: string;
  name: string;
  nameBn?: string;
  description: string;
  widgets: (Omit<DashboardLayout['widgets'][0], 'config'> & {
    config: Partial<WidgetConfig>;
  })[];
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
  label?: string;
}

export interface FilterConfig {
  id: string;
  type: 'text' | 'select' | 'multiselect' | 'range' | 'date' | 'boolean';
  key: string;
  label: string;
  labelBn?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
}

export interface SavedView {
  id: string;
  name: string;
  filters: Record<string, any>;
  sorts: SortConfig[];
  createdAt: string;
}
