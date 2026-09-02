'use client'
import { useState } from 'react'
import { ArrowRight, Check, Clock3, Mail, MapPin, Phone, Send, ShieldCheck, Star, UserRound } from 'lucide-react'
import { servicesCopy, contactCopy, reviewsCopy, useLanguage, t as tT, common } from '../lib/translations'

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
    <main className="page-section services-page">
      <div className="container">
        <span className="eyebrow">{s.eyebrow}</span>
        <h1>{s.title1} <em>{s.titleEm}</em></h1>
        <p className="lead max-copy">{s.lead}</p>
        <div className="service-intro">
          <div>
            <span className="pill pill-teal">{s.promisePill}</span>
            <h2>{s.promiseTitle1}<br/><em>{s.promiseTitleEm}</em></h2>
          </div>
          <div className="service-promise">
            {s.promiseList.map((p, i) => (
              <div key={i}><Check size={18}/><span><strong>{p.strong}</strong> {p.body}</span></div>
            ))}
          </div>
        </div>
        <div className="treatment-grid">
          {s.treatments.map((x, i) => (
            <article className="treatment-card" key={x.title}>
              <span className="treatment-number">0{i+1}</span>
              <h3>{x.title}</h3>
              <p>{x.body}</p>
              <div>
                <span><Clock3 size={14}/> {x.time}</span>
                <strong>{x.price}</strong>
              </div>
              <button onClick={() => onNavigate(`Service:${slugs[i]}`)} className="text-link">{s.viewService} <ArrowRight size={15}/></button>
            </article>
          ))}
        </div>
        <div className="service-bottom">
          <div>
            <span className="eyebrow">{s.bottomEyebrow}</span>
            <h2>{s.bottomTitle1} <em>{s.bottomTitleEm}</em></h2>
            <p className="muted">{s.bottomBody}</p>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('Appointment')}>{s.bottomBtn} <ArrowRight size={16}/></button>
        </div>
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
    <main className="page-section contact-page">
      <div className="container">
        <div className="contact-hero">
          <div>
            <span className="eyebrow">{c.eyebrow}</span>
            <h1>{c.title1} <em>{c.titleEm}</em></h1>
            <p className="lead">{c.lead}</p>
            <div className="contact-details">
              <div>
                <span><Phone size={17}/></span>
                <p><strong>{c.callHeading}</strong>+880 1719 395 553<br/><small>{c.callHours}</small></p>
              </div>
              <div>
                <span><Mail size={17}/></span>
                <p><strong>{c.emailHeading}</strong>hello@dribrahim.clinic<br/><small>{c.emailHours}</small></p>
              </div>
              <div>
                <span><MapPin size={17}/></span>
                <p><strong>{c.visitHeading}</strong>{c.visitSub}<br/><small>{c.visitAddress}</small></p>
              </div>
            </div>
          </div>
          <div className="contact-form-card">
            {sent ? (
              <div className="contact-success">
                <span><Check size={24}/></span>
                <h2>{cm.messageReceived}</h2>
                <p>{cm.messageReceivedBody}</p>
                <button className="btn btn-outline" onClick={() => setSent(false)}>{cm.sendAnother}</button>
              </div>
            ) : (
              <>
                <span className="pill pill-teal">{c.pill}</span>
                <h2>{c.formTitle}</h2>
                <div className="contact-form">
                  <label>{c.namePh.replace('Full name', cm.fullName)}<input placeholder={c.namePh}/></label>
                  <label>{c.emailHeading.replace('Email us', cm.emailAddress)}<input type="email" placeholder={c.emailPh}/></label>
                  <label>{cm.phoneNumber}<input placeholder={c.phonePh}/></label>
                  <label>{c.topicLabel}<select>{c.topics.map(o => <option key={o}>{o}</option>)}</select></label>
                  <label className="wide">{c.messageLabel}<textarea placeholder={c.messagePh}/></label>
                  <button className="btn btn-primary wide" onClick={() => setSent(true)}>{c.sendBtn} <Send size={15}/></button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="chamber-map-grid">
          <article>
            <div className="map-art"><MapPin size={32}/></div>
            <h3>{lang === 'bn' ? 'ধানমন্ডি চেম্বার' : 'Dhanmondi Chamber'}</h3>
            <p>{lang === 'bn' ? 'আমেরিকান ওয়েলনেস সেন্টার' : 'American Wellness Center'}</p>
            <a className="btn btn-outline" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('House 45, Road 22, Dhanmondi, Dhaka')}`} target="_blank" rel="noreferrer">{lang === 'bn' ? 'দিকনির্দেশ' : 'Directions'}</a>
          </article>
        </div>
      </div>
    </main>
  )
}

export function ShopReviews() {
  const { lang } = useLanguage()
  const r = reviewsCopy[lang]
  const list = testimonials(lang)
  return (
    <section className="shop-reviews">
      <div className="container">
        <div className="section-heading">
          <div><span className="eyebrow">{r.eyebrow}</span><h2>{r.title1} <em>{r.titleEm}</em></h2></div>
          <div className="review-summary">
            <strong>{r.rating}</strong>
            <span><span className="stars">★★★★★</span><small>{r.based}</small></span>
          </div>
        </div>
        <div className="testimonial-grid">
          {list.map((x, i) => (
            <article key={i}>
              <div className="stars">★★★★★</div>
              <p>{x[0]}</p>
              <footer>
                <span className="review-avatar"><UserRound size={15}/></span>
                <span><strong>{x[1]}</strong><small>{x[2]}</small></span>
                <ShieldCheck size={15}/>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function RatingControl() {
  const { lang } = useLanguage()
  const r = reviewsCopy[lang]
  const [rating, setRating] = useState(0)
  return (
    <div className="rating-control">
      <span>{r.rateLine}</span>
      {[1,2,3,4,5].map(n => (
        <button key={n} aria-label={`${n} ${lang === 'bn' ? 'স্টার' : 'stars'}`} onClick={() => setRating(n)}>
          <Star size={17} fill={n <= rating ? 'currentColor' : 'none'}/>
        </button>
      ))}
      {rating > 0 && <small>{rating}/5</small>}
    </div>
  )
}
