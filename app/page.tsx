'use client'

import { useState } from 'react'
import {
  Activity, ArrowRight, CalendarDays, Check, ChevronDown, Clock3, HeartPulse, Menu, Search, ShieldCheck,
  ShoppingBag, Stethoscope, Users, X, Plus, LayoutDashboard, Sparkles,
  Facebook, Phone, Instagram, MessageCircle, MapPin, Mail, ArrowUp
} from 'lucide-react'
import { AboutPage } from '../components/about-page'
import { ChambersPage, UpgradeAppointment, MedicineUpgrade, Checkout, VideoStrip } from '../components/clinic-upgrade'
import { TeamMembers } from '../components/team-members'
import { Testimonials } from '../components/testimonials'
import { PricingPackages } from '../components/pricing-packages'
import { FAQSection } from '../components/faq-section'
import { BlogSection } from '../components/blog-section'
import { ServicesDetail } from '../components/services-detail'
import { AdminPanel } from '../components/admin-panel'

const nav = ['Home', 'About', 'Services', 'Team', 'Pricing', 'Blog', 'Chambers', 'Appointment', 'Medicine', 'Contact']
const services = [
  { title: 'Preventive Care', copy: 'Thoughtful checkups and clear guidance for every stage of life.', icon: HeartPulse, tone: 'blue' },
  { title: 'Skin & Aesthetics', copy: 'Evidence-led treatments that help you feel at home in your skin.', icon: Sparkles, tone: 'teal' },
  { title: 'Family Medicine', copy: 'Continuity of care built around you, your family and your future.', icon: Users, tone: 'sand' },
]
const products = [
  { name: 'Daily Defence SPF 50', category: 'Skin care', price: 28, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=80' },
  { name: 'Magnesium Complex', category: 'Wellness', price: 22, image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=700&q=80' },
  { name: 'Calm + Restore Serum', category: 'Skin care', price: 34, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80' },
]
const appointments = [
  ['Today, 09:00', 'Amara Mensah', 'Annual wellness review', 'Confirmed'],
  ['Today, 10:30', 'Daniel Owusu', 'Skin consultation', 'Pending'],
  ['Today, 13:00', 'Sofia Boateng', 'Follow-up visit', 'Confirmed'],
  ['Tomorrow, 08:30', 'Michael Addo', 'Family medicine', 'New'],
]

function Button({ children, variant = 'primary', onClick, className = '' }: { children: React.ReactNode; variant?: string; onClick?: () => void; className?: string }) {
  return <button onClick={onClick} className={`btn btn-${variant} ${className}`}>{children}</button>
}
function Pill({ children, tone = 'blue' }: { children: React.ReactNode; tone?: string }) { return <span className={`pill pill-${tone}`}>{children}</span> }

function PublicHeader({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [open, setOpen] = useState(false)
  const navLinks = ['Home', 'About', 'Services', 'Patient Gallery', 'Chambers & Map', 'Contact', 'Shop']
  
  return <>
    {/* Top Bar */}
    <div className="top-bar">
      <div className="container top-bar-inner">
        <div className="social-icons">
          <a href="#" className="social-icon" aria-label="Facebook"><Facebook size={16} /></a>
          <a href="#" className="social-icon" aria-label="WhatsApp"><MessageCircle size={16} /></a>
          <a href="#" className="social-icon" aria-label="Instagram"><Instagram size={16} /></a>
          <a href="#" className="social-icon" aria-label="Messenger"><MessageCircle size={16} /></a>
        </div>
        <div className="top-bar-text">
          <span>consultation for skin and gut health</span>
          <span className="special-offer">Special Offer: Up to 50% discount</span>
        </div>
        <div className="top-bar-phone">
          <Phone size={16} />
          <span>+880 1719 395 553</span>
        </div>
      </div>
    </div>

    {/* Main Navigation */}
    <header className="site-header">
      <div className="container header-inner">
        <button className="brand" onClick={() => onNavigate('Home')}>
          <span className="brand-mark"><HeartPulse size={24}/></span>
          <span className="brand-text">
            Dr. Ibrahim Hossain Khan
            <small>Skin & Integrative Medicine</small>
          </span>
        </button>
        <nav className={`main-nav ${open ? 'is-open' : ''}`}>
          {navLinks.map(item => <button key={item} onClick={() => { onNavigate(item); setOpen(false) }} className="nav-link">{item}</button>)}
        </nav>
        <div className="header-actions">
          <Button onClick={() => onNavigate('Appointment')} className="header-cta">Book Appointment</Button>
          <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Open menu">{open ? <X/> : <Menu/>}</button>
        </div>
      </div>
    </header>
  </>
}
function Footer({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Handle scroll to show/hide scroll to top button
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setShowScrollTop(window.scrollY > 300)
    })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const quickLinks = ['Home', 'About', 'Services', 'Chambers & Map', 'Gallery & Seminars', 'FAQ', 'Track Appointment', 'Contact Us']
  const treatments = ['PRP Therapy', 'Psoriasis Treatment', 'Vitiligo Treatment', 'IBS & Gut Health']

  return <footer className="new-footer">
    <div className="container footer-container">
      <div className="footer-grid">
        {/* Column 1: Doctor Info */}
        <div className="footer-column doctor-column">
          <div className="footer-logo">
            <div className="footer-logo-icon"><HeartPulse size={28} /></div>
            <div className="footer-logo-text">
              <h3>Dr. Ibrahim Hossain Khan</h3>
              <p>Skin & Integrative Medicine</p>
            </div>
          </div>
          <p className="doctor-description">A trusted approach to personalized skin, gut and integrative medical care.</p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook"><Facebook size={20} /></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            {quickLinks.map(link => <li key={link}><button onClick={() => onNavigate(link)}>{link}</button></li>)}
          </ul>
        </div>

        {/* Column 3: Treatments */}
        <div className="footer-column">
          <h4>Treatments</h4>
          <ul className="footer-links">
            {treatments.map(treatment => <li key={treatment}><button onClick={() => onNavigate('Services')}>{treatment}</button></li>)}
          </ul>
        </div>

        {/* Column 4: Chambers & Contact */}
        <div className="footer-column contact-column">
          <h4>Chambers & Contact</h4>
          <div className="contact-item">
            <MapPin size={18} />
            <div>
              <strong>Chamber Location</strong>
              <p>Your chamber address will be here</p>
            </div>
          </div>
          <div className="contact-item">
            <Phone size={18} />
            <div>
              <strong>+880 1719 395 553</strong>
              <p>Daily appointment support</p>
            </div>
          </div>
          <div className="contact-item">
            <Mail size={18} />
            <div>
              <strong>Official Email</strong>
              <p>info@drkhan.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="copyright">© 2026 Dr. Ibrahim Hossain Khan. All Rights Reserved.</div>
        <div className="developer-credit">Developed by Your Developer Name</div>
      </div>
    </div>

    {/* Scroll to Top Button */}
    {showScrollTop && (
      <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
        <ArrowUp size={20} />
      </button>
    )}
  </footer>
}

function Home({ onNavigate }: { onNavigate: (p: string) => void }) { return <>
  <section className="hero"><div className="container hero-grid"><div className="hero-copy"><Pill>Trusted care in Accra</Pill><h1>Healthcare that feels <em>human.</em></h1><p>Expert medical care with the time, clarity and warmth you deserve. From preventive medicine to personalised wellness.</p><div className="hero-buttons"><Button onClick={() => onNavigate('Appointment')}>Book an appointment <ArrowRight size={17}/></Button><Button variant="ghost" onClick={() => onNavigate('Services')}>Explore our services</Button></div><div className="trust-row"><div className="avatar-stack"><span>AM</span><span>KO</span><span>DN</span></div><div><div className="stars">★★★★★ <b>4.9/5</b></div><small className="muted">Loved by 2,000+ patients</small></div></div></div><div className="hero-visual"><img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=85" alt="Dr. Ibrahim in the clinic"/><div className="hero-card"><span className="status-dot"/><div><strong>Available today</strong><small>Next opening at 14:30</small></div><ArrowRight size={18}/></div><div className="hero-seal"><ShieldCheck size={20}/><span>15+<small>years of care</small></span></div></div></div></section>
  <section className="stats-strip"><div className="container stats"><div><strong>15+</strong><span>Years of experience</span></div><div><strong>2k+</strong><span>Patients cared for</span></div><div><strong>98%</strong><span>Patient satisfaction</span></div><div><strong>4.9</strong><span>Average rating</span></div></div></section>
  <section className="section"><div className="container"><div className="section-heading"><div><Pill>What we do</Pill><h2>Care designed around <em>you.</em></h2></div><Button variant="outline" onClick={() => onNavigate('Services')}>View all services <ArrowRight size={16}/></Button></div><div className="service-grid">{services.map(({title,copy,icon:Icon,tone})=><article className={`service-card service-${tone}`} key={title}><div className="service-icon"><Icon size={23}/></div><h3>{title}</h3><p>{copy}</p><button onClick={() => onNavigate('Services')} className="text-link">Learn more <ArrowRight size={15}/></button></article>)}</div></div></section>
  <section className="split-section"><div className="container split-grid"><div className="split-image"><img src="https://images.unsplash.com/photo-1638202993928-7d113b8a5c02?auto=format&fit=crop&w=900&q=80" alt="Doctor speaking with a patient"/><div className="quote-card"><span className="quote-mark">“</span><p>Good healthcare starts with a good conversation.</p><small>— Dr. Ibrahim</small></div></div><div className="split-copy"><Pill>Our approach</Pill><h2>Medicine with room to <em>listen.</em></h2><p className="lead">We believe the best care is collaborative. That means listening carefully, explaining clearly and creating a plan that works in real life.</p><div className="check-list"><div><Check size={17}/> Unhurried, thoughtful consultations</div><div><Check size={17}/> Clear plans you can understand</div><div><Check size={17}/> A team that knows your name</div></div><Button onClick={() => onNavigate('About')}>Meet Dr. Ibrahim <ArrowRight size={16}/></Button></div></div></section>  <Testimonials />
  <section className="section team-preview-section"><div className="container"><div className="section-heading"><div><Pill>Meet our team</Pill><h2>Expert care from trusted <em>professionals.</em></h2></div><Button variant="outline" onClick={() => onNavigate('Team')}>View full team <ArrowRight size={16}/></Button></div><p className="team-preview-subtitle">Our multidisciplinary team brings together specialists in family medicine, dermatology, nutrition, and wellness coaching.</p></div></section>
  <section className="section medicine-preview"><div className="container"><div className="section-heading"><div><Pill>Medicine</Pill><h2>Small rituals, better <em>days.</em></h2></div><Button variant="outline" onClick={() => onNavigate('Medicine')}>Visit medicine <ArrowRight size={16}/></Button></div><div className="product-grid">{products.map(p=><ProductCard key={p.name} product={p} />)}</div></div></section>
  <PricingPackages onNavigate={onNavigate} />
  <section className="cta-section"><div className="container cta-inner"><div><Pill tone="teal">Your next step</Pill><h2>Ready to feel<br/><em>well cared for?</em></h2></div><div><p>Whether it&apos;s a routine checkup or something more specific, we&apos;re here to help.</p><Button onClick={() => onNavigate('Appointment')}>Book your visit <ArrowRight size={17}/></Button></div></div></section>
</> }
function ProductCard({ product }: { product: typeof products[0] }) { const [added,setAdded]=useState(false); return <article className="product-card"><div className="product-img"><img src={product.image} alt={product.name}/><button className="quick-add" onClick={()=>setAdded(true)}>{added ? <Check size={17}/> : <Plus size={18}/>}</button></div><div className="product-meta"><Pill tone="sand">{product.category}</Pill><h3>{product.name}</h3><strong>${product.price}.00</strong></div></article> }
function Appointment({ onNavigate }: { onNavigate: (p:string)=>void }) { const [step,setStep]=useState(1); const [selected,setSelected]=useState(''); return <section className="page-section"><div className="container narrow"><Pill>Appointments</Pill><h1>Let&apos;s find a time <em>for you.</em></h1><p className="lead">Choose a service and preferred time. We&apos;ll take care of the rest.</p><div className="stepper">{['Service','Date & time','Your details','Review'].map((x,i)=><div className={step>i?'step active':'step'} key={x}><span>{step>i+1?<Check size={14}/>:i+1}</span>{x}</div>)}</div><div className="booking-card">{step===1 && <><h2>What can we help with?</h2><div className="choice-grid">{['General consultation','Preventive checkup','Skin consultation','Family medicine'].map(x=><button className={selected===x?'choice selected':'choice'} onClick={()=>setSelected(x)} key={x}><Stethoscope size={19}/><span>{x}</span><ArrowRight size={16}/></button>)}</div></>}{step===2 && <><h2>Choose a convenient time</h2><div className="date-row">{['Tue 18','Wed 19','Thu 20','Fri 21'].map((x,i)=><button className={i===1?'date selected':'date'} key={x}><strong>{x.split(' ')[1]}</strong><small>{x.split(' ')[0]}</small></button>)}</div><div className="time-grid">{['09:00','10:30','13:00','14:30','15:30','16:30'].map(x=><button className="time" key={x}><Clock3 size={15}/>{x}</button>)}</div></>}{step===3 && <><h2>Tell us about yourself</h2><div className="form-grid"><label>Full name<input placeholder="Your name"/></label><label>Phone number<input placeholder="+233"/></label><label>Email address<input placeholder="you@example.com"/></label><label>What brings you in?<input placeholder="A short note (optional)"/></label></div></>}{step===4 && <><div className="success-icon"><Check/></div><h2>Review your appointment</h2><div className="review-row"><span>Service</span><strong>{selected || 'General consultation'}</strong></div><div className="review-row"><span>Date & time</span><strong>Wednesday, 19 June · 10:30</strong></div></>}<div className="booking-actions">{step>1&&<Button variant="ghost" onClick={()=>setStep(step-1)}>Back</Button>}<Button onClick={()=>step<4?setStep(step+1):onNavigate('Home')}>{step===4?'Confirm appointment':'Continue'} <ArrowRight size={16}/></Button></div></div></div></section> }
function Shop({ onNavigate }: { onNavigate:(p:string)=>void }) { return <section className="page-section"><div className="container"><Pill>Medicine</Pill><div className="shop-title"><div><h1>Wellness, <em>curated.</em></h1><p className="lead">Products we trust and recommend in clinic.</p></div><div className="search-box"><Search size={17}/><input placeholder="Search products"/></div></div><div className="filter-row"><button className="filter active">All products</button><button className="filter">Skin care</button><button className="filter">Wellness</button><button className="filter">Vitamins</button><span className="filter-count">{products.length} products</span></div><div className="product-grid shop-grid">{products.concat(products).map((p,i)=><ProductCard key={p.name+i} product={p}/>)}</div></div></section> }

export default function Page(){ 
  const [page, setPage] = useState('Home'); 
  const render = page === 'Home' ? <Home onNavigate={setPage} />
    : page === 'Appointment' ? <UpgradeAppointment onNavigate={setPage} />
    : page === 'Chambers' ? <ChambersPage onNavigate={setPage} />
    : page === 'Medicine' ? <MedicineUpgrade onNavigate={setPage} />
    : page === 'Checkout' ? <Checkout onNavigate={setPage} />
    : page === 'Admin' ? <AdminPanel onNavigate={setPage} />
    : page === 'Services' ? <ServicePage onNavigate={setPage} />
    : page === 'Team' ? <TeamPage onNavigate={setPage} />
    : page === 'Pricing' ? <PricingPage onNavigate={setPage} />
    : page === 'Blog' ? <BlogPage onNavigate={setPage} />
    : <SimplePage title={page} onNavigate={setPage} />; 
  return <>
    {page !== 'Admin' && <PublicHeader onNavigate={setPage} />} 
    {render} 
    {page !== 'Admin' && <Footer onNavigate={setPage} />} 
    {page === 'Home' && <button className="admin-launch" onClick={() => setPage('Admin')}><LayoutDashboard size={15} /> Admin preview</button>}
  </> 
}

function ServicePage({ onNavigate }: { onNavigate: (page: string) => void }) { 
  return <><ServicesDetail onNavigate={onNavigate} /></> 
}

function TeamPage({ onNavigate }: { onNavigate: (page: string) => void }) { 
  return <><TeamMembers /></> 
}

function PricingPage({ onNavigate }: { onNavigate: (page: string) => void }) { 
  return <><PricingPackages onNavigate={onNavigate} /><FAQSection /></> 
}

function BlogPage({ onNavigate }: { onNavigate: (page: string) => void }) { 
  return <><BlogSection /></> 
}

function SimplePage({ title, onNavigate }: { title: string; onNavigate: (p: string) => void }) { 
  if (title === 'About') return <AboutPage onNavigate={onNavigate} />; 
  return <>
    <section className="page-section"><div className="container narrow"><Pill>Dr. Ibrahim Clinic</Pill><h1>{title === 'About' ? <>A better kind of <em>doctor&apos;s visit.</em></> : title === 'Services' ? <>Care for every <em>chapter.</em></> : title === 'Contact' ? <>We&apos;re here when you <em>need us.</em></> : <>{title} <em>at the clinic.</em></>}</h1><p className="lead">A considered, human approach to modern healthcare. Explore our clinic and discover care designed around your life.</p><div className="placeholder-feature"><img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80" alt="Bright clinic interior"/><div><h2>Let&apos;s make your health a priority.</h2><p>Our team is ready to listen, guide and care for you.</p><Button onClick={() => onNavigate('Appointment')}>Book an appointment <ArrowRight size={16} /></Button></div></div></div></section><VideoStrip />
  </> 
}
