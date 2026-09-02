'use client'
import { useState } from 'react'
import { ArrowRight, Check, Clock3, HeartPulse, Mail, MapPin, Phone, Send, ShieldCheck, Sparkles, Stethoscope, Star, UserRound, Activity, Users, BookOpen, Pill, Microscope } from 'lucide-react'
import { servicesCopy, contactCopy, useLanguage, t as tT, common } from '../lib/translations'
import { ScrollReveal } from './scroll-reveal'
import { Tilt3D, Magnetic } from './motion-3d'
import { HeartbeatArt, LeafArt, FamilyArt, StethoArt, PillArt, ShieldArt, DoctorArt, DnaArt, InfinityArt, ChatArt, GlobeArt, HourglassArt, CalendarArt, MapPinArt } from './illust-svg'

const illusts = [StethoArt, LeafArt, HeartbeatArt, PillArt, FamilyArt, ShieldArt]
const illustColors = [
  'rgba(20,184,166,0.12), rgba(99,102,241,0.08)',
  'rgba(34,197,94,0.12), rgba(6,182,212,0.08)',
  'rgba(244,63,94,0.10), rgba(236,72,153,0.08)',
  'rgba(168,85,247,0.10), rgba(236,72,153,0.08)',
  'rgba(59,155,145,0.12), rgba(14,165,233,0.08)',
  'rgba(20,184,166,0.12), rgba(13,148,136,0.08)',
]

const testimonials = (lang: 'en' | 'bn') => lang === 'bn' ? [
  ['"অবশেষে আমি শোনা অনুভব করলাম। পরিকল্পনাটি ছিল সহজ, ব্যক্তিগত এবং আমার রুটিনের সাথে মানানসই।"', 'আমারা মেনসাহ', 'যাচাইকৃত রোগী'],
  ['"ক্লিনিকের টিম প্রতিটি ধাপকে শান্ত করে তুলেছে। আমার ত্বকের উন্নতি হয়েছে এবং আত্মবিশ্বাস ফিরে এসেছে।"', 'নাদিয়া ওউসু', 'যাচাইকৃত রোগী'],
  ['"স্পষ্ট ব্যাখ্যা, কোনো চাপ নেই, এবং চিন্তাশীল ফলো-আপ। আমি ডাঃ ইব্রাহিমকে আন্তরিকভাবে সুপারিশ করি।"', 'কোয়ামে আসান্তে', 'যাচাইকৃত রোগী'],
] : [
  ['"I finally felt listened to. The plan was simple, personal and actually fit my routine."', 'Amara Mensah', 'Verified patient'],
  ['"The clinic team made every step feel calm. My skin has improved and my confidence is back."', 'Nadia Owusu', 'Verified patient'],
  ['"Clear explanations, no pressure, and thoughtful follow-up. I recommend Dr. Ibrahim wholeheartedly."', 'Kwame Asante', 'Verified patient'],
]

export function ServicesPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const s = servicesCopy[lang]
  const slugs = ['prp', 'psoriasis', 'vitiligo', 'ibs', 'integrative', 'preventive']
  return (
    <main className="page-section services-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="aurora-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}/>
      <div className="container" style={{ position: 'relative' }}>
        <ScrollReveal>
          <span className="section-eyebrow">{s.eyebrow}</span>
          <h1 className="gradient-text" style={{ marginTop: 14 }}>{s.title1} <em>{s.titleEm}</em></h1>
          <p className="lead max-copy">{s.lead}</p>
        </ScrollReveal>
        <div className="service-intro">
          <ScrollReveal>
            <div>
              <span className="section-eyebrow">{s.promisePill}</span>
              <h2 style={{ marginTop: 14 }}>{s.promiseTitle1}<br/><em>{s.promiseTitleEm}</em></h2>
            </div>
          </ScrollReveal>
          <div className="service-promise grid-cards">
            {s.promiseList.map((p, i) => (
              <div key={i} className="premium-card lift shine-card" style={{ padding: 18 }}>
                <span className="num-badge">0{i+1}</span>
                <div style={{ marginLeft: 12 }}>
                  <strong style={{ display: 'block', fontSize: 14, color: '#0f172a' }}>{p.strong}</strong>
                  <span className="muted" style={{ fontSize: 13 }}>{p.body}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="treatment-grid grid-cards">
          {s.treatments.map((x, i) => {
            const Illust = illusts[i % illusts.length]
            return (
              <Tilt3D key={x.title} max={5} className="treatment-card premium-card shine-card" style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}>
                <div style={{ background: `linear-gradient(135deg, ${illustColors[i % illustColors.length]})`, aspectRatio: '1.8/1', display: 'grid', placeItems: 'center', position: 'relative' }}>
                  <Illust style={{ width: '60%', height: '85%' }}/>
                  <span className="num-badge" style={{ position: 'absolute', top: 12, left: 12, width: 28, height: 28, fontSize: 12 }}>0{i+1}</span>
                </div>
                <div style={{ padding: 22 }}>
                  <h3>{x.title}</h3>
                  <p>{x.body}</p>
                  <div>
                    <span><Clock3 size={14}/> {x.time}</span>
                    <strong>{x.price}</strong>
                  </div>
                  <button onClick={() => onNavigate(`Service:${slugs[i]}`)} className="text-link link-underline pill-arrow">{s.viewService} <ArrowRight size={15} className="float-x"/></button>
                </div>
              </Tilt3D>
            )
          })}
        </div>
        <ScrollReveal>
          <div className="service-bottom premium-card shine-card" style={{ marginTop: 40 }}>
            <div>
              <span className="section-eyebrow">{s.bottomEyebrow}</span>
              <h2 style={{ marginTop: 14 }}>{s.bottomTitle1} <em>{s.bottomTitleEm}</em></h2>
              <p className="muted">{s.bottomBody}</p>
            </div>
            <Magnetic>
              <button className="btn btn-primary btn-pro shadow-glow-teal btn-tilt" onClick={() => onNavigate('Appointment')}>{s.bottomBtn} <ArrowRight size={16} className="float-x"/></button>
            </Magnetic>
          </div>
        </ScrollReveal>
      </div>
    </main>
  )
}

