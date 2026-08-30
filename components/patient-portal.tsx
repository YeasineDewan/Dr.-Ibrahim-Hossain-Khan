'use client'

import { useState } from 'react'
import { Activity, CalendarDays, ClipboardList, FileText, HeartPulse, LayoutDashboard, MessageCircle, Pill, ShieldCheck, UserRound, Video, ChevronRight, ChevronDown, Clock3, Download, Plus, Menu, X, Search, Bell, User, Phone, Mail, MapPin, Stethoscope, FlaskConical, FileCheck, History, CircleCheckBig, Archive, Timer, AlertCircle, Shield, Lock, BellRing, HelpCircle, LogOut } from 'lucide-react'

const items = [
  ['Overview', LayoutDashboard],
  ['Appointments', CalendarDays],
  ['Health records', FileText],
  ['Prescriptions', Pill],
  ['Messages', MessageCircle],
  ['Care plans', HeartPulse]
] as const

const tabs: Record<string, string[]> = {
  Appointments: ['Upcoming', 'Past', 'Cancelled'],
  'Health records': ['Medical history', 'Diagnoses', 'Lab reports', 'Documents', 'Visit history'],
  Prescriptions: ['Active', 'Past', 'Expired'],
  Messages: ['Inbox', 'Sent', 'Archived'],
  'Care plans': ['Active', 'Completed', 'Previous']
}

const profileItems = [
  { label: 'Personal information', Icon: User, view: 'Profile' },
  { label: 'Contact information', Icon: Mail, view: 'Profile' },
  { label: 'Emergency contact', Icon: Phone, view: 'Profile' },
  { label: 'Basic medical information', Icon: Stethoscope, view: 'Profile' },
  { label: 'Allergies', Icon: AlertCircle, view: 'Profile' },
  { label: 'Current medications', Icon: Pill, view: 'Profile' },
  { label: 'Account security', Icon: Lock, view: 'Settings' },
  { label: 'Change password', Icon: Lock, view: 'Settings' },
  { label: 'Notification preferences', Icon: BellRing, view: 'Settings' }
]

const appointmentData: Record<string, { title: string; doctor: string; chamber: string; date: string; time: string; type: string; status: string }[]> = {
  Upcoming: [
    { title: 'Annual wellness review', doctor: 'Dr. Ibrahim', chamber: 'Dhanmondi Chamber', date: 'Thursday, 20 June', time: '09:30 AM', type: 'In-person', status: 'Confirmed' },
    { title: 'Follow-up consultation', doctor: 'Dr. Ibrahim', chamber: 'Uttara Chamber', date: 'Friday, 27 June', time: '02:00 PM', type: 'Video call', status: 'Pending' }
  ],
  Past: [
    { title: 'Skin health consultation', doctor: 'Dr. Ibrahim', chamber: 'Dhanmondi Chamber', date: '12 Jun 2026', time: '10:00 AM', type: 'In-person', status: 'Completed' },
    { title: 'Initial wellness assessment', doctor: 'Dr. Ibrahim', chamber: 'Dhanmondi Chamber', date: '18 May 2026', time: '11:00 AM', type: 'In-person', status: 'Completed' }
  ],
  Cancelled: [
    { title: 'Initial consultation', doctor: 'Dr. Ibrahim', chamber: 'Dhanmondi Chamber', date: '05 Jun 2026', time: '11:00 AM', type: 'In-person', status: 'Cancelled' }
  ]
}

