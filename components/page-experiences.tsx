'use client'
import { useEffect, useState } from 'react'
import { ArrowRight, Check, Clock, Heart, MapPin, Plus, Star, Video, X, CalendarDays, Sparkles } from 'lucide-react'
import { chambersCopy, galleryCopy, appointmentCopy, checkoutCopy, successCopy, common, useLanguage, t as tT } from '../lib/translations'
import { ScrollReveal } from './scroll-reveal'
import { Tilt3D, Magnetic, Particles } from './motion-3d'

const imgs = [
  'photo-1559757175-0eb30cd8c063','photo-1576091160399-112ba8d25d1d','photo-1579684385127-1ef15d508118',
  'photo-1551076805-e1869033e561','photo-1584982751601-97dcc096659c','photo-1576091160550-2173dba999ef',
  'photo-1538108149393-fbbd81895907','photo-1584515933487-779824d29309','photo-1638202993928-7d8e8c3d5c8b4a',
  'photo-1576091160399-112ba8d25d1d','photo-1559757175-0eb30cd8c063','photo-1579684385127-1ef15d508118',
  'photo-1584982751601-97dcc096659c','photo-1538108149393-fbbd81895907','photo-1584515933487-779824d29309',
  'photo-1638202993928-7d8e8c3d5c8b4a'
]
const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`

export function GalleryPage() {
  const { lang } = useLanguage()
  const g = galleryCopy[lang]
  const [slide, setSlide] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const videoSlides = [
    { title: lang === 'bn' ? 'নরওয়ে: এক সময়-ভ্রমণ' : 'Norway: A time-lapse adventure', meta: lang === 'bn' ? 'ভ্রমণ • ০৪:১২' : 'Travel film • 04:12' },
    { title: lang === 'bn' ? 'চিকিৎসার নেপথ্যে' : 'Behind the care', meta: lang === 'bn' ? 'ক্লিনিক • ০২:৪৮' : 'Clinic story • 02:48' },
    { title: lang === 'bn' ? 'সুস্থতার গল্প' : 'Stories of recovery', meta: lang === 'bn' ? 'রোগীর গল্প • ০৩:২০' : 'Patient story • 03:20' },
    { title: lang === 'bn' ? 'আমাদের চেম্বার' : 'Inside our chambers', meta: lang === 'bn' ? 'পরিদর্শন • ০১:৫৬' : 'Clinic tour • 01:56' },
  ]
  useEffect(() => {
    const timer = window.setInterval(() => setSlide(current => (current + 1) % videoSlides.length), 6000)
    return () => window.clearInterval(timer)
  }, [videoSlides.length])
  const videoImage = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-VvLb8utyvJRSqBnQiP8yeuq4NcQ5fr.png'
  return (
    <main className="page-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="aurora-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}/>
      <div className="container" style={{ position: 'relative' }}>
        <ScrollReveal>
          <span className="section-eyebrow">{g.eyebrow}</span>
          <h1 className="gradient-text" style={{ marginTop: 14 }}>{g.title1} <em>{g.titleEm}</em></h1>
          <p className="lead max-copy">{g.lead}</p>
        </ScrollReveal>
        <div className="gallery-grid grid-cards">
          {imgs.slice(0, 9).map((x, i) => (
            <div key={i} className="img-zoom" style={{ borderRadius: 18, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 12px 32px -12px rgba(15,42,68,0.18)' }} onClick={() => setLightbox(i)}>
              <img src={photo(x)} alt={`Clinic gallery ${i+1}`} className="ken-burns" style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}/>
            </div>
          ))}
        </div>
        <section className="gallery-video-showcase" aria-label={g.videoEyebrow}>
          <div className="gallery-video-head"><div><span className="section-eyebrow">{g.videoEyebrow}</span><h2>{g.videoTitle1} <em>{g.videoTitleEm}</em></h2><p>{g.videoBody}</p></div><div className="gallery-video-controls"><button aria-label={lang === 'bn' ? 'আগের ভিডিও' : 'Previous video'} onClick={() => setSlide((slide - 1 + videoSlides.length) % videoSlides.length)}><ArrowRight size={18} style={{ transform: 'rotate(180deg)' }}/></button><span>{String(slide + 1).padStart(2, '0')} / {String(videoSlides.length).padStart(2, '0')}</span><button aria-label={lang === 'bn' ? 'পরের ভিডিও' : 'Next video'} onClick={() => setSlide((slide + 1) % videoSlides.length)}><ArrowRight size={18}/></button></div></div>
          <div className="gallery-video-grid">{[0, 1].map((offset) => { const item = videoSlides[(slide + offset) % videoSlides.length]; return <article className="gallery-video-card" key={`${slide}-${offset}`}><div className="gallery-video-media"><img src={videoImage} alt={item.title} loading="lazy"/><span className="gallery-video-wash"/><button className="gallery-video-play" aria-label={`${lang === 'bn' ? 'প্লে' : 'Play'} ${item.title}`}><span>▶</span></button><span className="gallery-video-index">0{((slide + offset) % videoSlides.length) + 1}</span></div><div className="gallery-video-meta"><div><span>{item.meta}</span><h3>{item.title}</h3></div><ArrowRight size={18}/></div></article> })}</div>
          <div className="gallery-video-dots">{videoSlides.map((_, index) => <button key={index} aria-label={`${lang === 'bn' ? 'ভিডিও' : 'Video'} ${index + 1}`} className={index === slide ? 'active' : ''} onClick={() => setSlide(index)}/>)}</div>
        </section>
      </div>
      {lightbox !== null && (
        <div className="admin-modal-backdrop" style={{ zIndex: 200 }} onClick={() => setLightbox(null)}>
          <div className="admin-form-card" style={{ width: 'min(900px, 100%)', padding: 0, background: 'transparent', boxShadow: 'none' }} onClick={(e) => e.stopPropagation()}>
            <img src={photo(imgs[lightbox])} alt="" style={{ width: '100%', borderRadius: 16 }}/>
            <button className="modal-close" style={{ color: '#fff', top: 12, right: 12 }} onClick={() => setLightbox(null)}><X/></button>
          </div>
        </div>
      )}
    </main>
  )
}

export function ChambersPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const ch = chambersCopy[lang]
  return (
    <main className="page-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="grid-dots" style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}/>
      <div className="container" style={{ position: 'relative' }}>
        <ScrollReveal>
          <span className="section-eyebrow">{ch.eyebrow}</span>
          <h1 className="gradient-text" style={{ marginTop: 14 }}>{ch.title1} <em>{ch.titleEm}</em></h1>
          <p className="lead max-copy">{ch.lead}</p>
        </ScrollReveal>
        <div className="chamber-grid grid-cards">
          {ch.chambers.map((c, i) => (
            <Tilt3D key={c.name} max={5} className={`chamber-card chamber-${i} premium-card shine-card`}>
              <div className="chamber-top">
                <span className="num-badge" style={{ background: 'linear-gradient(135deg, #14b8a6, #6366f1)' }}>0{i+1}</span>
                <span className="icon-halo" style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(99,102,241,0.1))', color: '#0d6e63', display: 'grid', placeItems: 'center' }}><MapPin size={18}/></span>
              </div>
              <h2>{c.name}</h2>
              <strong>{c.place}</strong>
              <p>{c.address}</p>
              <div className="chamber-hours">
                <Clock size={15} className="pulse" style={{ color: '#14b8a6' }}/>
                <span>{ch.visitingHours}<strong>{c.hours}</strong></span>
              </div>
              <div className="chamber-map" style={{ borderRadius: 12, background: 'linear-gradient(135deg, #14b8a6, #6366f1)', color: '#fff', padding: 24, textAlign: 'center' }}>
                <div className="map-grid"/>
                <MapPin size={28} className="float-soft"/>
                <span style={{ display: 'block', marginTop: 6 }}>{ch.mapLabel}</span>
              </div>
              <div className="chamber-actions">
                <a className="btn btn-outline btn-pro" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`} target="_blank" rel="noreferrer">{ch.directions}</a>
                <Magnetic>
                  <button className="btn btn-primary btn-pro shadow-glow-teal btn-tilt" onClick={() => onNavigate('Appointment')}>{ch.bookHere}</button>
                </Magnetic>
              </div>
            </Tilt3D>
          ))}
        </div>
      </div>
    </main>
  )
}

