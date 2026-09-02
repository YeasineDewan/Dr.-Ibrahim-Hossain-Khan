'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Drawer({ open, onClose, title, children, width = 560 }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; width?: number }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="adm-drawer-backdrop" onClick={onClose}>
      <aside className="adm-drawer" style={{ width }} onClick={e => e.stopPropagation()}>
        {title && (
          <header className="adm-drawer-head">
            <h3>{title}</h3>
            <button className="adm-icon-btn" onClick={onClose} aria-label="Close"><X size={18}/></button>
          </header>
        )}
        <div className="adm-drawer-body">{children}</div>
      </aside>
    </div>
  )
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; footer?: ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className={`adm-modal adm-modal-${size}`} onClick={e => e.stopPropagation()}>
        {title && (
          <header className="adm-modal-head">
            <h3>{title}</h3>
            <button className="adm-icon-btn" onClick={onClose} aria-label="Close"><X size={18}/></button>
          </header>
        )}
        <div className="adm-modal-body">{children}</div>
        {footer && <footer className="adm-modal-foot">{footer}</footer>}
      </div>
    </div>
  )
}

export function Toast({ message, tone = 'success' }: { message: string; tone?: 'success' | 'error' | 'info' }) {
  return <div className={`adm-toast adm-toast-${tone}`}>{message}</div>
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' | 'info' } | null>(null)
  const t = useRef<ReturnType<typeof setTimeout> | null>(null)
  const show = (message: string, tone: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, tone })
    if (t.current) clearTimeout(t.current)
    t.current = setTimeout(() => setToast(null), 2400)
  }
  const node = toast ? <Toast message={toast.message} tone={toast.tone} /> : null
  return { show, node }
}

export function Stat({ label, value, delta, tone = 'teal', icon }: { label: string; value: string; delta?: string; tone?: 'teal' | 'blue' | 'gold' | 'coral'; icon?: ReactNode }) {
  return (
    <div className="adm-stat">
      <span className={`adm-stat-mark adm-stat-${tone}`}>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        {delta && <em className={tone === 'coral' ? 'warning' : ''}>{delta}</em>}
      </div>
    </div>
  )
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'teal' | 'blue' | 'gold' | 'coral' | 'sand' }) {
  return <span className={`adm-pill adm-pill-${tone}`}>{children}</span>
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()
  const colors = ['#dceceb', '#eae0d2', '#dae4ee', '#e6dceb', '#d8e9d9']
  const i = name.charCodeAt(0) % colors.length
  return (
    <span className="adm-avatar" style={{ width: size, height: size, background: colors[i], fontSize: size * 0.36 }}>
      {initials}
    </span>
  )
}

export function Segmented<T extends string>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="adm-segmented">
      {options.map(o => (
        <button key={o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  )
}

export function Field({ label, children, hint, required }: { label: string; children: ReactNode; hint?: string; required?: boolean }) {
  return (
    <label className="adm-field">
      <span>{label}{required && <i className="req">*</i>}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`adm-input ${props.className || ''}`} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`adm-input adm-textarea ${props.className || ''}`} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return <select {...props} className={`adm-input adm-select ${props.className || ''}`}>{props.children}</select>
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" className={`adm-toggle ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)} aria-pressed={checked}>
      <span className="adm-toggle-knob"/>
      {label && <span className="adm-toggle-label">{label}</span>}
    </button>
  )
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="adm-empty">
      <div className="adm-empty-art">📋</div>
      <h4>{title}</h4>
      {body && <p>{body}</p>}
      {action}
    </div>
  )
}

export function Sparkline({ values, color = '#3b9b91' }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const w = 100, h = 30
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg className="adm-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function BarChart({ values, labels, color = '#174b78' }: { values: number[]; labels: string[]; color?: string }) {
  const max = Math.max(...values, 1)
  return (
    <div className="adm-bars">
      {values.map((v, i) => (
        <div className="adm-bar-col" key={i}>
          <div className="adm-bar" style={{ height: `${(v / max) * 100}%`, background: color }}>
            <span className="adm-bar-tip">{v}</span>
          </div>
          <small>{labels[i]}</small>
        </div>
      ))}
    </div>
  )
}

export function Donut({ value, total, label, color = '#3b9b91' }: { value: number; total: number; label: string; color?: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0
  const r = 36, c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className="adm-donut">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e6edee" strokeWidth="10"/>
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 50 50)"/>
      </svg>
      <div className="adm-donut-center">
        <strong>{Math.round(pct)}%</strong>
        <small>{label}</small>
      </div>
    </div>
  )
}
