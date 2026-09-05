'use client'

import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { Check, FileText, Plus, Printer, Search, Trash2, Download, X, Edit3, ChevronDown, ChevronUp, Activity, PenLine } from 'lucide-react'
import { Modal, Field, Input, Select, Textarea, Avatar } from '../admin-ui'
import type { AdminData, Patient, Prescription } from '../../lib/admin-data'

type Medicine = { name: string; dose: string; frequency: string; duration: string; instructions: string }
type FieldError = { patient?: boolean; diagnosis?: boolean; medicineName?: boolean }

const emptyPrescription = (patientId = '', patientName = ''): Prescription => ({
  id: '',
  patientId,
  patientName,
  doctor: 'Dr. Ibrahim',
  date: new Date().toISOString().split('T')[0],
  diagnosis: '',
  medicines: [{ name: '', dose: '', frequency: 'Once daily', duration: '7 days', instructions: '' }],
  notes: '',
  status: 'Draft',
  createdAt: new Date().toISOString(),
  refillCount: 0,
  refillsAllowed: 0,
  auditTrail: [],
})

const nextRxId = (existing: Prescription[] = []) => {
  const year = new Date().getFullYear()
  const prefix = `RX-${year}-`
  const nums = existing
    .map(p => p.id.startsWith(prefix) ? parseInt(p.id.slice(prefix.length), 10) : NaN)
    .filter(n => !Number.isNaN(n))
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1
  return `${prefix}${String(next).padStart(4, '0')}`
}

