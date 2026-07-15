# EventPilot Client

EventPilot Client is the production frontend for a full-stack TypeScript event discovery and management platform. It is built with Next.js, React, Tailwind CSS, Recharts, Google Identity Services, and a JWT-secured Express API.

Live site: https://eventpilot-client.vercel.app

Server repository: https://github.com/fahid2002/EventPilot-Server

## Features

- Responsive landing page with hero slider, meaningful content sections, event highlights, statistics, testimonials, FAQ, and call to action.
- Public event discovery with search, category filter, location filter, access type filter, sorting, pagination, and skeleton loading.
- Public event details page with gallery images, overview, key information, review form, save action, attend action, and related events.
- Email/password authentication with role selection.
- Google login and Google registration for user and organizer accounts.
- User-only demo login autofill from environment variables.
- Role-aware registration for `user` and `organizer`.
- Admin login through email/password only.
- JWT session persistence with authenticated API requests.
- Protected dashboard with role-based views for users, organizers, and admins.
- Protected `/items/add` page for organizer/admin event creation.
- Protected `/items/manage` page for organizer/admin event management.
- MongoDB-backed saved events, attending events, website reviews, payments, and dashboard metrics.
- Premium event payment entry page with Stripe checkout integration through the server.
- Contact page with EmailJS integration.
- Additional informational pages: About, Blog, Contact, Help Center, Privacy, and Terms.
- Dark mode toggle and responsive navigation for mobile, tablet, and desktop.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React
- Google OAuth via `@react-oauth/google`
- EmailJS
- Vercel deployment

## Project Structure

```text
src/
  app/
    page.tsx                 Home page
    explore/page.tsx         Event listing and filters
    events/[id]/page.tsx     Event details
    login/page.tsx           Login form
    register/page.tsx        Registration form
    dashboard/page.tsx       Role dashboard
    items/add/page.tsx       Protected add event page
    items/manage/page.tsx    Protected manage event page
    payment/[eventId]/page.tsx
    about/page.tsx
    blog/page.tsx
    contact/page.tsx
    help-center/page.tsx
    privacy/page.tsx
    terms/page.tsx
  components/                Reusable UI components
  contexts/                  Auth, toast, and action guard state
  lib/                       API client and utilities
  types/                     Shared frontend TypeScript types
```

## Local Setup

### Prerequisites

- Node.js 20 or newer
- npm
- Running EventPilot Server API
- Google OAuth web client ID
- Optional EmailJS account for contact form delivery

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` in the client root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id

NEXT_PUBLIC_DEMO_USER_EMAIL=demo@eventpilot.dev
NEXT_PUBLIC_DEMO_USER_PASSWORD=Demo@123
NEXT_PUBLIC_ADMIN_EMAIL=admin@eventpilot.dev

NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

Do not put private secrets in client environment variables. Every `NEXT_PUBLIC_*` value is visible in the browser. Keep the admin password, JWT secret, MongoDB URI, Stripe secret key, and webhook secret only on the server.

### Run Locally

```bash
npm run dev
```

The client runs at:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Authentication Rules

- Login requires an email, password, and selected role.
- Registration supports only `user` and `organizer` roles.
- Admin accounts are not created through public registration.
- Admin login is email/password only.
- Google login is allowed only for already registered user/organizer accounts.
- Google registration creates user/organizer accounts based on the selected role.
- The same email can exist as a separate user and organizer account because the backend stores role-aware accounts.
- Demo login is user-only and cannot perform data-changing actions.
- Demo users can browse but cannot save, attend, review, pay, add, manage, or delete events.

## Main Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/explore` | Public | Search, filter, sort, and paginate approved events |
| `/events/[id]` | Public | Event details and related events |
| `/login` | Public | Role-aware login |
| `/register` | Public | User/organizer registration |
| `/dashboard` | Protected | Role-based user, organizer, and admin dashboard |
| `/items/add` | Organizer/Admin | Add an event |
| `/items/manage` | Organizer/Admin | View and delete manageable events |
| `/payment/[eventId]` | Protected | Premium membership/payment flow |
| `/about` | Public | About page |
| `/blog` | Public | Blog page |
| `/contact` | Public | Contact form |
| `/help-center` | Public | Help content |
| `/privacy` | Public | Privacy policy |
| `/terms` | Public | Terms page |

## API Integration

The frontend API wrapper is located at `src/lib/api.ts`.

Implemented API calls include:

- Event listing and event details
- Login, registration, Google login, Google registration, and current user lookup
- Dashboard summary
- Save event
- Attend event
- Website review submission
- Organizer/admin event list
- Add event
- Delete event
- Stripe checkout creation
- Demo premium upgrade
- Admin pending events
- Admin event approval/rejection

## Google OAuth Setup

Create a Google Cloud OAuth Web Client and configure these authorized JavaScript origins:

```text
http://localhost:3000
https://eventpilot-client.vercel.app
```

Use the same client ID in:

- Client: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- Server: `GOOGLE_CLIENT_ID`

The frontend receives the Google credential and sends it to the server, where the token is verified before creating or logging in a user.

## Deployment

The client is deployed to Vercel from the GitHub repository.

Production URL:

```text
https://eventpilot-client.vercel.app
```

Required Vercel environment variables:

```env
NEXT_PUBLIC_API_URL=https://eventpilot-server.onrender.com/api
NEXT_PUBLIC_CLIENT_URL=https://eventpilot-client.vercel.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_DEMO_USER_EMAIL=demo@eventpilot.dev
NEXT_PUBLIC_DEMO_USER_PASSWORD=Demo@123
NEXT_PUBLIC_ADMIN_EMAIL=admin@eventpilot.dev
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

After changing Vercel environment variables, redeploy the project so Next.js can bake public variables into the production build.

Current production environment variables are configured directly in Vercel. Local `.env.local` values are for development only and should not be committed.

## Verification Checklist

Before submitting or deploying:

```bash
npm run build
```

Then verify:

- Home page loads.
- Explore page loads MongoDB events.
- Event details page loads a real event by ID.
- Login works with the correct role.
- Register blocks duplicate role/email accounts with a meaningful message.
- Unknown Google login redirects to registration.
- User dashboard loads after login.
- Organizer/admin can access `/items/add` and `/items/manage`.
- Normal users cannot access organizer/admin pages.
- Demo users cannot mutate data.

## Related Backend

The client requires the EventPilot Server API for MongoDB, JWT auth, Google token verification, Stripe, and protected role actions.

Server live URL:

```text
https://eventpilot-server.onrender.com
```

## Credits

Developed by **Fahid Hasan**.

Built as a full-stack TypeScript project using Next.js, Express.js, MongoDB, JWT authentication, role-based authorization, Google login, Stripe payment integration, and responsive Tailwind CSS UI.
