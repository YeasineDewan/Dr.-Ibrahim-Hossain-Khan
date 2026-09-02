"use client"
import { useState } from 'react'
import { Activity, LayoutDashboard, CalendarDays, Users, ClipboardList, MapPin, ShoppingBag, Package, Receipt, FileText, Image as ImageIcon, Video, Star, BarChart3, Bell, Settings, ShieldCheck, Search, ChevronDown, ChevronRight, Plus, MoreHorizontal, Menu, X, LogOut, ArrowUpRight } from 'lucide-react'
import { adminCopy, useLanguage } from '../lib/translations'

type Group = { label: string; items: string[] }
const iconFor = (x: string) => ({
  Dashboard: LayoutDashboard, Analytics: BarChart3, Appointments: CalendarDays, Calendar: CalendarDays,
  Patients: Users, 'Follow-ups': ClipboardList, Chambers: MapPin, Products: ShoppingBag,
  Categories: Package, Inventory: Package, Orders: Receipt, Customers: Users, Coupons: Receipt,
  'Services & CMS': FileText, Gallery: ImageIcon, Videos: Video, Reviews: Star,
  Reports: BarChart3, Notifications: Bell, 'Users & roles': ShieldCheck, Settings: Settings,
  'Activity log': ClipboardList,
}[x] || ClipboardList)

export function AdminWorkspace({ onExit }: { onExit: () => void }) {
  const { lang } = useLanguage()
  const a = adminCopy[lang]
  const [active, setActive] = useState('Dashboard')
  const [open, setOpen] = useState(true)
  const [expanded, setExpanded] = useState<string[]>(a.groups.map(g => g.label))
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [records, setRecords] = useState<string[]>(['Amina Rahman','Sadia Khan','Fahim Ahmed','Nusrat Jahan'])
  const toggle = (g: string) => setExpanded(e => e.includes(g) ? e.filter(x => x !== g) : [...e, g])
  const groups: Group[] = a.groups as unknown as Group[]

  return (
    <div className="admin-workspace">
      <aside className={`pro-admin-sidebar ${open ? 'open' : ''}`}>
        <button className="pro-admin-brand">
          <span className="brand-mark"><Activity size={18}/></span>
          <span>{lang === 'bn' ? 'ডাঃ ইব্রাহিম' : 'Dr. Ibrahim'}<small>{a.brandSub}</small></span>
        </button>
        <div className="clinic-switch">
          <span className="clinic-avatar">DI</span>
          <span><strong>{lang === 'bn' ? 'ডাঃ ইব্রাহিম' : 'Dr. Ibrahim'}</strong><small>{lang === 'bn' ? 'প্রধান চিকিৎসক' : 'Lead physician'}</small></span>
          <ChevronDown size={14}/>
        </div>
        <nav className="pro-admin-nav">
          {groups.map(g => (
            <div className="pro-nav-group" key={g.label}>
              <button className="pro-group-title" onClick={() => toggle(g.label)}>{g.label}<ChevronDown className={expanded.includes(g.label) ? 'rotate' : ''} size={13}/></button>
              {expanded.includes(g.label) && g.items.map(item => {
                const I = iconFor(item)
                return <button key={item} onClick={() => setActive(item)} className={`pro-nav-item ${active === item ? 'active' : ''}`}><I size={16}/><span>{item}</span>{item === a.groups[1].items[0] && <b>4</b>}{item === a.groups[4].items[1] && <b className="coral">3</b>}</button>
              })}
            </div>
          ))}
        </nav>
        <button className="admin-exit" onClick={onExit}><LogOut size={15}/> {a.backToWebsite}</button>
      </aside>
      <main className="pro-admin-main">
        <header className="pro-admin-header">
          <button className="admin-mobile-menu" onClick={() => setOpen(!open)}>{open ? <X size={19}/> : <Menu size={19}/>}</button>
          <div className="admin-breadcrumb">{a.workspace} <span>/</span> <strong>{active}</strong></div>
          <div className="admin-header-actions">
            <div className="pro-search"><Search size={15}/><input placeholder={a.searchPh}/></div>
            <button className="pro-icon-button"><Bell size={18}/><i/></button>
            <button className="pro-profile"><span>DI</span><strong>{lang === 'bn' ? 'ডাঃ ইব্রাহিম' : 'Dr. Ibrahim'}</strong><ChevronDown size={14}/></button>
          </div>
        </header>
        <div className="pro-admin-content">
          {active === 'Dashboard' || active === a.groups[0].items[0] ? <DashboardContent copy={a} /> : <ModuleContent name={active} copy={a} records={records} query={query} setQuery={setQuery} onAdd={() => setShowForm(true)} />}
        </div>
      </main>
      {showForm && <AdminForm name={active} lang={lang} onClose={() => setShowForm(false)} onSave={(value) => { setRecords(r => [value, ...r]); setShowForm(false) }} />}
    </div>
  )
}

