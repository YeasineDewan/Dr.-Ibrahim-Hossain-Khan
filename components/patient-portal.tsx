'use client'
import { useState } from 'react'
import { Activity, CalendarDays, ClipboardList, FileText, HeartPulse, LayoutDashboard, MessageCircle, Pill, Settings, ShieldCheck, UserRound, Video, ChevronRight, Clock3, Download, Plus, Menu, X } from 'lucide-react'
import { patientCopy, common, useLanguage } from '../lib/translations'

export function PatientPortal({ onExit }: { onExit: () => void }) {
  const { lang } = useLanguage()
  const p = patientCopy[lang]
  const navItems = p.nav as unknown as string[]
  const iconMap: Record<string, any> = {
    Overview: LayoutDashboard, Appointments: CalendarDays, 'Health records': FileText,
    Prescriptions: Pill, Messages: MessageCircle, 'Care plans': HeartPulse,
    'সংক্ষিপ্ত বিবরণ': LayoutDashboard, 'অ্যাপয়েন্টমেন্ট': CalendarDays, 'স্বাস্থ্য রেকর্ড': FileText,
    'প্রেসক্রিপশন': Pill, 'বার্তা': MessageCircle, 'যত্ন পরিকল্পনা': HeartPulse,
  }
  const [active, setActive] = useState('Overview')
  const [menu, setMenu] = useState(false)
  return (
    <div className="patient-app">
      <aside className={menu ? 'patient-side is-open' : 'patient-side'}>
        <button className="patient-brand" onClick={onExit}>
          <span className="brand-mark"><Activity size={18}/></span>
          <span>{lang === 'bn' ? 'ডাঃ ইব্রাহিম' : 'Dr. Ibrahim'}<small>{p.brandSub}</small></span>
        </button>
        <div className="patient-welcome">
          <span className="patient-avatar">AM</span>
          <div><strong>{lang === 'bn' ? 'আমারা মেনসাহ' : 'Amara Mensah'}</strong><small>{p.welcome}</small></div>
        </div>
        <nav className="patient-nav">
          {navItems.map((label) => {
            const Icon = iconMap[label] || LayoutDashboard
            return (
              <button key={label} className={active === label ? 'patient-link active' : 'patient-link'} onClick={() => { setActive(label); setMenu(false) }}>
                <Icon size={17}/><span>{label}</span>{label === navItems[4] && <b>2</b>}
              </button>
            )
          })}
        </nav>
        <div className="patient-side-bottom">
          <button className="patient-link" onClick={() => setActive(navItems[5] || 'Settings')}><Settings size={17}/><span>{p.accountSettings}</span></button>
          <button className="patient-exit" onClick={onExit}>{p.backToWebsite}</button>
        </div>
      </aside>
      <main className="patient-main">
        <header className="patient-top">
          <button className="patient-menu" onClick={() => setMenu(!menu)} aria-label="Toggle patient navigation">{menu ? <X/> : <Menu/>}</button>
          <div><span className="patient-kicker">{p.healthSpace}</span><strong>{active}</strong></div>
          <div className="patient-top-actions">
            <button className="patient-icon" aria-label="Messages"><MessageCircle size={18}/><i/></button>
            <button className="patient-profile"><span className="patient-avatar small">AM</span><ChevronRight size={15}/></button>
          </div>
        </header>
        <div className="patient-content">
          {active === 'Overview' || active === navItems[0] ? <Overview copy={p} onAppointment={() => setActive(navItems[1])} /> : <PortalView name={active} copy={p} />}
        </div>
      </main>
    </div>
  )
}

