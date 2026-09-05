'use client';
import { useState, useCallback, useEffect } from 'react';

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

import { TODAY } from './utils';

const uid = () => Math.random().toString(36).slice(2, 9);

const samplePatients: Patient[] = [
  {
    id: 'DR-20481',
    name: 'Amara Mensah',
    dob: '1992-04-12',
    gender: 'Female',
    phone: '+233 24 555 0181',
    email: 'amara.m@email.com',
    address: '12 Cantonments, Accra',
    bloodGroup: 'O+',
    allergies: ['Penicillin'],
    conditions: ['Mild eczema'],
    medications: [{ name: 'Moisturizer', dose: 'Daily', status: 'Ongoing' }],
    visits: [
      {
        date: '2026-06-12',
        reason: 'Skin review',
        doctor: 'Dr. Ibrahim',
        notes: 'Stable, continue plan.',
      },
    ],
    notes: [
      {
        date: '2026-06-12',
        text: 'Patient responding well to current regimen.',
        author: 'Dr. Ibrahim',
      },
    ],
    documents: [{ name: 'Lab report.pdf', type: 'PDF', size: '1.2 MB', date: '2026-06-10' }],
    vitals: { bp: '118/76', hr: '72', temp: '36.7', weight: '64 kg', date: '2026-06-12' },
  },
  {
    id: 'DR-20482',
    name: 'Daniel Owusu',
    dob: '1988-09-23',
    gender: 'Male',
    phone: '+233 20 333 9920',
    email: 'danielo@email.com',
    address: 'East Legon, Accra',
    bloodGroup: 'A-',
    allergies: [],
    conditions: ['Psoriasis'],
    medications: [{ name: 'Topical steroid', dose: 'Twice daily', status: 'Ongoing' }],
    visits: [
      { date: '2026-06-10', reason: 'Follow-up', doctor: 'Dr. Ibrahim', notes: 'Reduce flare.' },
    ],
    notes: [],
    documents: [],
    vitals: { bp: '122/80', hr: '76', temp: '36.6', weight: '78 kg', date: '2026-06-10' },
  },
  {
    id: 'DR-20483',
    name: 'Sofia Boateng',
    dob: '1995-01-08',
    gender: 'Female',
    phone: '+233 27 100 4471',
    email: 'sofia.b@email.com',
    address: 'Tema, Greater Accra',
    bloodGroup: 'B+',
    allergies: ['Sulfa'],
    conditions: ['Hair thinning'],
    medications: [],
    visits: [
      {
        date: '2026-06-13',
        reason: 'PRP session',
        doctor: 'Dr. Ibrahim',
        notes: 'First session complete.',
      },
    ],
    notes: [],
    documents: [],
    vitals: { bp: '116/72', hr: '70', temp: '36.5', weight: '58 kg', date: '2026-06-13' },
  },
  {
    id: 'DR-20484',
    name: 'Michael Addo',
    dob: '1979-11-19',
    gender: 'Male',
    phone: '+233 24 999 2255',
    email: 'maddo@email.com',
    address: 'Adenta, Accra',
    bloodGroup: 'AB+',
    allergies: [],
    conditions: ['Hypertension'],
    medications: [{ name: 'Amlodipine 5mg', dose: 'Daily', status: 'Ongoing' }],
    visits: [{ date: '2026-06-14', reason: 'Routine', doctor: 'Dr. Ibrahim', notes: 'BP stable.' }],
    notes: [],
    documents: [],
    vitals: { bp: '128/82', hr: '74', temp: '36.8', weight: '85 kg', date: '2026-06-14' },
  },
  {
    id: 'DR-20485',
    name: 'Kwame Asante',
    dob: '1990-06-30',
    gender: 'Male',
    phone: '+233 50 111 8800',
    email: 'kwame.a@email.com',
    address: 'Kumasi, Ashanti',
    bloodGroup: 'O-',
    allergies: [],
    conditions: ['IBS'],
    medications: [],
    visits: [
      { date: '2026-06-09', reason: 'Gut review', doctor: 'Dr. Ibrahim', notes: 'Improving.' },
    ],
    notes: [],
    documents: [],
    vitals: { bp: '120/78', hr: '68', temp: '36.6', weight: '72 kg', date: '2026-06-09' },
  },
  {
    id: 'DR-20486',
    name: 'Aisha Rahman',
    dob: '1996-03-14',
    gender: 'Female',
    phone: '+233 24 700 1212',
    email: 'aisha.r@email.com',
    address: 'Ridge, Accra',
    bloodGroup: 'A+',
    allergies: [],
    conditions: ['Vitiligo'],
    medications: [],
    visits: [
      {
        date: '2026-06-05',
        reason: 'Skin assessment',
        doctor: 'Dr. Ibrahim',
        notes: 'Started topical plan.',
      },
    ],
    notes: [],
    documents: [],
    vitals: { bp: '110/70', hr: '70', temp: '36.6', weight: '55 kg', date: '2026-06-05' },
  },
  {
    id: 'DR-20487',
    name: 'Liam Carter',
    dob: '1985-12-02',
    gender: 'Male',
    phone: '+233 20 555 9911',
    email: 'liam.c@email.com',
    address: 'Airport Residential, Accra',
    bloodGroup: 'B-',
    allergies: ['Aspirin'],
    conditions: ['Sexual health'],
    medications: [],
    visits: [],
    notes: [],
    documents: [],
    vitals: { bp: '124/80', hr: '72', temp: '36.7', weight: '80 kg', date: '2026-05-30' },
  },
  {
    id: 'DR-20488',
    name: 'Priya Sharma',
    dob: '1993-08-21',
    gender: 'Female',
    phone: '+233 27 888 7766',
    email: 'priya.s@email.com',
    address: 'Cantonments, Accra',
    bloodGroup: 'O+',
    allergies: [],
    conditions: ['PCOS'],
    medications: [],
    visits: [],
    notes: [],
    documents: [],
    vitals: { bp: '118/74', hr: '76', temp: '36.6', weight: '60 kg', date: '2026-05-22' },
  },
  {
    id: 'DR-20489',
    name: 'Noah Becker',
    dob: '1980-02-11',
    gender: 'Male',
    phone: '+233 24 333 4422',
    email: 'noah.b@email.com',
    address: 'Labadi, Accra',
    bloodGroup: 'A+',
    allergies: [],
    conditions: ['Low sperm count'],
    medications: [],
    visits: [],
    notes: [],
    documents: [],
    vitals: { bp: '130/84', hr: '78', temp: '36.8', weight: '82 kg', date: '2026-05-18' },
  },
  {
    id: 'DR-20490',
    name: 'Yuki Tanaka',
    dob: '1998-07-04',
    gender: 'Female',
    phone: '+233 27 666 1100',
    email: 'yuki.t@email.com',
    address: 'Roman Ridge, Accra',
    bloodGroup: 'AB-',
    allergies: [],
    conditions: [],
    medications: [],
    visits: [],
    notes: [],
    documents: [],
    vitals: { bp: '112/72', hr: '68', temp: '36.5', weight: '52 kg', date: '2026-05-15' },
  },
  {
    id: 'DR-20491',
    name: 'Olivia Park',
    dob: '1987-10-29',
    gender: 'Female',
    phone: '+233 24 222 8800',
    email: 'olivia.p@email.com',
    address: 'Dzorwulu, Accra',
    bloodGroup: 'O+',
    allergies: [],
    conditions: ['Anxiety'],
    medications: [],
    visits: [],
    notes: [],
    documents: [],
    vitals: { bp: '120/78', hr: '74', temp: '36.7', weight: '62 kg', date: '2026-05-10' },
  },
  {
    id: 'DR-20492',
    name: 'Mateo Diaz',
    dob: '1991-05-16',
    gender: 'Male',
    phone: '+233 50 444 7766',
    email: 'mateo.d@email.com',
    address: 'Spintex, Accra',
    bloodGroup: 'B+',
    allergies: [],
    conditions: ['Eczema'],
    medications: [],
    visits: [],
    notes: [],
    documents: [],
    vitals: { bp: '122/80', hr: '72', temp: '36.6', weight: '76 kg', date: '2026-05-04' },
  },
];

