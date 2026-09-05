'use client';
import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  X,
  Edit3,
  Trash2,
  Eye,
  Save,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Video,
  Star,
  Check,
  MoreHorizontal,
  Send,
  Sparkles,
  Upload,
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
} from '../admin-ui';
import type { AdminData, Review } from '../../lib/admin-data';
import { TODAY } from '../../lib/utils';

// ────────────────────────────────────────────────────────────
// SERVICES CMS
// ────────────────────────────────────────────────────────────
export function ServicesCMSView({ copy }: { copy: any }) {
  const [tab, setTab] = useState<'list' | 'faq' | 'homepage' | 'about' | 'seo'>('list');
  const [editing, setEditing] = useState<any>(null);
  const services = [
    {
      id: 'prp',
      name: 'PRP Therapy',
      desc: 'Regenerative support for hair, skin and scalp.',
      price: 12000,
      duration: 45,
      status: 'Published',
    },
    {
      id: 'psoriasis',
      name: 'Psoriasis Treatment',
      desc: 'Long-term support for flare management.',
      price: 8500,
      duration: 30,
      status: 'Published',
    },
    {
      id: 'vitiligo',
      name: 'Vitiligo Treatment',
      desc: 'Individualised care for pigmentation.',
      price: 10000,
      duration: 45,
      status: 'Published',
    },
    {
      id: 'ibs',
      name: 'IBS & Gut Health',
      desc: 'Practical plan for digestion and wellbeing.',
      price: 11000,
      duration: 60,
      status: 'Published',
    },
    {
      id: 'integrative',
      name: 'Integrative Medicine',
      desc: 'Whole-person connected care.',
      price: 11000,
      duration: 60,
      status: 'Published',
    },
    {
      id: 'preventive',
      name: 'Preventive Wellness',
      desc: 'Annual review with screening.',
      price: 7500,
      duration: 45,
      status: 'Published',
    },
    {
      id: 'sexual',
      name: 'Sexual health',
      desc: 'Confidential evaluation and care.',
      price: 8500,
      duration: 30,
      status: 'Draft',
    },
    {
      id: 'fertility',
      name: 'Fertility care',
      desc: 'Evaluation and care for couples.',
      price: 12000,
      duration: 60,
      status: 'Draft',
    },
  ];
  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">CONTENT STUDIO</span>
          <h1>Services & CMS</h1>
          <p className="muted-light">Manage services, FAQs and homepage content</p>
        </div>
        <div className="adm-head-actions">
          <button className="pro-primary">
            <Plus size={14} /> New service
          </button>
        </div>
      </section>
      <div className="adm-tabs">
        <button className={tab === 'list' ? 'on' : ''} onClick={() => setTab('list')}>
          Services
        </button>
        <button className={tab === 'faq' ? 'on' : ''} onClick={() => setTab('faq')}>
          FAQs
        </button>
        <button className={tab === 'homepage' ? 'on' : ''} onClick={() => setTab('homepage')}>
          Homepage
        </button>
        <button className={tab === 'about' ? 'on' : ''} onClick={() => setTab('about')}>
          About doctor
        </button>
        <button className={tab === 'seo' ? 'on' : ''} onClick={() => setTab('seo')}>
          SEO / Meta
        </button>
      </div>
      {tab === 'list' && (
        <section className="pro-panel">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="adm-cell-person">
                        <span className="adm-cat-mark">
                          <FileText size={14} />
                        </span>
                        <div>
                          <strong>{s.name}</strong>
                          <small>{s.desc}</small>
                        </div>
                      </div>
                    </td>
                    <td>{s.duration} min</td>
                    <td>
                      <strong>৳{s.price.toLocaleString('en-IN')}</strong>
                    </td>
                    <td>
                      <Pill tone={s.status === 'Published' ? 'teal' : 'sand'}>{s.status}</Pill>
                    </td>
                    <td>
                      <div className="adm-row-actions">
                        <button>
                          <Edit3 size={14} />
                        </button>
                        <button className="danger">
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
      )}
      {tab === 'faq' && (
        <section className="pro-panel">
          <div className="adm-section-head">
            <h4>Frequently asked questions</h4>
            <button className="pro-primary">
              <Plus size={13} /> Add FAQ
            </button>
          </div>
          <ul className="adm-faq-list">
            {[
              'What should I bring to my first visit?',
              'Do you offer care across multiple chambers?',
              'Can I book a follow-up online?',
              'Do you ship products internationally?',
            ].map((q, i) => (
              <li key={i}>
                <div className="grow">
                  <strong>Q: {q}</strong>
                  <p>
                    A: Bring any current medicines, recent reports, and a short note about what you
                    would like help with.
                  </p>
                </div>
                <div className="adm-row-actions">
                  <button>
                    <Edit3 size={14} />
                  </button>
                  <button className="danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      {tab === 'homepage' && (
        <section className="pro-panel">
          <div className="adm-form-grid">
            <Field label="Hero title">
              <Input defaultValue="Healthcare that feels human." />
            </Field>
            <Field label="Hero subtitle">
              <Input defaultValue="Expert medical care with the time, clarity and warmth you deserve." />
            </Field>
            <Field label="Primary CTA">
              <Input defaultValue="Book an appointment" />
            </Field>
            <Field label="Secondary CTA">
              <Input defaultValue="Explore our services" />
            </Field>
            <Field label="Notice 1">
              <Input defaultValue="New evening appointments available this week" />
            </Field>
            <Field label="Notice 2">
              <Input defaultValue="Free wellness screening with selected consultations" />
            </Field>
          </div>
          <div className="adm-form-foot">
            <button className="pro-primary">
              <Save size={14} /> Save changes
            </button>
          </div>
        </section>
      )}
      {tab === 'about' && (
        <section className="pro-panel">
          <Field label="Heading">
            <Input defaultValue="Care with conviction." />
          </Field>
          <Field label="Lead paragraph">
            <Textarea
              rows={3}
              defaultValue="Dr. Ibrahim is a family physician and wellness advocate who believes excellent medicine is equal parts expertise, empathy and consistency."
            />
          </Field>
          <Field label="Philosophy heading">
            <Input defaultValue="Better health is built on trust." />
          </Field>
          <Field label="Philosophy body">
            <Textarea
              rows={4}
              defaultValue="From your first conversation to every follow-up, Dr. Ibrahim creates space for questions, context and honest decisions."
            />
          </Field>
          <div className="adm-form-foot">
            <button className="pro-primary">
              <Save size={14} /> Save changes
            </button>
          </div>
        </section>
      )}
      {tab === 'seo' && (
        <section className="pro-panel">
          <div className="adm-form-grid">
            <Field label="Site title">
              <Input defaultValue="Dr. Ibrahim Clinic | Human healthcare in Accra" />
            </Field>
            <Field label="Meta description">
              <Textarea
                rows={3}
                defaultValue="Thoughtful medical care, preventive medicine and personalised wellness."
              />
            </Field>
            <Field label="OG image URL">
              <Input defaultValue="https://…" />
            </Field>
            <Field label="Twitter handle">
              <Input defaultValue="@dribrahim" />
            </Field>
          </div>
          <div className="adm-form-foot">
            <button className="pro-primary">
              <Save size={14} /> Save changes
            </button>
          </div>
        </section>
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────
// GALLERY
// ────────────────────────────────────────────────────────────
export function GalleryView({
  data,
  copy,
  onLog,
  toast,
}: {
  data: AdminData;
  copy: any;
  onLog: any;
  toast: any;
}) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const onSave = (g: any) => {
    data.addGallery(g);
    toast.show(copy.saved);
    onLog('Dr. Ibrahim', 'updated', `Gallery ${g.title}`);
    setShow(false);
    setEditing(null);
  };
  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">CONTENT STUDIO</span>
          <h1>Gallery</h1>
          <p className="muted-light">{data.gallery.length} images across 4 albums</p>
        </div>
        <div className="adm-head-actions">
          <button
            className="pro-primary"
            onClick={() => {
              setEditing(null);
              setShow(true);
            }}>
            <Plus size={14} /> Upload images
          </button>
        </div>
      </section>
      <section className="pro-panel">
        <div className="adm-gallery-grid adm-stagger">
          {data.gallery.map((g: any) => (
            <article key={g.id} className="adm-gallery-item" onClick={() => setPreview(g.url)}>
              <img src={g.url} alt={g.title} width="360" height="360" loading="lazy" decoding="async" />
              <div className="adm-gallery-overlay">
                <strong>{g.title}</strong>
                <small>
                  {g.album} · {g.date}
                </small>
                <div className="adm-row-actions">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setEditing(g);
                      setShow(true);
                    }}>
                    <Edit3 size={14} />
                  </button>
                  <button
                    className="danger"
                    onClick={e => {
                      e.stopPropagation();
                      data.removeGallery(g.id);
                      toast.show(copy.deleted, 'error');
                    }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      {show && (
        <Modal
          open
          onClose={() => setShow(false)}
          title={editing ? 'Edit image' : 'Add image'}
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
                      id: `G-${data.gallery.length + 100}`,
                      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
                      title: 'New',
                      album: 'Clinic',
                      date: TODAY,
                    }
                  )
                }>
                <Save size={14} /> Save
              </button>
            </>
          }>
          <div className="adm-form-grid">
            <Field label="Title" required>
              <Input
                value={editing?.title || ''}
                onChange={e => setEditing({ ...(editing || {}), title: e.target.value })}
              />
            </Field>
            <Field label="Album">
              <Select
                value={editing?.album || 'Clinic'}
                onChange={e => setEditing({ ...(editing || {}), album: e.target.value })}>
                <option>Clinic</option>
                <option>Treatments</option>
                <option>Shop</option>
                <option>Team</option>
              </Select>
            </Field>
          </div>
          <Field label="Image URL">
            <Input
              value={editing?.url || ''}
              onChange={e => setEditing({ ...(editing || {}), url: e.target.value })}
            />
          </Field>
           {editing?.url && <img src={editing.url} className="adm-detail-image" alt="" width="400" height="240" decoding="async" />}
        </Modal>
      )}
      {preview && (
        <div className="adm-lightbox" onClick={() => setPreview(null)}>
          <img src={preview} alt="" width="1200" height="800" decoding="async" />
        </div>
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────
// VIDEOS
// ────────────────────────────────────────────────────────────
export function VideosView({
  data,
  copy,
  onLog,
  toast,
}: {
  data: AdminData;
  copy: any;
  onLog: any;
  toast: any;
}) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const onSave = (v: any) => {
    data.addVideo(v);
    toast.show(copy.saved);
    onLog('Dr. Ibrahim', 'updated', `Video ${v.title}`);
    setShow(false);
    setEditing(null);
  };
  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">CONTENT STUDIO</span>
          <h1>Videos</h1>
          <p className="muted-light">
            {data.videos.length} videos ·{' '}
            {data.videos.reduce((s: number, v: any) => s + v.views, 0).toLocaleString()} total views
          </p>
        </div>
        <div className="adm-head-actions">
          <button
            className="pro-primary"
            onClick={() => {
              setEditing(null);
              setShow(true);
            }}>
            <Plus size={14} /> Add video
          </button>
        </div>
      </section>
      <section className="pro-panel">
        <div className="adm-video-grid adm-stagger">
          {data.videos.map((v: any) => (
            <article key={v.id} className="adm-video-card">
              <div className="adm-video-thumb" style={{ backgroundImage: `url(${v.thumbnail})` }}>
                <span className="adm-video-play">▶</span>
                <span className="adm-video-duration">{v.duration}</span>
                <Pill tone={v.status === 'Published' ? 'teal' : 'sand'}>{v.status}</Pill>
              </div>
              <div className="adm-video-meta">
                <h4>{v.title}</h4>
                <small>
                  {v.views.toLocaleString()} views · {v.date}
                </small>
                <div className="adm-row-actions">
                  <button
                    onClick={() => {
                      setEditing(v);
                      setShow(true);
                    }}>
                    <Edit3 size={14} />
                  </button>
                  <button
                    className="danger"
                    onClick={() => {
                      data.removeVideo(v.id);
                      toast.show(copy.deleted, 'error');
                    }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      {show && (
        <Modal
          open
          onClose={() => setShow(false)}
          title={editing ? 'Edit video' : 'Add video'}
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
                      id: `V-${data.videos.length + 100}`,
                      title: 'New',
                      thumbnail:
                        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80',
                      duration: '00:00',
                      views: 0,
                      status: 'Draft',
                      date: TODAY,
                    }
                  )
                }>
                <Save size={14} /> Save
              </button>
            </>
          }>
          <Field label="Title" required>
            <Input
              value={editing?.title || ''}
              onChange={e => setEditing({ ...(editing || {}), title: e.target.value })}
            />
          </Field>
          <div className="adm-form-grid">
            <Field label="Duration">
              <Input
                value={editing?.duration || ''}
                onChange={e => setEditing({ ...(editing || {}), duration: e.target.value })}
              />
            </Field>
            <Field label="Status">
              <Select
                value={editing?.status || 'Draft'}
                onChange={e => setEditing({ ...(editing || {}), status: e.target.value })}>
                <option>Published</option>
                <option>Draft</option>
              </Select>
            </Field>
          </div>
          <Field label="Thumbnail URL">
            <Input
              value={editing?.thumbnail || ''}
              onChange={e => setEditing({ ...(editing || {}), thumbnail: e.target.value })}
            />
          </Field>
        </Modal>
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────
// REVIEWS
// ────────────────────────────────────────────────────────────
export function ReviewsView({
  data,
  copy,
  onLog,
  toast,
}: {
  data: AdminData;
  copy: any;
  onLog: any;
  toast: any;
}) {
  const [tab, setTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [replying, setReplying] = useState<Review | null>(null);
  const list = useMemo(() => data.reviews.filter((r: any) => (tab === 'All' ? true : r.status === tab)), [data.reviews, tab]);
  const pendingCount = useMemo(() => data.reviews.filter((r: any) => r.status === 'Pending').length, [data.reviews]);
  const tabCounts = useMemo(() => ({
    All: data.reviews.length,
    Pending: data.reviews.filter((r: any) => r.status === 'Pending').length,
    Approved: data.reviews.filter((r: any) => r.status === 'Approved').length,
    Rejected: data.reviews.filter((r: any) => r.status === 'Rejected').length,
  }), [data.reviews]);
  const setStatus = (r: Review, status: Review['status']) => {
    data.addReview({ ...r, status });
    onLog('Dr. Ibrahim', 'updated', `Review ${r.id} → ${status}`);
    toast.show(`${r.id} ${status}`);
  };
  return (
    <>
      <section className="adm-page-head">
        <div>
          <span className="pro-kicker">CONTENT STUDIO</span>
          <h1>Reviews</h1>
          <p className="muted-light">
            {data.reviews.length} total · {pendingCount} pending
          </p>
        </div>
      </section>
      <div className="adm-tabs">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(t => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
            {t}
            <span>
              {tabCounts[t]}
            </span>
          </button>
        ))}
      </div>
      <section className="pro-panel">
        <ul className="adm-review-list adm-stagger">
          {list.map((r: any) => (
            <li key={r.id} className="adm-review-item">
              <Avatar name={r.author} size={44} />
              <div className="grow">
                <div className="adm-review-head">
                  <strong>{r.author}</strong>
                  <span className="adm-stars">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star
                        key={n}
                        size={13}
                        fill={n <= r.rating ? '#e3a443' : 'transparent'}
                        stroke="#e3a443"
                      />
                    ))}
                  </span>
                  <Pill
                    tone={
                      r.status === 'Approved' ? 'teal' : r.status === 'Pending' ? 'sand' : 'coral'
                    }>
                    {r.status}
                  </Pill>
                </div>
                <small>
                  {r.service} · {r.date}
                </small>
                <p>{r.text}</p>
                {r.reply && (
                  <div className="adm-review-reply">
                    <strong>↳ Reply:</strong> {r.reply}
                  </div>
                )}
              </div>
              <div className="adm-row-actions">
                {r.status === 'Pending' && (
                  <button onClick={() => setStatus(r, 'Approved')}>
                    <Check size={14} />
                  </button>
                )}
                {r.status !== 'Rejected' && r.status !== 'Approved' && (
                  <button className="danger" onClick={() => setStatus(r, 'Rejected')}>
                    <X size={14} />
                  </button>
                )}
                <button onClick={() => setReplying(r)}>
                  <Send size={14} />
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    data.removeReview(r.id);
                    toast.show(copy.deleted, 'error');
                  }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {replying && (
        <ReviewReply
          review={replying}
          onClose={() => setReplying(null)}
          onSave={reply => {
            data.addReview({ ...replying, reply, status: 'Approved' });
            toast.show('Reply sent');
            onLog('Dr. Ibrahim', 'updated', `Reply to ${replying.id}`);
            setReplying(null);
          }}
        />
      )}
    </>
  );
}

function ReviewReply({
  review,
  onClose,
  onSave,
}: {
  review: Review;
  onClose: () => void;
  onSave: (r: string) => void;
}) {
  const [reply, setReply] = useState(review.reply || '');
  return (
    <Modal
      open
      onClose={onClose}
      title={`Reply to ${review.author}`}
      footer={
        <>
          <button className="pro-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="pro-primary" onClick={() => onSave(reply)}>
            <Send size={14} /> Send reply
          </button>
        </>
      }>
      <p className="muted-light">{review.text}</p>
      <Field label="Your reply" required>
        <Textarea rows={4} value={reply} onChange={e => setReply(e.target.value)} />
      </Field>
    </Modal>
  );
}
