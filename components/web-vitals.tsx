'use client';

import { useEffect } from 'react';

export function WebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const report = (name: string, delta: number, value: number) => {
      const event = new CustomEvent('web-vital', {
        detail: { name, delta, value, id: `${name}-${Date.now()}` },
      });
      window.dispatchEvent(event);
    };

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          report('FCP', entry.startTime, entry.startTime);
        }
      }
    });

    try {
      observer.observe({ type: 'paint', buffered: true });
    } catch {
      // FCP not supported
    }

    const onLoad = () => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (nav) {
        report('LCP', nav.loadEventEnd - nav.fetchStart, nav.loadEventEnd - nav.fetchStart);
        report('TTFB', nav.responseStart - nav.requestStart, nav.responseStart - nav.requestStart);
      }
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return null;
}
