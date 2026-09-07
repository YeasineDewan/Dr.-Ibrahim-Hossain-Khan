# Database Schema Blueprint — Dr. Ibrahim Clinic

This document is a comprehensive, code-derived blueprint for the relational database that would back the **Dr. Ibrahim Clinic** Next.js application. It consolidates every TypeScript `type`/`interface` declared in `lib/admin-data.ts`, `lib/auth/*`, `lib/audit/*`, `lib/analytics/*`, `lib/dashboard/*`, `lib/filters/*`, `lib/seo-data.ts`, and supporting admin components.

The data layer today lives in React state with `sessionStorage` persistence (`useAdminData()` in `lib/admin-data.ts:1102`). Every entity described below corresponds to one of the arrays/records that hook returns.

---

## 1. Entity Relationship Overview

The clinic revolves around **Patients** receiving **Appointments** at a **Chamber** for a given **Service**. Each appointment can produce a **Prescription** (with embedded **Medicines**) and generate **Follow-Ups**. **Reviews** are linked to a service. **Notifications** are tied to entities (appointments, patients, orders, stock, system). A lightweight **Activity Log** records every mutation. **Users** with **Roles** and **Permissions** control access via RBAC. **Analytics Events** and **Audit Entries** capture telemetry and security events. **Dashboard Layouts** and **Saved Views** belong to users. Content (Gallery, Videos, Categories, Coupons, FAQ) is supporting CMS.

```
User ──< Role            (many-to-many via user_roles)
User ──< Permission      (many-to-many via user_permissions / role_permissions)
User ──1 DashboardLayout
User ──< SavedView
User ──< AnalyticsEvent
User ──< AuditEntry
User ──< SessionInfo
User ──< ActivityItem

Patient ──< Appointment
Patient ──< Visit / Medication / Allergy / Condition / Note / Document / Vitals
Patient ──< FollowUp / Prescription / Review
Patient ──< Order / Invoice / Payment / Message

Chamber ──< Appointment
Service  ──< Appointment / Review
Category ──< Product
Coupon   ──< Order

Prescription ──< Medicine / AuditTrail

Notification (polymorphic by `type`)
```

> **Normalization note:** Many relationships are encoded as denormalized strings (`Appointment.patient`, `Appointment.chamber`, `Prescription.patientName`). When porting to SQL, these should become foreign keys (`patient_id`, `chamber_id`, `service_id`, `doctor_id`, `assigned_to`). The `*_name` columns can be retained as denormalized display values for performance.

---

## 2. Detailed Schema Specifications

The following tables correspond 1:1 to the TypeScript entities. Field types use PostgreSQL conventions.

### 2.1 `patients` — `lib/admin-data.ts:19-35`

| Field         | Type          | Constraints |
|---------------|---------------|-------------|
| `id`          | `VARCHAR(32)` | **PK**, `NOT NULL`, `UNIQUE` (sample `DR-20481`…`DR-20492`) |
| `name`        | `VARCHAR(160)`| `NOT NULL` |
| `dob`         | `DATE`        | `NULL` |
| `gender`      | `VARCHAR(10)` | `NOT NULL`, CHECK IN `('Male','Female','Other')` |
| `phone`       | `VARCHAR(40)` | `NOT NULL` |
| `email`       | `VARCHAR(160)`| `NOT NULL`, `UNIQUE` |
| `address`     | `TEXT`        | `NULL` |
| `blood_group` | `VARCHAR(8)`  | `NULL` |
| `created_at`  | `TIMESTAMPTZ` | `NOT NULL`, default `now()` |
| `updated_at`  | `TIMESTAMPTZ` | `NOT NULL`, default `now()` |

### 2.2 `patient_allergies` — `lib/admin-data.ts:28` (`allergies: string[]`)
| Field        | Type           | Constraints |
|--------------|----------------|-------------|
| `patient_id` | `VARCHAR(32)`  | **PK**, **FK → patients.id**, `ON DELETE CASCADE` |
| `allergen`   | `VARCHAR(120)` | **PK**, `NOT NULL` |

### 2.3 `patient_conditions` — `lib/admin-data.ts:29` (`conditions: string[]`)
| Field        | Type           | Constraints |
|--------------|----------------|-------------|
| `patient_id` | `VARCHAR(32)`  | **PK**, **FK → patients.id**, `ON DELETE CASCADE` |
| `condition`  | `VARCHAR(160)` | **PK**, `NOT NULL` |

### 2.4 `patient_medications` — `lib/admin-data.ts:30`
| Field        | Type           | Constraints |
|--------------|----------------|-------------|
| `id`         | `BIGSERIAL`    | **PK** |
| `patient_id` | `VARCHAR(32)`  | **FK → patients.id**, `ON DELETE CASCADE` |
| `name`       | `VARCHAR(160)` | `NOT NULL` |
| `dose`       | `VARCHAR(120)` | `NULL` |
| `status`     | `VARCHAR(40)`  | `NULL` (e.g. `Ongoing`) |

### 2.5 `patient_visits` — `lib/admin-data.ts:31`
| Field        | Type           | Constraints |
|--------------|----------------|-------------|
| `id`         | `BIGSERIAL`    | **PK** |
| `patient_id` | `VARCHAR(32)`  | **FK → patients.id**, `ON DELETE CASCADE` |
| `visit_date` | `DATE`         | `NOT NULL` |
| `reason`     | `VARCHAR(200)` | `NULL` |
| `doctor`     | `VARCHAR(160)` | `NULL` |
| `notes`      | `TEXT`         | `NULL` |

Index: `(patient_id, visit_date DESC)`.

### 2.6 `patient_notes` — `lib/admin-data.ts:32`
| Field        | Type           | Constraints |
|--------------|----------------|-------------|
| `id`         | `BIGSERIAL`    | **PK** |
| `patient_id` | `VARCHAR(32)`  | **FK → patients.id**, `ON DELETE CASCADE` |
| `note_date`  | `DATE`         | `NOT NULL` |
| `text`       | `TEXT`         | `NOT NULL` |
| `author`     | `VARCHAR(160)` | `NULL` |

### 2.7 `patient_documents` — `lib/admin-data.ts:33`
| Field         | Type           | Constraints |
|---------------|----------------|-------------|
| `id`          | `BIGSERIAL`    | **PK** |
| `patient_id`  | `VARCHAR(32)`  | **FK → patients.id**, `ON DELETE CASCADE` |
| `name`        | `VARCHAR(200)` | `NOT NULL` |
| `doc_type`    | `VARCHAR(40)`  | `NULL` (e.g. `PDF`, `JPG`) |
| `size`        | `VARCHAR(20)`  | `NULL` |
| `uploaded_at` | `DATE`         | `NOT NULL` |
| `storage_url` | `TEXT`         | `NULL` (for actual binary storage) |

### 2.8 `patient_vitals` — `lib/admin-data.ts:34`
| Field         | Type           | Constraints |
|---------------|----------------|-------------|
| `id`          | `BIGSERIAL`    | **PK** |
| `patient_id`  | `VARCHAR(32)`  | **FK → patients.id**, `ON DELETE CASCADE` |
| `recorded_at` | `DATE`         | `NOT NULL` |
| `bp`          | `VARCHAR(20)`  | `NULL` |
| `heart_rate`  | `VARCHAR(10)`  | `NULL` |
| `temperature` | `VARCHAR(10)`  | `NULL` |
| `weight`      | `VARCHAR(20)`  | `NULL` |