const sampleAppointments: Appointment[] = [
  {
    id: 'APT-001',
    patient: 'Amara Mensah',
    doctor: 'Dr. Ibrahim',
    service: 'General consultation',
    chamber: 'Dhanmondi',
    date: TODAY,
    time: '09:00',
    duration: '30 min',
    type: 'In-person',
    status: 'Confirmed',
    fee: 4500,
  },
  {
    id: 'APT-002',
    patient: 'Daniel Owusu',
    doctor: 'Dr. Ibrahim',
    service: 'Skin consultation',
    chamber: 'Banglamotor',
    date: TODAY,
    time: '10:30',
    duration: '30 min',
    type: 'In-person',
    status: 'Pending',
    fee: 5000,
  },
  {
    id: 'APT-003',
    patient: 'Sofia Boateng',
    doctor: 'Dr. Ibrahim',
    service: 'PRP Therapy',
    chamber: 'Dhanmondi',
    date: TODAY,
    time: '13:00',
    duration: '60 min',
    type: 'In-person',
    status: 'Confirmed',
    fee: 12000,
  },
  {
    id: 'APT-004',
    patient: 'Michael Addo',
    doctor: 'Dr. Ibrahim',
    service: 'Follow-up visit',
    chamber: 'Uttara',
    date: TODAY,
    time: '14:30',
    duration: '30 min',
    type: 'In-person',
    status: 'Confirmed',
    fee: 3000,
  },
  {
    id: 'APT-005',
    patient: 'Kwame Asante',
    doctor: 'Dr. Ibrahim',
    service: 'Gut health consultation',
    chamber: 'Dhanmondi',
    date: TODAY,
    time: '16:00',
    duration: '45 min',
    type: 'In-person',
    status: 'Waitlist',
    fee: 6000,
  },
  {
    id: 'APT-006',
    patient: 'Aisha Rahman',
    doctor: 'Dr. Ibrahim',
    service: 'Vitiligo Treatment',
    chamber: 'Dhanmondi',
    date: '2026-06-19',
    time: '10:00',
    duration: '45 min',
    type: 'In-person',
    status: 'Confirmed',
    fee: 10000,
  },
  {
    id: 'APT-007',
    patient: 'Liam Carter',
    doctor: 'Dr. Ibrahim',
    service: 'Sexual health',
    chamber: 'Banglamotor',
    date: '2026-06-19',
    time: '15:30',
    duration: '30 min',
    type: 'Video',
    status: 'Confirmed',
    fee: 5500,
  },
  {
    id: 'APT-008',
    patient: 'Priya Sharma',
    doctor: 'Dr. Ibrahim',
    service: 'PCOS & Fertility Care',
    chamber: 'Uttara',
    date: '2026-06-20',
    time: '11:00',
    duration: '60 min',
    type: 'In-person',
    status: 'Pending',
    fee: 8000,
  },
  {
    id: 'APT-009',
    patient: 'Noah Becker',
    doctor: 'Dr. Ibrahim',
    service: 'Fertility care',
    chamber: 'Dhanmondi',
    date: '2026-06-22',
    time: '09:30',
    duration: '45 min',
    type: 'In-person',
    status: 'Confirmed',
    fee: 7500,
  },
  {
    id: 'APT-010',
    patient: 'Olivia Park',
    doctor: 'Dr. Ibrahim',
    service: 'Integrative Medicine',
    chamber: 'Dhanmondi',
    date: '2026-06-23',
    time: '14:00',
    duration: '60 min',
    type: 'In-person',
    status: 'Pending',
    fee: 9000,
  },
];

