'use client'

import { useState } from 'react'
import { ArrowRight, Check, Sparkles, ShieldCheck, BookOpen, HeartHandshake, Stethoscope, Quote } from 'lucide-react'
import { aboutCopy, doctorBio, sexualMedicineCopy, useLanguage, t as tT } from '../lib/translations'
import { ScrollReveal } from './scroll-reveal'

export function AboutPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { lang } = useLanguage()
  const a = aboutCopy[lang]
  const b = doctorBio[lang]
  const s = sexualMedicineCopy[lang]
  const [playing, setPlaying] = useState(false)
  return (
    <>
      <section className="about-hero aurora-bg" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="blob blob-1" style={{ width: 320, height: 320, top: -80, right: -60 }} />
        <div className="blob blob-3" style={{ width: 240, height: 240, bottom: -40, left: -40 }} />
        <div className="container about-hero-grid">
          <div className="appear-up">
            <span className="pill"><span className="heartbeat" style={{ display: 'inline-block' }}>●</span> {a.heroPill}</span>
            <h1 className="gradient-text">{a.heroTitle1} <em>{a.heroTitleEm}</em></h1>
            <p className="lead">{a.heroLead}</p>
            <div className="about-credentials reveal-stagger is-visible">
              {a.credentials.map((c, i) => <div key={i} className="lift"><strong className="counter">{c.strong}</strong><span>{c.label}</span></div>)}
            </div>
            <button className="btn btn-primary btn-pro shadow-glow-teal" onClick={() => onNavigate('Appointment')}>{a.bookConsult} <ArrowRight size={16}/></button>
          </div>
          <div className="about-portrait perspective" style={{ perspective: 1200 }}>
            <div className="tilt-3d float-3d" style={{ borderRadius: 18, overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=85" alt="Dr. Ibrahim, family physician" className="ken-burns"/>
            </div>
            <span className="portrait-caption glass" style={{ border: 0 }}>{b.name}<br/><small>{b.role}</small></span>
            <div className="orbit" style={{ width: 220, height: 220, top: -40, right: -40, position: 'absolute' }}><span className="orbit-dot"/></div>
          </div>
        </div>
      </section>

      <DoctorBioSection bio={b} onNavigate={onNavigate} />

      <SexualMedicineSection copy={s} onNavigate={onNavigate} />

      <section className="section about-story">
        <div className="container split-grid">
          <div className="appear-up">
            <span className="pill">{a.philosophyPill}</span>
            <h2>{a.philosophyTitle1} <em>{a.philosophyTitleEm}</em></h2>
            <p className="lead">{a.philosophyLead}</p>
            <p className="muted">{a.philosophyBody}</p>
          </div>
          <div className="principles reveal-stagger is-visible">
            {a.principles.map((p, i) => (
              <div key={i} className="card-3d lift tilt-3d">
                <span className="gradient-text">{p.n}</span>
                <div><h3>{p.title}</h3><p>{p.body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-video">
        <div className="container">
          <div className="section-heading">
            <div><span className="pill pill-teal">{a.videoPill}</span><h2>{a.videoTitle1} <em>{a.videoTitleEm}</em></h2></div>
            <p className="muted video-heading-copy">{a.videoBody}</p>
          </div>
          <div className="video-card" onClick={() => setPlaying(!playing)}>
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=85" alt="Dr. Ibrahim speaking in the clinic"/>
            <div className="video-shade"/>
            <button className="play-button" aria-label={playing ? (lang === 'bn' ? 'ভিডিও বিরতি' : 'Pause video') : (lang === 'bn' ? 'ভিডিও চালান' : 'Play video')}>{playing ? 'Ⅱ' : '▶'}</button>
            <div className="video-meta">
              <span>{a.videoMeta}</span>
              <strong>{a.videoTitleNow}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-details">
        <div className="container details-grid">
          <div>
            <span className="pill">{a.experiencePill}</span>
            <h2>{a.experienceTitle1} <em>{a.experienceTitleEm}</em></h2>
            <div className="timeline">
              {a.timeline.map((tl, i) => <div key={i}><strong>{tl.strong}</strong><span>{tl.span}</span></div>)}
            </div>
          </div>
          <div className="skills-card">
            <h3>{a.expertiseHeading}</h3>
            {a.expertise.map((x, i) => (
              <div className="skill-row" key={i}><span>0{i + 1}</span><strong>{x}</strong><Check size={16}/></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-extra">
        <div className="container">
          <div className="section-heading">
            <div><span className="pill pill-teal">{a.journeyPill}</span><h2>{a.journeyTitle1} <em>{a.journeyTitleEm}</em></h2></div>
            <p className="muted">{a.journeyBody}</p>
          </div>
          <div className="journey-grid">
            {a.journey.map((j, i) => (
              <article key={i}><span>{j.n}</span><h3>{j.title}</h3><p>{j.body}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container narrow">
          <span className="pill">{a.faqPill}</span>
          <h2>{a.faqTitle1} <em>{a.faqTitleEm}</em></h2>
          <div className="faq-list">
            {a.faqs.map((f, i) => (
              <details key={i} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div><span className="pill pill-teal">{a.ctaPill}</span><h2>{a.ctaTitle1}<br/><em>{a.ctaTitleEm}</em></h2></div>
          <div>
            <p>{a.ctaBody}</p>
            <button className="btn btn-primary" onClick={() => onNavigate('Appointment')}>{a.ctaBtn} <ArrowRight size={17}/></button>
          </div>
        </div>
      </section>
    </>
  )
}

function DoctorBioSection({ bio, onNavigate }: { bio: (typeof doctorBio)[keyof typeof doctorBio]; onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const bookLabel = lang === 'bn' ? 'এখনই অ্যাপয়েন্টমেন্ট বুক করুন' : 'Book an appointment now'
  return (
    <section className="section doctor-bio">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="pill pill-teal">{bio.eyebrow}</span>
            <h2>{bio.name} <em>— {bio.role}</em></h2>
          </div>
        </div>
        <p className="lead" style={{ maxWidth: 780 }}>{bio.intro}</p>

        <div className="bio-block">
          <h3><BookOpen size={18}/> {bio.educationTitle}</h3>
          <ul className="bio-list">
            {bio.education.map((e, i) => <li key={i}><Check size={16}/> <span>{e}</span></li>)}
          </ul>
        </div>

        <div className="bio-block bio-philosophy">
          <h3><Stethoscope size={18}/> {bio.philosophyTitle}</h3>
          <h4>{bio.philosophyHeading}</h4>
          <p>{bio.philosophyBody}</p>
          <p className="bio-quote"><Quote size={18}/> {bio.philosophyQuote}</p>
        </div>

        <div className="bio-block">
          <h3><Sparkles size={18}/> {bio.interestTitle}</h3>
          <div className="bio-interest-grid">
            {bio.interests.map((it, i) => (
              <article key={i} className="bio-interest-card">
                <span className="bio-num">{it.n}</span>
                <h4>{it.title}</h4>
                <p>{it.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="bio-block">
          <h3><HeartHandshake size={18}/> {bio.integrativeTitle}</h3>
          <p>{bio.integrativeBody}</p>
          <p><strong>{lang === 'bn' ? 'লক্ষ্য: ' : 'Goal: '}</strong>{bio.integrativeGoal}</p>
        </div>

        <div className="bio-block">
          <h3><ShieldCheck size={18}/> {bio.consultationTitle}</h3>
          <div className="bio-consult-grid">
            {bio.consultation.map((c, i) => (
              <div key={i} className="bio-consult-step">
                <span className="bio-num">{c.n}</span>
                <div>
                  <h4>{c.title}</h4>
                  <p>{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bio-block bio-commitment">
          <h3><HeartHandshake size={18}/> {bio.commitmentTitle}</h3>
          <ul className="bio-list">
            {bio.commitment.map((c, i) => <li key={i}><Check size={16}/> <span>{c}</span></li>)}
          </ul>
          <p className="bio-disclaimer">{bio.commitmentDisclaimer}</p>
          <button className="btn btn-primary" onClick={() => onNavigate('Appointment')}>{bookLabel} <ArrowRight size={16}/></button>
        </div>
      </div>
    </section>
  )
}

function SexualMedicineSection({ copy, onNavigate }: { copy: (typeof sexualMedicineCopy)[keyof typeof sexualMedicineCopy]; onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  return (
    <section className="section sexual-medicine">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="pill pill-coral">{copy.eyebrow}</span>
            <h2><em>{copy.title}</em></h2>
            <p className="lead" style={{ maxWidth: 760 }}>{copy.lead}</p>
          </div>
        </div>

        <div className="sexual-grid">
          <div className="sexual-column">
            <h3 className="sexual-heading">{copy.sexualHeading}</h3>
            {copy.sexual.map((item, i) => (
              <article key={i} className="sexual-card">
                <Check size={18}/>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="sexual-column">
            <h3 className="sexual-heading">{copy.maleHeading}</h3>
            {copy.male.map((item, i) => (
              <article key={i} className="sexual-card">
                <Check size={18}/>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="sexual-column">
            <h3 className="sexual-heading">{copy.femaleHeading}</h3>
            {copy.female.map((item, i) => (
              <article key={i} className="sexual-card">
                <Check size={18}/>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="sexual-approach">
          <ShieldCheck size={22}/>
          <div>
            <h3>{copy.approachHeading}</h3>
            <p>{copy.approachBody}</p>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('Appointment')}>{copy.cta} <ArrowRight size={16}/></button>
        </div>
      </div>
    </section>
  )
}