### 2.9 `chambers` — `lib/admin-data.ts:58-67`
| Field      | Type           | Constraints |
|------------|----------------|-------------|
| `id`       | `VARCHAR(16)`  | **PK** (sample `CH-1`) |
| `name`     | `VARCHAR(120)` | `NOT NULL`, `UNIQUE` (e.g. `Dhanmondi`) |
| `place`    | `VARCHAR(160)` | `NULL` |
| `address`  | `TEXT`         | `NULL` |
| `hours`    | `VARCHAR(80)`  | `NULL` |
| `phone`    | `VARCHAR(40)`  | `NULL` |
| `status`   | `VARCHAR(16)`  | `NOT NULL`, CHECK IN `('Active','Closed')` |
| `capacity` | `INT`          | `NOT NULL`, default `0` |

### 2.10 `services` — implicit from `Appointment.service` + `lib/seo-data.ts:269`
| Field          | Type            | Constraints |
|----------------|-----------------|-------------|
| `id`           | `VARCHAR(16)`   | **PK** |
| `slug`         | `VARCHAR(80)`   | `NOT NULL`, `UNIQUE` |
| `name`         | `VARCHAR(160)`  | `NOT NULL` |
| `name_bn`      | `VARCHAR(160)`  | `NULL` |
| `description`  | `TEXT`          | `NULL` |
| `duration_min` | `INT`           | `NULL` |
| `default_fee`  | `NUMERIC(10,2)` | `NULL` |
| `status`       | `VARCHAR(16)`   | `NOT NULL`, default `'Active'` |

### 2.11 `doctors` — derived from `Appointment.doctor`, `Prescription.doctor`, `FollowUp.assignedTo`
| Field    | Type           | Constraints |
|----------|----------------|-------------|
| `id`     | `VARCHAR(16)`  | **PK** |
| `name`   | `VARCHAR(160)` | `NOT NULL` |
| `email`  | `VARCHAR(160)` | `NULL`, `UNIQUE` |
| `phone`  | `VARCHAR(40)`  | `NULL` |
| `title`  | `VARCHAR(120)` | `NULL` |
| `status` | `VARCHAR(16)`  | `NOT NULL`, default `'Active'` |

### 2.12 `appointments` — `lib/admin-data.ts:4-17`
| Field           | Type            | Constraints |
|-----------------|-----------------|-------------|
| `id`            | `VARCHAR(32)`   | **PK** (sample `APT-001`) |
| `patient_id`    | `VARCHAR(32)`   | **FK → patients.id**, `NULL` |
| `patient_name`  | `VARCHAR(160)`  | `NOT NULL` (denormalized) |
| `doctor_id`     | `VARCHAR(16)`   | **FK → doctors.id**, `NULL` |
| `doctor_name`   | `VARCHAR(160)`  | `NOT NULL` (denormalized) |
| `service_id`    | `VARCHAR(16)`   | **FK → services.id**, `NULL` |
| `service_name`  | `VARCHAR(160)`  | `NOT NULL` |
| `chamber_id`    | `VARCHAR(16)`   | **FK → chambers.id**, `NULL` |
| `chamber_name`  | `VARCHAR(120)`  | `NOT NULL` (denormalized) |
| `appt_date`     | `DATE`          | `NOT NULL` |
| `appt_time`     | `TIME`          | `NOT NULL` |
| `duration_min`  | `INT`           | `NULL` |
| `appt_type`     | `VARCHAR(16)`   | `NOT NULL`, CHECK IN `('In-person','Video','Phone')` |
| `status`        | `VARCHAR(16)`   | `NOT NULL`, CHECK IN `('Confirmed','Pending','Completed','Cancelled','Waitlist')` |
| `fee`           | `NUMERIC(10,2)` | `NOT NULL` (BDT ৳) |
| `notes`         | `TEXT`          | `NULL` |
| `created_at`    | `TIMESTAMPTZ`   | `NOT NULL`, default `now()` |
| `updated_at`    | `TIMESTAMPTZ`   | `NOT NULL`, default `now()` |

Indexes: `(appt_date)`, `(chamber_id, appt_date)`, `(patient_id, appt_date DESC)`, `(status)`.

### 2.13 `prescriptions` — `lib/admin-data.ts:128-152`
ID generator: `RX-{YYYY}-{NNNN}` per `components/admin/prescriptions.tsx:49`.

| Field                | Type            | Constraints |
|----------------------|-----------------|-------------|
| `id`                 | `VARCHAR(32)`   | **PK** |
| `patient_id`         | `VARCHAR(32)`   | **FK → patients.id**, `NOT NULL` |
| `patient_name`       | `VARCHAR(160)`  | `NOT NULL` (denormalized) |
| `doctor_id`          | `VARCHAR(16)`   | **FK → doctors.id**, `NULL` |
| `doctor_name`        | `VARCHAR(160)`  | `NOT NULL` |
| `visit_id`           | `BIGINT`        | **FK → patient_visits.id**, `NULL` |
| `rx_date`            | `DATE`          | `NOT NULL` |
| `diagnosis`          | `TEXT`          | `NULL` |
| `notes`              | `TEXT`          | `NULL` |
| `status`             | `VARCHAR(16)`   | `NOT NULL`, CHECK IN `('Draft','Signed','Sent','Viewed')` |
| `created_at`         | `TIMESTAMPTZ`   | `NOT NULL` |
| `signed_at`          | `TIMESTAMPTZ`   | `NULL` |
| `sent_at`            | `TIMESTAMPTZ`   | `NULL` |
| `signature_data_url` | `TEXT`          | `NULL` (base64 PNG) |
| `refill_count`       | `INT`           | `NOT NULL`, default `0` |
| `refills_allowed`    | `INT`           | `NOT NULL`, default `0` |

### 2.14 `prescription_medicines` — `lib/admin-data.ts:135-141`, `components/admin/prescriptions.tsx:22-28`
| Field             | Type           | Constraints |
|-------------------|----------------|-------------|
| `id`              | `BIGSERIAL`    | **PK** |
| `prescription_id` | `VARCHAR(32)`  | **FK → prescriptions.id**, `ON DELETE CASCADE` |
| `line_no`         | `INT`          | `NOT NULL` |
| `name`            | `VARCHAR(160)` | `NOT NULL` |
| `dose`            | `VARCHAR(120)` | `NULL` |
| `frequency`       | `VARCHAR(80)`  | `NULL` |
| `duration`        | `VARCHAR(80)`  | `NULL` |
| `instructions`    | `TEXT`         | `NULL` |

### 2.15 `prescription_audit_trail` — `lib/admin-data.ts:149`
| Field             | Type           | Constraints |
|-------------------|----------------|-------------|
| `id`              | `BIGSERIAL`    | **PK** |
| `prescription_id` | `VARCHAR(32)`  | **FK → prescriptions.id**, `ON DELETE CASCADE` |
| `at`              | `TIMESTAMPTZ`  | `NOT NULL` |
| `actor`           | `VARCHAR(160)` | `NOT NULL` |
| `action`          | `VARCHAR(80)`  | `NOT NULL` |
| `changes`         | `TEXT`         | `NULL` |