const sampleReviews: Review[] = [
  {
    id: 'REV-001',
    author: 'Amara Mensah',
    service: 'Skin care',
    rating: 5,
    text: 'I finally felt listened to. The plan was simple, personal and fit my routine.',
    date: '2026-06-12',
    status: 'Approved',
  },
  {
    id: 'REV-002',
    author: 'Daniel Owusu',
    service: 'Psoriasis Treatment',
    rating: 4,
    text: 'Good progress in 4 weeks. Waiting on the next round.',
    date: '2026-06-10',
    status: 'Approved',
  },
  {
    id: 'REV-003',
    author: 'Sofia Boateng',
    service: 'PRP Therapy',
    rating: 5,
    text: 'Wonderful experience from start to finish.',
    date: '2026-06-13',
    status: 'Approved',
  },
  {
    id: 'REV-004',
    author: 'Aisha Rahman',
    service: 'Vitiligo Treatment',
    rating: 4,
    text: 'Helpful consultation, very thoughtful.',
    date: '2026-06-09',
    status: 'Pending',
  },
  {
    id: 'REV-005',
    author: 'Liam Carter',
    service: 'Sexual health',
    rating: 5,
    text: 'Discreet and professional.',
    date: '2026-06-08',
    status: 'Pending',
  },
  {
    id: 'REV-006',
    author: 'Mateo Diaz',
    service: 'Skin care',
    rating: 2,
    text: 'Wait time was long, but the doctor was kind.',
    date: '2026-06-04',
    status: 'Pending',
  },
];