export function ContactPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const c = contactCopy[lang]
  const cm = common[lang]
  const [sent, setSent] = useState(false)
  return (
    <main className="page-section contact-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="grid-dots" style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}/>
      <div className="container" style={{ position: 'relative' }}>
        <ScrollReveal>
          <div className="contact-hero">
            <div>
              <span className="section-eyebrow">{c.eyebrow}</span>
              <h1 className="gradient-text" style={{ marginTop: 14 }}>{c.title1} <em>{c.titleEm}</em></h1>
              <p className="lead">{c.lead}</p>
              <div className="contact-details grid-cards">
                <div className="premium-card lift shine-card" style={{ padding: 20 }}>
                  <span className="icon-halo" style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(99,102,241,0.1))', color: '#0d6e63', display: 'grid', placeItems: 'center' }}><Phone size={20}/></span>
                  <div style={{ marginTop: 12 }}><strong>{c.callHeading}</strong><p style={{ fontSize: 13, color: '#647985', margin: '4px 0 0' }}>+880 1719 395 553</p><small style={{ color: '#94a3b8', fontSize: 11 }}>{c.callHours}</small></div>
                </div>
                <div className="premium-card lift shine-card" style={{ padding: 20 }}>
                  <span className="icon-halo" style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(245,158,11,0.1))', color: '#be185d', display: 'grid', placeItems: 'center' }}><Mail size={20}/></span>
                  <div style={{ marginTop: 12 }}><strong>{c.emailHeading}</strong><p style={{ fontSize: 13, color: '#647985', margin: '4px 0 0' }}>hello@dribrahim.clinic</p><small style={{ color: '#94a3b8', fontSize: 11 }}>{c.emailHours}</small></div>
                </div>
                <div className="premium-card lift shine-card" style={{ padding: 20 }}>
                  <span className="icon-halo" style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(20,184,166,0.1))', color: '#4f46e5', display: 'grid', placeItems: 'center' }}><MapPin size={20}/></span>
                  <div style={{ marginTop: 12 }}><strong>{c.visitHeading}</strong><p style={{ fontSize: 13, color: '#647985', margin: '4px 0 0' }}>{c.visitSub}</p><small style={{ color: '#94a3b8', fontSize: 11 }}>{c.visitAddress}</small></div>
                </div>
              </div>
            </div>
            <div className="contact-form-card premium-card" style={{ background: '#fff' }}>
              {sent ? (
                <div className="contact-success">
                  <span className="icon-halo" style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #14b8a6, #6366f1)', color: '#fff', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}><Check size={28}/></span>
                  <h2>{cm.messageReceived}</h2>
                  <p>{cm.messageReceivedBody}</p>
                  <button className="btn btn-outline btn-pro" onClick={() => setSent(false)}>{cm.sendAnother}</button>
                </div>
              ) : (
                <>
                  <span className="section-eyebrow">{c.pill}</span>
                  <h2 style={{ marginTop: 10 }}>{c.formTitle}</h2>
                  <div className="contact-form">
                    <label>{c.namePh.replace('Full name', cm.fullName)}<input placeholder={c.namePh} className="glow-focus"/></label>
                    <label>{c.emailHeading.replace('Email us', cm.emailAddress)}<input type="email" placeholder={c.emailPh} className="glow-focus"/></label>
                    <label>{cm.phoneNumber}<input placeholder={c.phonePh} className="glow-focus"/></label>
                    <label>{c.topicLabel}<select className="glow-focus">{c.topics.map(o => <option key={o}>{o}</option>)}</select></label>
                    <label className="wide">{c.messageLabel}<textarea placeholder={c.messagePh} className="glow-focus"/></label>
                    <button className="btn btn-primary wide btn-pro shadow-glow-teal btn-tilt" onClick={() => setSent(true)}>{c.sendBtn} <Send size={15} className="float-x"/></button>
                  </div>
                </>
              )}
            </div>
          </div>
        </ScrollReveal>
        <div className="chamber-map-grid grid-cards">
          <article className="premium-card lift shine-card" style={{ padding: 18 }}>
            <div className="map-art" style={{ height: 140, borderRadius: 12, background: 'linear-gradient(135deg, #14b8a6, #6366f1)', display: 'grid', placeItems: 'center', marginBottom: 14, color: '#fff' }}><MapPin size={32} className="float-soft"/></div>
            <h3>{lang === 'bn' ? 'ধানমন্ডি চেম্বার' : 'Dhanmondi Chamber'}</h3>
            <p>{lang === 'bn' ? 'আমেরিকান ওয়েলনেস সেন্টার' : 'American Wellness Center'}</p>
            <a className="btn btn-outline btn-pro" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('House 45, Road 22, Dhanmondi, Dhaka')}`} target="_blank" rel="noreferrer">{lang === 'bn' ? 'দিকনির্দেশ' : 'Directions'}</a>
          </article>
        </div>
      </div>
    </main>
  )
}
