'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, HeartPulse, ShieldCheck, Stethoscope, Activity, Heart, CalendarCheck } from 'lucide-react';
import { serviceDetailsCopy, useLanguage } from '../lib/translations';
import { ScrollReveal } from './scroll-reveal';
import { FaqSection } from './faq-section';

type ServiceKey = 'infertility-care' | 'skin-hair-care' | 'prp' | 'psoriasis' | 'vitiligo' | 'ibs' | 'integrative' | 'preventive';

const details: Record<
  ServiceKey,
  {
    title: { en: string; bn: string };
    label: { en: string; bn: string };
    intro: { en: string; bn: string };
    points: { en: string; bn: string }[];
    treatmentSection?: {
      pill: { en: string; bn: string };
      title: { en: string; bn: string };
      intro: { en: string; bn: string };
    };
  }
> = {
  'infertility-care': {
    title: { en: 'Infertility Care', bn: 'ইনফার্টিলিটি কেয়ার' },
    label: { en: 'Infertility support', bn: 'ইনফার্টিলিটি সহায়তা' },
    intro: {
      en: 'A calm, confidential infertility care journey with thoughtful assessment, practical guidance, and care designed around both partners.',
      bn: 'দুই সঙ্গীকে ঘিরে পরিকল্পিত মূল্যায়ন, বাস্তবসম্মত নির্দেশনা এবং যত্নের মাধ্যমে একটি শান্ত ও গোপনীয় ইনফার্টিলিটি কেয়ার যাত্রা।',
    },
    points: [
      { en: 'Private infertility history and lifestyle review', bn: 'ব্যক্তিগত ইনফার্টিলিটি ইতিহাস ও জীবনযাত্রা পর্যালোচনা' },
      { en: 'Evidence-informed infertility investigation planning', bn: 'প্রমাণ-ভিত্তিক ইনফার্টিলিটি পরীক্ষা পরিকল্পনা' },
      { en: 'Clear next steps for both partners', bn: 'উভয় সঙ্গীর জন্য স্পষ্ট পরবর্তী ধাপ' },
    ],
    treatmentSection: {
      pill: { en: 'Available treatments', bn: 'উপলব্ধ চিকিৎসাসমূহ' },
      title: { en: 'Infertility care, designed around you', bn: 'আপনার জন্য পরিকল্পিত ইনফার্টিলিটি যত্ন' },
      intro: {
        en: 'We begin by listening and understanding your history, goals and concerns. These services may be combined into a clear, step-by-step plan, with specialist referral arranged when needed.',
        bn: 'আমরা আপনার ইতিহাস, লক্ষ্য ও উদ্বেগ মনোযোগ সহকারে শোনার মাধ্যমে শুরু করি। প্রয়োজনে বিশেষজ্ঞের পরামর্শের ব্যবস্থা করে এই সেবাগুলো একটি স্পষ্ট ও ধাপে ধাপে যত্ন পরিকল্পনায় সাজানো যেতে পারে।',
      },
    },
  },
  'skin-hair-care': {
    title: { en: 'Skin & Hair Care', bn: 'ত্বক ও চুলের যত্ন' },
    label: { en: 'Dermatology & aesthetics', bn: 'চর্মরোগ ও নান্দনিক যত্ন' },
    intro: {
      en: 'Personalised skin and hair plans that pair careful diagnosis with gentle, measurable progress and everyday confidence.',
      bn: 'সতর্ক রোগ নির্ণয়, কোমল চিকিৎসা এবং পরিমাপযোগ্য অগ্রগতির মাধ্যমে ব্যক্তিগত ত্বক ও চুলের যত্ন পরিকল্পনা।',
    },
    points: [
      { en: 'Skin, scalp, and hair health assessment', bn: 'ত্বক, স্ক্যাল্প ও চুলের স্বাস্থ্য মূল্যায়ন' },
      { en: 'Targeted plans for tone, texture, and growth', bn: 'টোন, টেক্সচার ও বৃদ্ধির জন্য নির্দিষ্ট পরিকল্পনা' },
      { en: 'Simple routines with thoughtful follow-up', bn: 'সহজ রুটিন ও যত্নশীল ফলো-আপ' },
    ],
    treatmentSection: {
      pill: { en: 'Available treatments', bn: 'উপলব্ধ চিকিৎসাসমূহ' },
      title: { en: 'Services offered at this clinic', bn: 'এই ক্লিনিকে প্রদত্ত সেবাসমূহ' },
      intro: {
        en: 'From scalp health to skin texture, every option begins with a careful assessment and a plan suited to your goals.',
        bn: 'স্ক্যাল্পের স্বাস্থ্য থেকে ত্বকের টেক্সচার—প্রতিটি অপশন শুরু হয় সতর্ক মূল্যায়ন এবং আপনার লক্ষ্যের সাথে মানানসই পরিকল্পনা দিয়ে।',
      },
    },
  },
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

const skinHairTreatments = [
  {
    key: 'prp-hair-restore',
    icon: <Activity size={22} />,
    tag: { en: 'Regenerative', bn: 'রিজেনারেটিভ' },
    title: { en: 'PRP Hair Restoration', bn: 'PRP চুল পুনরূদ্ধার' },
    desc: {
      en: 'Platelet-rich plasma therapy to stimulate hair follicles and improve density.',
      bn: 'চুলের ফলিকুল স্টিমুলেট করে এবং ঘনত্ব উন্নত করতে প্লেটলেট-রিচ প্লাজমা থেরাপি।',
    },
  },
  {
    key: 'acne-scar-revision',
    icon: <ShieldCheck size={22} />,
    tag: { en: 'Dermatology', bn: 'চর্মরোগ' },
    title: { en: 'Acne & Scar Revision', bn: 'অ্যাকন ও দাগ সংশোধন' },
    desc: {
      en: 'Advanced protocols to reduce active breakouts and improve skin texture.',
      bn: 'সক্রিয় ব্রেকআউট কমা��ে এবং ত্বকের টেক্সচার উন্নত করার জন্য উন্নত প্রোটোকল।',
    },
  },
  {
    key: 'psoriasis-management',
    icon: <ShieldCheck size={22} />,
    tag: { en: 'Dermatology', bn: 'চর্মরোগ' },
    title: { en: 'Psoriasis Management', bn: 'সোরিয়াসিস ম্যানেজমেন���ট' },
    desc: {
      en: 'Long-term flare control with topical, systemic and phototherapy options.',
      bn: 'টপিকাল, সিস্টেমিক এবং ফটোথেরাপি অপশন সহ দীর্ঘমেয়াদি ফ্লেয়ার কন্ট্রোল।',
    },
  },
  {
    key: 'hair-loss-evaluation',
    icon: <Stethoscope size={22} />,
    tag: { en: 'Assessment', bn: 'মূল্যায়ন' },
    title: { en: 'Hair Loss Evaluation', bn: 'চুলের ঝড় মূল্যায়ন' },
    desc: {
      en: 'Comprehensive assessment of pattern, hormonal and nutritional causes.',
      bn: 'প্যাটার্ন, হার্মোনাল এবং পুষ্টিকর কারণগুলোর জন্য সমগ্র মূল্যায়ন।',
    },
  },
];

const infertilityTreatments = [
  {
    key: 'comprehensive-fertility-assessment',
    icon: <Heart size={22} />,
    tag: { en: 'Assessment', bn: 'মূল্যায়ন' },
    title: { en: 'Comprehensive Fertility Assessment', bn: 'সম্পূর্ণ ফার্টিলিটি মূল্যায়ন' },
    desc: {
      en: 'A confidential review of reproductive, medical, sexual and lifestyle history for individuals or couples, with a practical plan for recommended tests and next steps.',
      bn: 'ব্যক্তি বা দম্পতির প্রজনন, চিকিৎসা, যৌনস্বাস্থ্য ও জীবনযাত্রার ইতিহাসের গোপনীয় পর্যালোচনা এবং প্রয়োজনীয় পরীক্ষা ও পরবর্তী ধাপের বাস্তবসম্মত পরিকল্পনা।',
    },
  },
  {
    key: 'female-fertility-evaluation',
    icon: <Activity size={22} />,
    tag: { en: 'Ovulation & hormones', bn: 'ডিম্বক্ষেপ ও হার্মোন' },
    title: { en: 'Female Fertility Evaluation', bn: 'নারী ফার্টিলিটি মূল্যায়ন' },
    desc: {
      en: 'Assessment of menstrual regularity, ovulation, PCOS and hormonal or metabolic factors that may affect conception, with clear explanations at every step.',
      bn: 'মাসিকের নিয়মিততা, ডিম্বক্ষেপ, PCOS এবং গর্ভধারণায় প্রভাব ফেলতে পারে এমন হার্মোনাল বা বিপাকীয় কারণের মূল্যায়ন—প্রতিটি ধাপে স্পষ্ট ব্যাখ্যা সহ।',
    },
  },
  {
    key: 'male-fertility-evaluation',
    icon: <Stethoscope size={22} />,
    tag: { en: 'Semen analysis', bn: '��িমেন বিশ্লেষণ' },
    title: { en: 'Male Fertility Evaluation', bn: 'পুরুষ ফার্টিলিটি মূল্যায়ন' },
    desc: {
      en: 'Evaluation of semen parameters and possible causes of male-factor infertility, including low count, reduced motility, abnormal morphology or azoospermia, with appropriate follow-up or referral.',
      bn: 'শুক্রাণুর সংখ্যা, চলনশীলতা, গঠনগত সমস্যা বা আজোস্পার্মিয়াসহ পুরুষ-কারণীয় বন্ধ্যাত্বের সম্ভাব্য কারণ ও সিমেন বিশ্লেষণের মূল্যায়ন; প্রয়োজনে যথাযথ ফলো-আপ বা রেফারেল।',
    },
  },
  {
    key: 'pcos-ovulation-care',
    icon: <HeartPulse size={22} />,
    tag: { en: 'Cycle support', bn: 'চক্রের সহায়তা' },
    title: { en: 'PCOS & Ovulation Care', bn: 'PCOS ও ডিম্বক্ষেপ যত্ন' },
    desc: {
      en: 'Structured support for PCOS, irregular periods and ovulation concerns, combining clinical assessment, lifestyle guidance and monitored progress.',
      bn: 'PCOS, অনিয়মিত মাসিক ও ডিম্বক্ষেপ সংক্রান্ত সমস্যায় ক্লিনিক্যাল মূল্যায়ন, জীবনযাত্রা নির্দেশনা ও পর্যবেক্ষিত অগ্রগতির সমন্বিত সহায়তা।',
    },
  },
  {
    key: 'hormonal-metabolic-optimization',
    icon: <Activity size={22} />,
    tag: { en: 'Personalized care', bn: 'ব্যক্তিগত যত্ন' },
    title: { en: 'Hormonal & Metabolic Optimization', bn: 'হার্মোনাল ও বিপাকীয় ভারসাম্য' },
    desc: {
      en: 'Thoughtful assessment and management of thyroid, prolactin, insulin resistance, weight and other cycle-related factors that can influence reproductive health.',
      bn: 'থাইরয়েড, প্রোল্যাক্টিন, ইনসুলিন রেজিস্ট্যান্স, ওজন এবং প্রজনন স্বাস্থ্যে প্রভাব ফেলতে পারে এমন চক্র-সম্পর্কিত অন্যান্য কারণের মূল্যায়ন ও ব্যক্তিগত যত্ন।',
    },
  },
  {
    key: 'preconception-lifestyle-monitoring',
    icon: <CalendarCheck size={22} />,
    tag: { en: 'Nutrition & follow-up', bn: 'পুষ্টি ও ফলো-আপ' },
    title: { en: 'Preconception Lifestyle & Monitoring', bn: 'প্রি-কনসেপশন জীবনযাত্রা ও পর্যবেক্ষণ' },
    desc: {
      en: 'A practical plan covering nutrition, appropriate supplements, stress, sleep and exercise, with regular reviews and coordinated specialist referral when advanced care is needed.',
      bn: 'পুষ্টি, প্রয়োজনীয় সাপ্লিমেন্ট, মানসিক চাপ, ঘুম ও ব্যায়াম নিয়ে বাস্তবসম্মত পরিকল্পনা; নিয়মিত পর্যালোচনা এবং উন্নত যত্ন প্রয়োজন হলে সমন্বিত বিশেষজ্ঞ রেফারেল।',
    },
  },
];

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
  const service = serviceDetails[slug];
  if (!service) return null;
  const title = service.title[lang];
  const label = service.label[lang];
  const intro = service.intro[lang];
  const points = service.points.map(p => p[lang]);
  const treatmentSection = service.treatmentSection;
  const treatmentsPill = treatmentSection?.pill[lang] ?? c.treatmentsPill;
  const treatmentsTitle = treatmentSection?.title[lang] ?? c.treatmentsTitle;
  const treatmentsIntro = treatmentSection?.intro[lang] ?? c.treatmentsIntro;
  const treatments =
    slug === 'skin-hair-care'
      ? skinHairTreatments
      : slug === 'infertility-care'
        ? infertilityTreatments
        : [];
  const isSkin = slug === 'skin-hair-care';
  const isFertility = slug === 'infertility-care';
  const treatmentSectionMarkup = (
    <ScrollReveal className="section" variant="up">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="pill pill-teal">{treatmentsPill}</span>
            <h2>{treatmentsTitle}</h2>
          </div>
          <p className="muted">{treatmentsIntro}</p>
        </div>
        <div className="service-cards-grid">
          {treatments.map(t => (
            <button
              type="button"
              key={t.key}
              className="service-card"
              onClick={() => onNavigate('Appointment')}
              aria-label={`${t.title[lang]} — ${t.tag[lang]}`}>
              <div className="service-icon" aria-hidden="true">{t.icon}</div>
              <span className="service-tag">{t.tag[lang]}</span>
              <h3>{t.title[lang]}</h3>
              <p>{t.desc[lang]}</p>
              <div className="service-card-foot">
                <span>{c.viewService}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
  const isTreatmentShowcase = isSkin || isFertility;
  const treatmentShowcaseModifier = isSkin ? 'skin' : 'fertility';
  const treatmentShowcaseMarkup = (
    <ScrollReveal className={`section service-treatment-showcase service-treatment-showcase-${treatmentShowcaseModifier}`} variant="up">
      <div className="container">
        <div className="service-treatment-showcase-heading">
          <div>
            <span className="pill pill-teal">{treatmentsPill}</span>
            <h2 className="service-treatment-showcase-title">{treatmentsTitle}</h2>
            <p className="service-treatment-showcase-intro">{treatmentsIntro}</p>
          </div>
          <div className="service-treatment-showcase-assurance" aria-hidden="true">
            <ShieldCheck size={22} />
            <div>
              <strong>{lang === 'bn' ? 'যত্নের প্রতিশ্রুতি' : 'Care, tailored to you'}</strong>
              <span>{lang === 'bn' ? 'সতর্ক মূল্যায়ন, স্পষ্ট পরিকল্পনা, যত্নশীল ফলো-আপ।' : 'Thoughtful assessment, clear options and considerate follow-up.'}</span>
            </div>
          </div>
        </div>
        <div className="service-treatment-showcase-grid">
          {treatments.map((t, index) => (
            <button
              type="button"
              key={t.key}
              className={`service-treatment-card${isTreatmentShowcase && index === 0 ? ' service-treatment-card-featured' : ''}`}
              onClick={() => onNavigate('Appointment')}
              aria-label={`${t.title[lang]} — ${t.tag[lang]}`}>
              <span className="service-treatment-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="service-treatment-icon" aria-hidden="true">{t.icon}</span>
              <span className="service-treatment-content">
                <span className="service-treatment-tag">{t.tag[lang]}</span>
                <h3>{t.title[lang]}</h3>
                <p>{t.desc[lang]}</p>
              </span>
              <span className="service-treatment-action">
                <span>{c.viewService}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
  return (
    <main className={`service-detail-page service-detail-${slug === 'skin-hair-care' ? 'skin' : slug === 'infertility-care' ? 'fertility' : 'general'}`} aria-labelledby="service-detail-title">
      <section
        className={`service-detail-hero service-detail-hero-${isSkin ? 'skin' : isFertility ? 'infertility' : 'general'} aurora-bg`}
        style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="service-detail-hero-glow" aria-hidden="true" />
        <div className="service-detail-hero-grid-lines" aria-hidden="true" />
        <div className="container service-detail-grid">
          <div className="service-detail-copy appear-up">
            <button type="button" className="back-link" onClick={() => onNavigate('Home')} aria-label={c.back}>
              <ArrowLeft size={15} /> {c.back}
            </button>
            <span className="pill pill-teal float-soft">{label}</span>
            <h1 id="service-detail-title" className="gradient-text">
              {title}
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
            <div className="service-detail-hero-media">
              <Image
                src="/Hero_img.png"
                alt={isSkin ? (lang === 'bn' ? 'ত্বক ও চুলের যত্ন' : 'Skin and hair care') : isFertility ? (lang === 'bn' ? 'বন্ধ্যত্ব যত্ন' : 'Infertility care') : (lang === 'bn' ? 'চিন্তাশীল যত্ন' : 'Thoughtful care')}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBwYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaISc9Gh4gJCQnDyMmJiYiJjQkKisgMTM0JiciL/2wBDAQcHBwoIChMKChMoGhYaKtcaM46Pj5mUj5ObmVlZaKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL/2wBDAQcICAgICAkMCAkMEQwKCgsLCgoP/8AAEQgABgAKAAcAImYnMwEaGBcSEf/EADsQAAIBAwMDAgEFAQEBAQAAABICAwUGBREGEiExBhJBUciM/8QArEQAAgIBAwUGBQEBAAAAAAAAAAECEQMhEjEEBSExIkFRURQiMoEIFEKRobHRCSMzUv/EABkRAQACAuFwYf/aAAwAQEyEVSTdC9h4x/8QALREAAgIBAwUFAQEBAQAAAAAAAAECAwQFBhIxESExQVFh/8QALhEAAgGBBQUBAQEBAAAAAAAAAAAAAAECEQMhEjJBURV/8QAtREAAgICAQUFBQAAAAAAAAAAAAAAAQIDESEEEiExBkFh/9oADAMBAAIRAxEif/AN+g=="
              />
              <div className="service-detail-hero-media-overlay" aria-hidden="true" />
              <div className="service-detail-hero-badge">
                <ShieldCheck size={17} aria-hidden="true" />
                <span>{lang === 'bn' ? 'ব্যক্তিগত, যত্নশীল চিকিৎসা' : 'Private, thoughtful care'}</span>
              </div>
              <div className="service-detail-hero-caption">
                <span>{isSkin ? 'DERMATOLOGY · TRICHOLOGY' : 'REPRODUCTIVE HEALTH · WELLNESS'}</span>
                <strong>{lang === 'bn' ? 'আপনার গল্প দিয়ে শুরু' : 'Start with your story'}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isTreatmentShowcase && treatmentShowcaseMarkup}
      <ScrollReveal className="section service-detail-body" variant="up">
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
      </ScrollReveal>
      <ScrollReveal className="section service-detail-extra" variant="left">
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
      </ScrollReveal>
      {!isSkin && !isFertility && treatmentSectionMarkup}
      <ScrollReveal className="cta-section" variant="scale">
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
      </ScrollReveal>
      <FaqSection
        title={lang === 'bn' ? 'জিজ্ঞাসা' : 'Questions about this service'}
        lang={lang}
        items={[
          {
            question: lang === 'bn' ? 'এই চিকিৎসায় কতবার ভিজিট দরকার?' : 'How many visits are needed for this treatment?',
            answer: lang === 'bn'
              ? 'প্রয়োজনীয় ভিজি���ের সংখ্যা আপনার অবস্থার উপর নির্ভর করে। ডাঃ ইব্রাহিম প্রথম কনসালটেশনে একটি ব্যক্তিগত পরিকল্পনা তৈরি করবেন।'
              : 'The number of visits depends on your specific condition. Dr. Ibrahim will create a personalized treatment plan during your initial consultation.',
          },
          {
            question: lang === 'bn' ? 'চিকিৎসার পার্শ্বপ্রতিক্রিয়া কী?' : 'What are the side effects of this treatment?',
            answer: lang === 'bn'
              ? 'প্রতিটি চিকিৎসার মৃদু পার্শ্বপ্রতিক্রিয়া থাকতে পারে। ডাঃ ইব্রাহিম সবচেয়ে safer ব���যবস্থা ব্যবহার করেন এবং আপনাকে সম্পূর্ণ তথ্য দেন।'
              : 'Most treatments have minimal side effects. Dr. Ibrahim uses the safest approaches and will fully inform you of any potential effects before treatment.',
          },
          {
            question: lang === 'bn' ? 'এই চিকিৎসার জন্য প্রস্তুতি কী?' : 'How do I prepare for this treatment?',
            answer: lang === 'bn'
              ? 'প্রস্তুতি প্রয়োজনের উপর নির্ভর করে। সাধারণত স্বাস্থ্যকর জীবনযাত্রা বজায় রাখুন। নির্দিষ্ট প্রস্তুতি সম্পর্কে ডাঃ ইব্রাহিম আপনাকে Guide করবেন।'
              : 'Preparation varies by treatment. Generally, maintain a healthy lifestyle. Dr. Ibrahim will guide you on specific preparations during your consultation.',
          },
          {
            question: lang === 'bn' ? 'ফলাফল কতদিনে দেখা যাবে?' : 'How long before I see results?',
            answer: lang === 'bn'
              ? 'ফলাফলের সময় পরিকল্পনার উপর নির্ভর করে। কিছু চিকিৎসায় 2-4 সপ্তাহে improvement দেখা ���ায়, অন্যদের জন্য দীর্ঘ সময় লাগতে পারে।'
              : 'Results timelines vary by treatment plan. Some improvements may be visible in 2-4 weeks, while others may take longer. Dr. Ibrahim will set realistic expectations.',
          },
          {
            question: lang === 'bn' ? 'এই চিকিৎসার জন্য বolem বয়স সীমা কী?' : 'Is there an age limit for this treatment?',
            answer: lang === 'bn'
              ? 'প্রতিরোধমূলক ও যুবวัยকে alike চিকিৎসা সুবিধাজনক। ডাঃ ইব্রাহিম আপনার বয়স ও স্বাস্থ্যের অবস্থা মূল্যায়ন করে সেরা পরিকল্পনা দেবেন।'
              : 'Treatment is beneficial across age groups. Dr. Ibrahim will assess your age and health status to create the most suitable plan for you.',
          },
        ]}
      />
    </main>
  );
}
