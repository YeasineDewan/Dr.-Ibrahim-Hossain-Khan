'use client';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';
import { useLanguage } from '../lib/translations';

const CONTACT_LINKS = [
  {
    key: 'messenger',
    href: 'https://www.facebook.com/messages/t/601149109753571',
    img: '/ico/messenger.png',
    labelEn: 'Messenger',
    labelBn: 'মেসেঞ্জার',
    subEn: 'Chat with us on Facebook',
    subBn: 'ফেসবুকে আমাদের সাথে চ্যাট করুন',
    accent: '#1877f2',
    bg: 'linear-gradient(135deg, rgba(24,119,242,0.12), rgba(99,102,241,0.08))',
  },
  {
    key: 'telephone',
    href: 'tel:+8801719939553',
    img: '/ico/telephone.png',
    labelEn: 'Call',
    labelBn: 'কল করুন',
    subEn: '+880 1719-939553',
    subBn: '+৮৮০ ১৭১৯-৯৩৯৫৫৩',
    accent: '#174b78',
    bg: 'linear-gradient(135deg, rgba(23,75,120,0.12), rgba(20,184,166,0.08))',
  },
  {
    key: 'whatsapp',
    href: 'https://wa.me/8801719939553',
    img: '/ico/whatsapp.png',
    labelEn: 'WhatsApp',
    labelBn: 'ওয়াটসঅ্যাপ',
    subEn: 'Message for quick response',
    subBn: 'দ্রুত উত্তরের জন্য বার্তা পাঠান',
    accent: '#25d366',
    bg: 'linear-gradient(135deg, rgba(37,211,102,0.12), rgba(20,184,166,0.08))',
  },
] as const;

export function ContactSection() {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';

  return (
    <section
      className="contact-icons-section"
      style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        className="contact-icons-glow"
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          top: '-40%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div className="container" style={{ position: 'relative' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span className="section-eyebrow" style={{ color: '#3b9b91' }}>
              {isBn ? 'যোগাযোগ করুন' : 'GET IN TOUCH'}
            </span>
            <h2
              style={{
                marginTop: 14,
                fontSize: 'clamp(22px, 4vw, 30px)',
                lineHeight: 1.2,
              }}>
              {isBn ? 'আমাদের সাথে যুক্ত থাকুন' : "Stay connected with us"}
            </h2>
            <p
              className="muted"
              style={{
                marginTop: 10,
                maxWidth: 480,
                marginInline: 'auto',
                fontSize: 14,
              }}>
              {isBn
                ? 'নিচের 채্যানেলের যেকোনো একটি দিয়ে আমাদের সাথে যোগাযোগ করুন।'
                : 'Reach out through any of these channels — we&apos;re always happy to help.'}
            </p>
          </div>
        </ScrollReveal>

        <div className="contact-icons-grid">
          {CONTACT_LINKS.map((link, i) => (
            <ScrollReveal key={link.key} delay={i * 120}>
              <a
                href={link.href}
                target={link.href.startsWith('tel:') ? undefined : '_blank'}
                rel={link.href.startsWith('tel:') ? undefined : 'noreferrer'}
                className="contact-icon-card press"
                style={{
                  '--accent': link.accent,
                  '--accent-bg': link.bg,
                } as React.CSSProperties}>
                <div className="contact-icon-ring">
                  <div
                    className="contact-icon-img-wrap"
                    style={{
                      background: link.bg,
                    }}>
                    <Image
                      src={link.img}
                      alt={link.labelEn}
                      width={48}
                      height={48}
                      style={{ objectFit: 'contain' }}
                      priority={i === 0}
                    />
                  </div>
                </div>
                <div className="contact-icon-info">
                  <strong>{isBn ? link.labelBn : link.labelEn}</strong>
                  <span>{isBn ? link.subBn : link.subEn}</span>
                </div>
                <div className="contact-icon-arrow">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <div className="contact-phone-row">
            <a
              href="tel:+8801719939553"
              className="contact-phone-pill press"
              aria-label="Call us">
              <span className="contact-phone-pulse" />
              <Phone size={14} strokeWidth={2} />
              <span>+880 1719-939553</span>
            </a>
            <a
              href="mailto:hello@dribrahim.clinic"
              className="contact-email-pill press"
              aria-label="Email us">
              <Mail size={14} strokeWidth={2} />
              <span>hello@dribrahim.clinic</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
