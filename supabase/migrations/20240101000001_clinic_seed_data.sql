-- Seed data for Dr. Ibrahim Clinic
-- Run this after running the schema migration

-- Insert sample patients
insert into patients (id, name, dob, gender, phone, email, address, blood_group, allergies, conditions, medications, visits, notes, documents, vitals)
values
  ('DR-20481', 'Amara Mensah', '1992-04-12', 'Female', '+233 24 555 0181', 'amara.m@email.com', '12 Cantonments, Accra', 'O+', 
   '{"Penicillin"}', '{"Mild eczema"}', 
   '[{"name":"Moisturizer","dose":"Daily","status":"Ongoing"}]',
   '[{"date":"2026-06-12","reason":"Skin review","doctor":"Dr. Ibrahim","notes":"Stable, continue plan."}]',
   '[{"date":"2026-06-12","text":"Patient responding well to current regimen.","author":"Dr. Ibrahim"}]',
   '[{"name":"Lab report.pdf","type":"PDF","size":"1.2 MB","date":"2026-06-10"}]',
   '{"bp":"118/76","hr":"72","temp":"36.7","weight":"64 kg","date":"2026-06-12"}'),
  
  ('DR-20482', 'Daniel Owusu', '1988-09-23', 'Male', '+233 20 333 9920', 'danielo@email.com', 'East Legon, Accra', 'A-',
   '{}', '{"Psoriasis"}',
   '[{"name":"Topical steroid","dose":"Twice daily","status":"Ongoing"}]',
   '[{"date":"2026-06-10","reason":"Follow-up","doctor":"Dr. Ibrahim","notes":"Reduce flare."}]',
   '{}',
   '{}',
   '{"bp":"122/80","hr":"76","temp":"36.6","weight":"78 kg","date":"2026-06-10"}'),

  ('DR-20483', 'Sofia Boateng', '1995-01-08', 'Female', '+233 27 100 4471', 'sofia.b@email.com', 'Tema, Greater Accra', 'B+',
   '{"Sulfa"}', '{"Hair thinning"}',
   '[]',
   '[{"date":"2026-06-13","reason":"PRP session","doctor":"Dr. Ibrahim","notes":"First session complete."}]',
   '{}',
   '{}',
   '{"bp":"116/72","hr":"70","temp":"36.5","weight":"58 kg","date":"2026-06-13"}'),

  ('DR-20484', 'Michael Addo', '1979-11-19', 'Male', '+233 24 999 2255', 'maddo@email.com', 'Adenta, Accra', 'AB+',
   '{}', '{"Hypertension"}',
   '[{"name":"Amlodipine 5mg","dose":"Daily","status":"Ongoing"}]',
   '[{"date":"2026-06-14","reason":"Routine","doctor":"Dr. Ibrahim","notes":"BP stable."}]',
   '{}',
   '{}',
   '{"bp":"128/82","hr":"74","temp":"36.8","weight":"85 kg","date":"2026-06-14"}'),

  ('DR-20485', 'Kwame Asante', '1990-06-30', 'Male', '+233 50 111 8800', 'kwame.a@email.com', 'Kumasi, Ashanti', 'O-',
   '{}', '{"IBS"}',
   '[]',
   '[{"date":"2026-06-09","reason":"Gut review","doctor":"Dr. Ibrahim","notes":"Improving."}]',
   '{}',
   '{}',
   '{"bp":"120/78","hr":"68","temp":"36.6","weight":"72 kg","date":"2026-06-09"}');

-- Insert sample appointments
insert into appointments (id, patient_id, patient_name, doctor, service, chamber, date, time, duration, type, status, fee, notes)
values
  ('APT-001', 'DR-20481', 'Amara Mensah', 'Dr. Ibrahim', 'General consultation', 'Dhanmondi', '2026-06-18', '09:00', '30 min', 'In-person', 'Confirmed', 4500, null),
  ('APT-002', 'DR-20482', 'Daniel Owusu', 'Dr. Ibrahim', 'Skin consultation', 'Banglamotor', '2026-06-18', '10:30', '30 min', 'In-person', 'Pending', 5000, null),
  ('APT-003', 'DR-20483', 'Sofia Boateng', 'Dr. Ibrahim', 'PRP Therapy', 'Dhanmondi', '2026-06-18', '13:00', '60 min', 'In-person', 'Confirmed', 12000, null),
  ('APT-004', 'DR-20484', 'Michael Addo', 'Dr. Ibrahim', 'Follow-up visit', 'Uttara', '2026-06-18', '14:30', '30 min', 'In-person', 'Confirmed', 3000, null),
  ('APT-005', 'DR-20485', 'Kwame Asante', 'Dr. Ibrahim', 'Gut health consultation', 'Dhanmondi', '2026-06-18', '16:00', '45 min', 'In-person', 'Waitlist', 6000, null);

