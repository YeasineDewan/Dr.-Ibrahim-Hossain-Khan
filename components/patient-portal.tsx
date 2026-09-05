'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  CalendarDays,
  FileText,
  HeartPulse,
  LayoutDashboard,
  MessageCircle,
  Pill as PillIcon,
  ShieldCheck,
  UserRound,
  Video,
  ChevronRight,
  ChevronDown,
  Clock3,
  Download,
  Plus,
  Menu,
  X,
  Stethoscope,
  Bell,
  Search,
  MoreHorizontal,
  MapPin,
  Filter,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Send,
  Sparkles,
  Calendar,
  Phone,
  Check,
  AlertCircle,
  CalendarCheck,
  FlaskConical,
  Bookmark,
  Shield,
  Zap,
  Award,
  BarChart3,
  Heart,
  Sun,
  ArrowRight,
  Settings,
} from 'lucide-react';
import { patientCopy, useLanguage } from '../lib/translations';
import { useAdminData } from '../lib/admin-data';
import { Avatar, Pill as PillUI, Sparkline, Donut, Stat } from './admin-ui';
import {
  HeartbeatArt,
  ShieldArt,
  PillArt,
  CalendarArt,
  ChatArt,
  InfinityArt,
  StarsArt,
  DnaArt,
  FamilyArt,
  StethoArt,
} from './illust-svg';
import { Magnetic, Tilt3D } from './motion-3d';

const toBn = (n: number) => n.toLocaleString('bn-BD');
const toBnTime = (t: string) => t.replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[+d]);

const navIcons: Record<string, any> = {
  Overview: LayoutDashboard,
  Appointments: CalendarDays,
  'Health records': FileText,
  Prescriptions: PillIcon,
  Messages: MessageCircle,
  'Care plans': HeartPulse,
  Billing: BarChart3,
  'Profile & settings': UserRound,
  সারসংক্ষেপ: LayoutDashboard,
  অ্যাপয়েন্টমেন্ট: CalendarDays,
  'স্বাস্থ্য রেকর্ড': FileText,
  প্রেসক্রিপশন: PillIcon,
  বার্তা: MessageCircle,
  'কেয়ার প্ল্যান': HeartPulse,
  বিলিং: BarChart3,
  'প্রোফাইল ও সেটিংস': UserRound,
};

const userName = 'Amara Mensah';

