'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'bn'

const STORAGE_KEY = 'dribrahim.lang'

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
}

const LanguageContext = createContext<Ctx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    try {
      const saved = (typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY)) as Lang | null
      if (saved === 'en' || saved === 'bn') setLangState(saved)
    } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'bn' ? 'bn' : 'en'
      document.documentElement.dataset.lang = lang
    }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.lang = l === 'bn' ? 'bn' : 'en'
      document.documentElement.dataset.lang = l
    }
  }

  const toggle = () => setLang(lang === 'en' ? 'bn' : 'en')

  return <LanguageContext.Provider value={{ lang, setLang, toggle }}>{children}</LanguageContext.Provider>
}

export function useLang(): Lang {
  const ctx = useContext(LanguageContext)
  return ctx?.lang ?? 'en'
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) return { lang: 'en' as Lang, setLang: () => {}, toggle: () => {} }
  return ctx
}

export function tFor<T extends Record<string, any>>(obj: T, lang: Lang): T['en'] {
  return (obj[lang] ?? obj.en) as T['en']
}
