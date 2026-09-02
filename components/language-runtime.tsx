'use client'

import { useEffect } from 'react'
import { useLanguage } from '../lib/translations'

export function LanguageRuntime({ lang }: { lang: 'en' | 'bn' }) {
  useEffect(() => {
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en'
    document.documentElement.dataset.lang = lang
    // Switch the document font variable to the Bangla font when bn.
    document.documentElement.style.setProperty(
      '--font-current',
      lang === 'bn' ? 'var(--font-bangla)' : 'var(--font-sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif)'
    )
  }, [lang])
  return null
}
