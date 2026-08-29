'use client'

import { ArrowRight, Check, Heart, Sparkles, Users, Brain, Leaf, Shield } from 'lucide-react'

const servicesData = [
  {
    id: 1,
    name: 'Preventive & Family Medicine',
    icon: Heart,
    description: 'Thoughtful checkups and proactive care for every stage of life',
    details: [
      'Annual health screenings',
      'Chronic disease management',
      'Vaccination & immunizations',
      'Lifestyle counseling',
      'Preventive lab work',
      'Health risk assessments',
    ],
    price: 'From $60',
    duration: '45 minutes',
    benefits: [
      'Early detection of health issues',
      'Personalized prevention plans',
      'Long-term relationship with your doctor',
      'Continuity of care for your whole family',
    ],
  },
  {
    id: 2,
    name: 'Skin & Aesthetic Medicine',
    icon: Sparkles,
    description: 'Evidence-based treatments for skin health and aesthetic goals',
    details: [
      'Skin condition treatments',
      'PRP therapy & microneedling',
      'Chemical peels & facials',
      'Acne management programs',
      'Anti-aging treatments',
      'Dermatology consultations',
    ],
    price: 'From $80',
    duration: '60 minutes',
    benefits: [
      'Clear, healthy skin',
      'Natural-looking aesthetic improvements',
      'Boosted confidence',
      'Science-backed treatment plans',
    ],
  },
  {
    id: 3,
    name: 'Metabolic & Wellness Health',
    icon: Leaf,
    description: 'Holistic approach to metabolic health and lifestyle optimization',
    details: [
      'Metabolic assessment',
      'Weight management programs',
      'Nutrition planning',
      'Fitness coaching',
      'Gut health optimization',
      'Supplement guidance',
    ],
    price: 'From $70',
    duration: '60 minutes',
    benefits: [
      'Sustainable weight management',
      'Improved energy levels',
      'Better digestion & gut health',
      'Long-term wellness habits',
    ],
  },
  {
    id: 4,
    name: 'Women\'s Wellness',
    icon: Users,
    description: 'Comprehensive health care designed for women at every life stage',
    details: [
      'Gynecological care',
      'Reproductive health',
      'Menopause management',
      'Hormonal balance',
      'Sexual health counseling',
      'Preventive screenings',
    ],
    price: 'From $65',
    duration: '45 minutes',
    benefits: [
      'Hormonal balance & wellness',
      'Expert guidance through life transitions',
      'Preventive care tailored to women',
      'Supportive, judgment-free environment',
    ],
  },
  {
    id: 5,
    name: 'Mental Health & Stress Management',
    icon: Brain,
    description: 'Integrated mental health support and evidence-based wellness strategies',
    details: [
      'Stress & anxiety management',
      'Depression screening & support',
      'Sleep optimization',
      'Mindfulness coaching',
      'Mental health assessment',
      'Holistic wellness planning',
    ],
    price: 'From $75',
    duration: '50 minutes',
    benefits: [
      'Better stress management',
      'Improved mental clarity',
      'Enhanced sleep quality',
      'Integrated mind-body wellness',
    ],
  },
  {
    id: 6,
    name: 'Corporate Wellness',
    icon: Shield,
    description: 'Customized health programs for companies and organizations',
    details: [
      'Employee health screenings',
      'Wellness program design',
      'Health risk assessments',
      'Team wellness workshops',
      'Preventive health coaching',
      'Corporate health reporting',
    ],
    price: 'Custom quote',
    duration: 'Flexible',
    benefits: [
      'Healthier, more engaged employees',
      'Reduced healthcare costs',
      'Improved team morale',
      'Customized corporate solutions',
    ],
  },
]

function ServiceCard({ service, onBook }: { service: (typeof servicesData)[0]; onBook: () => void }) {
  const Icon = service.icon
  return (
    <article className="service-detail-card">
      <div className="service-header">
        <div className="service-icon-large">
          <Icon size={32} />
        </div>
        <div>
          <h3>{service.name}</h3>
          <p className="muted">{service.description}</p>
        </div>
      </div>

      <div className="service-details-section">
        <h4>What's included:</h4>
        <ul className="service-details-list">
          {service.details.map((detail) => (
            <li key={detail}>
              <span className="detail-dot" />
              {detail}
            </li>
          ))}
        </ul>
      </div>

      <div className="service-benefits-section">
        <h4>You'll benefit from:</h4>
        <ul className="benefits-list">
          {service.benefits.map((benefit) => (
            <li key={benefit}>
              <Check size={16} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="service-footer">
        <div className="service-meta">
          <span className="meta-item">{service.price}</span>
          <span className="meta-item">{service.duration}</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onBook}>
          Book now <ArrowRight size={16} />
        </button>
      </div>
    </article>
  )
}

export function ServicesDetail({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <section className="section services-detail-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="pill">Our services</span>
            <h2>Comprehensive care for every <em>aspect of wellness.</em></h2>
          </div>
          <p className="muted">From preventive medicine to specialized treatments, we offer evidence-based healthcare tailored to your needs.</p>
        </div>

        <div className="services-detail-grid">
          {servicesData.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBook={() => onNavigate('Appointment')}
            />
          ))}
        </div>

        <div className="services-cta">
          <div>
            <h3>Not sure which service is right for you?</h3>
            <p className="muted">Contact us and let's discuss the best approach for your health goals.</p>
          </div>
          <button className="btn btn-outline" onClick={() => onNavigate('Contact')}>
            Get in touch <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
