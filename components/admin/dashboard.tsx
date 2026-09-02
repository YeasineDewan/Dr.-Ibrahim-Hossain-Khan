'use client'
import {
  CalendarDays, Users, ShoppingBag, ClipboardList, ArrowUpRight, ChevronRight, MoreHorizontal, Plus,
  TrendingUp, Activity as ActivityIcon, Clock, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react'
import { Avatar, BarChart, Donut, Pill, Sparkline, Stat } from '../admin-ui'
import type { AdminData } from '../../lib/admin-data'

export function DashboardView({ data, copy, onNavigate }: { data: AdminData; copy: any; onNavigate: (s: string) => void }) {
  const today = '2026-06-18'
  const todays = data.appointments.filter(a => a.date === today).sort((a, b) => a.time.localeCompare(b.time))
  const overdue = data.followUps.filter(f => f.status === 'Overdue').length
  const unread = data.notifications.filter(n => !n.read).length

  return (
    <>
      <section className="admin-welcome-row"><div><span className="pro-kicker">{copy.today}</span><h1>{copy.goodMorning}</h1><p>{copy.dashboardSub}</p></div><div className="admin-quick-actions"><button className="pro-primary" onClick={() => onNavigate('Appointments')}><Plus size={15}/> {copy.newAppt}</button><button className="pro-outline" onClick={() => onNavigate('Patients')}><Users size={15}/> {copy.addVisit}</button><button className="pro-icon-button" onClick={() => onNavigate('Reports')} aria-label={copy.reports}><ArrowUpRight size={16}/></button></div></section>
      <section className="pulse-banner">
        <div>
          <span className="pro-kicker">{copy.pulseKicker}</span>
          <h2>{copy.pulseTitle}</h2>
          <p>{copy.pulseBody} · {overdue > 0 && <b className="coral">⚠ {overdue} overdue</b>}{unread > 0 && <b className="gold"> · {unread} notifications</b>}</p>
        </div>
        <div className="pulse-status">
          <span className="live-dot"/>
          <div>
            <strong>{copy.pulseStatus}</strong>
            <small>Last sync · just now</small>
          </div>
        </div>
        <div className="pulse-actions">
          <button className="pulse-cta" onClick={() => onNavigate('Calendar')}><CalendarDays size={15}/> {copy.viewSchedule}</button>
          <button className="pulse-cta primary" onClick={() => onNavigate('Appointments')}><Plus size={15}/> {copy.newAppt}</button>
        </div>
      </section>

      <div className="pro-kpi-grid adm-stagger">
        {copy.kpis.map((k: any, i: number) => {
          const icons = [CalendarDays, Users, ShoppingBag, ClipboardList]
          const tones = ['teal', 'blue', 'gold', 'coral']
          const sparks = [[40, 55, 48, 70, 62, 80, 75, 90], [60, 70, 65, 80, 75, 88, 92, 95], [30, 45, 50, 60, 55, 70, 80, 85], [12, 9, 14, 8, 11, 7, 9, 5]]
          return (
            <button key={i} className="pro-kpi" onClick={() => onNavigate(i === 0 ? 'Appointments' : i === 1 ? 'Patients' : i === 2 ? 'Orders' : 'Follow-ups')}>
              <span className={`pro-kpi-mark ${tones[i]}`}>{(() => { const I = icons[i]; return <I size={18}/> })()}</span>
              <div>
                <small>{k.label}</small>
                <strong>{k.value}</strong>
                <em className={tones[i] === 'coral' ? 'warning' : ''}>{k.delta}</em>
              </div>
              <Sparkline values={sparks[i]} color={tones[i] === 'teal' ? '#3b9b91' : tones[i] === 'blue' ? '#174b78' : tones[i] === 'gold' ? '#e3a443' : '#e77761'}/>
              <ArrowUpRight size={15} className="kpi-arrow"/>
            </button>
          )
        })}
      </div>

      <div className="pro-dashboard-grid adm-stagger">
        <section className="pro-panel schedule-panel">
          <div className="pro-panel-head">
            <div>
              <span className="pro-kicker">{copy.scheduleKicker}</span>
              <h2>{copy.scheduleTitle}</h2>
            </div>
            <div className="panel-head-actions">
              <button className="pro-pill-btn" onClick={() => onNavigate('Calendar')}><CalendarDays size={13}/> {copy.calendar}</button>
              <button className="panel-more"><MoreHorizontal size={18}/></button>
            </div>
          </div>
          <div className="schedule-timeline">
            {todays.map((a, i) => {
              const tone = a.status === 'Confirmed' ? 'teal' : a.status === 'Pending' ? 'sand' : a.status === 'Waitlist' ? 'blue' : 'neutral'
              return (
                <div className="timeline-row" key={a.id} style={{ animationDelay: `${i * 50}ms` }}>
                  <time>{a.time}</time>
                  <span className="timeline-dot"/>
                  <Avatar name={a.patient}/>
                  <div>
                    <strong>{a.patient}</strong>
                    <small>{a.service} · {a.chamber} · {a.duration}</small>
                  </div>
                  <Pill tone={tone as any}>{a.status}</Pill>
                </div>
              )
            })}
          </div>
          <div className="panel-foot">
            <button className="pro-text-link" onClick={() => onNavigate('Appointments')}>View all appointments <ChevronRight size={14}/></button>
          </div>
        </section>

        <section className="pro-panel">
          <div className="pro-panel-head">
            <div>
              <span className="pro-kicker">{copy.perfKicker}</span>
              <h2>{copy.perfTitle}</h2>
            </div>
            <Pill tone="teal"><TrendingUp size={11}/> +18.4%</Pill>
          </div>
          <BarChart values={[42, 58, 49, 71, 63, 82, 76, 91, 86, 96, 89, 100]} labels={['J','F','M','A','M','J','J','A','S','O','N','D']} color="#174b78"/>
          <div className="perf-legend">
            <div><span className="dot teal"/> {copy.appointmentsLabel}</div>
            <div><span className="dot gold"/> {copy.revenueLabel}</div>
          </div>
        </section>
      </div>

      <div className="pro-dashboard-grid adm-stagger">
        <section className="pro-panel">
          <div className="pro-panel-head">
            <div><span className="pro-kicker">{copy.patientFlowKicker}</span><h2>{copy.patientFlowTitle}</h2></div>
            <select className="pro-mini-select"><option>{copy.last30Days}</option><option>{copy.last90Days}</option></select>
          </div>
          <div className="donut-row">
            <Donut value={68} total={100} label={copy.returning} color="#174b78"/>
            <Donut value={32} total={100} label={copy.newPatients} color="#3b9b91"/>
          </div>
          <ul className="adm-list">
            <li><span className="dot blue"/> {copy.returning} <strong>1,418</strong></li>
            <li><span className="dot teal"/> {copy.newPatients} <strong>666</strong></li>
            <li><span className="dot gold"/> {copy.averageVisits} <strong>3.2</strong></li>
          </ul>
        </section>

        <section className="pro-panel">
          <div className="pro-panel-head">
            <div><span className="pro-kicker">FOLLOW-UPS</span><h2>Action required</h2></div>
            <button className="pro-pill-btn" onClick={() => onNavigate('Follow-ups')}>View all</button>
          </div>
          <ul className="adm-task-list">
            {data.followUps.filter(f => f.status !== 'Completed').slice(0, 5).map(f => (
              <li key={f.id}>
                <span className={`task-prio ${f.priority.toLowerCase()}`}/>
                <Avatar name={f.patient} size={32}/>
                <div className="grow">
                  <strong>{f.patient}</strong>
                  <small>{f.reason} · due {f.dueDate}</small>
                </div>
                <Pill tone={f.status === 'Overdue' ? 'coral' : 'sand'}>{f.status}</Pill>
              </li>
            ))}
          </ul>
        </section>

        <section className="pro-panel">
          <div className="pro-panel-head">
            <div><span className="pro-kicker">RECENT ACTIVITY</span><h2>Today</h2></div>
            <button className="pro-pill-btn" onClick={() => onNavigate('Activity log')}>Full log</button>
          </div>
          <ul className="adm-activity-list">
            {data.activity.slice(0, 5).map(a => (
              <li key={a.id}>
                <Avatar name={a.user} size={28}/>
                <div className="grow">
                  <strong>{a.user}</strong> <span className="muted-light">{a.action}</span> <strong>{a.target}</strong>
                  <small>{a.time}</small>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
