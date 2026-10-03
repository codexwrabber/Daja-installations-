# Daja Installation Services — MVP

A mobile-first Next.js + Supabase platform combining the Daja company site with worker
registration, authentication, groups, realtime group chat, a customer service-request form,
and a simple admin panel, per the MVP architecture spec.

## Stack

- Next.js 14 (App Router) + React + TypeScript
- Tailwind CSS (light/dark theme via `prefers-color-scheme`)
- Supabase: Auth, PostgreSQL, Realtime, Storage
- Lucide React icons
- Deploys to Vercel

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a Supabase project** at https://supabase.com, then copy your project URL, anon
   key, and service-role key into a local env file:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...      # Project Settings -> API -> service_role
   ADMIN_ACCESS_CODE=...              # any string you choose, for /admin
   ```
   `SUPABASE_SERVICE_ROLE_KEY` must **never** get a `NEXT_PUBLIC_` prefix — it bypasses
   Row Level Security and is only read on the server (`app/api/admin/requests`).

3. **Run the database migrations** — in the Supabase SQL editor, paste and run, in order:
   - `supabase/migrations/0001_init.sql` — `profiles`, `worker_profiles`, `groups`,
     `group_members`, `messages`, RLS policies, and the `worker-documents` storage bucket.
   - `supabase/migrations/0002_contact_and_admin.sql` — `contact_messages` table for the
     Contact page's service-request form (public insert, admin-only read via the service
     role key).

4. **Disable email confirmation** — Supabase Dashboard → Authentication → Sign In / Providers
   → Email → turn **off** "Confirm email". Safari and some in-app browsers mangle the
   confirmation link's token, causing "invalid link" errors, and the MVP doesn't need the
   extra step. With it off, both account registration and worker registration sign the
   person in immediately after they submit the form. The code already handles either
   setting — if you turn confirmation back on later, people will see a "check your email"
   message instead of being signed in automatically.

5. **Enable OAuth providers (optional)** — in Supabase Auth settings, enable Google and/or
   Azure (Microsoft) if you want the "Continue with Google/Microsoft" buttons to work.

6. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## Admin Panel

Visit `/admin` and enter the `ADMIN_ACCESS_CODE` you set in your env vars. It lists every
submission from the public Contact page (name, email, phone, message, timestamp) and lets
you mark each one `new` / `contacted` / `closed`. This is intentionally simple — a single
shared access code, no user accounts — since the spec calls for an MVP. If you need
per-admin logins later, replace the code-gate in `app/admin/page.tsx` with a check against
a `profiles.is_admin` column and Supabase Auth.

## Deployment

1. Push this repository to GitHub/GitLab.
2. Import the repo into Vercel.
3. Add all four environment variables from `.env.local.example` in the Vercel project
   settings (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_ACCESS_CODE`).
4. Deploy — Vercel builds and hosts the Next.js app; Supabase remains the backend.

## Project Structure

```
app/            Route segments (marketing pages, auth, worker registration, groups, profile, admin)
app/api/admin/  Admin API routes (service-role access, gated by ADMIN_ACCESS_CODE)
components/     Reusable UI, marketing, auth, groups and worker components
lib/            Supabase clients (browser, server, admin/service-role), auth hook, validation
types/          Shared TypeScript types matching the Supabase schema
supabase/       SQL migrations
```

## Notes on Scope

- Payment processing is **not** implemented — the worker registration flow explains that a
  registration fee applies and payment instructions will follow manually. `payment_status`
  is tracked in the database for admins to update by hand.
- Admin approval of worker applications (`registration_status`) is not yet a UI — update it
  directly in Supabase, or extend `/admin` to include a worker-applications tab the same
  way service requests are listed.
- Everything else in the spec's "Explicitly Out of Scope for MVP" section (voice/video,
  stories, media pipelines, E2E encryption, push infrastructure) is intentionally left out
  to keep the first release small and shippable.
