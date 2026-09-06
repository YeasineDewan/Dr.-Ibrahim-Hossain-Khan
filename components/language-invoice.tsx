'use client';

import { memo, useCallback, useEffect, useRef, useState, startTransition } from 'react';
import { Download, Globe2, Sparkles, Check, ArrowRight, Languages, X } from 'lucide-react';
import { common, useLanguage } from '../lib/translations';

export function copy() {
  return common;
}

export const LanguageGate = memo(function LanguageGate({
  onChange,
}: {
  onChange: (lang: 'en' | 'bn') => void;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<'en' | 'bn' | null>(null);
  const [closing, setClosing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('dribrahim.lang.gate-seen');
      if (raw) {
        const parsed = JSON.parse(raw);
        const expiry = parsed.expiresAt || 0;
        if (Date.now() < expiry) return;
      }
      const t = window.setTimeout(() => setOpen(true), 380);
      return () => clearTimeout(t);
    } catch {
      const t = window.setTimeout(() => setOpen(true), 380);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const choose = useCallback(
    (lang: 'en' | 'bn') => {
      setClosing(true);
      setTimeout(() => {
        startTransition(() => onChange(lang));
        try {
          window.localStorage.setItem(
            'dribrahim.lang.gate-seen',
            JSON.stringify({ expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 })
          );
        } catch {
          /* noop */
        }
        try {
          window.localStorage.setItem('dribrahim.lang', lang);
        } catch {
          /* noop */
        }
        setOpen(false);
      }, 80);
    },
    [onChange]
  );
  const dismiss = useCallback(() => {
    setClosing(true);
    const onAnimationEnd = () => {
      try {
        window.localStorage.setItem(
          'dribrahim.lang.gate-seen',
          JSON.stringify({ expiresAt: Date.now() + 24 * 60 * 60 * 1000 })
        );
      } catch {
        /* noop */
      }
      setOpen(false);
      cardRef.current?.removeEventListener('animationend', onAnimationEnd);
    };
    const node = cardRef.current;
    node?.addEventListener('animationend', onAnimationEnd);
    setTimeout(onAnimationEnd, 150);
  }, []);

  if (!open) return null;
  const t = common.en;

  return (
    <div
      className={`lang-gate-backdrop ${closing ? 'is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.chooseLanguage}>
      <div className="lang-gate-bg" aria-hidden="true">
        <div className="lang-gate-orb lang-gate-orb-1" />
        <div className="lang-gate-orb lang-gate-orb-2" />
        <div className="lang-gate-orb lang-gate-orb-3" />
        <div className="lang-gate-grid" />
      </div>
      <button className="lang-gate-skip" onClick={dismiss}>
        {common.en.skipForNow}
      </button>
      <div ref={cardRef} className={`lang-gate-card ${closing ? 'is-closing' : ''}`}>
        <div className="lang-gate-eyebrow">
          <Sparkles size={11} /> <span>DR.IBRAHIM HOSSAIN</span> <Sparkles size={11} />
        </div>
        <div className="lang-gate-flag" aria-hidden="true">
          <Languages size={32} />
        </div>
        <h2 className="lang-gate-title">{t.chooseLanguage}</h2>
        <p className="lang-gate-sub">{t.chooseLanguageSub}</p>
        <div className="lang-gate-options">
          <button
            className={`lang-gate-opt ${hovered === 'en' ? 'is-hover' : ''}`}
            onClick={() => choose('en')}
            onMouseEnter={() => setHovered('en')}
            onMouseLeave={() => setHovered(null)}>
            <span className="lang-gate-opt-flag" aria-hidden="true">
              <span className="lang-gate-opt-flag-en" />
            </span>
            <span className="lang-gate-opt-text">
              <strong>{t.english}</strong>
              <small>{t.englishSub}</small>
            </span>
            <span className="lang-gate-opt-arrow">
              <ArrowRight size={16} />
            </span>
            <span className="lang-gate-opt-glow" aria-hidden="true" />
          </button>
          <button
            className={`lang-gate-opt lang-gate-opt-bn ${hovered === 'bn' ? 'is-hover' : ''}`}
            onClick={() => choose('bn')}
            onMouseEnter={() => setHovered('bn')}
            onMouseLeave={() => setHovered(null)}>
            <span className="lang-gate-opt-flag" aria-hidden="true">
              <span className="lang-gate-opt-flag-bn" />
            </span>
            <span className="lang-gate-opt-text">
              <strong>{t.bangla}</strong>
              <small>{t.banglaSub}</small>
            </span>
            <span className="lang-gate-opt-arrow">
              <ArrowRight size={16} />
            </span>
            <span className="lang-gate-opt-glow" aria-hidden="true" />
          </button>
        </div>
        <div className="lang-gate-foot">
          <span className="lang-gate-foot-pip">
            <Check size={10} /> {common.en.noAccountNeeded || 'No account needed'}
          </span>
          <span className="lang-gate-foot-pip">
            <Globe2 size={10} /> {common.en.switchAnyTime || 'Switch any time'}
          </span>
        </div>
      </div>
    </div>
  );
});

export const LanguageControl = memo(function LanguageControl({
  lang,
  onChange,
  compact = false,
}: {
  lang: 'en' | 'bn';
  onChange: (lang: 'en' | 'bn') => void;
  compact?: boolean;
}) {
  const t = common[lang];
  return (
    <div className={`language-hover ${compact ? 'is-compact' : ''}`}>
      <button aria-label={t.language} title={t.language}>
        <Globe2 size={15} />
        <span>{lang === 'en' ? 'EN' : 'বাং'}</span>
        <span className="language-caret" aria-hidden="true" />
      </button>
      <div className="language-tooltip">
        <strong>{t.language}</strong>
        <button onClick={() => onChange('en')} className={lang === 'en' ? 'is-on' : ''}>
          <span className="lang-pill-dot" /> English
        </button>
        <button onClick={() => onChange('bn')} className={lang === 'bn' ? 'is-on' : ''}>
          <span className="lang-pill-dot" /> বাংলা
        </button>
      </div>
    </div>
  );
});

export function InvoiceButton({
  type = 'appointment',
  lang = 'en',
}: {
  type?: 'appointment' | 'order';
  lang?: 'en' | 'bn';
}) {
  const [open, setOpen] = useState(false);
  const t = common[lang];
  const id = type === 'order' ? 'DRI-2048' : 'APT-2026-0618';
  const line =
    type === 'order'
      ? lang === 'bn'
        ? 'ওয়েলনেস প্রোডাক্ট'
        : 'Wellness essentials'
      : lang === 'bn'
        ? 'বিশেষজ্ঞ কনসালটেশন'
        : 'Specialist consultation';
  const total =
    type === 'order'
      ? lang === 'bn'
        ? '৳ ৬,৮০০'
        : '$68.00'
      : lang === 'bn'
        ? '৳ ৪,৫০০'
        : '$45.00';

  const download = async () => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    pdf.setTextColor(23, 75, 120);
    pdf.setFontSize(20);
    pdf.text(t.brandFull, 20, 25);
    pdf.setFontSize(11);
    pdf.setTextColor(95, 117, 128);
    pdf.text(`${t.invoice} #${id}`, 20, 37);
    pdf.text(new Date().toLocaleDateString(), 150, 37);
    pdf.line(20, 45, 190, 45);
    pdf.setTextColor(23, 75, 120);
    pdf.setFontSize(14);
    pdf.text(line, 20, 62);
    pdf.setFontSize(11);
    pdf.text(line, 20, 78);
    pdf.text(`${t.total}: ${total}`, 20, 96);
    pdf.setTextColor(95, 117, 128);
    pdf.text(t.generatedFor, 20, 125);
    pdf.save(`${id}.pdf`);
  };

  return (
    <>
      <button className="invoice-button" onClick={() => setOpen(true)}>
        <Download size={15} />
        {t.invoice}
      </button>
      {open && (
        <div className="invoice-backdrop">
          <div className="invoice-modal">
            <button className="language-close" onClick={() => setOpen(false)} aria-label={t.close}>
              <X />
            </button>
            <span className="eyebrow">{t.invoice}</span>
            <h2>{t.brandFull}</h2>
            <p className="invoice-id">#{id} · 18 June 2026</p>
            <div className="invoice-line">
              <span>{line}</span>
              <strong>{total}</strong>
            </div>
            <div className="invoice-total">
              <span>{t.total}</span>
              <strong>{total}</strong>
            </div>
            <button className="btn btn-primary full" onClick={download}>
              <Download size={16} />
              {t.download}
            </button>
            <p className="invoice-note">{t.generatedFor}</p>
          </div>
        </div>
      )}
    </>
  );
}
