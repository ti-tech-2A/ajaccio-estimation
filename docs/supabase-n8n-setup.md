# Supabase + n8n Setup

This project now writes leads, estimation snapshots, and callback requests from API routes.

## 1) Configure environment variables

Edit `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# n8n
N8N_WEBHOOK_URL=https://your-n8n-domain/webhook/ajaccio-estimation
N8N_WEBHOOK_SECRET=YOUR_SHARED_SECRET
```

Notes:
- API routes use `SUPABASE_SERVICE_ROLE_KEY` server-side only.
- `N8N_WEBHOOK_URL` is optional. If empty, webhook calls are skipped.

## 2) Create database tables

Run the SQL script in Supabase SQL editor:

`supabase/schema.sql`

It creates:
- `public.leads`
- `public.estimations`
- `public.contact_requests`

## 3) Verify locally

Run:

```bash
npm.cmd run test:unit -- --runInBand
npm.cmd run build
```

Then test:
- `/estimer` final step submission
- `/expert` callback form submission

## 4) n8n payloads

API routes send POST requests to `N8N_WEBHOOK_URL` with:
- `event`: `lead_captured` or `contact_request_submitted`
- `occurredAt`: ISO timestamp
- `payload`: lead/contact + persistence status

If `N8N_WEBHOOK_SECRET` is set, requests include header:
- `x-webhook-secret: <secret>`
