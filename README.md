# Daja Installation Services — MVP

A mobile-first Next.js + Supabase platform combining the Daja company site with worker
registration, authentication, groups and realtime group chat, per the MVP architecture spec.

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

2. **Create a Supabase project** at https://supabase.com, then copy your project URL and anon
   key into a local env file:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

3. **Run the database migration** — in the Supabase SQL editor, paste and run
   `supabase/migrations/0001_init.sql`. This creates the `profiles`, `worker_profiles`,
   `groups`, `group_members` and `messages` tables, enables Row Level Security, sets up
   policies, and creates the `worker-documents` storage bucket.

4. **Enable OAuth providers (optional)** — in Supabase Auth settings, enable Google and/or
   Azure (Microsoft) if you want the "Continue with Google/Microsoft" buttons to work.

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## Deployment

1. Push this repository to GitHub/GitLab.
2. Import the repo into Vercel.
3. Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables in the Vercel project settings.
4. Deploy — Vercel builds and hosts the Next.js app; Supabase remains the backend.

## Project Structure

```
app/            Route segments (marketing pages, auth, worker registration, groups, profile)
components/     Reusable UI, marketing, auth, groups and worker components
lib/            Supabase clients (browser + server), auth hook, validation helpers
types/          Shared TypeScript types matching the Supabase schema
supabase/       SQL migrations
```

## Notes on Scope

- Payment processing is **not** implemented — the worker registration flow explains that a
  registration fee applies and payment instructions will follow manually. `payment_status`
  is tracked in the database for admins to update by hand.
- Group creation UI has a "Create Group" button wired for a future modal/insert flow; extend
  `app/groups/page.tsx` to open a form calling `supabase.from('groups').insert(...)`.
- Admin approval of worker applications (`registration_status`) is not yet a UI — update it
  directly in Supabase or build an admin view on top of the existing table/policies.
- Everything else in the spec's "Explicitly Out of Scope for MVP" section (payments, voice/
  video, stories, media pipelines, E2E encryption, push infrastructure) is intentionally left
  out to keep the first release small and shippable.
