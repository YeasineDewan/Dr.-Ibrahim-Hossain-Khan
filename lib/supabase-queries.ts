import { createClient } from '@/utils/supabase/client';

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

export type Appointment = {
  id: string;
  patient_id: string;
  patient_name: string;
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

export type Prescription = {
  id: string;
  patient_id: string;
  patient_name: string;
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
  audit_trail: { at: string; actor: string; action: string; changes: string }[];
  refill_count: number;
  refills_allowed: number;
};

export type FollowUp = {
  id: string;
  patient_id: string;
  patient_name: string;
  reason: string;
  due_date: string;
  status: 'Upcoming' | 'Overdue' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  assigned_to: string;
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
  ip?: string;
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

export type Video = {
  id: string;
  title: string;
  title_bn?: string;
  thumbnail: string;
  duration: string;
  views: number;
  status: string;
  date: string;
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
  email: string;
  name: string;
  roles: string[];
  permissions: any[];
  mfa_enabled: boolean;
  status: string;
  last_login?: string;
  failed_attempts: number;
  locked_until?: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: 'Percent' | 'Flat';
  value: number;
  min_order: number;
  uses: number;
  max_uses: number;
  expiry: string;
  status: string;
};

export async function fetchPatients() {
  const supabase = createClient();
  const { data, error } = await supabase.from('patients').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Patient[];
}

export async function fetchAppointments() {
  const supabase = createClient();
  const { data, error } = await supabase.from('appointments').select('*').order('date', { ascending: true });
  if (error) throw new Error(error.message);
  return data as Appointment[];
}

export async function fetchPrescriptions() {
  const supabase = createClient();
  const { data, error } = await supabase.from('prescriptions').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Prescription[];
}

export async function fetchFollowUps() {
  const supabase = createClient();
  const { data, error } = await supabase.from('follow_ups').select('*').order('due_date', { ascending: true });
  if (error) throw new Error(error.message);
  return data as FollowUp[];
}

export async function fetchNotifications() {
  const supabase = createClient();
  const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Notification[];
}

export async function fetchActivityLog() {
  const supabase = createClient();
  const { data, error } = await supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) throw new Error(error.message);
  return data as ActivityItem[];
}

export async function fetchReviews() {
  const supabase = createClient();
  const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Review[];
}

export async function fetchChambers() {
  const supabase = createClient();
  const { data, error } = await supabase.from('chambers').select('*').order('name');
  if (error) throw new Error(error.message);
  return data as Chamber[];
}

export async function fetchVideos() {
  const supabase = createClient();
  const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Video[];
}

export async function fetchCategories() {
  const supabase = createClient();
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw new Error(error.message);
  return data as Category[];
}

export async function fetchUsers() {
  const supabase = createClient();
  const { data, error } = await supabase.from('users').select('*').order('name');
  if (error) throw new Error(error.message);
  return data as User[];
}

export async function fetchCoupons() {
  const supabase = createClient();
  const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Coupon[];
}
