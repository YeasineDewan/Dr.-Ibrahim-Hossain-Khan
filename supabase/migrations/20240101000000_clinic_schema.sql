-- Supabase database schema for Dr. Ibrahim Clinic
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Patients table
create table if not exists patients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  dob date not null,
  gender text not null,
  phone text not null,
  email text,
  address text,
  blood_group text,
  allergies text[] default '{}',
  conditions text[] default '{}',
  medications jsonb default '[]',
  visits jsonb default '[]',
  notes jsonb default '[]',
  documents jsonb default '[]',
  vitals jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Appointments table
create table if not exists appointments (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references patients(id) on delete cascade,
  patient_name text not null,
  doctor text not null default 'Dr. Ibrahim',
  service text not null,
  chamber text not null,
  date date not null,
  time time not null,
  duration text not null,
  type text not null default 'In-person',
  status text not null default 'Pending',
  fee numeric not null default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Prescriptions table
create table if not exists prescriptions (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references patients(id) on delete cascade,
  patient_name text not null,
  doctor text not null default 'Dr. Ibrahim',
  date date not null,
  diagnosis text not null,
  medicines jsonb not null default '[]',
  notes text,
  status text not null default 'Draft',
  visit_id uuid,
  signature_data_url text,
  signed_at timestamp with time zone,
  sent_at timestamp with time zone,
  audit_trail jsonb default '[]',
  refill_count integer default 0,
  refills_allowed integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Follow-ups table
create table if not exists follow_ups (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references patients(id) on delete cascade,
  patient_name text not null,
  reason text not null,
  due_date date not null,
  status text not null default 'Upcoming',
  priority text not null default 'Medium',
  assigned_to text not null default 'Dr. Ibrahim',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chambers table
create table if not exists chambers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  place text not null,
  address text not null,
  hours text not null,
  phone text not null,
  email text,
  status text not null default 'Active',
  capacity integer not null default 20,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reviews table
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  author text not null,
  service text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  text text not null,
  date date not null,
  status text not null default 'Pending',
  reply text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications table
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  type text not null,
  title text not null,
  body text not null,
  time text not null,
  read boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activity log table
create table if not exists activity_log (
  id uuid primary key default uuid_generate_v4(),
  user text not null,
  action text not null,
  target text not null,
  time text not null,
  ip text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Users table (for admin/auth)
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text not null,
  roles text[] default '{}',
  permissions jsonb default '[]',
  mfa_enabled boolean not null default false,
  status text not null default 'active',
  last_login timestamp with time zone,
  failed_attempts integer not null default 0,
  locked_until timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Gallery table
create table if not exists gallery (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  title text not null,
  album text not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Videos table
create table if not exists videos (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  title_bn text,
  thumbnail text not null,
  duration text not null,
  views integer not null default 0,
  status text not null default 'Draft',
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories table
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  products integer not null default 0,
  status text not null default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Coupons table
create table if not exists coupons (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  type text not null,
  value numeric not null,
  min_order numeric not null default 0,
  uses integer not null default 0,
  max_uses integer not null default 100,
  expiry date not null,
  status text not null default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table patients enable row level security;
alter table appointments enable row level security;
alter table prescriptions enable row level security;
alter table follow_ups enable row level security;
alter table chambers enable row level security;
alter table reviews enable row level security;
alter table notifications enable row level security;
alter table activity_log enable row level security;
alter table users enable row level security;
alter table gallery enable row level security;
alter table videos enable row level security;
alter table categories enable row level security;
alter table coupons enable row level security;

-- Create policies (allow all for now - restrict in production)
create policy "Enable all for authenticated users" on patients for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated users" on appointments for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated users" on prescriptions for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated users" on follow_ups for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated users" on chambers for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated users" on reviews for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated users" on notifications for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated users" on activity_log for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated users" on users for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated users" on gallery for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated users" on videos for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated users" on categories for all using (auth.role() = 'authenticated');
create policy "Enable all for authenticated users" on coupons for all using (auth.role() = 'authenticated');

-- Create indexes for better query performance
create index if not exists idx_appointments_patient_id on appointments(patient_id);
create index if not exists idx_appointments_date on appointments(date);
create index if not exists idx_prescriptions_patient_id on prescriptions(patient_id);
create index if not exists idx_follow_ups_patient_id on follow_ups(patient_id);
create index if not exists idx_follow_ups_due_date on follow_ups(due_date);
create index if not exists idx_activity_log_created_at on activity_log(created_at desc);
