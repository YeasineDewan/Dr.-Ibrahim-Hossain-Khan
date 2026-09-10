'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { extractYouTubeId, youtubeThumbnail } from './utils';

export type Appointment = {
  id: string;
  patient: string;
  doctor: string;
  service: string;
  chamber: string;
  date: string;
  time: string;
  duration: string;
  type: 'In-person' | 'Video' | 'Phone';
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'Waitlist';
  fee: number;
  notes?: string;
};

export type Patient = {
  id: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  medications: { name: string; dose: string; status: string }[];
  visits: { date: string; reason: string; doctor: string; notes: string }[];
  notes: { date: string; text: string; author: string }[];
  documents: { name: string; type: string; size: string; date: string }[];
  vitals: { bp: string; hr: string; temp: string; weight: string; date: string };
};

export type Review = {
  id: string;
  author: string;
  service: string;
  rating: number;
  text: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reply?: string;
};

export type FollowUp = {
  id: string;
  patient: string;
  reason: string;
  dueDate: string;
  status: 'Upcoming' | 'Overdue' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo: string;
};

export type Chamber = {
  id: string;
  name: string;
  place: string;
  address: string;
  hours: string;
  phone: string;
  email?: string;
  status: 'Active' | 'Closed';
  capacity: number;
};

export type Coupon = {
  id: string;
  code: string;
  type: 'Percent' | 'Flat';
  value: number;
  minOrder: number;
  uses: number;
  maxUses: number;
  expiry: string;
  status: 'Active' | 'Scheduled' | 'Expired';
};

export type Notification = {
  id: string;
  type: 'appointment' | 'patient' | 'system' | 'order' | 'stock';
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type ActivityItem = {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  ip: string;
};

export type Video = {
  id: string;
  title: string;
  titleBn?: string;
  thumbnail: string;
  duration: string;
  views: number;
  status: string;
  date: string;
  url?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  products: number;
  status: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  avatar: string;
};

export type Prescription = {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  date: string;
  diagnosis: string;
  medicines: {
    name: string;
    dose: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  notes: string;
  status: 'Draft' | 'Signed' | 'Sent' | 'Viewed';
  createdAt: string;
  visitId?: string;
  signatureDataUrl?: string;
  signedAt?: string;
  sentAt?: string;
  auditTrail?: { at: string; actor: string; action: string; changes: string }[];
  refillCount?: number;
  refillsAllowed?: number;
};

const supabase = createClient();

function mapPatientFromDb(p: any): Patient {
  return {
    id: p.id,
    name: p.name,
    dob: p.dob,
    gender: p.gender,
    phone: p.phone,
    email: p.email || '',
    address: p.address || '',
    bloodGroup: p.blood_group || '',
    allergies: p.allergies || [],
    conditions: p.conditions || [],
    medications: p.medications || [],
    visits: p.visits || [],
    notes: p.notes || [],
    documents: p.documents || [],
    vitals: p.vitals || { bp: '', hr: '', temp: '', weight: '', date: '' },
  };
}

function mapPatientToDb(p: Patient) {
  return {
    id: p.id,
    name: p.name,
    dob: p.dob,
    gender: p.gender,
    phone: p.phone,
    email: p.email,
    address: p.address,
    blood_group: p.bloodGroup,
    allergies: p.allergies,
    conditions: p.conditions,
    medications: p.medications,
    visits: p.visits,
    notes: p.notes,
    documents: p.documents,
    vitals: p.vitals,
  };
}

function mapAppointmentFromDb(a: any): Appointment {
  return {
    id: a.id,
    patient: a.patient_name,
    doctor: a.doctor,
    service: a.service,
    chamber: a.chamber,
    date: a.date,
    time: a.time,
    duration: a.duration,
    type: a.type,
    status: a.status,
    fee: Number(a.fee),
    notes: a.notes,
  };
}

function mapAppointmentToDb(a: Appointment) {
  return {
    id: a.id,
    patient_id: a.id.startsWith('DR-') ? a.id : null,
    patient_name: a.patient,
    doctor: a.doctor,
    service: a.service,
    chamber: a.chamber,
    date: a.date,
    time: a.time,
    duration: a.duration,
    type: a.type,
    status: a.status,
    fee: a.fee,
    notes: a.notes,
  };
}

function mapPrescriptionFromDb(r: any): Prescription {
  return {
    id: r.id,
    patientId: r.patient_id,
    patientName: r.patient_name,
    doctor: r.doctor,
    date: r.date,
    diagnosis: r.diagnosis,
    medicines: r.medicines || [],
    notes: r.notes || '',
    status: r.status,
    createdAt: r.created_at,
    visitId: r.visit_id,
    signatureDataUrl: r.signature_data_url,
    signedAt: r.signed_at,
    sentAt: r.sent_at,
    auditTrail: r.audit_trail || [],
    refillCount: r.refill_count,
    refillsAllowed: r.refills_allowed,
  };
}

function mapPrescriptionToDb(r: Prescription) {
  return {
    id: r.id,
    patient_id: r.patientId,
    patient_name: r.patientName,
    doctor: r.doctor,
    date: r.date,
    diagnosis: r.diagnosis,
    medicines: r.medicines,
    notes: r.notes,
    status: r.status,
    visit_id: r.visitId,
    signature_data_url: r.signatureDataUrl,
    signed_at: r.signedAt,
    sent_at: r.sentAt,
    audit_trail: r.auditTrail,
    refill_count: r.refillCount,
    refills_allowed: r.refillsAllowed,
  };
}

function mapReviewFromDb(r: any): Review {
  return {
    id: r.id,
    author: r.author,
    service: r.service,
    rating: r.rating,
    text: r.text,
    date: r.date,
    status: r.status,
    reply: r.reply,
  };
}

function mapFollowUpFromDb(f: any): FollowUp {
  return {
    id: f.id,
    patient: f.patient_name,
    reason: f.reason,
    dueDate: f.due_date,
    status: f.status,
    priority: f.priority,
    assignedTo: f.assigned_to,
  };
}

function mapChamberFromDb(c: any): Chamber {
  return {
    id: c.id,
    name: c.name,
    place: c.place,
    address: c.address,
    hours: c.hours,
    phone: c.phone,
    email: c.email,
    status: c.status,
    capacity: c.capacity,
  };
}

function mapNotificationFromDb(n: any): Notification {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    time: n.time,
    read: n.read,
  };
}

function mapActivityFromDb(a: any): ActivityItem {
  return {
    id: a.id,
    user: a.user,
    action: a.action,
    target: a.target,
    time: a.time,
    ip: a.ip,
  };
}

function mapVideoFromDb(v: any): Video {
  return {
    id: v.id,
    title: v.title,
    titleBn: v.title_bn,
    thumbnail: v.thumbnail,
    duration: v.duration,
    views: v.views,
    status: v.status,
    date: v.date,
    url: v.url,
  };
}

function mapCategoryFromDb(c: any): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    products: c.products,
    status: c.status,
  };
}

