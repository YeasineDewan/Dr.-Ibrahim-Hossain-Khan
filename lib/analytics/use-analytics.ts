'use client';

import { useCallback } from 'react';
import { analytics } from './event-tracker';

export function useAnalytics() {
  const track = useCallback((event: string, properties?: Record<string, any>) => {
    analytics.track(event, properties);
  }, []);

  const page = useCallback((path: string, title: string) => {
    analytics.page(path, title);
  }, []);

  const feature = useCallback((name: string, action: string) => {
    analytics.feature(name, action);
  }, []);

  const exportEvent = useCallback((format: string, entity: string) => {
    analytics.export(format, entity);
  }, []);

  const search = useCallback((query: string, results: number) => {
    analytics.search(query, results);
  }, []);

  return { track, page, feature, export: exportEvent, search };
}
