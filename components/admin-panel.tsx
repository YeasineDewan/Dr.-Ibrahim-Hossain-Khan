'use client'

import { useState, useMemo } from 'react'
import {
  LayoutDashboard, CalendarDays, UserRound, ShoppingBag, Package,
  ClipboardList, BarChart3, Settings, Bell, Users, Shield, FileText,
  Search, Plus, Edit, Trash2, Check, X, Star, Mail, Phone, MapPin,
  Calendar, Clock, ChevronDown, ChevronRight, Filter, MoreHorizontal,
  ExternalLink, Download, Upload, Save, AlertCircle, RefreshCw,
  CheckCircle, XCircle, User, Lock, BarChart2, PieChart, TrendingUp,
  Eye, Send, Archive, Flag, Tag, Globe,   Image as ImageIcon, Play,
  Heart,
  Home, Activity
} from 'lucide-react'

// ─── Types ───
interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'date' | 'number' | 'time'
  options?: string[]
  required?: boolean
  placeholder?: string
  col?: 'full' | 'half'
}

interface Column {
  header: string
  accessor: string
  className?: string
  render?: (value: any, row: any) => React.ReactNode
}

interface ModalState {
  type: string | null
  mode: 'add' | 'edit'
  data: any | null
}

// ─── Initial Data ───
const initialPatients = [
  { id: 1, name: 'Amara Mensah', phone: '+233 24 123 4567', email: 'amara@example.com', dob: '1985-03-15', gender: 'Female', status: 'Active', lastVisit: '15 Jun 2026', totalVisits: 12 },
  { id: 2, name: 'Daniel Owusu', phone: '+233 55 987 6543', email: 'daniel@example.com', dob: '1990-07-22', gender: 'Male', status: 'Active', lastVisit: '18 Jun 2026', totalVisits: 8 },
  { id: 3, name: 'Sofia Boateng', phone: '+233 20 456 7890', email: 'sofia@example.com', dob: '1992-11-08', gender: 'Female', status: 'Active', lastVisit: '17 Jun 2026', totalVisits: 15 },
  { id: 4, name: 'Michael Addo', phone: '+233 27 654 3210', email: 'michael@example.com', dob: '1988-01-30', gender: 'Male', status: 'Inactive', lastVisit: '10 Jun 2026', totalVisits: 5 },
  { id: 5, name: 'Kwame Asante', phone: '+233 24 111 2233', email: 'kwame@example.com', dob: '1979-05-14', gender: 'Male', status: 'Active', lastVisit: '19 Jun 2026', totalVisits: 22 },
  { id: 6, name: 'Fatima Ali', phone: '+233 55 777 8899', email: 'fatima@example.com', dob: '1995-09-20', gender: 'Female', status: 'Active', lastVisit: '14 Jun 2026', totalVisits: 6 },
]

const initialAppointments = [
  { id: 1, patient: 'Amara Mensah', service: 'General consultation', chamber: 'Dhanmondi Chamber', date: '18 Jun 2026', time: '09:00', status: 'Confirmed' },
  { id: 2, patient: 'Daniel Owusu', service: 'Skin consultation', chamber: 'Banglamotor Chamber', date: '18 Jun 2026', time: '10:30', status: 'Pending' },
  { id: 3, patient: 'Sofia Boateng', service: 'Follow-up visit', chamber: 'Uttara Wellness Studio', date: '18 Jun 2026', time: '13:00', status: 'Confirmed' },
  { id: 4, patient: 'Michael Addo', service: 'Family medicine', chamber: 'Dhanmondi Chamber', date: '19 Jun 2026', time: '08:30', status: 'New' },
  { id: 5, patient: 'Kwame Asante', service: 'Preventive checkup', chamber: 'Dhanmondi Chamber', date: '19 Jun 2026', time: '10:00', status: 'Confirmed' },
  { id: 6, patient: 'Fatima Ali', service: 'PRP Therapy', chamber: 'Banglamotor Chamber', date: '20 Jun 2026', time: '14:00', status: 'Pending' },
]