function mapUserFromDb(u: any): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.roles?.[0] || 'Viewer',
    status: u.status,
    lastLogin: u.last_login || '',
    avatar: u.name.split(' ').map((s: string) => s[0]).join('').toUpperCase().slice(0, 2),
  };
}

const uid = () => Math.random().toString(36).slice(2, 9);

/**
 * Default YouTube videos shown on the public gallery while the Supabase
 * `videos` table is empty (e.g. in development or a fresh project). When the
 * database returns published rows, those take precedence. Thumbnails are sourced
 * from YouTube's public image CDN so every card renders before the first fetch.
 */
const youtubeSeedVideos = [
  { url: 'https://youtu.be/dlKA6LTj3Zw', title: 'The art of a good consultation', duration: '04:12', date: '2026-06-01' },
  { url: 'https://youtu.be/dlKA6LTj3Zw', title: 'Consultation essentials', duration: '03:45', date: '2026-06-08' },
  { url: 'https://youtu.be/5RXPd1XdVJc', title: 'Understanding vitiligo', duration: '06:20', date: '2026-06-15' },
  { url: 'https://youtu.be/LUGH57vV38s', title: 'Skin care for sensitive skin', duration: '05:10', date: '2026-06-22' },
];

const defaultVideos: Video[] = youtubeSeedVideos.map((v, i) => {
  const ytId = extractYouTubeId(v.url);
  return {
    id: `V-YT-${i + 1}`,
    title: v.title,
    thumbnail: ytId ? youtubeThumbnail(ytId) : '',
    duration: v.duration,
    views: 0,
    status: 'Published',
    date: v.date,
    url: v.url,
  };
});

/**
 * Ensures the featured YouTube video fixtures are always available on the public
 * gallery, even when the Supabase `videos` table is empty or contains only
 * legacy rows without a `url`. Rows coming from the database are preferred: a
 * seed whose `url` already exists in the database is dropped to avoid duplicates.
 */
function mergeVideos(dbVideos: Video[]): Video[] {
  const dbUrls = new Set(dbVideos.filter(v => v.url).map(v => v.url as string));
  return [...defaultVideos.filter(v => !v.url || !dbUrls.has(v.url)), ...dbVideos];
}

