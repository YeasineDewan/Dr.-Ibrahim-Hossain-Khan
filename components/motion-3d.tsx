"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

export function Tilt3D({ children, max = 8, scale = 1.02, className = '', style }: { children: ReactNode; max?: number; scale?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      const ry = (px - 0.5) * 2 * max
      const rx = (0.5 - py) * 2 * max
      el.style.setProperty('--rx', `${rx.toFixed(2)}deg`)
      el.style.setProperty('--ry', `${ry.toFixed(2)}deg`)
      el.style.setProperty('--tx', `${(px - 0.5) * 10}px`)
      el.style.setProperty('--ty', `${(py - 0.5) * 10}px`)
      el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(${(px - 0.5) * 4}px, ${(py - 0.5) * 4}px, 12px) scale(${scale})`
    }
    const onLeave = () => {
      el.style.transform = ''
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [max, scale])
  return <div ref={ref} className={`tilt-3d ${className}`} style={style}>{children}</div>
}

export function Magnetic({ children, strength = 0.25, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }
    const onLeave = () => { el.style.transform = '' }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])
  return <div ref={ref} className={`magnetic ${className}`} style={{ display: 'inline-block' }}>{children}</div>
}

export function Particles({ count = 24, colors = ['#14b8a6', '#6366f1', '#ec4899', '#f59e0b'] }: { count?: number; colors?: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.innerHTML = ''
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span')
      p.className = 'particle'
      const x = Math.random() * 100
      const y = Math.random() * 100
      const dx = (Math.random() - 0.5) * 200
      const dy = -(Math.random() * 200 + 80)
      const delay = Math.random() * 6
      const dur = 4 + Math.random() * 6
      const size = 3 + Math.random() * 5
      const color = colors[Math.floor(Math.random() * colors.length)]
      p.style.left = `${x}%`
      p.style.top = `${y}%`
      p.style.width = `${size}px`
      p.style.height = `${size}px`
      p.style.background = color
      p.style.boxShadow = `0 0 ${size * 2}px ${color}`
      p.style.setProperty('--dx', `${dx}px`)
      p.style.setProperty('--dy', `${dy}px`)
      p.style.animationDelay = `${delay}s`
      p.style.animationDuration = `${dur}s`
      el.appendChild(p)
    }
  }, [count, colors])
  return <div ref={ref} className="particles" aria-hidden="true" />
}

export function Cube3D({ size = 100, faces = ['A', 'B', 'C', 'D', 'E', 'F'] }: { size?: number; faces?: string[] }) {
  return (
    <div className="cube-3d" style={{ width: size, height: size }}>
      {faces.map((f, i) => (
        <div key={i} className={`cube-face ${['front','back','right','left','top','bottom'][i]}`} style={{ width: size, height: size, transform: getFaceTransform(i, size) }}>
          {f}
        </div>
      ))}
    </div>
  )
}

function getFaceTransform(i: number, size: number) {
  const h = size / 2
  const t: Record<number, string> = {
    0: `translateZ(${h}px)`,
    1: `rotateY(180deg) translateZ(${h}px)`,
    2: `rotateY(90deg) translateZ(${h}px)`,
    3: `rotateY(-90deg) translateZ(${h}px)`,
    4: `rotateX(90deg) translateZ(${h}px)`,
    5: `rotateX(-90deg) translateZ(${h}px)`,
  }
  return t[i]
}
