import { registerWidget } from '@/lib/dashboard/registry';
import { KPICardWidget, SparklineWidget, ActivityFeedWidget, DataTableWidget, PillListWidget, NotificationsWidget } from '@/components/dashboard/widgets';

export function registerDashboardWidgets() {
  registerWidget({
    id: 'kpi-overview',
    title: 'Key Metrics',
    component: KPICardWidget,
    defaultSize: 'large',
    defaultGridArea: { x: 0, y: 0, w: 4, h: 1 },
    dataDependencies: ['appointments', 'patients', 'orders', 'followUps'],
    refreshInterval: 30000,
    configurable: true,
  });

  registerWidget({
    id: 'appointments-today',
    title: 'Today\'s Appointments',
    component: DataTableWidget,
    defaultSize: 'medium',
    defaultGridArea: { x: 0, y: 1, w: 3, h: 2 },
    dataDependencies: ['appointments'],
    refreshInterval: 15000,
    configurable: true,
    exportable: true,
  });

  registerWidget({
    id: 'patients-summary',
    title: 'Recent Patients',
    component: DataTableWidget,
    defaultSize: 'medium',
    defaultGridArea: { x: 3, y: 1, w: 3, h: 2 },
    dataDependencies: ['patients'],
    refreshInterval: 60000,
    configurable: true,
  });

  registerWidget({
    id: 'prescriptions-pending',
    title: 'Pending Prescriptions',
    component: PillListWidget,
    defaultSize: 'medium',
    defaultGridArea: { x: 0, y: 3, w: 4, h: 2 },
    dataDependencies: ['prescriptions'],
    refreshInterval: 30000,
    configurable: true,
  });

  registerWidget({
    id: 'follow-ups',
    title: 'Follow-ups',
    component: DataTableWidget,
    defaultSize: 'medium',
    defaultGridArea: { x: 4, y: 1, w: 2, h: 2 },
    dataDependencies: ['followUps'],
    refreshInterval: 30000,
    configurable: true,
  });

  registerWidget({
    id: 'notifications',
    title: 'Notifications',
    component: NotificationsWidget,
    defaultSize: 'medium',
    defaultGridArea: { x: 4, y: 1, w: 2, h: 2 },
    dataDependencies: ['notifications'],
    refreshInterval: 10000,
    configurable: false,
  });

  registerWidget({
    id: 'activity-feed',
    title: 'Activity Feed',
    component: ActivityFeedWidget,
    defaultSize: 'medium',
    defaultGridArea: { x: 4, y: 3, w: 2, h: 2 },
    dataDependencies: ['activityLog'],
    refreshInterval: 20000,
    configurable: false,
  });
}
