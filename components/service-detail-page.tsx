'use client';

import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, HeartPulse, ShieldCheck } from 'lucide-react';
import { serviceDetailsCopy, useLanguage, t as tT, common } from '../lib/translations';

type ServiceKey = 'prp' | 'psoriasis' | 'vitiligo' | 'ibs' | 'integrative' | 'preventive';

const details: Record<
  ServiceKey,
  {
    title: { en: string; bn: string };
    label: { en: string; bn: string };
    intro: { en: string; bn: string };
    points: { en: string; bn: string }[];
  }
> = {
  prp: {
    title: { en: 'PRP Therapy', bn: 'PRP থেরাপি' },
    label: { en: 'Regenerative care', bn: 'রিজেনারেটিভ কেয়ার' },
    intro: {
      en: 'A carefully guided platelet-rich plasma treatment designed to support natural healing and renewal.',
      bn: 'প্রাকৃতিক নিরাময় ও পুনর্নবীকরণ সমর্থনে সতর্কভাবে পরিচালিত প্লেটলেট-রিচ প্লাজমা চিকিৎসা।',
    },
    points: [
      { en: 'Personalised consultation and assessment', bn: 'ব্যক্তিগত কনসালটেশন ও মূল্যায়ন' },
      { en: 'Clinician-led treatment planning', bn: 'ক্লিনিশিয়ান-নেতৃত্বাধীন চিকিৎসা পরিকল্পনা' },
      { en: 'Clear aftercare and follow-up support', bn: 'স্পষ্ট আফটারকেয়ার ও ফলো-আপ সহায়তা' },
    ],
  },
  psoriasis: {
    title: { en: 'Psoriasis Treatment', bn: 'সোরিয়াসিস চিকিৎসা' },
    label: { en: 'Dermatology care', bn: 'চর্মরোগ সেবা' },
    intro: {
      en: 'Long-term support for calmer skin, fewer flare-ups, and a treatment plan built around your daily life.',
      bn: 'শান্ত ত্বক, কম ফ্লেয়ার এবং আপনার দৈনন্দিন জীবনের সাথে মানানসই চিকিৎসা পরিকল্পনার জন্য দীর্ঘমেয়াদি সহায়তা।',
    },
    points: [
      { en: 'Trigger and symptom review', bn: 'ট্রিগার ও উপসর্গ পর্যালোচনা' },
      { en: 'Evidence-informed treatment options', bn: 'প্রমাণ-ভিত্তিক চিকিৎসা অপশন' },
      { en: 'Ongoing progress reviews', bn: 'চলমান অগ্রগতি পর্যালোচনা' },
    ],
  },
  vitiligo: {
    title: { en: 'Vitiligo Treatment', bn: 'শ্বেতী (Vitiligo) চিকিৎসা' },
    label: { en: 'Skin confidence', bn: 'ত্বকের আত্মবিশ্বাস' },
    intro: {
      en: 'Compassionate, individualised care to help you understand vitiligo and explore suitable treatment pathways.',
      bn: 'শ্বেতী বুঝতে এবং উপযুক্ত চিকিৎসার পথ অন্বেষণে সহানুভূতিশীল ও ব্যক্তিগতকৃত যত্ন।',
    },
    points: [
      { en: 'Detailed skin assessment', bn: 'বিস্তারিত ত্বক মূল্যায়ন' },
      { en: 'Personalised care planning', bn: 'ব্যক্তিগত যত্ন পরিকল্পনা' },
      { en: 'Support for confidence and wellbeing', bn: 'আত্মবিশ্বাস ও সুস্থতার জন্য সহায়তা' },
    ],
  },
  ibs: {
    title: { en: 'IBS & Gut Health', bn: 'আইবিএস ও অন্ত্রের স্বাস্থ্য' },
    label: { en: 'Digestive wellbeing', bn: 'হজম সংক্রান্ত সুস্থতা' },
    intro: {
      en: 'Practical, whole-person support for better digestion, energy, and confidence around food.',
      bn: 'উন্নত হজম, শক্তি এবং খাদ্যের প্রতি আত্মবিশ্বাসের জন্য বাস্তবসম্মত ও সামগ্রিক সহায়তা।',
    },
    points: [
      { en: 'Lifestyle and symptom mapping', bn: 'জীবনযাত্রা ও উপসর্গ ম্যাপিং' },
      { en: 'Nutrition-aware guidance', bn: 'পুষ্টি-সচেতন নির্দেশনা' },
      { en: 'Measured follow-up milestones', bn: 'পরিমাপযোগ্য ফলো-আপ মাইলস্টোন' },
    ],
  },
  integrative: {
    title: { en: 'Integrative Medicine', bn: 'ইন্টিগ্রেটিভ মেডিসিন' },
    label: { en: 'Whole-person care', bn: 'সামগ্রিক যত্ন' },
    intro: {
      en: 'A connected approach that brings clinical expertise, prevention, lifestyle, and your own goals into one plan.',
      bn: 'ক্লিনিক্যাল দক্ষতা, প্রতিরোধ, জীবনযাত্রা এবং আপনার নিজের লক্ষ্যকে একটি পরিকল্পনায় সংযুক্ত করার একটি সামগ্রিক দৃষ্টিভঙ্গি।',
    },
    points: [
      { en: 'Whole-person health review', bn: 'সামগ্রিক স্বাস্থ্য পর্যালোচনা' },
      { en: 'Collaborative care plan', bn: 'সহযোগিতামূলক যত্ন পরিকল্পনা' },
      { en: 'Sustainable habits and check-ins', bn: 'টেকসই অভ্যাস ও চেক-ইন' },
    ],
  },
  preventive: {
    title: { en: 'Preventive Wellness', bn: 'প্রতিরোধমূলক ওয়েলনেস' },
    label: { en: 'Annual check-up', bn: 'বার্ষিক চেকআপ' },
    intro: {
      en: 'A complete annual review with screening guidance, labs and a clear next-step plan.',
      bn: 'স্ক্রিনিং নির্দেশনা, ল্যাব এবং স্পষ্ট পরবর্তী ধাপ সহ সম্পূর্ণ বার্ষিক পর্যালোচনা।',
    },
    points: [
      { en: 'Comprehensive annual review', bn: 'ব্যাপক বার্ষিক পর্যালোচনা' },
      { en: 'Personalised screening guidance', bn: 'ব্যক্তিগত স্ক্রিনিং নির্দেশনা' },
      { en: 'Clear next-step plan', bn: 'স্পষ্ট পরবর্তী ধাপ পরিকল্পনা' },
    ],
  },
};

