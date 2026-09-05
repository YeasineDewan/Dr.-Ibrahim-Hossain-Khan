# Dr. Ibrahim Clinic — Engineering Guide

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript 5.7.3
- **Tailwind CSS** + custom CSS (`app/globals.css`, `app/motion.css`)
- **Lucide React** for icons
- **jsPDF** for PDF generation (prescriptions, invoices)
- **Custom i18n** (English + Bengali) via React Context

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build (runs tsc + lint)
pnpm lint         # ESLint (0 warnings)
pnpm typecheck    # TypeScript check
pnpm test         # Run Vitest
pnpm format       # Format with Prettier
```

## Project Structure

```
app/                    # Next.js entry
  page.tsx              # SPA-style shell (client-side routing via useState)
  layout.tsx            # Root layout with LanguageProvider
  globals.css           # 2500+ lines of custom CSS
  motion.css            # Keyframes & 3D animations
components/
  page.tsx              # Main app shell (841 lines)
  admin-workspace.tsx   # Admin panel wrapper
  admin-ui.tsx          # Admin UI primitives
  illust-svg.tsx        # Custom SVG illustrations
  motion-3d.tsx         # 3D tilt, magnetic, particles
  motion-shell.tsx      # Custom cursor, scroll progress
  scroll-reveal.tsx     # Intersection Observer
  patient-portal.tsx    # Patient dashboard
  about-page.tsx        # About the doctor
  service-detail-page.tsx
  language-invoice.tsx  # Language gate, invoice
  expanded-pages.tsx    # Services, Contact pages
  page-experiences.tsx  # Gallery, Chambers, Booking
  admin/                # Admin submodules (dashboard, care, patients, etc.)
lib/
  admin-data.ts         # useAdminData() hook + data types
  i18n.tsx              # Language context
  translations/         # i18n content files
```

## Architecture Notes

### Data Layer

- `useAdminData()` in `lib/admin-data.ts` is the single source of truth for all clinic data
- Data persists to `sessionStorage` automatically
- Use `upsert` pattern: `data.addPatient(p)` upserts by ID, `data.removePatient(id)` deletes
- Always call `data.logActivity()` when mutating data in admin views

### Routing Pattern

- `app/page.tsx` uses **client-side state routing** (`useState('Home')`) — not file-based routing
- Views are lazy-loaded via `next/dynamic` with hover prefetch
- `NavBtn` component prefetches route chunks on hover/focus

### Admin Views

- Admin modules live in `components/admin/*.tsx`
- Each view receives `data: AdminData`, `copy: any`, `onLog`, `toast` props
- Use `Drawer`/`Modal` from `admin-ui.tsx` for forms
- Use `Avatar`, `Pill`, `Stat` for consistent admin UI

### Conventions

- Components are `'use client'` (no SSR for interactive parts)
- Use `useLanguage()` hook for i18n — returns `{ lang: 'en' | 'bn', setLang, toggle }`
- Translation objects: `common[lang]`, `navCopy[lang]`, `adminCopy[lang]`, `patientCopy[lang]`
- All monetary values in BDT (৳) use `formatBn()` helper in care.tsx
- Bengali numerals via `toBn()` / `toBnTime()` helpers in patient-portal.tsx

### CSS

- Global CSS in `app/globals.css` (uses CSS variables for theming)
- Motion CSS in `app/motion.css` (keyframes, respects `prefers-reduced-motion`)
- Admin CSS is in `globals.css` under `.adm-*` and `.pro-*` class prefixes
- Use `premium-card shine-card` for elevated cards, `glass-panel` for glassmorphism
