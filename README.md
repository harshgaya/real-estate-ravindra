# Jyothi Properties - Real Estate CRM + Website

Production-grade Next.js + Prisma + Supabase CRM and public marketing site for Jyothi Properties. Built as a PWA with web push notifications, Meta + Google webhook lead capture, S3 media uploads, role-based access, and a Leadrat-style lead drawer.

## Tech Stack

- Next.js 16 (App Router, JavaScript only)
- Prisma 6 + Supabase Postgres
- Tailwind CSS v4
- AWS S3 (presigned uploads for images, videos, PDFs)
- Web Push (VAPID) + Service Worker for PWA install
- bcryptjs + JWT for session auth
- React Icons (Lucide)

## Roles

- `admin` - full access. Manages properties, projects, users, settings, templates, testimonials, reports, all leads.
- `manager` - sees their team's leads + own. Can view properties, projects, reports, testimonials, templates. Cannot edit inventory.
- `agent` - sees only own leads. Cannot see properties, projects, settings, users, testimonials, templates, reports.

## Setup

### 1. Database (Supabase)

Create a Supabase project. From Settings -> Database, copy:

- Connection pooler URL (port 6543) -> `DATABASE_URL`
- Direct connection URL (port 5432) -> `DIRECT_URL`

Use an alphanumeric password only (no special chars like @ : / ? # ! $ & *).

### 2. Environment file

```
cp .env.example .env
```

Edit `.env` and set:

- `DATABASE_URL` and `DIRECT_URL` from Supabase
- `JWT_SECRET` - any random 32+ char string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` - your seed admin
- `SEED_USERS_JSON` - additional users (manager + agents) to seed
- AWS S3 keys (see below)
- VAPID keys (run `npx web-push generate-vapid-keys`)
- Meta + Google webhook secrets if using

### 3. Install + seed

```
npm run setup
```

This runs `npm install`, `prisma generate`, `prisma db push`, and `prisma/seed.js` to populate default settings, templates, testimonials, properties, and projects.

### 4. Run

```
npm run dev
```

- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

Sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## AWS S3 Setup

1. Create an S3 bucket in `ap-south-1` (or your region).
2. Block public ACLs (uses presigned URLs for upload, public read on objects).
3. Bucket CORS policy:

```
[{
  "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
  "AllowedMethods": ["GET", "PUT", "HEAD"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"]
}]
```

4. Bucket policy for public read on uploaded objects:

```
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::YOUR_BUCKET/*"
  }]
}
```

5. Create an IAM user with `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` for the bucket.
6. Set `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` in `.env`.
7. Optional: `AWS_S3_PUBLIC_URL` if using a CDN/CloudFront.

## Meta Lead Webhook

1. In Facebook Developer Console, go to your App -> Webhooks -> Page.
2. Subscribe to `leadgen` field.
3. Callback URL: `https://yourdomain.com/api/webhooks/meta-leads`
4. Verify token: matches `META_VERIFY_TOKEN` in `.env`
5. Set `META_PAGE_ACCESS_TOKEN` (long-lived) so the webhook can fetch lead details.

## Google Lead Form Webhook

1. In Google Ads, set up Lead Form Extensions.
2. Webhook URL: `https://yourdomain.com/api/webhooks/google-leads`
3. Key: matches `GOOGLE_LEADS_WEBHOOK_KEY` in `.env`. Pass it as `google_key` field or `x-google-key` header.

## Cron Reminders

Hit `/api/cron/tick` every minute. On Vercel, add to `vercel.json`:

```
{
  "crons": [{ "path": "/api/cron/tick", "schedule": "* * * * *" }]
}
```

Or use any external scheduler with `Authorization: Bearer YOUR_CRON_SECRET` header.

## Auto-assignment

- Default rule is disabled. Enable via `/api/admin/autoassign` PATCH.
- Round-robin across active rotation agents from `AutoAssignRule` table.
- Webhooks auto-assign incoming leads.
- Manual lead capture from public site auto-assigns if rule is active; otherwise notifies all admins/managers.

## PWA / Web Push

- Admin pages register a service worker on mount and request notification permission.
- Subscriptions stored in `PushSubscription` table.
- Cron and lead capture send pushes for new leads, site visit reminders, overdue tasks.
- Install: Chrome/Safari add-to-home-screen prompts on `/admin/*`.

Replace `public/icon-192.png` and `public/icon-512.png` with your branded icons. Defaults are placeholders.

## Lead pipeline (13 stages)

new -> contacted -> callback -> qualified -> meeting_scheduled -> site_visit_scheduled -> site_visit_done -> negotiation -> eoi -> booked (terminal) | not_interested, dropped, lost (lost terminals)

Status changes auto-log activity. Site visit completion auto-moves lead to `site_visit_done`. Booking creation auto-moves lead to `booked`.

## Admin Sections

- Dashboard - role-aware KPIs, recent leads, upcoming visits
- Leads - Leadrat-style list with KPI pills, advanced filters, sortable columns, manage columns, drawer with 5 tabs and 7 action icons
- Data - Active / Followups / Lead Pool / Junk views
- Calendar - agenda by day, site visits + tasks
- Site Visits - schedule, check-in, status workflow
- Tasks - Today / This Week / Upcoming / Overdue / Done filters
- Bookings - new booking flow, KYC tracking, payment milestones
- Properties - full CRUD with multi-media S3 upload (cover + gallery + videos + PDFs)
- Projects - similar to properties + phases
- Templates - WhatsApp / Email / Call scripts with merge tags
- Testimonials - text + video, featured + display order
- Users - admin only, add/edit/deactivate
- Reports - manager + admin only, breakdowns by source/status/user/city + 30-day chart, CSV export
- Settings - admin only, edit all branding, contact, social, legal, analytics, SEO, policies
- Team - read-only roster of teammates
- Notifications - full list with mark-read

## Lead Drawer

Click any lead row to open the right drawer (480-560px on desktop, full-screen on mobile):

- 5 tabs: Overview / Status / History / Notes / Documents
- 7 action icons: Edit / Notes / History / Upload / Email / WhatsApp / Call
- Email/WhatsApp/Call composers with template selector and merge tags
- Email opens mailto:, WhatsApp opens wa.me, Call opens tel: and prompts for outcome + duration log

## Public Site

Routes: /, /properties, /properties/[slug], /projects, /projects/[slug], /locations/[slug], /contact, /blog, /privacy, /terms, /thank-you

Lead capture from any form -> POST /api/leads/capture -> validates -> creates Lead -> auto-assigns -> notifies.

## Deploying to Vercel

1. Push to GitHub.
2. Import in Vercel.
3. Add all env vars from `.env`.
4. Build command: `prisma generate && next build`
5. Add cron in `vercel.json`.
6. Custom domain + run `prisma migrate deploy` once on first deploy.

## File Structure

```
app/
  admin/            -> CRM pages
  api/              -> all API routes
  (public pages)
components/
  admin/            -> AdminShell, LeadDrawer, MediaUploader, forms
  public/           -> site components
lib/
  prisma.js         -> client
  auth.js           -> session, role helpers, lead visibility
  s3.js             -> presigned URLs
  push.js           -> VAPID web push
  auto-assign.js    -> round-robin
  settings.js       -> cached settings + public site filter
  constants.js      -> all enums and labels
prisma/
  schema.prisma     -> 14 tables
  seed.js           -> initial data
public/
  sw.js             -> service worker
  manifest.json     -> PWA manifest
  icon-192.png, icon-512.png
```

## Defaults seeded

- 1 admin (from env)
- N additional users (from `SEED_USERS_JSON`)
- 30+ default settings
- 11 templates (6 WhatsApp + 3 Email + 2 Call)
- 6 sample properties
- 2 sample projects
- 3 sample testimonials
- Default auto-assign rule (disabled)

## Important constraints

- JavaScript only (no TypeScript)
- No third-party messaging APIs (uses wa.me, mailto:, tel: links)
- BigInt for all currency fields (rupees, no decimal)
- All BigInt fields serialized to strings on API boundaries
- Soft-delete on properties/projects (sets `isActive = false`)

## Troubleshooting

- Login fails: Run `npm run db:seed` and check `ADMIN_EMAIL` / `ADMIN_PASSWORD` are set.
- DB connection error: Supabase password must be alphanumeric, no special chars. URL format: `?pgbouncer=true` on pooler, plain on direct.
- S3 upload fails: Check bucket CORS includes your origin and `PUT` method.
- Push notifications don't appear: Run `npx web-push generate-vapid-keys` and add to `.env`. iOS Safari requires the site to be installed as PWA first.
- Build error on home page: `app/page.js` exports `dynamic = "force-dynamic"` to bypass prerender with Prisma.
