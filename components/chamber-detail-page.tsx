'use client';

import { useMemo } from 'react';
import { ArrowLeft, MapPin, Clock3, Phone, Mail, Navigation } from 'lucide-react';
import { chambersCopy, useLanguage, common } from '../lib/translations';
import { ScrollReveal } from './scroll-reveal';
import { Tilt3D } from './motion-3d';
import { chamberDetailSeo } from '../lib/seo-data';
import { SeoUpdater, type PageKey } from './seo-updater';

const slugs = ['dhanmondi', 'banglamotor', 'uttara'] as const;
type ChamberSlug = typeof slugs[number];

const chamberContent: Record<ChamberSlug, { en: any; bn: any }> = {
  dhanmondi: {
    en: {
      eyebrow: 'PRIMARY CHAMBER',
      title1: 'Dhanmondi',
      titleEm: 'Clinic.',
      lead: 'Our flagship chamber in the heart of Dhaka. A calm, modern space designed for thoughtful consultations and continuous care.',
      features: [
        'Prime Dhanmondi location with easy parking access',
        'Full-service dermatology and integrative medicine',
        'Private consultation rooms',
        'On-site pharmacy for prescribed medications',
        'Flexible morning and afternoon appointments',
      ],
      nearby: 'Near Dhanmondi Lake, Bangladesh Road',
      mapQuery: 'House+45+Road+22+Dhanmondi+Dhaka+Bangladesh',
    },
    bn: {
      eyebrow: 'প্রধান চেম্বার',
      title1: 'ধানমন্ডি',
      titleEm: 'ক্লিনিক।',
      lead: 'ঢাকার হৃদয়ে আমাদের প্রধান চেম্বার। বিবেচনামূলক কনসালটেশন এবং ধারাবাহিক যত্নের জন্য একটি শান্ত, আধুনিক স্থান।',
      features: [
        'ধানমন্ডি লেকের কাছে ಪ್ರIMO অবস্থান, সহজ পার্কিং',
        'সম্পূর্ণ সেবামূলক ডার্মাটোলজি ও ইন্টিগ্রেটিভ মেডিসিন',
        'ব্যক্তিগত কনসালটেশন রুম',
        'প্রেসক্রাইবড ওষুধের জন্য অনসাইট ফার্মেসি',
        'নমনীয় সকাল ও দুপুরের অ্যাপয়েন্টমেন্ট',
      ],
      nearby: 'ধানমন্ডি লেকের কাছে, বাংলাদেশ রোড',
      mapQuery: 'House+45+Road+22+Dhanmondi+Dhaka+Bangladesh',
    },
  },
  banglamotor: {
    en: {
      eyebrow: 'EVENING CHAMBER',
      title1: 'Banglamotor',
      titleEm: 'Clinic.',
      lead: 'Convenient evening and late-afternoon care at our Banglamotor location. Perfect for professionals and families who need after-hours attention.',
      features: [
        'Extended evening hours until 9:00 PM',
        'Located at Rupayan Trade Center',
        'Full dermatology services available',
        'Easy access from all Dhaka areas',
        'Same-day appointments often available',
      ],
      nearby: 'Near Kazi Nazrul Islam Ave, Banglamotor',
      mapQuery: 'Rupayan+Trade+Center+14+Kazi+Nazrul+Islam+Ave+Banglamotor+Dhaka',
    },
    bn: {
      eyebrow: 'সন্ধ্যার চেম্বার',
      title1: 'বাংলামোটর',
      titleEm: 'ক্লিনিক।',
      lead: 'আমাদের বাংলামোটর অবস্থানে সুবিধাজনক সন্ধ্যা ও দীর্ঘ-dupurের যত্ন। জরুরीinnon-hours atención চাই冒昧 profesionales এবং পরিবারদের জন্য নিখুঁত।',
      features: [
        'রাত ৯:০০ পর্যন্ত দীর্ঘ সন্ধ্যা সময়',
        'রূপায়ন ট্রেড সেন্টরে অবস্থিত',
        'সম্পূর্ণ ডার্মাটোলজি সেবা উপলব্ধ',
        'সব ঢাকা এলাকা থেকে সহজ অ্যাক্সেস',
        'প্রায়শই একই দিনের অ্যাপয়েন্টমেন্ট উপলব্ধ',
      ],
      nearby: 'কাজী নজরুল ইসলাম অ্যাভিনিউর কাছে, বাংলামোটর',
      mapQuery: 'Rupayan+Trade+Center+14+Kazi+Nazrul+Islam+Ave+Banglamotor+Dhaka',
    },
  },
  uttara: {
    en: {
      eyebrow: 'MORNING CHAMBER',
      title1: 'Uttara',
      titleEm: 'Clinic.',
      lead: 'A convenient morning clinic in Uttara serving northern Dhaka with the same high-quality specialist care and personalized attention.',
      features: [
        'Morning hours: 10:00 AM - 1:00 PM',
        'Located at Ibn Sina Diagnostic Centre',
        'Full-service dermatology clinic',
        'Easy parking in Sector 7',
        'Ideal for early appointments before work',
      ],
      nearby: 'Near Uttara Residential Area, Sector 7',
      mapQuery: 'Ibn+Sina+Diagnostic+Centre+Sector+7+Sonargaon+Janapath+Uttara+Dhaka',
    },
    bn: {
      eyebrow: 'সকালের চেম্বার',
      title1: 'উত্তরা',
      titleEm: 'ক্লিনিক।',
      lead: 'উত্তরায় একটি সুবিধাজনক সকালের ক্লিনিক যা উত্তর ঢাকাকে একই উচ্চমানের বিশেষজ্ঞ যত্ন ও ব্যক্তিগত মনোযোগ দিয়ে সেবা দেয়।',
      features: [
        'সকাল ১০:০০ - দুপুর ১:০০',
        'ইবনে সিনা ডায়াগনস্টিক সেন্টরে অবস্থিত',
        'সম্পূর্ণ সেবামূলক ডার্মাটোলজি ক্লিনিক',
        'সেক্টর ৭ে সহজ পার্কিং',
        'কাজের আগে প্রাথমিক অ্যাপয়েন্টমেন্টের জন্য আদর্শ',
      ],
      nearby: 'উত্তরা আবাসিক এলাকার কাছে, সেক্টর ৭',
      mapQuery: 'Ibn+Sina+Diagnostic+Centre+Sector+7+Sonargaon+Janapath+Uttara+Dhaka',
    },
  },
};

