'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

const canAnimate = typeof window !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches;

export function Tilt3D({
  children,
  max = 8,
  scale = 1.02,
  className = '',
  style,
  onClick,
}: {
  children: ReactNode;
  max?: number;
  scale?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate) return;
    let raf = 0;
    let pending = false;
    let lastEvent: MouseEvent | null = null;
    const onMove = (e: MouseEvent) => {
      lastEvent = e;
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(() => {
        pending = false;
        if (!lastEvent) return;
        const ev = lastEvent;
        const rect = el.getBoundingClientRect();
        const px = (ev.clientX - rect.left) / rect.width;
        const py = (ev.clientY - rect.top) / rect.height;
        const ry = (px - 0.5) * 2 * max;
        const rx = (0.5 - py) * 2 * max;
        el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
        el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
        el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(${(px - 0.5) * 4}px, ${(py - 0.5) * 4}px, 12px) scale(${scale})`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = '';
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [max, scale]);
  return (
    <div ref={ref} className={`tilt-3d ${className}`} style={style} onClick={onClick}>
      {children}
    </div>
  );
}

export function Magnetic({
  children,
  strength = 0.25,
  className = '',
  style,
  onClick,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate) return;
    let raf = 0;
    let pending = false;
    let lastEvent: MouseEvent | null = null;
    const onMove = (e: MouseEvent) => {
      lastEvent = e;
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(() => {
        pending = false;
        if (!lastEvent) return;
        const ev = lastEvent;
        const rect = el.getBoundingClientRect();
        const x = ev.clientX - rect.left - rect.width / 2;
        const y = ev.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = '';
    };
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);
  return (
    <div
      ref={ref}
      className={`magnetic ${className}`}
      style={{ display: 'inline-block', ...style }}
      onClick={onClick}>
      {children}
    </div>
  );
}

export function Particles({
  count = 24,
  colors = ['#14b8a6', '#6366f1', '#ec4899', '#f59e0b'],
}: {
  count?: number;
  colors?: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const dx = (Math.random() - 0.5) * 200;
      const dy = -(Math.random() * 200 + 80);
      const delay = Math.random() * 6;
      const dur = 4 + Math.random() * 6;
      const size = 3 + Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.cssText = `left:${x}%;top:${y}%;width:${size}px;height:${size}px;background:${color};box-shadow:0 0 ${size * 2}px ${color};--dx:${dx}px;--dy:${dy}px;animation-delay:${delay}s;animation-duration:${dur}s`;
      frag.appendChild(p);
    }
    el.appendChild(frag);
  }, [count, colors]);
  return <div ref={ref} className="particles" aria-hidden="true" />;
}

export function Cube3D({
  size = 100,
  faces = ['A', 'B', 'C', 'D', 'E', 'F'],
}: {
  size?: number;
  faces?: string[];
}) {
  return (
    <div className="cube-3d" style={{ width: size, height: size }}>
      {faces.map((f, i) => (
        <div
          key={i}
          className={`cube-face ${['front', 'back', 'right', 'left', 'top', 'bottom'][i]}`}
          style={{ width: size, height: size, transform: getFaceTransform(i, size) }}>
          {f}
        </div>
      ))}
    </div>
  );
}

function getFaceTransform(i: number, size: number) {
  const h = size / 2;
  const t: Record<number, string> = {
    0: `translateZ(${h}px)`,
    1: `rotateY(180deg) translateZ(${h}px)`,
    2: `rotateY(90deg) translateZ(${h}px)`,
    3: `rotateY(-90deg) translateZ(${h}px)`,
    4: `rotateX(90deg) translateZ(${h}px)`,
    5: `rotateX(-90deg) translateZ(${h}px)`,
  };
  return t[i];
}
