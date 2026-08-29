'use client'

import { ArrowRight, Calendar, User } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: 'The Complete Guide to Preventive Medicine',
    excerpt: 'Learn why preventive care is the foundation of long-term health and what screening tests are right for your age.',
    category: 'Health Education',
    author: 'Dr. Ibrahim Khan',
    date: 'June 15, 2026',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=85',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Skin Health 101: Building Your Daily Routine',
    excerpt: 'Expert tips for maintaining healthy, glowing skin using evidence-based skincare practices and the right products.',
    category: 'Skincare',
    author: 'Dr. Aisha Mohamed',
    date: 'June 12, 2026',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=600&q=85',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'Nutrition Myths vs. Facts: What Science Really Says',
    excerpt: 'Debunking common nutrition misconceptions and sharing evidence-based dietary guidance for optimal wellness.',
    category: 'Nutrition',
    author: 'Dr. Amara Osei',
    date: 'June 10, 2026',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=85',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Managing Stress: Science-Backed Techniques',
    excerpt: 'Practical stress management strategies that actually work, grounded in current psychological research.',
    category: 'Wellness',
    author: 'Dr. Ibrahim Khan',
    date: 'June 8, 2026',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=85',
    readTime: '4 min read',
  },
  {
    id: 5,
    title: 'Women\'s Wellness: A Holistic Approach',
    excerpt: 'Comprehensive guide to women\'s health at every life stage, from hormonal balance to long-term wellness planning.',
    category: 'Women\'s Health',
    author: 'Dr. Aisha Mohamed',
    date: 'June 5, 2026',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=85',
    readTime: '8 min read',
  },
  {
    id: 6,
    title: 'Sleep Optimization: Transform Your Rest',
    excerpt: 'Scientific insights into improving sleep quality and establishing healthy sleep habits for better overall health.',
    category: 'Wellness',
    author: 'Dr. Ibrahim Khan',
    date: 'June 1, 2026',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=85',
    readTime: '5 min read',
  },
]

export function BlogSection() {
  return (
    <section className="section blog-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="pill pill-blue">Health insights</span>
            <h2>Latest from our <em>wellness blog.</em></h2>
          </div>
          <p className="muted">Evidence-based health tips, wellness strategies, and expert guidance from our care team.</p>
        </div>
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article className="blog-card" key={post.id}>
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
                <span className="blog-category">{post.category}</span>
              </div>
              <div className="blog-content">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="blog-meta">
                  <div className="meta-item">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <span className="read-time">{post.readTime}</span>
                </div>
                <button className="text-link">
                  Read article <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
