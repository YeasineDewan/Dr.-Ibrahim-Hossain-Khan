'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  X,
  CalendarDays,
  Clock,
  MapPin,
  Video,
  Phone,
  User,
  Users,
  Stethoscope,
  FileText,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Save,
} from 'lucide-react';
import {
  Avatar,
  Drawer,
  Field,
  Input,
  Modal,
  Pill,
  Select,
  Textarea,
  EmptyState,
} from '../admin-ui';
import type { Appointment } from '../../lib/admin-data';
import { TODAY } from '../../lib/utils';

const formatBn = (n: number) => '৳' + n.toLocaleString('en-IN');

export function AppointmentsView({
  data,
  copy,
  onLog,
  toast,
}: {
  data: any;
  copy: any;
  onLog: any;
  toast: any;
}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [chamberFilter, setChamberFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [viewing, setViewing] = useState<Appointment | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/admin/appointments');
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const result = await res.json();
      if (result.data) {
        setAppointments(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.show?.('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return appointments.filter(a => {
      if (
        search &&
        !`${a.patient} ${a.service} ${a.id} ${a.chamber}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      if (statusFilter !== 'All' && a.status !== statusFilter) return false;
      if (chamberFilter !== 'All' && a.chamber !== chamberFilter) return false;
      if (dateFilter === 'Today' && a.date !== TODAY) return false;
      if (dateFilter === 'Upcoming' && a.date < TODAY) return false;
      if (dateFilter === 'Past' && a.date > TODAY) return false;
      return true;
    });
  }, [appointments, search, statusFilter, chamberFilter, dateFilter]);

  const onSave = async (a: Appointment) => {
    try {
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/appointments', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(a),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save appointment');
      }
      onLog('Dr. Ibrahim', editing ? 'updated' : 'created', `Appointment ${a.id || ''}`);
      toast.show(copy.saved, 'success');
      setShowForm(false);
      setEditing(null);
      fetchAppointments();
    } catch (error: any) {
      toast.show?.(error.message || 'Failed to save appointment', 'error');
    }
  };
  const onDelete = async (a: Appointment) => {
    try {
      const res = await fetch(`/api/admin/appointments?id=${a.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete appointment');
      }
      onLog('Dr. Ibrahim', 'deleted', `Appointment ${a.id}`);
      toast.show(copy.deleted, 'error');
      setConfirmDelete(null);
      fetchAppointments();
    } catch (error: any) {
      toast.show?.(error.message || 'Failed to delete appointment', 'error');
    }
  };
  const onStatusChange = async (a: Appointment, status: Appointment['status']) => {
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...a, status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update status');
      }
      onLog('Dr. Ibrahim', 'updated', `Appointment ${a.id} → ${status}`);
      toast.show(`${a.id} → ${status}`, 'info');
      fetchAppointments();
    } catch (error: any) {
      toast.show?.(error.message || 'Failed to update status', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div className="route-skeleton-spin" />
      </div>
    );
  }

  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">CARE MANAGEMENT</span>
          <h1>Appointments</h1>
          <p className="muted-light">
            {appointments.length} total ·{' '}
            {appointments.filter(a => a.date === TODAY).length} today ·{' '}
            {appointments.filter(a => a.status === 'Pending').length} pending
          </p>
        </div>
        <div className="adm-head-actions">
          <button className="pro-outline" onClick={() => toast.show('Export queued', 'info')}>
            <Download size={14} /> {copy.export}
          </button>
          <button
            className="pro-primary"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}>
            <Plus size={14} /> {copy.apptNew}
          </button>
        </div>
      </section>

      <section className="pro-panel adm-toolbar">
        <div className="adm-filters">
          <div className="pro-search grow">
            <Search size={15} />
            <input
              placeholder="Search by patient, service, ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
            <option>All</option>
            <option>Today</option>
            <option>Upcoming</option>
            <option>Past</option>
          </Select>
          <Select value={chamberFilter} onChange={e => setChamberFilter(e.target.value)}>
            <option>All</option>
            {copy.chambers.map((c: string) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option>All</option>
            {copy.statuses.map((s: string) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <button
            className="pro-outline"
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
              setChamberFilter('All');
              setDateFilter('All');
            }}>
            <X size={14} /> {copy.reset}
          </button>
        </div>
      </section>

      <section className="pro-panel">
        {filtered.length === 0 ? (
          <EmptyState
            title="No appointments found"
            body="Try adjusting filters or add a new appointment."
            action={
              <button className="pro-primary" onClick={() => setShowForm(true)}>
                <Plus size={14} /> {copy.apptNew}
              </button>
            }
          />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Service</th>
                  <th>Date & time</th>
                  <th>Chamber</th>
                  <th>Type</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a.id} style={{ animationDelay: `${i * 30}ms` }}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <span className="adm-code">{a.id}</span>
                    </td>
                    <td>
                      <div className="adm-cell-person">
                        <Avatar name={a.patient} size={28} />
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
                        <small>
                          <Clock size={11} /> {a.time} · {a.duration}
                        </small>
                      </div>
                    </td>
                    <td>
                      <Pill tone="blue">{a.chamber}</Pill>
                    </td>
                    <td>
                      <span className="adm-type">
                        {a.type === 'Video' ? (
                          <Video size={12} />
                        ) : a.type === 'Phone' ? (
                          <Phone size={12} />
                        ) : (
                          <MapPin size={12} />
                        )}
                        {a.type}
                      </span>
                    </td>
                    <td>
                      <strong>{formatBn(a.fee)}</strong>
                    </td>
                    <td>
                      <Select
                        value={a.status}
                        onChange={e => onStatusChange(a, e.target.value as any)}
                        className={`adm-status-select adm-status-${a.status.toLowerCase()}`}>
                        {copy.statuses.map((s: string) => (
                          <option key={s}>{s}</option>
                        ))}
                      </Select>
                    </td>
                    <td>
                      <div className="adm-row-actions">
                        <button title="View" onClick={() => setViewing(a)}>
                          <Eye size={15} />
                        </button>
                        <button
                          title="Edit"
                          onClick={() => {
                            setEditing(a);
                            setShowForm(true);
                          }}>
                          <Edit3 size={15} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => setConfirmDelete(a)}
                          className="danger">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="adm-table-foot">
          <small>
            Showing {filtered.length} of {appointments.length}
          </small>
          <div className="adm-pager">
            <button>‹</button>
            <button className="on">1</button>
            <button>2</button>
            <button>3</button>
            <button>›</button>
          </div>
        </div>
      </section>

      {showForm && (
        <AppointmentForm
          initial={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={onSave}
          copy={copy}
        />
      )}
      {viewing && (
        <AppointmentDetail
          appt={viewing}
          onClose={() => setViewing(null)}
          copy={copy}
        />
      )}
      {confirmDelete && (
        <Modal
          open
          onClose={() => setConfirmDelete(null)}
          title="Delete appointment?"
          footer={
            <>
              <button className="pro-outline" onClick={() => setConfirmDelete(null)}>
                {copy.cancel}
              </button>
              <button className="pro-danger" onClick={() => onDelete(confirmDelete)}>
                <Trash2 size={14} /> {copy.delete}
              </button>
            </>
          }>
          <p>
            This will permanently remove <strong>{confirmDelete.id}</strong> for{' '}
            <strong>{confirmDelete.patient}</strong>.
          </p>
        </Modal>
      )}
    </>
  );
}

function AppointmentForm({
  initial,
  onClose,
  onSave,
  copy,
}: {
  initial: Appointment | null;
  onClose: () => void;
  onSave: (a: Appointment) => void;
  copy: any;
}) {
  const [a, setA] = useState<Appointment>(
    initial || {
      id: `APT-${Date.now().toString().slice(-5)}`,
      patient: '',
      doctor: 'Dr. Ibrahim',
      service: copy.services?.[0] || 'Consultation',
      chamber: copy.chambers?.[0] || 'Chamber 1',
      date: TODAY,
      time: '09:00',
      duration: copy.durations?.[1] || '30 mins',
      type: 'In-person',
      status: 'Pending',
      fee: 4500,
      notes: '',
    }
  );
  return (
    <Drawer
      open
      onClose={onClose}
      title={initial ? `Edit ${initial.id}` : copy.apptNew}
      width={620}>
      <form
        className="adm-form"
        onSubmit={e => {
          e.preventDefault();
          onSave(a);
        }}>
        <div className="adm-form-grid">
          <Field label={copy.apptPatient} required>
            <Input value={a.patient} onChange={e => setA({ ...a, patient: e.target.value })} />
          </Field>
          <Field label={copy.apptDoctor} required>
            <Input value={a.doctor} onChange={e => setA({ ...a, doctor: e.target.value })} />
          </Field>
          <Field label={copy.apptService} required>
            <Select value={a.service} onChange={e => setA({ ...a, service: e.target.value })}>
              {copy.services.map((s: string) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label={copy.apptType}>
            <Select value={a.type} onChange={e => setA({ ...a, type: e.target.value as any })}>
              <option>In-person</option>
              <option>Video</option>
              <option>Phone</option>
            </Select>
          </Field>
        </div>
        <div className="adm-form-grid">
          <Field label={copy.apptDate} required>
            <Input type="date" value={a.date} onChange={e => setA({ ...a, date: e.target.value })} />
          </Field>
          <Field label={copy.apptTime} required>
            <Input type="time" value={a.time} onChange={e => setA({ ...a, time: e.target.value })} />
          </Field>
          <Field label={copy.apptDuration}>
            <Select value={a.duration} onChange={e => setA({ ...a, duration: e.target.value })}>
              {copy.durations.map((d: string) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label={copy.apptFee}>
            <Input
              type="number"
              value={a.fee}
              onChange={e => setA({ ...a, fee: Number(e.target.value) })}
            />
          </Field>
        </div>
        <Field label={copy.apptChamber} required>
          <Select value={a.chamber} onChange={e => setA({ ...a, chamber: e.target.value })}>
            {copy.chambers.map((c: string) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label={copy.apptStatus}>
          <Select value={a.status} onChange={e => setA({ ...a, status: e.target.value as any })}>
            {copy.statuses.map((s: string) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Notes">
          <Textarea
            rows={3}
            value={a.notes}
            onChange={e => setA({ ...a, notes: e.target.value })}
          />
        </Field>
        <div className="adm-form-foot">
          <button type="button" className="pro-outline" onClick={onClose}>
            {copy.cancel}
          </button>
          <button type="submit" className="pro-primary">
            <Save size={14} /> {copy.save}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

export function CalendarView({ data, copy, onNavigate }: { data: any; copy: any; onNavigate: (s: string) => void }) {
  return (
    <div className="pro-panel">
      <h2>Calendar</h2>
      <p className="muted-light">Calendar view coming soon. Use Appointments for scheduling.</p>
      <button className="pro-primary" onClick={() => onNavigate('Appointments')}>
        Go to Appointments
      </button>
    </div>
  );
}

export function FollowUpsView({ data, copy, onLog, toast }: { data: any; copy: any; onLog: any; toast: any }) {
  return (
    <div className="pro-panel">
      <h2>Follow-ups</h2>
      <p className="muted-light">Follow-up management coming soon.</p>
    </div>
  );
}

export function ChambersView({ data, copy, onLog, toast }: { data: any; copy: any; onLog: any; toast: any }) {
  return (
    <div className="pro-panel">
      <h2>Chambers</h2>
      <p className="muted-light">Chamber management coming soon.</p>
    </div>
  );
}

function AppointmentDetail({
  appt,
  onClose,
  copy,
}: {
  appt: Appointment;
  onClose: () => void;
  copy: any;
}) {
  return (
    <Drawer open onClose={onClose} title={`Appointment ${appt.id}`} width={620}>
      <div className="adm-profile">
        <div className="adm-profile-hero">
          <Avatar name={appt.patient} size={64} />
          <div className="adm-profile-meta">
            <h2>{appt.patient}</h2>
            <p>
              {appt.service} · {appt.chamber}
            </p>
            <div className="adm-profile-tags">
              <Pill tone="blue">{appt.type}</Pill>
              <Pill tone={appt.status === 'Confirmed' ? 'teal' : 'sand'}>{appt.status}</Pill>
            </div>
          </div>
        </div>

        <div className="adm-detail-grid">
          <div>
            <CalendarDays size={14} />
            <span>Date</span>
            <strong>{appt.date}</strong>
          </div>
          <div>
            <Clock size={14} />
            <span>Time</span>
            <strong>{appt.time} · {appt.duration}</strong>
          </div>
          <div>
            <MapPin size={14} />
            <span>Chamber</span>
            <strong>{appt.chamber}</strong>
          </div>
          <div>
            <Stethoscope size={14} />
            <span>Doctor</span>
            <strong>{appt.doctor}</strong>
          </div>
          <div>
            <Users size={14} />
            <span>Fee</span>
            <strong>{formatBn(appt.fee)}</strong>
          </div>
        </div>

        {appt.notes && (
          <>
            <h4 className="adm-section-h">Notes</h4>
            <p style={{ color: '#516974', fontSize: 13, lineHeight: 1.6 }}>{appt.notes}</p>
          </>
        )}
      </div>
    </Drawer>
  );
}
