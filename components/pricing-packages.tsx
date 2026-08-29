'use client'

import { Check, ArrowRight, Zap } from 'lucide-react'

const packages = [
  {
    name: 'Initial Consultation',
    price: 60,
    description: 'Perfect for new patients or specific concerns',
    duration: '45 minutes',
    includes: [
      'Comprehensive health history',
      'Physical examination',
      'Initial assessment & diagnosis',
      'Treatment plan discussion',
      'Follow-up recommendations',
      'Digital health records',
    ],
    popular: false,
  },
  {
    name: 'Wellness Package',
    price: 150,
    description: 'Ideal for preventive care & long-term planning',
    duration: '2 sessions',
    includes: [
      'Full body health screening',
      'Laboratory tests included',
      'Personalized wellness plan',
      'Nutritional guidance',
      '30-day follow-up session',
      'Lifestyle coaching',
      'Digital health records & reports',
    ],
    popular: true,
  },
  {
    name: 'Specialist Packages',
    price: 200,
    description: 'Specialized care for specific health areas',
    duration: '60 minutes',
    includes: [
      'Expert specialist consultation',
      'Advanced diagnostic assessment',
      'Specialized treatment planning',
      'Prescription management',
      'Follow-up session included',
      'Specialist reports & recommendations',
      'Referral coordination',
    ],
    popular: false,
  },
  {
    name: 'Premium Annual Package',
    price: 800,
    description: 'Comprehensive yearly healthcare management',
    duration: 'Unlimited access',
    includes: [
      '12 priority consultations',
      'Quarterly health reviews',
      'Annual comprehensive screening',
      'Unlimited phone/email consultations',
      'Nutrition & wellness planning',
      'Lab tests included',
      'VIP chamber access',
      '24/7 emergency support',
    ],
    popular: false,
  },
]

function PricingCard({
  pkg,
  onBooking,
}: {
  pkg: (typeof packages)[0]
  onBooking: () => void
}) {
  return (
    <article className={`pricing-card ${pkg.popular ? 'popular' : ''}`}>
      {pkg.popular && (
        <div className="popular-badge">
          <Zap size={14} /> Most Popular
        </div>
      )}
      <div className="pricing-header">
        <h3>{pkg.name}</h3>
        <p className="pricing-description">{pkg.description}</p>
        <div className="price-display">
          <span className="currency">$</span>
          <span className="amount">{pkg.price}</span>
        </div>
        <p className="pricing-duration">{pkg.duration}</p>
      </div>
      <ul className="pricing-features">
        {pkg.includes.map((feature) => (
          <li key={feature}>
            <Check size={16} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`btn ${pkg.popular ? 'btn-primary' : 'btn-outline'}`} onClick={onBooking}>
        Book now <ArrowRight size={16} />
      </button>
    </article>
  )
}

export function PricingPackages({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <section className="section pricing-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="pill">Transparent pricing</span>
            <h2>Healthcare packages that <em>fit your needs.</em></h2>
          </div>
          <p className="muted">All prices include consultation, digital health records, and follow-up support.</p>
        </div>
        <div className="pricing-grid">
          {packages.map((pkg) => (
            <PricingCard
              key={pkg.name}
              pkg={pkg}
              onBooking={() => onNavigate('Appointment')}
            />
          ))}
        </div>
        <div className="pricing-footer">
          <p>Insurance coverage available • Payment plans accepted • Corporate wellness programs offered</p>
        </div>
      </div>
    </section>
  )
}