### 2.16 `follow_ups` — `lib/admin-data.ts:48-56`
| Field         | Type           | Constraints |
|---------------|----------------|-------------|
| `id`          | `VARCHAR(16)`  | **PK** (sample `FU-001`) |
| `patient_id`  | `VARCHAR(32)`  | **FK → patients.id**, `NULL` |
| `patient_name`| `VARCHAR(160)` | `NOT NULL` (denormalized) |
| `reason`      | `VARCHAR(200)` | `NULL` |
| `due_date`    | `DATE`         | `NOT NULL` |
| `status`      | `VARCHAR(16)`  | `NOT NULL`, CHECK IN `('Upcoming','Overdue','Completed')` |
| `priority`    | `VARCHAR(16)`  | `NOT NULL`, CHECK IN `('Low','Medium','High')` |
| `assigned_to` | `VARCHAR(160)` | `NULL` |

### 2.17 `reviews` — `lib/admin-data.ts:37-46`
| Field         | Type           | Constraints |
|---------------|----------------|-------------|
| `id`          | `VARCHAR(16)`  | **PK** (sample `REV-001`) |
| `patient_id`  | `VARCHAR(32)`  | **FK → patients.id**, `NULL` |
| `author`      | `VARCHAR(160)` | `NOT NULL` |
| `service_id`  | `VARCHAR(16)`  | **FK → services.id**, `NULL` |
| `service_name`| `VARCHAR(160)` | `NOT NULL` (denormalized) |
| `rating`      | `SMALLINT`     | `NOT NULL`, CHECK BETWEEN `1` AND `5` |
| `body`        | `TEXT`         | `NOT NULL` (source key `text`) |
| `review_date` | `DATE`         | `NOT NULL` |
| `status`      | `VARCHAR(16)`  | `NOT NULL`, CHECK IN `('Pending','Approved','Rejected')` |
| `reply`       | `TEXT`         | `NULL` |

### 2.18 `coupons` — `lib/admin-data.ts:69-79`
| Field          | Type            | Constraints |
|----------------|-----------------|-------------|
| `id`           | `VARCHAR(16)`   | **PK** (sample `CP-001`) |
| `code`         | `VARCHAR(40)`   | `NOT NULL`, `UNIQUE` |
| `discount_type`| `VARCHAR(16)`   | `NOT NULL`, CHECK IN `('Percent','Flat')` |
| `value`        | `NUMERIC(10,2)` | `NOT NULL` |
| `min_order`    | `NUMERIC(10,2)` | `NOT NULL`, default `0` |
| `uses`         | `INT`           | `NOT NULL`, default `0` |
| `max_uses`     | `INT`           | `NOT NULL` |
| `expiry`       | `DATE`          | `NOT NULL` |
| `status`       | `VARCHAR(16)`   | `NOT NULL`, CHECK IN `('Active','Scheduled','Expired')` |

### 2.19 `notifications` — `lib/admin-data.ts:81-88`
| Field        | Type           | Constraints |
|--------------|----------------|-------------|
| `id`         | `VARCHAR(16)`  | **PK** |
| `user_id`    | `VARCHAR(32)`  | **FK → users.id**, `NULL` |
| `type`       | `VARCHAR(20)`  | `NOT NULL`, CHECK IN `('appointment','patient','system','order','stock')` |
| `title`      | `VARCHAR(200)` | `NOT NULL` |
| `body`       | `TEXT`         | `NOT NULL` |
| `time_label` | `VARCHAR(40)`  | `NULL` (relative display) |
| `created_at` | `TIMESTAMPTZ`  | `NOT NULL`, default `now()` |
| `read`       | `BOOLEAN`      | `NOT NULL`, default `false` |
| `target_type`| `VARCHAR(40)`  | `NULL` (polymorphic discriminator) |
| `target_id`  | `VARCHAR(64)`  | `NULL` (polymorphic value) |

### 2.20 `activity_log` — `lib/admin-data.ts:90-97`; written via `data.logActivity()` (`lib/admin-data.ts:1197`)
| Field        | Type            | Constraints |
|--------------|-----------------|-------------|
| `id`         | `VARCHAR(16)`   | **PK** |
| `user_id`    | `VARCHAR(32)`   | **FK → users.id**, `NULL` |
| `user_name`  | `VARCHAR(160)`  | `NOT NULL` (denormalized) |
| `action`     | `VARCHAR(40)`   | `NOT NULL` |
| `target`     | `VARCHAR(255)`  | `NOT NULL` |
| `time_label` | `VARCHAR(40)`   | `NULL` |
| `created_at` | `TIMESTAMPTZ`   | `NOT NULL`, default `now()` |
| `ip`         | `INET`          | `NULL` |

### 2.21 `users` — `lib/admin-data.ts:118-126` + `lib/auth/types.ts:8-20` (`UserProfile`)
| Field             | Type           | Constraints |
|-------------------|----------------|-------------|
| `id`              | `VARCHAR(32)`  | **PK** (sample `U-001`) |
| `name`            | `VARCHAR(160)` | `NOT NULL` |
| `email`           | `VARCHAR(160)` | `NOT NULL`, `UNIQUE` |
| `password_hash`   | `VARCHAR(255)` | `NULL` |
| `avatar`          | `VARCHAR(8)`   | `NULL` (initials) |
| `status`          | `VARCHAR(16)`  | `NOT NULL`, CHECK IN `('Active','Inactive','Locked','Pending')` |
| `role_id`         | `VARCHAR(32)`  | **FK → roles.id**, `NULL` |
| `mfa_enabled`     | `BOOLEAN`      | `NOT NULL`, default `false` |
| `failed_attempts` | `INT`          | `NOT NULL`, default `0` |
| `locked_until`    | `TIMESTAMPTZ`  | `NULL` |
| `last_login`      | `TIMESTAMPTZ`  | `NULL` |
| `created_at`      | `TIMESTAMPTZ`  | `NOT NULL`, default `now()` |

### 2.22 `roles` — `lib/auth/rbac.ts:7-14`, `16-113`
Seeded roles: `super-admin`, `admin`, `physician`, `front-desk`, `nurse`, `pharmacist`, `manager`, `viewer`.
| Field             | Type           | Constraints |
|-------------------|----------------|-------------|
| `id`              | `VARCHAR(32)`  | **PK** |
| `name`            | `VARCHAR(80)`  | `NOT NULL`, `UNIQUE` |
| `name_bn`         | `VARCHAR(80)`  | `NULL` |
| `description`     | `TEXT`         | `NULL` |
| `inherits_role_id`| `VARCHAR(32)`  | **FK → roles.id**, `NULL` |

### 2.23 `permissions` — `lib/auth/types.ts:1-6`
| Field     | Type           | Constraints |
|-----------|----------------|-------------|
| `id`      | `BIGSERIAL`    | **PK** |
| `resource`| `VARCHAR(80)`  | `NOT NULL` (e.g. `dashboard`, `appointments`, `*`) |
| `action`  | `VARCHAR(16)`  | `NOT NULL`, CHECK IN `('read','write','admin','delete')` |
| UNIQUE    | (`resource`, `action`) | |

### 2.24 `role_permissions`
| Field          | Type           | Constraints |
|----------------|----------------|-------------|
| `role_id`      | `VARCHAR(32)`  | **PK**, **FK → roles.id**, `ON DELETE CASCADE` |
| `permission_id`| `BIGINT`       | **PK**, **FK → permissions.id**, `ON DELETE CASCADE` |

### 2.25 `user_roles`
| Field     | Type           | Constraints |
|-----------|----------------|-------------|
| `user_id` | `VARCHAR(32)`  | **PK**, **FK → users.id**, `ON DELETE CASCADE` |
| `role_id` | `VARCHAR(32)`  | **PK**, **FK → roles.id**, `ON DELETE CASCADE` |