const sampleFollowUps: FollowUp[] = [
  {
    id: 'FU-001',
    patient: 'Amara Mensah',
    reason: 'Skin review',
    dueDate: '2026-06-25',
    status: 'Upcoming',
    priority: 'Medium',
    assignedTo: 'Dr. Ibrahim',
  },
  {
    id: 'FU-002',
    patient: 'Daniel Owusu',
    reason: 'Psoriasis flare check',
    dueDate: '2026-06-19',
    status: 'Upcoming',
    priority: 'High',
    assignedTo: 'Dr. Ibrahim',
  },
  {
    id: 'FU-003',
    patient: 'Sofia Boateng',
    reason: 'PRP follow-up',
    dueDate: '2026-07-13',
    status: 'Upcoming',
    priority: 'Low',
    assignedTo: 'Dr. Ibrahim',
  },
  {
    id: 'FU-004',
    patient: 'Michael Addo',
    reason: 'BP check',
    dueDate: '2026-06-15',
    status: 'Overdue',
    priority: 'High',
    assignedTo: 'Dr. Ibrahim',
  },
  {
    id: 'FU-005',
    patient: 'Kwame Asante',
    reason: 'IBS review',
    dueDate: '2026-07-09',
    status: 'Upcoming',
    priority: 'Medium',
    assignedTo: 'Dr. Ibrahim',
  },
  {
    id: 'FU-006',
    patient: 'Aisha Rahman',
    reason: 'Vitiligo progress',
    dueDate: '2026-06-12',
    status: 'Overdue',
    priority: 'Medium',
    assignedTo: 'Dr. Ibrahim',
  },
  {
    id: 'FU-007',
    patient: 'Liam Carter',
    reason: 'Sexual health review',
    dueDate: '2026-06-19',
    status: 'Completed',
    priority: 'Low',
    assignedTo: 'Dr. Ibrahim',
  },
];