const healthRecordData: Record<string, { title: string; date: string; detail?: string; symptoms?: string; notes?: string; result?: string; pages?: string; type?: string; doctor?: string; chamber?: string }[]> = {
  'Medical history': [
    { title: 'General health summary', date: 'Updated 12 Jun 2026', detail: 'Annual wellness assessment completed' },
    { title: 'Family history', date: 'Updated 01 Jan 2026', detail: 'Diabetes, hypertension' }
  ],
  Diagnoses: [
    { title: 'Type 2 Diabetes', date: 'Diagnosed 15 Mar 2026', symptoms: 'Increased thirst, frequent urination', notes: 'Controlled with medication' },
    { title: 'Hypertension', date: 'Diagnosed 10 Jan 2025', symptoms: 'Elevated blood pressure', notes: 'Managed with lifestyle changes' }
  ],
  'Lab reports': [
    { title: 'Full blood count', date: '12 Jun 2026', result: 'Normal' },
    { title: 'Lipid profile', date: '12 Jun 2026', result: 'Slightly elevated' },
    { title: 'HbA1c', date: '15 Mar 2026', result: '6.2%' }
  ],
  Documents: [
    { title: 'Care plan summary', date: 'Uploaded 12 Jun 2026', pages: '2 pages', type: 'PDF' },
    { title: 'Insurance card', date: 'Uploaded 01 Jan 2026', pages: '1 page', type: 'Image' }
  ],
  'Visit history': [
    { title: 'Follow-up consultation', date: '12 Jun 2026', doctor: 'Dr. Ibrahim', chamber: 'Dhanmondi' },
    { title: 'Initial wellness assessment', date: '18 May 2026', doctor: 'Dhanmondi Chamber', chamber: 'Dhanmondi' }
  ]
}

const prescriptionData: Record<string, { name: string; dosage: string; frequency: string; duration: string; instructions: string; doctor: string; date: string }[]> = {
  Active: [
    { name: 'Metformin 500mg', dosage: '500mg', frequency: 'Once daily', duration: '24 days remaining', instructions: 'Take with meals', doctor: 'Dr. Ibrahim', date: '02 May 2026' },
    { name: 'Vitamin D3 1000 IU', dosage: '1000 IU', frequency: 'Once daily', duration: '56 days remaining', instructions: 'Take with breakfast', doctor: 'Dr. Ibrahim', date: '02 May 2026' }
  ],
  Past: [
    { name: 'Amoxicillin 250mg', dosage: '250mg', frequency: 'Three times daily', duration: '7 days', instructions: 'Complete full course', doctor: 'Dr. Rahman', date: '10 Apr 2026' }
  ],
  Expired: [
    { name: 'Ibuprofen 400mg', dosage: '400mg', frequency: 'As needed', duration: '5 days', instructions: 'Take with food', doctor: 'Dr. Ibrahim', date: '01 Jan 2026' }
  ]
}

const messageData: Record<string, { from?: string; to?: string; subject: string; preview: string; time: string; unread?: boolean }[]> = {
  Inbox: [
    { from: 'Dr. Ibrahim', subject: 'Follow-up results', preview: 'Your recent test results look good. Keep up the good work with your diet and exercise.', time: '2 hours ago', unread: true },
    { from: 'Care team', subject: 'Appointment reminder', preview: 'You have an appointment scheduled for Thursday, 20 June at 09:30 AM.', time: '1 day ago', unread: true }
  ],
  Sent: [
    { to: 'Dr. Ibrahim', subject: 'Medication refill request', preview: 'I need a refill for my Metformin prescription.', time: '3 days ago' }
  ],
  Archived: [
    { from: 'Dr. Rahman', subject: 'Previous consultation', preview: 'Thank you for the consultation last month. Your skin condition has improved.', time: '1 month ago' }
  ]
}

const carePlanData: Record<string, { title: string; progress: string; goals: string; instructions: string; medications: string; lifestyle: string; followUp: string; status: string }[]> = {
  Active: [
    { title: 'Metabolic wellness', progress: '68%', goals: 'Weight management, blood sugar control', instructions: 'Follow diet plan, exercise daily', medications: 'Metformin, Vitamin D3', lifestyle: '30 min walk daily, balanced diet', followUp: 'Monthly check-ins', status: 'In progress' }
  ],
  Completed: [
    { title: 'Initial wellness assessment', progress: '100%', goals: 'Complete health screening', instructions: 'Attend all scheduled tests', medications: 'None', lifestyle: 'General wellness', followUp: 'Completed', status: 'Completed' }
  ],
  Previous: [
    { title: 'Skin health plan', progress: '100%', goals: 'Treat skin condition', instructions: 'Apply topical cream', medications: 'Hydrocortisone cream', lifestyle: 'Avoid triggers', followUp: 'Completed', status: 'Completed' }
  ]
}

