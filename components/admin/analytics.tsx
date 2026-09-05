'use client';
import { useState } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity as ActivityIcon,
  MoreHorizontal,
} from 'lucide-react';
import { BarChart, Sparkline, Pill, Avatar } from '../admin-ui';

export function AnalyticsView({ copy }: { copy: any }) {
  const [range, setRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const series = {
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [12, 18, 14, 22, 19, 9, 6],
    },
    '30d': { labels: ['W1', 'W2', 'W3', 'W4'], values: [78, 92, 84, 108] },
    '90d': { labels: ['Jan', 'Feb', 'Mar'], values: [220, 245, 280] },
    '1y': { labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [720, 810, 950, 1020] },
  };
  const s = series[range];
  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">ANALYTICS</span>
          <h1>Clinic insights</h1>
          <p className="muted-light">Real-time view of appointments, revenue, and patient flow.</p>
        </div>
        <div className="adm-segmented">
          {(['7d', '30d', '90d', '1y'] as const).map(r => (
            <button key={r} className={range === r ? 'on' : ''} onClick={() => setRange(r)}>
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      <div className="adm-stat-grid adm-stagger">
        <div className="adm-stat-card blue">
          <div className="adm-stat-card-head">
            <span>
              <Calendar size={16} /> Appointments
            </span>
            <Pill tone="teal">
              <ArrowUpRight size={10} /> +12.4%
            </Pill>
          </div>
          <strong>1,284</strong>
          <Sparkline values={[60, 70, 65, 80, 75, 88, 92, 95]} color="#174b78" />
        </div>
        <div className="adm-stat-card teal">
          <div className="adm-stat-card-head">
            <span>
              <Users size={16} /> New patients
            </span>
            <Pill tone="teal">
              <ArrowUpRight size={10} /> +8.1%
            </Pill>
          </div>
          <strong>342</strong>
          <Sparkline values={[20, 28, 25, 32, 30, 38, 40, 42]} color="#3b9b91" />
        </div>
        <div className="adm-stat-card gold">
          <div className="adm-stat-card-head">
            <span>
              <DollarSign size={16} /> Revenue
            </span>
            <Pill tone="gold">
              <ArrowUpRight size={10} /> +16.2%
            </Pill>
          </div>
          <strong>৳ 18.2L</strong>
          <Sparkline values={[40, 55, 50, 65, 70, 78, 82, 90]} color="#e3a443" />
        </div>
        <div className="adm-stat-card coral">
          <div className="adm-stat-card-head">
            <span>
              <ActivityIcon size={16} /> No-shows
            </span>
            <Pill tone="coral">
              <ArrowDownRight size={10} /> -3.1%
            </Pill>
          </div>
          <strong>4.2%</strong>
          <Sparkline values={[12, 10, 11, 8, 9, 7, 6, 5]} color="#e77761" />
        </div>
      </div>

      <div className="pro-dashboard-grid adm-stagger">
        <section className="pro-panel">
          <div className="pro-panel-head">
            <div>
              <span className="pro-kicker">APPOINTMENTS</span>
              <h2>Volume by period</h2>
            </div>
            <button className="panel-more">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <BarChart values={s.values} labels={s.labels} color="#174b78" />
        </section>

        <section className="pro-panel">
          <div className="pro-panel-head">
            <div>
              <span className="pro-kicker">REVENUE</span>
              <h2>By service</h2>
            </div>
          </div>
          <ul className="adm-rank-list">
            {[
              { name: 'PRP Therapy', value: 92, color: '#174b78' },
              { name: 'Sexual health', value: 78, color: '#3b9b91' },
              { name: 'Skin consultation', value: 65, color: '#e3a443' },
              { name: 'Fertility care', value: 54, color: '#6f4f9b' },
              { name: 'Integrative Medicine', value: 41, color: '#a95044' },
            ].map(r => (
              <li key={r.name}>
                <span className="dot" style={{ background: r.color }} />
                <span className="grow">{r.name}</span>
                <div className="adm-bar-track">
                  <span style={{ width: `${r.value}%`, background: r.color }} />
                </div>
                <strong>{r.value}%</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="pro-dashboard-grid adm-stagger">
        <section className="pro-panel">
          <div className="pro-panel-head">
            <div>
              <span className="pro-kicker">CHAMBERS</span>
              <h2>Utilization</h2>
            </div>
          </div>
          <div className="donut-row">
            <DonutCard label="Dhanmondi" value={78} total={100} color="#174b78" />
            <DonutCard label="Banglamotor" value={62} total={100} color="#3b9b91" />
            <DonutCard label="Uttara" value={45} total={100} color="#e3a443" />
          </div>
        </section>

        <section className="pro-panel">
          <div className="pro-panel-head">
            <div>
              <span className="pro-kicker">TOP DOCTORS</span>
              <h2>This month</h2>
            </div>
          </div>
          <ul className="adm-rank-list">
            {[
              { name: 'Dr. Ibrahim', count: 248, color: '#174b78' },
              { name: 'Dr. Mensah', count: 182, color: '#3b9b91' },
              { name: 'Dr. Owusu', count: 145, color: '#e3a443' },
              { name: 'Dr. Boateng', count: 98, color: '#6f4f9b' },
            ].map(d => (
              <li key={d.name}>
                <Avatar name={d.name} />
                <span className="grow">{d.name}</span>
                <div className="adm-bar-track">
                  <span style={{ width: `${(d.count / 248) * 100}%`, background: d.color }} />
                </div>
                <strong>{d.count}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function DonutCard({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = (value / total) * 100;
  const r = 38,
    c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="adm-donut-card">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e6edee" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="adm-donut-center">
        <strong>{Math.round(pct)}%</strong>
        <small>{label}</small>
      </div>
    </div>
  );
}

export function ActivityLogView({ data, copy }: { data: any; copy: any }) {
  const [filter, setFilter] = useState('All');
  const list =
    filter === 'All'
      ? data.activity
      : data.activity.filter((a: any) => a.action === filter.toLowerCase());
  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">ACTIVITY</span>
          <h1>Activity log</h1>
          <p className="muted-light">
            A complete audit trail of changes made across the workspace.
          </p>
        </div>
        <div className="adm-segmented">
          {['All', 'Updated', 'Created', 'Approved', 'Refunded', 'Flagged'].map(f => (
            <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="pro-panel">
        <ul className="adm-timeline-list">
          {list.map((a: any, i: number) => (
            <li key={a.id} style={{ animationDelay: `${i * 40}ms` }}>
              <span className="adm-timeline-dot" />
              <Avatar name={a.user} size={32} />
              <div className="grow">
                <div>
                  <strong>{a.user}</strong> <span className="adm-action">{a.action}</span>{' '}
                  <strong>{a.target}</strong>
                </div>
                <small>
                  {a.time} · {a.ip}
                </small>
              </div>
              <Pill
                tone={a.action === 'flagged' ? 'coral' : a.action === 'approved' ? 'teal' : 'blue'}>
                {a.action}
              </Pill>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