const sampleChambers: Chamber[] = [
  {
    id: 'CH-1',
    name: 'Dhanmondi',
    place: 'American Wellness Center',
    address: 'House 45, Road 22, Dhanmondi, Dhaka 1209',
    hours: '9:00 AM – 2:00 PM',
    phone: '+880 1719 395 553',
    status: 'Active',
    capacity: 25,
  },
  {
    id: 'CH-2',
    name: 'Banglamotor',
    place: 'Medigo Health Care',
    address: 'Rupayan Trade Center, 14 Kazi Nazrul Islam Ave',
    hours: '4:00 PM – 9:00 PM',
    phone: '+880 1811 224 557',
    status: 'Active',
    capacity: 20,
  },
  {
    id: 'CH-3',
    name: 'Uttara',
    place: 'Ibn Sina Diagnostic Centre',
    address: 'Sector 7, Sonargaon Janapath, Uttara',
    hours: '10:00 AM – 1:00 PM',
    phone: '+880 1717 332 880',
    status: 'Active',
    capacity: 18,
  },
];

const samplePrescriptions: Prescription[] = [
  {
    id: 'RX-001',
    patientId: 'DR-20481',
    patientName: 'Amara Mensah',
    doctor: 'Dr. Ibrahim',
    date: '2026-06-12',
    diagnosis: 'Mild eczema flare',
    medicines: [
      {
        name: 'Moisturizer',
        dose: 'Apply twice daily',
        frequency: 'Twice daily',
        duration: '14 days',
        instructions: 'Apply after shower on damp skin',
      },
      {
        name: 'Hydrocortisone 1%',
        dose: 'Thin layer',
        frequency: 'Once daily',
        duration: '7 days',
        instructions: 'Apply to affected areas only',
      },
    ],
    notes: 'Continue current skincare routine. Avoid hot water.',
    status: 'Signed',
    createdAt: '2026-06-12T09:30:00Z',
  },
  {
    id: 'RX-002',
    patientId: 'DR-20482',
    patientName: 'Daniel Owusu',
    doctor: 'Dr. Ibrahim',
    date: '2026-06-10',
    diagnosis: 'Psoriasis maintenance',
    medicines: [
      {
        name: 'Topical steroid',
        dose: 'Apply to plaques',
        frequency: 'Twice daily',
        duration: '30 days',
        instructions: 'Use on active plaques only',
      },
    ],
    notes: 'Reduce flare. Follow up in 4 weeks.',
    status: 'Signed',
    createdAt: '2026-06-10T11:00:00Z',
  },
  {
    id: 'RX-003',
    patientId: 'DR-20484',
    patientName: 'Michael Addo',
    doctor: 'Dr. Ibrahim',
    date: '2026-06-14',
    diagnosis: 'Hypertension follow-up',
    medicines: [
      {
        name: 'Amlodipine 5mg',
        dose: '5mg',
        frequency: 'Once daily',
        duration: '90 days',
        instructions: 'Take in the morning with water',
      },
    ],
    notes: 'BP stable. Continue current regimen.',
    status: 'Sent',
    createdAt: '2026-06-14T14:30:00Z',
  },
];

const sampleCoupons: Coupon[] = [
  {
    id: 'CP-001',
    code: 'WELCOME10',
    type: 'Percent',
    value: 10,
    minOrder: 50,
    uses: 23,
    maxUses: 200,
    expiry: '2026-12-31',
    status: 'Active',
  },
  {
    id: 'CP-002',
    code: 'FLAT5',
    type: 'Flat',
    value: 5,
    minOrder: 30,
    uses: 88,
    maxUses: 500,
    expiry: '2026-08-30',
    status: 'Active',
  },
  {
    id: 'CP-003',
    code: 'SUMMER25',
    type: 'Percent',
    value: 25,
    minOrder: 100,
    uses: 12,
    maxUses: 100,
    expiry: '2026-09-15',
    status: 'Scheduled',
  },
  {
    id: 'CP-004',
    code: 'OLDSCHOOL',
    type: 'Flat',
    value: 10,
    minOrder: 0,
    uses: 500,
    maxUses: 500,
    expiry: '2026-04-30',
    status: 'Expired',
  },
];

