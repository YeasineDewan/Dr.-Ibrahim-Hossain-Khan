'use client';

import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export function MotionShell({ onBook }: { onBook?: () => void }) {
  useEffect(() => {
    // Only initialize custom cursor on desktop (mouse-based, not touch)
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.innerWidth < 768) return;

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    let rx = 0,
      ry = 0,
      dx = -100,
      dy = -100;
    let frameRequested: number | null = null;
    let dirty = false;
    const onMove = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      if (!dirty) {
        dirty = true;
        frameRequested = requestAnimationFrame(updateRing);
      }
    };
    const updateRing = () => {
      dirty = false;
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      if (Math.abs(dx - rx) > 0.1 || Math.abs(dy - ry) > 0.1) {
        dirty = true;
        frameRequested = requestAnimationFrame(updateRing);
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (
        t.closest(
          'button, a, .tilt-3d, .card-3d, .iso-3d, .premium-card, .glass, .lift, [data-cursor]'
        )
      ) {
        document.body.classList.add('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      if (frameRequested != null) cancelAnimationFrame(frameRequested);
      dot.remove();
      ring.remove();
      document.body.classList.remove('cursor-hover');
    };
  }, []);

  // Back-to-top button is now handled by the footer component
  return null;
}

export function FloatingBookCta({ lang, onClick }: { lang: string; onClick: () => void }) {
  const label = lang === 'bn' ? 'অ্যাপয়েন্টমেন্ট নিন' : 'Book appointment';
  return (
    <button className="fab-cta" onClick={onClick}>
      <Sparkles size={16} /> {label}
    </button>
  );
}
