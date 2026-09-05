'use client';

import { useEffect, useMemo, useState, lazy, Suspense, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock3,
  HeartPulse,
  Menu,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
  Phone,
  MapPin,
  Star,
  LayoutDashboard,
  ClipboardList,
  UserRound,
  Settings,
  BarChart3,
  Bell,
  Plus,
  SlidersHorizontal,
  MoreHorizontal,
  Sparkles,
  Mail,
  MessageCircle,
  Send,
  ExternalLink,
} from 'lucide-react';
import { AboutPage } from '../components/about-page';
import { ServiceDetailPage, serviceDetails } from '../components/service-detail-page';
import { common, navCopy, t as tT, useLanguage, type Lang } from '../lib/translations';

// Lazy-load heavy route components — they only ship when the user navigates
const PatientPortal = dynamic(
  () => import('../components/patient-portal').then(m => m.PatientPortal),
  {
    ssr: false,
    loading: () => <RouteSkeleton />,
  }
);
const AdminWorkspace = dynamic(
  () => import('../components/admin-workspace').then(m => m.AdminWorkspace),
  {
    ssr: false,
    loading: () => <RouteSkeleton />,
  }
);
const GalleryPage = dynamic(
  () => import('../components/page-experiences').then(m => m.GalleryPage),
  { ssr: false, loading: () => <RouteSkeleton /> }
);
const ChambersPage = dynamic(
  () => import('../components/page-experiences').then(m => m.ChambersPage),
  { ssr: false, loading: () => <RouteSkeleton /> }
);
const AppointmentFlow = dynamic(
  () => import('../components/page-experiences').then(m => m.AppointmentFlow),
  { ssr: false, loading: () => <RouteSkeleton /> }
);
const CheckoutPage = dynamic(
  () => import('../components/page-experiences').then(m => m.CheckoutPage),
  { ssr: false, loading: () => <RouteSkeleton /> }
);
const SuccessPage = dynamic(
  () => import('../components/page-experiences').then(m => m.SuccessPage),
  { ssr: false, loading: () => <RouteSkeleton /> }
);
const ServicesPage = dynamic(
  () => import('../components/expanded-pages').then(m => m.ServicesPage),
  { ssr: false, loading: () => <RouteSkeleton /> }
);
const ContactPage = dynamic(() => import('../components/expanded-pages').then(m => m.ContactPage), {
  ssr: false,
  loading: () => <RouteSkeleton />,
});
const LanguageGate = dynamic(
  () => import('../components/language-invoice').then(m => m.LanguageGate),
  { ssr: false }
);
const LanguageControl = dynamic(() =>
  import('../components/language-invoice').then(m => m.LanguageControl)
);
const InvoiceButton = dynamic(() =>
  import('../components/language-invoice').then(m => m.InvoiceButton)
);
const MotionShell = dynamic(() => import('../components/motion-shell').then(m => m.MotionShell), {
  ssr: false,
});

// Home-page-only helpers — keep their static imports so they ship with the home bundle
import { Tilt3D, Magnetic } from '../components/motion-3d';
import { ScrollReveal } from '../components/scroll-reveal';
import {
  HeartbeatArt,
  LeafArt,
  FamilyArt,
  StethoArt,
  PillArt,
  ShieldArt,
  CalendarArt,
  DoctorArt,
  StarsArt,
  ChatArt,
  InfinityArt,
  DnaArt,
} from '../components/illust-svg';

// Smart navigation button: prefetches the target route chunk on hover/focus/touch
function NavBtn({
  to,
  onNavigate,
  className = '',
  children,
  style,
  ...rest
}: {
  to: string;
  onNavigate: (p: string) => void;
  className?: string;
  children: React.ReactNode;
  style?: any;
  [k: string]: any;
}) {
  return (
    <button
      onClick={() => onNavigate(to)}
      onMouseEnter={() => prefetchRoute(to)}
      onFocus={() => prefetchRoute(to)}
      onTouchStart={() => prefetchRoute(to)}
      className={className}
      style={style}
      {...rest}>
      {children}
    </button>
  );
}

function RouteSkeleton() {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: 40 }}>
      <div className="route-skeleton">
        <div className="route-skeleton-spin" />
      </div>
      <style>{`@keyframes rs{to{transform:rotate(360deg)}}.route-skeleton{display:grid;place-items:center}.route-skeleton-spin{width:36px;height:36px;border:3px solid rgba(20,184,166,0.15);border-top-color:#14b8a6;border-radius:50%;animation:rs 0.9s linear infinite}`}</style>
    </div>
  );
}

// Route prefetcher — fires the dynamic import on hover/touch so navigation is instant
const prefetchers: Record<string, () => Promise<any>> = {
  Gallery: () => import('../components/page-experiences').then(m => m.GalleryPage),
  Chambers: () => import('../components/page-experiences').then(m => m.ChambersPage),
  Appointment: () => import('../components/page-experiences').then(m => m.AppointmentFlow),
  Checkout: () => import('../components/page-experiences').then(m => m.CheckoutPage),
  Success: () => import('../components/page-experiences').then(m => m.SuccessPage),
  Services: () => import('../components/expanded-pages').then(m => m.ServicesPage),
  Contact: () => import('../components/expanded-pages').then(m => m.ContactPage),
  Admin: () => import('../components/admin-workspace').then(m => m.AdminWorkspace),
  Patient: () => import('../components/patient-portal').then(m => m.PatientPortal),
  About: () => import('../components/about-page').then(m => m.AboutPage),
};
const prefetched = new Set<string>();
function prefetchRoute(name: string) {
  if (prefetched.has(name)) return;
  const fn =
    prefetchers[name] ||
    (name.startsWith('Service:') ? () => import('../components/service-detail-page') : null);
  if (fn) {
    prefetched.add(name);
    // Defer to idle to never block input
    if ('requestIdleCallback' in window)
      (window as any).requestIdleCallback(() => fn().catch(() => {}));
    else setTimeout(() => fn().catch(() => {}), 200);
  }
}

