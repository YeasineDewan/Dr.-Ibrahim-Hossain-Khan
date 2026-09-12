'use client';

import { useEffect, useMemo, useState, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  ArrowRight,
  CalendarDays,
  CalendarCheck,
  Check,
  Clock3,
  Search,
  ShieldCheck,
  HeartPulse,
  Sparkles,
  Stethoscope,
  Users,
  X,
  Phone,
  MapPin,
  MapPin as MapPinIcon,
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
  Mail,
  MessageCircle,
  Send,
  ExternalLink,
  Gamepad2,
  PlaySquare,
  Quote,
} from 'lucide-react';
import { AboutPage } from '../components/about-page';
import { ServiceDetailPage, serviceDetails } from '../components/service-detail-page';
import { ChamberDetailPage } from '../components/chamber-detail-page';
import { WebVitals } from '../components/web-vitals';
import { common, doctorBio, navCopy, t as tT, useLanguage, type Lang } from '../lib/translations';
import { youtubeEmbedUrl } from '../lib/utils';
import { SeoUpdater, type PageKey } from '../components/seo-updater';
import { AuthProvider, useAuth } from '../components/auth/AuthProvider';
import { Avatar } from '../components/admin-ui';

// Lazy-load heavy route components — they only ship when the user navigates
const PatientPortal = dynamic(
  () => import('../components/patient-portal').then(m => m.PatientPortal),
  {
    ssr: false,
    loading: () => <RouteSkeleton />,
  }
);
const AdminWorkspace = dynamic(
  () => import('../components/admin-workspace').then(m => m.ProtectedAdminWorkspace),
  {
    ssr: false,
    loading: () => <RouteSkeleton />,
  }
);
const MediaUploadForm = dynamic(
  () => import('../components/admin/media-upload-form').then(m => m.MediaUploadForm),
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
import { Tilt3D, Magnetic, Particles } from '../components/motion-3d';
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
const NavBtn = memo(function NavBtn({
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
  const handleClick = useCallback(() => onNavigate(to), [onNavigate, to]);
  const handlePrefetch = useCallback(() => prefetchRoute(to), [to]);
  return (
    <button
      onClick={handleClick}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      onTouchStart={handlePrefetch}
      className={className}
      style={style}
      {...rest}>
      {children}
    </button>
  );
});

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
  const { lang } = useT();
  const navItems = navCopy[lang].navItems as readonly string[];
  const n = navCopy[lang];
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  // Localized nav labels (e.g. 'যোগাযোग') must map back to the canonical
  // English view name the render switch keys on, otherwise Bengali nav breaks.
  const navItemViewMap = useMemo(() => {
    const en = navCopy.en.navItems as readonly string[];
    const loc = navCopy[lang].navItems as readonly string[];
    const map = new Map<string, string>();
    en.forEach((view, i) => map.set(view, view).set(loc[i], view));
    map.set('Skin & Hair Care', 'Service:skin-hair-care').set('Infertility Care', 'Service:infertility-care');
    map.set('ত্বক ও চুলের যত্ন', 'Service:skin-hair-care').set('বন্ধ্যত্ব যত্ন', 'Service:infertility-care');
    return map;
  }, [lang, n.servicesCat1To, n.servicesCat2To]);
  const handleNavClick = useCallback(
    (item: string) => {
      onNavigate(navItemViewMap.get(item) || item);
      setOpen(false);
    },
    [onNavigate, navItemViewMap]
  );
  const handleSearchOpen = useCallback(() => setSearchOpen(true), []);
  const handleSearchClose = useCallback(() => setSearchOpen(false), []);
  const handleMenuToggle = useCallback(() => setOpen(v => !v), []);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!(target instanceof Node)) return;
      if (!document.querySelector('.site-header')?.contains(target)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);
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
    const previousOverflow = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
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
      <header className="site-header nav-scrolled">
        <div className="header-glow" aria-hidden="true" />
        <div className="container header-inner">
          <button
            className="brand press"
            onClick={() => onNavigate('Home')}
            aria-label={common[lang].brandName}>
            <span className="brand-mark">
              <span className="brand-pulse" aria-hidden="true" />
              <img src="/logo-128.png" alt="Dr. Ibrahim Hossain" className="brand-icon-img" width="40" height="40" loading="eager" fetchPriority="high" decoding="async" />
            </span>
            <span className="brand-text">
              <strong>{common[lang].brandName}</strong>
              <small>{n.brandSub}</small>
            </span>
          </button>

          <nav id="primary-navigation" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main">
            <span className="nav-track" aria-hidden="true" />
            {navItems.map((item, i) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                onMouseEnter={() => {
                  setHovered(item);
                  prefetchRoute(navItemViewMap.get(item) || item);
                }}
                onFocus={() => {
                  setHovered(item);
                  prefetchRoute(navItemViewMap.get(item) || item);
                }}
                onTouchStart={() => prefetchRoute(navItemViewMap.get(item) || item)}
                onMouseLeave={() => setHovered(null)}
                className={`nav-link link-underline ${hovered === item ? 'is-hover' : ''}`}
                style={{ animationDelay: `${0.05 + i * 0.04}s` }}>
                <span className="nav-label">{item}</span>
                <span className="nav-dot" aria-hidden="true" />
              </button>
            ))}
            {open && (
              <button
                type="button"
                className="nav-link nav-appointment-link"
                onClick={() => handleNavClick('Appointment')}
                aria-label={n.bookCta}>
                <CalendarCheck size={16} aria-hidden="true" />
                <span>{n.bookCta}</span>
              </button>
            )}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="header-cta press"
              onClick={() => onNavigate('Appointment')}
              aria-label={n.bookCta}>
              <CalendarCheck size={16} />
              <span>{n.bookCta}</span>
            </button>
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
            <button
              className="menu-btn press"
              onClick={handleMenuToggle}
              aria-label={open ? (lang === 'bn' ? 'মেনু বন্ধ করুন' : 'Close menu') : common[lang].openMenu}
              aria-expanded={open}
              aria-controls="primary-navigation">
              <MoreHorizontal size={22} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        </div>

        {open && (
          <div
            className="nav-backdrop"
            onClick={() => setOpen(false)}
            aria-hidden="true"
            role="presentation"
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
  onLocationOpen,
}: {
  onNavigate: (p: string) => void;
  onLangChange?: (l: 'en' | 'bn') => void;
  onLocationOpen: () => void;
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
    window.scrollTo({ top: 0, behavior: 'auto' });
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
              <img src="/logo-128.png" alt="Dr. Ibrahim Hossain" className="brand-icon-img" width="40" height="40" loading="lazy" decoding="async" />
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
                { k: 'youtube', label: n.youtubeLabel, href: n.socials.youtube },
              ].map((s, i) => (
                <a key={s.k + i} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="press ripple social-btn">
                  {s.k === 'youtube' ? <PlaySquare size={18} aria-hidden="true" /> : s.k}
                  <span className="social-glow" aria-hidden="true" />
                </a>
              ))}
              <button
                type="button"
                className="press ripple social-btn footer-location-btn"
                onClick={onLocationOpen}
                aria-label={n.locationAria || 'Our location'}
                aria-haspopup="dialog"
                aria-controls="location-modal">
                <MapPinIcon
                  size={18}
                  strokeWidth={1.8}
                  style={{ transform: 'translateY(-1px)' }}
                  aria-hidden="true"
                />
                <span className="social-glow" aria-hidden="true" />
              </button>
            </div>
        </div>

        {/* Explore */}
        <div className="footer-col">
          <h4>{n.exploreHeading}</h4>
          <ul className="footer-link-list">
             {(
               [
                 { view: 'About', idx: 1 },
                 { view: 'Services', idx: 2 },
                 { view: 'Chambers', idx: 4 },
                 { view: 'Gallery', idx: 3 },
               ] as const
             ).map(({ view, idx }, i) => (
              <li key={view} style={{ animationDelay: `${0.05 + i * 0.05}s` }}>
                <button onClick={() => onNavigate(view)} className="footer-link link-underline">
                  {n.navItems[idx] || view}
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
  const b = doctorBio[lang];
  return (
    <ScrollReveal className="home-reveal">
      <>
        {/* ============ HERO ============ */}
        <section className="about-hero home-hero">
          <div className="home-hero-bg" aria-hidden="true" />
          <div className="about-hero-accent" aria-hidden="true" />
          <div className="container about-hero-grid">
            <div className="appear-up">
              <span className="pill">{n.homePill}</span>
              <h1 className="gradient-text">
                {n.homeTitle1} <em>{n.homeTitleEm}</em>
              </h1>
              <p className="lead">{n.homeLead}</p>
              <div className="about-credentials">
                {n.stats.slice(0, 3).map((s, i) => (
                  <div key={i} className="lift">
                    <strong className="counter">{s.strong}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary btn-pro shadow-glow-teal"
                onClick={() => onNavigate('Appointment')}>
                {n.heroBookBtn} <ArrowRight size={16} />
              </button>
            </div>
            <figure className="about-portrait home-hero-portrait">
              <div className="home-hero-media">
                <div className="home-hero-media-grid" aria-hidden="true" />
                <div className="home-hero-media-glow" aria-hidden="true" />
                <div className="home-hero-image-frame">
                  <Image
                    className="home-hero-image"
                    src="/hero-doctor.png"
                    alt="Dr. Ibrahim, family physician"
                    width={274}
                    height={444}
                    priority
                    sizes="(max-width: 700px) 82vw, (max-width: 1100px) 42vw, 480px"
                    quality={75}
                  />
                </div>
                <div className="home-hero-media-chip home-hero-availability">
                  <span className="home-hero-chip-icon" aria-hidden="true">
                    <HeartPulse size={16} />
                  </span>
                  <span>
                    <strong>{n.availableToday}</strong>
                    <small>{n.nextOpening}</small>
                  </span>
                </div>
                <div className="home-hero-media-chip home-hero-rating-chip">
                  <span className="home-hero-chip-icon" aria-hidden="true">
                    <Star size={16} />
                  </span>
                  <span>
                    <strong>{n.homeRating}</strong>
                    <small>{n.homeRatingBody}</small>
                  </span>
                </div>
              </div>
              <figcaption className="home-hero-caption">
                <span className="home-hero-caption-icon" aria-hidden="true">
                  <Stethoscope size={18} />
                </span>
                <span className="home-hero-caption-copy">
                  <strong>{b.name}</strong>
                  <small>{b.role}</small>
                </span>
                <span className="home-hero-caption-gmc">
                  <ShieldCheck size={15} aria-hidden="true" />
                  {n.storiesGmc}
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ============ STATS — compact horizontal strip ============ */}
        <section className="stats-strip">
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

        {/* ============ CARE PRINCIPLES — post-hero bridge ============ */}
        <section
          className="section care-principles"
          style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            className="hero-glow"
            style={{ width: 340, height: 340, top: -120, left: '10%', opacity: 0.18 }}
          />
          <div className="container" style={{ position: 'relative' }}>
            <ScrollReveal>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <span className="section-eyebrow" style={{ color: '#3b9b91' }}>
                  {n.carePrinciplesEyebrow}
                </span>
                <h2 style={{ marginTop: 12 }}>What is Integrative medicine?</h2>
              </div>
            </ScrollReveal>
            <ScrollReveal className="video-embed-wrapper">
              <div style={{ position: 'relative', width: '100%', maxWidth: 960, margin: '0 auto' }}>
                <iframe
                  src={youtubeEmbedUrl('https://youtu.be/NtCAaMERx9Q') ?? ''}
                  title="What is Integrative medicine?"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', aspectRatio: '16 / 9', border: 0, borderRadius: 12, display: 'block' }}
                />
              </div>
            </ScrollReveal>
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

        {/* ============ VISITING CARD BANNER ============ */}
        <section className="section home-banner">
          <div className="container" style={{ textAlign: 'center' }}>
            <ScrollReveal>
              <div
                className="section-eyebrow-wrap"
                style={{
                  marginBottom: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <span className="section-eyebrow" style={{ color: '#174b78' }}>
                  {lang === 'bn' ? 'ভিসিটিং কার্ড' : 'Visiting card'}
                </span>
                <h2 className="gradient-text" style={{ marginTop: 12 }}>
                  {lang === 'bn' ? 'ডাক্টর ইব্রাহিম হোসাইন' : 'Dr. Ibrahim Hossain'}
                </h2>
                <p className="muted" style={{ maxWidth: 560, margin: '10px auto 0', fontSize: 15 }}>
                  {lang === 'bn'
                    ? 'আপনার স্বাস্থ্য আমাদের অগ্রাধিকার। এই ভিসিটিং কার্ডটি আপনার চেম্বর ঠিকানা ও সংযোগের তথ্য ধরে।'
                    : 'Your health is our priority. This visiting card holds the chamber address and contact details for your care journey.'}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal className="banner-media" delay={150}>
              <img
                src="/visiting_card.jpg"
                alt={lang === 'bn' ? 'ডাক্টর ইব্রাহিমের ভিসিটিং কার্ড' : "Dr. Ibrahim's visiting card"}
                className="banner-image"
                loading="lazy"
                decoding="async"
              />
            </ScrollReveal>
          </div>
        </section>

        {/* ============ OUR APPROACH ============ */}
        <section className="section split-section" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="container split-grid">
            <div className="split-image perspective" style={{ perspective: 1500 }}>
              <img
                src="/Our_approach.jpg"
                alt={lang === 'bn' ? 'আমাদের দৃষ্টিভঙ্গি' : 'Our approach'}
                className="approach-image"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 22,
                  boxShadow: '0 30px 60px -16px rgba(15,42,68,0.25)',
                  border: '1px solid rgba(255,255,255,0.8)',
                }}
              />
            </div>
            <div className="split-content">
              <div className="split-content-card">
                <span className="section-eyebrow" style={{ color: '#174b78' }}>
                  {lang === 'bn' ? 'আমাদের দৃষ্টিভঙ্গি' : 'Our approach'}
                </span>
                <h2 style={{ marginTop: 14 }}>
                  {doctorBio[lang].integrativeTitle}
                </h2>
                <p className="muted" style={{ marginTop: 14, lineHeight: 1.8 }}>
                  {doctorBio[lang].integrativeBody}
                </p>
                <p className="muted" style={{ marginTop: 10, lineHeight: 1.8 }}>
                  {doctorBio[lang].integrativeGoal}
                </p>
                <button
                  onClick={() => onNavigate('Services')}
                  className="btn-primary"
                  style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', background: '#174b78', color: '#fff', transition: 'background 0.3s ease, transform 0.3s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#0f355c'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#174b78'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  {n.viewAllServices}
                  <ArrowRight size={16} className="float-x" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============ FEATURE GRID — 3D illustrations ============  */}
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

        {/* ============ PATIENT STORIES / TESTIMONIALS ============ */}
        <section className="section">
          <div
            className="hero-glow"
            style={{ width: 500, height: 500, top: -100, right: -100, opacity: 0.2 }}
          />
          <div className="container" style={{ position: 'relative' }}>
            <div className="split-grid testimonial-split">
              <div className="testimonial-copy">
                <ScrollReveal>
                  <span className="section-eyebrow">{n.storiesEyebrow}</span>
                  <h2 style={{ marginTop: 14 }}>
                    {n.storiesTitle1} <em>{n.storiesTitleEm}</em>
                  </h2>
                  <p className="lead">{n.storiesLead}</p>
                </ScrollReveal>
                <ScrollReveal>
                  <div className="testimonial-rating">
                    <div className="testimonial-rating-num">{n.storiesRating}</div>
                    <div className="testimonial-rating-stars">
                      <StarsArt style={{ width: 132, height: 34 }} />
                      <span>{n.storiesStarsLabel}</span>
                    </div>
                    <small className="muted">{n.storiesBased}</small>
                  </div>
                </ScrollReveal>
                <ScrollReveal>
                  <div className="testimonial-trust">
                    <span className="trust-badge">
                      <ShieldCheck size={14} /> {n.storiesTrust}
                    </span>
                    <span className="trust-badge">
                      <Stethoscope size={14} /> {n.storiesGmc}
                    </span>
                    <span className="trust-badge">
                      <ShieldCheck size={14} /> {n.storiesEncrypted}
                    </span>
                  </div>
                </ScrollReveal>
                <ScrollReveal>
                  <div className="testimonial-quote-card">
                    <Quote size={28} className="quote-mark" />
                    <p>{n.storiesQuote1}</p>
                    <div className="testimonial-author">
                      <Avatar name={n.storiesName1} size={38} />
                      <div>
                        <strong>{n.storiesName1}</strong>
                        <small>{n.storiesRole1}</small>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
                <ScrollReveal style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('Appointment')}
                    className="btn-pro">
                    {n.storiesMoreCta} <ArrowRight size={16} className="float-x" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate('Contact')}
                    className="btn-pro">
                    {n.storiesShareCta}
                  </Button>
                </ScrollReveal>
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
        <section className="cta-section aurora-bg">
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
            title1: 'প্রতিটি অধ্যায��ের জন্য',
            em: 'যত্ন।',
            lead: 'আধুনিক স্বাস্থ্যসেবার একটি বিবেচিত, মানবিক দৃষ্টিভঙ্গি। আমাদের ক্লিনিক ঘুরে দেখুন এবং আপনার জীবনের জন্য তৈরি যত্ন আবিষ্কার করুন।',
          },
          Contact: {
            title1: 'প্রয়োজনে আমরা',
            em: 'আপনার পাশ�� আছি।',
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
          em: '���্লিনিকে।',
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
                ? 'আমাদের দল শুনতে, গাইড করতে এবং আপনার য���্ন নিতে প্রস্তুত।'
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
  const [locationOpen, setLocationOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const c = common[lang];
  const n = navCopy[lang];

  useEffect(() => {
    if (!locationOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLocationOpen(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [locationOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [page]);

  const render =
    page === 'Home' ? (
      <Home onNavigate={setPage} />
    ) : page === 'Gallery' ? (
      <GalleryPage />
  ) : page.startsWith('Service:') ? (
      <ServiceDetailPage slug={page.slice(8) as keyof typeof serviceDetails} onNavigate={setPage} />
    ) : page === 'Contact' ? (
      <ContactPage onNavigate={setPage} />
    ) : page === 'Chambers' ? (
      <ChambersPage onNavigate={setPage} />
    ) : page.startsWith('Chamber:') ? (
      <ChamberDetailPage slug={page.slice(8)} onNavigate={setPage} />

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
    ) : page === 'MediaUpload' ? (
      <MediaUploadForm />
    ) : (
      <SimplePage title={page} onNavigate={setPage} />
    );

  return (
    <>
      <LanguageGate onChange={setLang} />
      <SeoUpdater
        page={(() => {
          if (page === 'Home') return 'Home';
          if (['About', 'Gallery', 'Contact', 'Chambers', 'Appointment', 'Checkout', 'Success', 'Services'].includes(page)) {
            return page as PageKey;
          }
          if (page.startsWith('Service:')) return 'ServiceDetail';
          if (page.startsWith('Chamber:')) return 'ChamberDetail';
          return 'Home';
        })()}
        serviceSlug={page.startsWith('Service:') ? page.slice(8) : undefined}
        chamberSlug={page.startsWith('Chamber:') ? page.slice(8) : undefined}
      />
      <WebVitals />
      <MotionShell />
      <div className="utility-bar">
        <div className="container utility-inner">
          <a href="tel:+8801719395553">
            <Phone size={13} /> +880 1719-939553
          </a>
          <div className="utility-socials">
            <span>{n.utility.follow}</span>
            <button
              className="utility-location-btn"
              onClick={() => setLocationOpen(true)}
              aria-label={n.locationAria || 'Our location'}
              aria-haspopup="dialog"
              aria-controls="location-modal">
              <MapPinIcon size={15} aria-hidden="true" />
            </button>
            <a href={n.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              f
            </a>
            <a href={n.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              ◎
            </a>
            <a href={n.socials.youtube} target="_blank" rel="noreferrer" aria-label={n.youtubeLabel}>
              <PlaySquare size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      {locationOpen && (
        <div className="location-modal-backdrop" role="presentation" onClick={() => setLocationOpen(false)}>
          <div
            id="location-modal"
            className="location-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-modal-title"
            onClick={e => e.stopPropagation()}>
            <button
              className="location-modal-close"
              onClick={() => setLocationOpen(false)}
              aria-label={lang === 'bn' ? 'মানচিত্র বন্ধ করুন' : 'Close map'}>
              <X size={18} aria-hidden="true" />
            </button>
            <div className="location-modal-heading">
              <span className="location-modal-icon">
                <MapPinIcon size={20} aria-hidden="true" />
              </span>
              <div>
                <span className="location-modal-eyebrow">{lang === 'bn' ? 'আমাদের চেম্বার' : 'Our chamber'}</span>
                <h2 id="location-modal-title">{n.locationAria || 'Our location'}</h2>
              </div>
            </div>
            <div className="location-map-frame">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.0504414247616!2d90.39536509999999!3d23.7455806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b90033178451%3A0x3a30eeb7d453498f!2sMedigo%20Healthcare!5e0!3m2!1sen!2sbd!4v1789156806853!5m2!1en!2sbd"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Medigo Healthcare location"
              />
            </div>
          </div>
        </div>
      )}
      <div className="language-fixed">
        <LanguageControl lang={lang} onChange={setLang} />
      </div>
      {page !== 'Admin' && page !== 'Patient' && <PublicHeader onNavigate={setPage} />}
      {render}
      {page !== 'Admin' && page !== 'Patient' && (
        <Footer
          onNavigate={setPage}
          onLangChange={setLang}
          onLocationOpen={() => setLocationOpen(true)}
        />
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
          <button
            className="patient-launch"
            onClick={() => {
              window.open('/game-tictactoe.html', '_blank', 'noopener,noreferrer');
            }}
          >
            <Gamepad2 size={15} /> Tic Tac Toe
          </button>
        </>
      )}
    </>
  );
}