const sampleNotifications: Notification[] = [
  {
    id: 'N-001',
    type: 'appointment',
    title: 'New appointment booked',
    body: 'Priya Sharma booked PCOS & Fertility Care for 20 Jun 11:00.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'N-002',
    type: 'patient',
    title: 'New patient registered',
    body: 'Olivia Park completed intake and is ready for review.',
    time: '15 min ago',
    read: false,
  },
  {
    id: 'N-003',
    type: 'system',
    title: 'Lab results ready',
    body: 'Amara Mensah skin panel results uploaded for review.',
    time: '1 h ago',
    read: false,
  },
  {
    id: 'N-004',
    type: 'patient',
    title: 'Follow-up overdue',
    body: 'Michael Addo BP check is overdue by 3 days.',
    time: '3 h ago',
    read: true,
  },
  {
    id: 'N-005',
    type: 'system',
    title: 'Backup completed',
    body: 'Daily backup completed successfully at 03:00 AM.',
    time: '12 h ago',
    read: true,
  },
  {
    id: 'N-006',
    type: 'appointment',
    title: 'Appointment rescheduled',
    body: 'Kwame Asante moved to 22 Jun 09:30.',
    time: '1 d ago',
    read: true,
  },
  {
    id: 'N-007',
    type: 'patient',
    title: 'New review received',
    body: 'Mateo Diaz left a 2-star review for the skin care service.',
    time: '2 d ago',
    read: true,
  },
];

const sampleActivity: ActivityItem[] = [
  {
    id: 'A-001',
    user: 'Dr. Ibrahim',
    action: 'updated',
    target: 'Patient #DR-20481',
    time: '2 min ago',
    ip: '102.176.55.21',
  },
  {
    id: 'A-002',
    user: 'Front Desk',
    action: 'created',
    target: 'Appointment APT-008',
    time: '12 min ago',
    ip: '102.176.55.32',
  },
  {
    id: 'A-003',
    user: 'Dr. Ibrahim',
    action: 'approved',
    target: 'Review REV-001',
    time: '34 min ago',
    ip: '102.176.55.21',
  },
  {
    id: 'A-004',
    user: 'System',
    action: 'flagged',
    target: 'Low stock: Vitamin D3',
    time: '1 h ago',
    ip: 'system',
  },
  {
    id: 'A-005',
    user: 'Front Desk',
    action: 'updated',
    target: 'Patient #DR-20489 follow-up',
    time: '2 h ago',
    ip: '102.176.55.32',
  },
  {
    id: 'A-006',
    user: 'Dr. Ibrahim',
    action: 'updated',
    target: 'Chamber schedule',
    time: '4 h ago',
    ip: '102.176.55.21',
  },
  {
    id: 'A-007',
    user: 'System',
    action: 'sent',
    target: 'Daily summary email',
    time: '8 h ago',
    ip: 'system',
  },
  {
    id: 'A-008',
    user: 'Dr. Ibrahim',
    action: 'created',
    target: 'Service: Sexual health',
    time: '1 d ago',
    ip: '102.176.55.21',
  },
  {
    id: 'A-009',
    user: 'Front Desk',
    action: 'updated',
    target: 'Patient #DR-20487',
    time: '1 d ago',
    ip: '102.176.55.32',
  },
  {
    id: 'A-010',
    user: 'Dr. Ibrahim',
    action: 'published',
    target: 'Blog: Vitiligo care',
    time: '2 d ago',
    ip: '102.176.55.21',
  },
];

