"use client"

import { useState } from 'react'
import { ArrowRight, CalendarDays, Menu, Phone, ShieldCheck, Stethoscope, Users } from 'lucide-react'
import { LanguageControl, LanguageGate } from '../components/language-invoice'
import { LanguageRuntime } from '../components/language-runtime'
import { AdminWorkspace } from '../components/admin-workspace'
import { PatientPortal } from '../components/patient-portal'
import { GalleryPage, ChambersPage, AppointmentFlow, ShopPage, CheckoutPage } from '../components/page-experiences'
import { AboutPage } from '../components/about-page'
import { ContactPage, ServicesPage } from '../components/expanded-pages'

export default function Page() {
  const [page, setPage] = useState('Home')
  const [lang, setLang] = useState<'en' | 'bn'>('en')
  const [menu, setMenu] = useState(false)
  const nav = (next: string) => { setPage(next); setMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const renderPage = () => {
    if (page === 'Admin') return <AdminWorkspace onExit={() => nav('Home')} />
    if (page === 'Patient') return <PatientPortal onExit={() => nav('Home')} />
    if (page === 'About') return <AboutPage onNavigate={nav} />
    if (page === 'Services') return <ServicesPage onNavigate={nav} />
    if (page === 'Gallery') return <GalleryPage />
    if (page === 'Chambers') return <ChambersPage onNavigate={nav} />
    if (page === 'Appointment') return <AppointmentFlow onNavigate={nav} />
    if (page === 'Shop') return <ShopPage onNavigate={nav} />
    if (page === 'Checkout') return <CheckoutPage onNavigate={nav} />
    if (page === 'Contact') return <ContactPage onNavigate={nav} />
    return <main className="home-page"><section className="hero-section"><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow">DR. IBRAHIM HOSSAIN KHAN CLINIC</span><h1>Healthcare that feels <em>human.</em></h1><p className="lead">Thoughtful medical care, preventive medicine and personalised wellness for every stage of life.</p><div className="hero-actions"><button className="btn btn-primary" onClick={() => nav('Appointment')}>Book an appointment <ArrowRight size={16} /></button><button className="btn btn-ghost" onClick={() => nav('Services')}>Explore services</button></div><div className="trust-row"><span><ShieldCheck size={17}/> Patient-first care</span><span><Users size={17}/> Family wellness</span></div></div><div className="hero-visual"><div className="hero-card"><div className="hero-card-top"><span className="status-dot"/> Available today</div><Stethoscope size={54}/><h2>Care with clarity.</h2><p>Clear guidance, connected follow-up and a calmer way to look after your health.</p><button onClick={() => nav('Chambers')}>Find a chamber <ArrowRight size={14}/></button></div></div></div></section><section className="section home-details"><div className="container"><div className="section-heading"><div><span className="pill pill-teal">A connected care experience</span><h2>More support between <em>visits.</em></h2></div><p className="muted">From your first message to long-term follow-up, every detail is designed to make the next step clearer.</p></div><div className="detail-feature-grid"><article><ShieldCheck size={22}/><h3>Trusted clinical standards</h3><p>Thoughtful consultation notes, secure records and a care team that keeps your context in view.</p></article><article><CalendarDays size={22}/><h3>Flexible appointment options</h3><p>Choose a chamber, time and service that fits your day, with helpful reminders before you arrive.</p></article><article><Users size={22}/><h3>Care for the whole family</h3><p>Preventive guidance, ongoing reviews and practical plans for the people who matter most.</p></article></div></div></section></main>
  }
  return <><LanguageGate onChange={setLang} /><LanguageRuntime lang={lang} /><div className="utility-bar"><div className="container utility-inner"><a href="tel:+8801719395553"><Phone size={13}/> +880 1719 395 553</a><div className="utility-socials"><span>Follow us</span><a href="#facebook" aria-label="Facebook">f</a><a href="#instagram" aria-label="Instagram">◎</a><a href="#youtube" aria-label="YouTube">▶</a><a href="#linkedin" aria-label="LinkedIn">in</a></div></div></div><div className="language-fixed"><LanguageControl lang={lang} onChange={setLang} /></div>{page !== 'Admin' && page !== 'Patient' && <header className="site-header"><div className="container header-inner"><button className="brand" onClick={() => nav('Home')}><span className="brand-mark"><Stethoscope size={20}/></span><span>Dr. Ibrahim<small>HOSSAIN KHAN CLINIC</small></span></button><button className="mobile-menu" onClick={() => setMenu(!menu)} aria-label="Open menu"><Menu /></button><nav className={menu ? 'main-nav open' : 'main-nav'}>{['About','Services','Gallery','Chambers','Shop','Contact'].map(item => <button key={item} onClick={() => nav(item)}>{item}</button>)}<button className="nav-cta" onClick={() => nav('Appointment')}>Book appointment</button></nav></div></header>}{renderPage()}{page !== 'Admin' && page !== 'Patient' && <footer className="site-footer"><div className="container"><strong>Dr. Ibrahim Hossain Khan Clinic</strong><p>Thoughtful care for healthier, more confident living.</p><button onClick={() => nav('Patient')}>Patient portal <ArrowRight size={14}/></button></div></footer>}</>
}
