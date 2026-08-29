'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'How do I book an appointment?',
    answer: 'You can book through our website using the appointment booking system, call us directly, or visit any of our chambers. We typically have availability within 2-3 days.',
  },
  {
    question: 'What should I bring to my first visit?',
    answer: 'Please bring a valid ID, insurance card (if applicable), and any recent medical records or test results. Arrive 10 minutes early to complete health history forms.',
  },
  {
    question: 'Do you accept insurance?',
    answer: 'Yes, we accept most major insurance plans. Please contact us before your appointment to verify coverage for your specific plan.',
  },
  {
    question: 'Are virtual consultations available?',
    answer: 'Yes! We offer secure video consultations for follow-ups and non-emergency concerns. These are available 24/7 through our patient portal.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellations made 24 hours before your appointment are free. Cancellations within 24 hours are subject to a 50% consultation fee.',
  },
  {
    question: 'How do you protect patient privacy?',
    answer: 'We comply with all HIPAA regulations and maintain strict confidentiality. All patient data is encrypted and securely stored with limited access.',
  },
  {
    question: 'Can I get prescription refills online?',
    answer: 'Yes! Existing patients can request prescription refills through our patient portal. Most refills are processed within 24 hours.',
  },
  {
    question: 'Do you offer corporate wellness programs?',
    answer: 'Absolutely! We provide customized wellness programs for companies including health screenings, team coaching, and preventive care initiatives.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="section faq-section">
      <div className="container narrow">
        <div className="section-heading center">
          <span className="pill pill-sand">Got questions?</span>
          <h2>Frequently asked <em>questions.</em></h2>
          <p className="muted">Find answers to common questions about our services and how we care for you.</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <article
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              key={index}
            >
              <button
                className="faq-trigger"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="faq-number">0{index + 1}</span>
                <span className="faq-question">{faq.question}</span>
                <ChevronDown size={18} className="faq-icon" />
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