const profileSections = [
  { title: 'Personal Information', items: [['Full name', 'Amara Mensah'], ['Date of birth', '15 March 1990'], ['Gender', 'Female'], ['Blood group', 'O+']] as [string, string][] },
  { title: 'Contact Information', items: [['Email', 'amara.mensah@email.com'], ['Phone', '+880 1712-345678'], ['Address', 'Dhanmondi, Dhaka']] as [string, string][] },
  { title: 'Emergency Contact', items: [['Name', 'Kwame Mensah'], ['Relationship', 'Spouse'], ['Phone', '+880 1812-345678']] as [string, string][] },
  { title: 'Basic Medical Information', items: [['Height', '165 cm'], ['Weight', '68 kg'], ['BMI', '24.9'], ['Allergies', 'Penicillin']] as [string, string][] },
  { title: 'Allergies', items: [['Penicillin', 'Rash, itching (Moderate)'], ['Pollen', 'Sneezing, congestion (Mild)']] as [string, string][] },
  { title: 'Current Medications', items: [['Metformin 500mg', '500mg · Once daily'], ['Vitamin D3 1000 IU', '1000 IU · Once daily']] as [string, string][] }
]

const settingsSections = [
  { title: 'Profile', desc: 'Name, phone and email', icon: User, action: 'Edit profile' },
  { title: 'Security', desc: 'Password and access', icon: Lock, action: 'Manage security' },
  { title: 'Preferences', desc: 'Email and SMS settings', icon: BellRing, action: 'Edit preferences' }
]

export function PatientPortal({ onExit }: { onExit: () => void }) {
  const [active, setActive] = useState('Overview')
  const [menu, setMenu] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [tab, setTab] = useState('')

  const handleModuleChange = (label: string) => {
    setActive(label)
    setMenu(false)
    const defaultTabs = tabs[label]
    setTab(defaultTabs ? defaultTabs[0] : '')
  }

  return <div className="patient-app">
    <aside className={menu ? 'patient-side is-open' : 'patient-side'}>
      <button className="patient-brand" onClick={onExit}><span className="brand-mark"><Activity size={18}/></span><span>Dr. Ibrahim<small>PATIENT PORTAL</small></span></button>
      <div className="patient-welcome"><span className="patient-avatar">AM</span><div><strong>Amara Mensah</strong><small>Patient ID · DR-20481</small></div></div>
      <nav className="patient-nav">{items.map(([label, Icon]) => <button key={label} className={active === label ? 'patient-link active' : 'patient-link'} onClick={() => handleModuleChange(label)}><Icon size={17}/><span>{label}</span>{label === 'Messages' && <b>2</b>}</button>)}</nav>
      <div className="patient-side-bottom"><button className="patient-exit" onClick={onExit}>← Back to clinic website</button></div>
    </aside>
    <main className="patient-main">
      <header className="patient-top">
        <button className="patient-menu" onClick={() => setMenu(!menu)} aria-label="Toggle patient navigation">{menu ? <X/> : <Menu/>}</button>
        <div><span className="patient-kicker">MY HEALTH SPACE</span><strong>{active}</strong></div>
        <div className="patient-top-actions">
          <button className="patient-icon" aria-label="Search"><Search size={18}/></button>
          <button className="patient-icon" aria-label="Notifications"><Bell size={18}/><i/></button>
          <button className="patient-profile" onClick={() => setProfileOpen(!profileOpen)}>
            <span className="patient-avatar small">AM</span>
            <ChevronDown size={15}/>
            {profileOpen && <div className="patient-profile-menu">
              <div className="patient-profile-header"><strong>Amara Mensah</strong><span>Patient ID · DR-20481</span></div>
              {profileItems.map((item) => <button key={item.label} className="patient-profile-link" onClick={() => { setProfileOpen(false); setActive(item.view); }}><item.Icon size={15}/><span>{item.label}</span></button>)}
              <div className="patient-profile-bottom">
                <button className="patient-profile-link" onClick={() => { setProfileOpen(false); setActive('Help'); }}><HelpCircle size={15}/><span>Help / Support</span></button>
                <button className="patient-profile-link" onClick={() => { setProfileOpen(false); setActive('Privacy'); }}><Shield size={15}/><span>Privacy</span></button>
                <button className="patient-profile-link" onClick={() => { setProfileOpen(false); onExit(); }}><LogOut size={15}/><span>Logout</span></button>
              </div>
            </div>}
          </button>
        </div>
      </header>
      <div className="patient-content">
        {active === 'Overview' ? <Overview onNavigate={(m) => handleModuleChange(m)}/> : active === 'Profile' ? <PatientProfile/> : active === 'Settings' ? <SettingsView/> : active === 'Help' ? <HelpView/> : active === 'Privacy' ? <PrivacyView/> : tabs[active] ? <ModuleView name={active} tab={tab} setTab={setTab}/> : <div className="patient-panel"><h2>Page not found</h2></div>}
      </div>
    </main>
  </div>
}

