'use client'

import { useMemo, useState } from 'react'
import {
  Activity, ArrowRight, CalendarDays, Check, ChevronDown, Clock3, HeartPulse, Menu, Search, ShieldCheck,
  ShoppingBag, Stethoscope, Users, X, Phone, MapPin, Star, Package, LayoutDashboard, ClipboardList,
  UserRound, Settings, BarChart3, Bell, Plus, SlidersHorizontal, MoreHorizontal, Sparkles
} from 'lucide-react'
import { AboutPage } from '../components/about-page'
import { PatientPortal } from '../components/patient-portal'
import { GalleryPage, ChambersPage, AppointmentFlow, ShopPage, CheckoutPage, SuccessPage } from '../components/page-experiences'
import { ServicesPage, ContactPage, ShopReviews, RatingControl } from '../components/expanded-pages'
import { AdminWorkspace } from '../components/admin-workspace'
import { LanguageGate, LanguageControl, InvoiceButton } from '../components/language-invoice'
import { LanguageRuntime } from '../components/language-runtime'
import { ScrollReveal } from '../components/scroll-reveal'
import { ServiceDetailPage, serviceDetails } from '../components/service-detail-page'
import { common, navCopy, t as tT } from '../lib/translations'
import { useLanguage, type Lang } from '../lib/translations'

function useT() {
  const { lang } = useLanguage()
  return { lang, t: (k: Parameters<typeof tT>[0]) => tT(k, lang) }
}

function Button({ children, variant = 'primary', onClick, className = '' }: { children: React.ReactNode; variant?: string; onClick?: () => void; className?: string }) {
  return <button onClick={onClick} className={`btn btn-${variant} ${className}`}>{children}</button>
}
function Pill({ children, tone = 'blue' }: { children: React.ReactNode; tone?: string }) { return <span className={`pill pill-${tone}`}>{children}</span> }