const sampleGallery = [
  {
    id: 'G-001',
    url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=400&q=80',
    title: 'Reception',
    album: 'Clinic',
    date: '2026-04-12',
  },
  {
    id: 'G-002',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
    title: 'Consultation room',
    album: 'Clinic',
    date: '2026-04-15',
  },
  {
    id: 'G-003',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80',
    title: 'Procedure room',
    album: 'Clinic',
    date: '2026-05-02',
  },
  {
    id: 'G-004',
    url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=400&q=80',
    title: 'Skin assessment',
    album: 'Treatments',
    date: '2026-05-19',
  },
  {
    id: 'G-005',
    url: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=400&q=80',
    title: 'Consultation room',
    album: 'Clinic',
    date: '2026-05-22',
  },
  {
    id: 'G-006',
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80',
    title: 'Team meeting',
    album: 'Team',
    date: '2026-06-01',
  },
  {
    id: 'G-007',
    url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=400&q=80',
    title: 'Lab',
    album: 'Clinic',
    date: '2026-06-04',
  },
  {
    id: 'G-008',
    url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=400&q=80',
    title: 'Care session',
    album: 'Treatments',
    date: '2026-06-10',
  },
];

const sampleVideos: Video[] = [
  {
    id: 'V-001',
    title: 'The art of a good consultation',
    thumbnail:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80',
    duration: '04:32',
    views: 1284,
    status: 'Published',
    date: '2026-05-01',
  },
  {
    id: 'V-002',
    title: 'Inside the clinic: a tour',
    thumbnail:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
    duration: '02:18',
    views: 942,
    status: 'Published',
    date: '2026-05-08',
  },
  {
    id: 'V-003',
    title: 'Understanding vitiligo',
    thumbnail:
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=400&q=80',
    duration: '06:14',
    views: 2105,
    status: 'Published',
    date: '2026-04-22',
  },
  {
    id: 'V-004',
    title: 'Skin care for sensitive skin',
    thumbnail:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80',
    duration: '05:01',
    views: 0,
    status: 'Draft',
    date: '2026-06-12',
  },
];

const sampleCategory: Category[] = [
  { id: 'CAT-001', name: 'Skin care', slug: 'skin-care', products: 4, status: 'Active' },
  { id: 'CAT-002', name: 'Wellness', slug: 'wellness', products: 1, status: 'Active' },
  { id: 'CAT-003', name: 'Gut health', slug: 'gut-health', products: 2, status: 'Active' },
  { id: 'CAT-004', name: 'Vitamins', slug: 'vitamins', products: 1, status: 'Active' },
  { id: 'CAT-005', name: 'Sensitive skin', slug: 'sensitive-skin', products: 1, status: 'Active' },
];

const sampleUsers: User[] = [
  {
    id: 'U-001',
    name: 'Dr. Ibrahim Hossain',
    email: 'dr.ibrahim@dribrahim.clinic',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2026-06-18 08:24',
    avatar: 'DI',
  },
  {
    id: 'U-002',
    name: 'Aisha Mensah',
    email: 'aisha@dribrahim.clinic',
    role: 'Front Desk',
    status: 'Active',
    lastLogin: '2026-06-18 09:11',
    avatar: 'AM',
  },
  {
    id: 'U-003',
    name: 'Kwame Boateng',
    email: 'kwame@dribrahim.clinic',
    role: 'Nurse',
    status: 'Active',
    lastLogin: '2026-06-17 16:42',
    avatar: 'KB',
  },
  {
    id: 'U-004',
    name: 'Olivia Owusu',
    email: 'olivia@dribrahim.clinic',
    role: 'Pharmacist',
    status: 'Active',
    lastLogin: '2026-06-17 14:08',
    avatar: 'OO',
  },
  {
    id: 'U-005',
    name: 'Noah Addo',
    email: 'noah@dribrahim.clinic',
    role: 'Manager',
    status: 'Inactive',
    lastLogin: '2026-05-12 11:30',
    avatar: 'NA',
  },
];

