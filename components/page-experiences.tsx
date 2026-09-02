'use client'
import { useEffect, useState } from 'react'
import { ArrowRight, Check, Clock, Heart, MapPin, Plus, ShoppingBag, Star, Video, X, CalendarDays } from 'lucide-react'
import { chambersCopy, galleryCopy, appointmentCopy, shopCopy, checkoutCopy, successCopy, common, useLanguage, t as tT } from '../lib/translations'

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
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % 3), 4500)
    return () => clearInterval(t)
  }, [])
  return (
    <main className="page-section">
      <div className="container">
        <span className="eyebrow">{g.eyebrow}</span>
        <h1>{g.title1} <em>{g.titleEm}</em></h1>
        <p className="lead max-copy">{g.lead}</p>
        <div className="gallery-grid">
          {imgs.map((x, i) => <img key={i} src={photo(x)} alt={`Clinic gallery ${i+1}`}/>)}
        </div>
        <div className="video-feature">
          <img src={photo(['photo-1576091160550-2173dba999ef','photo-1576091160399-112ba8d25d1d','photo-1559757175-0eb30cd8c063'][slide])} alt="Clinic video feature"/>
          <div>
            <span className="eyebrow">{g.videoEyebrow} · 0{slide+1}</span>
            <h2>{g.videoTitle1} <em>{g.videoTitleEm}</em></h2>
            <p>{g.videoBody}</p>
            <button className="video-next" onClick={() => setSlide((slide + 1) % 3)} aria-label={lang === 'bn' ? 'পরবর্তী ভিডিও' : 'Next video'}><ArrowRight size={18}/></button>
          </div>
        </div>
      </div>
    </main>
  )
}

