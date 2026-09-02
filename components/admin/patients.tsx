'use client'
import { useState, useMemo } from 'react'
import {
  Plus, Search, Filter, MoreHorizontal, ChevronRight, X, Mail, Phone, MapPin, Calendar, Heart, Pill as PillIcon, FileText, Activity, Stethoscope, Edit3, Trash2, Eye, User, Download, Upload, Save, AlertCircle, ChevronLeft
} from 'lucide-react'
import { Avatar, Drawer, Field, Input, Modal, Pill, Select, Textarea, EmptyState } from '../admin-ui'
import type { AdminData, Patient } from '../../lib/admin-data'

export function PatientsView({ data, copy, onLog, toast }: { data: AdminData; copy: any; onLog: any; toast: any }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Patient | null>(null)
  const [viewing, setViewing] = useState<Patient | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Patient | null>(null)

  const filtered = useMemo(() => {
    return data.patients.filter(p => {
      if (search && !`${p.name} ${p.id} ${p.phone} ${p.email}`.toLowerCase().includes(search.toLowerCase())) return false
      if (filter === 'Male' && p.gender !== 'Male') return false
      if (filter === 'Female' && p.gender !== 'Female') return false
      if (filter === 'With allergies' && p.allergies.length === 0) return false
      if (filter === 'Active medications' && p.medications.length === 0) return false
      return true
    })
  }, [data.patients, search, filter])

  const onSave = (p: Patient) => {
    data.addPatient(p)
    onLog('Dr. Ibrahim', editing ? 'updated' : 'created', `Patient ${p.id}`)
    toast.show(copy.saved)
    setShowForm(false); setEditing(null)
  }
  const onDelete = (p: Patient) => {
    data.removePatient(p.id)
    onLog('Dr. Ibrahim', 'deleted', `Patient ${p.id}`)
    toast.show(copy.deleted, 'error')
    setConfirmDelete(null)
    if (viewing?.id === p.id) setViewing(null)
  }

  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">CARE MANAGEMENT</span>
          <h1>Patients</h1>
          <p className="muted-light">{data.patients.length} records · {data.patients.filter(p => p.allergies.length).length} with allergies</p>
        </div>
        <div className="adm-head-actions">
          <button className="pro-outline" onClick={() => toast.show('Exporting…', 'info')}><Download size={14}/> {copy.export}</button>
          <button className="pro-outline" onClick={() => toast.show('Import wizard', 'info')}><Upload size={14}/> {copy.import}</button>
          <button className="pro-primary" onClick={() => { setEditing(null); setShowForm(true) }}><Plus size={14}/> New patient</button>
        </div>
      </section>

      <section className="pro-panel adm-toolbar">
        <div className="adm-filters">
          <div className="pro-search grow"><Search size={15}/><input placeholder="Search by name, ID, phone, email…" value={search} onChange={e => setSearch(e.target.value)}/></div>
          <Select value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All</option><option>Male</option><option>Female</option><option>With allergies</option><option>Active medications</option>
          </Select>
          <button className="pro-outline" onClick={() => { setSearch(''); setFilter('All') }}><X size={14}/> {copy.reset}</button>
        </div>
      </section>

      <section className="pro-panel">
        {filtered.length === 0 ? <EmptyState title="No patients found"/> : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>Patient</th><th>ID</th><th>Contact</th><th>Conditions</th><th>Allergies</th><th>Last visit</th><th/></tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} style={{ animationDelay: `${i * 25}ms` }} onClick={() => setViewing(p)}>
                    <td>
                      <div className="adm-cell-person">
                        <Avatar name={p.name}/>
                        <div><strong>{p.name}</strong><small>{p.gender} · {p.dob}</small></div>
                      </div>
                    </td>
                    <td><span className="adm-code">{p.id}</span></td>
                    <td>
                      <div className="adm-contact-cell">
                        <span><Phone size={11}/> {p.phone}</span>
                        <span><Mail size={11}/> {p.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="adm-tag-list">
                        {p.conditions.length === 0 ? <span className="muted-light">—</span> : p.conditions.map(c => <Pill key={c} tone="blue">{c}</Pill>)}
                      </div>
                    </td>
                    <td>
                      {p.allergies.length === 0 ? <span className="muted-light">—</span> : p.allergies.map(a => <Pill key={a} tone="coral">{a}</Pill>)}
                    </td>
                    <td>{p.visits[p.visits.length - 1]?.date || <span className="muted-light">—</span>}</td>
                    <td>
                      <div className="adm-row-actions" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setViewing(p)}><Eye size={15}/></button>
                        <button onClick={() => { setEditing(p); setShowForm(true) }}><Edit3 size={15}/></button>
                        <button className="danger" onClick={() => setConfirmDelete(p)}><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showForm && <PatientForm initial={editing} onClose={() => { setShowForm(false); setEditing(null) }} onSave={onSave} copy={copy} data={data} />}
      {viewing && <PatientProfile patient={viewing} onClose={() => setViewing(null)} copy={copy} data={data} onLog={onLog} toast={toast} onEdit={(p) => { setEditing(p); setShowForm(true) }} onDelete={(p) => setConfirmDelete(p)} />}
      {confirmDelete && (
        <Modal open onClose={() => setConfirmDelete(null)} title="Delete patient record?" footer={
          <>
            <button className="pro-outline" onClick={() => setConfirmDelete(null)}>{copy.cancel}</button>
            <button className="pro-danger" onClick={() => onDelete(confirmDelete)}><Trash2 size={14}/> {copy.delete}</button>
          </>
        }>
          <p>Permanently remove <strong>{confirmDelete.name}</strong> ({confirmDelete.id}) and all related records?</p>
        </Modal>
      )}
    </>
  )
}

