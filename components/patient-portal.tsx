'use client'

import { useState } from 'react'
import { Activity, CalendarDays, ClipboardList, FileText, HeartPulse, LayoutDashboard, MessageCircle, Pill, Settings, ShieldCheck, UserRound, Video, ChevronRight, Clock3, Download, Plus, Menu, X } from 'lucide-react'

const items = [
  ['Overview', LayoutDashboard], ['Appointments', CalendarDays], ['Health records', FileText], ['Prescriptions', Pill], ['Messages', MessageCircle], ['Care plans', HeartPulse]
] as const

export function PatientPortal({ onExit }: { onExit: () => void }) {
  const [active, setActive] = useState('Overview')
  const [menu, setMenu] = useState(false)
  return <div className="patient-app">
    <aside className={menu ? 'patient-side is-open' : 'patient-side'}>
      <button className="patient-brand" onClick={onExit}><span className="brand-mark"><Activity size={18}/></span><span>Dr. Ibrahim<small>PATIENT PORTAL</small></span></button>
      <div className="patient-welcome"><span className="patient-avatar">AM</span><div><strong>Amara Mensah</strong><small>Patient ID · DR-20481</small></div></div>
      <nav className="patient-nav">{items.map(([label, Icon]) => <button key={label} className={active === label ? 'patient-link active' : 'patient-link'} onClick={() => { setActive(label); setMenu(false) }}><Icon size={17}/><span>{label}</span>{label === 'Messages' && <b>2</b>}</button>)}</nav>
      <div className="patient-side-bottom"><button className="patient-link" onClick={() => setActive('Settings')}><Settings size={17}/><span>Account settings</span></button><button className="patient-exit" onClick={onExit}>← Back to clinic website</button></div>
    </aside>
    <main className="patient-main">
      <header className="patient-top"><button className="patient-menu" onClick={() => setMenu(!menu)} aria-label="Toggle patient navigation">{menu ? <X/> : <Menu/>}</button><div><span className="patient-kicker">MY HEALTH SPACE</span><strong>{active}</strong></div><div className="patient-top-actions"><button className="patient-icon" aria-label="Messages"><MessageCircle size={18}/><i/></button><button className="patient-profile"><span className="patient-avatar small">AM</span><ChevronRight size={15}/></button></div></header>
      <div className="patient-content">{active === 'Overview' ? <Overview onAppointment={() => setActive('Appointments')}/> : <PortalView name={active}/>}</div>
    </main>
  </div>
}

function Overview({ onAppointment }: { onAppointment: () => void }) { return <>
  <div className="patient-title"><div><span className="patient-kicker">TUESDAY, 18 JUNE 2026</span><h1>Good morning, Amara.</h1><p>Here is your health summary, all in one calm place.</p></div><button className="btn btn-primary" onClick={onAppointment}><Plus size={16}/> Book appointment</button></div>
  <section className="patient-hero-card"><div><span className="pill pill-teal">Next appointment</span><h2>Annual wellness review</h2><p>With Dr. Ibrahim · Dhanmondi Chamber</p><div className="patient-date"><CalendarDays size={17}/><strong>Thursday, 20 June</strong><span>09:30 AM</span></div></div><div className="patient-hero-actions"><button className="btn btn-outline"><Video size={15}/> Join video visit</button><button className="text-link">View details <ChevronRight size={15}/></button></div></section>
  <div className="patient-grid"><section className="patient-panel"><div className="patient-panel-head"><div><span className="patient-kicker">YOUR PROGRESS</span><h2>Care plan</h2></div><span className="progress-value">68%</span></div><p className="muted">Metabolic wellness · Started 02 May 2026</p><div className="progress-track"><span style={{width:'68%'}}/></div><div className="care-steps"><span className="done">✓</span><div><strong>Complete blood work</strong><small>Completed 12 June</small></div><span className="done">✓</span><div><strong>Daily movement goal</strong><small>18 of 30 days complete</small></div></div><button className="text-link">Open care plan <ChevronRight size={15}/></button></section><section className="patient-panel"><div className="patient-panel-head"><div><span className="patient-kicker">CURRENT MEDICATION</span><h2>Prescriptions</h2></div><Pill>2 active</Pill></div><div className="medicine"><span className="medicine-icon"><Pill size={17}/></span><div><strong>Metformin 500mg</strong><small>Once daily · 24 days remaining</small></div><ChevronRight size={16}/></div><div className="medicine"><span className="medicine-icon"><HeartPulse size={17}/></span><div><strong>Vitamin D3 1000 IU</strong><small>Once daily · 56 days remaining</small></div><ChevronRight size={16}/></div><button className="text-link">View prescriptions <ChevronRight size={15}/></button></section></div>
  <div className="patient-grid lower"><section className="patient-panel"><div className="patient-panel-head"><div><span className="patient-kicker">RECENT ACTIVITY</span><h2>Recent visits</h2></div><button className="text-link">View all <ChevronRight size={15}/></button></div>{[['12 Jun 2026','Follow-up consultation','Dr. Ibrahim'],['18 May 2026','Initial wellness assessment','Dhanmondi Chamber'],['04 Apr 2026','Skin health consultation','Dr. Ibrahim']].map(x=><div className="visit-row" key={x[0]}><span>{x[0]}</span><div><strong>{x[1]}</strong><small>{x[2]}</small></div><Download size={16}/></div>)}</section><section className="patient-panel secure-card"><ShieldCheck size={25}/><h2>Your records are private.</h2><p>Only you and your care team can access your health information.</p><button className="btn btn-outline">Privacy & security</button></section></div>
</> }

function PortalView({ name }: { name: string }) { return <div className="portal-empty"><span className="portal-view-icon"><ClipboardList size={24}/></span><span className="patient-kicker">PATIENT PORTAL</span><h1>{name}</h1><p>This workspace is ready for your appointments, notes, records and care updates.</p><div className="patient-grid"><div className="patient-panel"><h2>Everything in one place</h2><p className="muted">Review your latest information, download documents and stay connected with your clinic team.</p><button className="btn btn-primary">Explore {name}</button></div><div className="patient-panel"><h2>Need help?</h2><p className="muted">Our patient support team is available Monday to Friday, 08:00–17:00.</p><button className="text-link">Message support <ChevronRight size={15}/></button></div></div></div> }