const initialProducts = [
  { id: 1, name: 'Daily Defence SPF 50', category: 'Skin care', price: 28, stock: 45, desc: 'Mineral sunscreen for sensitive skin.', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=200&q=80' },
  { id: 2, name: 'Calm + Restore Serum', category: 'Skin care', price: 34, stock: 32, desc: 'Barrier-supporting serum with ceramides.', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80' },
  { id: 3, name: 'Magnesium Complex', category: 'Wellness', price: 22, stock: 18, desc: 'Gentle evening formula for wellbeing.', image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=200&q=80' },
  { id: 4, name: 'Gut Balance Probiotic', category: 'Gut health', price: 31, stock: 8, desc: 'Daily support for a healthier gut.', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80' },
]

const initialChambers = [
  { id: 1, name: 'Dhanmondi Chamber', area: 'Dhanmondi, Dhaka', address: 'House 45, Road 22, Islam Tower', hours: 'Sat–Thu · 9:00 AM – 2:00 PM', phone: '+880 1719 939553', color: 'blue' },
  { id: 2, name: 'Banglamotor Chamber', area: 'Banglamotor, Dhaka', address: 'Rupayan Trade Center, Lift 3', hours: 'Sun–Wed · 4:00 PM – 9:00 PM', phone: '+880 1719 939553', color: 'teal' },
  { id: 3, name: 'Uttara Wellness Studio', area: 'Uttara, Dhaka', address: 'Sector 7, Road 12, Level 2', hours: 'Fri · 10:00 AM – 6:00 PM', phone: '+880 1719 939553', color: 'sand' },
]

const initialServices = [
  { id: 1, name: 'Preventive & Family Medicine', icon: Heart, description: 'Thoughtful checkups and proactive care.', price: 'From $60', duration: '45 minutes' },
  { id: 2, name: 'Skin & Aesthetic Medicine', icon: Sparkles, description: 'Evidence-based treatments for skin health.', price: 'From $80', duration: '60 minutes' },
  { id: 3, name: 'Metabolic & Wellness Health', icon: Leaf, description: 'Holistic approach to metabolic health.', price: 'From $70', duration: '60 minutes' },
  { id: 4, name: "Women's Wellness", icon: Users, description: 'Comprehensive care for women.', price: 'From $65', duration: '45 minutes' },
  { id: 5, name: 'Mental Health & Stress Management', icon: Brain, description: 'Integrated mental health support.', price: 'From $75', duration: '50 minutes' },
  { id: 6, name: 'Corporate Wellness', icon: Shield, description: 'Customized programs for companies.', price: 'Custom quote', duration: 'Flexible' },
]

const initialUsers = [
  { id: 1, name: 'Dr. Ibrahim Hossain Khan', email: 'ibrahim@clinic.com', role: 'Administrator', status: 'Active', lastActive: '2 min ago' },
  { id: 2, name: 'Dr. Aisha Mohamed', email: 'aisha@clinic.com', role: 'Doctor', status: 'Active', lastActive: '1 hr ago' },
  { id: 3, name: 'Nurse Kwame Asante', email: 'kwame@clinic.com', role: 'Nurse', status: 'Active', lastActive: '3 hrs ago' },
  { id: 4, name: 'Sarah Thompson', email: 'sarah@clinic.com', role: 'Receptionist', status: 'Active', lastActive: 'Just now' },
  { id: 5, name: 'Dr. Amara Osei', email: 'amara@clinic.com', role: 'Doctor', status: 'Inactive', lastActive: '2 days ago' },
]

const initialOrders = [
  { id: 'DRI-2026-018', customer: 'Amara Mensah', items: 3, total: 94, status: 'Delivered', date: '15 Jun 2026' },
  { id: 'DRI-2026-019', customer: 'Daniel Owusu', items: 1, total: 28, status: 'Shipped', date: '17 Jun 2026' },
  { id: 'DRI-2026-020', customer: 'Sofia Boateng', items: 2, total: 53, status: 'Processing', date: '18 Jun 2026' },
  { id: 'DRI-2026-021', customer: 'Michael Addo', items: 1, total: 22, status: 'Pending', date: '18 Jun 2026' },
  { id: 'DRI-2026-022', customer: 'Kwame Asante', items: 4, total: 115, status: 'Pending', date: '19 Jun 2026' },
]

const initialReviews = [
  { id: 1, author: 'Amara Mensah', rating: 5, text: 'The most thorough skin consultation I have ever had.', date: '15 Jun 2026', status: 'Published' },
  { id: 2, author: 'Daniel Owusu', rating: 5, text: 'Professional, compassionate and thorough care.', date: '17 Jun 2026', status: 'Published' },
  { id: 3, author: 'Sofia Boateng', rating: 4, text: 'Great experience but wait times could be shorter.', date: '18 Jun 2026', status: 'Pending' },
  { id: 4, author: 'Michael Addo', rating: 5, text: 'Best clinic experience I have had. Exceptional care.', date: '18 Jun 2026', status: 'Published' },
]

const initialNotifications = [
  { id: 1, title: 'New appointment booked', message: 'Amara Mensah booked an appointment for 09:00', time: '5 min ago', read: false },
  { id: 2, title: 'Low stock alert', message: 'Gut Balance Probiotic is running low (8 units)', time: '30 min ago', read: false },
  { id: 3, title: 'Review pending', message: 'Sofia Boateng left a review awaiting approval', time: '1 hr ago', read: true },
  { id: 4, title: 'Follow-up reminder', message: 'Michael Addo follow-up due today', time: '2 hrs ago', read: true },
  { id: 5, title: 'Order shipped', message: 'Order DRI-2026-019 has been dispatched', time: '3 hrs ago', read: true },
]

const initialGallery = [
  { id: 1, title: 'Clinic Reception', category: 'Facility', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80' },
  { id: 2, title: 'Consultation Room', category: 'Facility', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80' },
  { id: 3, title: 'Treatment Area', category: 'Facility', url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=400&q=80' },
  { id: 4, title: 'Reception Waiting', category: 'Facility', url: 'https://images.unsplash.com/photo-1560252829-804f1aedf1be?auto=format&fit=crop&w=400&q=80' },
  { id: 5, title: 'Lab Equipment', category: 'Equipment', url: 'https://images.unsplash.com/photo-1581093458791-9d42ccd990c5?auto=format&fit=crop&w=400&q=80' },
  { id: 6, title: 'Patient Room', category: 'Facility', url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80' },
]

const initialVideos = [
  { id: 1, title: 'The Art of a Good Consultation', duration: '04:32', views: '2.4k', date: '10 Jun 2026' },
  { id: 2, title: 'Preventive Medicine Explained', duration: '06:15', views: '1.8k', date: '05 Jun 2026' },
  { id: 3, title: 'Skincare Routine Guide', duration: '08:20', views: '3.1k', date: '01 Jun 2026' },
  { id: 4, title: 'Mental Health Awareness', duration: '05:45', views: '1.5k', date: '28 May 2026' },
]

const initialFollowUps = [
  { id: 1, patient: 'Michael Addo', date: '19 Jun 2026', type: 'Post-treatment', status: 'Pending' },
  { id: 2, patient: 'Sofia Boateng', date: '20 Jun 2026', type: 'Lab results', status: 'Pending' },
  { id: 3, patient: 'Kwame Asante', date: '21 Jun 2026', type: 'Medication review', status: 'Scheduled' },
  { id: 4, patient: 'Fatima Ali', date: '22 Jun 2026', type: 'Post-PRP', status: 'Pending' },
]

const initialInventory = [
  { id: 1, product: 'Daily Defence SPF 50', sku: 'SKU-001', stock: 45, reorder: 20, status: 'In Stock' },
  { id: 2, product: 'Calm + Restore Serum', sku: 'SKU-002', stock: 32, reorder: 15, status: 'In Stock' },
  { id: 3, product: 'Magnesium Complex', sku: 'SKU-003', stock: 18, reorder: 10, status: 'In Stock' },
  { id: 4, product: 'Gut Balance Probiotic', sku: 'SKU-004', stock: 8, reorder: 20, status: 'Low Stock' },
]

// ─── Helper: Status Badge ───
function StatusBadge({ status, type = 'default' }: { status: string; type?: string }) {
  const map: Record<string, string> = {
    'Active': 'status-active',
    'Inactive': 'status-inactive',
    'Confirmed': 'status-confirmed',
    'Pending': 'status-pending',
    'Cancelled': 'status-cancelled',
    'Completed': 'status-completed',
    'New': 'status-new',
    'Published': 'status-active',
    'Delivered': 'status-completed',
    'Shipped': 'status-pending',
    'Processing': 'status-pending',
    'In Stock': 'status-active',
    'Low Stock': 'status-pending',
    'Out of Stock': 'status-cancelled',
    'Scheduled': 'status-new',
    'Sent': 'status-completed',
  }
  return <span className={`status-badge ${map[status] || 'status-pending'}`}>{status}</span>
}

// ─── Helper: Avatar ───
function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase()
  return <span className="avatar-inline" style={{ width: size, height: size, fontSize: size * 0.35 }}>{initials}</span>
}

// ─── Helper: KPICard ───
function KPICard({ icon, label, value, trend, trendType = 'positive' }: {
  icon: React.ReactNode; label: string; value: string | number; trend?: string; trendType?: 'positive' | 'negative' | 'neutral'
}) {
  return (
    <div className="kpi-card">
      <span className={`kpi-icon kpi-${trendType === 'positive' ? 'teal' : trendType === 'negative' ? 'coral' : 'blue'}`}>
        {typeof icon === 'function' ? icon({ size: 20 }) : icon}
      </span>
      <div className="kpi-body">
        <span className="kpi-value">{value}</span>
        <span className="kpi-label">{label}</span>
      </div>
      {trend && <span className={`kpi-trend kpi-trend-${trendType}`}>{trend}</span>}
    </div>
  )
}

// ─── Helper: FormModal ───
function FormModal({ isOpen, title, fields, data, onSubmit, onClose, submitLabel = 'Save' }: {
  isOpen: boolean; title: string; fields: FormField[]; data: Record<string, any>; onSubmit: (data: Record<string, any>) => void; onClose: () => void; submitLabel?: string
}) {
  const [form, setForm] = useState<Record<string, any>>(data || {})

  if (!isOpen) return null

  const handleSubmit = () => {
    onSubmit(form)
    setForm(data || {})
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="admin-modal-body">
          <div className="admin-form-grid">
            {fields.map(field => (
              <div key={field.name} className={`form-field form-field-${field.col || 'full'}`}>
                <label htmlFor={field.name}>{field.label}{field.required && <span className="required"> *</span>}</label>
                {field.type === 'textarea' ? (
                  <textarea id={field.name} rows={3} placeholder={field.placeholder || ''} value={form[field.name] || ''} onChange={e => setForm({ ...form, [field.name]: e.target.value })} required={field.required} />
                ) : field.type === 'select' ? (
                  <select id={field.name} value={form[field.name] || ''} onChange={e => setForm({ ...form, [field.name]: e.target.value })} required={field.required}>
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input id={field.name} type={field.type} placeholder={field.placeholder || ''} value={form[field.name] || ''} onChange={e => setForm({ ...form, [field.name]: e.target.value })} required={field.required} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="admin-modal-footer">
          <button className="btn btn-ghost btn-admin" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-admin" onClick={handleSubmit}>
            <Save size={15}/>{submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Helper: DataTable ───
function DataTable({ columns, data, searchKeys, onAdd, onEdit, onDelete, addLabel, onRowClick }: {
  columns: Column[]; data: any[]; searchKeys?: string[]; onAdd?: () => void; onEdit?: (row: any) => void; onDelete?: (row: any) => void; addLabel?: string; onRowClick?: (row: any) => void
}) {
  const [search, setSearch] = useState('')
  const filtered = search
    ? data.filter(row =>
        searchKeys?.some(key =>
          String(row[key]).toLowerCase().includes(search.toLowerCase())
        )
      )
    : data

  return (
    <div className="admin-card">
      <div className="data-toolbar">
        <div className="search-box">
          <Search size={16}/>
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {onAdd && <button className="btn btn-primary btn-admin btn-sm" onClick={onAdd}><Plus size={15}/>{addLabel || 'Add'}</button>}
      </div>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map(col => <th key={col.accessor} className={col.className}>{col.header}</th>)}
              {(onEdit || onDelete) && <th className="col-actions">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="empty-state">No records found</td></tr>
            ) : filtered.map((row, i) => (
              <tr key={row.id || i} onClick={() => onRowClick?.(row)} className={onRowClick ? 'clickable-row' : ''}>
                {columns.map(col => (
                  <td key={col.accessor} className={col.className}>
                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="col-actions">
                    <div className="table-actions">
                      {onEdit && <button className="action-btn action-edit" onClick={() => onEdit(row)}><Edit size={15}/></button>}
                      {onDelete && <button className="action-btn action-delete" onClick={() => onDelete(row)}><Trash2 size={15}/></button>}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <span className="muted">Showing {filtered.length} of {data.length} records</span>
      </div>
    </div>
  )
}

// ─── View: Dashboard ───
function DashboardView({ appointments, patients, onNavigate }: {
  appointments: any[]; patients: any[]; onNavigate: (p: string) => void
}) {
  const todayAppointments = appointments.slice(0, 4)
  return (
    <div className="admin-dashboard">
      <div className="dashboard-command">
        <div>
          <span className="command-eyebrow">CLINIC PULSE</span>
          <strong>Your care team is running smoothly today.</strong>
          <p className="muted">{appointments.length} appointments across 3 chambers · {patients.filter(p => p.status === 'Active').length} active patients</p>
        </div>
        <div className="command-actions">
          <button className="btn btn-outline btn-admin"><CalendarDays size={15}/> View schedule</button>
          <button className="btn btn-primary btn-admin"><Plus size={15}/> New appointment</button>
        </div>
      </div>
      <div className="kpi-grid dashboard-kpi">
        <KPICard icon={<CalendarDays size={20}/>} label="Today's appointments" value="18" trend="+12% vs last week" trendType="positive"/>
        <KPICard icon={<Users size={20}/>} label="Total patients" value="2,084" trend="+8.4% this month" trendType="positive"/>
        <KPICard icon={<ShoppingBag size={20}/>} label="Medicine revenue" value="$4,280" trend="+16.2% this month" trendType="positive"/>
        <KPICard icon={<Clock size={20}/>} label="Pending follow-ups" value="07" trend="Needs attention" trendType="neutral"/>
        <KPICard icon={<UserRound size={20}/>} label="New patients" value="24" trend="+5% this week" trendType="positive"/>
        <KPICard icon={<Shield size={20}/>} label="Staff on duty" value="8" trend="3 chambers" trendType="neutral"/>
      </div>
      <div className="dashboard-grid">
        <div className="admin-card schedule-panel">
          <div className="panel-head">
            <div><h2>Today's schedule</h2><p className="muted">Tuesday, 18 June 2026</p></div>
            <button className="icon-btn"><MoreHorizontal size={18}/></button>
          </div>
          <div className="schedule-list">
            {todayAppointments.map(apt => (
              <div className="schedule-item" key={apt.id}>
                <span className="schedule-time">{apt.time}</span>
                <Avatar name={apt.patient} size={28}/>
                <div className="appointment-person">
                  <strong>{apt.patient}</strong>
                  <small>{apt.service}</small>
                </div>
                <StatusBadge status={apt.status}/>
              </div>
            ))}
          </div>
          <button className="text-link btn-view-all" onClick={() => onNavigate('Appointments')}>
            View all appointments <ArrowRight size={14}/>
          </button>
        </div>
        <div className="admin-card activity-panel">
          <div className="panel-head">
            <div><h2>Recent patients</h2><p className="muted">Last 24 hours</p></div>
          </div>
          <div className="activity-list">
            {patients.slice(0, 5).map(patient => (
              <div className="activity-item" key={patient.id}>
                <Avatar name={patient.name} size={32}/>
                <div className="activity-body">
                  <strong>{patient.name}</strong>
                  <small>Last visit: {patient.lastVisit}</small>
                </div>
                <StatusBadge status={patient.status}/>
              </div>
            ))}
          </div>
        </div>
        <div className="admin-card metrics-panel">
          <div className="panel-head">
            <div><h2>Quick stats</h2><p className="muted">This month</p></div>
          </div>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-value">$12,450</span>
              <span className="metric-label">Revenue</span>
              <div className="mini-chart">
                <div className="chart-bar" style={{ height: '60%' }}/>
                <div className="chart-bar" style={{ height: '80%' }}/>
                <div className="chart-bar" style={{ height: '45%' }}/>
                <div className="chart-bar" style={{ height: '90%' }}/>
                <div className="chart-bar" style={{ height: '75%' }}/>
                <div className="chart-bar" style={{ height: '100%' }}/>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-value">156</span>
              <span className="metric-label">Consultations</span>
              <div className="mini-chart">
                <div className="chart-bar chart-teal" style={{ height: '50%' }}/>
                <div className="chart-bar chart-teal" style={{ height: '70%' }}/>
                <div className="chart-bar chart-teal" style={{ height: '85%' }}/>
                <div className="chart-bar chart-teal" style={{ height: '60%' }}/>
                <div className="chart-bar chart-teal" style={{ height: '95%' }}/>
                <div className="chart-bar chart-teal" style={{ height: '80%' }}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── View: Appointments ───
function AppointmentsView({ data, setData, modal, setModal }: {
  data: any[]; setData: React.Dispatch<React.SetStateAction<any[]>>; modal: ModalState; setModal: React.Dispatch<React.SetStateAction<ModalState>>
}) {
  const fields: FormField[] = [
    { name: 'patient', label: 'Patient', type: 'text', required: true },
    { name: 'service', label: 'Service', type: 'text', required: true },
    { name: 'chamber', label: 'Chamber', type: 'select', options: ['Dhanmondi Chamber', 'Banglamotor Chamber', 'Uttara Wellness Studio'], required: true },
    { name: 'date', label: 'Date', type: 'text', required: true },
    { name: 'time', label: 'Time', type: 'time', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Confirmed', 'Pending', 'Cancelled', 'Completed', 'New'], required: true },
    { name: 'notes', label: 'Notes', type: 'textarea', col: 'full' },
  ]

  const handleSubmit = (form: Record<string, any>) => {
    if (modal.mode === 'edit' && modal.data) {
      setData(data.map(r => r.id === modal.data.id ? { ...r, ...form } : r))
    } else {
      setData([...data, { id: Date.now(), ...form }])
    }
    setModal({ type: null, mode: 'add', data: null })
  }

  const columns: Column[] = [
    { header: 'Patient', accessor: 'patient' },
    { header: 'Service', accessor: 'service' },
    { header: 'Chamber', accessor: 'chamber' },
    { header: 'Date', accessor: 'date' },
    { header: 'Time', accessor: 'time' },
    { header: 'Status', accessor: 'status', render: (v: string) => <StatusBadge status={v}/> },
  ]

  return (
    <>
      <DataTable columns={columns} data={data} searchKeys={['patient', 'service', 'chamber']} onAdd={() => setModal({ type: 'appointment', mode: 'add', data: null })} onEdit={row => setModal({ type: 'appointment', mode: 'edit', data: row })} onDelete={row => setData(data.filter(r => r.id !== row.id))} addLabel="New appointment"/>
      <FormModal isOpen={modal.type === 'appointment'} title={modal.mode === 'edit' ? 'Edit appointment' : 'New appointment'} fields={fields} data={modal.data || {}} onSubmit={handleSubmit} onClose={() => setModal({ type: null, mode: 'add', data: null })}/>
    </>
  )
}

// ─── View: Calendar ───
function CalendarView() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const appointmentDays = [3, 7, 10, 12, 15, 18, 20, 22, 25, 28]
  const currentMonth = 'June 2026'
  return (
    <div className="admin-card">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="icon-btn"><ChevronLeft size={18}/></button>
          <h3>{currentMonth}</h3>
          <button className="icon-btn"><ChevronRight size={18}/></button>
        </div>
        <button className="btn btn-primary btn-admin btn-sm"><Plus size={14}/> New event</button>
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="calendar-day-header">{d}</div>)}
        {Array.from({ length: 30 }, (_, i) => {
          const dayNum = i + 1
          const hasAppt = appointmentDays.includes(dayNum)
          return (
            <div key={i} className={`calendar-day ${hasAppt ? 'has-appointment' : ''} ${dayNum === 18 ? 'is-today' : ''}`}>
              <span className="day-number">{dayNum}</span>
              {hasAppt && <div className="day-appt-dot"/>}
              {hasAppt && <div className="day-appt-label">{['General', 'Skin', 'Follow-up', 'PRP', 'Checkup', 'General', 'Family', 'IBS', 'Checkup', 'Consult'][appointmentDays.indexOf(dayNum)]}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
const ChevronLeft = ({ size = 18 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>

// ─── View: Patients ───
function PatientsView({ data, setData, modal, setModal }: {
  data: any[]; setData: React.Dispatch<React.SetStateAction<any[]>>; modal: ModalState; setModal: React.Dispatch<React.SetStateAction<ModalState>>
}) {
  const fields: FormField[] = [
    { name: 'name', label: 'Full name', type: 'text', required: true },
    { name: 'phone', label: 'Phone number', type: 'phone', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'dob', label: 'Date of birth', type: 'date' },
    { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
    { name: 'address', label: 'Address', type: 'textarea', col: 'full' },
  ]

  const handleSubmit = (form: Record<string, any>) => {
    if (modal.mode === 'edit' && modal.data) {
      setData(data.map(r => r.id === modal.data.id ? { ...r, ...form } : r))
    } else {
      setData([...data, { id: Date.now(), ...form, lastVisit: 'Never', totalVisits: 0 }])
    }
    setModal({ type: null, mode: 'add', data: null })
  }

  const columns: Column[] = [
    { header: 'Patient', accessor: 'name', render: (v: string) => <div className="table-person"><Avatar name={v}/><div><strong>{v}</strong></div></div> },
    { header: 'Contact', accessor: 'phone', render: (v: string, row: any) => <div><span className="table-meta"><Phone size={13}/> {v}</span><span className="table-meta"><Mail size={13}/> {row.email}</span></div> },
    { header: 'Gender', accessor: 'gender' },
    { header: 'Status', accessor: 'status', render: (v: string) => <StatusBadge status={v}/> },
    { header: 'Last visit', accessor: 'lastVisit' },
    { header: 'Visits', accessor: 'totalVisits', render: (v: number) => <strong>{v}</strong> },
  ]

  return (
    <>
      <DataTable columns={columns} data={data} searchKeys={['name', 'phone', 'email']} onAdd={() => setModal({ type: 'patient', mode: 'add', data: null })} onEdit={row => setModal({ type: 'patient', mode: 'edit', data: row })} onDelete={row => setData(data.filter(r => r.id !== row.id))} addLabel="Add patient"/>
      <FormModal isOpen={modal.type === 'patient'} title={modal.mode === 'edit' ? 'Edit patient' : 'Add patient'} fields={fields} data={modal.data || {}} onSubmit={handleSubmit} onClose={() => setModal({ type: null, mode: 'add', data: null })}/>
    </>
  )
}

// ─── View: Follow-ups ───
function FollowUpsView({ data }: { data: any[] }) {
  const columns: Column[] = [
    { header: 'Patient', accessor: 'patient', render: (v: string) => <div className="table-person"><Avatar name={v}/><div><strong>{v}</strong></div></div> },
    { header: 'Date', accessor: 'date' },
    { header: 'Type', accessor: 'type' },
    { header: 'Status', accessor: 'status', render: (v: string) => <StatusBadge status={v}/> },
  ]
  return <DataTable columns={columns} data={data} searchKeys={['patient', 'type']} addLabel="Add follow-up"/>
}

// ─── View: Chambers ───
function ChambersView({ data, setData, modal, setModal }: {
  data: any[]; setData: React.Dispatch<React.SetStateAction<any[]>>; modal: ModalState; setModal: React.Dispatch<React.SetStateAction<ModalState>>
}) {
  const fields: FormField[] = [
    { name: 'name', label: 'Chamber name', type: 'text', required: true },
    { name: 'area', label: 'Area', type: 'text', required: true },
    { name: 'address', label: 'Address', type: 'textarea', required: true },
    { name: 'hours', label: 'Working hours', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'phone' },
    { name: 'color', label: 'Color', type: 'select', options: ['blue', 'teal', 'sand'] },
  ]

  const handleSubmit = (form: Record<string, any>) => {
    if (modal.mode === 'edit' && modal.data) {
      setData(data.map(r => r.id === modal.data.id ? { ...r, ...form } : r))
    } else {
      setData([...data, { id: Date.now(), ...form }])
    }
    setModal({ type: null, mode: 'add', data: null })
  }

  const columns: Column[] = [
    { header: 'Chamber', accessor: 'name', render: (v: string) => <strong>{v}</strong> },
    { header: 'Area', accessor: 'area' },
    { header: 'Hours', accessor: 'hours' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Status', accessor: 'color', render: (v: string) => <span className={`chamber-dot chamber-dot-${v}`}/> },
  ]

  return (
    <>
      <div className="chamber-grid-admin">
        {data.map(chamber => (
          <div className="admin-card chamber-card-admin" key={chamber.id}>
            <div className={`chamber-color-bar chamber-color-${chamber.color}`}/>
            <div className="chamber-card-body">
              <h4>{chamber.name}</h4>
              <p className="muted"><MapPin size={14}/> {chamber.area}</p>
              <p className="chamber-detail"><Clock size={14}/> {chamber.hours}</p>
              <p className="chamber-detail"><Phone size={14}/> {chamber.phone}</p>
              <div className="chamber-card-actions">
                <button className="btn btn-outline btn-admin btn-sm" onClick={() => setModal({ type: 'chamber', mode: 'edit', data: chamber })}><Edit size={14}/> Edit</button>
                <button className="btn btn-primary btn-admin btn-sm" onClick={() => setData(data.filter(r => r.id !== chamber.id))}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <FormModal isOpen={modal.type === 'chamber'} title={modal.mode === 'edit' ? 'Edit chamber' : 'Add chamber'} fields={fields} data={modal.data || {}} onSubmit={handleSubmit} onClose={() => setModal({ type: null, mode: 'add', data: null })}/>
    </>
  )
}

// ─── View: Products ───
function ProductsView({ data, setData, modal, setModal }: {
  data: any[]; setData: React.Dispatch<React.SetStateAction<any[]>>; modal: ModalState; setModal: React.Dispatch<React.SetStateAction<ModalState>>
}) {
  const fields: FormField[] = [
    { name: 'name', label: 'Product name', type: 'text', required: true },
    { name: 'category', label: 'Category', type: 'select', options: ['Skin care', 'Wellness', 'Gut health', 'Vitamins'] },
    { name: 'price', label: 'Price ($)', type: 'number', required: true },
    { name: 'stock', label: 'Stock', type: 'number' },
    { name: 'desc', label: 'Description', type: 'textarea', col: 'full' },
    { name: 'image', label: 'Image URL', type: 'text', col: 'full' },
  ]

  const handleSubmit = (form: Record<string, any>) => {
    if (modal.mode === 'edit' && modal.data) {
      setData(data.map(r => r.id === modal.data.id ? { ...r, ...form } : r))
    } else {
      setData([...data, { id: Date.now(), ...form, image: form.image || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=200&q=80' }])
    }
    setModal({ type: null, mode: 'add', data: null })
  }

  const columns: Column[] = [
    { header: 'Product', accessor: 'name', render: (v: string, row: any) => <div className="table-person"><img src={row.image} alt={v} className="table-thumb"/><div><strong>{v}</strong><small>{row.category}</small></div></div> },
    { header: 'Price', accessor: 'price', render: (v: number) => <strong>${v}.00</strong> },
    { header: 'Stock', accessor: 'stock', render: (v: number) => <StatusBadge status={v < 10 ? 'Low Stock' : 'In Stock'}/> },
    { header: 'Description', accessor: 'desc', className: 'col-description' },
  ]

  return (
    <>
      <DataTable columns={columns} data={data} searchKeys={['name', 'category']} onAdd={() => setModal({ type: 'product', mode: 'add', data: null })} onEdit={row => setModal({ type: 'product', mode: 'edit', data: row })} onDelete={row => setData(data.filter(r => r.id !== row.id))} addLabel="Add product"/>
      <FormModal isOpen={modal.type === 'product'} title={modal.mode === 'edit' ? 'Edit product' : 'Add product'} fields={fields} data={modal.data || {}} onSubmit={handleSubmit} onClose={() => setModal({ type: null, mode: 'add', data: null })}/>
    </>
  )
}

// ─── View: Inventory ───
function InventoryView({ data }: { data: any[] }) {
  const columns: Column[] = [
    { header: 'Product', accessor: 'product' },
    { header: 'SKU', accessor: 'sku' },
    { header: 'Stock', accessor: 'stock', render: (v: number) => <strong>{v}</strong> },
    { header: 'Reorder point', accessor: 'reorder' },
    { header: 'Status', accessor: 'status', render: (v: string) => <StatusBadge status={v}/> },
  ]
  return <DataTable columns={columns} data={data} searchKeys={['product', 'sku']} addLabel="Add inventory item"/>
}

// ─── View: Orders ───
function OrdersView({ data, setData }: { data: any[]; setData: React.Dispatch<React.SetStateAction<any[]>> }) {
  const columns: Column[] = [
    { header: 'Order ID', accessor: 'id', render: (v: string) => <strong className="order-id">{v}</strong> },
    { header: 'Customer', accessor: 'customer', render: (v: string) => <div className="table-person"><Avatar name={v}/><div><strong>{v}</strong></div></div> },
    { header: 'Items', accessor: 'items' },
    { header: 'Total', accessor: 'total', render: (v: number) => <strong>${v}.00</strong> },
    { header: 'Date', accessor: 'date' },
    { header: 'Status', accessor: 'status', render: (v: string) => <StatusBadge status={v}/> },
  ]
  return <DataTable columns={columns} data={data} searchKeys={['id', 'customer']} onDelete={row => setData(data.filter(r => r.id !== row.id))} addLabel="Add order"/>
}

// ─── View: Customers ───
function CustomersView() {
  const customers = useMemo(() => initialPatients.map(p => ({ ...p, orders: Math.floor(Math.random() * 10) + 1, spent: Math.floor(Math.random() * 500) + 50 })), [])
  const columns: Column[] = [
    { header: 'Customer', accessor: 'name', render: (v: string) => <div className="table-person"><Avatar name={v}/><div><strong>{v}</strong><small>{v.toLowerCase().replace(' ', '.')}@example.com</small></div></div> },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Orders', accessor: 'orders', render: (v: number) => <strong>{v}</strong> },
    { header: 'Total spent', accessor: 'spent', render: (v: number) => <strong>${v}.00</strong> },
    { header: 'Status', accessor: 'status', render: (v: string) => <StatusBadge status={v}/> },
  ]
  return <DataTable columns={columns} data={customers} searchKeys={['name', 'phone', 'email']} addLabel="Add customer"/>
}

// ─── View: Services / CMS ───
function ServicesCMSView({ data, setData, modal, setModal }: {
  data: any[]; setData: React.Dispatch<React.SetStateAction<any[]>>; modal: ModalState; setModal: React.Dispatch<React.SetStateAction<ModalState>>
}) {
  const fields: FormField[] = [
    { name: 'name', label: 'Service name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', col: 'full' },
    { name: 'price', label: 'Price', type: 'text' },
    { name: 'duration', label: 'Duration', type: 'text' },
  ]

  const handleSubmit = (form: Record<string, any>) => {
    if (modal.mode === 'edit' && modal.data) {
      setData(data.map(r => r.id === modal.data.id ? { ...r, ...form } : r))
    } else {
      setData([...data, { id: Date.now(), ...form, icon: Heart }])
    }
    setModal({ type: null, mode: 'add', data: null })
  }

  const columns: Column[] = [
    { header: 'Service', accessor: 'name', render: (v: string) => <strong>{v}</strong> },
    { header: 'Description', accessor: 'description', className: 'col-description' },
    { header: 'Price', accessor: 'price' },
    { header: 'Duration', accessor: 'duration' },
  ]

  return (
    <>
      <div className="services-cms-grid">
        {data.map(service => (
          <div className="admin-card service-cms-card" key={service.id}>
            <div className="service-cms-header">
              <span className="service-cms-icon"><Heart size={20}/></span>
              <h4>{service.name}</h4>
            </div>
            <p className="muted">{service.description}</p>
            <div className="service-cms-meta">
              <span>{service.price}</span>
              <span>{service.duration}</span>
            </div>
            <div className="service-cms-actions">
              <button className="btn btn-outline btn-admin btn-sm" onClick={() => setModal({ type: 'service', mode: 'edit', data: service })}><Edit size={14}/> Edit</button>
              <button className="btn btn-primary btn-admin btn-sm" onClick={() => setData(data.filter(r => r.id !== service.id))}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <FormModal isOpen={modal.type === 'service'} title={modal.mode === 'edit' ? 'Edit service' : 'Add service'} fields={fields} data={modal.data || {}} onSubmit={handleSubmit} onClose={() => setModal({ type: null, mode: 'add', data: null })}/>
    </>
  )
}

// ─── View: Gallery ───
function GalleryView({ data, setData }: { data: any[]; setData: React.Dispatch<React.SetStateAction<any[]>> }) {
  const handleDelete = (id: number) => setData(data.filter(r => r.id !== id))
  return (
    <div className="admin-card">
      <div className="data-toolbar">
        <div className="search-box"><Search size={16}/><input placeholder="Search gallery..."/></div>
        <button className="btn btn-primary btn-admin btn-sm"><Upload size={15}/> Upload image</button>
      </div>
      <div className="gallery-grid">
        {data.map(item => (
          <div className="gallery-item" key={item.id}>
            <div className="gallery-image">
              <img src={item.url} alt={item.title} loading="lazy"/>
              <div className="gallery-overlay">
                <button className="icon-btn icon-btn-white" title="View"><Eye size={16}/></button>
                <button className="icon-btn icon-btn-white icon-btn-danger" title="Delete" onClick={() => handleDelete(item.id)}><Trash2 size={16}/></button>
              </div>
            </div>
            <div className="gallery-meta">
              <strong>{item.title}</strong>
              <span className="gallery-category">{item.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── View: Videos ───
function VideosView({ data, setData, modal, setModal }: {
  data: any[]; setData: React.Dispatch<React.SetStateAction<any[]>>; modal: ModalState; setModal: React.Dispatch<React.SetStateAction<ModalState>>
}) {
  const fields: FormField[] = [
    { name: 'title', label: 'Video title', type: 'text', required: true },
    { name: 'duration', label: 'Duration', type: 'text' },
    { name: 'views', label: 'Views', type: 'text' },
    { name: 'date', label: 'Date', type: 'text' },
  ]
  const handleSubmit = (form: Record<string, any>) => {
    if (modal.mode === 'edit' && modal.data) {
      setData(data.map(r => r.id === modal.data.id ? { ...r, ...form } : r))
    } else {
      setData([...data, { id: Date.now(), ...form }])
    }
    setModal({ type: null, mode: 'add', data: null })
  }
  const columns: Column[] = [
    { header: 'Title', accessor: 'title', render: (v: string) => <div className="table-person"><span className="play-icon-small"><Play size={14}/></span><div><strong>{v}</strong></div></div> },
    { header: 'Duration', accessor: 'duration' },
    { header: 'Views', accessor: 'views' },
    { header: 'Date', accessor: 'date' },
  ]
  return (
    <>
      <DataTable columns={columns} data={data} searchKeys={['title']} onAdd={() => setModal({ type: 'video', mode: 'add', data: null })} onEdit={row => setModal({ type: 'video', mode: 'edit', data: row })} onDelete={row => setData(data.filter(r => r.id !== row.id))} addLabel="Add video"/>
      <FormModal isOpen={modal.type === 'video'} title={modal.mode === 'edit' ? 'Edit video' : 'Add video'} fields={fields} data={modal.data || {}} onSubmit={handleSubmit} onClose={() => setModal({ type: null, mode: 'add', data: null })}/>
    </>
  )
}

// ─── View: Reviews ───
function ReviewsView({ data, setData }: { data: any[]; setData: React.Dispatch<React.SetStateAction<any[]>> }) {
  const toggleStatus = (id: number) => {
    setData(data.map(r => r.id === id ? { ...r, status: r.status === 'Published' ? 'Pending' : 'Published' } : r))
  }
  const columns: Column[] = [
    { header: 'Author', accessor: 'author', render: (v: string) => <div className="table-person"><Avatar name={v}/><div><strong>{v}</strong></div></div> },
    { header: 'Rating', accessor: 'rating', render: (v: number) => <span className="review-stars">{Array(v).fill('★').join('')}</span> },
    { header: 'Review', accessor: 'text', className: 'col-description' },
    { header: 'Date', accessor: 'date' },
    { header: 'Status', accessor: 'status', render: (v: string) => <StatusBadge status={v}/> },
    { header: 'Action', render: (v: any, row: any) => <button className="btn btn-outline btn-admin btn-sm" onClick={() => toggleStatus(row.id)}>{row.status === 'Published' ? 'Unpublish' : 'Publish'}</button> },
  ]
  return <DataTable columns={columns} data={data} searchKeys={['author', 'text']} addLabel="Add review"/>
}

// ─── View: Reports ───
function ReportsView() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const revenue = [4200, 3800, 5100, 4700, 6200, 7800]
  const max = Math.max(...revenue)
  return (
    <div className="admin-card">
      <div className="data-toolbar">
        <h3>Revenue Overview</h3>
        <button className="btn btn-outline btn-admin btn-sm"><Download size={15}/> Export</button>
      </div>
      <div className="chart-container">
        <div className="bar-chart">
          {months.map((m, i) => (
            <div className="bar-group" key={m}>
              <div className="bar-label">{m}</div>
              <div className="bar-wrapper">
                <div className="bar-fill" style={{ height: `${(revenue[i] / max) * 100}%` }}>
                  <span className="bar-value">${revenue[i] / 1000}k</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── View: Notifications ───
function NotificationsView({ data, setData }: { data: any[]; setData: React.Dispatch<React.SetStateAction<any[]>> }) {
  const toggleRead = (id: number) => {
    setData(data.map(n => n.id === id ? { ...n, read: !n.read } : n))
  }
  const deleteNotification = (id: number) => setData(data.filter(n => n.id !== id))
  return (
    <div className="admin-card">
      <div className="data-toolbar">
        <h3>Notifications</h3>
        <button className="btn btn-outline btn-admin btn-sm" onClick={() => setData(data.map(n => ({ ...n, read: true })))}>Mark all as read</button>
      </div>
      <div className="notification-list">
        {data.map(notif => (
          <div className={`notification-item ${notif.read ? 'read' : 'unread'}`} key={notif.id}>
            <div className="notification-icon">
              {notif.read ? <CheckCircle size={18}/> : <Bell size={18}/>}
            </div>
            <div className="notification-body">
              <strong>{notif.title}</strong>
              <p>{notif.message}</p>
              <span className="notification-time">{notif.time}</span>
            </div>
            <div className="notification-actions">
              {!notif.read && <button className="btn btn-ghost btn-admin btn-sm" onClick={() => toggleRead(notif.id)}>Mark read</button>}
              <button className="icon-btn" onClick={() => deleteNotification(notif.id)}><Trash2 size={15}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── View: Users & Roles ───
function UsersRolesView({ data, setData, modal, setModal }: {
  data: any[]; setData: React.Dispatch<React.SetStateAction<any[]>>; modal: ModalState; setModal: React.Dispatch<React.SetStateAction<ModalState>>
}) {
  const fields: FormField[] = [
    { name: 'name', label: 'Full name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'role', label: 'Role', type: 'select', options: ['Administrator', 'Doctor', 'Nurse', 'Receptionist'] },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
    { name: 'phone', label: 'Phone', type: 'phone' },
  ]
  const handleSubmit = (form: Record<string, any>) => {
    if (modal.mode === 'edit' && modal.data) {
      setData(data.map(r => r.id === modal.data.id ? { ...r, ...form } : r))
    } else {
      setData([...data, { id: Date.now(), ...form, lastActive: 'Just now' }])
    }
    setModal({ type: null, mode: 'add', data: null })
  }
  const columns: Column[] = [
    { header: 'User', accessor: 'name', render: (v: string) => <div className="table-person"><Avatar name={v}/><div><strong>{v}</strong><small>{v.toLowerCase().replace(' ', '.')}@clinic.com</small></div></div> },
    { header: 'Role', accessor: 'role' },
    { header: 'Status', accessor: 'status', render: (v: string) => <StatusBadge status={v}/> },
    { header: 'Last active', accessor: 'lastActive' },
  ]
  return (
    <>
      <DataTable columns={columns} data={data} searchKeys={['name', 'email']} onAdd={() => setModal({ type: 'user', mode: 'add', data: null })} onEdit={row => setModal({ type: 'user', mode: 'edit', data: row })} onDelete={row => setData(data.filter(r => r.id !== row.id))} addLabel="Add user"/>
      <FormModal isOpen={modal.type === 'user'} title={modal.mode === 'edit' ? 'Edit user' : 'Add user'} fields={fields} data={modal.data || {}} onSubmit={handleSubmit} onClose={() => setModal({ type: null, mode: 'add', data: null })}/>
    </>
  )
}

// ─── View: Settings ───
function SettingsView() {
  const [saved, setSaved] = useState(false)
  const fields: FormField[] = [
    { name: 'clinicName', label: 'Clinic name', type: 'text', col: 'full' },
    { name: 'address', label: 'Address', type: 'textarea', col: 'full' },
    { name: 'phone', label: 'Phone', type: 'phone' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'workingHours', label: 'Working hours', type: 'text' },
    { name: 'website', label: 'Website', type: 'text' },
  ]
  const [form, setForm] = useState<Record<string, string>>({
    clinicName: 'Dr. Ibrahim Clinic & Wellness',
    address: '12 Independence Avenue, Accra, Ghana',
    phone: '+233 30 290 4420',
    email: 'hello@dribrahim.clinic',
    workingHours: 'Mon–Fri · 08:00–17:00',
    website: 'https://dribrahim.clinic',
  })
  const handleSubmit = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }
  return (
    <div className="admin-card settings-card">
      <div className="settings-header">
        <h3>Clinic Settings</h3>
        <p className="muted">Manage your clinic configuration and preferences</p>
      </div>
      <div className="admin-form-grid">
        {fields.map(field => (
          <div key={field.name} className={`form-field form-field-${field.col || 'full'}`}>
            <label htmlFor={field.name}>{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea id={field.name} rows={3} value={form[field.name] || ''} onChange={e => setForm({ ...form, [field.name]: e.target.value })}/>
            ) : (
              <input id={field.name} type={field.type} value={form[field.name] || ''} onChange={e => setForm({ ...form, [field.name]: e.target.value })}/>
            )}
          </div>
        ))}
      </div>
      <div className="settings-footer">
        {saved && <span className="save-success"><CheckCircle size={16}/> Settings saved successfully!</span>}
        <button className="btn btn-primary btn-admin" onClick={handleSubmit}><Save size={15}/> Save changes</button>
      </div>
    </div>
  )
}

// ─── Layout: AdminSidebar ───
function AdminSidebar({ active, onNavigate }: { active: string; onNavigate: (p: string) => void }) {
  const menus = [
    ['Overview', ['Dashboard', 'Appointments', 'Calendar']],
    ['Care', ['Patients', 'Follow-ups', 'Chambers']],
    ['Commerce', ['Products', 'Inventory', 'Orders', 'Customers']],
    ['Content', ['Services / CMS', 'Gallery', 'Videos', 'Reviews']],
    ['System', ['Reports', 'Notifications', 'Users & roles', 'Settings']],
  ]
  const iconMap: Record<string, React.ReactNode> = {
    'Dashboard': <LayoutDashboard size={17}/>,
    'Appointments': <CalendarDays size={17}/>,
    'Calendar': <Calendar size={17}/>,
    'Patients': <UserRound size={17}/>,
    'Follow-ups': <Clock size={17}/>,
    'Chambers': <MapPin size={17}/>,
    'Products': <ShoppingBag size={17}/>,
    'Inventory': <Package size={17}/>,
    'Orders': <ShoppingBag size={17}/>,
    'Customers': <Users size={17}/>,
    'Services / CMS': <FileText size={17}/>,
    'Gallery': <ImageIcon size={17}/>,
    'Videos': <Play size={17}/>,
    'Reviews': <Star size={17}/>,
    'Reports': <BarChart3 size={17}/>,
    'Notifications': <Bell size={17}/>,
    'Users & roles': <Users size={17}/>,
    'Settings': <Settings size={17}/>,
  }
  const badgeMap: Record<string, number> = { 'Appointments': 4, 'Notifications': 3 }

  return (
    <aside className="admin-side">
      <button className="admin-brand" onClick={() => onNavigate('Home')}>
        <span className="brand-mark"><Activity size={18}/></span>
        <span>Dr. Ibrahim<small>ADMIN PORTAL</small></span>
      </button>
      <nav className="admin-side-nav">
        {menus.map(([label, items]) => (
          <div className="side-group" key={label}>
            <small>{label}</small>
            {items.map(item => (
              <button key={item} className={`side-link ${active === item ? 'active' : ''}`} onClick={() => onNavigate(item)}>
                {iconMap[item] || <ClipboardList size={17}/>}
                <span>{item}</span>
                {badgeMap[item] && <b>{badgeMap[item]}</b>}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <button className="back-site" onClick={() => onNavigate('Home')}>← Back to website</button>
    </aside>
  )
}

// ─── Layout: AdminHeader ───
function AdminHeader({ active, onNavigate }: { active: string; onNavigate: (p: string) => void }) {
  const [userOpen, setUserOpen] = useState(false)
  return (
    <div className="admin-top">
      <button className="admin-menu"><Menu size={20}/></button>
      <div className="crumb">Workspace <span>/</span> <strong>{active}</strong></div>
      <div className="admin-actions">
        <button className="icon-btn"><Search size={18}/></button>
        <button className="icon-btn notification"><Bell size={18}/><i/></button>
        <div className="admin-user" onClick={() => setUserOpen(!userOpen)}>
          <span>DI</span>
          <div><strong>Dr. Ibrahim</strong><small>Administrator</small></div>
          <ChevronDown size={15}/>
          {userOpen && (
            <div className="user-dropdown">
              <button><User size={15}/> Profile</button>
              <button><Settings size={15}/> Settings</button>
              <hr/>
              <button onClick={() => onNavigate('Home')}><Home size={15}/> Back to website</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main AdminPanel ───
export function AdminPanel({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [active, setActive] = useState('Dashboard')
  const [modal, setModal] = useState<ModalState>({ type: null, mode: 'add', data: null })
  const [patients, setPatients] = useState(initialPatients)
  const [appointments, setAppointments] = useState(initialAppointments)
  const [products, setProducts] = useState(initialProducts)
  const [chambers, setChambers] = useState(initialChambers)
  const [services, setServices] = useState(initialServices)
  const [users, setUsers] = useState(initialUsers)
  const [orders, setOrders] = useState(initialOrders)
  const [reviews, setReviews] = useState(initialReviews)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [gallery, setGallery] = useState(initialGallery)
  const [videos, setVideos] = useState(initialVideos)
  const [followUps, setFollowUps] = useState(initialFollowUps)
  const [inventory, setInventory] = useState(initialInventory)

  const renderView = () => {
    switch (active) {
      case 'Dashboard': return <DashboardView appointments={appointments} patients={patients} onNavigate={setActive}/>
      case 'Appointments': return <AppointmentsView data={appointments} setData={setAppointments} modal={modal} setModal={setModal}/>
      case 'Calendar': return <CalendarView/>
      case 'Patients': return <PatientsView data={patients} setData={setPatients} modal={modal} setModal={setModal}/>
      case 'Follow-ups': return <FollowUpsView data={followUps}/>
      case 'Chambers': return <ChambersView data={chambers} setData={setChambers} modal={modal} setModal={setModal}/>
      case 'Products': return <ProductsView data={products} setData={setProducts} modal={modal} setModal={setModal}/>
      case 'Inventory': return <InventoryView data={inventory}/>
      case 'Orders': return <OrdersView data={orders} setData={setOrders}/>
      case 'Customers': return <CustomersView/>
      case 'Services / CMS': return <ServicesCMSView data={services} setData={setServices} modal={modal} setModal={setModal}/>
      case 'Gallery': return <GalleryView data={gallery} setData={setGallery}/>
      case 'Videos': return <VideosView data={videos} setData={setVideos} modal={modal} setModal={setModal}/>
      case 'Reviews': return <ReviewsView data={reviews} setData={setReviews}/>
      case 'Reports': return <ReportsView/>
      case 'Notifications': return <NotificationsView data={notifications} setData={setNotifications}/>
      case 'Users & roles': return <UsersRolesView data={users} setData={setUsers} modal={modal} setModal={setModal}/>
      case 'Settings': return <SettingsView/>
      default: return <DashboardView appointments={appointments} patients={patients} onNavigate={setActive}/>
    }
  }

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="admin-app">
      <AdminSidebar active={active} onNavigate={setActive}/>
      <main className="admin-main">
        <AdminHeader active={active} onNavigate={setActive}/>
        <div className="admin-content">
          <div className="admin-title">
            <div>
              <span className="pill">{dateStr}</span>
              <h1>{active === 'Dashboard' ? 'Good morning, Dr. Ibrahim.' : active}</h1>
              <p className="muted">Here&apos;s what&apos;s happening at the clinic today.</p>
            </div>
            {active !== 'Dashboard' && (
              <div className="admin-actions-right">
                <button className="btn btn-outline btn-admin"><Filter size={15}/> Filters</button>
                <button className="btn btn-primary btn-admin"><Plus size={15}/> New</button>
              </div>
            )}
          </div>
          <div className="admin-body">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  )
}