export function ChambersPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const ch = chambersCopy[lang]
  return (
    <main className="page-section">
      <div className="container">
        <span className="eyebrow">{ch.eyebrow}</span>
        <h1>{ch.title1} <em>{ch.titleEm}</em></h1>
        <p className="lead max-copy">{ch.lead}</p>
        <div className="chamber-grid">
          {ch.chambers.map((c, i) => (
            <article className={`chamber-card chamber-${i}`} key={c.name}>
              <div className="chamber-top">
                <span className="chamber-number">0{i+1}</span>
                <MapPin/>
              </div>
              <h2>{c.name}</h2>
              <strong>{c.place}</strong>
              <p>{c.address}</p>
              <div className="chamber-hours">
                <Clock size={15}/>
                <span>{ch.visitingHours}<strong>{c.hours}</strong></span>
              </div>
              <div className="chamber-map">
                <div className="map-grid"/>
                <MapPin size={28}/>
                <span>{ch.mapLabel}</span>
              </div>
              <div className="chamber-actions">
                <a className="btn btn-outline" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`} target="_blank" rel="noreferrer">{ch.directions}</a>
                <button className="btn btn-primary" onClick={() => onNavigate('Appointment')}>{ch.bookHere}</button>
              </div>
            </article>
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
    <main className="page-section">
      <div className="container narrow">
        <span className="eyebrow">{a.eyebrow}</span>
        <h1>{a.title1} <em>{a.titleEm}</em></h1>
        <div className="booking-progress">
          {a.steps.map((x, i) => (
            <div className={step === i+1 ? 'active' : ''} key={x}><span>{i+1}</span>{x}</div>
          ))}
        </div>
        <div className="booking-card">
          <span className="eyebrow">{a.step} 0{step}</span>
          {step === 1 && (
            <>
              <h2>{a.helpTitle}</h2>
              <p className="muted">{a.helpBody}</p>
              <div className="option-grid">
                {a.services.map(x => (
                  <button className={service === x ? 'selected' : ''} onClick={() => setService(x)} key={x}>{x}<ArrowRight size={15}/></button>
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2>{a.timeTitle}</h2>
              <div className="date-grid">
                {dates.map((x, i) => (
                  <button className={i === 1 ? 'selected' : ''} key={x}>
                    {x}<small>{lang === 'bn' ? 'মে ২০২৬' : 'May 2026'}</small>
                  </button>
                ))}
              </div>
              <div className="time-grid">{times.map(x => <button key={x}>{x}</button>)}</div>
              <h3 className="booking-subhead">{a.subhead}</h3>
              <div className="mini-options">
                {chambers.map(c => (
                  <button className={chamber === c.name ? 'selected' : ''} onClick={() => setChamber(c.name)} key={c.name}>{c.name}<small>{c.hours}</small></button>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2>{a.detailsTitle}</h2>
              <div className="form-grid">
                {a.details.map((d, i) => d.textarea ? <textarea key={i} placeholder={d.ph}/> : <input key={i} placeholder={d.ph}/>)}
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <div className="success-icon"><Check/></div>
              <h2>{a.reviewTitle}</h2>
              <div className="review-list">
                {a.review.map((label, i) => (
                  <p key={i}><span>{label}</span><strong>{i === 0 ? (service || a.services[0]) : i === 1 ? (dates[1] + ', ' + times[1]) : i === 2 ? (chamber || chambers[0].name) : (lang === 'bn' ? '২০ মিনিট' : '20 minutes')}</strong></p>
                ))}
              </div>
              <p className="muted">{a.reviewNote}</p>
              <button className="btn btn-primary full" onClick={() => onNavigate('Appointment')}>{a.confirmBtn}</button>
            </>
          )}
          <div className="booking-nav">
            {step > 1 && <button className="btn btn-outline" onClick={() => setStep(step - 1)}>{cm.back}</button>}
            {step < 4 && <button className="btn btn-primary" onClick={() => setStep(step + 1)}>{cm.next} <ArrowRight size={16}/></button>}
          </div>
        </div>
      </div>
    </main>
  )
}

export function ShopPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const s = shopCopy[lang]
  const [cart, setCart] = useState<number[]>([])
  const [wish, setWish] = useState<number[]>([])
  const [drawer, setDrawer] = useState(false)
  const addToCart = (i: number) => { setCart([...cart, i]); setDrawer(true) }
  return (
    <main className="page-section">
      <div className="container">
        <div className="shop-head">
          <div>
            <span className="eyebrow">{s.eyebrow}</span>
            <h1>{s.title1} <em>{s.titleEm}</em></h1>
            <p className="lead">{s.lead}</p>
          </div>
          <button className="cart-trigger" onClick={() => setDrawer(true)}>
            <ShoppingBag size={18}/> {s.bag} <b>{cart.length}</b>
          </button>
        </div>
        <div className="shop-tabs">
          {s.tabs.map((t, i) => <span key={t} className={i === 0 ? '' : 'muted'}>{t}</span>)}
          <span className="muted">{s.showing} {s.productsList.length} {s.products}</span>
        </div>
        <div className="product-grid">
          {s.productsList.map((p, i) => (
            <article className="store-card" key={p.name}>
              <div className="store-image">
                <img src={photo(p.photo)} alt={p.name}/>
                <button onClick={() => setWish(wish.includes(i) ? wish.filter(x => x !== i) : [...wish, i])} aria-label={s.wishlistAria}>
                  <Heart size={17} fill={wish.includes(i) ? 'currentColor' : 'none'}/>
                </button>
                <span>{s.doctorPick}</span>
              </div>
              <div className="store-copy">
                <small>{p.cat}</small>
                <h3>{p.name}</h3>
                <div className="rating">
                  <Star size={13} fill="currentColor"/> {s.ratingLine} <i>{s.ratingSub}</i>
                </div>
                <div className="store-buy">
                  <strong>{p.price}</strong>
                  <button onClick={() => addToCart(i)}><Plus size={15}/> {s.addBtn}</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      {drawer && (
        <div className="drawer-backdrop" onClick={() => setDrawer(false)}>
          <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setDrawer(false)}><X/></button>
            <span className="eyebrow">{s.bagHeading}</span>
            <h2>{cart.length} {s.items}</h2>
            {cart.length === 0 ? (
              <p className="muted">{s.emptyBag}</p>
            ) : (
              cart.map((idx, n) => (
                <div className="cart-product" key={n}>
                  <img src={photo(s.productsList[idx].photo)} alt=""/>
                  <div><strong>{s.productsList[idx].name}</strong><small>{s.productsList[idx].price}</small></div>
                  <button onClick={() => setCart(cart.filter((_, i) => i !== n))}><X size={15}/></button>
                </div>
              ))
            )}
            <button className="btn btn-primary full" onClick={() => onNavigate('Checkout')}>{s.checkout} <ArrowRight size={16}/></button>
          </aside>
        </div>
      )}
    </main>
  )
}

export function CheckoutPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const c = checkoutCopy[lang]
  return (
    <main className="page-section">
      <div className="container narrow">
        <span className="eyebrow">{c.eyebrow}</span>
        <h1>{c.title1} <em>{c.titleEm}</em></h1>
        <div className="checkout-form">
          <h2>{c.deliveryHeading}</h2>
          <div className="form-grid">
            {c.deliveryFields.map((f, i) => f.textarea ? <textarea key={i} placeholder={f.ph}/> : <input key={i} placeholder={f.ph}/>)}
          </div>
          <h2>{c.paymentHeading}</h2>
          <div className="payment-options">
            {c.paymentOptions.map((o, i) => <button key={o} className={i === 0 ? 'selected' : ''}>{o}</button>)}
          </div>
          <div className="checkout-summary">
            <p>{c.summary[0]} <strong>{lang === 'bn' ? '৳ ২,৮০০' : '$28'}</strong></p>
            <p>{c.summary[1]} <strong>{lang === 'bn' ? '৳ ৩০০' : '$3'}</strong></p>
            <hr/>
            <p>{c.summary[2]} <strong>{lang === 'bn' ? '৳ ৩,১০০' : '$31'}</strong></p>
          </div>
          <button className="btn btn-primary full" onClick={() => onNavigate('Success')}>{c.placeBtn} <ArrowRight size={16}/></button>
        </div>
      </div>
    </main>
  )
}

export function SuccessPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const s = successCopy[lang]
  return (
    <main className="page-section">
      <div className="container narrow success-page">
        <div className="success-icon"><Check/></div>
        <span className="eyebrow">{s.eyebrow}</span>
        <h1>{s.title1} <em>{s.titleEm}</em></h1>
        <p className="lead">{s.body}</p>
        <button className="btn btn-primary" onClick={() => onNavigate('Shop')}>{s.btn} <ArrowRight size={16}/></button>
      </div>
    </main>
  )
}
