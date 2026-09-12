'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';

const revealClasses = ['scroll-reveal', 'reveal-up', 'reveal-fade', 'reveal-left', 'reveal-scale'] as const;

export function ScrollReveal({
  children,
  className = '',
  variant = 'up',
  delay = 0,
  repeat = false,
  style,
}: {
  children: ReactNode;
  className?: string;
  variant?: 'up' | 'fade' | 'left' | 'scale';
  delay?: number;
  repeat?: boolean;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const variantClass = revealClasses.find((name) => name === `reveal-${variant}`) ?? 'reveal-up';

  // Simplified: skip Intersection Observer for faster initial render
  // Content is always visible (no scroll-triggered animations)
  // This reduces runtime work and eliminates jank during scrolling
  if (typeof window !== 'undefined') {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return (
        <div
          ref={ref}
          className={`is-visible ${variantClass} ${className}`}
          style={{ '--reveal-delay': `${delay}ms`, ...style } as CSSProperties}
        >
          {children}
        </div>
      );
    }
  }

  return (
    <div
      ref={ref}
      className={`is-visible ${variantClass} ${className}`}
      style={{ '--reveal-delay': `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </div>
  );
}