-- Insert sample prescriptions
insert into prescriptions (id, patient_id, patient_name, doctor, date, diagnosis, medicines, notes, status, audit_trail, refill_count, refills_allowed)
values
  ('RX-001', 'DR-20481', 'Amara Mensah', 'Dr. Ibrahim', '2026-06-12', 'Mild eczema flare',
   '[{"name":"Moisturizer","dose":"Apply twice daily","frequency":"Twice daily","duration":"14 days","instructions":"Apply after shower on damp skin"},{"name":"Hydrocortisone 1%","dose":"Thin layer","frequency":"Once daily","duration":"7 days","instructions":"Apply to affected areas only"}]',
   'Continue current skincare routine. Avoid hot water.', 'Signed', '[]', 0, 2),
  
  ('RX-002', 'DR-20482', 'Daniel Owusu', 'Dr. Ibrahim', '2026-06-10', 'Psoriasis maintenance',
   '[{"name":"Topical steroid","dose":"Apply to plaques","frequency":"Twice daily","duration":"30 days","instructions":"Use on active plaques only"}]',
   'Reduce flare. Follow up in 4 weeks.', 'Signed', '[]', 0, 1),
  
  ('RX-003', 'DR-20484', 'Michael Addo', 'Dr. Ibrahim', '2026-06-14', 'Hypertension follow-up',
   '[{"name":"Amlodipine 5mg","dose":"5mg","frequency":"Once daily","duration":"90 days","instructions":"Take in the morning with water"}]',
   'BP stable. Continue current regimen.', 'Sent', '[]', 0, 3);

-- Insert sample follow-ups
insert into follow_ups (id, patient_id, patient_name, reason, due_date, status, priority, assigned_to)
values
  ('FU-001', 'DR-20481', 'Amara Mensah', 'Skin review', '2026-06-25', 'Upcoming', 'Medium', 'Dr. Ibrahim'),
  ('FU-002', 'DR-20482', 'Daniel Owusu', 'Psoriasis flare check', '2026-06-19', 'Upcoming', 'High', 'Dr. Ibrahim'),
  ('FU-003', 'DR-20483', 'Sofia Boateng', 'PRP follow-up', '2026-07-13', 'Upcoming', 'Low', 'Dr. Ibrahim'),
  ('FU-004', 'DR-20484', 'Michael Addo', 'BP check', '2026-06-15', 'Overdue', 'High', 'Dr. Ibrahim'),
  ('FU-005', 'DR-20485', 'Kwame Asante', 'IBS review', '2026-07-09', 'Upcoming', 'Medium', 'Dr. Ibrahim');

-- Insert sample chambers
insert into chambers (id, name, place, address, hours, phone, email, status, capacity)
values
  ('CH-1', 'Dhanmondi', 'American Wellness Center', 'House 45, Road 22, Dhanmondi, Dhaka 1209', '09:00 AM - 09:00 PM', '+880 1719 395 553', 'hello@dribrahim.clinic', 'Active', 25),
  ('CH-2', 'Banglamotor', 'Medigo Healthcare', 'Rupayan Trade Center, 3rd Floor, 114 Kazi Nazrul Islam Ave, Dhaka 1100', '04:00 PM - 09:00 PM', '01886-643626', 'info@medigohealthcares.com', 'Active', 20),
  ('CH-3', 'Uttara', 'Ibn Sina Diagnostic Centre', 'Sector 7, Sonargaon Janapath, Uttara', '10:00 AM - 01:00 PM', '+880 1717 332 880', null, 'Active', 18);

-- Insert sample notifications
insert into notifications (id, type, title, body, time, read)
values
  ('N-001', 'appointment', 'New appointment booked', 'Priya Sharma booked PCOS & Fertility Care for 20 Jun 11:00.', '2 min ago', false),
  ('N-002', 'patient', 'New patient registered', 'Olivia Park completed intake and is ready for review.', '15 min ago', false),
  ('N-003', 'system', 'Lab results ready', 'Amara Mensah skin panel results uploaded for review.', '1 h ago', false),
  ('N-004', 'patient', 'Follow-up overdue', 'Michael Addo BP check is overdue by 3 days.', '3 h ago', true),
  ('N-005', 'system', 'Backup completed', 'Daily backup completed successfully at 03:00 AM.', '12 h ago', true);