function PublicHeader({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { lang, t } = useT()
  const navItems = (navCopy[lang].navItems as readonly string[])
  const [open, setOpen] = useState(false)
  return <>
    <div className="notice notice-slider" aria-label="Clinic announcements">
      <div className="notice-track">
        {(navCopy[lang].notice as readonly string[]).map((s, i) => (
          <span key={i}><span className="notice-dot" /> {s} <ArrowRight size={14}/></span>
        ))}
      </div>
    </div>
    <header className="site-header"><div className="container header-inner">
      <button className="brand" onClick={() => onNavigate('Home')}>
        <span className="brand-mark"><Activity size={19}/></span>
        <span>{common[lang].brandName}<small>{navCopy[lang].brandSub}</small></span>
      </button>
      <nav className={`main-nav ${open ? 'is-open' : ''}`}>
        {navItems.map(item => <button key={item} onClick={() => { onNavigate(item); setOpen(false) }} className="nav-link">{item}</button>)}
      </nav>
      <div className="header-actions">
        <button className="icon-btn" aria-label={t('common') ? '' : ''}><Search size={18}/></button>
        <button className="icon-btn" aria-label={t('common') ? '' : ''} onClick={() => onNavigate('Patient')}><UserRound size={18}/></button>
        <Button onClick={() => onNavigate('Appointment')} className="header-cta">{navCopy[lang].bookCta} <ArrowRight size={16}/></Button>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label={common[lang].openMenu}>{open ? <X/> : <Menu/>}</button>
      </div>
    </div></header>
  </>
}

function Footer({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const n = navCopy[lang]
  const c = common[lang]
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <button className="brand footer-brand" onClick={() => onNavigate('Home')}>
            <span className="brand-mark"><Activity size={19}/></span>
            <span>{c.brandName}<small>{n.brandSub}</small></span>
          </button>
          <p className="muted footer-copy">{n.footerTagline}</p>
        </div>
        <div>
          <h4>{n.exploreHeading}</h4>
          {['About','Services','Chambers','Gallery'].map((x, i) => <button key={x} onClick={() => onNavigate(x)} className="footer-link">{n.navItems[['About','Services','Chambers','Gallery'].indexOf(x)] || x}</button>)}
        </div>
        <div>
          <h4>{n.quickLinksHeading}</h4>
          <button onClick={() => onNavigate('Appointment')} className="footer-link">{n.navItems[5]}</button>
          <button onClick={() => onNavigate('Shop')} className="footer-link">{n.navItems[6]}</button>
          <button onClick={() => onNavigate('Patient')} className="footer-link">{n.patientPortalLink}</button>
          <button className="footer-link" onClick={() => onNavigate('Contact')}>{n.helpLink}</button>
        </div>
        <div>
          <h4>{n.visitHeading}</h4>
          <p className="muted">{n.clinicAddress}</p>
          <p className="muted">{n.clinicHours}</p>
        </div>
        <div>
          <h4>{n.contactHeading}</h4>
          <p className="muted">{n.clinicPhone}</p>
          <p className="muted">{n.clinicEmail}</p>
          <div className="footer-socials">
            <button aria-label="Facebook">f</button>
            <button aria-label="Messenger">m</button>
            <button aria-label="Instagram">◎</button>
            <button aria-label="TikTok">♪</button>
            <button aria-label="YouTube">▶</button>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{n.copyright}</span>
        <span>{n.copyrightTagline}</span>
      </div>
    </footer>
  )
}

function Home({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const n = navCopy[lang]
  return <ScrollReveal className="home-reveal"><>
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <Pill>{n.homePill}</Pill>
          <h1>{n.homeTitle1} <em>{n.homeTitleEm}</em></h1>
          <p>{n.homeLead}</p>
          <div className="hero-buttons">
            <Button onClick={() => onNavigate('Appointment')}>{n.heroBookBtn} <ArrowRight size={17}/></Button>
            <Button variant="ghost" onClick={() => onNavigate('Services')}>{n.heroExploreBtn}</Button>
          </div>
          <div className="trust-row">
            <div className="avatar-stack"><span>AM</span><span>KO</span><span>DN</span></div>
            <div>
              <div className="stars">★★★★★ <b>{n.homeRating}</b></div>
              <small className="muted">{n.homeRatingBody}</small>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file-1Z8djK9NGd5b2SvnClzSiz1ZZCLKa9.jpg" alt="Dr. Ibrahim in the clinic"/>
          <div className="hero-card">
            <span className="status-dot"/>
            <div><strong>{n.availableToday}</strong><small>{n.nextOpening}</small></div>
            <ArrowRight size={18}/>
          </div>
          <div className="hero-seal">
            <ShieldCheck size={20}/>
            <span>{n.yearsOfCare}<small>{n.yearsOfCareSub}</small></span>
          </div>
        </div>
      </div>
    </section>

    <section className="stats-strip">
      <div className="container stats">
        {n.stats.map((s, i) => (
          <div key={i}><strong>{s.strong}</strong><span>{s.label}</span></div>
        ))}
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div><Pill>{n.whatWeDo}</Pill><h2>{n.careDesigned} <em>{n.careDesignedEm}</em></h2></div>
          <Button variant="outline" onClick={() => onNavigate('Services')}>{n.viewAllServices} <ArrowRight size={16}/></Button>
        </div>
        <div className="service-grid">
          {n.services.map((s, i) => {
            const iconArr = [HeartPulse, Sparkles, Users]
            const toneArr = ['blue', 'teal', 'sand']
            const Icon = iconArr[i]
            const tone = toneArr[i]
            const slug = i === 1 ? 'prp' : i === 2 ? 'integrative' : 'preventive'
            return (
              <article className={`service-card service-${tone}`} key={s.title}>
                <div className="service-icon"><Icon size={23}/></div>
                <h3>{s.title}</h3>
                <p>{s.copy}</p>
                <button onClick={() => onNavigate(`Service:${slug}`)} className="text-link">{n.learnMoreLink} <ArrowRight size={15}/></button>
              </article>
            )
          })}
        </div>
      </div>
    </section>

    <section className="split-section">
      <div className="container split-grid">
        <div className="split-image">
          <img src="https://images.unsplash.com/photo-1638202993928-7d113b8a5c02?auto=format&fit=crop&w=900&q=80" alt="Doctor speaking with a patient"/>
          <div className="quote-card">
            <span className="quote-mark">“</span>
            <p>{n.quoteBody}</p>
            <small>{n.quoteBy}</small>
          </div>
        </div>
        <div className="split-copy">
          <Pill>{n.ourApproach}</Pill>
          <h2>{n.approachTitle1} <em>{n.approachTitleEm}</em></h2>
          <p className="lead">{n.approachLead}</p>
          <div className="check-list">
            {n.checkList.map((c, i) => <div key={i}><Check size={17}/> {c}</div>)}
          </div>
          <Button onClick={() => onNavigate('About')}>{n.meetDrBtn} <ArrowRight size={16}/></Button>
        </div>
      </div>
    </section>

    <section className="section shop-preview">
      <div className="container">
        <div className="section-heading">
          <div><Pill>{n.clinicShopPill}</Pill><h2>{n.shopTitle1} <em>{n.shopTitleEm}</em></h2></div>
          <Button variant="outline" onClick={() => onNavigate('Shop')}>{n.visitShop} <ArrowRight size={16}/></Button>
        </div>
        <div className="product-grid">
          <ProductList />
        </div>
      </div>
    </section>

    <section className="section home-details">
      <div className="container">
        <div className="section-heading">
          <div><Pill tone="teal">{n.connectedPill}</Pill><h2>{n.moreSupportTitle1} <em>{n.moreSupportTitleEm}</em></h2></div>
          <p className="muted">{n.homeDetailsBody}</p>
        </div>
        <div className="detail-feature-grid">
          {n.detailFeatures.map((f, i) => {
            const Icon = [ShieldCheck, CalendarDays, Users][i]
            return (
              <article key={i}>
                <Icon size={22}/>
                <h3>{f.title}</h3>
                <p>{f.copy}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>

    <section className="cta-section">
      <div className="container cta-inner">
        <div><Pill tone="teal">{n.ctaPill}</Pill><h2>{n.ctaTitle1}<br/><em>{n.ctaTitleEm}</em></h2></div>
        <div>
          <p>{n.ctaBody}</p>
          <Button onClick={() => onNavigate('Appointment')}>{n.ctaBtn} <ArrowRight size={17}/></Button>
        </div>
      </div>
    </section>
  </></ScrollReveal>
}

function ProductList() {
  const { lang } = useLanguage()
  const c = common[lang]
  const items = lang === 'bn' ? [
    { name: 'Daily Defence SPF 50', category: 'ত্বকের যত্ন', price: 2800, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=80' },
    { name: 'ম্যাগনেসিয়াম কমপ্লেক্স', category: 'ওয়েলনেস', price: 2200, image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=700&q=80' },
    { name: 'ক্যালম + রিস্টোর সিরাম', category: 'ত্বকের যত্ন', price: 3400, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80' },
  ] : [
    { name: 'Daily Defence SPF 50', category: 'Skin care', price: 28, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=80' },
    { name: 'Magnesium Complex', category: 'Wellness', price: 22, image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=700&q=80' },
    { name: 'Calm + Restore Serum', category: 'Skin care', price: 34, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80' },
  ]
  return <>{items.map((p, i) => <ProductCard key={i} product={p} />)}</>
}

function ProductCard({ product }: { product: { name: string; category: string; price: number; image: string } }) {
  const { lang } = useLanguage()
  const c = common[lang]
  const [added, setAdded] = useState(false)
  const priceLabel = lang === 'bn' ? `৳ ${product.price.toLocaleString('bn-BD')}` : `$${product.price}.00`
  return (
    <article className="product-card">
      <div className="product-img">
        <img src={product.image} alt={product.name}/>
        <button className="quick-add" onClick={() => setAdded(true)}>{added ? <Check size={17}/> : <Plus size={18}/>}</button>
      </div>
      <div className="product-meta">
        <Pill tone="sand">{product.category}</Pill>
        <h3>{product.name}</h3>
        <strong>{priceLabel}</strong>
      </div>
    </article>
  )
}

function SimplePage({ title, onNavigate }: { title: string; onNavigate: (p: string) => void }) {
  const { lang } = useLanguage()
  const c = common[lang]
  if (title === 'About') return <AboutPage onNavigate={onNavigate} />
  const map: Record<string, { title1: string; em: string; lead: string }> = lang === 'bn' ? {
    Services: { title1: 'প্রতিটি অধ্যায়ের জন্য', em: 'যত্ন।', lead: 'আধুনিক স্বাস্থ্যসেবার একটি বিবেচিত, মানবিক দৃষ্টিভঙ্গি। আমাদের ক্লিনিক ঘুরে দেখুন এবং আপনার জীবনের জন্য তৈরি যত্ন আবিষ্কার করুন।' },
    Contact: { title1: 'প্রয়োজনে আমরা', em: 'আপনার পাশে আছি।', lead: 'একটি বার্তা পাঠান, আমাদের দল সাহায্য করতে প্রস্তুত।' },
  } : {
    Services: { title1: 'Care for every', em: 'chapter.', lead: 'A considered, human approach to modern healthcare. Explore our clinic and discover care designed around your life.' },
    Contact: { title1: 'We&apos;re here when you', em: 'need us.', lead: 'Send us a note — our team is ready to help.' },
  }
  const m = map[title] || (lang === 'bn' ? { title1: title, em: 'ক্লিনিকে।', lead: 'আধুনিক স্বাস্থ্যসেবার একটি বিবেচিত, মানবিক দৃষ্টিভঙ্গি।' } : { title1: title, em: 'at the clinic.', lead: 'A considered, human approach to modern healthcare.' })
  return (
    <section className="page-section">
      <div className="container narrow">
        <Pill>{c.brandFull}</Pill>
        <h1>{m.title1} <em>{m.em}</em></h1>
        <p className="lead">{m.lead}</p>
        <div className="placeholder-feature">
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80" alt="Bright clinic interior"/>
          <div>
            <h2>{lang === 'bn' ? 'আপনার স্বাস্থ্যকে অগ্রাধিকার দিন।' : "Let's make your health a priority."}</h2>
            <p>{lang === 'bn' ? 'আমাদের দল শুনতে, গাইড করতে এবং আপনার যত্ন নিতে প্রস্তুত।' : 'Our team is ready to listen, guide and care for you.'}</p>
            <Button onClick={() => onNavigate('Appointment')}>{c.bookAnAppointment} <ArrowRight size={16}/></Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Page() {
  const [page, setPage] = useState('Home')
  const { lang, setLang } = useLanguage()
  const c = common[lang]
  const n = navCopy[lang]
  const render = page === 'Home' ? <Home onNavigate={setPage} />
    : page === 'Gallery' ? <GalleryPage />
    : page === 'Services' ? <ServicesPage onNavigate={setPage} />
    : page.startsWith('Service:') ? <ServiceDetailPage slug={page.slice(8) as keyof typeof serviceDetails} onNavigate={setPage} />
    : page === 'Contact' ? <ContactPage onNavigate={setPage} />
    : page === 'Chambers' ? <ChambersPage onNavigate={setPage} />
    : page === 'Appointment' ? <AppointmentFlow onNavigate={setPage} />
    : page === 'Shop' ? <ShopPage onNavigate={setPage} />
    : page === 'Checkout' ? <CheckoutPage onNavigate={setPage} />
    : page === 'Success' ? <SuccessPage onNavigate={setPage} />
    : page === 'Admin' ? <AdminWorkspace onExit={() => setPage('Home')} />
    : page === 'Patient' ? <PatientPortal onExit={() => setPage('Home')} />
    : <SimplePage title={page} onNavigate={setPage} />

  return (
    <>
      <LanguageGate onChange={setLang} />
      <LanguageRuntime lang={lang} />
      <div className="utility-bar">
        <div className="container utility-inner">
          <a href="tel:+8801719395553"><Phone size={13}/> +880 1719 395 553</a>
          <div className="utility-socials">
            <span>{n.utility.follow}</span>
            <a href="#facebook" aria-label="Facebook">f</a>
            <a href="#instagram" aria-label="Instagram">◎</a>
            <a href="#youtube" aria-label="YouTube">▶</a>
            <a href="#linkedin" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </div>
      <div className="language-fixed"><LanguageControl lang={lang} onChange={setLang} /></div>
      {page !== 'Admin' && page !== 'Patient' && <PublicHeader onNavigate={setPage} />}
      {render}
      {page !== 'Admin' && page !== 'Patient' && <Footer onNavigate={setPage} />}
      {(page === 'Appointment' || page === 'Checkout' || page === 'Success') && (
        <div className="floating-invoice">
          <InvoiceButton type={page === 'Appointment' ? 'appointment' : 'order'} lang={lang} />
        </div>
      )}
      {page === 'Home' && (
        <>
          <button className="admin-launch" onClick={() => setPage('Admin')}><LayoutDashboard size={15}/> {n.adminPreview}</button>
          <button className="patient-launch" onClick={() => setPage('Patient')}><UserRound size={15}/> {n.patientPreview}</button>
        </>
      )}
    </>
  )
}