function Overview({ onNavigate }: { onNavigate: (module: string) => void }) {
  return <>
    <div className="patient-title">
      <div>
        <span className="patient-kicker">TUESDAY, 18 JUNE 2026</span>
        <h1>Good morning, Amara.</h1>
        <p>Here is your health summary, all in one calm place.</p>
      </div>
      <button className="btn btn-primary" onClick={() => onNavigate('Appointments')}><Plus size={16}/> Book appointment</button>
    </div>
    <section className="patient-hero-card">
      <div>
        <span className="pill pill-teal">Next appointment</span>
        <h2>Annual wellness review</h2>
        <p>With Dr. Ibrahim · Dhanmondi Chamber</p>
        <div className="patient-date"><CalendarDays size={17}/><strong>Thursday, 20 June</strong><span>09:30 AM</span></div>
      </div>
      <div className="patient-hero-actions">
        <button className="btn btn-outline"><Video size={15}/> Join video visit</button>
        <button className="text-link">View details <ChevronRight size={15}/></button>
      </div>
    </section>
    <div className="patient-grid">
      <section className="patient-panel">
        <div className="patient-panel-head">
          <div>
            <span className="patient-kicker">RECENT HEALTH RECORDS</span>
            <h2>Full blood count</h2>
          </div>
          <button className="text-link">View all <ChevronRight size={15}/></button>
        </div>
        <p className="muted">Updated 12 Jun 2026 · Result: Normal</p>
        <button className="text-link">View records <ChevronRight size={15}/></button>
      </section>
      <section className="patient-panel">
        <div className="patient-panel-head">
          <div>
            <span className="patient-kicker">ACTIVE PRESCRIPTIONS</span>
            <h2>2 medications</h2>
          </div>
          <span className="pill pill-teal">Active</span>
        </div>
        <div className="medicine">
          <span className="medicine-icon"><Pill size={17}/></span>
          <div><strong>Metformin 500mg</strong><small>Once daily · 24 days remaining</small></div>
          <ChevronRight size={16}/>
        </div>
        <div className="medicine">
          <span className="medicine-icon"><HeartPulse size={17}/></span>
          <div><strong>Vitamin D3 1000 IU</strong><small>Once daily · 56 days remaining</small></div>
          <ChevronRight size={16}/>
        </div>
        <button className="text-link">View prescriptions <ChevronRight size={15}/></button>
      </section>
    </div>
    <div className="patient-grid lower">
      <section className="patient-panel">
        <div className="patient-panel-head">
          <div>
            <span className="patient-kicker">YOUR PROGRESS</span>
            <h2>Care plan</h2>
          </div>
          <span className="progress-value">68%</span>
        </div>
        <p className="muted">Metabolic wellness · Started 02 May 2026</p>
        <div className="progress-track"><span style={{width:'68%'}}/></div>
        <div className="care-steps">
          <span className="done">✓</span>
          <div><strong>Complete blood work</strong><small>Completed 12 June</small></div>
          <span className="done">✓</span>
          <div><strong>Daily movement goal</strong><small>18 of 30 days complete</small></div>
        </div>
        <button className="text-link">Open care plan <ChevronRight size={15}/></button>
      </section>
      <section className="patient-panel">
        <div className="patient-panel-head">
          <div>
            <span className="patient-kicker">UPCOMING APPOINTMENT</span>
            <h2>Annual wellness review</h2>
          </div>
          <button className="text-link">View all <ChevronRight size={15}/></button>
        </div>
        <p className="muted">With Dr. Ibrahim · Dhanmondi Chamber</p>
        <div className="patient-meta">
          <span><CalendarDays size={14}/> Thursday, 20 June</span>
          <span><Clock3 size={14}/> 09:30 AM</span>
        </div>
        <button className="text-link">View details <ChevronRight size={15}/></button>
      </section>
    </div>
    <div className="patient-grid lower">
      <section className="patient-panel">
        <div className="patient-panel-head">
          <div>
            <span className="patient-kicker">UNREAD MESSAGES</span>
            <h2>2 unread messages</h2>
          </div>
          <span className="pill pill-coral">2</span>
        </div>
        <div className="medicine">
          <span className="medicine-icon"><MessageCircle size={17}/></span>
          <div><strong>Dr. Ibrahim</strong><small>Follow-up results · 2 hours ago</small></div>
          <ChevronRight size={16}/>
        </div>
        <button className="text-link">View messages <ChevronRight size={15}/></button>
      </section>
      <section className="patient-panel">
        <div className="patient-panel-head">
          <div>
            <span className="patient-kicker">QUICK ACTIONS</span>
            <h2>What would you like to do?</h2>
          </div>
        </div>
        <div className="patient-actions">
          <button className="btn btn-outline" onClick={() => onNavigate('Appointments')}><CalendarDays size={15}/> Book Appointment</button>
          <button className="btn btn-outline" onClick={() => onNavigate('Health records')}><FileText size={15}/> View Records</button>
          <button className="btn btn-outline" onClick={() => onNavigate('Prescriptions')}><Pill size={15}/> View Prescription</button>
          <button className="btn btn-outline" onClick={() => onNavigate('Messages')}><MessageCircle size={15}/> Message Doctor</button>
        </div>
      </section>
      <section className="patient-panel">
        <div className="patient-panel-head">
          <div>
            <span className="patient-kicker">NOTIFICATIONS</span>
            <h2>Care plan progress</h2>
          </div>
          <span className="pill pill-sand">New</span>
        </div>
        <p className="muted">Your metabolic wellness plan is at 68% completion. Last updated 2 hours ago.</p>
        <button className="text-link">View notifications <ChevronRight size={15}/></button>
      </section>
    </div>
    <div className="patient-panel secure-card">
      <ShieldCheck size={25}/>
      <h2>Your records are private.</h2>
      <p>Only you and your care team can access your health information.</p>
      <button className="btn btn-outline">Privacy & security</button>
    </div>
  </>
}

