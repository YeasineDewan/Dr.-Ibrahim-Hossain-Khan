'use client'
import { useState, useMemo } from 'react'
import {
  Plus, Search, Filter, MoreHorizontal, ChevronDown, ChevronRight, X, CalendarDays, Clock, MapPin, Video, Phone, User, Stethoscope, FileText, Trash2, Edit3, Eye, CheckCircle2, AlertCircle, Download, Copy
} from 'lucide-react'
import { Avatar, Drawer, Field, Input, Modal, Pill, Select, Textarea, EmptyState } from '../admin-ui'
import type { AdminData, Appointment, Patient } from '../../lib/admin-data'

const formatBn = (n: number) => '৳' + n.toLocaleString('en-IN')

export function AppointmentsView({ data, copy, onLog, toast }: { data: AdminData; copy: any; onLog: (u: string, a: string, t: string) => void; toast: any }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [chamberFilter, setChamberFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Appointment | null>(null)
  const [viewing, setViewing] = useState<Appointment | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Appointment | null>(null)

  const filtered = useMemo(() => {
    return data.appointments.filter(a => {
      if (search && !`${a.patient} ${a.service} ${a.id} ${a.chamber}`.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter !== 'All' && a.status !== statusFilter) return false
      if (chamberFilter !== 'All' && a.chamber !== chamberFilter) return false
      if (dateFilter === 'Today' && a.date !== '2026-06-18') return false
      if (dateFilter === 'Upcoming' && a.date < '2026-06-18') return false
      if (dateFilter === 'Past' && a.date > '2026-06-18') return false
      return true
    })
  }, [data.appointments, search, statusFilter, chamberFilter, dateFilter])

  const onSave = (a: Appointment) => {
    data.addAppointment(a)
    onLog('Dr. Ibrahim', editing ? 'updated' : 'created', `Appointment ${a.id || ''}`)
    toast.show(copy.saved, 'success')
    setShowForm(false); setEditing(null)
  }
  const onDelete = (a: Appointment) => {
    data.removeAppointment(a.id)
    onLog('Dr. Ibrahim', 'deleted', `Appointment ${a.id}`)
    toast.show(copy.deleted, 'error')
    setConfirmDelete(null)
  }
  const onStatusChange = (a: Appointment, status: Appointment['status']) => {
    data.addAppointment({ ...a, status })
    onLog('Dr. Ibrahim', 'updated', `Appointment ${a.id} → ${status}`)
    toast.show(`${a.id} → ${status}`, 'info')
  }

  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">CARE MANAGEMENT</span>
          <h1>Appointments</h1>
          <p className="muted-light">{data.appointments.length} total · {data.appointments.filter(a => a.date === '2026-06-18').length} today · {data.appointments.filter(a => a.status === 'Pending').length} pending</p>
        </div>
        <div className="adm-head-actions">
          <button className="pro-outline" onClick={() => toast.show('Export queued', 'info')}><Download size={14}/> {copy.export}</button>
          <button className="pro-primary" onClick={() => { setEditing(null); setShowForm(true) }}><Plus size={14}/> {copy.apptNew}</button>
        </div>
      </section>

      <section className="pro-panel adm-toolbar">
        <div className="adm-filters">
          <div className="pro-search grow"><Search size={15}/><input placeholder="Search by patient, service, ID..." value={search} onChange={e => setSearch(e.target.value)}/></div>
          <Select value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
            <option>All</option><option>Today</option><option>Upcoming</option><option>Past</option>
          </Select>
          <Select value={chamberFilter} onChange={e => setChamberFilter(e.target.value)}>
            <option>All</option>{copy.chambers.map((c: string) => <option key={c}>{c}</option>)}
          </Select>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option>All</option>{copy.statuses.map((s: string) => <option key={s}>{s}</option>)}
          </Select>
          <button className="pro-outline" onClick={() => { setSearch(''); setStatusFilter('All'); setChamberFilter('All'); setDateFilter('All') }}><X size={14}/> {copy.reset}</button>
        </div>
      </section>

      <section className="pro-panel">
        {filtered.length === 0 ? <EmptyState title="No appointments found" body="Try adjusting filters or add a new appointment." action={<button className="pro-primary" onClick={() => setShowForm(true)}><Plus size={14}/> {copy.apptNew}</button>} /> : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th><input type="checkbox"/></th>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Service</th>
                  <th>Date & time</th>
                  <th>Chamber</th>
                  <th>Type</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th/>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a.id} style={{ animationDelay: `${i * 30}ms` }}>
                    <td><input type="checkbox"/></td>
                    <td><span className="adm-code">{a.id}</span></td>
                    <td>
                      <div className="adm-cell-person">
                        <Avatar name={a.patient} size={28}/>
                        <div>
                          <strong>{a.patient}</strong>
                          <small>Dr. Ibrahim</small>
                        </div>
                      </div>
                    </td>
                    <td>{a.service}</td>
                    <td>
                      <div className="adm-date-cell">
                        <strong>{a.date}</strong>
                        <small><Clock size={11}/> {a.time} · {a.duration}</small>
                      </div>
                    </td>
                    <td><Pill tone="blue">{a.chamber}</Pill></td>
                    <td>
                      <span className="adm-type">
                        {a.type === 'Video' ? <Video size={12}/> : a.type === 'Phone' ? <Phone size={12}/> : <MapPin size={12}/>}
                        {a.type}
                      </span>
                    </td>
                    <td><strong>{formatBn(a.fee)}</strong></td>
                    <td>
                      <Select value={a.status} onChange={e => onStatusChange(a, e.target.value as any)} className={`adm-status-select adm-status-${a.status.toLowerCase()}`}>
                        {copy.statuses.map((s: string) => <option key={s}>{s}</option>)}
                      </Select>
                    </td>
                    <td>
                      <div className="adm-row-actions">
                        <button title="View" onClick={() => setViewing(a)}><Eye size={15}/></button>
                        <button title="Edit" onClick={() => { setEditing(a); setShowForm(true) }}><Edit3 size={15}/></button>
                        <button title="Delete" onClick={() => setConfirmDelete(a)} className="danger"><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="adm-table-foot">
          <small>Showing {filtered.length} of {data.appointments.length}</small>
          <div className="adm-pager">
            <button>‹</button><button className="on">1</button><button>2</button><button>3</button><button>›</button>
          </div>
        </div>
      </section>

      {showForm && <AppointmentForm initial={editing} onClose={() => { setShowForm(false); setEditing(null) }} onSave={onSave} copy={copy} data={data} />}
      {viewing && <AppointmentDetail appt={viewing} onClose={() => setViewing(null)} copy={copy} data={data} />}
      {confirmDelete && (
        <Modal open onClose={() => setConfirmDelete(null)} title="Delete appointment?" footer={
          <>
            <button className="pro-outline" onClick={() => setConfirmDelete(null)}>{copy.cancel}</button>
            <button className="pro-danger" onClick={() => onDelete(confirmDelete)}><Trash2 size={14}/> {copy.delete}</button>
          </>
        }>
          <p>This will permanently remove <strong>{confirmDelete.id}</strong> for <strong>{confirmDelete.patient}</strong>.</p>
        </Modal>
      )}
    </>
  )
}