export function useAdminData() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [chambers, setChambers] = useState<Chamber[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [videos, setVideos] = useState<Video[]>(defaultVideos);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [
        { data: patientsData },
        { data: appointmentsData },
        { data: reviewsData },
        { data: followUpsData },
        { data: chambersData },
        { data: notificationsData },
        { data: activityData },
        { data: galleryData },
        { data: videosData },
        { data: categoriesData },
        { data: usersData },
        { data: prescriptionsData },
      ] = await Promise.all([
        supabase.from('patients').select('*').order('created_at', { ascending: false }),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('follow_ups').select('*').order('created_at', { ascending: false }),
        supabase.from('chambers').select('*').order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }),
        supabase.from('activity_log').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery').select('*').order('created_at', { ascending: false }),
        supabase.from('videos').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('*').order('created_at', { ascending: false }),
        supabase.from('prescriptions').select('*').order('created_at', { ascending: false }),
      ]);

      if (patientsData) setPatients(patientsData.map(mapPatientFromDb));
      if (appointmentsData) setAppointments(appointmentsData.map(mapAppointmentFromDb));
      if (reviewsData) setReviews(reviewsData.map(mapReviewFromDb));
      if (followUpsData) setFollowUps(followUpsData.map(mapFollowUpFromDb));
      if (chambersData) setChambers(chambersData.map(mapChamberFromDb));
      if (notificationsData) setNotifications(notificationsData.map(mapNotificationFromDb));
      if (activityData) setActivity(activityData.map(mapActivityFromDb));
      if (galleryData) setGallery(galleryData);
      if (videosData) setVideos(mergeVideos(videosData.map(mapVideoFromDb)));
      if (categoriesData) setCategories(categoriesData.map(mapCategoryFromDb));
      if (usersData) setUsers(usersData.map(mapUserFromDb));
      if (prescriptionsData) setPrescriptions(prescriptionsData.map(mapPrescriptionFromDb));
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const upsertPatient = useCallback(async (item: Patient) => {
    const { error } = await supabase.from('patients').upsert(mapPatientToDb(item));
    if (error) throw error;
    setPatients(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i === -1) return [item, ...prev];
      const copy = [...prev];
      copy[i] = { ...copy[i], ...item };
      return copy;
    });
  }, []);

  const removePatient = useCallback(async (id: string) => {
    const { error } = await supabase.from('patients').delete().eq('id', id);
    if (error) throw error;
    setPatients(prev => prev.filter(p => p.id !== id));
  }, []);

  const upsertAppointment = useCallback(async (item: Appointment) => {
    const { error } = await supabase.from('appointments').upsert(mapAppointmentToDb(item));
    if (error) throw error;
    setAppointments(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i === -1) return [item, ...prev];
      const copy = [...prev];
      copy[i] = { ...copy[i], ...item };
      return copy;
    });
  }, []);

  const removeAppointment = useCallback(async (id: string) => {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
    setAppointments(prev => prev.filter(p => p.id !== id));
  }, []);

  const upsertReview = useCallback(async (item: Review) => {
    const { error } = await supabase.from('reviews').upsert(item);
    if (error) throw error;
    setReviews(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i === -1) return [item, ...prev];
      const copy = [...prev];
      copy[i] = { ...copy[i], ...item };
      return copy;
    });
  }, []);

  const removeReview = useCallback(async (id: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw error;
    setReviews(prev => prev.filter(p => p.id !== id));
  }, []);

  const upsertFollowUp = useCallback(async (item: FollowUp) => {
    const { error } = await supabase.from('follow_ups').upsert({
      id: item.id,
      patient_id: patients.find(p => p.name === item.patient)?.id,
      patient_name: item.patient,
      reason: item.reason,
      due_date: item.dueDate,
      status: item.status,
      priority: item.priority,
      assigned_to: item.assignedTo,
    });
    if (error) throw error;
    setFollowUps(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i === -1) return [item, ...prev];
      const copy = [...prev];
      copy[i] = { ...copy[i], ...item };
      return copy;
    });
  }, [patients]);

  const removeFollowUp = useCallback(async (id: string) => {
    const { error } = await supabase.from('follow_ups').delete().eq('id', id);
    if (error) throw error;
    setFollowUps(prev => prev.filter(p => p.id !== id));
  }, []);

  const upsertChamber = useCallback(async (item: Chamber) => {
    const { error } = await supabase.from('chambers').upsert(item);
    if (error) throw error;
    setChambers(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i === -1) return [item, ...prev];
      const copy = [...prev];
      copy[i] = { ...copy[i], ...item };
      return copy;
    });
  }, []);

  const removeChamber = useCallback(async (id: string) => {
    const { error } = await supabase.from('chambers').delete().eq('id', id);
    if (error) throw error;
    setChambers(prev => prev.filter(p => p.id !== id));
  }, []);

  const upsertNotification = useCallback(async (item: Notification) => {
    const { error } = await supabase.from('notifications').upsert(item);
    if (error) throw error;
    setNotifications(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i === -1) return [item, ...prev];
      const copy = [...prev];
      copy[i] = { ...copy[i], ...item };
      return copy;
    });
  }, []);

  const upsertActivity = useCallback(async (item: ActivityItem) => {
    const { error } = await supabase.from('activity_log').upsert(item);
    if (error) throw error;
    setActivity(prev => [item, ...prev]);
  }, []);

  const upsertGallery = useCallback(async (item: { id: string; [key: string]: any }) => {
    const { error } = await supabase.from('gallery').upsert(item);
    if (error) throw error;
    setGallery(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i === -1) return [item, ...prev];
      const copy = [...prev];
      copy[i] = { ...copy[i], ...item };
      return copy;
    });
  }, []);

  const removeGallery = useCallback(async (id: string) => {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw error;
    setGallery(prev => prev.filter(p => p.id !== id));
  }, []);

  const upsertVideo = useCallback(async (item: Video) => {
    const { error } = await supabase.from('videos').upsert(item);
    if (error) throw error;
    setVideos(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i === -1) return [item, ...prev];
      const copy = [...prev];
      copy[i] = { ...copy[i], ...item };
      return copy;
    });
  }, []);

  const removeVideo = useCallback(async (id: string) => {
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) throw error;
    setVideos(prev => prev.filter(p => p.id !== id));
  }, []);

  const upsertCategory = useCallback(async (item: Category) => {
    const { error } = await supabase.from('categories').upsert(item);
    if (error) throw error;
    setCategories(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i === -1) return [item, ...prev];
      const copy = [...prev];
      copy[i] = { ...copy[i], ...item };
      return copy;
    });
  }, []);

  const removeCategory = useCallback(async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    setCategories(prev => prev.filter(p => p.id !== id));
  }, []);

  const upsertUser = useCallback(async (item: User) => {
    const { error } = await supabase.from('users').upsert({
      id: item.id,
      name: item.name,
      email: item.email,
      roles: [item.role],
      status: item.status,
      last_login: item.lastLogin,
    });
    if (error) throw error;
    setUsers(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i === -1) return [item, ...prev];
      const copy = [...prev];
      copy[i] = { ...copy[i], ...item };
      return copy;
    });
  }, []);

  const removeUser = useCallback(async (id: string) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    setUsers(prev => prev.filter(p => p.id !== id));
  }, []);

  const upsertPrescription = useCallback(async (item: Prescription) => {
    const { error } = await supabase.from('prescriptions').upsert(mapPrescriptionToDb(item));
    if (error) throw error;
    setPrescriptions(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i === -1) return [item, ...prev];
      const copy = [...prev];
      copy[i] = { ...copy[i], ...item };
      return copy;
    });
  }, []);

  const removePrescription = useCallback(async (id: string) => {
    const { error } = await supabase.from('prescriptions').delete().eq('id', id);
    if (error) throw error;
    setPrescriptions(prev => prev.filter(p => p.id !== id));
  }, []);

  const logActivity = useCallback((user: string, action: string, target: string) => {
    const newActivity: ActivityItem = { id: uid(), user, action, target, time: 'just now', ip: '102.176.55.21' };
    upsertActivity(newActivity);
    setActivity(prev => [newActivity, ...prev]);
  }, [upsertActivity]);

  const value = useMemo(() => ({
    appointments,
    setAppointments,
    addAppointment: upsertAppointment,
    removeAppointment,
    patients,
    setPatients,
    addPatient: upsertPatient,
    removePatient,
    reviews,
    setReviews,
    addReview: upsertReview,
    removeReview,
    followUps,
    setFollowUps,
    addFollowUp: upsertFollowUp,
    removeFollowUp,
    chambers,
    setChambers,
    addChamber: upsertChamber,
    removeChamber,
    notifications,
    setNotifications,
    addNotification: upsertNotification,
    activity,
    setActivity,
    logActivity,
    gallery,
    setGallery,
    addGallery: upsertGallery,
    removeGallery,
    videos,
    setVideos,
    addVideo: upsertVideo,
    removeVideo,
    categories,
    setCategories,
    addCategory: upsertCategory,
    removeCategory,
    users,
    setUsers,
    addUser: upsertUser,
    removeUser,
    prescriptions,
    setPrescriptions,
    addPrescription: upsertPrescription,
    removePrescription,
    loading,
    refetch: fetchAll,
    uid,
  }), [
    appointments, upsertAppointment, removeAppointment,
    patients, upsertPatient, removePatient,
    reviews, upsertReview, removeReview,
    followUps, upsertFollowUp, removeFollowUp,
    chambers, upsertChamber, removeChamber,
    notifications, upsertNotification,
    activity, logActivity,
    gallery, upsertGallery, removeGallery,
    videos, upsertVideo, removeVideo,
    categories, upsertCategory, removeCategory,
    users, upsertUser, removeUser,
    prescriptions, upsertPrescription, removePrescription,
    loading, fetchAll,
  ]);

  return value;
}

export type AdminData = ReturnType<typeof useAdminData>;