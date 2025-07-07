# WeatherDesk

A modern, full-stack weather dashboard app built with Next.js, Prisma, PostgreSQL, NextAuth, Stripe, and Tailwind CSS.

## Features
- User authentication (Google OAuth & credentials)
- Premium subscriptions with Stripe
- Weather dashboard with current, 5-day, and (premium) 16-day/historical forecasts
- Location management (add/remove cities)
- Responsive UI with sidebar, navbar, and mobile support
- Weather alerts (basic)
- Error handling and loading states

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL (Railway or local)
- **Auth:** NextAuth.js (Google, credentials)
- **Payments:** Stripe
- **Weather Data:** OpenWeatherMap API
- **Maps:** Google Maps Places API (for location search)

## Getting Started

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd weatherdesk
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root with the following (see your Railway, Google, Stripe, and OpenWeatherMap dashboards for values):
```env
DATABASE_URL=postgresql://...           # Railway or local Postgres URL
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000      # Or your deployed URL
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_OPENWEATHER_API_KEY=...
OPENWEATHER_API_KEY=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

### 4. Set up the database
- **Local:**
  ```bash
  npx prisma migrate dev --name init
  ```
- **Production (Railway):**
  ```bash
  npx prisma migrate deploy
  # or
  npx prisma db push
  ```

### 5. Run the app
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### 6. Build for production
```bash
npm run build
npm start
```

## Deployment
- Deploy to [Vercel](https://vercel.com/) or [Railway](https://railway.app/)
- Set all environment variables in the platform dashboard
- Make sure your production database is awake and accessible

## Project Structure
- `src/app/` — App routes, pages, API endpoints
- `src/components/` — Reusable UI components
- `src/lib/` — Auth, Prisma, weather utilities
- `prisma/` — Prisma schema and migrations

## Usage
- Register or sign in with Google
- Add locations to your dashboard
- View current and forecast weather
- Subscribe to premium for extended features
- Manage your profile and subscription

## License
MIT