function PatientForm({ initial, onClose, onSave, copy, data }: { initial: Patient | null; onClose: () => void; onSave: (p: Patient) => void; copy: any; data: AdminData }) {
  const [p, setP] = useState<Patient>(initial || {
    id: `DR-${20500 + data.patients.length}`, name: '', dob: '1995-01-01', gender: 'Female', phone: '', email: '', address: '',
    bloodGroup: 'O+', allergies: [], conditions: [], medications: [], visits: [], notes: [], documents: [], vitals: { bp: '', hr: '', temp: '', weight: '', date: '2026-06-18' }
  })
  const [allergy, setAllergy] = useState('')
  const [condition, setCondition] = useState('')
  return (
    <Drawer open onClose={onClose} title={initial ? `Edit ${initial.name}` : 'New patient'} width={680}>
      <form className="adm-form" onSubmit={e => { e.preventDefault(); onSave(p) }}>
        <h4>Personal</h4>
        <div className="adm-form-grid">
          <Field label="Full name" required><Input value={p.name} onChange={e => setP({ ...p, name: e.target.value })}/></Field>
          <Field label="Patient ID"><Input value={p.id} disabled/></Field>
          <Field label="Date of birth" required><Input type="date" value={p.dob} onChange={e => setP({ ...p, dob: e.target.value })}/></Field>
          <Field label="Gender"><Select value={p.gender} onChange={e => setP({ ...p, gender: e.target.value as any })}><option>Female</option><option>Male</option><option>Other</option></Select></Field>
          <Field label="Phone" required><Input value={p.phone} onChange={e => setP({ ...p, phone: e.target.value })}/></Field>
          <Field label="Email"><Input type="email" value={p.email} onChange={e => setP({ ...p, email: e.target.value })}/></Field>
          <Field label="Blood group"><Select value={p.bloodGroup} onChange={e => setP({ ...p, bloodGroup: e.target.value })}>{['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}</Select></Field>
        </div>
        <Field label="Address"><Textarea rows={2} value={p.address} onChange={e => setP({ ...p, address: e.target.value })}/></Field>

        <h4>Medical</h4>
        <Field label="Allergies">
          <div className="adm-tag-input">
            <div className="adm-tags">
              {p.allergies.map(a => (
                <Pill key={a} tone="coral">{a} <button type="button" onClick={() => setP({ ...p, allergies: p.allergies.filter(x => x !== a) })}><X size={11}/></button></Pill>
              ))}
            </div>
            <div className="adm-tag-add">
              <Input value={allergy} onChange={e => setAllergy(e.target.value)} placeholder="Add allergy and press Enter"/>
              <button type="button" className="pro-outline" onClick={() => { if (allergy.trim()) { setP({ ...p, allergies: [...p.allergies, allergy.trim()] }); setAllergy('') } }}>Add</button>
            </div>
          </div>
        </Field>
        <Field label="Conditions">
          <div className="adm-tag-input">
            <div className="adm-tags">
              {p.conditions.map(c => (
                <Pill key={c} tone="blue">{c} <button type="button" onClick={() => setP({ ...p, conditions: p.conditions.filter(x => x !== c) })}><X size={11}/></button></Pill>
              ))}
            </div>
            <div className="adm-tag-add">
              <Input value={condition} onChange={e => setCondition(e.target.value)} placeholder="Add condition"/>
              <button type="button" className="pro-outline" onClick={() => { if (condition.trim()) { setP({ ...p, conditions: [...p.conditions, condition.trim()] }); setCondition('') } }}>Add</button>
            </div>
          </div>
        </Field>

        <div className="adm-form-foot">
          <button type="button" className="pro-outline" onClick={onClose}>{copy.cancel}</button>
          <button type="submit" className="pro-primary"><Save size={14}/> {copy.save}</button>
        </div>
      </form>
    </Drawer>
  )
}

function PatientProfile({ patient, onClose, copy, data, onLog, toast, onEdit, onDelete }: { patient: Patient; onClose: () => void; copy: any; data: AdminData; onLog: any; toast: any; onEdit: (p: Patient) => void; onDelete: (p: Patient) => void }) {
  const [tab, setTab] = useState<'overview' | 'visits' | 'prescriptions' | 'notes' | 'documents'>('overview')
  const [showVisit, setShowVisit] = useState(false)
  const [showRx, setShowRx] = useState(false)
  const [showNote, setShowNote] = useState(false)

  const p = data.patients.find(x => x.id === patient.id) || patient
  const patientAppts = data.appointments.filter(a => a.patient === p.name)
  const age = useMemo(() => {
    const d = new Date(p.dob); const now = new Date('2026-06-18')
    return now.getFullYear() - d.getFullYear() - (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate()) ? 1 : 0)
  }, [p.dob])

  const addVisit = (v: any) => { data.addPatient({ ...p, visits: [...p.visits, v] }); onLog('Dr. Ibrahim', 'created', `Visit for ${p.name}`); toast.show(copy.saved); setShowVisit(false) }
  const addRx = (r: any) => { data.addPatient({ ...p, medications: [...p.medications, r] }); onLog('Dr. Ibrahim', 'created', `Prescription for ${p.name}`); toast.show(copy.saved); setShowRx(false) }
  const addNote = (n: any) => { data.addPatient({ ...p, notes: [n, ...p.notes] }); onLog('Dr. Ibrahim', 'created', `Note for ${p.name}`); toast.show(copy.saved); setShowNote(false) }

  return (
    <Drawer open onClose={onClose} title={p.name} width={780}>
      <div className="adm-profile">
        <div className="adm-profile-hero">
          <Avatar name={p.name} size={80}/>
          <div className="adm-profile-meta">
            <h2>{p.name}</h2>
            <p>{p.gender} · {age} years · {p.bloodGroup}</p>
            <div className="adm-profile-tags">
              {p.conditions.map(c => <Pill key={c} tone="blue">{c}</Pill>)}
              {p.allergies.map(a => <Pill key={a} tone="coral">{a}</Pill>)}
            </div>
          </div>
          <div className="adm-profile-actions">
            <button className="pro-outline" onClick={() => onEdit(p)}><Edit3 size={14}/> {copy.edit}</button>
            <button className="pro-danger" onClick={() => onDelete(p)}><Trash2 size={14}/> {copy.delete}</button>
          </div>
        </div>

        <div className="adm-profile-stats">
          <div><small>Visits</small><strong>{p.visits.length}</strong></div>
          <div><small>Prescriptions</small><strong>{p.medications.length}</strong></div>
          <div><small>Notes</small><strong>{p.notes.length}</strong></div>
          <div><small>Documents</small><strong>{p.documents.length}</strong></div>
        </div>

        <div className="adm-tabs">
          {(['overview', 'visits', 'prescriptions', 'notes', 'documents'] as const).map(t => (
            <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            <div className="adm-detail-grid">
              <div><Phone size={14}/><span>Phone</span><strong>{p.phone}</strong></div>
              <div><Mail size={14}/><span>Email</span><strong>{p.email}</strong></div>
              <div><Calendar size={14}/><span>Date of birth</span><strong>{p.dob} ({age} yrs)</strong></div>
              <div><User size={14}/><span>Gender</span><strong>{p.gender}</strong></div>
              <div><MapPin size={14}/><span>Address</span><strong>{p.address}</strong></div>
              <div><Heart size={14}/><span>Blood group</span><strong>{p.bloodGroup}</strong></div>
            </div>
            <h4 className="adm-section-h">Latest vitals</h4>
            <div className="adm-vitals">
              <div><small>Blood pressure</small><strong>{p.vitals.bp || '—'}</strong></div>
              <div><small>Heart rate</small><strong>{p.vitals.hr || '—'}</strong></div>
              <div><small>Temperature</small><strong>{p.vitals.temp || '—'}</strong></div>
              <div><small>Weight</small><strong>{p.vitals.weight || '—'}</strong></div>
            </div>
            <h4 className="adm-section-h">Recent appointments</h4>
            {patientAppts.length === 0 ? <p className="muted-light">No appointments yet.</p> : (
              <ul className="adm-day-events">
                {patientAppts.slice(0, 5).map(a => (
                  <li key={a.id}><span className="cal-time-tag">{a.time}</span><Avatar name={a.patient} size={28}/><div className="grow"><strong>{a.service}</strong><small>{a.date} · {a.chamber} · {a.duration}</small></div><Pill tone={a.status === 'Confirmed' ? 'teal' : 'sand'}>{a.status}</Pill></li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === 'visits' && (
          <>
            <div className="adm-section-head"><h4>Visit history</h4><button className="pro-primary" onClick={() => setShowVisit(true)}><Plus size={13}/> {copy.addVisit}</button></div>
            {p.visits.length === 0 ? <EmptyState title="No visits yet" body="Add the first visit to start a record."/> : (
              <ul className="adm-timeline-list">
                {p.visits.map((v, i) => (
                  <li key={i}><span className="adm-timeline-dot"/><Avatar name={v.doctor}/><div className="grow"><strong>{v.reason}</strong><small>{v.date} · {v.doctor}</small><p>{v.notes}</p></div></li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === 'prescriptions' && (
          <>
            <div className="adm-section-head"><h4>Current medications</h4><button className="pro-primary" onClick={() => setShowRx(true)}><Plus size={13}/> {copy.addPrescription}</button></div>
            {p.medications.length === 0 ? <EmptyState title="No medications" body="Add the patient's current prescriptions."/> : (
              <ul className="adm-rx-list">
                {p.medications.map((m, i) => (
                  <li key={i}><PillIcon size={16}/><div className="grow"><strong>{m.name}</strong><small>{m.dose}</small></div><Pill tone={m.status === 'Ongoing' ? 'teal' : 'sand'}>{m.status}</Pill></li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === 'notes' && (
          <>
            <div className="adm-section-head"><h4>Doctor notes</h4><button className="pro-primary" onClick={() => setShowNote(true)}><Plus size={13}/> {copy.addNote}</button></div>
            {p.notes.length === 0 ? <EmptyState title="No notes yet"/> : (
              <ul className="adm-note-list">
                {p.notes.map((n, i) => (
                  <li key={i}><Avatar name={n.author}/><div className="grow"><strong>{n.author}</strong><small>{n.date}</small><p>{n.text}</p></div></li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === 'documents' && (
          <>
            <div className="adm-section-head"><h4>Documents</h4><button className="pro-primary"><Upload size={13}/> Upload</button></div>
            {p.documents.length === 0 ? <EmptyState title="No documents" body="Upload lab reports, scans, or other files."/> : (
              <ul className="adm-doc-list">
                {p.documents.map((d, i) => (
                  <li key={i}><FileText size={16}/><div className="grow"><strong>{d.name}</strong><small>{d.type} · {d.size} · {d.date}</small></div><button className="pro-text-link"><Download size={14}/> Download</button></li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {showVisit && <VisitForm onClose={() => setShowVisit(false)} onSave={addVisit}/>}
      {showRx && <PrescriptionForm onClose={() => setShowRx(false)} onSave={addRx}/>}
      {showNote && <NoteForm onClose={() => setShowNote(false)} onSave={addNote}/>}
    </Drawer>
  )
}

function VisitForm({ onClose, onSave }: { onClose: () => void; onSave: (v: any) => void }) {
  const [v, setV] = useState({ date: '2026-06-18', reason: '', doctor: 'Dr. Ibrahim', notes: '' })
  return (
    <Modal open onClose={onClose} title="Add visit" footer={<><button className="pro-outline" onClick={onClose}>Cancel</button><button className="pro-primary" onClick={() => onSave(v)}><Save size={14}/> Save</button></>}>
      <div className="adm-form-grid">
        <Field label="Date" required><Input type="date" value={v.date} onChange={e => setV({ ...v, date: e.target.value })}/></Field>
        <Field label="Doctor"><Input value={v.doctor} onChange={e => setV({ ...v, doctor: e.target.value })}/></Field>
      </div>
      <Field label="Reason" required><Input value={v.reason} onChange={e => setV({ ...v, reason: e.target.value })}/></Field>
      <Field label="Notes"><Textarea rows={3} value={v.notes} onChange={e => setV({ ...v, notes: e.target.value })}/></Field>
    </Modal>
  )
}
function PrescriptionForm({ onClose, onSave }: { onClose: () => void; onSave: (r: any) => void }) {
  const [r, setR] = useState({ name: '', dose: '', status: 'Ongoing' })
  return (
    <Modal open onClose={onClose} title="Add prescription" footer={<><button className="pro-outline" onClick={onClose}>Cancel</button><button className="pro-primary" onClick={() => onSave(r)}><Save size={14}/> Save</button></>}>
      <Field label="Medication" required><Input value={r.name} onChange={e => setR({ ...r, name: e.target.value })}/></Field>
      <div className="adm-form-grid">
        <Field label="Dose"><Input value={r.dose} onChange={e => setR({ ...r, dose: e.target.value })} placeholder="e.g. Twice daily"/></Field>
        <Field label="Status"><Select value={r.status} onChange={e => setR({ ...r, status: e.target.value })}><option>Ongoing</option><option>Completed</option><option>As needed</option></Select></Field>
      </div>
    </Modal>
  )
}
function NoteForm({ onClose, onSave }: { onClose: () => void; onSave: (n: any) => void }) {
  const [n, setN] = useState({ date: '2026-06-18', text: '', author: 'Dr. Ibrahim' })
  return (
    <Modal open onClose={onClose} title="Add note" footer={<><button className="pro-outline" onClick={onClose}>Cancel</button><button className="pro-primary" onClick={() => onSave(n)}><Save size={14}/> Save</button></>}>
      <Field label="Note" required><Textarea rows={4} value={n.text} onChange={e => setN({ ...n, text: e.target.value })}/></Field>
    </Modal>
  )
}
