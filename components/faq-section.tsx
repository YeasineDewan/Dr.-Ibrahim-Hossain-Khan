'use client';

import { memo } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title: string;
  items: FaqItem[];
  lang: 'en' | 'bn';
}

export const FaqSection = memo(function FaqSection({ title, items, lang }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" style={{ marginTop: 40 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <span className="section-eyebrow">{title}</span>
        <h2 style={{ marginTop: 10 }}>
          {lang === 'bn' ? 'সাধারণ প্রশ্ন' : 'Frequently asked questions'}
        </h2>
      </div>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? 'is-open' : ''}`}
            style={{
              border: '1px solid rgba(20,184,166,0.15)',
              borderRadius: 12,
              marginBottom: 10,
              overflow: 'hidden',
              background: '#fff',
            }}>
            <button
              type="button"
              className="faq-question"
              onClick={() => toggle(index)}
              style={{
                width: '100%',
                padding: '14px 18px',
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: '#0f172a',
                textAlign: 'left',
              }}>
              <span>{item.question}</span>
              <span style={{ flexShrink: 0, marginLeft: 12, color: '#14b8a6' }}>
                {openIndex === index ? <X size={16} /> : <Plus size={16} />}
              </span>
            </button>
            {openIndex === index && (
              <div
                className="faq-answer"
                style={{
                  padding: '0 18px 16px',
                  fontSize: 13,
                  color: '#647985',
                  lineHeight: 1.7,
                }}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
});