### 2.26 `user_permissions` — optional direct grant
| Field          | Type           | Constraints |
|----------------|----------------|-------------|
| `user_id`      | `VARCHAR(32)`  | **PK**, **FK → users.id**, `ON DELETE CASCADE` |
| `permission_id`| `BIGINT`       | **PK**, **FK → permissions.id**, `ON DELETE CASCADE` |

### 2.27 `sessions` — `lib/auth/types.ts:43-51` (`SessionInfo`)
| Field         | Type           | Constraints |
|---------------|----------------|-------------|
| `id`          | `VARCHAR(64)`  | **PK** |
| `user_id`     | `VARCHAR(32)`  | **FK → users.id**, `NOT NULL` |
| `device`      | `VARCHAR(160)` | `NULL` |
| `ip`          | `INET`         | `NULL` |
| `user_agent`  | `TEXT`         | `NULL` |
| `created_at`  | `TIMESTAMPTZ`  | `NOT NULL`, default `now()` |
| `last_active` | `TIMESTAMPTZ`  | `NOT NULL`, default `now()` |
| `expires_at`  | `TIMESTAMPTZ`  | `NOT NULL` |

### 2.28 `auth_tokens` — `lib/auth/types.ts:22-27`
| Field          | Type           | Constraints |
|----------------|----------------|-------------|
| `id`           | `BIGSERIAL`    | **PK** |
| `user_id`      | `VARCHAR(32)`  | **FK → users.id**, `ON DELETE CASCADE` |
| `access_token` | `TEXT`         | `NOT NULL`, `UNIQUE` |
| `refresh_token`| `TEXT`         | `NOT NULL`, `UNIQUE` |
| `token_type`   | `VARCHAR(16)`  | `NOT NULL`, default `'Bearer'` |
| `expires_in`   | `INT`          | `NOT NULL` |
| `created_at`   | `TIMESTAMPTZ`  | `NOT NULL`, default `now()` |

### 2.29 `audit_entries` — `lib/audit/logger.ts:1-11`
| Field        | Type            | Constraints |
|--------------|-----------------|-------------|
| `id`         | `UUID`          | **PK**, default `gen_random_uuid()` |
| `timestamp`  | `TIMESTAMPTZ`   | `NOT NULL`, default `now()` |
| `user_id`    | `VARCHAR(32)`   | **FK → users.id**, `NULL` |
| `action`     | `VARCHAR(80)`   | `NOT NULL` |
| `resource`   | `VARCHAR(80)`   | `NOT NULL` |
| `outcome`    | `VARCHAR(16)`   | `NOT NULL`, CHECK IN `('success','failure','denied')` |
| `ip`         | `INET`          | `NULL` |
| `user_agent` | `TEXT`          | `NULL` |
| `details`    | `JSONB`         | `NULL` |

### 2.30 `analytics_events` — `lib/analytics/event-tracker.ts:1-10`
| Field        | Type            | Constraints |
|--------------|-----------------|-------------|
| `id`         | `BIGSERIAL`     | **PK** |
| `event`      | `VARCHAR(80)`   | `NOT NULL` |
| `category`   | `VARCHAR(80)`   | `NOT NULL`, default `'general'` |
| `label`      | `VARCHAR(200)`  | `NULL` |
| `value`      | `NUMERIC`       | `NULL` |
| `user_id`    | `VARCHAR(32)`   | **FK → users.id**, `NULL` |
| `session_id` | `VARCHAR(64)`   | `NOT NULL` |
| `timestamp`  | `TIMESTAMPTZ`   | `NOT NULL`, default `now()` |
| `properties` | `JSONB`         | `NULL` |

### 2.31 `dashboard_layouts` — `lib/dashboard/types.ts:40-51`
| Field        | Type          | Constraints |
|--------------|---------------|-------------|
| `user_id`    | `VARCHAR(32)` | **PK**, **FK → users.id**, `ON DELETE CASCADE` |
| `layout`     | `JSONB`       | `NOT NULL` |
| `updated_at` | `TIMESTAMPTZ`| `NOT NULL`, default `now()` |

### 2.32 `saved_views` — `lib/dashboard/types.ts:84-90`
| Field        | Type          | Constraints |
|--------------|---------------|-------------|
| `id`         | `VARCHAR(32)` | **PK** |
| `user_id`    | `VARCHAR(32)` | **FK → users.id**, `ON DELETE CASCADE` |
| `name`       | `VARCHAR(120)`| `NOT NULL` |
| `filters`    | `JSONB`       | `NULL` |
| `sorts`      | `JSONB`       | `NULL` |
| `created_at` | `TIMESTAMPTZ`| `NOT NULL`, default `now()` |

### 2.33 `videos` — `lib/admin-data.ts:99-108`
| Field         | Type           | Constraints |
|---------------|----------------|-------------|
| `id`          | `VARCHAR(16)`  | **PK** (sample `V-001`) |
| `title`       | `VARCHAR(200)` | `NOT NULL` |
| `title_bn`    | `VARCHAR(200)` | `NULL` |
| `thumbnail`   | `TEXT`         | `NULL` (URL) |
| `duration`    | `VARCHAR(16)`  | `NULL` |
| `views`       | `INT`          | `NOT NULL`, default `0` |
| `status`      | `VARCHAR(16)`  | `NOT NULL`, CHECK IN `('Published','Draft','Archived')` |
| `published_at`| `DATE`         | `NULL` |
| `storage_url` | `TEXT`         | `NULL` |

### 2.34 `gallery_items` — `lib/admin-data.ts:944-1001` (sampleGallery)
| Field        | Type           | Constraints |
|--------------|----------------|-------------|
| `id`         | `VARCHAR(16)`  | **PK** (sample `G-001`) |
| `url`        | `TEXT`         | `NOT NULL` |
| `title`      | `VARCHAR(200)` | `NULL` |
| `album`      | `VARCHAR(80)`  | `NULL` |
| `captured_at`| `DATE`         | `NULL` |

### 2.35 `categories` — `lib/admin-data.ts:110-116`
| Field           | Type           | Constraints |
|-----------------|----------------|-------------|
| `id`            | `VARCHAR(16)`  | **PK** (sample `CAT-001`) |
| `name`          | `VARCHAR(120)` | `NOT NULL` |
| `slug`          | `VARCHAR(120)` | `NOT NULL`, `UNIQUE` |
| `product_count` | `INT`          | `NOT NULL`, default `0` |
| `status`        | `VARCHAR(16)`  | `NOT NULL`, default `'Active'` |

### 2.36 `products` — logical (referenced by `categories.products`, Checkout flow)
| Field         | Type            | Constraints |
|---------------|-----------------|-------------|
| `id`          | `VARCHAR(16)`   | **PK** |
| `name`        | `VARCHAR(200)`  | `NOT NULL` |
| `slug`        | `VARCHAR(200)`  | `NOT NULL`, `UNIQUE` |
| `category_id` | `VARCHAR(16)`   | **FK → categories.id** |
| `price`       | `NUMERIC(10,2)` | `NOT NULL` |
| `currency`    | `VARCHAR(8)`    | `NOT NULL`, default `'BDT'` |
| `stock`       | `INT`           | `NOT NULL`, default `0` |
| `status`      | `VARCHAR(16)`   | `NOT NULL`, default `'Active'` |

