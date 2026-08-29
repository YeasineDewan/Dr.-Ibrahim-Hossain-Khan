'use client'

import { Star, Quote, ArrowRight } from 'lucide-react'

const testimonials = [
  {
    author: 'Amara Mensah',
    role: 'Patient since 2022',
    text: 'Dr. Ibrahim took the time to truly understand my health concerns. The personalized care plan has transformed my wellness journey. I recommend them to everyone.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=85',
  },
  {
    author: 'Daniel Owusu',
    role: 'Patient since 2021',
    text: 'Professional, compassionate, and thorough. After years of rushed appointments elsewhere, this clinic finally feels like they care about my long-term health.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=85',
  },
  {
    author: 'Sofia Boateng',
    role: 'Patient since 2023',
    text: 'The skin treatments here are incredible. Dr. Aisha is knowledgeable and explains everything clearly. My skin has never looked better!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=85',
  },
  {
    author: 'Michael Addo',
    role: 'Patient since 2020',
    text: 'Best clinic experience I\'ve had. The team is welcoming, the facilities are clean and modern, and the care is genuinely exceptional.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=85',
  },
]

export function Testimonials() {
  return (
    <section className="section testimonials-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="pill pill-teal">Loved by our patients</span>
            <h2>Real stories from real <em>patients</em>.</h2>
          </div>
          <p className="muted">Discover why 2,000+ patients trust us with their healthcare.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.author}>
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <div className="testimonial-quote">
                <Quote size={20} className="quote-icon" />
                <p>{testimonial.text}</p>
              </div>
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.author} className="author-image" />
                <div>
                  <strong>{testimonial.author}</strong>
                  <small>{testimonial.role}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