-- Insert sample activity log
insert into activity_log (id, user, action, target, time, ip)
values
  ('A-001', 'Dr. Ibrahim', 'updated', 'Patient #DR-20481', '2 min ago', '102.176.55.21'),
  ('A-002', 'Front Desk', 'created', 'Appointment APT-008', '12 min ago', '102.176.55.32'),
  ('A-003', 'Dr. Ibrahim', 'approved', 'Review REV-001', '34 min ago', '102.176.55.21'),
  ('A-004', 'System', 'flagged', 'Low stock: Vitamin D3', '1 h ago', 'system'),
  ('A-005', 'Front Desk', 'updated', 'Patient #DR-20489 follow-up', '2 h ago', '102.176.55.32');

-- Insert sample reviews
insert into reviews (id, author, service, rating, text, date, status)
values
  ('REV-001', 'Amara Mensah', 'Skin care', 5, 'I finally felt listened to. The plan was simple, personal and fit my routine.', '2026-06-12', 'Approved'),
  ('REV-002', 'Daniel Owusu', 'Psoriasis Treatment', 4, 'Good progress in 4 weeks. Waiting on the next round.', '2026-06-10', 'Approved'),
  ('REV-003', 'Sofia Boateng', 'PRP Therapy', 5, 'Wonderful experience from start to finish.', '2026-06-13', 'Approved'),
  ('REV-004', 'Aisha Rahman', 'Vitiligo Treatment', 4, 'Helpful consultation, very thoughtful.', '2026-06-09', 'Pending'),
  ('REV-005', 'Liam Carter', 'Sexual health', 5, 'Discreet and professional.', '2026-06-08', 'Pending');

-- Insert sample users
insert into users (id, email, name, roles, permissions, mfa_enabled, status, last_login, failed_attempts)
values
  ('U-001', 'dr.ibrahim@dribrahim.clinic', 'Dr. Ibrahim Hossain', '["admin"]', '[]', false, 'Active', '2026-06-18 08:24', 0),
  ('U-002', 'aisha@dribrahim.clinic', 'Aisha Mensah', '["front-desk"]', '[]', false, 'Active', '2026-06-18 09:11', 0),
  ('U-003', 'kwame@dribrahim.clinic', 'Kwame Boateng', '["nurse"]', '[]', false, 'Active', '2026-06-17 16:42', 0),
  ('U-004', 'olivia@dribrahim.clinic', 'Olivia Owusu', '["pharmacist"]', '[]', false, 'Active', '2026-06-17 14:08', 0),
  ('U-005', 'noah@dribrahim.clinic', 'Noah Addo', '["manager"]', '[]', false, 'Inactive', '2026-05-12 11:30', 0);

-- Insert sample videos
insert into videos (id, title, thumbnail, duration, views, status, date)
values
  ('V-001', 'The art of a good consultation', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80', '04:32', 1284, 'Published', '2026-05-01'),
  ('V-002', 'Inside the clinic: a tour', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80', '02:18', 942, 'Published', '2026-05-08'),
  ('V-003', 'Understanding vitiligo', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=400&q=80', '06:14', 2105, 'Published', '2026-04-22'),
  ('V-004', 'Skin care for sensitive skin', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80', '05:01', 0, 'Draft', '2026-06-12');

-- Insert sample categories
insert into categories (id, name, slug, products, status)
values
  ('CAT-001', 'Skin care', 'skin-care', 4, 'Active'),
  ('CAT-002', 'Wellness', 'wellness', 1, 'Active'),
  ('CAT-003', 'Gut health', 'gut-health', 2, 'Active'),
  ('CAT-004', 'Vitamins', 'vitamins', 1, 'Active'),
  ('CAT-005', 'Sensitive skin', 'sensitive-skin', 1, 'Active');

-- Insert sample coupons
insert into coupons (id, code, type, value, min_order, uses, max_uses, expiry, status)
values
  ('CP-001', 'WELCOME10', 'Percent', 10, 50, 23, 200, '2026-12-31', 'Active'),
  ('CP-002', 'FLAT5', 'Flat', 5, 30, 88, 500, '2026-08-30', 'Active'),
  ('CP-003', 'SUMMER25', 'Percent', 25, 100, 12, 100, '2026-09-15', 'Scheduled'),
  ('CP-004', 'OLDSCHOOL', 'Flat', 10, 0, 500, 500, '2026-04-30', 'Expired');