export const serviceDetails = details;

export function ServiceDetailPage({
  slug,
  onNavigate,
}: {
  slug: keyof typeof serviceDetails;
  onNavigate: (page: string) => void;
}) {
  const { lang } = useLanguage();
  const c = serviceDetailsCopy[lang];
  const cm = common[lang];
  const service = serviceDetails[slug];
  if (!service) return null;
  const title = service.title[lang];
  const label = service.label[lang];
  const intro = service.intro[lang];
  const points = service.points.map(p => p[lang]);
  return (
    <main className="service-detail-page" aria-labelledby="service-detail-title">
      <section
        className="service-detail-hero aurora-bg"
        style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="blob blob-2" style={{ width: 280, height: 280, top: -60, right: -40 }} />
        <div className="blob blob-5" style={{ width: 220, height: 220, bottom: -50, left: -30 }} />
        <div className="container service-detail-grid">
          <div className="service-detail-copy appear-up">
            <button type="button" className="back-link" onClick={() => onNavigate('Services')} aria-label={c.back}>
              <ArrowLeft size={15} /> {c.back}
            </button>
            <span className="pill pill-teal float-soft">{label}</span>
            <h1 id="service-detail-title" className="gradient-text">
              {title} {lang === 'bn' ? 'দীর্ঘস্থায়ী সুস্থতার জন্য' : 'for lasting wellbeing.'}
            </h1>
            <p className="lead">{intro}</p>
            <div className="detail-actions">
              <button
                type="button"
                className="btn btn-primary btn-pro shadow-glow-teal"
                onClick={() => onNavigate('Appointment')}>
                {c.bookConsult} <ArrowRight size={15} />
              </button>
              <button type="button" className="btn btn-outline btn-pro" onClick={() => onNavigate('Contact')}>
                {c.askQuestion}
              </button>
            </div>
          </div>
          <div className="service-detail-art perspective tilt-3d" style={{ perspective: 1200 }}>
            <HeartPulse size={42} className="heartbeat" style={{ color: '#fff' }} />
            <span>{lang === 'bn' ? 'চিন্তাশীল যত্ন' : 'Thoughtful care'}</span>
            <small>{lang === 'bn' ? 'আপনাকে ঘিরে ডিজাইন করা' : 'Designed around you'}</small>
            <div
              className="orbit"
              style={{ width: 160, height: 160, top: -30, right: -30, position: 'absolute' }}>
              <span
                className="orbit-dot"
                style={{ background: '#fff', boxShadow: '0 0 8px 2px #fff' }}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="section service-detail-body">
        <div className="container service-detail-columns">
          <div>
            <span className="pill">{c.planPill}</span>
            <h2>
              {c.planTitle1} <em>{c.planTitleEm}</em>
            </h2>
            <p className="muted detail-intro">{c.planBody}</p>
            <div className="service-step-list">
              {points.map((point, i) => (
                <div key={i}>
                  <CheckCircle2 size={18} className="pulse" style={{ color: '#14b8a6' }} />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
          <aside className="service-detail-info card-3d lift tilt-3d">
            <ShieldCheck size={22} className="float-soft" style={{ color: '#14b8a6' }} />
            <h3>{c.infoHeading}</h3>
            <p>{c.infoBody}</p>
            <div className="service-detail-info-row">
              <Clock3 size={16} />
              <span>{c.infoTime}</span>
            </div>
            <button className="text-link link-underline" onClick={() => onNavigate('Chambers')}>
              {c.chooseChamber} <ArrowRight size={14} />
            </button>
          </aside>
        </div>
      </section>
      <section className="section service-detail-extra">
        <div className="container">
          <div className="service-feature-grid">
            <article>
              <span className="pill pill-teal">{lang === 'bn' ? 'আপনার ভিজিট' : 'Your visit'}</span>
              <h2>{lang === 'bn' ? 'প্রতিটি ধাপে স্পষ্টতা' : 'Clarity at every step'}</h2>
              <p>
                {lang === 'bn'
                  ? 'পরামর্শের আগে প্রস্তুতি, চিকিৎসার সময় আরাম এবং পরে নির্ভরযোগ্য ফলো-আপ—সব একসাথে।'
                  : 'Prepare before your consultation, feel supported during treatment, and leave with a clear follow-up plan.'}
              </p>
            </article>
            <div className="service-feature-list">
              {[
                lang === 'bn' ? 'ব্যক্তিগত মূল্যায়ন' : 'Personal assessment',
                lang === 'bn' ? 'স্বচ্ছ চিকিৎসা অপশন' : 'Clear treatment options',
                lang === 'bn' ? 'ফলো-আপ সহায়তা' : 'Follow-up support',
              ].map(item => (
                <div key={item}>
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <span className="pill pill-teal">{c.ctaPill}</span>
            <h2>
              {c.ctaTitle1}
              <br />
              <em>{c.ctaTitleEm}</em>
            </h2>
          </div>
          <div>
            <p>{c.ctaBody}</p>
            <button className="btn btn-primary" onClick={() => onNavigate('Appointment')}>
              {c.ctaBtn} <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
