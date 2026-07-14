# EventPilot Client

TypeScript Next.js frontend for EventPilot. It includes public event discovery, Google/email-password auth, user dashboard, organizer/admin dashboard sections, event details, saved/attending event flows, payment entry, contact form, and responsive Tailwind UI.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure `.env.local`.

Required keys:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_USER_EMAIL=...
NEXT_PUBLIC_DEMO_USER_PASSWORD=...
NEXT_PUBLIC_ADMIN_EMAIL=...
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

`NEXT_PUBLIC_DEMO_USER_*` is intentionally public because the demo autofill button uses it. Do not add the admin password to client env because all `NEXT_PUBLIC_*` values are visible in the browser.

3. Run locally:

```bash
npm run dev
```

## Login Behavior

- Demo autofill logs in only the demo user account.
- Demo users can browse but cannot save, attend, review, pay, or modify data.
- Admin login uses the normal login form with the server-side seeded admin credentials.
- Organizer accounts are not demo-filled and are not seeded; users register first, then admin can promote them.

## Google OAuth

Create a Google Cloud OAuth Web Client and use the same client ID in:

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` on the client.
- `GOOGLE_CLIENT_ID` on the server.

For local development, add these authorized JavaScript origins:

```text
http://localhost:3000
```

For production, add your Vercel domain after deployment:

```text
https://<vercel-client-domain>
```

The app uses Google Identity Services token verification on the server.

## Recent Configuration Work

- Demo login autofill now reads from env and remains user-only.
- Added env documentation for demo and admin login behavior.
- Fixed the production build lint issue in the explore page.
- Ignored generated Next files in ESLint config.