function AdminForm({ name, lang, onClose, onSave }: { name: string; lang: 'en'|'bn'; onClose: () => void; onSave: (value: string) => void }) {
  const [value, setValue] = useState('')
  const [email, setEmail] = useState('')
  const title = lang === 'bn' ? `${name} যোগ করুন` : `Add ${name}`
  return <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="admin-form-title"><form className="admin-form-card" onSubmit={e => { e.preventDefault(); if (value.trim()) onSave(value.trim()) }}><button type="button" className="modal-close" onClick={onClose}>×</button><span className="pro-kicker">{lang === 'bn' ? 'নতুন রেকর্ড' : 'NEW RECORD'}</span><h2 id="admin-form-title">{title}</h2><label>{lang === 'bn' ? 'নাম / শিরোনাম' : 'Name / title'}<input value={value} onChange={e => setValue(e.target.value)} required autoFocus placeholder={lang === 'bn' ? 'তথ্য লিখুন' : 'Enter details'} /></label><label>{lang === 'bn' ? 'ইমেইল বা নোট' : 'Email or notes'}<textarea value={email} onChange={e => setEmail(e.target.value)} placeholder={lang === 'bn' ? 'অতিরিক্ত তথ্য' : 'Additional information'} /></label><div className="form-actions"><button type="button" className="pro-outline" onClick={onClose}>{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button><button type="submit" className="pro-primary">{lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save record'}</button></div></form></div>
}

function DashboardContent({ copy }: { copy: typeof adminCopy.en }) {
  const { lang } = useLanguage()
  return (
    <>
      <section className="pulse-banner">
        <div>
          <span className="pro-kicker">{copy.pulseKicker}</span>
          <h2>{copy.pulseTitle}</h2>
          <p>{copy.pulseBody}</p>
        </div>
        <div className="pulse-status"><span className="live-dot"/> {copy.pulseStatus}</div>
      </section>
      <div className="pro-kpi-grid">
        {copy.kpis.map((k, i) => {
          const icons = [CalendarDays, Users, ShoppingBag, ClipboardList]
          const tones = ['teal', 'blue', 'gold', 'coral']
          const I = icons[i]
          return (
            <div className="pro-kpi" key={k.label}>
              <span className={`pro-kpi-mark ${tones[i]}`}><I size={18}/></span>
              <div><small>{k.label}</small><strong>{k.value}</strong><em className={tones[i] === 'coral' ? 'warning' : ''}>{k.delta}</em></div>
              <ArrowUpRight size={15}/>
            </div>
          )
        })}
      </div>
      <div className="pro-dashboard-grid">
        <section className="pro-panel schedule-panel">
          <div className="pro-panel-head">
            <div><span className="pro-kicker">{copy.scheduleKicker}</span><h2>{copy.scheduleTitle}</h2></div>
            <button className="panel-more"><MoreHorizontal size={18}/></button>
          </div>
          <div className="schedule-timeline">
            {copy.schedule.map((r, i) => (
              <div className="timeline-row" key={i}>
                <time>{r.time}</time>
                <span className="timeline-dot"/>
                <div><strong>{r.name}</strong><small>{r.desc}</small></div>
                <span className={`status ${r.status.toLowerCase()}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="pro-panel">
          <div className="pro-panel-head">
            <div><span className="pro-kicker">{lang === 'bn' ? 'জুন ২০২৬' : 'JUNE 2026'}</span><h2>{lang === 'bn' ? 'ক্লিনিক পারফরম্যান্স' : 'Clinic performance'}</h2></div>
            <select><option>{lang === 'bn' ? 'গত ৩০ দিন' : 'Last 30 days'}</option><option>{lang === 'bn' ? 'গত ৯০ দিন' : 'Last 90 days'}</option></select>
          </div>
          <div className="performance-chart">
            {[40, 55, 48, 70, 62, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }}/>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

const moduleFeatures: Record<string, { en: string[]; bn: string[] }> = {
  Patients: { en: ['Medical history', 'Prescriptions', 'Patient notes & documents', 'Appointment history'], bn: ['মেডিকেল ইতিহাস', 'প্রেসক্রিপশন', 'রোগীর নোট ও ডকুমেন্ট', 'অ্যাপয়েন্টমেন্ট ইতিহাস'] },
  Appointments: { en: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled', 'Appointment notes'], bn: ['বিচারাধীন', 'নিশ্চিত', 'সম্পন্ন', 'বাতিল', 'পুনঃনির্ধারিত', 'অ্যাপয়েন্টমেন্ট নোট'] },
  Calendar: { en: ['Available slots', 'Blocked time', 'Day / Week / Month', 'Chamber schedule'], bn: ['উপলব্ধ স্লট', 'ব্লক করা সময়', 'দিন / সপ্তাহ / মাস', 'চেম্বার শিডিউল'] },
  'Follow-ups': { en: ['Upcoming', 'Overdue', 'Completed', 'Follow-up reminders'], bn: ['আসন্ন', 'বিলম্বিত', 'সম্পন্ন', 'ফলো-আপ রিমাইন্ডার'] },
  Products: { en: ['Product pricing', 'Product images', 'Stock status', 'Publish status'], bn: ['পণ্যের মূল্য', 'পণ্যের ছবি', 'স্টক স্ট্যাটাস', 'প্রকাশের স্ট্যাটাস'] },
  Inventory: { en: ['Stock overview', 'Low stock', 'Out of stock', 'Stock adjustment', 'Stock history'], bn: ['স্টক সংক্ষিপ্ত বিবরণ', 'কম স্টক', 'স্টক শেষ', 'স্টক সমন্বয়', 'স্টক ইতিহাস'] },
  Orders: { en: ['Order details', 'Payment details', 'Refund management', 'Delivery status'], bn: ['অর্ডার বিস্তারিত', 'পেমেন্ট বিস্তারিত', 'রিফান্ড ব্যবস্থাপনা', 'ডেলিভারি স্ট্যাটাস'] },
  'Services & CMS': { en: ['FAQ management', 'Homepage content', 'About doctor', 'SEO / Meta'], bn: ['FAQ ব্যবস্থাপনা', 'হোমপেজ কনটেন্ট', 'ডাক্তার সম্পর্কে', 'SEO / Meta'] },
  Gallery: { en: ['Albums', 'Upload images', 'Categories', 'Image management'], bn: ['অ্যালবাম', 'ছবি আপলোড', 'ক্যাটাগরি', 'ছবি ব্যবস্থাপনা'] },
  Reviews: { en: ['Pending', 'Approved', 'Rejected', 'Ratings', 'Reply to review'], bn: ['বিচারাধীন', 'অনুমোদিত', 'প্রত্যাখ্যাত', 'রেটিং', 'রিভিউতে উত্তর'] },
  Reports: { en: ['Appointment reports', 'Sales reports', 'Revenue reports', 'Inventory reports', 'Export reports'], bn: ['অ্যাপয়েন্টমেন্ট রিপোর্ট', 'সেলস রিপোর্ট', 'রেভিনিউ রিপোর্ট', 'ইনভেন্টরি রিপোর্ট', 'রিপোর্ট এক্সপোর্ট'] },
  'Users & roles': { en: ['Users', 'Roles', 'Permissions', 'User status', 'Login history'], bn: ['ইউজার', 'রোল', 'অনুমতি', 'ইউজার স্ট্যাটাস', 'লগইন ইতিহাস'] },
  Settings: { en: ['General', 'Payment settings', 'Email / SMS', 'Security', 'Backup'], bn: ['সাধারণ', 'পেমেন্ট সেটিংস', 'ইমেইল / এসএমএস', 'নিরাপত্তা', 'ব্যাকআপ'] },
  Notifications: { en: ['Appointment notifications', 'Order notifications', 'Stock alerts', 'Patient notifications'], bn: ['অ্যাপয়েন্টমেন্ট নোটিফিকেশন', 'অর্ডার নোটিফিকেশন', 'স্টক সতর্কতা', 'রোগী নোটিফিকেশন'] },
}

function FeatureRail({ name, copy }: { name: string; copy: typeof adminCopy.en }) {
  const { lang } = useLanguage()
  const features = moduleFeatures[name] ? moduleFeatures[name][lang] : (lang === 'bn' ? ['সংক্ষিপ্ত বিবরণ', 'সাম্প্রতিক কার্যকলাপ', 'বিচারাধীন কাজ', 'সেটিংস'] : ['Overview', 'Recent activity', 'Pending tasks', 'Settings'])
  return (
    <div className="feature-rail">
      <div className="feature-rail-head">
        <span className="pro-kicker">{lang === 'bn' ? 'ওয়ার্কস্পেস টুলস' : 'WORKSPACE TOOLS'}</span>
        <strong>{lang === 'bn' ? `${name} পরিচালনা করুন` : `Manage ${name}`}</strong>
      </div>
      <div className="feature-pills">
        {features.map((feature, i) => <button key={feature} className={i === 0 ? 'selected' : ''}>{feature}<ChevronRight size={13}/></button>)}
      </div>
    </div>
  )
}

function ModuleContent({ name, copy, records, query, setQuery, onAdd }: { name: string; copy: typeof adminCopy.en; records: string[]; query: string; setQuery: (value: string) => void; onAdd: () => void }) {
  const { lang } = useLanguage()
  const patients = copy.patients
  return (
    <section className="pro-panel module-view">
      <div className="module-hero">
        <div>
          <span className="pro-kicker">{lang === 'bn' ? 'ক্লিনিক অপারেশনস' : 'CLINIC OPERATIONS'}</span>
          <h2>{name}</h2>
          <p>{lang === 'bn' ? `আপনার ${name} ওয়ার্কস্পেস এক জায়গা থেকে পরিচালনা, পর্যালোচনা ও আপডেট করুন।` : `Manage, review and update your ${name.toLowerCase()} workspace from one place.`}</p>
        </div>
        <span className="module-icon">{(() => { const I = iconFor(name); return <I size={24}/> })()}</span>
      </div>
      <FeatureRail name={name} copy={copy} />
      <div className="module-toolbar">
        <div className="pro-search"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={lang === 'bn' ? `${name} অনুসন্ধান...` : `Search ${name.toLowerCase()}...`}/></div>
        <button className="pro-outline"><span>{copy.filter}</span><ChevronDown size={14}/></button>
        <button className="pro-primary" onClick={onAdd}><Plus size={15}/> {copy.add} {name.replace(' & CMS', '')}</button>
      </div>
      <div className="pro-data-table">
        <div className="table-head">
          {copy.tableHead.map(h => <span key={h}>{h}</span>)}
          <span/>
        </div>
        {records.filter(x => x.toLowerCase().includes(query.toLowerCase())).map((x, i) => (
          <div className="table-row" key={x}>
            <div className="table-name">
              <span className="person-avatar">{x.split(' ').map(y => y[0]).join('').slice(0,2)}</span>
              <strong>{name === copy.patients[0] || name === 'Patients' ? x : `${name} #00${i+18}`}</strong>
            </div>
            <span>{name === 'Patients' ? copy.categories[0] : i % 2 ? copy.categories[2] : copy.categories[1]}</span>
            <span className={`status ${i === 1 ? 'pending' : 'confirmed'}`}>{i === 1 ? copy.statuses[1] : copy.statuses[0]}</span>
            <span>{copy.lastUpdated}, {9+i}:30</span>
            <button className="panel-more"><MoreHorizontal size={17}/></button>
          </div>
        ))}
      </div>
    </section>
  )
}
