'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

const revealOptions: IntersectionObserverInit = { threshold: 0.14, rootMargin: '0px 0px -10% 0px' };

const revealClasses = ['scroll-reveal', 'reveal-up', 'reveal-fade', 'reveal-left', 'reveal-scale'] as const;

export function ScrollReveal({
  children,
  className = '',
  variant = 'up',
  delay = 0,
  repeat = false,
}: {
  children: ReactNode;
  className?: string;
  variant?: 'up' | 'fade' | 'left' | 'scale';
  delay?: number;
  repeat?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('is-visible');
        if (!repeat) observer.unobserve(node);
      } else if (repeat) {
        node.classList.remove('is-visible');
      }
    }, revealOptions);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const variantClass = revealClasses.find((name) => name === `reveal-${variant}`) ?? 'reveal-up';
  return (
    <div ref={ref} className={`${variantClass} ${className}`} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}