### 2.37 `orders` — implied by `Notification.type='order'`, Checkout
| Field        | Type            | Constraints |
|--------------|-----------------|-------------|
| `id`         | `VARCHAR(32)`   | **PK** |
| `patient_id` | `VARCHAR(32)`   | **FK → patients.id** |
| `coupon_id`  | `VARCHAR(16)`   | **FK → coupons.id**, `NULL` |
| `subtotal`   | `NUMERIC(10,2)` | `NOT NULL` |
| `discount`   | `NUMERIC(10,2)` | `NOT NULL`, default `0` |
| `total`      | `NUMERIC(10,2)` | `NOT NULL` |
| `status`     | `VARCHAR(16)`   | `NOT NULL` |
| `created_at` | `TIMESTAMPTZ`   | `NOT NULL`, default `now()` |

Child: `order_items` (`order_id`, `product_id`, `qty`, `unit_price`).

### 2.38 `invoices` — referenced by `components/patient-portal.tsx:1006`
| Field            | Type            | Constraints |
|------------------|-----------------|-------------|
| `id`             | `VARCHAR(32)`   | **PK** |
| `patient_id`     | `VARCHAR(32)`   | **FK → patients.id**, `NOT NULL` |
| `order_id`       | `VARCHAR(32)`   | **FK → orders.id**, `NULL` |
| `appointment_id` | `VARCHAR(32)`   | **FK → appointments.id**, `NULL` |
| `amount`         | `NUMERIC(10,2)` | `NOT NULL` |
| `issued_at`      | `DATE`          | `NOT NULL` |
| `status`         | `VARCHAR(16)`   | `NOT NULL`, CHECK IN `('Draft','Paid','Void')` |

### 2.39 `payments` — referenced by patient billing view
| Field        | Type            | Constraints |
|--------------|-----------------|-------------|
| `id`         | `VARCHAR(32)`   | **PK** |
| `invoice_id` | `VARCHAR(32)`   | **FK → invoices.id**, `NOT NULL` |
| `method`     | `VARCHAR(40)`   | `NOT NULL` (e.g. `bKash`, `Card`, `Cash`) |
| `last4`      | `CHAR(4)`       | `NULL` |
| `amount`     | `NUMERIC(10,2)` | `NOT NULL` |
| `paid_at`    | `TIMESTAMPTZ`   | `NOT NULL`, default `now()` |

### 2.40 `messages` — patient Messaging feature
| Field         | Type          | Constraints |
|---------------|---------------|-------------|
| `id`          | `VARCHAR(32)` | **PK** |
| `patient_id`  | `VARCHAR(32)` | **FK → patients.id**, `NOT NULL` |
| `sender_role` | `VARCHAR(40)` | `NOT NULL` |
| `body`        | `TEXT`        | `NOT NULL` |
| `created_at`  | `TIMESTAMPTZ`| `NOT NULL`, default `now()` |
| `read`        | `BOOLEAN`    | `NOT NULL`, default `false` |

### 2.41 `seo_pages` — `lib/seo-data.ts`
| Field             | Type           | Constraints |
|-------------------|----------------|-------------|
| `page_key`        | `VARCHAR(40)`  | **PK** |
| `title`           | `VARCHAR(200)` | `NOT NULL` |
| `description`     | `TEXT`         | `NOT NULL` |
| `keywords`        | `JSONB`        | `NOT NULL` |
| `canonical`       | `TEXT`         | `NOT NULL` |
| `og_image`        | `TEXT`         | `NULL` |
| `structured_data` | `JSONB`        | `NULL` |

### 2.42 `faqs` — `components/faq-section.tsx:7`
| Field     | Type           | Constraints |
|-----------|----------------|-------------|
| `id`      | `VARCHAR(16)`  | **PK** |
| `question`| `TEXT`         | `NOT NULL` |
| `answer`  | `TEXT`         | `NOT NULL` |
| `order`   | `INT`          | `NOT NULL`, default `0` |

### 2.43 `media_uploads` — `components/admin/media-upload-form.tsx:22`
| Field         | Type           | Constraints |
|---------------|----------------|-------------|
| `id`          | `UUID`         | **PK** |
| `kind`        | `VARCHAR(20)`  | `NOT NULL`, CHECK IN `('image','video','document')` |
| `title`       | `VARCHAR(200)` | `NOT NULL` |
| `description` | `TEXT`         | `NULL` |
| `tags`        | `JSONB`        | `NULL` |
| `storage_url` | `TEXT`         | `NOT NULL` |
| `mime_type`   | `VARCHAR(80)`  | `NULL` |
| `size_bytes`  | `BIGINT`       | `NULL` |
| `uploaded_by` | `VARCHAR(32)`  | **FK → users.id**, `NULL` |
| `uploaded_at` | `TIMESTAMPTZ` | `NOT NULL`, default `now()` |
---

## 3. Data Dictionary

### `patients`
- `id` — Custom clinic identifier (`DR-20481`). Generated client-side; recommended generator: `DR-{sequence}`.
- `blood_group` — Free-text to accommodate rare types without forcing a strict enum.
- `dob` — Stored as `DATE`; the front end renders ages derived from this.

### `appointments`
- `appt_time` — Stored as `TIME`; UI labels like `09:00` (24h) and Bengali digits via `toBnTime()` in `components/patient-portal.tsx:66`.
- `duration_min` — Derived from the original `duration` string (e.g. `30 min`). Denormalize for query speed.
- `appt_type` — Drives UI badges (`In-person`, `Video`, `Phone`).
- `status` — `Waitlist` and `Pending` are distinct states that the appointment kanban treats differently.
- `fee` — Always BDT (৳). Display helper: `formatBn()` in `components/admin/care.tsx:42`.

### `prescriptions`
- `signature_data_url` — Stores the doctor's captured signature (PNG base64) when transitioning `Draft → Signed`.
- `refill_count` / `refills_allowed` — Drives refill workflow and patient portal badge.
- `audit_trail` — Embedded in source; modeled as child table for relational integrity.

### `reviews`
- `body` — Source key is `text` (mapped to `body` to avoid SQL reserved words).
- `status` — `Pending → Approved | Rejected` workflow.

### `notifications`
- `type` — Polymorphic discriminator. Common values mapped from `lib/admin-data.ts:802-859`.
- `target_type` / `target_id` — Optional FK pairs for deep-linking (e.g. `appointment`, `APT-007`).

### `activity_log`
- `action` — Verb taxonomy: `created`, `updated`, `deleted`, `approved`, `flagged`, `published`, `sent`. See `lib/admin-data.ts:861-942`.
- `ip` — Captured for admin mutations; placeholder IP `102.176.55.21` in seed data.

### `users` / `roles` / `permissions`
- `users.role_id` is a convenience FK to the **primary** role. Full mapping lives in `user_roles`. Inheritance is modeled via `roles.inherits_role_id` and resolved in code by `getUserPermissions()` in `lib/auth/rbac.ts:137`.
- `permissions.resource = '*'` grants wildcard (super-admin) per `lib/auth/rbac.ts:18`.
- `failed_attempts` / `locked_until` — Used by the auth flow to implement account lockout (see `UserProfile.failedAttempts`).

### `auth_tokens`
- Stores short-lived access tokens plus refresh tokens. Use `expires_in` with `created_at` to compute expiry on read.

### `audit_entries`
- `outcome` — `success | failure | denied` (see `lib/audit/logger.ts:7`).
- `details` — `JSONB` for structured per-action metadata.

