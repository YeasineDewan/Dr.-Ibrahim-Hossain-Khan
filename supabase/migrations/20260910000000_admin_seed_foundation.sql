-- Admin foundation and seed-safe profile constraints.
-- Authentication users are created by the seed script through Supabase Auth.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'patient' check (role in ('patient', 'doctor', 'admin')),
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create index if not exists profiles_role_idx on public.profiles(role);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when coalesce(new.raw_user_meta_data ->> 'role', '') in ('doctor', 'admin') then new.raw_user_meta_data ->> 'role' else 'patient' end,
    new.phone
  )
  on conflict (id) do update set full_name = excluded.full_name, phone = excluded.phone, updated_at = now();
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

 drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

comment on table public.profiles is 'Role-aware application profile. Public signup is always patient; staff promotion is controlled server-side.';

-- Seed the staff account with scripts/seed-admin.ts, never with plaintext SQL.
-- Required environment: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD.
