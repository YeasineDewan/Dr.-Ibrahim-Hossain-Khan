'use client';
import { useState } from 'react';
import {
  Plus,
  Search,
  X,
  Edit3,
  Trash2,
  Save,
  Bell,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Key,
  Database,
  CreditCard,
  Globe,
  User,
  MoreHorizontal,
  Check,
  Download,
  Send,
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
  Toggle,
  BarChart,
  Sparkline,
} from '../admin-ui';
import type { AdminData, Notification } from '../../lib/admin-data';

// ────────────────────────────────────────────────────────────
// REPORTS
// ────────────────────────────────────────────────────────────
export function ReportsView({ copy }: { copy: any }) {
  const [tab, setTab] = useState<
    'overview' | 'appointments' | 'revenue' | 'patients' | 'inventory'
  >('overview');
  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">REPORTS</span>
          <h1>Reports & analytics</h1>
          <p className="muted-light">Export, share and analyze clinic data</p>
        </div>
        <div className="adm-head-actions">
          <button className="pro-outline">
            <Send size={14} /> Email report
          </button>
          <button className="pro-primary">
            <Download size={14} /> Export PDF
          </button>
        </div>
      </section>
      <div className="adm-tabs">
        <button className={tab === 'overview' ? 'on' : ''} onClick={() => setTab('overview')}>
          Overview
        </button>
        <button
          className={tab === 'appointments' ? 'on' : ''}
          onClick={() => setTab('appointments')}>
          Appointments
        </button>
        <button className={tab === 'revenue' ? 'on' : ''} onClick={() => setTab('revenue')}>
          Revenue
        </button>
        <button className={tab === 'patients' ? 'on' : ''} onClick={() => setTab('patients')}>
          Patients
        </button>
        <button className={tab === 'inventory' ? 'on' : ''} onClick={() => setTab('inventory')}>
          Inventory
        </button>
      </div>

      {tab === 'overview' && (
        <>
          <div className="adm-stat-grid adm-stagger">
            <div className="adm-stat-card blue">
              <strong>৳ 18.2L</strong>
              <small>Total revenue</small>
              <Sparkline values={[40, 55, 50, 65, 70, 78, 82, 90]} color="#174b78" />
            </div>
            <div className="adm-stat-card teal">
              <strong>2,084</strong>
              <small>Total patients</small>
              <Sparkline values={[60, 70, 65, 80, 75, 88, 92, 95]} color="#3b9b91" />
            </div>
            <div className="adm-stat-card gold">
              <strong>1,284</strong>
              <small>Appointments</small>
              <Sparkline values={[30, 45, 50, 60, 55, 70, 80, 85]} color="#e3a443" />
            </div>
            <div className="adm-stat-card coral">
              <strong>4.2%</strong>
              <small>No-show rate</small>
              <Sparkline values={[12, 10, 11, 8, 9, 7, 6, 5]} color="#e77761" />
            </div>
          </div>
          <section className="pro-panel">
            <h4>Monthly performance</h4>
            <BarChart
              values={[78, 92, 84, 108, 118, 124, 132, 145, 138, 152, 161, 178]}
              labels={['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']}
              color="#174b78"
            />
          </section>
        </>
      )}

      {tab === 'appointments' && (
        <section className="pro-panel">
          <h4>Appointments by service</h4>
          <BarChart
            values={[248, 182, 145, 98, 78, 64, 41, 32]}
            labels={[
              'Skin',
              'Sexual',
              'General',
              'PRP',
              'Vitiligo',
              'Psoriasis',
              'IBS',
              'Integrative',
            ]}
            color="#3b9b91"
          />
        </section>
      )}

      {tab === 'revenue' && (
        <>
          <section className="pro-panel">
            <h4>Revenue trend (12 months)</h4>
            <BarChart
              values={[10, 12, 15, 18, 16, 22, 25, 28, 26, 32, 35, 42]}
              labels={['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']}
              color="#e3a443"
            />
          </section>
          <section className="pro-panel">
            <h4>Revenue by payment method</h4>
            <ul className="adm-rank-list">
              <li>
                <span className="dot" style={{ background: '#174b78' }} />
                <span className="grow">Card payment</span>
                <div className="adm-bar-track">
                  <span style={{ width: '58%', background: '#174b78' }} />
                </div>
                <strong>58%</strong>
              </li>
              <li>
                <span className="dot" style={{ background: '#3b9b91' }} />
                <span className="grow">Cash on delivery</span>
                <div className="adm-bar-track">
                  <span style={{ width: '28%', background: '#3b9b91' }} />
                </div>
                <strong>28%</strong>
              </li>
              <li>
                <span className="dot" style={{ background: '#e3a443' }} />
                <span className="grow">Mobile wallet</span>
                <div className="adm-bar-track">
                  <span style={{ width: '14%', background: '#e3a443' }} />
                </div>
                <strong>14%</strong>
              </li>
            </ul>
          </section>
        </>
      )}

      {tab === 'patients' && (
        <section className="pro-panel">
          <h4>Patient demographics</h4>
          <ul className="adm-rank-list">
            <li>
              <span className="dot blue" />
              <span className="grow">Female</span>
              <div className="adm-bar-track">
                <span style={{ width: '62%' }} />
              </div>
              <strong>62%</strong>
            </li>
            <li>
              <span className="dot teal" />
              <span className="grow">Male</span>
              <div className="adm-bar-track">
                <span style={{ width: '36%' }} />
              </div>
              <strong>36%</strong>
            </li>
            <li>
              <span className="dot gold" />
              <span className="grow">Other</span>
              <div className="adm-bar-track">
                <span style={{ width: '2%' }} />
              </div>
              <strong>2%</strong>
            </li>
          </ul>
        </section>
      )}

      {tab === 'inventory' && (
        <section className="pro-panel">
          <h4>Top selling products</h4>
          <ul className="adm-rank-list">
            {[
              'Daily Defence SPF 50',
              'Magnesium Complex',
              'Calm + Restore Serum',
              'Daily Balance Probiotic',
              'Calm Skin Barrier Cream',
            ].map((n, i) => (
              <li key={n}>
                <Avatar name={n} />
                <span className="grow">{n}</span>
                <div className="adm-bar-track">
                  <span style={{ width: `${90 - i * 12}%` }} />
                </div>
                <strong>{280 - i * 32} sold</strong>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ────────────────────────────────────────────────────────────
export function NotificationsView({
  data,
  copy,
  onLog,
  toast,
}: {
  data: AdminData;
  copy: any;
  onLog: any;
  toast: any;
}) {
  const [filter, setFilter] = useState('All');
  const list = data.notifications.filter(n =>
    filter === 'All' ? true : n.type === filter.toLowerCase()
  );
  const markAll = () => {
    data.setNotifications(data.notifications.map(n => ({ ...n, read: true })));
    toast.show('All marked as read');
  };
  const markOne = (id: string) => {
    data.setNotifications(data.notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
  };
  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">SYSTEM</span>
          <h1>Notifications</h1>
          <p className="muted-light">
            {data.notifications.filter(n => !n.read).length} unread of {data.notifications.length}
          </p>
        </div>
        <div className="adm-head-actions">
          <button className="pro-outline" onClick={markAll}>
            Mark all as read
          </button>
          <button className="pro-primary">
            <Plus size={14} /> New alert
          </button>
        </div>
      </section>
      <div className="adm-tabs">
        {['All', 'Appointment', 'Order', 'Stock', 'Patient', 'System'].map(f => (
          <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      <section className="pro-panel">
        <ul className="adm-notif-list">
          {list.map((n: any) => {
            const icon =
              n.type === 'appointment' ? (
                <Bell size={16} />
              ) : n.type === 'order' ? (
                <Send size={16} />
              ) : n.type === 'stock' ? (
                <Database size={16} />
              ) : n.type === 'patient' ? (
                <User size={16} />
              ) : (
                <ShieldCheck size={16} />
              );
            const tone =
              n.type === 'stock'
                ? 'coral'
                : n.type === 'order'
                  ? 'gold'
                  : n.type === 'patient'
                    ? 'teal'
                    : 'blue';
            return (
              <li key={n.id} className={n.read ? '' : 'unread'} onClick={() => markOne(n.id)}>
                <span className={`adm-notif-icon adm-notif-${n.type}`}>{icon}</span>
                <div className="grow">
                  <strong>{n.title}</strong>
                  <p>{n.body}</p>
                  <small>{n.time}</small>
                </div>
                {!n.read && <span className="adm-dot-unread" />}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

// ────────────────────────────────────────────────────────────
// USERS & ROLES
// ────────────────────────────────────────────────────────────
export function UsersView({
  data,
  copy,
  onLog,
  toast,
}: {
  data: AdminData;
  copy: any;
  onLog: any;
  toast: any;
}) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const onSave = (u: any) => {
    data.addUser(u);
    onLog('Dr. Ibrahim', 'updated', `User ${u.name}`);
    toast.show(copy.saved);
    setShow(false);
    setEditing(null);
  };
  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">SYSTEM</span>
          <h1>Users & roles</h1>
          <p className="muted-light">
            {data.users.length} users ·{' '}
            {data.users.filter((u: any) => u.status === 'Active').length} active
          </p>
        </div>
        <div className="adm-head-actions">
          <button
            className="pro-primary"
            onClick={() => {
              setEditing(null);
              setShow(true);
            }}>
            <Plus size={14} /> Invite user
          </button>
        </div>
      </section>
      <div className="adm-stat-grid adm-stagger">
        <div className="adm-stat-card blue">
          <strong>{data.users.length}</strong>
          <small>Total users</small>
        </div>
        <div className="adm-stat-card teal">
          <strong>{data.users.filter((u: any) => u.status === 'Active').length}</strong>
          <small>Active</small>
        </div>
        <div className="adm-stat-card gold">
          <strong>4</strong>
          <small>Roles</small>
        </div>
        <div className="adm-stat-card coral">
          <strong>{data.users.filter((u: any) => u.status === 'Inactive').length}</strong>
          <small>Inactive</small>
        </div>
      </div>
      <section className="pro-panel">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last login</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data.users.map((u: any) => (
                <tr key={u.id}>
                  <td>
                    <div className="adm-cell-person">
                      <Avatar name={u.name} />
                      <div>
                        <strong>{u.name}</strong>
                        <small>{u.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Pill tone="blue">{u.role}</Pill>
                  </td>
                  <td>
                    <Pill tone={u.status === 'Active' ? 'teal' : 'sand'}>{u.status}</Pill>
                  </td>
                  <td>{u.lastLogin}</td>
                  <td>
                    <div className="adm-row-actions">
                      <button
                        onClick={() => {
                          setEditing(u);
                          setShow(true);
                        }}>
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="danger"
                        onClick={() => {
                          data.removeUser(u.id);
                          toast.show(copy.deleted, 'error');
                        }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="pro-panel">
        <h4>Roles & permissions</h4>
        <ul className="adm-role-list adm-stagger">
          {[
            { name: 'Admin', desc: 'Full access', perms: 28 },
            { name: 'Front Desk', desc: 'Appointments, patients, billing', perms: 12 },
            { name: 'Nurse', desc: 'Patients, vitals, prescriptions', perms: 9 },
            { name: 'Pharmacist', desc: 'Products, inventory, orders', perms: 7 },
          ].map((r, i) => (
            <li key={i}>
              <div className="adm-role-mark">{r.name[0]}</div>
              <div className="grow">
                <strong>{r.name}</strong>
                <small>
                  {r.desc} · {r.perms} permissions
                </small>
              </div>
              <button className="pro-outline">Edit</button>
            </li>
          ))}
        </ul>
      </section>
      {show && (
        <Modal
          open
          onClose={() => setShow(false)}
          title={editing ? 'Edit user' : 'Invite user'}
          footer={
            <>
              <button className="pro-outline" onClick={() => setShow(false)}>
                Cancel
              </button>
              <button
                className="pro-primary"
                onClick={() =>
                  onSave(
                    editing || {
                      id: `U-${data.users.length + 100}`,
                      name: 'New user',
                      email: 'new@dribrahim.clinic',
                      role: 'Front Desk',
                      status: 'Active',
                      lastLogin: '—',
                      avatar: 'NU',
                    }
                  )
                }>
                <Save size={14} /> {editing ? 'Save' : 'Invite'}
              </button>
            </>
          }>
          <div className="adm-form-grid">
            <Field label="Name" required>
              <Input
                value={editing?.name || ''}
                onChange={e => setEditing({ ...(editing || {}), name: e.target.value })}
              />
            </Field>
            <Field label="Email" required>
              <Input
                type="email"
                value={editing?.email || ''}
                onChange={e => setEditing({ ...(editing || {}), email: e.target.value })}
              />
            </Field>
            <Field label="Role">
              <Select
                value={editing?.role || 'Front Desk'}
                onChange={e => setEditing({ ...(editing || {}), role: e.target.value })}>
                <option>Admin</option>
                <option>Front Desk</option>
                <option>Nurse</option>
                <option>Pharmacist</option>
                <option>Manager</option>
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={editing?.status || 'Active'}
                onChange={e => setEditing({ ...(editing || {}), status: e.target.value })}>
                <option>Active</option>
                <option>Inactive</option>
              </Select>
            </Field>
          </div>
        </Modal>
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────
// SETTINGS
// ────────────────────────────────────────────────────────────
export function SettingsView({
  copy,
  onLog,
  toast,
  data,
}: {
  copy: any;
  onLog: any;
  toast: any;
  data: any;
}) {
  const [tab, setTab] = useState<'general' | 'payment' | 'email' | 'security' | 'backup'>(
    'general'
  );
  const [settings, setSettings] = useState({
    clinicName: 'DR.IBRAHIM HOSSAIN',
    clinicEmail: 'hello@dribrahim.clinic',
    clinicPhone: '+880 1719 395 553',
    clinicAddress: 'House 45, Road 22, Dhanmondi, Dhaka 1209',
    currency: 'BDT',
    timezone: 'Asia/Dhaka',
    language: 'English',
    apptNotif: true,
    orderNotif: true,
    stockAlerts: true,
    patientNotif: true,
    emailNotif: true,
    smsNotif: true,
    twoFactor: true,
    sessionTimeout: '30 minutes',
    autoBackup: true,
    backupFrequency: 'Daily',
  });
  const set = (k: string, v: any) => setSettings({ ...settings, [k]: v });
  const onSave = () => {
    onLog('Dr. Ibrahim', 'updated', 'Settings');
    toast.show(copy.saved);
  };
  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">SYSTEM</span>
          <h1>Settings</h1>
          <p className="muted-light">Clinic-wide configuration</p>
        </div>
        <div className="adm-head-actions">
          <button className="pro-primary" onClick={onSave}>
            <Save size={14} /> Save changes
          </button>
        </div>
      </section>
      <div className="adm-tabs">
        {(
          [
            ['general', 'General', <Globe size={14} />],
            ['payment', 'Payment', <CreditCard size={14} />],
            ['email', 'Email / SMS', <Mail size={14} />],
            ['security', 'Security', <ShieldCheck size={14} />],
            ['backup', 'Backup', <Database size={14} />],
          ] as const
        ).map(([id, lbl, icon]) => (
          <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id as any)}>
            {icon} {lbl}
          </button>
        ))}
      </div>
      <section className="pro-panel">
        {tab === 'general' && (
          <>
            <div className="adm-form-grid">
              <Field label="Clinic name" required>
                <Input
                  value={settings.clinicName}
                  onChange={e => set('clinicName', e.target.value)}
                />
              </Field>
              <Field label="Clinic email" required>
                <Input
                  value={settings.clinicEmail}
                  onChange={e => set('clinicEmail', e.target.value)}
                />
              </Field>
              <Field label="Clinic phone">
                <Input
                  value={settings.clinicPhone}
                  onChange={e => set('clinicPhone', e.target.value)}
                />
              </Field>
              <Field label="Currency">
                <Select value={settings.currency} onChange={e => set('currency', e.target.value)}>
                  <option>BDT</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </Select>
              </Field>
              <Field label="Timezone">
                <Select value={settings.timezone} onChange={e => set('timezone', e.target.value)}>
                  <option>Asia/Dhaka</option>
                  <option>Asia/Kolkata</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                </Select>
              </Field>
              <Field label="Language">
                <Select value={settings.language} onChange={e => set('language', e.target.value)}>
                  <option>English</option>
                  <option>বাংলা</option>
                  <option>Both</option>
                </Select>
              </Field>
            </div>
            <Field label="Address">
              <Textarea
                rows={2}
                value={settings.clinicAddress}
                onChange={e => set('clinicAddress', e.target.value)}
              />
            </Field>
          </>
        )}
        {tab === 'payment' && (
          <>
            <div className="adm-form-grid">
              <Field label="Default currency">
                <Select value={settings.currency} onChange={e => set('currency', e.target.value)}>
                  <option>BDT</option>
                  <option>USD</option>
                </Select>
              </Field>
              <Field label="Payment provider">
                <Select>
                  <option>bKash</option>
                  <option>Nagad</option>
                  <option>Stripe</option>
                  <option>SSLCommerz</option>
                </Select>
              </Field>
            </div>
            <h4 className="adm-section-h">Accepted methods</h4>
            <div className="adm-toggle-grid">
              {['Cash on delivery', 'bKash', 'Nagad', 'Card payment', 'Bank transfer'].map(m => (
                <Toggle key={m} checked label={m} onChange={() => {}} />
              ))}
            </div>
          </>
        )}
        {tab === 'email' && (
          <>
            <h4 className="adm-section-h">Channels</h4>
            <div className="adm-toggle-grid">
              <Toggle
                checked={settings.emailNotif}
                onChange={v => set('emailNotif', v)}
                label="Email notifications"
              />
              <Toggle
                checked={settings.smsNotif}
                onChange={v => set('smsNotif', v)}
                label="SMS notifications"
              />
            </div>
            <h4 className="adm-section-h">Triggers</h4>
            <div className="adm-toggle-grid">
              <Toggle
                checked={settings.apptNotif}
                onChange={v => set('apptNotif', v)}
                label="Appointment notifications"
              />
              <Toggle
                checked={settings.orderNotif}
                onChange={v => set('orderNotif', v)}
                label="Order notifications"
              />
              <Toggle
                checked={settings.stockAlerts}
                onChange={v => set('stockAlerts', v)}
                label="Stock alerts"
              />
              <Toggle
                checked={settings.patientNotif}
                onChange={v => set('patientNotif', v)}
                label="Patient notifications"
              />
            </div>
            <h4 className="adm-section-h">Templates</h4>
            <ul className="adm-faq-list">
              {[
                'Appointment confirmed',
                'Appointment reminder (24h)',
                'Order confirmed',
                'Welcome patient',
              ].map(t => (
                <li key={t}>
                  <div className="grow">
                    <strong>{t}</strong>
                    <p>Email & SMS template with placeholders.</p>
                  </div>
                  <button className="pro-outline">Edit</button>
                </li>
              ))}
            </ul>
          </>
        )}
        {tab === 'security' && (
          <>
            <div className="adm-toggle-grid">
              <Toggle
                checked={settings.twoFactor}
                onChange={v => set('twoFactor', v)}
                label="Two-factor authentication"
              />
              <Toggle checked={true} onChange={() => {}} label="Strong password required" />
              <Toggle checked={true} onChange={() => {}} label="Single sign-on (SSO)" />
            </div>
            <Field label="Session timeout">
              <Select
                value={settings.sessionTimeout}
                onChange={e => set('sessionTimeout', e.target.value)}>
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
              </Select>
            </Field>
            <h4 className="adm-section-h">Login history</h4>
            <ul className="adm-faq-list">
              {data.users.map((u: any) => (
                <li key={u.id}>
                  <Avatar name={u.name} />
                  <div className="grow">
                    <strong>{u.name}</strong>
                    <small>{u.lastLogin} · 102.176.55.21</small>
                  </div>
                  <Pill tone="teal">Success</Pill>
                </li>
              ))}
            </ul>
          </>
        )}
        {tab === 'backup' && (
          <>
            <div className="adm-toggle-grid">
              <Toggle
                checked={settings.autoBackup}
                onChange={v => set('autoBackup', v)}
                label="Automatic backup"
              />
            </div>
            <div className="adm-form-grid">
              <Field label="Frequency">
                <Select
                  value={settings.backupFrequency}
                  onChange={e => set('backupFrequency', e.target.value)}>
                  <option>Hourly</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                </Select>
              </Field>
              <Field label="Storage">
                <Select>
                  <option>Cloud (AWS S3)</option>
                  <option>Google Drive</option>
                  <option>Local server</option>
                </Select>
              </Field>
            </div>
            <h4 className="adm-section-h">Recent backups</h4>
            <ul className="adm-faq-list">
              <li>
                <Database size={16} />
                <div className="grow">
                  <strong>backup-2026-06-18.zip</strong>
                  <small>248 MB · 18 Jun 2026 03:00</small>
                </div>
                <button className="pro-outline">
                  <Download size={13} /> Download
                </button>
              </li>
              <li>
                <Database size={16} />
                <div className="grow">
                  <strong>backup-2026-06-17.zip</strong>
                  <small>246 MB · 17 Jun 2026 03:00</small>
                </div>
                <button className="pro-outline">
                  <Download size={13} /> Download
                </button>
              </li>
              <li>
                <Database size={16} />
                <div className="grow">
                  <strong>backup-2026-06-16.zip</strong>
                  <small>244 MB · 16 Jun 2026 03:00</small>
                </div>
                <button className="pro-outline">
                  <Download size={13} /> Download
                </button>
              </li>
            </ul>
            <div className="adm-form-foot">
              <button className="pro-primary" onClick={() => toast.show('Backup started', 'info')}>
                Back up now
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
