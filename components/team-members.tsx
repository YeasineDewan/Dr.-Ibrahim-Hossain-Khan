'use client'

import { Star, Linkedin, Mail, Phone } from 'lucide-react'

const team = [
  {
    name: 'Dr. Ibrahim Khan',
    role: 'Founder & Lead Physician',
    specialty: 'Family Medicine & Wellness',
    bio: 'MBChB, MRCGP | 15+ years of clinical excellence',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=85',
    rating: 4.9,
    consultations: 2000,
  },
  {
    name: 'Dr. Aisha Mohamed',
    role: 'Dermatologist & Aesthetics Specialist',
    specialty: 'Skin Health & Aesthetic Procedures',
    bio: 'MD, Board-Certified Dermatologist | 8 years specializing in skin wellness',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=85',
    rating: 4.8,
    consultations: 1200,
  },
  {
    name: 'Nurse Kwame Asante',
    role: 'Senior Clinic Nurse',
    specialty: 'Patient Care & Clinical Support',
    bio: 'RN, BSc Nursing | 10 years in holistic patient care',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=85',
    rating: 4.9,
    consultations: 1500,
  },
  {
    name: 'Dr. Amara Osei',
    role: 'Nutritionist & Wellness Coach',
    specialty: 'Metabolic Health & Lifestyle Medicine',
    bio: 'MS Nutrition | Certified Health Coach | 7 years in preventive care',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=85',
    rating: 4.7,
    consultations: 800,
  },
]

export function TeamMembers() {
  return (
    <section className="section team-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="pill">Our expert team</span>
            <h2>Meet the care <em>professionals</em> behind your wellness.</h2>
          </div>
          <p className="muted">A collaborative team of specialists dedicated to your health journey.</p>
        </div>
        <div className="team-grid">
          {team.map((member) => (
            <article className="team-card" key={member.name}>
              <div className="team-image">
                <img src={member.image} alt={member.name} />
                <div className="team-overlay">
                  <div className="team-links">
                    <button className="icon-btn" aria-label="Email"><Mail size={18} /></button>
                    <button className="icon-btn" aria-label="Call"><Phone size={18} /></button>
                    <button className="icon-btn" aria-label="LinkedIn"><Linkedin size={18} /></button>
                  </div>
                </div>
              </div>
              <div className="team-content">
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-specialty">{member.specialty}</p>
                <p className="muted team-bio">{member.bio}</p>
                <div className="team-stats">
                  <div>
                    <div className="stars">★★★★★</div>
                    <small>{member.rating}</small>
                  </div>
                  <div>
                    <strong>{member.consultations}+</strong>
                    <small>Consultations</small>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
