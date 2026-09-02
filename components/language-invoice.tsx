'use client'

import { useEffect, useState } from 'react'
import { Download, Globe2, X } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { common, useLanguage } from '../lib/translations'

export function copy() {
  return common
}

export function LanguageGate({ onChange }: { onChange: (lang: 'en' | 'bn') => void }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('dribrahim.lang.gate')
      if (!stored) setOpen(true)
    } catch {
      setOpen(true)
    }
  }, [])
  if (!open) return null
  const t = common.en
  const choose = (lang: 'en' | 'bn') => {
    onChange(lang)
    try { window.localStorage.setItem('dribrahim.lang.gate', '1') } catch {}
    setOpen(false)
  }
  return (
    <div className="language-backdrop">
      <div className="language-card">
        <button className="language-close" onClick={() => { setOpen(false); try { window.localStorage.setItem('dribrahim.lang.gate', '1') } catch {} }} aria-label={t.close}><X/></button>
        <span className="language-orb"><Globe2/></span>
        <span className="eyebrow">{t.chooseLanguage.includes('Choose') ? 'DR. IBRAHIM CLINIC' : 'ডাঃ ইব্রাহিম ক্লিনিক'}</span>
        <h2>{t.chooseLanguage}</h2>
        <p>{t.chooseLanguageSub}</p>
        <div className="language-options">
          <button onClick={() => choose('en')}>
            <strong>English</strong>
            <small>Continue in English</small>
          </button>
          <button onClick={() => choose('bn')}>
            <strong>বাংলা</strong>
            <small>বাংলায় চালিয়ে যান</small>
          </button>
        </div>
      </div>
    </div>
  )
}

export function LanguageControl({ lang, onChange, compact = false }: { lang: 'en' | 'bn'; onChange: (lang: 'en' | 'bn') => void; compact?: boolean }) {
  const t = common[lang]
  return (
    <div className={`language-hover ${compact ? 'is-compact' : ''}`}>
      <button aria-label={t.language}>
        <Globe2 size={15}/>
        <span>{lang === 'en' ? 'EN' : 'বাং'}</span>
      </button>
      <div className="language-tooltip">
        <strong>{t.language}</strong>
        <button onClick={() => onChange('en')}>English</button>
        <button onClick={() => onChange('bn')}>বাংলা</button>
      </div>
    </div>
  )
}

export function InvoiceButton({ type = 'appointment', lang = 'en' }: { type?: 'appointment' | 'order'; lang?: 'en' | 'bn' }) {
  const [open, setOpen] = useState(false)
  const t = common[lang]
  const id = type === 'order' ? 'DRI-2048' : 'APT-2026-0618'
  const line = type === 'order'
    ? (lang === 'bn' ? 'ওয়েলনেস প্রোডাক্ট' : 'Wellness essentials')
    : (lang === 'bn' ? 'বিশেষজ্ঞ কনসালটেশন' : 'Specialist consultation')
  const total = type === 'order' ? (lang === 'bn' ? '৳ ৬,৮০০' : '$68.00') : (lang === 'bn' ? '৳ ৪,৫০০' : '$45.00')

  const download = () => {
    const pdf = new jsPDF()
    pdf.setTextColor(23, 75, 120)
    pdf.setFontSize(20)
    pdf.text(t.brandFull, 20, 25)
    pdf.setFontSize(11)
    pdf.setTextColor(95, 117, 128)
    pdf.text(`${t.invoice} #${id}`, 20, 37)
    pdf.text(new Date().toLocaleDateString(), 150, 37)
    pdf.line(20, 45, 190, 45)
    pdf.setTextColor(23, 75, 120)
    pdf.setFontSize(14)
    pdf.text(line, 20, 62)
    pdf.setFontSize(11)
    pdf.text(line, 20, 78)
    pdf.text(`${t.total}: ${total}`, 20, 96)
    pdf.setTextColor(95, 117, 128)
    pdf.text(t.generatedFor, 20, 125)
    pdf.save(`${id}.pdf`)
  }

  return (
    <>
      <button className="invoice-button" onClick={() => setOpen(true)}>
        <Download size={15}/>{t.invoice}
      </button>
      {open && (
        <div className="invoice-backdrop">
          <div className="invoice-modal">
            <button className="language-close" onClick={() => setOpen(false)} aria-label={t.close}><X/></button>
            <span className="eyebrow">{t.invoice}</span>
            <h2>{t.brandFull}</h2>
            <p className="invoice-id">#{id} · 18 June 2026</p>
            <div className="invoice-line"><span>{line}</span><strong>{total}</strong></div>
            <div className="invoice-total"><span>{t.total}</span><strong>{total}</strong></div>
            <button className="btn btn-primary full" onClick={download}><Download size={16}/>{t.download}</button>
            <p className="invoice-note">{t.generatedFor}</p>
          </div>
        </div>
      )}
    </>
  )
}