export function useAdminData() {
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments);
  const [patients, setPatients] = useState<Patient[]>(samplePatients);
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [followUps, setFollowUps] = useState<FollowUp[]>(sampleFollowUps);
  const [chambers, setChambers] = useState<Chamber[]>(sampleChambers);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [activity, setActivity] = useState<ActivityItem[]>(sampleActivity);
  const [gallery, setGallery] = useState(sampleGallery);
  const [videos, setVideos] = useState<Video[]>(sampleVideos);
  const [categories, setCategories] = useState<Category[]>(sampleCategory);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(samplePrescriptions);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem('dribrahim.admin.content');
      if (!saved) return;
      const content = JSON.parse(saved);
      if (Array.isArray(content.appointments)) setAppointments(content.appointments);
      if (Array.isArray(content.patients)) setPatients(content.patients);
      if (Array.isArray(content.reviews)) setReviews(content.reviews);
      if (Array.isArray(content.followUps)) setFollowUps(content.followUps);
      if (Array.isArray(content.chambers)) setChambers(content.chambers);
      if (Array.isArray(content.notifications)) setNotifications(content.notifications);
      if (Array.isArray(content.activity)) setActivity(content.activity);
      if (Array.isArray(content.gallery)) setGallery(content.gallery);
      if (Array.isArray(content.videos)) setVideos(content.videos);
      if (Array.isArray(content.categories)) setCategories(content.categories);
      if (Array.isArray(content.users)) setUsers(content.users);
      if (Array.isArray(content.prescriptions)) setPrescriptions(content.prescriptions);
    } catch {
      /* Keep safe defaults when storage is unavailable or malformed. */
    }
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        'dribrahim.admin.content',
        JSON.stringify({
          appointments,
          patients,
          reviews,
          followUps,
          chambers,
          notifications,
          activity,
          gallery,
          videos,
          categories,
          users,
          prescriptions,
        })
      );
    } catch {
      /* Storage is optional. */
    }
  }, [
    appointments,
    patients,
    reviews,
    followUps,
    chambers,
    notifications,
    activity,
    gallery,
    videos,
    categories,
    users,
    prescriptions,
  ]);

  const upsert = useCallback(
    <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
      (item: T) => {
        setter(prev => {
          const i = prev.findIndex(p => p.id === item.id);
          if (i === -1) return [{ ...item, id: item.id || uid() }, ...prev];
          const copy = [...prev];
          copy[i] = { ...copy[i], ...item };
          return copy;
        });
      },
    []
  );

  const remove = useCallback(
    <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
      (id: string) => {
        setter(prev => prev.filter(p => p.id !== id));
      },
    []
  );

  const logActivity = useCallback((user: string, action: string, target: string) => {
    setActivity(prev => [
      { id: uid(), user, action, target, time: 'just now', ip: '102.176.55.21' },
      ...prev,
    ]);
  }, []);

  return {
    appointments,
    setAppointments,
    addAppointment: upsert(setAppointments),
    removeAppointment: remove(setAppointments),
    patients,
    setPatients,
    addPatient: upsert(setPatients),
    removePatient: remove(setPatients),
    reviews,
    setReviews,
    addReview: upsert(setReviews),
    removeReview: remove(setReviews),
    followUps,
    setFollowUps,
    addFollowUp: upsert(setFollowUps),
    removeFollowUp: remove(setFollowUps),
    chambers,
    setChambers,
    addChamber: upsert(setChambers),
    removeChamber: remove(setChambers),
    notifications,
    setNotifications,
    activity,
    setActivity,
    logActivity,
    gallery,
    setGallery,
    addGallery: upsert(setGallery),
    removeGallery: remove(setGallery),
    videos,
    setVideos,
    addVideo: upsert(setVideos),
    removeVideo: remove(setVideos),
    categories,
    setCategories,
    addCategory: upsert(setCategories),
    removeCategory: remove(setCategories),
    users,
    setUsers,
    addUser: upsert(setUsers),
    removeUser: remove(setUsers),
    prescriptions,
    setPrescriptions,
    addPrescription: upsert(setPrescriptions),
    removePrescription: remove(setPrescriptions),
    uid,
  };
}

export type AdminData = ReturnType<typeof useAdminData>;