function ModuleView({ name, tab, setTab }: { name: string; tab: string; setTab: (t: string) => void }) {
  const currentTabs = tabs[name] || []
  const safeTab = currentTabs.includes(tab) ? tab : currentTabs[0] || ''

  return <div>
    <div className="patient-tabs">
      {currentTabs.map(t => <button key={t} className={safeTab === t ? 'patient-tab active' : 'patient-tab'} onClick={() => setTab(t)}>{t}</button>)}
    </div>
    <div className="patient-tab-content">
      {name === 'Appointments' && <AppointmentTab tab={safeTab}/>}
      {name === 'Health records' && <HealthRecordTab tab={safeTab}/>}
      {name === 'Prescriptions' && <PrescriptionTab tab={safeTab}/>}
      {name === 'Messages' && <MessageTab tab={safeTab}/>}
      {name === 'Care plans' && <CarePlanTab tab={safeTab}/>}
    </div>
  </div>
}

function AppointmentTab({ tab }: { tab: string }) {
  const data = appointmentData[tab] || []
  return <div className="patient-card-list">
    {data.map((apt, i) => {
      const pillClass = apt.status === 'Confirmed' ? 'pill-teal' : apt.status === 'Pending' || apt.status === 'Completed' ? 'pill-sand' : 'pill-coral'
      return <div key={i} className="patient-panel">
        <div className="patient-card-head">
          <div>
            <span className={`pill ${pillClass}`}>{apt.status}</span>
            <h3>{apt.title}</h3>
          </div>
          <span className="pill pill-teal">{apt.type}</span>
        </div>
        <p className="muted">With {apt.doctor} · {apt.chamber}</p>
        <div className="patient-meta">
          <span><CalendarDays size={14}/> {apt.date}</span>
          <span><Clock3 size={14}/> {apt.time}</span>
        </div>
        {tab === 'Upcoming' && <div className="patient-actions">
          <button className="btn btn-outline">Reschedule</button>
          <button className="btn btn-ghost">Cancel</button>
        </div>}
      </div>
    })}
  </div>
}