### `analytics_events`
- `properties` — `JSONB` for arbitrary event payload.
- `session_id` — Generated by `crypto.randomUUID()` in `lib/analytics/event-tracker.ts:23`.

### `dashboard_layouts` / `saved_views`
- Storing JSONB in `dashboard_layouts.layout` and `saved_views.filters`/`sorts` keeps the schema flexible as the widget system evolves (`lib/dashboard/types.ts`).

### `seo_pages`
- `page_key` covers global pages (`Home`, `Services`, …), service slugs (`prp-therapy`, …), and chamber slugs (`dhanmondi`, …). Use the same `page_key` namespace.

---

## 4. Business Logic Mapping

### 4.1 Unique ID generation patterns
- **Patient IDs** (`DR-20481`) — `lib/admin-data.ts:160`.
- **Appointment IDs** (`APT-001` … `APT-010`) — manual.
- **Prescription IDs** (`RX-YYYY-NNNN`) — generated by `nextRxId()` in `components/admin/prescriptions.tsx:49`.
- **Other entity IDs** use a leading letter prefix (`U-`, `CH-`, `REV-`, `FU-`, `CP-`, `V-`, `G-`, `CAT-`).

Recommendation: implement SQL sequences or `uuid_generate_v5` per entity.

### 4.2 Upsert pattern
`useAdminData()` exposes `addX` / `removeX` for every array (`lib/admin-data.ts:1175-1195`). It uses an **upsert by `id`** strategy — a single SQL `INSERT ... ON CONFLICT (id) DO UPDATE` covers this.

### 4.3 Activity logging
Every admin view calls `data.logActivity(user, action, target)` (`lib/admin-data.ts:1197`). Persisted into `activity_log`. Map UI verbs to the canonical set: `created | updated | deleted | approved | flagged | published | sent`.

### 4.4 Permission gating
- Resource/action pairs (`dashboard:read`, `users:admin`, …) seeded from `lib/auth/rbac.ts:16-113`.
- `NAV_RESOURCE_MAP` (`lib/auth/rbac.ts:216`) maps sidebar items to permission checks; replicate this mapping in any backend gate.
- `super-admin` and `admin` roles are considered super users (line 129) and bypass specific checks.

### 4.5 Audit + analytics routing
- Audit events: auth, permission, data-change — see `logAuth`, `logPermission`, `logDataChange` in `lib/audit/logger.ts:48-76`.
- Analytics categories seen in the tracker: `navigation`, `feature`, `data`, `search`, `general` (`lib/analytics/event-tracker.ts:38-78`).

### 4.6 Patient-portal filtering logic
The patient dashboard (`components/patient-portal.tsx`) derives views from `useAdminData()` using **name-based** matching:
- `me = data.patients[0]` (first patient is treated as logged-in user — line 121).
- `myAppts = data.appointments.filter(a => a.patient === me.name)` (line 669).
- `myPrescriptions = data.prescriptions.filter(rx => rx.patientId === me.id)` (line 838).

Recommendation: in SQL, replace string matching with proper FK lookups; this also matches the prescription table (which already uses `patient_id`).

### 4.7 Notification target linking
`Notification.type` is a polymorphic discriminator (`appointment | patient | system | order | stock`). When persisting, populate `target_type` + `target_id` so the UI can deep-link (e.g. `appointment` → `appointments.id = 'APT-007'`).

### 4.8 Follow-up status transitions
`FollowUp.status` is computed against `due_date` (`Upcoming` if `due_date >= today`, `Overdue` if past, `Completed` manually). See `components/admin/care.tsx`. A nightly job should flip rows from `Upcoming` to `Overdue`.

### 4.9 Appointment status transitions
The admin kanban allows any transition but typical flow is:
`Waitlist → Pending → Confirmed → Completed`, with `Cancelled` as terminal. Encode this as a state machine on the application side; the schema only enforces the allowed values via the `CHECK` constraint.

### 4.10 Prescription lifecycle
`Draft → Signed → Sent → Viewed`. `Signed` triggers `signature_data_url` capture; `Sent` triggers `sent_at`; `Viewed` is set by patient portal open events. Refill counts (`refill_count`) cannot exceed `refills_allowed`.

### 4.11 SEO multilingual keys
`seo_pages` rows use a single `page_key` namespace covering global pages, service-detail slugs, and chamber-detail slugs. Backend lookups by canonical URL (`/services/prp-therapy`) should join `seo_pages` on `page_key = slug` for `services` or `chambers`.

### 4.12 Dashboard widgets, filters and saved views
- `FilterOperator` enum (`lib/filters/advanced-filter.ts:3`) maps to backend query operators: `eq | neq | gt | gte | lt | lte | contains | startsWith | endsWith | in | between | isNull | isNotNull`.
- `WidgetConfig` (`lib/dashboard/types.ts:32`) and `SavedView.filters` (`lib/dashboard/types.ts:84`) both store filters as `JSONB`. Backend must support these operators when materializing widget data.

### 4.13 i18n
The app is bilingual (English/Bengali). Several tables carry `_bn` mirror columns (`services.name_bn`, `roles.name_bn`, `videos.title_bn`). Other strings fall back to a translation table (`lib/translations/*`). For DB-backed translations, model `_bn` columns for short strings and a `translations(key, lang, value)` table for everything else.

### 4.14 Money + locale
All monetary values are stored as `NUMERIC(10,2)` BDT. Display helpers:
- `formatBn()` in `components/admin/care.tsx:42` → `৳4,500`.
- `toBn()` / `toBnTime()` in `components/patient-portal.tsx:65-66` → Bengali digits.
Always store currency separately if multi-currency is ever needed (see `products.currency`).

### 4.15 Pagination and offline persistence
The current implementation persists all entities to `sessionStorage` under key `dribrahim.admin.content` (`lib/admin-data.ts:1140`). For a real backend, replace this with paginated fetches and replace the `addX` upsert helper with an HTTP `PUT` / `POST` per resource.

---

## 5. Critical: Missing Constraints & Data Integrity

