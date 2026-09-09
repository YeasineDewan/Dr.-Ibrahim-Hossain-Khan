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

    // FCP — First Contentful Paint
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

    // LCP — Largest Contentful Paint (needs its own observer)
    let lcpReported = false;
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const entry = entries[entries.length - 1];
          report('LCP', entry.startTime, entry.startTime);
          lcpReported = true;
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // LCP not supported
    }

    // TTFB — Time to First Byte (from navigation timing)
    const reportNav = () => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (nav) {
        report('TTFB', nav.responseStart - nav.requestStart, nav.responseStart - nav.requestStart);
      }
    };

    if (document.readyState === 'complete') {
      reportNav();
    } else {
      window.addEventListener('load', reportNav);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('load', reportNav);
    };
  }, []);

  return null;
}