export function PrescriptionsView({ data, copy, onLog, toast }: { data: AdminData; copy: any; onLog: (u: string, a: string, t: string) => void; toast: any }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedId, setSelectedId] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Prescription>(emptyPrescription())
  const [medicines, setMedicines] = useState<Medicine[]>([{ name: '', dose: '', frequency: 'Once daily', duration: '7 days', instructions: '' }])
  const [viewingRx, setViewingRx] = useState<Prescription | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Prescription | null>(null)
  const [showPatientSelect, setShowPatientSelect] = useState(false)
  const [patientQuery, setPatientQuery] = useState('')
  const [errors, setErrors] = useState<FieldError>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [interactionWarnings, setInteractionWarnings] = useState<string[]>([])
  const formRef = useRef<HTMLDivElement>(null)
  const firstErrorId = 'rx-first-error'


  const prescriptions = useMemo(() => {
    let list = data.prescriptions || []
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(p => p.patientName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.diagnosis.toLowerCase().includes(q) || p.medicines.some(m => m.name.toLowerCase().includes(q)))
    }
    if (statusFilter !== 'All') list = list.filter(p => p.status === statusFilter)
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [data.prescriptions, query, statusFilter])

  const patients = useMemo(() => {
    if (!patientQuery) return data.patients
    const q = patientQuery.toLowerCase()
    return data.patients.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
  }, [data.patients, patientQuery])

  const selectedPatient = data.patients.find(p => p.id === selectedId) || null

  const validate = useCallback((currentForm: Prescription, currentMeds: Medicine[], hasPatient: boolean): FieldError => {
    const e: FieldError = {}
    if (!hasPatient) e.patient = true
    if (!currentForm.diagnosis.trim()) e.diagnosis = true
    if (currentMeds.some(m => !m.name.trim())) e.medicineName = true
    return e
  }, [])

  const touchedField = (field: string) => {
    setTouched(t => ({ ...t, [field]: true }))
  }

  const openCreate = () => {
    setEditingId(null)
    setSelectedId('')
    setForm(emptyPrescription())
    setMedicines([{ name: '', dose: '', frequency: 'Once daily', duration: '7 days', instructions: '' }])
    setShowForm(true)
    setShowPatientSelect(true)
    setPatientQuery('')
    setErrors({})
    setTouched({})
    setInteractionWarnings([])
  }

  const openEdit = (rx: Prescription) => {
    setEditingId(rx.id)
    setSelectedId(rx.patientId)
    setForm(rx)
    setMedicines(rx.medicines.length ? rx.medicines : [{ name: '', dose: '', frequency: 'Once daily', duration: '7 days', instructions: '' }])
    setShowForm(true)
    setShowPatientSelect(false)
    setErrors({})
    setTouched({})
    setInteractionWarnings([])
  }

  const save = async () => {
    touchedField('form')
    const validationErrors = validate(form, medicines, !!selectedPatient)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.show?.(copy.formIncomplete || 'Please complete the required fields')
      setTimeout(() => document.getElementById(firstErrorId)?.focus(), 50)
      return
    }

    const allergies = selectedPatient!.allergies.map(item => item.toLowerCase())
    const warnings = medicines.filter(m => allergies.some(allergy => m.name.toLowerCase().includes(allergy))).map(m => `${m.name} may conflict with a recorded allergy.`)
    setInteractionWarnings(warnings)
    if (warnings.length > 0) { toast.show?.(warnings[0]); return }

    const now = new Date().toISOString()
    const generatedId = editingId || nextRxId(data.prescriptions)
    const payload: Prescription = {
      ...form,
      id: generatedId,
      patientId: selectedPatient!.id,
      patientName: selectedPatient!.name,
      medicines,
      status: form.status || 'Draft',
      createdAt: editingId ? form.createdAt : now,
      signedAt: form.status === 'Signed' ? (form.signedAt || now) : form.signedAt,
      sentAt: form.status === 'Sent' ? (form.sentAt || now) : form.sentAt,
      auditTrail: [...(form.auditTrail || []), { at: now, actor: 'Dr. Ibrahim', action: editingId ? 'updated' : 'created', changes: `${medicines.length} medication(s), diagnosis updated` }],
    }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!showForm && !viewingRx) {
        if (e.key === 'n' && !e.metaKey && !e.ctrlKey && document.activeElement === document.body) {
          e.preventDefault()
          openCreate()
        }
        if (e.key === 'p' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          window.print()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showForm, viewingRx, openCreate])

  useEffect(() => {
    if (!showForm) return
    const el = formRef.current
    if (!el) return
    const focusable = el.querySelectorAll('input, select, textarea, button:not([disabled])')
    const first = focusable[0] as HTMLElement | undefined
    const last = focusable[focusable.length - 1] as HTMLElement | undefined
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus() } }
      else { if (document.activeElement === last) { e.preventDefault(); first?.focus() } }
    }
    el.addEventListener('keydown', trap)
    first?.focus()
    return () => el.removeEventListener('keydown', trap)
  }, [showForm])

    if (editingId) {
      data.addPrescription(payload)
      onLog('Dr. Ibrahim', 'updated', `Prescription ${payload.id}`)
      toast.show?.(copy.saved || 'Prescription updated')
    } else {
      data.addPrescription(payload)
      onLog('Dr. Ibrahim', 'created', `Prescription ${payload.id} for ${selectedPatient!.name}`)
      toast.show?.(copy.toastCreate?.replace('{kind}', 'Prescription') || 'Prescription created')
    }
    setShowForm(false)
    setEditingId(null)
    setSelectedId('')
    setForm(emptyPrescription())
    setMedicines([{ name: '', dose: '', frequency: 'Once daily', duration: '7 days', instructions: '' }])
    setErrors({})
    setTouched({})
    setInteractionWarnings([])
  }

  const deleteRx = (rx: Prescription) => {
    data.removePrescription(rx.id)
    onLog('Dr. Ibrahim', 'deleted', `Prescription ${rx.id}`)
    toast.show?.(copy.toastDelete?.replace('{kind}', 'Prescription') || 'Prescription deleted')
    setConfirmDelete(null)
    if (viewingRx?.id === rx.id) setViewingRx(null)
  }

  const updateMedicine = (index: number, key: string, value: string) => {
    setMedicines(items => items.map((item, i) => i === index ? { ...item, [key]: value } : item))
  }

  const addMedicine = () => setMedicines(items => [...items, { name: '', dose: '', frequency: 'Once daily', duration: '7 days', instructions: '' }])

  const removeMedicine = (index: number) => setMedicines(items => items.filter((_, i) => i !== index))

  const selectPatient = (patient: Patient) => {
    setSelectedId(patient.id)
    setForm(f => ({ ...f, patientId: patient.id, patientName: patient.name }))
    setShowPatientSelect(false)
    setPatientQuery('')
    touchedField('patient')
  }

  const updateField = (field: string, value: string | number) => {
    setForm(f => ({ ...f, [field]: field === 'refillsAllowed' ? Number(value) : value }))
    touchedField(field)
  }

  // PDF Export
  const exportPdf = async (rx: Prescription) => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    const patient = data.patients.find(p => p.id === rx.patientId)

    doc.setFontSize(18)
    doc.setTextColor(23, 75, 120)
    doc.text(copy.brandFull || 'Dr. Ibrahim Hossain Khan Clinic', 20, 22)
    doc.setFontSize(10)
    doc.setTextColor(95, 117, 128)
    doc.text([`Prescription ID: ${rx.id}`, `Date: ${rx.date}`, `Status: ${rx.status}`].join('  |  '), 20, 30)
    doc.line(20, 34, 190, 34)

    let y = 42
    if (patient) {
      doc.setFontSize(12)
      doc.setTextColor(23, 75, 120)
      doc.text('Patient Details', 20, y)
      y += 8
      doc.setFontSize(10)
      doc.setTextColor(51, 78, 92)
      doc.text(`Name: ${patient.name}`, 20, y); y += 6
      doc.text(`ID: ${patient.id}`, 20, y); y += 6
      doc.text(`Gender: ${patient.gender}  |  DOB: ${patient.dob}`, 20, y); y += 6
      doc.text(`Phone: ${patient.phone}`, 20, y); y += 6
      doc.text(`Address: ${patient.address}`, 20, y); y += 10
    }

    doc.setFontSize(12)
    doc.setTextColor(23, 75, 120)
    doc.text('Prescription Details', 20, y)
    y += 8
    doc.setFontSize(10)
    doc.setTextColor(51, 78, 92)
    doc.text(`Diagnosis: ${rx.diagnosis}`, 20, y); y += 6
    doc.text(`Doctor: ${rx.doctor}`, 20, y); y += 10

    doc.setFontSize(12)
    doc.setTextColor(23, 75, 120)
    doc.text('Medication Plan', 20, y)
    y += 8

    rx.medicines.forEach((med, i) => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.setFontSize(10)
      doc.setTextColor(23, 75, 120)
      doc.text(`${i + 1}. ${med.name}`, 24, y); y += 6
      doc.setTextColor(95, 117, 128)
      doc.text(`Dose: ${med.dose}  |  Frequency: ${med.frequency}  |  Duration: ${med.duration}`, 24, y); y += 6
      if (med.instructions) { doc.text(`Instructions: ${med.instructions}`, 24, y); y += 6 }
      y += 4
    })

    if (rx.notes) {
      y += 4
      doc.setFontSize(10)
      doc.setTextColor(95, 117, 128)
      doc.text(`Notes: ${rx.notes}`, 20, y)
    }

    doc.save(`Prescription-${rx.id}.pdf`)
  }

  // Word Export
  const exportWord = (rx: Prescription) => {
    const patient = data.patients.find(p => p.id === rx.patientId)
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Prescription ${rx.id}</title><style>body{font-family:Arial,sans-serif;color:#11263a;max-width:800px;margin:0 auto;padding:40px}h1{color:#174b78;border-bottom:2px solid #3b9b91;padding-bottom:10px}.meta{color:#617780;font-size:13px;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{text-align:left;padding:10px;border-bottom:1px solid #e0e8e8}th{background:#fbfcfc;color:#516974;font-size:11px;text-transform:uppercase;letter-spacing:.08em}.footer{margin-top:40px;color:#788992;font-size:11px}</style></head><body><h1>Prescription · ${rx.id}</h1><div class="meta">Date: ${rx.date} · Status: ${rx.status} · Doctor: ${rx.doctor}</div>${patient ? `<h2>Patient</h2><table><tr><th>Name</th><td>${patient.name}</td></tr><tr><th>ID</th><td>${patient.id}</td></tr><tr><th>Gender</th><td>${patient.gender}</td></tr><tr><th>DOB</th><td>${patient.dob}</td></tr><tr><th>Phone</th><td>${patient.phone}</td></tr><tr><th>Address</th><td>${patient.address}</td></tr><tr><th>Blood Group</th><td>${patient.bloodGroup}</td></tr>${patient.allergies.length ? `<tr><th>Allergies</th><td>${patient.allergies.join(', ')}</td></tr>` : ''}${patient.conditions.length ? `<tr><th>Conditions</th><td>${patient.conditions.join(', ')}</td></tr>` : ''}</table>` : ''}<h2>Diagnosis</h2><p>${rx.diagnosis}</p><h2>Medications</h2><table><thead><tr><th>#</th><th>Medicine</th><th>Dose</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr></thead><tbody>${rx.medicines.map((m, i) => `<tr><td>${i + 1}</td><td><strong>${m.name}</strong></td><td>${m.dose}</td><td>${m.frequency}</td><td>${m.duration}</td><td>${m.instructions}</td></tr>`).join('')}</tbody></table>${rx.notes ? `<h2>Notes</h2><p>${rx.notes}</p>` : ''}<div class="footer">Generated securely for your records.</div></body></html>`
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Prescription-${rx.id}.doc`
    a.click()
    URL.revokeObjectURL(url)
  }

  const printRx = (rx: Prescription) => {
    setViewingRx(rx)
    setTimeout(() => window.print(), 300)
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { Draft: 'sand', Signed: 'teal', Sent: 'blue' }
    return <span className={`adm-pill adm-pill-${map[status] || 'neutral'}`}>{status}</span>
  }

  const statusSteps = ['Draft', 'Signed', 'Sent']
  const currentStatusIndex = statusSteps.indexOf(form.status)

  const cycleStatus = (direction: 1 | -1) => {
    const next = currentStatusIndex + direction
    if (next >= 0 && next < statusSteps.length) {
      updateField('status', statusSteps[next])
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!showForm && !viewingRx) {
        if (e.key === 'n' && !e.metaKey && !e.ctrlKey && document.activeElement === document.body) {
          e.preventDefault()
          openCreate()
        }
        if (e.key === 'p' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          window.print()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showForm, viewingRx, openCreate])

  useEffect(() => {
    if (!showForm) return
    const el = formRef.current
    if (!el) return
    const focusable = el.querySelectorAll('input, select, textarea, button:not([disabled])')
    const first = focusable[0] as HTMLElement | undefined
    const last = focusable[focusable.length - 1] as HTMLElement | undefined
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus() } }
      else { if (document.activeElement === last) { e.preventDefault(); first?.focus() } }
    }
    el.addEventListener('keydown', trap)
    first?.focus()
    return () => el.removeEventListener('keydown', trap)
  }, [showForm])

  const isFormInvalid = Object.keys(errors).length > 0

  return (
    <div className="rx-workspace">
      <div className="rx-heading">
        <div>
          <span className="pro-kicker">{copy.rxKicker}</span>
          <h1>{copy.rxTitle}</h1>
          <p className="muted-light">{copy.rxSub}</p>
        </div>
        <div className="rx-actions">
          <button className="pro-outline btn-pro" onClick={() => window.print()}><Printer size={15}/> {copy.rxPrint}</button>
          <button className="pro-primary btn-pro shadow-glow-teal" onClick={openCreate}><Plus size={15}/> {copy.rxNew}</button>
        </div>
      </div>

      <div className="rx-layout-modern">
        <div className="pro-panel rx-toolbar">
          <div className="adm-filters">
            <div className="pro-search grow"><Search size={15}/><input placeholder={copy.rxSearch} value={query} onChange={e => setQuery(e.target.value)}/></div>
            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {copy.rxFilters.map((f: string) => <option key={f} value={f}>{f}</option>)}
            </Select>
          </div>
        </div>

        {prescriptions.length === 0 ? (
          <div className="pro-panel rx-empty">
            <div className="rx-empty-art"><FileText size={32}/></div>
            <h3>{copy.rxNoPrescriptions}</h3>
            <p className="muted-light">{copy.rxNoPrescriptionsBody}</p>
            <button className="pro-primary" onClick={openCreate}><Plus size={14}/> {copy.rxNew}</button>
          </div>
        ) : (
          <div className="rx-table-wrap">
            <table className="adm-table">
              <thead>
                <tr><th>{copy.rxPatient}</th><th>{copy.rxDate}</th><th>{copy.rxDiagnosis}</th><th>{copy.rxMedicines}</th><th>{copy.rxStatus}</th><th/></tr>
              </thead>
              <tbody>
                {prescriptions.map((rx, i) => (
                  <tr key={rx.id} style={{ animationDelay: `${i * 25}ms` }} onClick={() => setViewingRx(rx)}>
                    <td>
                      <div className="adm-cell-person">
                        <Avatar name={rx.patientName}/>
                        <div><strong>{rx.patientName}</strong><small>{rx.id}</small></div>
                      </div>
                    </td>
                    <td><span className="muted-light">{rx.date}</span></td>
                    <td><span className="rx-diag">{rx.diagnosis}</span></td>
                    <td><span className="adm-pill adm-pill-neutral">{rx.medicines.length} {copy.rxMedicines.toLowerCase()}</span></td>
                    <td>{statusBadge(rx.status)}</td>
                    <td>
                      <div className="adm-row-actions" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setViewingRx(rx)} title={copy.rxView}><FileText size={15}/></button>
                        <button onClick={() => openEdit(rx)} title={copy.rxEdit}><Edit3 size={15}/></button>
                        <button className="danger" onClick={() => setConfirmDelete(rx)} title={copy.rxDelete}><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="adm-modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="adm-modal adm-modal-lg rx-centered-modal" onClick={e => e.stopPropagation()} ref={formRef} role="dialog" aria-modal="true" aria-label={editingId ? copy.rxEdit : copy.rxNew}>
            <div className="rx-document">
              <div className="rx-doc-header">
                <div className="rx-doc-brand">
                  <div className="rx-doc-logo">
                    <Activity size={20} />
                  </div>
                  <div>
                    <strong>{copy.brandFull || 'Dr. Ibrahim Hossain Khan Clinic'}</strong>
                    <small>{copy.doctor || 'Dr. Ibrahim Hossain · M.Sc Skin & VD Integrative Medicine Consultant'}</small>
                  </div>
                </div>
                <div className="rx-doc-meta">
                  <span>Rx No: <strong>{editingId || nextRxId(data.prescriptions)}</strong></span>
                  <span>Date: <strong>{form.date}</strong></span>
                </div>
              </div>

              <div className="rx-doc-body">
                <div className="rx-section-header">
                  <span className="rx-rx-symbol">Rx</span>
                  <span className="rx-section-title">{copy.rxPrescriptionDetails}</span>
                </div>

                <div className="rx-grid">
                  <div className="rx-block">
                    <label>{copy.rxPatientDetails} {errors.patient && <em className="rx-error">Required</em>}</label>
                    <div className="rx-patient-card">
                      {selectedPatient ? (
                        <>
                          <div className="rx-patient-row">
                            <span><small>{copy.rxFullName}</small><strong>{selectedPatient.name}</strong></span>
                            <span><small>{copy.rxPatientId}</small><strong>{selectedPatient.id}</strong></span>
                          </div>
                          <div className="rx-patient-row">
                            <span><small>{copy.rxGender}</small><strong>{selectedPatient.gender}</strong></span>
                            <span><small>{copy.rxDob}</small><strong>{selectedPatient.dob}</strong></span>
                          </div>
                          <div className="rx-patient-row">
                            <span><small>{copy.rxPhone}</small><strong>{selectedPatient.phone}</strong></span>
                            <span><small>{copy.rxBloodGroup}</small><strong>{selectedPatient.bloodGroup}</strong></span>
                          </div>
                          <div className="rx-patient-row">
                            <span className="rx-full"><small>{copy.rxAddress}</small><strong>{selectedPatient.address}</strong></span>
                          </div>
                          {selectedPatient.allergies.length > 0 && (
                            <div className="rx-patient-row">
                              <span className="rx-full"><small>{copy.rxAllergies}</small><strong className="coral">{selectedPatient.allergies.join(', ')}</strong></span>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className={`muted-light ${errors.patient ? 'rx-error-text' : ''}`}>No patient selected</p>
                      )}
                    </div>
                  </div>

                  <div className="rx-block">
                    <label>{copy.rxDiagnosisLabel} {errors.diagnosis && <em className="rx-error">Required</em>}</label>
                    <div className={`rx-diagnosis-box ${errors.diagnosis ? 'rx-field-error' : ''}`}>
                      <Input id={errors.diagnosis ? firstErrorId : undefined} value={form.diagnosis} onChange={e => updateField('diagnosis', e.target.value)} onBlur={() => touchedField('diagnosis')} placeholder="e.g. Skin flare review" />
                    </div>
                    <label style={{ marginTop: 14 }}>{copy.rxDoctor}</label>
                    <Input value={form.doctor} onChange={e => updateField('doctor', e.target.value)} />
                    <label style={{ marginTop: 14 }}>{copy.rxStatus}</label>
                    <Select value={form.status} onChange={e => updateField('status', e.target.value)}>
                      <option>Draft</option>
                      <option>Signed</option>
                      <option>Sent</option>
                    </Select>
                  </div>
                </div>

                <div className="rx-medication-section">
                  <div className="rx-med-header">
                    <h3>{copy.rxMedicationPlan}</h3>
                    <button type="button" className="pro-text-link" onClick={addMedicine}><Plus size={14}/> {copy.rxAddMedicine}</button>
                  </div>
                  <div className="rx-med-table-wrap">
                    <table className="rx-med-table">
                      <thead>
                        <tr>
                          <th style={{ width: 40 }}>#</th>
                          <th>{copy.rxMedicine} {errors.medicineName && <em className="rx-error">Required</em>}</th>
                          <th>{copy.rxDose}</th>
                          <th>{copy.rxFrequency}</th>
                          <th>{copy.rxDuration}</th>
                          <th>{copy.rxInstructions}</th>
                          <th style={{ width: 44 }}/>
                        </tr>
                      </thead>
                      <tbody>
                        {medicines.map((med, index) => (
                          <tr key={index} className={med.name.trim() === '' && touched.medicineName ? 'rx-row-error' : ''}>
                            <td><span className="rx-med-num">{String(index + 1).padStart(2, '0')}</span></td>
                            <td><Input value={med.name} onChange={e => updateMedicine(index, 'name', e.target.value)} onBlur={() => touchedField('medicineName')} placeholder="e.g. Amoxicillin" /></td>
                            <td><Input value={med.dose} onChange={e => updateMedicine(index, 'dose', e.target.value)} placeholder="500 mg" /></td>
                            <td>
                              <Select value={med.frequency} onChange={e => updateMedicine(index, 'frequency', e.target.value)}>
                                <option>Once daily</option>
                                <option>Twice daily</option>
                                <option>Three times daily</option>
                                <option>As needed</option>
                              </Select>
                            </td>
                            <td><Input value={med.duration} onChange={e => updateMedicine(index, 'duration', e.target.value)} placeholder="7 days" /></td>
                            <td><Input value={med.instructions} onChange={e => updateMedicine(index, 'instructions', e.target.value)} placeholder="After meals" /></td>
                            <td>
                              {medicines.length > 1 && (
                                <button type="button" className="rx-remove" aria-label="Remove" onClick={() => removeMedicine(index)}><Trash2 size={15}/></button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rx-block">
                  <label>{copy.rxNotes}</label>
                  <Textarea rows={3} value={form.notes} onChange={e => updateField('notes', e.target.value)} placeholder="Additional instructions for the patient…"/>
                </div>

                <div className="rx-status-timeline">
                  {statusSteps.map((step, i) => (
                    <button key={step} type="button" className={`${i <= currentStatusIndex ? 'is-complete' : ''}`} onClick={() => updateField('status', step)}>
                      {step}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rx-doc-footer">
                <div className="rx-footer-left">
                  <div className="rx-sig-box">
                    <div className="rx-sig-line"/>
                    <strong>{copy.doctor || 'Dr. Ibrahim'}</strong>
                    <small>{copy.rxSigned || 'Signed'}</small>
                  </div>
                </div>
                <div className="rx-footer-right">
                  <label>{copy.rxDate}</label>
                  <div className="rx-date-box">{form.date}</div>
                  <label style={{ marginTop: 10 }}>CC</label>
                  <div className="rx-cc-box">
                    <Input placeholder="Patient file" />
                    <Input placeholder="Reception" />
                  </div>
                </div>
              </div>
            </div>
            <div className="adm-modal-foot">
              <button className="pro-outline" onClick={() => { setShowForm(false); setErrors({}); setTouched({}) }}>{copy.rxCancel}</button>
              <button className="pro-outline" onClick={() => { const rx = editingId ? form : { ...form, id: nextRxId(data.prescriptions), medicines, status: form.status || 'Draft', createdAt: new Date().toISOString() } as Prescription; exportWord(rx) }}><Download size={14}/> {copy.rxExportWord}</button>
              <button className="pro-outline" onClick={async () => { const rx = editingId ? form : { ...form, id: nextRxId(data.prescriptions), medicines, status: form.status || 'Draft', createdAt: new Date().toISOString() } as Prescription; await exportPdf(rx) }}><Download size={14}/> {copy.rxExportPdf}</button>
              <button className="pro-primary" onClick={save} disabled={isFormInvalid}><Check size={14}/> {copy.rxSave}</button>
             </div>
           </div>
         </div>
       )}

      {viewingRx && (
        <div className="adm-modal-backdrop" onClick={() => setViewingRx(null)}>
          <div className="adm-modal adm-modal-lg rx-centered-modal" onClick={e => e.stopPropagation()}>
            <div className="rx-document">
              <div className="rx-doc-header">
                <div className="rx-doc-brand">
                  <div className="rx-doc-logo"><Activity size={20}/></div>
                  <div>
                    <strong>{copy.brandFull || 'Dr. Ibrahim Hossain Khan Clinic'}</strong>
                    <small>{copy.doctor || 'Dr. Ibrahim Hossain · M.Sc Skin & VD Integrative Medicine Consultant'}</small>
                  </div>
                </div>
                <div className="rx-doc-meta">
                  <span>Rx No: <strong>{viewingRx.id}</strong></span>
                  <span>Date: <strong>{viewingRx.date}</strong></span>
                </div>
              </div>
              <div className="rx-doc-body">
                <div className="rx-section-header">
                  <span className="rx-rx-symbol">Rx</span>
                  <span className="rx-section-title">{copy.rxPrescriptionDetails}</span>
                </div>
                {(() => {
                  const patient = data.patients.find(p => p.id === viewingRx.patientId)
                  return (
                    <div className="rx-grid">
                      {patient && (
                        <div className="rx-block">
                          <label>{copy.rxPatientDetails}</label>
                          <div className="rx-patient-card">
                            <div className="rx-patient-row">
                              <span><small>{copy.rxFullName}</small><strong>{patient.name}</strong></span>
                              <span><small>{copy.rxPatientId}</small><strong>{patient.id}</strong></span>
                            </div>
                            <div className="rx-patient-row">
                              <span><small>{copy.rxGender}</small><strong>{patient.gender}</strong></span>
                              <span><small>{copy.rxDob}</small><strong>{patient.dob}</strong></span>
                            </div>
                            <div className="rx-patient-row">
                              <span><small>{copy.rxPhone}</small><strong>{patient.phone}</strong></span>
                              <span><small>{copy.rxBloodGroup}</small><strong>{patient.bloodGroup}</strong></span>
                            </div>
                            <div className="rx-patient-row">
                              <span className="rx-full"><small>{copy.rxAddress}</small><strong>{patient.address}</strong></span>
                            </div>
                            {patient.allergies.length > 0 && (
                              <div className="rx-patient-row">
                                <span className="rx-full"><small>{copy.rxAllergies}</small><strong className="coral">{patient.allergies.join(', ')}</strong></span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="rx-block">
                        <label>{copy.rxDiagnosisLabel}</label>
                        <div className="rx-diagnosis-box"><strong>{viewingRx.diagnosis}</strong></div>
                        <label style={{ marginTop: 14 }}>{copy.rxDoctor}</label>
                        <div className="rx-diagnosis-box"><strong>{viewingRx.doctor}</strong></div>
                        <label style={{ marginTop: 14 }}>{copy.rxStatus}</label>
                        <div><span className={`adm-pill adm-pill-${viewingRx.status === 'Signed' ? 'teal' : viewingRx.status === 'Sent' ? 'blue' : 'sand'}`}>{viewingRx.status}</span></div>
                      </div>
                    </div>
                  )
                })()}
                <div className="rx-medication-section">
                  <div className="rx-med-header">
                    <h3>{copy.rxMedicationPlan}</h3>
                  </div>
                  <div className="rx-med-table-wrap">
                    <table className="rx-med-table">
                      <thead>
                        <tr><th style={{ width: 40 }}>#</th><th>{copy.rxMedicine}</th><th>{copy.rxDose}</th><th>{copy.rxFrequency}</th><th>{copy.rxDuration}</th><th>{copy.rxInstructions}</th></tr>
                      </thead>
                      <tbody>
                        {viewingRx.medicines.map((m, i) => <tr key={i}><td><span className="rx-med-num">{String(i + 1).padStart(2, '0')}</span></td><td><strong>{m.name}</strong></td><td>{m.dose}</td><td>{m.frequency}</td><td>{m.duration}</td><td>{m.instructions}</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
                {viewingRx.notes && (
                  <div className="rx-block" style={{ marginTop: 18 }}>
                    <label>{copy.rxNotes}</label>
                    <p style={{ color: '#516974', fontSize: 13, lineHeight: 1.6 }}>{viewingRx.notes}</p>
                  </div>
                )}
              </div>
              <div className="rx-doc-footer">
                <div className="rx-footer-left">
                  <div className="rx-sig-box">
                    <div className="rx-sig-line"/>
                    <strong>{copy.doctor || 'Dr. Ibrahim'}</strong>
                    <small>{copy.rxSigned || 'Signed'}</small>
                  </div>
                </div>
                <div className="rx-footer-right">
                  <label>{copy.rxDate}</label>
                  <div className="rx-date-box">{viewingRx.date}</div>
                  <label style={{ marginTop: 10 }}>CC</label>
                  <div className="rx-cc-box">
                    <div>Patient file</div>
                    <div>Reception</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="adm-modal-foot">
              <button className="pro-outline" onClick={() => setViewingRx(null)}>{copy.close}</button>
              <button className="pro-outline" onClick={() => { if (viewingRx) exportWord(viewingRx) }}><Download size={14}/> {copy.rxExportWord}</button>
              <button className="pro-primary" onClick={() => { if (viewingRx) exportPdf(viewingRx) }}><Download size={14}/> {copy.rxExportPdf}</button>
              <button className="pro-outline" onClick={() => { if (viewingRx) printRx(viewingRx) }}><Printer size={14}/> {copy.rxPrint}</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <Modal open onClose={() => setConfirmDelete(null)} title={copy.rxConfirmDelete} footer={
          <>
            <button className="pro-outline" onClick={() => setConfirmDelete(null)}>{copy.cancel}</button>
            <button className="pro-danger" onClick={() => deleteRx(confirmDelete)}><Trash2 size={14}/> {copy.delete}</button>
          </>
        }>
          <p>{copy.rxConfirmDeleteBody?.replace('{id}', confirmDelete.id).replace('{patient}', confirmDelete.patientName)}</p>
        </Modal>
      )}
    </div>
  )
}
