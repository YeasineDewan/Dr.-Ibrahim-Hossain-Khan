-- Settings table for clinic-wide configuration
create table if not exists settings (
  id uuid primary key default uuid_generate_v4(),
  clinic_name text not null default 'Dr. Ibrahim Clinic',
  clinic_phone text,
  clinic_email text,
  clinic_address text,
  clinic_hours text,
  appointment_fee numeric not null default 4500,
  currency text not null default 'BDT',
  enable_mfa boolean not null default false,
  enable_booking boolean not null default true,
  smtp_host text,
  smtp_port integer,
  smtp_user text,
  smtp_password text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table settings enable row level security;
create policy "Enable all for authenticated users" on settings for all using (auth.role() = 'authenticated');
create index if not exists idx_settings_updated_at on settings(updated_at desc);