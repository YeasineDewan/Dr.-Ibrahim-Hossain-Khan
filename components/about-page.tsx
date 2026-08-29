'use client'

import { useState } from 'react'
import { ArrowRight, Award, Check } from 'lucide-react'

const team = [
  { name: 'Dr. Ibrahim Hossain Khan', role: 'Lead Physician & Founder', initials: 'IK', color: 'blue', bio: 'MBChB, MRCGP · 15+ years in family & integrative medicine.' },
  { name: 'Dr. Nadia Rahman', role: 'Dermatologist', initials: 'NR', color: 'teal', bio: 'MBBS, DDV · Specialist in skin health, aesthetics and PRP therapy.' },
  { name: 'Farhan Hossain', role: 'Patient Coordinator', initials: 'FH', color: 'sand', bio: 'Ensuring every visit is smooth, warm and well-organised.' },
]

const awards = [
  { year: '2024', title: 'Best Family Clinic – Dhaka Health Awards' },
  { year: '2023', title: 'Patient Choice Award – Top Rated Physician' },
  { year: '2022', title: 'Excellence in Integrative Medicine – BMDC' },
]

const testimonials = [
  { name: 'Amara M.', text: 'Dr. Ibrahim took the time to actually listen. I left with a clear plan and real confidence in my care.', rating: 5 },
  { name: 'Daniel O.', text: 'The most thorough skin consultation I have ever had. Highly recommend the clinic to everyone.', rating: 5 },
  { name: 'Sofia B.', text: 'Warm, professional and genuinely caring. The whole team makes you feel at ease from the moment you arrive.', rating: 5 },
]

