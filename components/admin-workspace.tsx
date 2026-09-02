'use client'
import { useState, useMemo } from 'react'
import {
  Activity, LayoutDashboard, CalendarDays, Users, ClipboardList, MapPin, ShoppingBag, Package, Receipt,
  FileText, Image as ImageIcon, Video, Star, BarChart3, Bell, Settings, ShieldCheck, Search,
  ChevronDown, ChevronRight, Plus, MoreHorizontal, Menu, X, LogOut, ArrowUpRight, ListChecks,
  Stethoscope, UserCog, Tag, FolderTree, History, LineChart, Globe
} from 'lucide-react'
import { adminCopy, useLanguage, t as tT } from '../lib/translations'
import { useAdminData } from '../lib/admin-data'
import { Avatar, Pill, useToast } from './admin-ui'
import { DashboardView } from './admin/dashboard'
import { AnalyticsView, ActivityLogView } from './admin/analytics'
import { AppointmentsView, CalendarView, FollowUpsView, ChambersView } from './admin/care'
import { PatientsView } from './admin/patients'
import { ProductsView, CategoriesView, InventoryView, OrdersView, CustomersView, CouponsView } from './admin/commerce'
import { ServicesCMSView, GalleryView, VideosView, ReviewsView } from './admin/content'
import { ReportsView, NotificationsView, UsersView, SettingsView } from './admin/system'

const iconFor = (x: string) => ({
  Dashboard: LayoutDashboard, Analytics: BarChart3, 'Activity log': ListChecks,
  Appointments: CalendarDays, Calendar: CalendarDays, Patients: Users, 'Follow-ups': ClipboardList, Chambers: MapPin,
  Products: ShoppingBag, Categories: FolderTree, Inventory: Package, Orders: Receipt, Customers: Users, Coupons: Tag,
  'Services & CMS': Stethoscope, Gallery: ImageIcon, Videos: Video, Reviews: Star,
  Reports: BarChart3, Notifications: Bell, 'Users & roles': UserCog, Settings: Settings,
}[x] || ClipboardList)