export function PatientPortal({ onExit }: { onExit: () => void }) {
  const { lang } = useLanguage();
  const p = patientCopy[lang] as any;
  const data = useAdminData();
  const englishLabels = [
    'Overview',
    'Appointments',
    'Health records',
    'Prescriptions',
    'Messages',
    'Care plans',
    'Billing',
    'Profile & settings',
  ];
  const labels = (p.ppDetail?.nav || []).map((item: any) => item.label) as readonly string[];
  const [activeKey, setActiveKey] = useState('Overview');
  const active = labels[englishLabels.indexOf(activeKey)] || activeKey;
  const setActive = (label: string) => setActiveKey(englishLabels[labels.indexOf(label)] || label);
  const [menu, setMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [greet, setGreet] = useState<string>(p.goodMorning || 'Good morning');
  useEffect(() => {
    const h = new Date().getHours();
    const base =
      h < 12
        ? p.greetMorning || p.goodMorning
        : h < 18
          ? p.greetAfternoon || p.goodMorning
          : p.greetEvening || p.goodMorning;
    setGreet(base as string);
  }, [lang, p.greetMorning, p.greetAfternoon, p.greetEvening, p.goodMorning]);
  const me = data.patients[0];
  const firstName = me.name.split(' ')[0];
  return (
    <div className="patient-app">
      <aside className={menu ? 'patient-side is-open' : 'patient-side'}>
        <div className="patient-side-bg" aria-hidden="true">
          <div className="patient-side-orb patient-side-orb-1" />
          <div className="patient-side-orb patient-side-orb-2" />
        </div>
        <button className="patient-brand" onClick={onExit}>
          <span className="brand-mark">
            <Activity size={18} />
            <span className="brand-pulse-mini" />
          </span>
          <span>
            {lang === 'bn' ? 'ডাঃ ইব্রাহিম' : 'Dr. Ibrahim'}
            <small>{p.brandSub}</small>
          </span>
        </button>
        <div className="patient-welcome lift">
          <Avatar name={me.name} size={42} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong>{lang === 'bn' ? 'আমারা মেনসাহ' : me.name}</strong>
            <small>{p.welcome}</small>
          </div>
          <span className="patient-online" title={p.welcome} />
        </div>
        <nav className="patient-nav">
          {labels.map((label, i) => {
            const Icon = navIcons[label] || LayoutDashboard;
            const isActive = active === label;
            return (
              <button
                key={label}
                className={`${isActive ? 'patient-link active' : 'patient-link'} press`}
                onClick={() => {
                  setActive(label);
                  setMenu(false);
                }}
                style={{ animationDelay: `${0.05 + i * 0.04}s` }}>
                <Icon size={17} className={isActive ? 'float-soft' : ''} />
                <span>{label}</span>
                {isActive && <span className="patient-link-glow" aria-hidden="true" />}
              </button>
            );
          })}
        </nav>
        <div className="patient-side-bottom">
          <button className="patient-link press" onClick={onExit}>
            <ChevronRight size={17} style={{ transform: 'rotate(180deg)' }} />
            <span>{p.backToWebsite}</span>
          </button>
        </div>
      </aside>

      <main className="patient-main">
        <header className="patient-top">
          <button className="patient-menu press" onClick={() => setMenu(!menu)} aria-label="Menu">
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="patient-search glow-focus">
            <Search size={15} />
            <input placeholder={p.searchPlaceholder || p.search} />
          </div>
          <div className="patient-top-actions">
            <div className="patient-popover-wrap">
              <button
                className="patient-icon press"
                onClick={() => {
                  setNotifOpen(o => !o);
                  setProfileOpen(false);
                }}
                aria-label={p.notifTitle || 'Notifications'}>
                <Bell size={18} />
                <i className="pulse" />
              </button>
              {notifOpen && (
                <div
                  className="patient-popover notif-popover glass-panel"
                  onClick={e => e.stopPropagation()}>
                  <div className="popover-head">
                    <strong>{p.notifTitle}</strong>
                    <button className="press">{p.markAllRead}</button>
                  </div>
                  <ul className="popover-list">
                    {data.notifications.slice(0, 4).map((n: any) => (
                      <li key={n.id} className={n.read ? '' : 'is-unread'}>
                        <span className={`adm-notif-icon adm-notif-${n.type}`}>
                          <MessageCircle size={14} />
                        </span>
                        <div className="grow">
                          <strong>{n.title}</strong>
                          <p>{n.body}</p>
                          <small>{n.time}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button className="patient-icon press" aria-label={p.messages}>
              <MessageCircle size={18} />
            </button>
            <div className="patient-popover-wrap">
              <button
                className="patient-profile press"
                onClick={() => {
                  setProfileOpen(o => !o);
                  setNotifOpen(false);
                }}>
                <Avatar name={me.name} size={32} />
                <div className="patient-profile-text">
                  <strong>{firstName}</strong>
                  <small>{p.welcome}</small>
                </div>
                <ChevronDown size={14} />
              </button>
              {profileOpen && (
                <div
                  className="patient-popover profile-popover glass-panel"
                  onClick={e => e.stopPropagation()}>
                  <div className="popover-head">
                    <Avatar name={me.name} size={48} />
                    <div>
                      <strong>{me.name}</strong>
                      <small>{me.email}</small>
                    </div>
                  </div>
                  <button className="popover-link">
                    <UserRound size={15} /> {p.viewProfile}
                  </button>
                  <button className="popover-link">
                    <Settings size={15} /> {p.profileTitle}
                  </button>
                  <button className="popover-link danger" onClick={onExit}>
                    <X size={15} /> {p.signOut}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="patient-content" key={active}>
          {active === labels[0] ? (
            <PatientOverview copy={p} data={data} greet={greet} />
          ) : (
            <PatientView name={active} copy={p} data={data} />
          )}
        </div>
      </main>
      {(notifOpen || profileOpen) && (
        <div
          className="patient-popover-backdrop"
          onClick={() => {
            setNotifOpen(false);
            setProfileOpen(false);
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

function PatientOverview({ copy, data, greet }: { copy: any; data: any; greet: string }) {
  const { lang } = useLanguage();
  const me = data.patients[0];
  const appts = data.appointments
    .filter((a: any) => a.patient === me.name)
    .sort((a: any, b: any) => a.time.localeCompare(b.time));
  const next = appts[0];
  const last = me.visits[me.visits.length - 1];
  const bn = lang === 'bn';
  const fmt = (n: number) => (bn ? toBn(n) : n.toString());
  return (
    <>
      {/* Hero greeting */}
      <section className="pp-hero appear-down">
        <div className="pp-hero-bg" aria-hidden="true">
          <div
            className="light-leak"
            style={{ width: 400, height: 400, top: -100, right: -100, opacity: 0.3 }}
          />
          <div className="grid-dots" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
        </div>
        <div className="pp-hero-content">
          <span className="pro-kicker">
            <Sun
              size={11}
              className="heartbeat"
              style={{ display: 'inline-block', color: '#f59e0b' }}
            />{' '}
            {copy.today}
          </span>
          <h1 className="gradient-text">{greet}</h1>
          <p>{copy.todayBody}</p>
          <div className="pp-hero-actions">
            <Magnetic>
              <button className="pro-primary btn-pro shadow-glow-teal">
                <CalendarCheck size={15} /> {copy.bookBtn}
              </button>
            </Magnetic>
            <Magnetic>
              <button className="pro-outline btn-pro">
                <Video size={15} /> {copy.joinVideo}
              </button>
            </Magnetic>
            <span className="pp-hero-meta">
              <span className="status-dot" />
              <span>{bn ? 'অনলাইন' : 'Online'}</span>
            </span>
          </div>
        </div>
        <div className="pp-hero-art">
          <div className="pp-hero-art-inner">
            <HeartbeatArt style={{ width: '100%', height: '100%' }} />
            <span className="pp-hero-pulse pp-hero-pulse-1" />
            <span className="pp-hero-pulse pp-hero-pulse-2" />
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <div className="pp-stats adm-stagger">
        <Stat
          tone="teal"
          label={copy.totalAppts}
          value={fmt(appts.length)}
          icon={<CalendarCheck size={20} />}
          delta="+2 this month"
        />
        <Stat
          tone="blue"
          label={copy.activeRx}
          value={fmt(me.medications.length || 3)}
          icon={<PillIcon size={20} />}
          delta="3 active"
        />
        <Stat
          tone="gold"
          label={copy.totalVisits}
          value={fmt(me.visits.length || 0)}
          icon={<HeartPulse size={20} />}
          delta={last ? `${bn ? 'শেষ' : 'Last'}: ${last.date}` : ''}
        />
        <Stat
          tone="coral"
          label={copy.allergies}
          value={fmt(me.allergies.length || 0)}
          icon={<ShieldCheck size={20} />}
          delta={me.allergies[0] || (bn ? 'নথিভুক্ত নেই' : 'None on file')}
        />
      </div>

      {/* Vitals + Donut */}
      <div className="pp-grid adm-stagger">
        <Tilt3D max={3} className="pro-panel card-3d lift">
          <div className="pro-panel-head">
            <div>
              <span className="pro-kicker">{copy.myVitals}</span>
              <h2>{copy.vitalsTitle}</h2>
              <small className="muted-light">{copy.vitalsSub}</small>
            </div>
            <PillUI tone="teal">
              <TrendingDown size={11} /> {bn ? 'স্থিতিশীল' : 'Stable'}
            </PillUI>
          </div>
          <div className="pp-vitals-grid">
            <div className="pp-vital">
              <span className="pp-vital-label">{copy.bp}</span>
              <strong className="pp-vital-val">
                {me.vitals.bp}
                <small>mmHg</small>
              </strong>
              <Sparkline values={[120, 118, 122, 121, 119, 118, 118]} color="#14b8a6" />
            </div>
            <div className="pp-vital">
              <span className="pp-vital-label">{copy.heartRate}</span>
              <strong className="pp-vital-val">
                {me.vitals.hr}
                <small>bpm</small>
              </strong>
              <Sparkline values={[68, 72, 75, 74, 72, 72, 72]} color="#ec4899" />
            </div>
            <div className="pp-vital">
              <span className="pp-vital-label">{copy.weight}</span>
              <strong className="pp-vital-val">{me.vitals.weight}</strong>
              <Sparkline values={[65, 65, 64, 64, 64, 64, 64]} color="#6366f1" />
            </div>
            <div className="pp-vital">
              <span className="pp-vital-label">{copy.bmi}</span>
              <strong className="pp-vital-val">
                22.4<small>kg/m²</small>
              </strong>
              <Donut value={56} total={100} label="Adherence" color="#14b8a6" />
            </div>
          </div>
        </Tilt3D>

        <Tilt3D max={3} className="pro-panel card-3d lift pp-next-appt">
          <div className="pro-panel-head">
            <div>
              <span className="pro-kicker">{copy.upcomingAppt}</span>
              <h2>{next ? next.service : copy.noUpcoming}</h2>
            </div>
            {next && <PillUI tone="teal">{next.status}</PillUI>}
          </div>
          {next ? (
            <>
              <div className="pp-next-card">
                <div className="pp-next-date">
                  <Calendar size={28} />
                  <div>
                    <strong>{next.date}</strong>
                    <small>{bn ? 'তারিখ' : 'Date'}</small>
                  </div>
                </div>
                <div className="pp-next-time">
                  <Clock3 size={18} />
                  <div>
                    <strong>{bn ? toBnTime(next.time) : next.time}</strong>
                    <small>{next.duration}</small>
                  </div>
                </div>
              </div>
              <div className="adm-detail-grid">
                <div>
                  <Stethoscope size={14} />
                  <span>{copy.doctor}</span>
                  <strong>{next.doctor}</strong>
                </div>
                <div>
                  <MapPin size={14} />
                  <span>{copy.chamber}</span>
                  <strong>{next.chamber}</strong>
                </div>
                <div>
                  <Activity size={14} />
                  <span>{bn ? 'ধরন' : 'Type'}</span>
                  <strong>{next.type}</strong>
                </div>
                <div>
                  <Phone size={14} />
                  <span>{bn ? 'যোগাযোগ' : 'Contact'}</span>
                  <strong>{me.phone}</strong>
                </div>
              </div>
              <div className="pp-next-actions">
                <button className="pro-primary btn-pro">
                  {copy.confirm} <Check size={14} />
                </button>
                <button className="pro-outline btn-pro">{copy.reschedule}</button>
                <button className="pro-text-link">
                  {copy.viewDetails} <ArrowRight size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <CalendarArt style={{ width: 80, height: 80, opacity: 0.6 }} />
              <p className="muted-light">{copy.empty}</p>
              <button className="pro-primary btn-pro">{copy.bookNew}</button>
            </div>
          )}
        </Tilt3D>
      </div>

      {/* Care plan + medications */}
      <div className="pp-grid adm-stagger">
        <Tilt3D max={3} className="pro-panel card-3d lift">
          <div className="pro-panel-head">
            <div>
              <span className="pro-kicker">{copy.yourProgress}</span>
              <h2>{copy.carePlanTitle}</h2>
            </div>
            <span className="pro-pill-btn pulse">68%</span>
          </div>
          <div className="pp-progress-track">
            <span className="pp-progress-fill" style={{ width: '68%' }} />
            <span className="pp-progress-glow" style={{ left: '68%' }} />
          </div>
          <ul className="adm-task-list pp-care-list">
            {[
              {
                ico: PillIcon,
                label: bn ? 'সকালের ওষুধ নিন' : 'Take morning medication',
                done: true,
                t: '08:00',
              },
              {
                ico: Activity,
                label: bn ? '৩০ মিনিট হাঁটুন' : 'Walk for 30 minutes',
                done: true,
                t: '09:30',
              },
              {
                ico: FlaskConical,
                label: bn ? 'ল্যাব ফলো-আপ' : 'Lab follow-up',
                done: false,
                t: bn ? 'আগামীকাল' : 'Tomorrow',
              },
              {
                ico: CalendarCheck,
                label: bn ? 'ডাক্তারের সাথে ভিডিও কল' : 'Doctor video call',
                done: false,
                t: bn ? 'এই সপ্তাহে' : 'This week',
              },
              {
                ico: Heart,
                label: bn ? 'রাতের ঘুম ৮ ঘণ্টা' : '8 hours of sleep',
                done: false,
                t: bn ? 'আজ রাতে' : 'Tonight',
              },
            ].map((t, i) => {
              const Ico = t.ico;
              return (
                <li key={i} className={t.done ? 'is-done' : ''}>
                  <span className={`task-prio ${t.done ? 'low' : i === 0 ? 'high' : 'medium'}`}>
                    {t.done ? <Check size={11} /> : <Ico size={11} />}
                  </span>
                  <div className="grow">
                    <strong>{t.label}</strong>
                    <small>{t.t}</small>
                  </div>
                  <PillUI tone={t.done ? 'teal' : 'sand'}>
                    {t.done ? copy.goalComplete : copy.inProgress}
                  </PillUI>
                </li>
              );
            })}
          </ul>
        </Tilt3D>

        <Tilt3D max={3} className="pro-panel card-3d lift">
          <div className="pro-panel-head">
            <div>
              <span className="pro-kicker">{copy.currentMed}</span>
              <h2>{copy.prescriptions}</h2>
            </div>
            <PillUI tone="teal">{copy.active}</PillUI>
          </div>
          {me.medications.length === 0 ? (
            <div className="empty-state">
              <PillArt style={{ width: 70, height: 70, opacity: 0.6 }} />
              <p className="muted-light">{copy.noMeds}</p>
            </div>
          ) : (
            <ul className="adm-rx-list">
              {me.medications.map((m: any, i: number) => (
                <li key={i}>
                  <span className="adm-rx-icon">
                    <PillIcon size={16} />
                  </span>
                  <div className="grow">
                    <strong>{m.name}</strong>
                    <small>{m.dose}</small>
                  </div>
                  <div className="adm-rx-meta">
                    <Donut value={75 + i * 5} total={100} label="" color="#14b8a6" />
                    <PillUI tone="teal">{m.status}</PillUI>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="panel-foot">
            <button className="pro-text-link">
              {copy.refillRequest} <ArrowRight size={14} />
            </button>
          </div>
        </Tilt3D>
      </div>

      {/* Activity timeline + records card */}
      <div className="pp-grid adm-stagger">
        <Tilt3D max={3} className="pro-panel card-3d lift">
          <div className="pro-panel-head">
            <div>
              <span className="pro-kicker">{copy.stepsTitle}</span>
              <h2>{copy.yourJourney}</h2>
            </div>
            <button className="pro-text-link">
              {copy.viewAll} <ArrowRight size={14} />
            </button>
          </div>
          <ul className="pp-timeline">
            {me.visits.slice(0, 5).map((v: any, i: number) => (
              <li key={i}>
                <span className="pp-timeline-dot" />
                <div className="grow">
                  <strong>{v.reason}</strong>
                  <small>
                    {v.date} · {v.doctor}
                  </small>
                  <p>{v.notes}</p>
                </div>
                <PillUI tone="teal">
                  <Check size={10} />
                </PillUI>
              </li>
            ))}
          </ul>
        </Tilt3D>

        <Tilt3D max={3} className="pro-panel secure-card card-3d lift">
          <div className="secure-illust">
            <ShieldArt style={{ width: 100, height: 100 }} />
          </div>
          <h2>{copy.recordsTitle}</h2>
          <p>{copy.recordsBody}</p>
          <div className="secure-stats">
            <div>
              <strong>{fmt(me.documents.length)}</strong>
              <small>{bn ? 'নথি' : 'documents'}</small>
            </div>
            <div>
              <strong>{fmt(me.visits.length)}</strong>
              <small>{bn ? 'ভিজিট' : 'visits'}</small>
            </div>
            <div>
              <strong>256-bit</strong>
              <small>{bn ? 'এনক্রিপশন' : 'encryption'}</small>
            </div>
          </div>
          <button className="pro-outline btn-pro">
            <Shield size={14} /> {copy.privacyBtn}
          </button>
        </Tilt3D>
      </div>
    </>
  );
}

function PatientView({ name, copy, data }: { name: string; copy: any; data: any }) {
  const { lang } = useLanguage();
  const me = data.patients[0];
  const bn = lang === 'bn';
  const fmt = (n: number) => (bn ? toBn(n) : n.toString());
  const isAppts = name === 'Appointments' || name === 'অ্যাপয়েন্টমেন্ট';
  const isRecords = name === 'Health records' || name === 'স্বাস্থ্য রেকর্ড';
  const isRx = name === 'Prescriptions' || name === 'প্রেসক্রিপশন';
  const isMsgs = name === 'Messages' || name === 'বার্তা';
  const isCare = name === 'Care plans' || name === 'কেয়ার প্ল্যান';
  const isBilling = name === 'Billing' || name === 'বিলিং';
  const isProfile = name === 'Profile & settings' || name === 'প্রোফাইল ও সেটিংস';

  const myAppts = data.appointments.filter((a: any) => a.patient === me.name);
  const upcoming = myAppts.filter((a: any) => a.status === 'Confirmed' || a.status === 'Pending');
  const past = myAppts.filter((a: any) => a.status === 'Completed');

  const [apptFilter, setApptFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [profileSaved, setProfileSaved] = useState(false);
  const filtered = apptFilter === 'upcoming' ? upcoming : apptFilter === 'past' ? past : myAppts;

  return (
    <div className="pp-view adm-stagger">
      <div className="pp-view-head">
        <div>
          <span className="pro-kicker">{name.toUpperCase()}</span>
          <h1 className="gradient-text">{name}</h1>
        </div>
        {isAppts && (
          <Magnetic>
            <button className="pro-primary btn-pro shadow-glow-teal">
              <Plus size={14} /> {copy.bookNew}
            </button>
          </Magnetic>
        )}
        {isRx && (
          <Magnetic>
            <button className="pro-primary btn-pro shadow-glow-teal">
              <PillIcon size={14} /> {copy.refillRequest}
            </button>
          </Magnetic>
        )}
        {isMsgs && (
          <Magnetic>
            <button className="pro-primary btn-pro shadow-glow-teal">
              <Send size={14} /> {copy.newMessage}
            </button>
          </Magnetic>
        )}
        {isBilling && (
          <button className="pro-outline btn-pro">
            <Download size={14} /> {copy.download}
          </button>
        )}
        {isProfile && (
          <button
            className="pro-primary btn-pro shadow-glow-teal"
            onClick={() => {
              setProfileSaved(true);
              window.setTimeout(() => setProfileSaved(false), 2400);
            }}>
            <Check size={14} /> {profileSaved ? (bn ? 'সংরক্ষিত' : 'Saved') : copy.save}
          </button>
        )}
      </div>

      {isAppts && (
        <>
          <div className="pp-segmented">
            {(['upcoming', 'past', 'all'] as const).map(k => (
              <button
                key={k}
                className={apptFilter === k ? 'is-on' : ''}
                onClick={() => setApptFilter(k)}>
                {k === 'upcoming' ? copy.upcoming : k === 'past' ? copy.past : copy.all}
                <span className="pp-segmented-count">
                  {k === 'upcoming' ? upcoming.length : k === 'past' ? past.length : myAppts.length}
                </span>
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="pro-panel empty-state">
              <CalendarArt style={{ width: 90, height: 90, opacity: 0.6 }} />
              <p className="muted-light">{copy.empty}</p>
              <small className="muted-light">{copy.emptyHint}</small>
            </div>
          ) : (
            <ul className="pp-appt-list">
              {filtered.map((a: any, i: number) => (
                <li
                  key={a.id}
                  className="pro-panel card-3d lift"
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="pp-appt-time">
                    <strong>{bn ? toBnTime(a.time) : a.time}</strong>
                    <small>{bn ? toBnTime(a.duration) : a.duration}</small>
                  </div>
                  <Avatar name={a.patient} size={42} />
                  <div className="grow">
                    <strong>{a.service}</strong>
                    <small>
                      <Stethoscope size={11} style={{ display: 'inline', marginRight: 4 }} />
                      {a.doctor}
                    </small>
                    <small>
                      <MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />
                      {a.chamber}
                    </small>
                  </div>
                  <PillUI
                    tone={
                      a.status === 'Confirmed' ? 'teal' : a.status === 'Completed' ? 'sand' : 'gold'
                    }>
                    {a.status}
                  </PillUI>
                  <div className="pp-appt-actions">
                    {a.status === 'Confirmed' && (
                      <button className="pro-text-link">
                        {copy.view} <ArrowRight size={13} />
                      </button>
                    )}
                    {a.status === 'Completed' && (
                      <button className="pro-text-link">
                        {copy.viewDetails} <ArrowRight size={13} />
                      </button>
                    )}
                    {a.status === 'Pending' && (
                      <>
                        <button
                          className="pro-primary btn-pro"
                          style={{ padding: '6px 10px', fontSize: 11 }}>
                          {copy.confirm}
                        </button>
                        <button className="pro-text-link">{copy.cancel}</button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {isRecords && (
        <ul className="pp-records">
          {me.documents.length === 0 ? (
            <div className="pro-panel empty-state">
              <FileText size={56} style={{ color: '#94a3b8', opacity: 0.5 }} />
              <p className="muted-light">{copy.empty}</p>
            </div>
          ) : (
            me.documents.map((d: any, i: number) => (
              <li
                key={i}
                className="pro-panel card-3d lift"
                style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="pp-records-ico">
                  <FileText size={20} />
                </span>
                <div className="grow">
                  <strong>{d.name}</strong>
                  <small>
                    {d.type} · {d.size} · {d.date}
                  </small>
                </div>
                <button className="pro-outline btn-pro">
                  <Download size={14} /> {copy.download}
                </button>
                <button className="pro-text-link">
                  {copy.view} <ArrowRight size={14} />
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {isRx && (
        <ul className="pp-rx-grid">
          {(() => {
            const myPrescriptions = (data.prescriptions || []).filter(
              (rx: any) => rx.patientId === me.id
            );
            if (myPrescriptions.length === 0) {
              return (
                <div className="pro-panel empty-state">
                  <PillArt style={{ width: 90, height: 90, opacity: 0.6 }} />
                  <p className="muted-light">{copy.noMeds}</p>
                </div>
              );
            }
            return myPrescriptions.map((rx: any, i: number) => (
              <li
                key={rx.id}
                className="pro-panel card-3d lift"
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="pp-rx-head">
                  <span className="pp-rx-icon">
                    <PillIcon size={20} />
                  </span>
                  <div className="grow">
                    <strong>{rx.id}</strong>
                    <small>
                      {rx.date} · {rx.diagnosis}
                    </small>
                  </div>
                  <PillUI
                    tone={rx.status === 'Signed' ? 'teal' : rx.status === 'Sent' ? 'blue' : 'sand'}>
                    {rx.status}
                  </PillUI>
                </div>
                <div className="pp-rx-meta">
                  <div>
                    <span>{copy.dosage}</span>
                    <strong>
                      {rx.medicines.length} {copy.dosage.toLowerCase()}
                    </strong>
                  </div>
                  <div>
                    <span>{copy.doctor}</span>
                    <strong>{rx.doctor}</strong>
                  </div>
                </div>
                <div className="pp-rx-progress">
                  <span className="pp-rx-progress-fill" style={{ width: '70%' }} />
                </div>
                <div className="pp-rx-actions">
                  <button
                    className="pro-outline btn-pro"
                    onClick={async () => {
                      const { jsPDF } = await import('jspdf');
                      const doc = new jsPDF();
                      doc.setFontSize(18);
                      doc.setTextColor(23, 75, 120);
                      doc.text(copy.brandFull || 'Dr. Ibrahim Clinic', 20, 22);
                      doc.setFontSize(10);
                      doc.setTextColor(95, 117, 128);
                      doc.text(
                        `Prescription ID: ${rx.id}  |  Date: ${rx.date}  |  Status: ${rx.status}`,
                        20,
                        30
                      );
                      doc.line(20, 34, 190, 34);
                      let y = 42;
                      doc.setFontSize(12);
                      doc.setTextColor(23, 75, 120);
                      doc.text('Patient Details', 20, y);
                      y += 8;
                      doc.setFontSize(10);
                      doc.setTextColor(51, 78, 92);
                      doc.text(`Name: ${rx.patientName}  |  ID: ${rx.patientId}`, 20, y);
                      y += 10;
                      doc.text('Diagnosis', 20, y);
                      y += 6;
                      doc.text(rx.diagnosis, 20, y);
                      y += 10;
                      doc.text('Medications', 20, y);
                      y += 6;
                      rx.medicines.forEach((m: any, idx: number) => {
                        if (y > 270) {
                          doc.addPage();
                          y = 20;
                        }
                        doc.text(
                          `${idx + 1}. ${m.name} — ${m.dose} — ${m.frequency} — ${m.duration}`,
                          24,
                          y
                        );
                        y += 6;
                        if (m.instructions) {
                          doc.text(`   Instructions: ${m.instructions}`, 24, y);
                          y += 6;
                        }
                      });
                      if (rx.notes) {
                        y += 6;
                        doc.text(`Notes: ${rx.notes}`, 20, y);
                      }
                      doc.save(`Prescription-${rx.id}.pdf`);
                    }}>
                    <Download size={13} /> {copy.download}
                  </button>
                  <button
                    className="pro-outline btn-pro"
                    onClick={() => {
                      const patient = data.patients.find((p: any) => p.id === rx.patientId);
                      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Prescription ${rx.id}</title><style>body{font-family:Arial,sans-serif;color:#11263a;max-width:800px;margin:0 auto;padding:40px}h1{color:#174b78;border-bottom:2px solid #3b9b91;padding-bottom:10px}.meta{color:#617780;font-size:13px;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{text-align:left;padding:10px;border-bottom:1px solid #e0e8e8}th{background:#fbfcfc;color:#516974;font-size:11px;text-transform:uppercase;letter-spacing:.08em}.footer{margin-top:40px;color:#788992;font-size:11px}</style></head><body><h1>Prescription · ${rx.id}</h1><div class="meta">Date: ${rx.date} · Status: ${rx.status} · Doctor: ${rx.doctor}</div>${patient ? `<h2>Patient</h2><table><tr><th>Name</th><td>${patient.name}</td></tr><tr><th>ID</th><td>${patient.id}</td></tr><tr><th>Gender</th><td>${patient.gender}</td></tr><tr><th>DOB</th><td>${patient.dob}</td></tr><tr><th>Phone</th><td>${patient.phone}</td></tr></table>` : ''}<h2>Diagnosis</h2><p>${rx.diagnosis}</p><h2>Medications</h2><table><thead><tr><th>#</th><th>Medicine</th><th>Dose</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr></thead><tbody>${rx.medicines.map((m: any, idx: number) => `<tr><td>${idx + 1}</td><td><strong>${m.name}</strong></td><td>${m.dose}</td><td>${m.frequency}</td><td>${m.duration}</td><td>${m.instructions}</td></tr>`).join('')}</tbody></table>${rx.notes ? `<h2>Notes</h2><p>${rx.notes}</p>` : ''}<div class="footer">Generated securely for your records.</div></body></html>`;
                      const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Prescription-${rx.id}.doc`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>
                    <Download size={13} /> Word
                  </button>
                </div>
              </li>
            ));
          })()}
        </ul>
      )}

      {isMsgs && (
        <div className="pp-messages">
          <ul className="pp-msg-list">
            {data.notifications.map((n: any, i: number) => (
              <li
                key={n.id}
                className={`pro-panel card-3d lift ${n.read ? '' : 'is-unread'}`}
                style={{ animationDelay: `${i * 0.04}s` }}>
                <Avatar name={n.title.split(' ')[0] || 'Dr'} size={40} />
                <div className="grow">
                  <div className="pp-msg-head">
                    <strong>{n.title}</strong>
                    <small>{n.time}</small>
                  </div>
                  <p>{n.body}</p>
                </div>
                {!n.read && <span className="pp-msg-dot" />}
              </li>
            ))}
          </ul>
          <div className="pp-msg-composer">
            <Avatar name={me.name} size={36} />
            <input placeholder={copy.typeMessage} />
            <button className="pro-primary btn-pro shadow-glow-teal">
              <Send size={14} /> {copy.send}
            </button>
          </div>
        </div>
      )}

      {isBilling && (
        <div className="pp-grid">
          <section className="pro-panel card-3d lift">
            <div className="pro-panel-head">
              <div>
                <span className="pro-kicker">{bn ? 'পেমেন্ট সারসংক্ষেপ' : 'PAYMENT SUMMARY'}</span>
                <h2>{bn ? 'স্বাস্থ্যসেবার বিল' : 'Care billing'}</h2>
              </div>
              <PillUI tone="teal">{bn ? 'সুরক্ষিত' : 'Secure'}</PillUI>
            </div>
            <div className="adm-detail-grid">
              <div>
                <FileText size={14} />
                <span>{bn ? 'সর্বশেষ বিল' : 'Latest invoice'}</span>
                <strong>INV-20481</strong>
              </div>
              <div>
                <Calendar size={14} />
                <span>{bn ? 'তারিখ' : 'Issued'}</span>
                <strong>18 Jun 2026</strong>
              </div>
              <div>
                <HeartPulse size={14} />
                <span>{bn ? 'সেবার মূল্য' : 'Care total'}</span>
                <strong>৳ 4,500</strong>
              </div>
              <div>
                <Check size={14} />
                <span>{bn ? 'অবস্থা' : 'Status'}</span>
                <strong>{bn ? 'পরিশোধিত' : 'Paid'}</strong>
              </div>
            </div>
            <div className="panel-foot">
              <button className="pro-outline btn-pro">
                <Download size={14} /> {copy.download}
              </button>
              <button className="pro-text-link">
                {copy.viewDetails} <ArrowRight size={14} />
              </button>
            </div>
          </section>
          <section className="pro-panel card-3d lift">
            <div className="pro-panel-head">
              <div>
                <span className="pro-kicker">{bn ? 'পেমেন্ট পদ্ধতি' : 'PAYMENT METHOD'}</span>
                <h2>{bn ? 'পছন্দের পদ্ধতি' : 'Preferred method'}</h2>
              </div>
            </div>
            <div className="pp-next-card">
              <div className="pp-next-date">
                <Shield size={28} />
                <div>
                  <strong>{bn ? 'বিকাশ •••• 2048' : 'bKash •••• 2048'}</strong>
                  <small>{bn ? 'নিরাপদ পেমেন্ট' : 'Secure payment method'}</small>
                </div>
              </div>
            </div>
            <button className="pro-text-link">
              {bn ? 'পেমেন্ট পদ্ধতি পরিবর্তন করুন' : 'Update payment method'}{' '}
              <ArrowRight size={14} />
            </button>
          </section>
        </div>
      )}

      {isProfile && (
        <div className="pro-panel card-3d lift">
          <div className="pro-panel-head">
            <div>
              <span className="pro-kicker">{bn ? 'অ্যাকাউন্ট' : 'ACCOUNT'}</span>
              <h2>{bn ? 'প্রোফাইল ও পছন্দ' : 'Profile & preferences'}</h2>
              <small className="muted-light">
                {bn
                  ? 'আপনার ব্যক্তিগত তথ্য ও যোগাযোগের পছন্দ নিয়ন্ত্রণ করুন।'
                  : 'Control your personal details and communication preferences.'}
              </small>
            </div>
            <Avatar name={me.name} size={56} />
          </div>
          <div className="pp-profile-form">
            <label>
              {bn ? 'পূর্ণ নাম' : 'Full name'}
              <input defaultValue={me.name} />
            </label>
            <label>
              {bn ? 'ইমেইল' : 'Email'}
              <input defaultValue={me.email} />
            </label>
            <label>
              {bn ? 'ফোন' : 'Phone'}
              <input defaultValue={me.phone} />
            </label>
            <label>
              {bn ? 'জন্মতারিখ' : 'Date of birth'}
              <input defaultValue={me.dob} />
            </label>
          </div>
          <div className="adm-task-list">
            <div>
              <ShieldCheck size={16} />
              <span>
                {bn ? 'স্বাস্থ্য তথ্যের গোপনীয়তা সক্রিয়' : 'Health data privacy is enabled'}
              </span>
              <PillUI tone="teal">{bn ? 'সক্রিয়' : 'Active'}</PillUI>
            </div>
            <div>
              <Bell size={16} />
              <span>{bn ? 'অ্যাপয়েন্টমেন্ট রিমাইন্ডার' : 'Appointment reminders'}</span>
              <PillUI tone="teal">{bn ? 'ইমেইল' : 'Email'}</PillUI>
            </div>
            <div>
              <Phone size={16} />
              <span>{bn ? 'জরুরি যোগাযোগ' : 'Emergency contact'}</span>
              <strong>{bn ? 'সাদিয়া খান' : 'Sadia Khan'}</strong>
            </div>
          </div>
          {profileSaved && (
            <div className="pp-save-note">
              <Check size={14} />{' '}
              {bn ? 'আপনার প্রোফাইল আপডেট হয়েছে।' : 'Your profile has been updated securely.'}
            </div>
          )}
        </div>
      )}

      {isCare && (
        <ul className="pp-care-list-view">
          {me.visits.map((v: any, i: number) => (
            <li
              key={i}
              className="pro-panel card-3d lift"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="pp-care-head">
                <span className="pro-kicker">{v.date}</span>
                <PillUI tone="teal">
                  <Check size={10} />
                </PillUI>
              </div>
              <h3>{v.reason}</h3>
              <p className="muted-light">{v.notes}</p>
              <small className="muted-light">
                <Stethoscope size={11} style={{ display: 'inline', marginRight: 4 }} />
                {v.doctor}
              </small>
            </li>
          ))}
        </ul>
      )}

      {!isAppts && !isRecords && !isRx && !isMsgs && !isCare && !isBilling && !isProfile && (
        <div className="pro-panel empty-state">
          <Sparkles size={56} style={{ color: '#94a3b8', opacity: 0.5 }} />
          <p className="muted-light">{copy.comingSoon}</p>
          <small className="muted-light">{copy.emptyHint}</small>
        </div>
      )}
    </div>
  );
}
