'use client';

import { useEffect, useState, useMemo } from 'react';
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
import type { Notification } from '../../lib/admin-data';

export function ReportsView({ copy }: { copy: any }) {
  return (
    <div className="pro-panel">
      <h2>Reports</h2>
      <p className="muted-light">Reports and analytics coming soon.</p>
    </div>
  );
}

export function NotificationsView({
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const result = await res.json();
      if (result.data) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.show?.('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const list = useMemo(() => {
    return notifications.filter(n =>
      filter === 'All' ? true : n.type === filter.toLowerCase()
    );
  }, [notifications, filter]);

  const markAll = async () => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      if (!res.ok) throw new Error('Failed to mark all as read');
      fetchNotifications();
      toast.show('All marked as read');
    } catch (error) {
      toast.show?.('Failed to mark all as read', 'error');
    }
  };
  const markOne = async (id: string) => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: true }),
      });
      if (!res.ok) throw new Error('Failed to mark as read');
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
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
          <span className="pro-kicker">SYSTEM</span>
          <h1>Notifications</h1>
          <p className="muted-light">
            {notifications.filter(n => !n.read).length} unread of {notifications.length}
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

export function UsersView({
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
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const result = await res.json();
      if (result.data) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.show?.('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (u: any) => {
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = { ...u, roles: Array.isArray(u.roles) ? u.roles : [u.roles || 'Front Desk'] };
      const res = await fetch('/api/admin/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save user');
      }
      onLog('Dr. Ibrahim', 'updated', `User ${u.name}`);
      toast.show(copy.saved);
      setShow(false);
      setEditing(null);
      fetchUsers();
    } catch (error: any) {
      toast.show?.(error.message || 'Failed to save user', 'error');
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
          <span className="pro-kicker">SYSTEM</span>
          <h1>Users & roles</h1>
          <p className="muted-light">
            {users.length} users ·{' '}
            {users.filter((u: any) => u.status === 'Active').length} active
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
          <strong>{users.length}</strong>
          <small>Total users</small>
        </div>
        <div className="adm-stat-card teal">
          <strong>{users.filter((u: any) => u.status === 'Active').length}</strong>
          <small>Active</small>
        </div>
        <div className="adm-stat-card gold">
          <strong>{new Set(users.flatMap((u: any) => u.roles || [])).size}</strong>
          <small>Roles</small>
        </div>
        <div className="adm-stat-card coral">
          <strong>{users.filter((u: any) => u.status === 'Inactive').length}</strong>
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
              {users.map((u: any) => (
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
                    <Pill tone="blue">
                      {Array.isArray(u.roles) ? (u.roles[0] || 'User') : (u.role || 'User')}
                    </Pill>
                  </td>
                  <td>
                    <Pill tone={u.status === 'Active' ? 'teal' : 'sand'}>{u.status}</Pill>
                  </td>
                  <td>{u.last_login || '—'}</td>
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
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/admin/users?id=${u.id}`, { method: 'DELETE' });
                            if (!res.ok) {
                              const err = await res.json().catch(() => ({}));
                              throw new Error(err.error || 'Failed to delete user');
                            }
                            fetchUsers();
                            toast.show(copy.deleted, 'error');
                          } catch (error: any) {
                            toast.show?.(error.message || 'Failed to delete user', 'error');
                          }
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
                      id: `U-${Date.now()}`,
                      name: 'New user',
                      email: 'new@dribrahim.clinic',
                      roles: ['Front Desk'],
                      status: 'Active',
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
                value={editing?.roles?.[0] || 'Front Desk'}
                onChange={e => setEditing({ ...(editing || {}), roles: [e.target.value] })}>
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
  const [settings, setSettings] = useState({
    tab: 'general',
    clinicName: 'Dr. Ibrahim Hossain',
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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const result = await res.json();
          if (result.data) {
            setSettings((prev: any) => ({ ...prev, ...result.data }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);
  const setField = (k: string, v: any) => setSettings({ ...settings, [k]: v });
  const onSave = async () => {
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      onLog('Dr. Ibrahim', 'updated', 'Settings');
      toast.show(copy.saved);
    } catch (error) {
      toast.show?.('Failed to save settings', 'error');
    }
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
          <button key={id} className={settings.tab === id ? 'on' : ''} onClick={() => setSettings({ ...settings, tab: id })}>
            {icon} {lbl}
          </button>
        ))}
      </div>
      <section className="pro-panel">
        {(!settings.tab || settings.tab === 'general') && (
          <>
            <div className="adm-form-grid">
              <Field label="Clinic name" required>
                <Input
                  value={settings.clinicName}
                  onChange={e => setField('clinicName', e.target.value)}
                />
              </Field>
              <Field label="Clinic email" required>
                <Input
                  value={settings.clinicEmail}
                  onChange={e => setField('clinicEmail', e.target.value)}
                />
              </Field>
              <Field label="Clinic phone">
                <Input
                  value={settings.clinicPhone}
                  onChange={e => setField('clinicPhone', e.target.value)}
                />
              </Field>
              <Field label="Currency">
                <Select value={settings.currency} onChange={e => setField('currency', e.target.value)}>
                  <option>BDT</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </Select>
              </Field>
              <Field label="Timezone">
                <Select value={settings.timezone} onChange={e => setField('timezone', e.target.value)}>
                  <option>Asia/Dhaka</option>
                  <option>Asia/Kolkata</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                </Select>
              </Field>
              <Field label="Language">
                <Select value={settings.language} onChange={e => setField('language', e.target.value)}>
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
                onChange={e => setField('clinicAddress', e.target.value)}
              />
            </Field>
          </>
        )}
        {settings.tab === 'payment' && (
          <>
            <div className="adm-form-grid">
              <Field label="Default currency">
                <Select value={settings.currency} onChange={e => setField('currency', e.target.value)}>
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
        {settings.tab === 'email' && (
          <>
            <h4 className="adm-section-h">Channels</h4>
            <div className="adm-toggle-grid">
              <Toggle
                checked={settings.emailNotif}
                onChange={v => setField('emailNotif', v)}
                label="Email notifications"
              />
              <Toggle
                checked={settings.smsNotif}
                onChange={v => setField('smsNotif', v)}
                label="SMS notifications"
              />
            </div>
            <h4 className="adm-section-h">Triggers</h4>
            <div className="adm-toggle-grid">
              <Toggle
                checked={settings.apptNotif}
                onChange={v => setField('apptNotif', v)}
                label="Appointment notifications"
              />
              <Toggle
                checked={settings.orderNotif}
                onChange={v => setField('orderNotif', v)}
                label="Order notifications"
              />
              <Toggle
                checked={settings.stockAlerts}
                onChange={v => setField('stockAlerts', v)}
                label="Stock alerts"
              />
              <Toggle
                checked={settings.patientNotif}
                onChange={v => setField('patientNotif', v)}
                label="Patient notifications"
              />
            </div>
          </>
        )}
        {settings.tab === 'security' && (
          <>
            <div className="adm-toggle-grid">
              <Toggle
                checked={settings.twoFactor}
                onChange={v => setField('twoFactor', v)}
                label="Two-factor authentication"
              />
              <Toggle checked={true} onChange={() => {}} label="Strong password required" />
              <Toggle checked={true} onChange={() => {}} label="Single sign-on (SSO)" />
            </div>
            <Field label="Session timeout">
              <Select
                value={settings.sessionTimeout}
                onChange={e => setField('sessionTimeout', e.target.value)}>
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
              </Select>
            </Field>
          </>
        )}
        {settings.tab === 'backup' && (
          <>
            <div className="adm-toggle-grid">
              <Toggle
                checked={settings.autoBackup}
                onChange={v => setField('autoBackup', v)}
                label="Automatic backup"
              />
            </div>
            <div className="adm-form-grid">
              <Field label="Frequency">
                <Select
                  value={settings.backupFrequency}
                  onChange={e => setField('backupFrequency', e.target.value)}>
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
          </>
        )}
      </section>
    </>
  );
}