export function AdminWorkspace({ onExit }: { onExit: () => void }) {
  const { lang } = useLanguage()
  const a = adminCopy[lang]
  const [active, setActive] = useState('Dashboard')
  const [open, setOpen] = useState(true)
  const [expanded, setExpanded] = useState<string[]>(adminCopy.en.groups.map(g => g.label))
  const toggle = (g: string) => setExpanded(e => e.includes(g) ? e.filter(x => x !== g) : [...e, g])

  const groups = adminCopy.en.groups as unknown as { label: string; items: string[] }[]
  const localizedGroups = a.groups as unknown as { label: string; items: string[] }[]
  const labelFor = (value: string) => {
    for (let i = 0; i < groups.length; i++) {
      const itemIndex = groups[i].items.indexOf(value)
      if (itemIndex >= 0) return localizedGroups[i]?.items[itemIndex] || value
      if (groups[i].label === value) return localizedGroups[i]?.label || value
    }
    return value
  }
  const data = useAdminData()
  const toast = useToast()

  // find the index of a given item in its group for the badge (e.g. "4" on appointments)
  const flatItems = useMemo(() => groups.flatMap(g => g.items.map(it => ({ group: g.label, item: it }))), [groups])
  const badgeFor = (item: string) => {
    if (item === 'Appointments') return data.appointments.filter(x => x.date === '2026-06-18' && (x.status === 'Pending' || x.status === 'Confirmed')).length
    if (item === 'Notifications') return data.notifications.filter(n => !n.read).length
    if (item === 'Follow-ups') return data.followUps.filter(f => f.status === 'Overdue').length
    if (item === 'Orders') return data.orders.filter(o => o.status === 'Processing').length
    return 0
  }

  const renderModule = () => {
    switch (active) {
      case 'Dashboard': return <DashboardView data={data} copy={a} onNavigate={setActive} />
      case 'Analytics': return <AnalyticsView copy={a} />
      case 'Activity log': return <ActivityLogView data={data} copy={a} />
      case 'Appointments': return <AppointmentsView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Calendar': return <CalendarView data={data} copy={a} onNavigate={setActive} />
      case 'Patients': return <PatientsView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Follow-ups': return <FollowUpsView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Chambers': return <ChambersView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Products': return <ProductsView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Categories': return <CategoriesView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Inventory': return <InventoryView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Orders': return <OrdersView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Customers': return <CustomersView data={data} copy={a} />
      case 'Coupons': return <CouponsView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Services & CMS': return <ServicesCMSView copy={a} />
      case 'Gallery': return <GalleryView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Videos': return <VideosView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Reviews': return <ReviewsView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Reports': return <ReportsView copy={a} />
      case 'Notifications': return <NotificationsView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Users & roles': return <UsersView data={data} copy={a} onLog={data.logActivity} toast={toast} />
      case 'Settings': return <SettingsView copy={a} onLog={data.logActivity} toast={toast} />
      default: return <DashboardView data={data} copy={a} onNavigate={setActive} />
    }
  }

  const currentItem = flatItems.find(f => f.item === active)?.item || active
  const unread = data.notifications.filter(n => !n.read).length

  return (
    <div className="admin-workspace">
      <aside className={`pro-admin-sidebar ${open ? 'open' : ''}`}>
        <button className="pro-admin-brand" onClick={onExit}>
          <span className="brand-mark float-soft"><Activity size={18}/></span>
          <span>{lang === 'bn' ? 'ডাঃ ইব্রাহিম' : 'Dr. Ibrahim'}<small>{a.brandSub}</small></span>
        </button>
        <div className="clinic-switch lift">
          <span className="clinic-avatar avatar-ring" style={{ display: 'grid', placeItems: 'center' }}>DI</span>
          <span><strong>{lang === 'bn' ? 'ডাঃ ইব্রাহিম' : 'Dr. Ibrahim'}</strong><small>{a.leadPhysician}</small></span>
          <ChevronDown size={14} className="float-x"/>
        </div>
        <nav className="pro-admin-nav">
          {groups.map((g, groupIndex) => (
            <div className="pro-nav-group" key={g.label}>
              <button className="pro-group-title" onClick={() => toggle(g.label)}>{localizedGroups[groupIndex]?.label || g.label}<ChevronDown className={expanded.includes(g.label) ? 'rotate' : ''} size={13}/></button>
              {expanded.includes(g.label) && g.items.map((item, itemIndex) => {
                const I = iconFor(item)
                const badge = badgeFor(item)
                return (
                  <button key={item} onClick={() => setActive(item)} className={`pro-nav-item ${active === item ? 'active' : ''} press`}>
                    <I size={16} className={active === item ? 'float-soft' : ''}/><span>{localizedGroups[groupIndex]?.items[itemIndex] || item}</span>
                    {badge > 0 && <b className={item === 'Follow-ups' ? 'coral pulse' : 'pulse'}>{badge}</b>}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
        <button className="admin-exit press btn-pro" onClick={onExit}><LogOut size={15}/> {a.backToWebsite}</button>
      </aside>

      <main className="pro-admin-main">
        <header className="pro-admin-header">
          <button className="admin-mobile-menu press" onClick={() => setOpen(!open)}>{open ? <X size={19}/> : <Menu size={19}/>}</button>
          <div className="admin-breadcrumb">{a.workspace} <span>/</span> <strong>{labelFor(currentItem)}</strong></div>
          <div className="admin-header-actions">
            <div className="pro-search glow-focus"><Search size={15}/><input placeholder={a.searchPh}/></div>
            <button className="pro-icon-button press" onClick={() => setActive('Notifications')} title="Notifications">
              <Bell size={18}/>{unread > 0 && <i className="pulse"/>}
            </button>
            <button className="pro-profile press" onClick={() => setActive('Users & roles')}>
              <Avatar name="Dr. Ibrahim" size={32}/>
              <strong>{lang === 'bn' ? 'ডাঃ ইব্রাহিম' : 'Dr. Ibrahim'}</strong>
              <ChevronDown size={14}/>
            </button>
          </div>
        </header>
        <div className="pro-admin-content appear-zoom" key={active}>{renderModule()}</div>
      </main>
      {toast.node}
    </div>
  )
}