### 5.1 Non-null critical lookup columns
Several foreign keys are `NULL`-able when they should not be (clinics can't operate without these):

- **`appointments.patient_id`** is `NULL`-able (`db_cat.md:163`). An appointment without a patient is meaningless. Make it `NOT NULL`.
- **`appointments.chamber_id`** is `NULL`-able. An appointment must have a location — enforce `NOT NULL`.
- **`appointments.doctor_id`** and **`appointments.service_id`** should also be `NOT NULL` (every appointment needs a doctor and a service reason).
- **`invoices.appointment_id`** is `NULL`-able — fine if you support product-only invoices, but consider a `CHECK (appointment_id IS NOT NULL OR order_id IS NOT NULL)` so an invoice always has a parent.
- **`follow_ups.patient_id`** should be `NOT NULL`.

### 5.2 Missing unique constraints
- **`users.email`** is unique ✓, but **`patients.email`** is also unique (`db_cat.md:55`) — good.
- **`patients.phone`** has no index. Add `INDEX (phone)` — phone search is a daily clinic operation.
- **`coupons.code`** is unique ✓, but no index on **`appointments.appt_date + appt_time`** as a composite for slot-booking conflicts. Add `UNIQUE (chamber_id, appt_date, appt_time)` to prevent double-booking.
- **`reviews`** has no constraint preventing duplicate reviews per `(patient_id, service_id)` — add `UNIQUE (patient_id, service_id)` (or per-visit).

### 5.3 Polymorphic FKs are not enforceable
`notifications.target_type / target_id` (`db_cat.md:277-278`) and `activity_log.target` (`db_cat.md:287`) cannot have FK constraints. Mitigate by:
- Replacing with explicit nullable FKs (`appointment_id`, `patient_id`, `order_id`) + a discriminator `target_type`.
- Or, if polymorphism must stay, add a `CHECK (target_type IN (...))` and consider a trigger validating `target_id` existence in the referenced table.

### 5.4 `prescription_audit_trail.actor` is a free string
Should reference `users(id)` (`db_cat.md:223`). FK it.

### 5.5 `prescriptions.signature_data_url` as TEXT
Base64 PNG signatures can be 100KB+. Store the signature as a separate row in `signatures` with `BYTEA` or object storage URL, not inline base64 in the prescription row — keeps the table lean and queryable.

---

## 6. High Priority: Performance & Indexing

### 6.1 Missing indexes on hot read paths
- `appointments(appt_date)` ✓ listed, but the **doctor's daily schedule** query needs `(doctor_id, appt_date)`.
- `patients(name)` — clinic staff search by name constantly. Add `INDEX (name)`.
- `audit_entries(timestamp DESC)` — required for paginated audit logs.
- `analytics_events(timestamp DESC)` — and consider **partitioning by month** (`PARTITION BY RANGE (timestamp)`).
- `notifications(user_id, read, created_at DESC)` — drives the bell-icon dropdown.
- `sessions(user_id)` and `sessions(expires_at)` — for session validation and cleanup.
- `auth_tokens(access_token)` and `(refresh_token)` — already `UNIQUE` per spec, but make sure these are `HASH` indexes for O(1) lookup, not stored in plaintext (see §9.2).

### 6.2 Composite indexes missed
- `appointments(chamber_id, appt_date, status)` — for chamber-day-grid views.
- `prescriptions(patient_id, rx_date DESC)` — patient prescription timeline.
- `follow_ups(assigned_to, status, due_date)` — staff task queues.
- `order_items(order_id)` is implied by PK but add `(product_id)` for sales-by-product queries.

### 6.3 JSONB columns need GIN indexes if searched
`dashboard_layouts.layout`, `saved_views.filters`, `audit_entries.details`, `analytics_events.properties`, `seo_pages.structured_data`, `media_uploads.tags` — add `GIN` indexes only on those you actually query into. Don't index speculatively.

---

## 7. High Priority: Missing Entities

The schema is missing several tables that the code clearly uses:

| Missing table | Source | Suggested fields |
|---|---|---|
| **`appointments_status_history`** | kanban transitions in admin | `id`, `appointment_id`, `from_status`, `to_status`, `changed_by`, `changed_at`, `reason` |
| **`notifications_read`** (optional split) | bulk-clear-all UX | separate from `notifications` if read-state grows |
| **`patient_vitals_history`** | already in `patient_vitals`, but add `recorded_by` FK to users | — |
| **`orders` / `order_items`** | referenced (`db_cat.md:453`) | flesh out: `currency`, `shipping_address`, `billing_address`, `placed_by` |
| **`patient_insurance`** / **`insurance_providers`** | implied by clinic context | `provider_id`, `patient_id`, `policy_number`, `valid_until` |
| **`refills`** | `prescriptions.refill_count` increments | dedicated table: `id`, `prescription_id`, `requested_at`, `approved_by`, `status` |
| **`attachments`** | `patient_documents` exists but no general attachment table for prescriptions/messages | `id`, `parent_type`, `parent_id`, `storage_url`, `mime`, `size` |
| **`staff_schedules`** / **`chamber_schedules`** | implied by `chambers.hours` (free-text) | `chamber_id`, `day_of_week`, `open_time`, `close_time`, `capacity` |
| **`translations`** | i18n strings live in code | `key`, `lang`, `value`, `namespace` (per §4.13) |
| **`webhook_deliveries`** | if notifications integrate SMS/email | `id`, `channel`, `payload`, `status`, `attempt`, `last_error` |

---

## 8. Medium: Type & Schema Refinements

### 8.1 `gender` enum too narrow
`'Male','Female','Other'` misses `'Prefer not to say'`. Add it.

### 8.2 `blood_group` as VARCHAR
Clinic reality: A+, A-, B+, B-, AB+, AB-, O+, O-, plus rare types. Use a lookup table `blood_groups(code, label)` or `CHECK` constraint — better than free-text to enable reporting.

### 8.3 `appointments.appt_time` as TIME
Good. But also add `TIMEZONE` (`appointments_tz VARCHAR(40)`, default `'Asia/Dhaka'`) — Bangladesh has no DST but cross-border telemedicine may need it.

### 8.4 `duration_min` as INT
Good. But also store `start_at TIMESTAMPTZ` and `end_at TIMESTAMPTZ` (computed or trigger-maintained) — eliminates date-arithmetic bugs in conflict checks.

### 8.5 `appointments.appt_type` enum
Add `'Home-visit'` if the clinic offers it.

### 8.6 `appointments.fee` should be `NOT NULL` with default
Good (`db_cat.md:176`), but make it `DEFAULT0` to allow tentative/waitlist entries before pricing.

### 8.7 `payments.method` as free VARCHAR
Restrict: `CHECK (method IN ('Cash','bKash','Nagad','Card','Bank','Insurance'))`.

### 8.8 `payments.last4 CHAR(4)`
`CHAR(4)` right-pads whitespace — use `VARCHAR(4)` or split into `card_brand` + `card_last4`.

### 8.9 `media_uploads.size_bytes BIGINT`
Good. Add `checksum VARCHAR(64)` (SHA-256) for deduplication and integrity verification.

### 8.10 `videos.duration` as VARCHAR
Should be `INTERVAL` or `INT` (seconds). Currently `'12:34'` strings are not queryable.

### 8.11 `reviews.rating` as SMALLINT
Add `CHECK (rating BETWEEN 1 AND 5)` ✓ (already specified). Good. But consider splitting into `rating_overall`, `rating_bedside`, `rating_wait_time` for richer analytics.

### 8.12 `prescriptions.refill_count >= refills_allowed` invariant
Enforce with `CHECK (refill_count <= refills_allowed)` or a `BEFORE INSERT/UPDATE` trigger.

### 8.13 `appointments.status` enum
Add `'No-show'` — common in clinic operations and kanban needs it.

### 8.14 `users.failed_attempts` reset
Schema doesn't say so. Add a trigger or app logic to reset to0 on successful login.

### 8.15 `users.locked_until` cleanup
Add a partial index `users(locked_until) WHERE locked_until IS NOT NULL` for the lockout cron.

---

## 9. Security & Privacy

### 9.1 PHI (Protected Health Information) column classification
Tag every column containing PHI (`patients.dob`, `address`, `phone`, `email`, `patient_visits.notes`, `patient_documents`, `patient_vitals`, `prescriptions.diagnosis`) and:
- Encrypt at rest (column-level or TDE).
- Add a `phi_tags` table or row-level security policies for `front-desk`, `nurse`, `doctor`, etc.

### 9.2 `auth_tokens.access_token` and `refresh_token` as TEXT
These should be **hashed** before storage (never store the raw token). Either:
- Store `access_token_hash`, `refresh_token_hash` (SHA-256 hex), or
- Use `BYTEA` for hashed bytes.
Same for `sessions.id` — opaque session IDs should be stored hashed.

### 9.3 `users.password_hash` as VARCHAR(255)
Good length for Argon2id. Enforce via app layer.

### 9.4 `audit_entries.details` as JSONB
If it stores PHI, redact before write (or note that audit logs may contain PHI and apply the same encryption).

### 9.5 Row-level security (RLS)
Enable PostgreSQL RLS on `patients`, `prescriptions`, `patient_visits`, `patient_notes`, `patient_documents`, `patient_vitals`, `messages` — restrict by `assigned_doctor_id`, `chamber_id`, or `patient_id` ownership.

### 9.6 Soft deletes
Currently the schema has no `deleted_at` columns. PHI regulations require retention but also the right to erasure. Add `deleted_at TIMESTAMPTZ` (nullable) on `patients`, `prescriptions`, `appointments`, `messages`, plus an `erasure_requested_at` for GDPR-style workflows.

---

## 10. Audit, Logging & Observability

### 10.1 `activity_log` vs `audit_entries` overlap
Both exist. Define non-overlapping responsibilities:
- `activity_log` — user-visible "what happened" feed (e.g. "Dr. Ibrahim approved review REV-001").
- `audit_entries` — security/permission trail (who tried what, denied attempts).
- Add `prescription_audit_trail` is fine — it's domain-specific.

### 10.2 Missing `appointments_status_history`
State transitions must be auditable — see §7.

### 10.3 No `created_by` / `updated_by` on most tables
Only `created_at`/`updated_at` exist. Add `created_by`, `updated_by` (FK → users) on `patients`, `appointments`, `prescriptions`, `orders`, `invoices`, `coupons`, `reviews`, `faqs`.

---

## 11. i18n & Multi-Currency

### 11.1 `_bn` columns are scattered
`db_cat.md:641` recommends `_bn` mirrors + a `translations` table. Concrete:
- Keep `_bn` for short, fixed-vocabulary strings (`services.name_bn`, `roles.name_bn`, `videos.title_bn`).
- Add `translations(id, key VARCHAR(120), lang CHAR(2), value TEXT, UNIQUE(key, lang))`.
- Add a `i18n_languages` table with `code`, `name`, `native_name`, `is_default`, `is_active`.

### 11.2 Money column currency
`products.currency` exists but `invoices`, `payments`, `appointments.fee` lack currency. Add `currency CHAR(3) NOT NULL DEFAULT 'BDT'` to all monetary tables — required if the clinic ever bills in USD/EUR (e.g. for foreign patients).

### 11.3 `NUMERIC(10,2)` is fine for BDT
But for INR/EUR with bigger numbers, `NUMERIC(12,2)` is safer. Consider standardizing on `NUMERIC(12,2)` everywhere.

---

## 12. Configuration & Operational

### 12.1 Missing reference/lookup tables
Promote these enums to tables for admin UI management:
- `appointment_statuses`, `appointment_types`
- `prescription_statuses`
- `payment_methods`, `payment_statuses`
- `order_statuses`
- `review_statuses`
- `notification_types`
- `user_statuses`
- `chamber_statuses`
- `service_statuses`

### 12.2 Missing `chambers.hours` structured form
Free-text `VARCHAR(80)` is bad. Replace with `chamber_schedules(chamber_id, day_of_week SMALLINT, open_time TIME, close_time TIME, is_closed BOOLEAN)`.

### 12.3 ID generation
`db_cat.md:595` suggests sequences or UUID v5. Recommend:
- `VARCHAR` business IDs (`DR-20481`, `APT-001`) — keep for human-readable paper trail.
- Add `uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid()` as a stable internal key for joins/foreign APIs.
- Generate via Postgres sequences: `CREATE SEQUENCE patient_id_seq;`.

### 12.4 Time zone
Set DB session to `Asia/Dhaka` (`SET TIME ZONE 'Asia/Dhaka'`). All `TIMESTAMPTZ` columns store UTC; conversion happens at the app/UI layer.

### 12.5 Missing `migrations` / `seed` strategy
`db_cat.md` is a blueprint, not migration scripts. Add:
- A real migrations folder (`prisma/migrations/` or `drizzle/`, or `supabase/migrations/`).
- Seed scripts for the 8 default roles, permissions matrix, demo doctor, sample chambers.

### 12.6 Backup / PITR
Not in the doc but critical for medical data — daily encrypted backups with PITR (point-in-time recovery) for30 days, off-site replication.

---

## 13. Concrete Add-On Schema (proposed)

```sql
-- Status history table (audit trail for state machines)
CREATE TABLE appointments_status_history (
  id              BIGSERIAL PRIMARY KEY,
  appointment_id  VARCHAR(32) NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  from_status     VARCHAR(16),
  to_status       VARCHAR(16) NOT NULL,
  changed_by      VARCHAR(32) REFERENCES users(id),
  changed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason TEXT
);
CREATE INDEX ON appointments_status_history(appointment_id, changed_at DESC);

-- Soft delete + audit columns
ALTER TABLE patients        ADD COLUMN deleted_at TIMESTAMPTZ, ADD COLUMN created_by VARCHAR(32) REFERENCES users(id), ADD COLUMN updated_by VARCHAR(32) REFERENCES users(id);
ALTER TABLE appointments ADD COLUMN deleted_at TIMESTAMPTZ, ADD COLUMN created_by VARCHAR(32) REFERENCES users(id), ADD COLUMN updated_by VARCHAR(32) REFERENCES users(id);
ALTER TABLE prescriptions   ADD COLUMN deleted_at TIMESTAMPTZ, ADD COLUMN created_by VARCHAR(32) REFERENCES users(id), ADD COLUMN updated_by VARCHAR(32) REFERENCES users(id);

-- Double-booking prevention
ALTER TABLE appointments ADD CONSTRAINT no_double_booking UNIQUE (chamber_id, appt_date, appt_time);

-- Doctor daily schedule lookup
CREATE INDEX appointments_doctor_day ON appointments(doctor_id, appt_date);

-- Patient name search
CREATE INDEX patients_name_trgm ON patients USING GIN (name gin_trgm_ops);
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Token hashingALTER TABLE auth_tokens
  RENAME COLUMN access_token  TO access_token_hash,
  RENAME COLUMN refresh_token TO refresh_token_hash;

-- Notifications deep-link FKs
ALTER TABLE notifications
  ADD COLUMN appointment_id VARCHAR(32) REFERENCES appointments(id) ON DELETE CASCADE,
  ADD COLUMN patient_id     VARCHAR(32) REFERENCES patients(id)     ON DELETE CASCADE,
  ADD COLUMN order_id       VARCHAR(32) REFERENCES orders(id)       ON DELETE CASCADE;
```

---

## 14. Top 5 Quick Wins (do these first)

1. **Add `NOT NULL`** to `appointments.{patient_id, chamber_id, doctor_id, service_id}` and **`UNIQUE (chamber_id, appt_date, appt_time)`** to prevent double-booking.
2. **Hash `auth_tokens` and `sessions.id`** — currently plaintext; major security flaw.
3. **Add missing indexes** for hot queries (`patients.name`, `appointments(doctor_id, appt_date)`, `audit_entries(timestamp DESC)`, `notifications(user_id, read, created_at DESC)`).
4. **Add `appointments_status_history` + `created_by/updated_by`** columns — enables state-machine auditing and accountability.
5. **Promote free-text enums to lookup tables** (`blood_groups`, `chamber_schedules`, `payment_methods`, etc.) — enables admin-managed vocabulary and reporting.
