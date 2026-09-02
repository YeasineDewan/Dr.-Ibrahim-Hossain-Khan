'use client'

import { common } from './common'
import { navCopy } from './nav'
import { aboutCopy, doctorBio, sexualMedicineCopy } from './about'
import { servicesCopy, serviceDetailsCopy, chambersCopy, galleryCopy, contactCopy } from './services'
import { appointmentCopy, checkoutCopy, successCopy } from './shop'
import { adminCopy, patientCopy } from './admin'
import type { Lang } from './i18n'

export { useLang, useLanguage, LanguageProvider } from './i18n'
export type { Lang }

export {
  common,
  navCopy,
  aboutCopy,
  doctorBio,
  sexualMedicineCopy,
  servicesCopy,
  serviceDetailsCopy,
  chambersCopy,
  galleryCopy,
  contactCopy,
  appointmentCopy,
  checkoutCopy,
  successCopy,
  adminCopy,
  patientCopy,
}

export const translations = {
  common,
  nav: navCopy,
  about: aboutCopy,
  doctorBio,
  sexualMedicine: sexualMedicineCopy,
  services: servicesCopy,
  serviceDetails: serviceDetailsCopy,
  chambers: chambersCopy,
  gallery: galleryCopy,
  contact: contactCopy,
  appointment: appointmentCopy,
  checkout: checkoutCopy,
  success: successCopy,
  admin: adminCopy,
  patient: patientCopy,
} as const

export type TranslationKey = keyof typeof translations

export function t<K extends TranslationKey>(key: K, lang: Lang) {
  const obj = translations[key] as Record<Lang, any>
  return (obj[lang] ?? obj.en) as (typeof translations)[K]['en']
}

export function pickByLang<T extends Record<string, any>>(obj: T, lang: Lang) {
  return (obj[lang] ?? obj.en) as T['en']
}
