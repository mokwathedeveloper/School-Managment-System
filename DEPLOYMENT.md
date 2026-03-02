# SchoolOS Deployment Guide

This guide outlines the production deployment strategy for the SchoolOS ecosystem, comprising the **Next.js Web Terminal** (Fullstack App Router) and the **Expo Native Mobile App**.

## Prerequisites

- Node.js v18+ 
- PostgreSQL Database (e.g., Supabase, RDS)
- Pusher Account (for Real-time WebSockets)
- Redis (Optional, for advanced rate-limiting/caching)

## Environment Configuration

1. Clone the repository and configure the environment variables at the monorepo root.
   ```bash
   cp .env.example .env
   ```

2. **Critical Variables:**
   - `DATABASE_URL`: Transactional connection string for Prisma.
   - `DIRECT_URL`: Pooled connection string (required for Supabase/Neon).
   - `JWT_SECRET`: High-entropy key for stateless authentication.
   - `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`: Real-time notification gateway keys.

## 1. Database Provisioning & Seeding

Before starting the applications, the Prisma schema must be synchronized and seeded.

```bash
cd apps/web
npm install

# Push schema to the database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed the database with the initial institutional hierarchy and roles
npm run seed
```

**Seed Credentials:**
The `npm run seed` command automatically provisions the following accounts (Password for all: `password123`):
- `super@schoolos.com` (Super Admin)
- `admin@schoolos.com` (School Admin)
- `teacher@schoolos.com` (Teacher)
- `nurse@schoolos.com` (Nurse)
- `librarian@schoolos.com` (Librarian)
- `security@schoolos.com` (Security)
- `driver@schoolos.com` (Driver)
- `staff@schoolos.com` (Subordinate)
- `student@schoolos.com` (Student)
- `parent@schoolos.com` (Parent)

## 2. Deploying the Web Terminal (Next.js)

The Web Terminal is optimized for Vercel, AWS Amplify, or a standard Node.js Docker container.

### Option A: Vercel (Recommended)
1. Import the repository into Vercel.
2. Set the Root Directory to `apps/web`.
3. Add all variables from your `.env` file to the Vercel Environment Variables.
4. Deploy. Vercel will automatically run `npm run build` which includes `prisma generate`.

### Option B: Custom Node Server
```bash
cd apps/web
npm run build
npm run start
```
*The server will boot on `http://localhost:3000`.*

## 3. Deploying the Mobile Native Extension (Expo)

The mobile application utilizes Expo Router and connects to the Next.js API.

### Preparation
1. Update `apps/mobile/lib/api.ts` to ensure the `baseURL` points to your production Web Terminal URL (e.g., `https://your-school-os.com/api`).
2. Ensure you have an Expo developer account.

### Building for iOS/Android (EAS Build)
```bash
npm install -g eas-cli
eas login

cd apps/mobile
eas build --profile production --platform all
```

*This will generate `.aab` (Android) and `.ipa` (iOS) files ready for App Store and Play Store submission.*

## 4. Third-Party Integrations

### M-Pesa Gateway
Ensure your Web Terminal is accessible via a public HTTPS URL. Safaricom will send STK Push callbacks to:
`https://your-school-os.com/api/finance/mpesa/callback`

### Google Classroom & Zoom
Ensure you have registered your public domain in the Google Cloud Console and Zoom App Marketplace as authorized redirect URIs:
`https://your-school-os.com/api/integrations/google`

## Security Hardening
- Ensure `is_active` flags are monitored.
- Rotate the `JWT_SECRET` periodically.
- For maximum security, configure Prisma to use SSL certificates (`sslmode=require` in the database URL).