function Overview({ copy, onAppointment }: { copy: typeof patientCopy.en; onAppointment: () => void }) {
  const { lang } = useLanguage()
  return <>
    <div className="patient-title">
      <div>
        <span className="patient-kicker">{copy.today}</span>
        <h1>{copy.goodMorning}</h1>
        <p>{copy.todayBody}</p>
      </div>
      <button className="btn btn-primary" onClick={onAppointment}><Plus size={16}/> {copy.bookBtn}</button>
    </div>
    <section className="patient-hero-card">
      <div>
        <span className="pill pill-teal">{copy.nextAppt}</span>
        <h2>{copy.nextApptTitle}</h2>
        <p>{copy.nextApptWith}</p>
        <div className="patient-date">
          <CalendarDays size={17}/>
          <strong>{lang === 'bn' ? 'বৃহস্পতিবার, ২০ জুন' : 'Thursday, 20 June'}</strong>
          <span>09:30 AM</span>
        </div>
      </div>
      <div className="patient-hero-actions">
        <button className="btn btn-outline"><Video size={15}/> {copy.joinVideo}</button>
        <button className="text-link">{copy.viewDetails} <ChevronRight size={15}/></button>
      </div>
    </section>
    <div className="patient-grid">
      <section className="patient-panel">
        <div className="patient-panel-head">
          <div><span className="patient-kicker">{copy.yourProgress}</span><h2>{copy.carePlan}</h2></div>
          <span className="progress-value">68%</span>
        </div>
        <p className="muted">{copy.carePlanMeta}</p>
        <div className="progress-track"><span style={{ width: '68%' }}/></div>
        <div className="care-steps">
          {copy.careSteps.map((s, i) => (
            <span key={i}>
              <span className="done">✓</span>
              <div><strong>{s.strong}</strong><small>{s.small}</small></div>
            </span>
          ))}
        </div>
        <button className="text-link">{copy.openCarePlan} <ChevronRight size={15}/></button>
      </section>
      <section className="patient-panel">
        <div className="patient-panel-head">
          <div><span className="patient-kicker">{copy.currentMed}</span><h2>{copy.prescriptions}</h2></div>
          <span className="pill pill-teal">{copy.active}</span>
        </div>
        {copy.meds.map((m, i) => (
          <div className="medicine" key={i}>
            <span className="medicine-icon"><Pill size={17}/></span>
            <div><strong>{m.name}</strong><small>{m.small}</small></div>
            <ChevronRight size={16}/>
          </div>
        ))}
        <button className="text-link">{copy.viewPrescriptions} <ChevronRight size={15}/></button>
      </section>
    </div>
    <div className="patient-grid lower">
      <section className="patient-panel">
        <div className="patient-panel-head">
          <div><span className="patient-kicker">{copy.recentActivity}</span><h2>{copy.recentVisits}</h2></div>
          <button className="text-link">{copy.viewAll} <ChevronRight size={15}/></button>
        </div>
        {copy.visits.map((v, i) => (
          <div className="visit-row" key={i}>
            <span>{v.date}</span>
            <div><strong>{v.title}</strong><small>{v.who}</small></div>
            <Download size={16}/>
          </div>
        ))}
      </section>
      <section className="patient-panel secure-card">
        <ShieldCheck size={25}/>
        <h2>{copy.recordsTitle}</h2>
        <p>{copy.recordsBody}</p>
        <button className="btn btn-outline">{copy.privacyBtn}</button>
      </section>
    </div>
  </>
}

function PortalView({ name, copy }: { name: string; copy: typeof patientCopy.en }) {
  const key = (Object.keys(copy.detail) as Array<keyof typeof copy.detail>).find(k => k === name)
  const rows = key ? (copy.detail as any)[key] : copy.detail.Settings
  return (
    <div className="portal-empty">
      <span className="portal-view-icon"><ClipboardList size={24}/></span>
      <span className="patient-kicker">PATIENT PORTAL</span>
      <h1>{name}</h1>
      <p>Keep your care organized, review updates and take the next step with confidence.</p>
      <div className="patient-grid portal-detail-grid">
        {rows.map((x: string[], i: number) => (
          <div className="patient-panel portal-detail-card" key={i}>
            <span className="patient-kicker">{x[0]}</span>
            <h2>{x[1]}</h2>
            <p className="muted">{x[2]}</p>
            <button className={i === rows.length - 1 ? 'btn btn-outline' : 'text-link'}>
              {i === rows.length - 1 ? 'Open workspace' : 'View details'} <ChevronRight size={15}/>
            </button>
          </div>
        ))}
      </div>
      <div className="patient-panel portal-help">
        <ShieldCheck size={20}/>
        <div>
          <h2>Your care is private and connected.</h2>
          <p className="muted">Need help with appointments, prescriptions or records? Open the patient workspace to manage everything in one place.</p>
        </div>
        <button className="btn btn-outline">Open workspace</button>
      </div>
    </div>
  )
}