function useT() {
  const { lang } = useLanguage();
  return useMemo(() => ({ lang, t: (k: Parameters<typeof tT>[0]) => tT(k, lang) }), [lang]);
}

const Button = memo(function Button({
  children,
  variant = 'primary',
  onClick,
  className = '',
  style,
}: {
  children: React.ReactNode;
  variant?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button onClick={onClick} className={`btn btn-${variant} ${className}`} style={style}>
      {children}
    </button>
  );
});
const Pill = memo(function Pill({ children, tone = 'blue' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
});

const PublicHeader = memo(function PublicHeader({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { lang, t } = useT();
  const navItems = navCopy[lang].navItems as readonly string[];
  const n = navCopy[lang];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const handleNavClick = useCallback((item: string) => {
    onNavigate(item);
    setOpen(false);
  }, [onNavigate]);
  const handleSearchOpen = useCallback(() => setSearchOpen(true), []);
  const handleSearchClose = useCallback(() => setSearchOpen(false), []);
  const handleMenuToggle = useCallback(() => setOpen(v => !v), []);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? Math.min(100, (y / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const id = setInterval(() => setActiveIdx(i => (i + 1) % 3), 8000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [searchOpen]);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  return (
    <>
      <a href="#main" className="skip-link">
        {n.skipToContent}
      </a>

      {/* ============ ANNOUNCEMENT BAR — auto slider (left→right loop) ============ */}
      <div className="notice notice-slider" aria-label="Clinic announcements">
        <div className="notice-track">
          {[
            ...(navCopy[lang].notice as readonly string[]),
            ...(navCopy[lang].notice as readonly string[]),
          ].map((s, i) => (
            <span key={i}>
              <span className="notice-dot pulse" /> {s}{' '}
              <ArrowRight size={14} className="notice-arrow" />
            </span>
          ))}
        </div>
        <div className="notice-dots">
          {(navCopy[lang].notice as readonly string[]).map((_, i) => (
            <span key={i} className={`notice-pip ${i === activeIdx % 3 ? 'is-on' : ''}`} />
          ))}
        </div>
      </div>

      {/* ============ MAIN HEADER ============ */}
      <header className={`site-header ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="header-glow" aria-hidden="true" />
        <div className="container header-inner">
          <button
            className="brand press"
            onClick={() => onNavigate('Home')}
            aria-label={common[lang].brandName}>
            <span className="brand-mark">
              <span className="brand-pulse" aria-hidden="true" />
              <img src="/logo.png" alt="Dr. Ibrahim Clinic" className="brand-icon-img" width="40" height="40" loading="eager" fetchPriority="high" decoding="async" />
            </span>
            <span className="brand-text">
              <strong>{common[lang].brandName}</strong>
              <small>{n.brandSub}</small>
            </span>
          </button>

          <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main">
            <span className="nav-track" aria-hidden="true" />
            {navItems.map((item, i) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                onMouseEnter={() => {
                  setHovered(item);
                  prefetchRoute(item);
                }}
                onFocus={() => {
                  setHovered(item);
                  prefetchRoute(item);
                }}
                onTouchStart={() => prefetchRoute(item)}
                onMouseLeave={() => setHovered(null)}
                className={`nav-link link-underline ${hovered === item ? 'is-hover' : ''}`}
                style={{ animationDelay: `${0.05 + i * 0.04}s` }}>
                <span className="nav-label">{item}</span>
                <span className="nav-dot" aria-hidden="true" />
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="icon-btn press"
              aria-label={n.searchAria}
              onClick={handleSearchOpen}>
              <Search size={18} />
              <span className="icon-glow" aria-hidden="true" />
            </button>
            <button
              className="icon-btn press"
              aria-label={n.patientDashboardAria}
              onClick={() => onNavigate('Patient')}>
              <UserRound size={18} />
              <span className="icon-glow" aria-hidden="true" />
            </button>
            <Magnetic>
              <Button
                onClick={() => onNavigate('Appointment')}
                className="header-cta btn-pro shadow-glow-teal press">
                <CalendarCheck size={15} /> <span>{n.bookCta}</span>{' '}
                <ArrowRight size={14} className="float-x" />
              </Button>
            </Magnetic>
            <button
              className="menu-btn press"
              onClick={handleMenuToggle}
              aria-label={common[lang].openMenu}
              aria-expanded={open}>
              <span className="menu-bars">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>

        {/* SCROLL PROGRESS BAR */}
        <div className="scroll-progress" aria-hidden="true">
          <span className="scroll-progress-fill" style={{ width: `${scrollPct}%` }} />
          <span className="scroll-progress-glow" style={{ left: `${scrollPct}%` }} />
        </div>
        {open && (
          <div
            className="nav-backdrop"
            onClick={() => setOpen(false)}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 42, 68, 0.35)',
              backdropFilter: 'blur(2px)',
              zIndex: 98,
            }}
          />
        )}
      </header>

      {/* ============ SEARCH OVERLAY ============ */}
      <div
        className={`search-overlay ${searchOpen ? 'is-open' : ''}`}
        onClick={() => setSearchOpen(false)}
        aria-hidden={!searchOpen}>
        <div className="search-card glass-panel" onClick={e => e.stopPropagation()}>
          <div className="search-bar">
            <Search size={20} className="search-bar-icon" />
            <input
              autoFocus={searchOpen}
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder={n.searchPlaceholder}
              aria-label={n.quickSearch}
            />
            <kbd>Esc</kbd>
            <button
              className="icon-btn press"
              onClick={() => setSearchOpen(false)}
              aria-label={n.closeSearch}>
              <X size={18} />
            </button>
          </div>
          <div className="search-popular">
            <span className="search-popular-label">
              {n.popularSearches.length ? (lang === 'bn' ? 'জনপ্রিয়' : 'Popular') : ''}
            </span>
            {(n.popularSearches as readonly string[]).map(s => (
              <button key={s} className="search-chip ripple press" onClick={() => setSearchVal(s)}>
                <Sparkles size={12} /> {s}
              </button>
            ))}
          </div>
           <p className="search-hint">{n.searchHint}</p>
        </div>
      </div>
    </>
  );
});

const Footer = memo(function Footer({
  onNavigate,
  onLangChange,
}: {
  onNavigate: (p: string) => void;
  onLangChange?: (l: 'en' | 'bn') => void;
}) {
  const { lang } = useLanguage();
  const n = navCopy[lang];
  const c = common[lang];
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  const handleSubscribe = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  }, [email]);
  const onBackToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <footer className="site-footer">
      {/* === Decorative top wave === */}
      <div className="footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fwave" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#0f172a" />
              <stop offset=".5" stopColor="#0b1322" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <path
            d="M0 60 C 200 20, 360 80, 600 50 S 1100 10, 1440 60 L 1440 80 0 80 Z"
            fill="url(#fwave)"
            opacity=".95"
          />
        </svg>
      </div>

      {/* === Floating background ornaments === */}
      <div className="footer-ornaments" aria-hidden="true">
        <span className="footer-orb footer-orb-1" />
        <span className="footer-orb footer-orb-2" />
        <span className="footer-orb footer-orb-3" />
        <span className="footer-grid-bg" />
      </div>

      {/* === Top: newsletter band === */}
      <div className="footer-newsletter">
        <div className="container footer-newsletter-inner">
          <div className="newsletter-copy">
            <span className="newsletter-pill">
              <Sparkles size={12} /> {n.quickLinksHeading}
            </span>
            <h3 className="newsletter-title gradient-text">{n.newsletterTitle}</h3>
            <p className="newsletter-body muted">{n.newsletterBody}</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className={`newsletter-field ${subscribed ? 'is-done' : ''}`}>
              <Mail size={18} className="newsletter-mail" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={n.newsletterPlaceholder}
                aria-label={n.newsletterPlaceholder}
                required
              />
              <button type="submit" className="newsletter-submit btn-pro" disabled={subscribed}>
                {subscribed ? (
                  <>
                    <Check size={15} /> {n.newsletterSuccess}
                  </>
                ) : (
                  <>
                    {n.newsletterCta} <ArrowRight size={15} className="float-x" />
                  </>
                )}
              </button>
            </div>
            <small className="newsletter-consent">{n.newsletterConsent}</small>
          </form>
        </div>
      </div>

      {/* === Main grid === */}
      <div className="container footer-grid">
        {/* Brand block */}
        <div className="footer-brand-block">
          <button className="brand footer-brand" onClick={() => onNavigate('Home')}>
            <span className="brand-mark">
              <img src="/logo.png" alt="Dr. Ibrahim Clinic" className="brand-icon-img" width="40" height="40" loading="lazy" decoding="async" />
            </span>
            <span>
              {c.brandName}
              <small>{n.brandSub}</small>
            </span>
          </button>
          <p className="muted footer-copy">{n.footerTagline}</p>

          <div className="footer-status">
            <span className="status-dot" /> <strong>{n.openToday}</strong> ·{' '}
            <span>{n.responseTime}</span>
          </div>

           <div className="footer-socials" aria-label={n.socialLabel}>
             {[
               { k: 'f', label: 'Facebook', href: n.socials.facebook },
               { k: '◎', label: 'Instagram', href: n.socials.instagram },
             ].map((s, i) => (
               <a key={s.k + i} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="press ripple social-btn">
                 {s.k}
                 <span className="social-glow" aria-hidden="true" />
               </a>
             ))}
           </div>
        </div>

        {/* Explore */}
        <div className="footer-col">
          <h4>{n.exploreHeading}</h4>
          <ul className="footer-link-list">
            {['About', 'Services', 'Chambers', 'Gallery'].map((x, i) => (
              <li key={x} style={{ animationDelay: `${0.05 + i * 0.05}s` }}>
                <button onClick={() => onNavigate(x)} className="footer-link link-underline">
                  {n.navItems[['About', 'Services', 'Chambers', 'Gallery'].indexOf(x)] || x}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div className="footer-col">
          <h4>{n.quickLinksHeading}</h4>
          <ul className="footer-link-list">
            <li style={{ animationDelay: '.05s' }}>
              <button onClick={() => onNavigate('Patient')} className="footer-link link-underline">
                {n.patientPortalLink}
              </button>
            </li>
            <li style={{ animationDelay: '.1s' }}>
              <button onClick={() => onNavigate('Contact')} className="footer-link link-underline">
                {n.helpLink}
              </button>
            </li>
            <li style={{ animationDelay: '.15s' }}>
              <button onClick={() => onNavigate('About')} className="footer-link link-underline">
                {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About the clinic'}
              </button>
            </li>
            <li style={{ animationDelay: '.2s' }}>
              <button onClick={() => onNavigate('Services')} className="footer-link link-underline">
                {lang === 'bn' ? 'সেবাসমূহ' : 'Our services'}
              </button>
            </li>
          </ul>
        </div>

        {/* Visit */}
        <div className="footer-col">
          <h4>{n.visitHeading}</h4>
          <ul className="footer-info-list">
            <li>
              <span className="info-ic">
                <MapPin size={14} />
              </span>
              <span>{n.clinicAddress}</span>
            </li>
            <li>
              <span className="info-ic">
                <Clock3 size={14} />
              </span>
              <span>{n.clinicHours}</span>
            </li>
            <li>
              <span className="info-ic">
                <Phone size={14} />
              </span>
              <a href={`tel:${n.clinicPhone.replace(/[^+\d]/g, '')}`}>{n.clinicPhone}</a>
            </li>
            <li>
              <span className="info-ic">
                <Mail size={14} />
              </span>
              <a href={`mailto:${n.clinicEmail}`}>{n.clinicEmail}</a>
            </li>
          </ul>
        </div>

        {/* Languages + payments */}
        <div className="footer-col">
          <h4>{n.contactHeading}</h4>
          <div className="footer-lang">
            <span className="muted small">{n.languagesLabel}</span>
            <LanguageControl lang={lang} onChange={onLangChange || (() => {})} compact />
          </div>
          <div className="footer-pay">
            <span className="muted small">{n.paymentLabel}</span>
            <div className="pay-row">
              {(n.payMethods as readonly string[]).map(m => (
                <span key={m} className="pay-chip">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === Bottom bar === */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <div className="footer-bottom-left">
            <span>{year ? n.copyright.replace(/\d{4}/, String(year)) : n.copyright}</span>
            <span className="dot-sep">·</span>
            <span className="muted small">{n.madeWith}</span>
          </div>
          <nav className="footer-legal" aria-label="Legal">
            <a href="#privacy">{n.legalLinks.privacy}</a>
            <span className="dot-sep">·</span>
            <a href="#terms">{n.legalLinks.terms}</a>
            <span className="dot-sep">·</span>
            <a href="#cookies">{n.legalLinks.cookies}</a>
          </nav>
          <div className="footer-bottom-right">
            <span className="muted small">{n.copyrightTagline}</span>
            <button className="back-to-top press" onClick={onBackToTop} aria-label={n.backToTop}>
              <ArrowRight size={14} className="rot-up" />
              <span>{n.backToTop}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
});

function Home({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { lang } = useLanguage();
  const n = navCopy[lang];
  return (
    <ScrollReveal className="home-reveal">
      <>
        {/* ============ HERO ============ */}
        <section
          className="hero aurora-bg scene-3d"
          style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            className="hero-glow"
            style={{ width: 500, height: 500, top: -150, left: -100, opacity: 0.25 }}
          />
          <div
            className="grid-dots"
            style={{ position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none' }}
          />

          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="chip-pro appear-down">
                <span className="dot" />
                <span>{n.homePill}</span>
              </div>
              {/* Typewriter headline */}
              <h1
                style={{
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  fontSize: 'clamp(38px, 5vw, 68px)',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: '18px 0 14px',
                }}>
                <span className="tw-words">
                  <span style={{ color: '#0f172a' }}>{n.homeTitle1}</span>
                </span>
                <br />
                <span
                  className="tw-words"
                  style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400 }}>
                  <span
                    style={{
                      background: 'linear-gradient(90deg, #f59e0b, #ec4899, #6366f1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                    {n.homeTitleEm}
                  </span>
                </span>
              </h1>
              <p className="appear-up" style={{ animationDelay: '4s' }}>
                {n.homeLead}
              </p>
              <div className="hero-buttons appear-up" style={{ animationDelay: '4.2s' }}>
                <Magnetic>
                  <Button
                    onClick={() => onNavigate('Appointment')}
                    className="btn-pro shadow-glow-teal btn-tilt">
                    {n.heroBookBtn} <ArrowRight size={17} className="float-x" />
                  </Button>
                </Magnetic>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate('Services')}
                  className="btn-ghost-pro">
                  {n.heroExploreBtn}
                </Button>
              </div>
              <div className="trust-row appear-up" style={{ animationDelay: '4.4s' }}>
                <div className="avatar-stack">
                  <span className="avatar-ring" style={{ display: 'grid', placeItems: 'center' }}>
                    AM
                  </span>
                  <span style={{ marginLeft: -7 }}>KO</span>
                  <span style={{ marginLeft: -7 }}>DN</span>
                  <span style={{ marginLeft: -7, background: '#fce7e2', color: '#a95044' }}>
                    +2k
                  </span>
                </div>
                <div>
                  <div className="stars">
                    ★★★★★ <b>{n.homeRating}</b>
                  </div>
                  <small className="muted">{n.homeRatingBody}</small>
                </div>
              </div>
            </div>

            {/* ===== HERO VISUAL: large featured image ===== */}
            <div
              className="hero-visual hero-visual-large perspective"
              style={{ perspective: 1500 }}>
              <Tilt3D max={4} scale={1.01} className="float-3d hero-main-card">
                <div
                  className="hero-main-bg hero-photo-wrap"
                  style={{
                    borderRadius: '32px',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #ede9fe 100%)',
                    boxShadow: '0 50px 100px -20px rgba(15,42,68,0.35)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    aspectRatio: '3/4',
                  }}>
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-t0aIFTDc6pB1akFlYbJx4hrSfNncT0.png"
                    alt="Dr. Ibrahim Hossain in a white coat"
                    className="hero-photo"
                    loading="eager"
                    fetchPriority="high"
                    width="500"
                    height="625"
                    decoding="async"
                  />
                  <svg
                    viewBox="0 0 400 100"
                    preserveAspectRatio="none"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 90,
                      opacity: 0.35,
                    }}>
                    <path
                      d="M0,50 L60,50 L80,50 L90,20 L100,80 L110,30 L130,50 L200,50 L220,50 L230,25 L240,75 L250,50 L320,50 L340,50 L350,30 L360,70 L370,50 L400,50"
                      stroke="#14b8a6"
                      strokeWidth="2.5"
                      fill="none"
                      className="ecg-stroke"
                    />
                  </svg>
                  <span className="hero-sheen" aria-hidden="true" />
                </div>
              </Tilt3D>

              <div
                className="hero-mini-pill glass-panel shine-card float-soft"
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  zIndex: 5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#0d9488',
                }}>
                <span className="status-dot pulse" />
                <span>Live · {n.availableToday}</span>
              </div>

              <div
                className="hero-mini-pill glass-panel shine-card float-soft"
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  zIndex: 5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  borderRadius: 14,
                }}>
                <StarsArt style={{ width: 70, height: 22 }} />
                <div style={{ fontSize: 12, lineHeight: 1.2 }}>
                  <strong style={{ display: 'block', color: '#0f172a' }}>4.9/5</strong>
                  <small style={{ color: '#647985', fontSize: 10 }}>2k+ reviews</small>
                </div>
              </div>

              <div
                className="hero-seal-mini spin-3d"
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #14b8a6, #6366f1)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  textAlign: 'center',
                  boxShadow: '0 20px 40px -10px rgba(20,184,166,0.55)',
                  zIndex: 4,
                }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>15+</div>
                  <div style={{ fontSize: 9, fontWeight: 500, opacity: 0.9, marginTop: 2 }}>
                    years
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ECG heartbeat line at the bottom */}
          <div
            className="heartbeat-line"
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, opacity: 0.5 }}>
            <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
              <path d="M0,30 L100,30 L120,30 L130,10 L140,50 L150,30 L200,30 L220,30 L230,15 L240,45 L250,30 L350,30 L370,30 L380,10 L390,50 L400,30 L500,30 L520,30 L530,20 L540,40 L550,30 L700,30 L720,30 L730,10 L740,50 L750,30 L850,30 L870,30 L880,18 L890,42 L900,30 L1200,30" />
            </svg>
          </div>
        </section>

        {/* ============ STATS — compact horizontal strip ============ */}
        <section
          className="stats-strip"
          style={{ position: 'relative', overflow: 'hidden', padding: '28px 0' }}>
          <div
            className="light-leak"
            style={{ width: 300, height: 300, top: -100, left: '20%', opacity: 0.2 }}
          />
          <div className="container">
            <div className="stats-compact-row">
              {n.stats.map((s, i) => {
                const ICONS = [HeartbeatArt, StethoArt, FamilyArt, StarsArt];
                const IconArt = ICONS[i % ICONS.length];
                const accents = ['#ec4899', '#0d9488', '#7c3aed', '#f59e0b'];
                const accent = accents[i % accents.length];
                return (
                  <div key={i} className="stat-pill" style={{ '--accent': accent } as any}>
                    <div className="stat-pill-icon">
                      <IconArt style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div className="stat-pill-text">
                      <strong className="stat-num">{s.strong}</strong>
                      <span>{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ SERVICES — with custom 3D illustrations ============ */}
        <section
          className="section bg-grid-light"
          style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            className="hero-glow"
            style={{ width: 400, height: 400, top: -150, right: -100, opacity: 0.25 }}
          />
          <div className="container">
            <ScrollReveal>
              <div className="section-heading">
                <div>
                  <span className="section-eyebrow">{n.whatWeDo}</span>
                  <h2 style={{ marginTop: 14 }}>
                    {n.careDesigned} <em>{n.careDesignedEm}</em>
                  </h2>
                </div>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('Services')}
                  className="btn-pro">
                  {n.viewAllServices} <ArrowRight size={16} className="float-x" />
                </Button>
              </div>
            </ScrollReveal>
            <div className="service-grid grid-cards">
              {[
                {
                  title: n.services[0].title,
                  copy: n.services[0].copy,
                  slug: 'preventive',
                  Art: StethoArt,
                  hue: 174,
                  desc: 'Comprehensive checkups & screening',
                },
                {
                  title: n.services[1].title,
                  copy: n.services[1].copy,
                  slug: 'prp',
                  Art: LeafArt,
                  hue: 158,
                  desc: 'Regenerative skin & wellness',
                },
                {
                  title: n.services[2].title,
                  copy: n.services[2].copy,
                  slug: 'integrative',
                  Art: FamilyArt,
                  hue: 210,
                  desc: 'Whole-person family care',
                },
              ].map((s, i) => (
                <Tilt3D
                  key={s.title}
                  max={6}
                  className="service-card-premium premium-card shine-card"
                  onClick={() => onNavigate(`Service:${s.slug}`)}>
                  <div
                    className="service-illust"
                    style={{
                      background: `linear-gradient(135deg, hsla(${s.hue}, 70%, 92%, 1), hsla(${(s.hue + 30) % 360}, 70%, 96%, 1))`,
                      borderRadius: 18,
                      padding: 8,
                      marginBottom: 18,
                      aspectRatio: '1.6/1',
                      display: 'grid',
                      placeItems: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                    <s.Art style={{ width: '85%', height: '85%' }} />
                    <span
                      className="section-eyebrow"
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        fontSize: 9,
                        padding: '3px 10px',
                      }}>
                      0{i + 1}
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 19 }}>{s.title}</h3>
                  <p
                    style={{ margin: '6px 0 0', color: '#647985', fontSize: 13, lineHeight: 1.65 }}>
                    {s.copy}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 14,
                      paddingTop: 14,
                      borderTop: '1px dashed rgba(20,184,166,0.15)',
                    }}>
                    <span className="muted" style={{ fontSize: 11 }}>
                      {s.desc}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onNavigate(`Service:${s.slug}`);
                      }}
                      className="text-link link-underline pill-arrow"
                      style={{ fontSize: 12 }}>
                      {n.learnMoreLink} <ArrowRight size={14} className="float-x" />
                    </button>
                  </div>
                </Tilt3D>
              ))}
            </div>
          </div>
        </section>

        {/* ============ WHY US / APPROACH SPLIT ============ */}
        <section className="split-section" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="container split-grid">
            <div className="split-image perspective" style={{ perspective: 1500 }}>
              <Tilt3D max={5} className="depth-shadow hero-main-card">
                <div
                  className="hero-main-bg"
                  style={{
                    borderRadius: 22,
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
                    aspectRatio: '1.1/1',
                    boxShadow: '0 30px 60px -16px rgba(15,42,68,0.25)',
                    border: '1px solid rgba(255,255,255,0.8)',
                  }}>
                  <DoctorArt style={{ position: 'absolute', inset: 0 }} />
                  {/* Floating badges */}
                  <div
                    className="float-soft"
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      background: 'rgba(255,255,255,0.95)',
                      padding: '8px 14px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#0d9488',
                      boxShadow: '0 8px 20px -4px rgba(15,42,68,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                    <span className="status-dot pulse" /> Available today
                  </div>
                  <div
                    className="float-soft"
                    style={{
                      position: 'absolute',
                      bottom: 20,
                      left: 20,
                      background: 'rgba(255,255,255,0.95)',
                      padding: '10px 14px',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      boxShadow: '0 8px 20px -4px rgba(15,42,68,0.2)',
                    }}>
                    <StarsArt style={{ width: 60, height: 30 }} />
                    <div>
                      <strong style={{ display: 'block', fontSize: 12, color: '#0f172a' }}>
                        4.9/5
                      </strong>
                      <small style={{ fontSize: 10, color: '#647985' }}>2k+ reviews</small>
                    </div>
                  </div>
                </div>
              </Tilt3D>
              <div
                className="quote-card lift glass-panel shine-card"
                style={{ border: 0, borderRadius: 16, marginTop: 16 }}>
                <span className="quote-mark gradient-text" style={{ fontSize: 56, lineHeight: 1 }}>
                  "
                </span>
                <p style={{ fontSize: 16, lineHeight: 1.6 }}>{n.quoteBody}</p>
                <small
                  style={{ display: 'block', marginTop: 8, fontWeight: 700, color: '#0f172a' }}>
                  {n.quoteBy}
                </small>
              </div>
            </div>
            <div className="split-copy">
              <span className="section-eyebrow">{n.ourApproach}</span>
              <h2 style={{ marginTop: 14 }}>
                {n.approachTitle1} <em>{n.approachTitleEm}</em>
              </h2>
              <p className="lead">{n.approachLead}</p>
              <div className="check-list grid-cards">
                {n.checkList.map((c, i) => {
                  const checkArts = [StethoArt, ChatArt, HeartbeatArt];
                  const CheckArt = checkArts[i % checkArts.length];
                  return (
                    <div
                      key={i}
                      className="lift shine-card"
                      style={{
                        padding: '14px 16px',
                        background: '#fff',
                        borderRadius: 14,
                        border: '1px solid rgba(20,184,166,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                      }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          flexShrink: 0,
                          background:
                            'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(99,102,241,0.1))',
                          borderRadius: 12,
                          padding: 6,
                        }}>
                        <CheckArt style={{ width: '100%', height: '100%' }} />
                      </div>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
                        {c}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Button
                onClick={() => onNavigate('About')}
                className="btn-pro shadow-glow-teal btn-tilt">
                {n.meetDrBtn} <ArrowRight size={16} className="float-x" />
              </Button>
            </div>
          </div>
        </section>

        {/* ============ FEATURE GRID — 3D illustrations ============ */}
        <section
          className="section home-details bg-grid-light"
          style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="container">
            <ScrollReveal>
              <div className="section-heading">
                <div>
                  <span className="section-eyebrow">{n.connectedPill}</span>
                  <h2 style={{ marginTop: 14 }}>
                    {n.moreSupportTitle1} <em>{n.moreSupportTitleEm}</em>
                  </h2>
                </div>
                <p className="muted">{n.homeDetailsBody}</p>
              </div>
            </ScrollReveal>
            <div className="detail-feature-grid grid-cards">
              {[
                { Art: ShieldArt, hue: 174, label: 'Clinical standards' },
                { Art: CalendarArt, hue: 210, label: 'Flexible scheduling' },
                { Art: InfinityArt, hue: 190, label: 'Lifetime continuity' },
              ].map((s, i) => (
                <article
                  key={i}
                  className="premium-card shine-card tilt-3d"
                  style={{ padding: 0, overflow: 'hidden' }}>
                  <div
                    style={{
                      background: `linear-gradient(135deg, hsla(${s.hue}, 70%, 92%, 1), hsla(${(s.hue + 30) % 360}, 70%, 96%, 1))`,
                      padding: 24,
                      aspectRatio: '1.7/1',
                      display: 'grid',
                      placeItems: 'center',
                      position: 'relative',
                    }}>
                    <s.Art style={{ width: '70%', height: '70%' }} />
                    <span
                      className="section-eyebrow"
                      style={{
                        position: 'absolute',
                        top: 14,
                        left: 14,
                        fontSize: 9,
                        padding: '3px 10px',
                      }}>
                      0{i + 1}
                    </span>
                  </div>
                  <div style={{ padding: 24 }}>
                    <h3 style={{ margin: 0 }}>{n.detailFeatures[i].title}</h3>
                    <p
                      style={{
                        margin: '6px 0 0',
                        color: '#647985',
                        fontSize: 13,
                        lineHeight: 1.65,
                      }}>
                      {n.detailFeatures[i].copy}
                    </p>
                    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="muted" style={{ fontSize: 11 }}>
                        {s.label}
                      </span>
                      <ArrowRight size={14} className="float-x" style={{ color: '#14b8a6' }} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ TESTIMONIAL / STARS BAND ============ */}
        <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            className="hero-glow"
            style={{ width: 500, height: 500, top: -100, right: -100, opacity: 0.2 }}
          />
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 40,
                alignItems: 'center',
              }}
              className="split-grid">
              <div>
                <span className="section-eyebrow">
                  {lang === 'bn' ? 'রোগীদের অভিজ্ঞতা' : 'Patient stories'}
                </span>
                <h2 style={{ marginTop: 14 }}>
                  {lang === 'bn' ? 'আমাদের রোগীরা যা বলেন' : 'Words from those we care for'}
                </h2>
                <p className="lead">
                  {lang === 'bn'
                    ? 'আমাদের লক্ষ্য প্রতিটি রোগীর অভিজ্ঞতাকে উন্নত করা — ছোট ছোট মুহূর্ত থেকে দীর্ঘমেয়াদি সুস্থতা পর্যন্ত।'
                    : 'Every visit is a small moment of care that adds up to long-term wellbeing. Hear what makes our clinic different.'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 24 }}>
                  <div className="stat-num" style={{ fontSize: 56, lineHeight: 1 }}>
                    4.9
                  </div>
                  <div>
                    <StarsArt style={{ width: 120, height: 30 }} />
                    <small className="muted" style={{ display: 'block', marginTop: 4 }}>
                      {lang === 'bn' ? '২,০০০+ রোগীর রিভিউ' : 'Based on 2,000+ reviews'}
                    </small>
                  </div>
                </div>
              </div>
              <div className="perspective" style={{ perspective: 1200 }}>
                <Tilt3D
                  max={5}
                  className="float-3d"
                  style={{
                    borderRadius: 22,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #f0f9ff, #ede9fe)',
                    padding: 32,
                    aspectRatio: '1.3/1',
                    display: 'grid',
                    placeItems: 'center',
                    position: 'relative',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 30px 60px -16px rgba(15,42,68,0.2)',
                  }}>
                  <ChatArt style={{ width: '70%', height: '70%' }} />
                  <div
                    className="orbit"
                    style={{
                      width: '90%',
                      height: '90%',
                      top: '5%',
                      left: '5%',
                      position: 'absolute',
                    }}>
                    <span
                      className="orbit-dot"
                      style={{ background: '#ec4899', boxShadow: '0 0 10px 2px #ec4899' }}
                    />
                  </div>
                </Tilt3D>
              </div>
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section
          className="cta-section aurora-bg"
          style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="blob blob-4" style={{ width: 300, height: 300, top: -100, right: -50 }} />
          <div className="blob blob-5" style={{ width: 260, height: 260, bottom: -80, left: 80 }} />
          <div className="container cta-inner">
            <div
              className="appear-up"
              style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <span className="section-eyebrow">{n.ctaPill}</span>
              <h2 className="gradient-text" style={{ lineHeight: 1.05 }}>
                {n.ctaTitle1}
                <br />
                <em>{n.ctaTitleEm}</em>
              </h2>
              <p>{n.ctaBody}</p>
              <Magnetic>
                <Button
                  onClick={() => onNavigate('Appointment')}
                  className="btn-pro shadow-glow-teal btn-tilt"
                  style={{ alignSelf: 'flex-start' }}>
                  {n.ctaBtn} <ArrowRight size={17} className="float-x" />
                </Button>
              </Magnetic>
            </div>
            <div
              className="appear-up"
              style={{ animationDelay: '0.2s', display: 'flex', justifyContent: 'center' }}>
              <Tilt3D max={8} className="float-3d" style={{ width: '100%', maxWidth: 360 }}>
                <div
                  className="hero-main-bg"
                  style={{
                    borderRadius: 24,
                    overflow: 'hidden',
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,253,250,0.95))',
                    aspectRatio: '1/1',
                    padding: 24,
                    display: 'grid',
                    placeItems: 'center',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 40px 80px -16px rgba(15,42,68,0.25)',
                  }}>
                  <CalendarArt style={{ width: '85%', height: '85%' }} />
                </div>
              </Tilt3D>
            </div>
          </div>
        </section>
      </>
    </ScrollReveal>
  );
}

const SupportChat = memo(function SupportChat({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const copy =
    lang === 'bn'
      ? {
          label: 'সহায়তা চ্যাট',
          title: 'আপনার যত্ন টিমের সাথে কথা বলুন',
          body: 'কীভাবে সাহায্য করতে পারি? আমরা ক্লিনিক সময়ে উত্তর দিই।',
          placeholder: 'আপনার বার্তা লিখুন…',
          send: 'বার্তা পাঠান',
          whatsapp: 'WhatsApp',
          facebook: 'Facebook',
        }
      : {
          label: 'Support chat',
          title: 'Talk to your care team',
          body: 'How can we help? We reply during clinic hours.',
          placeholder: 'Write your message…',
          send: 'Send message',
          whatsapp: 'WhatsApp',
          facebook: 'Facebook',
        };
  const handleClose = useCallback(() => setOpen(false), []);
  const handleSend = useCallback(() => {
    if (message.trim()) {
      setSent(true);
      setMessage('');
    }
  }, [message]);
  return (
    <div className="support-chat-wrap">
      {open && (
        <section className="support-chat-panel" aria-label={copy.label}>
          <div className="support-chat-head">
            <div>
              <span className="support-online-dot" /> {copy.label}
            </div>
            <button type="button" onClick={handleClose} aria-label="Close chat">
              <X size={17} />
            </button>
          </div>
          <div className="support-chat-body">
            <strong>{copy.title}</strong>
            <p>
              {sent
                ? lang === 'bn'
                  ? 'ধন্যবাদ। আপনার বার্তা পাঠানো হয়েছে।'
                  : 'Thanks. Your message has been sent to the care team.'
                : copy.body}
            </p>
            {!sent && (
              <>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={copy.placeholder}
                  aria-label={copy.placeholder}
                />
                <button
                  type="button"
                  className="support-send"
                  disabled={!message.trim()}
                  onClick={handleSend}>
                  {copy.send}
                  <Send size={15} />
                </button>
              </>
            )}
          </div>
          <div className="support-chat-links">
            <a href="https://wa.me/8801719395553" target="_blank" rel="noreferrer">
              <MessageCircle size={15} /> {copy.whatsapp}
              <ExternalLink size={12} />
            </a>
            <a href="https://www.facebook.com/dribrahimhossainkhan/" target="_blank" rel="noreferrer">
              <MessageCircle size={15} /> {copy.facebook}
              <ExternalLink size={12} />
            </a>
          </div>
        </section>
      )}
      <button
        type="button"
        className="support-chat-fab"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-label={copy.label}>
        <MessageCircle size={22} />
        <span>{copy.label}</span>
      </button>
    </div>
  );
});

const SimplePage = memo(function SimplePage({ title, onNavigate }: { title: string; onNavigate: (p: string) => void }) {
  const { lang } = useLanguage();
  const c = common[lang];
  if (title === 'About') return <AboutPage onNavigate={onNavigate} />;
  const map: Record<string, { title1: string; em: string; lead: string }> =
    lang === 'bn'
      ? {
          Services: {
            title1: 'প্রতিটি অধ্যায়ের জন্য',
            em: 'যত্ন।',
            lead: 'আধুনিক স্বাস্থ্যসেবার একটি বিবেচিত, মানবিক দৃষ্টিভঙ্গি। আমাদের ক্লিনিক ঘুরে দেখুন এবং আপনার জীবনের জন্য তৈরি যত্ন আবিষ্কার করুন।',
          },
          Contact: {
            title1: 'প্রয়োজনে আমরা',
            em: 'আপনার পাশে আছি।',
            lead: 'একটি বার্তা পাঠান, আমাদের দল সাহায্য করতে প্রস্তুত।',
          },
        }
      : {
          Services: {
            title1: 'Care for every',
            em: 'chapter.',
            lead: 'A considered, human approach to modern healthcare. Explore our clinic and discover care designed around your life.',
          },
          Contact: {
            title1: 'We&apos;re here when you',
            em: 'need us.',
            lead: 'Send us a note — our team is ready to help.',
          },
        };
  const m =
    map[title] ||
    (lang === 'bn'
      ? {
          title1: title,
          em: 'ক্লিনিকে।',
          lead: 'আধুনিক স্বাস্থ্যসেবার একটি বিবেচিত, মানবিক দৃষ্টিভঙ্গি।',
        }
      : {
          title1: title,
          em: 'at the clinic.',
          lead: 'A considered, human approach to modern healthcare.',
        });
  return (
    <section className="page-section">
      <div className="container narrow">
        <Pill>{c.brandFull}</Pill>
        <h1>
          {m.title1} <em>{m.em}</em>
        </h1>
        <p className="lead">{m.lead}</p>
        <div className="placeholder-feature">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
            alt="Bright clinic interior"
          />
          <div>
            <h2>
              {lang === 'bn'
                ? 'আপনার স্বাস্থ্যকে অগ্রাধিকার দিন।'
                : "Let's make your health a priority."}
            </h2>
            <p>
              {lang === 'bn'
                ? 'আমাদের দল শুনতে, গাইড করতে এবং আপনার যত্ন নিতে প্রস্তুত।'
                : 'Our team is ready to listen, guide and care for you.'}
            </p>
            <Button onClick={() => onNavigate('Appointment')}>
              {c.bookAnAppointment} <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default function Page() {
  const [page, setPage] = useState('Home');
  const { lang, setLang } = useLanguage();
  const c = common[lang];
  const n = navCopy[lang];
  const render =
    page === 'Home' ? (
      <Home onNavigate={setPage} />
    ) : page === 'Gallery' ? (
      <GalleryPage />
    ) : page === 'Services' ? (
      <ServicesPage onNavigate={setPage} />
    ) : page.startsWith('Service:') ? (
      <ServiceDetailPage slug={page.slice(8) as keyof typeof serviceDetails} onNavigate={setPage} />
    ) : page === 'Contact' ? (
      <ContactPage onNavigate={setPage} />
    ) : page === 'Chambers' ? (
      <ChambersPage onNavigate={setPage} />
    ) : page === 'Appointment' ? (
      <AppointmentFlow onNavigate={setPage} />
    ) : page === 'Checkout' ? (
      <CheckoutPage onNavigate={setPage} />
    ) : page === 'Success' ? (
      <SuccessPage onNavigate={setPage} />
    ) : page === 'Admin' ? (
      <AdminWorkspace onExit={() => setPage('Home')} />
    ) : page === 'Patient' ? (
      <PatientPortal onExit={() => setPage('Home')} />
    ) : (
      <SimplePage title={page} onNavigate={setPage} />
    );

  return (
    <>
      <LanguageGate onChange={setLang} />
      <MotionShell />
      <div className="utility-bar">
        <div className="container utility-inner">
          <a href="tel:+8801719395553">
            <Phone size={13} /> +880 1719-939553
          </a>
          <div className="utility-socials">
            <span>{n.utility.follow}</span>
            <a href={n.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              f
            </a>
            <a href={n.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              ◎
            </a>
          </div>
        </div>
      </div>
      <div className="language-fixed">
        <LanguageControl lang={lang} onChange={setLang} />
      </div>
      {page !== 'Admin' && page !== 'Patient' && <PublicHeader onNavigate={setPage} />}
      {render}
      {page !== 'Admin' && page !== 'Patient' && (
        <Footer onNavigate={setPage} onLangChange={setLang} />
      )}
      {page !== 'Admin' && <SupportChat lang={lang} />}
      {(page === 'Appointment' || page === 'Checkout' || page === 'Success') && (
        <div className="floating-invoice">
          <InvoiceButton type={page === 'Appointment' ? 'appointment' : 'order'} lang={lang} />
        </div>
      )}
      {page === 'Home' && (
        <>
          <button className="admin-launch" onClick={() => setPage('Admin')}>
            <LayoutDashboard size={15} /> {n.adminPreview}
          </button>
          <button className="patient-launch" onClick={() => setPage('Patient')}>
            <UserRound size={15} /> {n.patientPreview}
          </button>
        </>
      )}
    </>
  );
}