export function AppointmentFlow({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const a = appointmentCopy[lang]
  const cm = common[lang]
  const [step, setStep] = useState(1)
  const [service, setService] = useState('')
  const [chamber, setChamber] = useState('')
  const chambers = chambersCopy[lang].chambers
  const dates = lang === 'bn' ? ['মঙ্গল ১২', 'বুধ ১৩', 'বৃহ ১৪', 'শনি ১৬'] : ['Tue 12','Wed 13','Thu 14','Sat 16']
  const times = lang === 'bn' ? ['সকাল ০৯:০০','সকাল ১০:৩০','দুপুর ০২:০০','বিকাল ০৪:৩০','সন্ধ্যা ০৬:০০'] : ['09:00 AM','10:30 AM','02:00 PM','04:30 PM','06:00 PM']
  return (
    <main className="page-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="aurora-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}/>
      <div className="container narrow" style={{ position: 'relative' }}>
        <ScrollReveal>
          <span className="section-eyebrow">{a.eyebrow}</span>
          <h1 className="gradient-text" style={{ marginTop: 14 }}>{a.title1} <em>{a.titleEm}</em></h1>
        </ScrollReveal>
        <div className="booking-progress">
          {a.steps.map((x, i) => (
            <div className={`${step === i+1 ? 'active' : ''} ${step > i+1 ? 'done' : ''}`} key={x}><span>{step > i+1 ? <Check size={14}/> : i+1}</span>{x}</div>
          ))}
        </div>
        <div className="booking-card premium-card" style={{ background: '#fff' }} key={step}>
          <span className="section-eyebrow">{a.step} 0{step}</span>
          {step === 1 && (
            <>
              <h2>{a.helpTitle}</h2>
              <p className="muted">{a.helpBody}</p>
              <div className="option-grid">
                {a.services.map(x => (
                  <button className={`${service === x ? 'selected' : ''} press btn-pro`} onClick={() => setService(x)} key={x}>{x}<ArrowRight size={15} className="float-x"/></button>
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2>{a.timeTitle}</h2>
              <div className="date-grid">
                {dates.map((x, i) => (
                  <button className={`${i === 1 ? 'selected' : ''} press`} key={x}>
                    {x}<small>{lang === 'bn' ? 'মে ২০২৬' : 'May 2026'}</small>
                  </button>
                ))}
              </div>
              <div className="time-grid">{times.map(x => <button key={x} className="press">{x}</button>)}</div>
              <h3 className="booking-subhead">{a.subhead}</h3>
              <div className="mini-options">
                {chambers.map(c => (
                  <button className={`${chamber === c.name ? 'selected' : ''} press`} onClick={() => setChamber(c.name)} key={c.name}>{c.name}<small>{c.hours}</small></button>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2>{a.detailsTitle}</h2>
              <div className="form-grid">
                {a.details.map((d, i) => ('textarea' in d ? <textarea key={i} placeholder={d.ph} className="glow-focus"/> : <input key={i} placeholder={d.ph} className="glow-focus"/>))}
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <div className="success-icon" style={{ background: 'linear-gradient(135deg, #14b8a6, #6366f1)', color: '#fff' }}><Check/></div>
              <h2>{a.reviewTitle}</h2>
              <div className="review-list">
                {a.review.map((label, i) => (
                  <p key={i}><span>{label}</span><strong>{i === 0 ? (service || a.services[0]) : i === 1 ? (dates[1] + ', ' + times[1]) : i === 2 ? (chamber || chambers[0].name) : (lang === 'bn' ? '২০ মিনিট' : '20 minutes')}</strong></p>
                ))}
              </div>
              <p className="muted">{a.reviewNote}</p>
              <button className="btn btn-primary full btn-pro shadow-glow-teal btn-tilt" onClick={() => onNavigate('Appointment')}>{a.confirmBtn}</button>
            </>
          )}
          <div className="booking-nav">
            {step > 1 && <button className="btn btn-outline btn-pro" onClick={() => setStep(step - 1)}>{cm.back}</button>}
            {step < 4 && <Magnetic><button className="btn btn-primary btn-pro shadow-glow-teal btn-tilt" onClick={() => setStep(step + 1)}>{cm.next} <ArrowRight size={16} className="float-x"/></button></Magnetic>}
          </div>
        </div>
      </div>
    </main>
  )
}

export function CheckoutPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const c = checkoutCopy[lang]
  return (
    <main className="page-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="aurora-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}/>
      <div className="container narrow" style={{ position: 'relative' }}>
        <ScrollReveal>
          <span className="section-eyebrow">{c.eyebrow}</span>
          <h1 className="gradient-text" style={{ marginTop: 14 }}>{c.title1} <em>{c.titleEm}</em></h1>
        </ScrollReveal>
        <div className="checkout-form premium-card" style={{ background: '#fff' }}>
          <h2>{c.deliveryHeading}</h2>
          <div className="form-grid">
            {c.deliveryFields.map((f, i) => ('textarea' in f ? <textarea key={i} placeholder={f.ph} className="glow-focus"/> : <input key={i} placeholder={f.ph} className="glow-focus"/>))}
          </div>
          <h2>{c.paymentHeading}</h2>
          <div className="payment-options">
            {c.paymentOptions.map((o, i) => <button key={o} className={`${i === 0 ? 'selected' : ''} press btn-pro`}>{o}</button>)}
          </div>
          <div className="checkout-summary">
            <p>{c.summary[0]} <strong className="stat-num">{lang === 'bn' ? '৳ ২,৮০০' : '$28'}</strong></p>
            <p>{c.summary[1]} <strong className="stat-num">{lang === 'bn' ? '৳ ৩০০' : '$3'}</strong></p>
            <hr/>
            <p>{c.summary[2]} <strong className="stat-num" style={{ fontSize: 18 }}>{lang === 'bn' ? '৳ ৩,১০০' : '$31'}</strong></p>
          </div>
          <Magnetic>
            <button className="btn btn-primary full btn-pro shadow-glow-teal btn-tilt" onClick={() => onNavigate('Success')}>{c.placeBtn} <ArrowRight size={16} className="float-x"/></button>
          </Magnetic>
        </div>
      </div>
    </main>
  )
}

export function SuccessPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const s = successCopy[lang]
  return (
    <main className="page-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="aurora-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }}/>
      <Particles count={18}/>
      <div className="container narrow success-page" style={{ position: 'relative', textAlign: 'center' }}>
        <div className="appear-zoom" style={{ width: 96, height: 96, margin: '0 auto 24px', borderRadius: '50%', background: 'linear-gradient(135deg, #14b8a6, #6366f1)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 24px 60px -12px rgba(20,184,166,0.5)' }}>
          <Check size={48} strokeWidth={3}/>
        </div>
        <span className="section-eyebrow">{s.eyebrow}</span>
        <h1 className="gradient-text" style={{ marginTop: 14 }}>{s.title1} <em>{s.titleEm}</em></h1>
        <p className="lead">{s.body}</p>
        <Magnetic>
          <button className="btn btn-primary btn-pro shadow-glow-teal btn-tilt" onClick={() => onNavigate('Home')}>{s.btn} <ArrowRight size={16} className="float-x"/></button>
        </Magnetic>
      </div>
    </main>
  )
}
