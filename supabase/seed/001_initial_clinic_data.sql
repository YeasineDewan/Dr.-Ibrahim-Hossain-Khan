-- Safe, repeatable development seed. Never place passwords or auth.users rows in SQL.
insert into public.chambers (name, place, address, hours, phone, email, status, capacity)
select 'Central Chamber', 'Dhaka', 'Dhaka, Bangladesh', 'Sat–Thu · 5:00 PM–9:00 PM', '+880 1700 000000', 'clinic@example.invalid', 'Active', 20
where not exists (select 1 from public.chambers where name = 'Central Chamber');

insert into public.categories (name, slug, products, status)
select 'General Medicine', 'general-medicine', 0, 'Active'
where not exists (select 1 from public.categories where slug = 'general-medicine');

insert into public.notifications (type, title, body, time, read)
select 'system', 'Clinic workspace ready', 'Initial clinic data has been seeded.', 'Just now', false
where not exists (select 1 from public.notifications where title = 'Clinic workspace ready');
