'use client'

import { useEffect } from 'react'

const translations: Record<string,string> = {
  'Home':'হোম','About':'পরিচিতি','Services':'সেবাসমূহ','Gallery':'গ্যালারি','Chambers':'চেম্বারসমূহ','Appointment':'অ্যাপয়েন্টমেন্ট','Shop':'শপ','Contact':'যোগাযোগ','Book appointment':'অ্যাপয়েন্টমেন্ট বুক করুন','Explore our services':'আমাদের সেবাসমূহ দেখুন','Trusted care in Accra':'আক্রায় বিশ্বস্ত চিকিৎসা','Healthcare that feels human.':'মানবিক স্বাস্থ্যসেবা।','What we do':'আমরা যা করি','Care designed around you.':'আপনাকে কেন্দ্র করে যত্ন।','View all services':'সব সেবা দেখুন','Clinic shop':'ক্লিনিক শপ','Visit the shop':'শপে যান','Ready to feel':'ভালো বোধ করতে প্রস্তুত?','Ready to feel well cared for?':'ভালোভাবে যত্ন পেতে প্রস্তুত?','We’re here when you need us.':'প্রয়োজনে আমরা আপনার পাশে আছি।','Find us easily':'সহজে আমাদের খুঁজে নিন','Learn more':'আরও জানুন','Book this service':'এই সেবা বুক করুন','Book an appointment':'অ্যাপয়েন্টমেন্ট বুক করুন','Send a message':'বার্তা পাঠান','How can we help?':'আমরা কীভাবে সাহায্য করতে পারি?','Send enquiry':'জিজ্ঞাসা পাঠান','Dashboard':'ড্যাশবোর্ড','Patients':'রোগীসমূহ','Appointments':'অ্যাপয়েন্টমেন্টসমূহ','Settings':'সেটিংস','Overview':'সংক্ষিপ্ত বিবরণ','Care':'চিকিৎসা','Commerce':'বাণিজ্য','Content':'কনটেন্ট','System':'সিস্টেম','English':'ইংরেজি','বাংলা':'বাংলা'
}

export function LanguageRuntime({ lang }: { lang: 'en'|'bn' }) {
  useEffect(() => {
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en'
    const reverse = Object.fromEntries(Object.entries(translations).map(([en,bn]) => [bn,en]))
    const translate = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      const nodes: Text[] = []
      while (walker.nextNode()) nodes.push(walker.currentNode as Text)
      nodes.forEach(node => {
        const original = node.nodeValue?.trim()
        if (!original || original.length > 90) return
        const english = node.parentElement?.getAttribute('data-i18n-original') || original
        node.parentElement?.setAttribute('data-i18n-original', english)
        const next = lang === 'bn' ? (translations[english] || english) : (reverse[original] || english)
        if (next !== original) node.nodeValue = node.nodeValue!.replace(original, next)
      })
    }
    translate()
    const observer = new MutationObserver(translate)
    observer.observe(document.body, { childList:true, subtree:true })
    return () => observer.disconnect()
  }, [lang])
  return null
}

export const banglaTranslations = translations
