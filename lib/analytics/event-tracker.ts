export interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: string;
  userId?: string;
  sessionId: string;
  properties?: Record<string, any>;
}

type EventHandler = (event: AnalyticsEvent) => void;

class EventTracker {
  private handlers: EventHandler[] = [];
  private buffer: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private maxBufferSize = 50;

  constructor() {
    this.sessionId = crypto.randomUUID();
    this.startFlushInterval();
  }

  identify(userId: string) {
    this.userId = userId;
  }

  on(handler: EventHandler) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      category: properties?.category || 'general',
      label: properties?.label,
      value: properties?.value,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      properties: properties || {},
    };

    this.buffer.push(analyticsEvent);
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    }

    for (const handler of this.handlers) {
      try {
        handler(analyticsEvent);
      } catch {
        // ignore handler errors
      }
    }
  }

  page(path: string, title: string) {
    this.track('page_view', { category: 'navigation', label: path, properties: { title, path } });
  }

  feature(name: string, action: string) {
    this.track('feature_usage', { category: 'feature', label: `${name}:${action}` });
  }

  export(format: string, entity: string) {
    this.track('export', { category: 'data', label: `${entity}:${format}` });
  }

  search(query: string, results: number) {
    this.track('search', { category: 'search', label: query, value: results });
  }

  private flush() {
    if (this.buffer.length === 0) return;
    const events = [...this.buffer];
    this.buffer = [];
    console.log('[Analytics] Flushing events:', events.length);
  }

  private startFlushInterval() {
    this.flushInterval = setInterval(() => this.flush(), 5000);
  }

  destroy() {
    if (this.flushInterval) clearInterval(this.flushInterval);
    this.flush();
  }
}

export const analytics = new EventTracker();