function HealthRecordTab({ tab }: { tab: string }) {
  const data = healthRecordData[tab] || []
  return <div className="patient-card-list">
    {data.map((rec, i) => <div key={i} className="patient-panel">
      <div className="patient-card-head">
        <div>
          <span className="pill pill-teal">{tab === 'Visit history' ? 'Visit' : tab.replace(/([A-Z])/g, ' $1').trim()}</span>
          <h3>{rec.title}</h3>
        </div>
      </div>
      <p className="muted">{rec.date}</p>
      {rec.detail && <p className="muted">{rec.detail}</p>}
      {rec.symptoms && <div className="patient-meta"><span><Stethoscope size={14}/> {rec.symptoms}</span></div>}
      {rec.notes && <p className="muted">Notes: {rec.notes}</p>}
      {rec.result && <div className="patient-meta"><span><FlaskConical size={14}/> Result: {rec.result}</span></div>}
      {rec.pages && <div className="patient-meta"><span><FileCheck size={14}/> {rec.pages} · {rec.type}</span></div>}
      {rec.doctor && <div className="patient-meta"><span><UserRound size={14}/> {rec.doctor}</span><span><MapPin size={14}/> {rec.chamber}</span></div>}
      <button className="text-link">View details <ChevronRight size={15}/></button>
    </div>)}
  </div>
}

function PrescriptionTab({ tab }: { tab: string }) {
  const data = prescriptionData[tab] || []
  return <div className="patient-card-list">
    {data.map((rx, i) => <div key={i} className="patient-panel">
      <div className="patient-card-head">
        <div>
          <span className={`pill ${tab === 'Expired' ? 'pill-coral' : tab === 'Past' ? 'pill-sand' : 'pill-teal'}`}>{tab}</span>
          <h3>{rx.name}</h3>
        </div>
      </div>
      <div className="patient-meta">
        <span><Pill size={14}/> {rx.dosage}</span>
        <span><Timer size={14}/> {rx.frequency}</span>
        <span><Clock3 size={14}/> {rx.duration}</span>
      </div>
      <p className="muted">{rx.instructions}</p>
      <div className="patient-meta">
        <span><UserRound size={14}/> {rx.doctor}</span>
        <span><CalendarDays size={14}/> {rx.date}</span>
      </div>
      <div className="patient-actions">
        <button className="btn btn-outline"><Download size={15}/> Download</button>
        <button className="btn btn-ghost">Print</button>
      </div>
    </div>)}
  </div>
}