export function AboutPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [playing, setPlaying] = useState(false)
  return <>
    <section className="about-hero">
      <div className="container about-hero-grid">
        <div>
          <span className="pill">Meet your doctor</span>
          <h1>Care with <em>conviction.</em></h1>
          <p className="lead">Dr. Ibrahim is a family physician and wellness advocate who believes excellent medicine is equal parts expertise, empathy and consistency.</p>
          <div className="about-credentials">
            <div><strong>15+</strong><span>Years in practice</span></div>
            <div><strong>2,000+</strong><span>Patients supported</span></div>
            <div><strong>4.9</strong><span>Patient rating</span></div>
            <div><strong>3</strong><span>Award-winning chambers</span></div>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('Appointment')}>Book a consultation <ArrowRight size={16}/></button>
        </div>
        <div className="about-portrait">
          <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=85" alt="Dr. Ibrahim Hossain Khan"/>
          <span className="portrait-caption">Dr. Ibrahim Hossain Khan<br/><small>MBChB, MRCGP · Lead Physician</small></span>
        </div>
      </div>
    </section>

    <section className="section about-story">
      <div className="container split-grid">
        <div>
          <span className="pill">His philosophy</span>
          <h2>Better health is built on <em>trust.</em></h2>
          <p className="lead">From your first conversation to every follow-up, Dr. Ibrahim creates space for questions, context and honest decisions. His work combines rigorous clinical reasoning with practical, everyday guidance.</p>
          <p className="muted">He has a special interest in preventive care, metabolic health, skin health and helping busy families make sustainable changes without shame or extremes.</p>
        </div>
        <div className="principles">
          <div><span>01</span><div><h3>Listen first</h3><p>Understand the person, not just the symptom.</p></div></div>
          <div><span>02</span><div><h3>Explain clearly</h3><p>Make every diagnosis and option easy to understand.</p></div></div>
          <div><span>03</span><div><h3>Plan together</h3><p>Create care plans that fit your real life.</p></div></div>
          <div><span>04</span><div><h3>Follow through</h3><p>Stay with you beyond the appointment.</p></div></div>
        </div>
      </div>
    </section>

    <section className="section about-video">
      <div className="container">
        <div className="section-heading">
          <div><span className="pill pill-teal">Inside the clinic</span><h2>A minute with <em>Dr. Ibrahim.</em></h2></div>
          <p className="muted video-heading-copy">Why he chose medicine, what good care means and how to prepare for your first visit.</p>
        </div>
        <div className="video-card" onClick={() => setPlaying(!playing)}>
          <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=85" alt="Dr. Ibrahim speaking in the clinic"/>
          <div className="video-shade"/>
          <button className="play-button" aria-label={playing ? 'Pause video' : 'Play video'}>{playing ? 'Ⅱ' : '▶'}</button>
          <div className="video-meta">
            <span>CLINIC STORIES · 04:32</span>
            <strong>{playing ? 'Now playing: The art of a good consultation' : 'The art of a good consultation'}</strong>
          </div>
        </div>
      </div>
    </section>

    <section className="section about-details">
      <div className="container details-grid">
        <div>
          <span className="pill">Experience & training</span>
          <h2>Rooted in <em>evidence.</em></h2>
          <div className="timeline">
            <div><strong>2019 — Present</strong><span>Founder & Lead Physician · Dr. Ibrahim Clinic, Dhaka</span></div>
            <div><strong>2015 — 2019</strong><span>Senior Family Physician · Dhaka Medical Centre</span></div>
            <div><strong>2012 — 2015</strong><span>Dermatology & Integrative Medicine Fellowship</span></div>
            <div><strong>2008 — 2012</strong><span>MBBS · Dhaka Medical College</span></div>
          </div>
        </div>
        <div className="skills-card">
          <h3>Areas of expertise</h3>
          {['Preventive & family medicine','Skin & VD integrative medicine','PRP & aesthetic therapy','Psoriasis & vitiligo treatment','IBS & gut health','Metabolic & lifestyle health'].map((x, i) => (
            <div className="skill-row" key={x}><span>0{i + 1}</span><strong>{x}</strong><Check size={16}/></div>
          ))}
        </div>
      </div>
    </section>

    <section className="section awards-section">
      <div className="container">
        <div className="section-heading">
          <div><span className="pill">Recognition</span><h2>Trusted by patients, <em>recognised by peers.</em></h2></div>
        </div>
        <div className="awards-grid">
          {awards.map(a => (
            <div className="award-card" key={a.title}>
              <Award size={26}/>
              <div><strong>{a.year}</strong><p>{a.title}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section team-section">
      <div className="container">
        <div className="section-heading">
          <div><span className="pill pill-teal">Our team</span><h2>The people behind <em>your care.</em></h2></div>
        </div>
        <div className="team-grid">
          {team.map(m => (
            <div className={`team-card team-${m.color}`} key={m.name}>
              <div className={`team-avatar team-avatar-${m.color}`}>{m.initials}</div>
              <h3>{m.name}</h3>
              <span className="team-role">{m.role}</span>
              <p>{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section testimonials-section">
      <div className="container">
        <div className="section-heading">
          <div><span className="pill">Patient stories</span><h2>What our patients <em>say.</em></h2></div>
          <div className="rating-summary"><strong>4.9</strong><div className="stars">★★★★★</div><small className="muted">Based on 2,000+ reviews</small></div>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div className="testimonial-card" key={t.name}>
              <div className="stars">{Array(t.rating).fill('★').join('')}</div>
              <p>"{t.text}"</p>
              <div className="testimonial-author">
                <span className="person-avatar">{t.name.split(' ').map(x => x[0]).join('')}</span>
                <strong>{t.name}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="cta-section">
      <div className="container cta-inner">
        <div>
          <span className="pill pill-teal">Start a conversation</span>
          <h2>Your health deserves<br/><em>your full attention.</em></h2>
        </div>
        <div>
          <p>Come as you are. Leave with clarity, a plan and a doctor who knows your story.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('Appointment')}>Meet with Dr. Ibrahim <ArrowRight size={17}/></button>
        </div>
      </div>
    </section>
  </>
}