export function ChamberDetailPage({
  slug,
  onNavigate,
}: {
  slug: string;
  onNavigate: (p: string) => void;
}) {
  const { lang } = useLanguage();
  const content = chamberContent[slug as ChamberSlug] || chamberContent.dhanmondi;
  const data = content[lang];
  const seo = chamberDetailSeo[slug];

  return (
    <>
      <SeoUpdater page="ChamberDetail" serviceSlug={slug} />
      <main className="page-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          className="aurora-bg"
          style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}
        />
        <div className="container" style={{ position: 'relative' }}>
          <ScrollReveal>
            <button
              type="button"
              className="back-link"
              onClick={() => onNavigate('Chambers')}
              aria-label={lang === 'bn' ? 'চেম্বার পেজে ফিরুন' : 'Back to chambers'}>
              <ArrowLeft size={15} /> {lang === 'bn' ? 'চেম্বারসমূহ' : 'All chambers'}
            </button>
            <span className="pill pill-teal float-soft">{data.eyebrow}</span>
            <h1 className="gradient-text" style={{ marginTop: 14 }}>
              {data.title1} <em>{data.titleEm}</em>
            </h1>
            <p className="lead max-copy">{data.lead}</p>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 40 }} className="split-grid">
            <ScrollReveal>
              <div className="premium-card shine-card" style={{ padding: 24 }}>
                <h3 style={{ marginTop: 0, marginBottom: 16 }}>
                  {lang === 'bn' ? 'এই চেম্বারের বৈশিষ্ট্য' : 'What this chamber offers'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {data.features.map((feature: string, i: number) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: 'rgba(20,184,166,0.06)',
                        border: '1px solid rgba(20,184,166,0.1)',
                      }}>
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          background: 'linear-gradient(135deg, #14b8a6, #6366f1)',
                          color: '#fff',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.5 }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="premium-card shine-card" style={{ padding: 24 }}>
                <h3 style={{ marginTop: 0, marginBottom: 16 }}>
                  {lang === 'bn' ? 'পরিসংখ্যান ও যোগাযোগ' : 'Visit information'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <MapPin size={18} style={{ color: '#14b8a6', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <strong style={{ fontSize: 13 }}>{lang === 'bn' ? 'ঠিকানা' : 'Address'}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: '#647985', lineHeight: 1.5 }}>
                        {seo?.description.split('.')[0]}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <Clock3 size={18} style={{ color: '#14b8a6', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <strong style={{ fontSize: 13 }}>{lang === 'bn' ? 'সময়' : 'Hours'}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: '#647985' }}>
                        {lang === 'bn' ? 'সোম–শুক্র · সকাল ৮:০০–বিকাল ৫:০০' : 'Mon–Fri · 8:00 AM – 5:00 PM'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <Phone size={18} style={{ color: '#14b8a6', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <strong style={{ fontSize: 13 }}>{lang === 'bn' ? 'ফোন' : 'Phone'}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: '#647985' }}>+880 1719-939553</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <Mail size={18} style={{ color: '#14b8a6', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <strong style={{ fontSize: 13 }}>Email</strong>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: '#647985' }}>hello@dribrahim.clinic</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <a
                      className="btn btn-primary btn-pro shadow-glow-teal"
                      href={`https://www.google.com/maps/search/?api=1&query=${data.mapQuery}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
                      <Navigation size={15} /> {lang === 'bn' ? 'দিকনির্দেশ' : 'Directions'}
                    </a>
                    <button
                      className="btn btn-outline btn-pro"
                      onClick={() => onNavigate('Appointment')}
                      style={{ flex: 1 }}>
                      {lang === 'bn' ? 'অ্যাপয়েন্টমেন্ট' : 'Book now'}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal className="section" style={{ marginTop: 40 }}>
            <div className="container">
              <span className="section-eyebrow">{lang === 'bn' ? 'মানচিত্র' : 'Map'}</span>
              <h2 style={{ marginTop: 10 }}>{lang === 'bn' ? 'ক্লিনিকের অবস্থান' : 'Clinic location'}</h2>
              <div
                style={{
                  borderRadius: 18,
                  overflow: 'hidden',
                  border: '1px solid rgba(20,184,166,0.15)',
                  boxShadow: '0 20px 40px -12px rgba(15,42,68,0.15)',
                }}>
                <iframe
                  title="Clinic location on Google Maps"
                  src={`https://maps.google.com/maps?q=${data.mapQuery}&output=embed`}
                  width="100%"
                  height="320"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" />
              </div>
              <p style={{ marginTop: 10, color: '#647985', fontSize: 13 }}>
                {data.nearby}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </main>
    </>
  );
}