function MessageTab({ tab }: { tab: string }) {
  const data = messageData[tab] || []
  return <div className="patient-card-list">
    {data.map((msg, i) => {
      const from = tab === 'Sent' ? msg.to : msg.from
      return <div key={i} className="patient-panel">
        <div className="patient-card-head">
          <div>
            <span className="pill pill-teal">{tab}</span>
            <h3>{from}</h3>
          </div>
          {msg.unread && <span className="pill pill-coral">Unread</span>}
        </div>
        <p className="muted">{msg.subject}</p>
        <p className="muted">{msg.preview}</p>
        <div className="patient-meta">
          <span><Clock3 size={14}/> {msg.time}</span>
        </div>
        <button className="text-link">View thread <ChevronRight size={15}/></button>
      </div>
    })}
  </div>
}

function CarePlanTab({ tab }: { tab: string }) {
  const data = carePlanData[tab] || []
  return <div className="patient-card-list">
    {data.map((plan, i) => {
      const pillClass = plan.status === 'In progress' ? 'pill-sand' : plan.status === 'Completed' ? 'pill-teal' : 'pill-coral'
      return <div key={i} className="patient-panel">
        <div className="patient-panel-head">
          <div>
            <span className={`pill ${pillClass}`}>{plan.status}</span>
            <h2>{plan.title}</h2>
          </div>
          <span className="progress-value">{plan.progress}</span>
        </div>
        <div className="progress-track"><span style={{width: plan.progress}}/></div>
        <p className="muted">Goals: {plan.goals}</p>
        <p className="muted">Instructions: {plan.instructions}</p>
        <p className="muted">Medications: {plan.medications}</p>
        <p className="muted">Lifestyle: {plan.lifestyle}</p>
        <p className="muted">Follow-up: {plan.followUp}</p>
        <div className="patient-actions">
          <button className="btn btn-outline">Update progress</button>
          <button className="text-link">View plan <ChevronRight size={15}/></button>
        </div>
      </div>
    })}
  </div>
}

function PatientProfile() {
  return <div className="patient-profile-grid">
    {profileSections.map((section, i) => <div key={i} className="patient-panel">
      <div className="patient-panel-head">
        <div>
          <span className="patient-kicker">PROFILE</span>
          <h2>{section.title}</h2>
        </div>
      </div>
      {section.items.map(([label, value], j) => <div key={j} className="patient-profile-row">
        <strong>{label}</strong>
        <span>{value}</span>
      </div>)}
    </div>)}
  </div>
}

function SettingsView() {
  return <div className="patient-settings-grid">
    {settingsSections.map((section, i) => {
      const Icon = section.icon
      return <div key={i} className="patient-settings-card">
        <Icon size={20}/>
        <h2>{section.title}</h2>
        <p>{section.desc}</p>
        <button className="btn btn-outline">{section.action}</button>
      </div>
    })}
  </div>
}

function HelpView() {
  return <div className="patient-panel" style={{maxWidth:700}}>
    <div className="patient-panel-head">
      <div>
        <span className="patient-kicker">SUPPORT</span>
        <h2>Help & Support</h2>
      </div>
      <HelpCircle size={22}/>
    </div>
    <p className="muted">How can we help you today? Our care team is here to assist you with any questions about your health, appointments, or portal usage.</p>
    <div className="patient-actions" style={{marginTop:18}}>
      <button className="btn btn-outline"><MessageCircle size={15}/> Chat with us</button>
      <button className="btn btn-outline"><Phone size={15}/> Call +880 2-1234567</button>
      <button className="btn btn-outline"><Mail size={15}/> support@dribrahim.com</button>
    </div>
  </div>
}

function PrivacyView() {
  return <div className="patient-panel" style={{maxWidth:700}}>
    <div className="patient-panel-head">
      <div>
        <span className="patient-kicker">PRIVACY</span>
        <h2>Privacy & Security</h2>
      </div>
      <Shield size={22}/>
    </div>
    <p className="muted">Your health information is protected and private. Only you and your care team can access your records. We use industry-standard encryption to keep your data safe.</p>
    <div className="patient-actions" style={{marginTop:18}}>
      <button className="btn btn-outline"><FileText size={15}/> View privacy policy</button>
      <button className="btn btn-outline"><Lock size={15}/> Security settings</button>
    </div>
  </div>
}