function AppointmentForm({ initial, onClose, onSave, copy, data }: { initial: Appointment | null; onClose: () => void; onSave: (a: Appointment) => void; copy: any; data: AdminData }) {
  const [a, setA] = useState<Appointment>(initial || {
    id: `APT-${String(data.appointments.length + 100).padStart(3, '0')}`,
    patient: data.patients[0]?.name || '',
    doctor: 'Dr. Ibrahim',
    service: copy.services[0],
    chamber: copy.chambers[0],
    date: '2026-06-18',
    time: '09:00',
    duration: copy.durations[1],
    type: 'In-person',
    status: 'Pending',
    fee: 4500,
    notes: '',
  })
  return (
    <Drawer open onClose={onClose} title={initial ? `Edit ${initial.id}` : copy.apptNew} width={620}>
      <form className="adm-form" onSubmit={e => { e.preventDefault(); onSave(a) }}>
        <div className="adm-form-grid">
          <Field label={copy.apptPatient} required>
            <Select value={a.patient} onChange={e => setA({ ...a, patient: e.target.value })}>
              {data.patients.map(p => <option key={p.id}>{p.name}</option>)}
            </Select>
          </Field>
          <Field label={copy.apptDoctor} required>
            <Input value={a.doctor} onChange={e => setA({ ...a, doctor: e.target.value })}/>
          </Field>
          <Field label={copy.apptService} required>
            <Select value={a.service} onChange={e => setA({ ...a, service: e.target.value })}>
              {copy.services.map((s: string) => <option key={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label={copy.apptType}>
            <Select value={a.type} onChange={e => setA({ ...a, type: e.target.value as any })}>
              {copy.appointmentTypes.map((t: string) => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label={copy.apptDate} required>
            <Input type="date" value={a.date} onChange={e => setA({ ...a, date: e.target.value })}/>
          </Field>
          <Field label={copy.apptTime} required>
            <Input type="time" value={a.time} onChange={e => setA({ ...a, time: e.target.value })}/>
          </Field>
          <Field label={copy.apptChamber}>
            <Select value={a.chamber} onChange={e => setA({ ...a, chamber: e.target.value })}>
              {copy.chambers.map((c: string) => <option key={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label={copy.apptDuration}>
            <Select value={a.duration} onChange={e => setA({ ...a, duration: e.target.value })}>
              {copy.durations.map((d: string) => <option key={d}>{d}</option>)}
            </Select>
          </Field>
          <Field label={copy.apptStatus}>
            <Select value={a.status} onChange={e => setA({ ...a, status: e.target.value as any })}>
              {copy.statuses.map((s: string) => <option key={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label={copy.apptFee}>
            <Input type="number" value={a.fee} onChange={e => setA({ ...a, fee: Number(e.target.value) })}/>
          </Field>
        </div>
        <Field label={copy.apptNotes}>
          <Textarea rows={4} value={a.notes} onChange={e => setA({ ...a, notes: e.target.value })} placeholder="Add any context for this appointment…"/>
        </Field>
        <div className="adm-form-foot">
          <button type="button" className="pro-outline" onClick={onClose}>{copy.cancel}</button>
          <button type="submit" className="pro-primary"><CheckCircle2 size={14}/> {copy.save}</button>
        </div>
      </form>
    </Drawer>
  )
}

function AppointmentDetail({ appt, onClose, copy, data }: { appt: Appointment; onClose: () => void; copy: any; data: AdminData }) {
  const patient = data.patients.find(p => p.name === appt.patient)
  return (
    <Drawer open onClose={onClose} title={appt.id} width={620}>
      <div className="adm-detail">
        <div className="adm-detail-hero">
          <Avatar name={appt.patient} size={56}/>
          <div>
            <h3>{appt.patient}</h3>
            <p className="muted-light">{appt.service} · {appt.duration}</p>
            <Pill tone={appt.status === 'Confirmed' ? 'teal' : appt.status === 'Pending' ? 'sand' : 'blue'}>{appt.status}</Pill>
          </div>
        </div>

        <div className="adm-detail-grid">
          <div><CalendarDays size={14}/> <span>Date & time</span><strong>{appt.date} · {appt.time}</strong></div>
          <div><MapPin size={14}/> <span>Chamber</span><strong>{appt.chamber}</strong></div>
          <div><Stethoscope size={14}/> <span>Doctor</span><strong>{appt.doctor}</strong></div>
          <div><User size={14}/> <span>Type</span><strong>{appt.type}</strong></div>
          <div><FileText size={14}/> <span>Fee</span><strong>{formatBn(appt.fee)}</strong></div>
          <div><Clock size={14}/> <span>Duration</span><strong>{appt.duration}</strong></div>
        </div>

        {patient && (
          <div className="adm-detail-section">
            <h4>Patient details</h4>
            <div className="adm-detail-grid">
              <div><span>Patient ID</span><strong>{patient.id}</strong></div>
              <div><span>Phone</span><strong>{patient.phone}</strong></div>
              <div><span>Email</span><strong>{patient.email}</strong></div>
              <div><span>Blood group</span><strong>{patient.bloodGroup}</strong></div>
            </div>
          </div>
        )}

        <div className="adm-detail-section">
          <h4>Timeline</h4>
          <ul className="adm-timeline-list">
            <li><span className="adm-timeline-dot"/><div><strong>Appointment booked</strong><small>just now · via admin</small></div></li>
            <li><span className="adm-timeline-dot"/><div><strong>Confirmation sent</strong><small>SMS sent to patient</small></div></li>
            <li><span className="adm-timeline-dot"/><div><strong>Status set to {appt.status}</strong><small>{appt.date}</small></div></li>
          </ul>
        </div>

        {appt.notes && (
          <div className="adm-detail-section">
            <h4>Notes</h4>
            <p>{appt.notes}</p>
          </div>
        )}

        <div className="adm-form-foot">
          <button className="pro-outline" onClick={onClose}>{copy.close}</button>
          <button className="pro-primary" onClick={() => { navigator.clipboard?.writeText(appt.id); toast_show(copy.saved) }}><Copy size={14}/> Copy ID</button>
        </div>
      </div>
    </Drawer>
  )
}

const toast_show = (_m: string) => {}

// ────────────────────────────────────────────────────────────
// CALENDAR
// ────────────────────────────────────────────────────────────
export function CalendarView({ data, copy, onNavigate }: { data: AdminData; copy: any; onNavigate: (s: string) => void }) {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week')
  const [anchor, setAnchor] = useState(new Date('2026-06-18'))
  const [selected, setSelected] = useState<Appointment | null>(null)

  const events = data.appointments
  const eventsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {}
    events.forEach(e => { (map[e.date] = map[e.date] || []).push(e) })
    return map
  }, [events])

  const dayLabel = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })

  const weekDates = useMemo(() => {
    const start = new Date(anchor)
    const day = start.getDay() || 7
    start.setDate(start.getDate() - day + 1)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i); return d
    })
  }, [anchor])

  const monthDates = useMemo(() => {
    const y = anchor.getFullYear(), m = anchor.getMonth()
    const first = new Date(y, m, 1)
    const startDay = (first.getDay() || 7) - 1
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(y, m, 1 - startDay + i); return d
    })
  }, [anchor])

  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">CALENDAR</span>
          <h1>{anchor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h1>
          <p className="muted-light">{events.length} appointments this period</p>
        </div>
        <div className="adm-head-actions">
          <div className="adm-segmented">
            <button className={view === 'day' ? 'on' : ''} onClick={() => setView('day')}>{copy.calDay}</button>
            <button className={view === 'week' ? 'on' : ''} onClick={() => setView('week')}>{copy.calWeek}</button>
            <button className={view === 'month' ? 'on' : ''} onClick={() => setView('month')}>{copy.calMonth}</button>
          </div>
          <button className="pro-outline" onClick={() => { const d = new Date(anchor); d.setDate(d.getDate() - (view === 'month' ? 30 : 7)); setAnchor(d) }}>‹</button>
          <button className="pro-outline" onClick={() => setAnchor(new Date('2026-06-18'))}>{copy.calToday}</button>
          <button className="pro-outline" onClick={() => { const d = new Date(anchor); d.setDate(d.getDate() + (view === 'month' ? 30 : 7)); setAnchor(d) }}>›</button>
        </div>
      </section>

      <section className="pro-panel">
        {view === 'week' && (
          <div className="cal-week">
            <div className="cal-time-col">{Array.from({ length: 10 }, (_, i) => <div key={i} className="cal-time">{8 + i}:00</div>)}</div>
            {weekDates.map(d => (
              <div key={d.toISOString()} className={`cal-day ${fmt(d) === '2026-06-18' ? 'today' : ''}`}>
                <div className="cal-day-head">{dayLabel(d)}</div>
                <div className="cal-day-body">
                  {Array.from({ length: 10 }, (_, i) => <div key={i} className="cal-slot"/>)}
                  {(eventsByDate[fmt(d)] || []).map(a => {
                    const [h, m] = a.time.split(':').map(Number)
                    const top = ((h - 8) * 60 + m) / 60 * 56
                    return (
                      <button key={a.id} className={`cal-event tone-${a.status === 'Confirmed' ? 'teal' : a.status === 'Pending' ? 'sand' : 'blue'}`} style={{ top: `${top}px` }} onClick={() => setSelected(a)}>
                        <strong>{a.time}</strong>
                        <span>{a.patient}</span>
                        <small>{a.service}</small>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        {view === 'month' && (
          <div className="cal-month">
            {copy.weekDays.map((d: string) => <div key={d} className="cal-month-head">{d}</div>)}
            {monthDates.map((d, i) => {
              const inMonth = d.getMonth() === anchor.getMonth()
              const today = fmt(d) === '2026-06-18'
              const dayEvents = eventsByDate[fmt(d)] || []
              return (
                <button key={i} className={`cal-month-cell ${inMonth ? '' : 'out'} ${today ? 'today' : ''}`} onClick={() => setAnchor(d)}>
                  <span className="cal-month-num">{d.getDate()}</span>
                  {dayEvents.slice(0, 3).map(e => <span key={e.id} className={`cal-month-pill tone-${e.status === 'Confirmed' ? 'teal' : e.status === 'Pending' ? 'sand' : 'blue'}`}>{e.time} {e.patient}</span>)}
                  {dayEvents.length > 3 && <small>+{dayEvents.length - 3} more</small>}
                </button>
              )
            })}
          </div>
        )}
        {view === 'day' && (
          <div className="cal-day-view">
            <div className="cal-day-banner">
              <h2>{anchor.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
              <Pill tone="teal">{(eventsByDate[fmt(anchor)] || []).length} appointments</Pill>
            </div>
            <ul className="adm-day-events">
              {(eventsByDate[fmt(anchor)] || []).sort((a, b) => a.time.localeCompare(b.time)).map(a => (
                <li key={a.id} onClick={() => setSelected(a)}>
                  <span className="cal-time-tag">{a.time}</span>
                  <Avatar name={a.patient} size={36}/>
                  <div className="grow">
                    <strong>{a.patient}</strong>
                    <small>{a.service} · {a.chamber} · {a.duration}</small>
                  </div>
                  <Pill tone={a.status === 'Confirmed' ? 'teal' : a.status === 'Pending' ? 'sand' : 'blue'}>{a.status}</Pill>
                </li>
              ))}
              {(eventsByDate[fmt(anchor)] || []).length === 0 && <EmptyState title="No appointments" body="Nothing scheduled for this day."/>}
            </ul>
          </div>
        )}
      </section>

      {selected && <AppointmentDetail appt={selected} onClose={() => setSelected(null)} copy={copy} data={data}/>}
    </>
  )
}

// ────────────────────────────────────────────────────────────
// FOLLOW UPS
// ────────────────────────────────────────────────────────────
export function FollowUpsView({ data, copy, onLog, toast }: { data: AdminData; copy: any; onLog: (u: string, a: string, t: string) => void; toast: any }) {
  const [tab, setTab] = useState<'Upcoming' | 'Overdue' | 'Completed'>('Upcoming')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const list = data.followUps.filter((f: any) => f.status === tab)

  const onSave = (f: any) => {
    data.addFollowUp(f)
    onLog('Dr. Ibrahim', editing ? 'updated' : 'created', `Follow-up ${f.id || ''}`)
    toast.show(copy.saved)
    setShowForm(false); setEditing(null)
  }

  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">CARE MANAGEMENT</span>
          <h1>Follow-ups</h1>
          <p className="muted-light">{data.followUps.filter(f => f.status === 'Overdue').length} overdue · {data.followUps.filter(f => f.status === 'Upcoming').length} upcoming</p>
        </div>
        <div className="adm-head-actions">
          <button className="pro-primary" onClick={() => { setEditing(null); setShowForm(true) }}><Plus size={14}/> Add follow-up</button>
        </div>
      </section>

      <div className="adm-stat-grid adm-stagger">
        <div className="adm-stat-card coral">
          <strong>{data.followUps.filter(f => f.status === 'Overdue').length}</strong>
          <small>Overdue</small>
        </div>
        <div className="adm-stat-card teal">
          <strong>{data.followUps.filter(f => f.status === 'Upcoming').length}</strong>
          <small>Upcoming this week</small>
        </div>
        <div className="adm-stat-card blue">
          <strong>{data.followUps.filter(f => f.status === 'Completed').length}</strong>
          <small>Completed</small>
        </div>
        <div className="adm-stat-card gold">
          <strong>{data.followUps.filter(f => f.priority === 'High').length}</strong>
          <small>High priority</small>
        </div>
      </div>

      <section className="pro-panel">
        <div className="adm-tabs">
          {(['Upcoming', 'Overdue', 'Completed'] as const).map(t => (
            <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}<span>{data.followUps.filter((f: any) => f.status === t).length}</span></button>
          ))}
        </div>
        {list.length === 0 ? <EmptyState title={`No ${tab.toLowerCase()} follow-ups`}/> : (
          <ul className="adm-task-list">
            {list.map((f: any) => (
              <li key={f.id}>
                <span className={`task-prio ${f.priority.toLowerCase()}`}/>
                <Avatar name={f.patient}/>
                <div className="grow">
                  <strong>{f.patient}</strong>
                  <small>{f.reason} · due {f.dueDate}</small>
                </div>
                <Pill tone={f.priority === 'High' ? 'coral' : f.priority === 'Medium' ? 'gold' : 'blue'}>{f.priority}</Pill>
                <Pill tone={f.status === 'Overdue' ? 'coral' : f.status === 'Completed' ? 'teal' : 'sand'}>{f.status}</Pill>
                <div className="adm-row-actions">
                  <button onClick={() => { setEditing(f); setShowForm(true) }}><Edit3 size={14}/></button>
                  <button onClick={() => { data.addFollowUp({ ...f, status: f.status === 'Completed' ? 'Upcoming' : 'Completed' }); toast.show(`${f.patient} → ${f.status === 'Completed' ? 'Upcoming' : 'Completed'}`) }}><CheckCircle2 size={14}/></button>
                  <button className="danger" onClick={() => { data.removeFollowUp(f.id); toast.show(copy.deleted, 'error') }}><Trash2 size={14}/></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showForm && (
        <Drawer open onClose={() => { setShowForm(false); setEditing(null) }} title={editing ? 'Edit follow-up' : 'Add follow-up'} width={520}>
          <FollowUpForm initial={editing} copy={copy} data={data} onSave={onSave} onClose={() => { setShowForm(false); setEditing(null) }}/>
        </Drawer>
      )}
    </>
  )
}

function FollowUpForm({ initial, copy, data, onSave, onClose }: { initial: any; copy: any; data: AdminData; onSave: (f: any) => void; onClose: () => void }) {
  const [f, setF] = useState(initial || { id: `FU-${String(data.followUps.length + 100).padStart(3, '0')}`, patient: data.patients[0].name, reason: '', dueDate: '2026-06-25', status: 'Upcoming', priority: 'Medium', assignedTo: 'Dr. Ibrahim' })
  return (
    <form className="adm-form" onSubmit={e => { e.preventDefault(); onSave(f) }}>
      <Field label="Patient" required><Select value={f.patient} onChange={e => setF({ ...f, patient: e.target.value })}>{data.patients.map(p => <option key={p.id}>{p.name}</option>)}</Select></Field>
      <Field label="Reason" required><Input value={f.reason} onChange={e => setF({ ...f, reason: e.target.value })}/></Field>
      <div className="adm-form-grid">
        <Field label="Due date" required><Input type="date" value={f.dueDate} onChange={e => setF({ ...f, dueDate: e.target.value })}/></Field>
        <Field label="Priority"><Select value={f.priority} onChange={e => setF({ ...f, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></Select></Field>
        <Field label="Status"><Select value={f.status} onChange={e => setF({ ...f, status: e.target.value })}><option>Upcoming</option><option>Overdue</option><option>Completed</option></Select></Field>
        <Field label="Assigned to"><Input value={f.assignedTo} onChange={e => setF({ ...f, assignedTo: e.target.value })}/></Field>
      </div>
      <div className="adm-form-foot"><button type="button" className="pro-outline" onClick={onClose}>{copy.cancel}</button><button type="submit" className="pro-primary">{copy.save}</button></div>
    </form>
  )
}

// ────────────────────────────────────────────────────────────
// CHAMBERS
// ────────────────────────────────────────────────────────────
export function ChambersView({ data, copy, onLog, toast }: { data: AdminData; copy: any; onLog: any; toast: any }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [viewing, setViewing] = useState<any>(null)
  const onSave = (c: any) => { data.addChamber(c); onLog('Dr. Ibrahim', 'updated', `Chamber ${c.name}`); toast.show(copy.saved); setShowForm(false); setEditing(null) }

  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">CARE MANAGEMENT</span>
          <h1>Chambers</h1>
          <p className="muted-light">{data.chambers.length} active chambers across the city</p>
        </div>
        <div className="adm-head-actions">
          <button className="pro-primary" onClick={() => { setEditing(null); setShowForm(true) }}><Plus size={14}/> Add chamber</button>
        </div>
      </section>

      <div className="chamber-cards-grid adm-stagger">
        {data.chambers.map((c: any) => (
          <article key={c.id} className="chamber-card" onClick={() => setViewing(c)}>
            <div className="chamber-card-top">
              <span className="chamber-card-num">0{data.chambers.indexOf(c) + 1}</span>
              <Pill tone={c.status === 'Active' ? 'teal' : 'coral'}>{c.status}</Pill>
            </div>
            <h3>{c.name}</h3>
            <strong>{c.place}</strong>
            <p>{c.address}</p>
            <div className="chamber-meta">
              <div><Clock size={13}/> {c.hours}</div>
              <div><Phone size={13}/> {c.phone}</div>
              <div><Users size={13}/> Capacity · {c.capacity}</div>
            </div>
            <div className="chamber-card-foot">
              <button className="pro-text-link" onClick={(e) => { e.stopPropagation(); setEditing(c); setShowForm(true) }}><Edit3 size={13}/> Edit</button>
              <button className="pro-text-link" onClick={(e) => { e.stopPropagation(); setViewing(c) }}>View schedule <ChevronRight size={13}/></button>
            </div>
          </article>
        ))}
      </div>

      {showForm && (
        <Drawer open onClose={() => { setShowForm(false); setEditing(null) }} title={editing ? `Edit ${editing.name}` : 'Add chamber'} width={560}>
          <ChamberForm initial={editing} onSave={onSave} onClose={() => { setShowForm(false); setEditing(null) }} copy={copy}/>
        </Drawer>
      )}
      {viewing && (
        <Drawer open onClose={() => setViewing(null)} title={viewing.name} width={560}>
          <div className="adm-detail">
            <h3>{viewing.place}</h3>
            <p className="muted-light">{viewing.address}</p>
            <div className="adm-detail-grid">
              <div><Clock size={14}/><span>Hours</span><strong>{viewing.hours}</strong></div>
              <div><Phone size={14}/><span>Phone</span><strong>{viewing.phone}</strong></div>
              <div><Users size={14}/><span>Capacity</span><strong>{viewing.capacity}</strong></div>
              <div><span>Status</span><strong>{viewing.status}</strong></div>
            </div>
            <h4 style={{ marginTop: 24 }}>Today's appointments</h4>
            <ul className="adm-day-events">
              {data.appointments.filter((a: any) => a.chamber === viewing.name && a.date === '2026-06-18').map((a: any) => (
                <li key={a.id}><span className="cal-time-tag">{a.time}</span><Avatar name={a.patient} size={28}/><div className="grow"><strong>{a.patient}</strong><small>{a.service}</small></div><Pill tone={a.status === 'Confirmed' ? 'teal' : 'sand'}>{a.status}</Pill></li>
              ))}
            </ul>
          </div>
        </Drawer>
      )}
    </>
  )
}

function ChamberForm({ initial, onSave, onClose, copy }: { initial: any; onSave: (c: any) => void; onClose: () => void; copy: any }) {
  const [c, setC] = useState(initial || { id: `CH-${data_chambers_id()}`, name: '', place: '', address: '', hours: '', phone: '', status: 'Active', capacity: 20 })
  return (
    <form className="adm-form" onSubmit={e => { e.preventDefault(); onSave(c) }}>
      <div className="adm-form-grid">
        <Field label="Name" required><Input value={c.name} onChange={e => setC({ ...c, name: e.target.value })}/></Field>
        <Field label="Place" required><Input value={c.place} onChange={e => setC({ ...c, place: e.target.value })}/></Field>
      </div>
      <Field label="Address" required><Textarea rows={2} value={c.address} onChange={e => setC({ ...c, address: e.target.value })}/></Field>
      <div className="adm-form-grid">
        <Field label="Hours" required><Input value={c.hours} onChange={e => setC({ ...c, hours: e.target.value })} placeholder="9:00 AM – 2:00 PM"/></Field>
        <Field label="Phone"><Input value={c.phone} onChange={e => setC({ ...c, phone: e.target.value })}/></Field>
        <Field label="Capacity"><Input type="number" value={c.capacity} onChange={e => setC({ ...c, capacity: Number(e.target.value) })}/></Field>
        <Field label="Status"><Select value={c.status} onChange={e => setC({ ...c, status: e.target.value })}><option>Active</option><option>Closed</option></Select></Field>
      </div>
      <div className="adm-form-foot"><button type="button" className="pro-outline" onClick={onClose}>{copy.cancel}</button><button type="submit" className="pro-primary">{copy.save}</button></div>
    </form>
  )
}

let _cid = 4
const data_chambers_id = () => `CH-${_cid++}`
