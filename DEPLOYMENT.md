# SchoolOS Deployment Guide

This guide covers deploying the SchoolOS monorepo (NestJS API + Next.js Frontend) using Docker Compose for a production-ready environment.

## Prerequisites

- Docker & Docker Compose
- Node.js v18+ (for local development/seeding)
- PostgreSQL Database (Managed or Dockerized)

## Quick Start (Docker)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-org/school-os.git
   cd school-os
   ```

2. **Configure Environment**
   Copy the example environment file and update credentials.
   ```bash
   cp .env.example .env
   # Edit .env with your DB credentials, JWT secret, and M-Pesa keys
   ```

3. **Start Services**
   ```bash
   docker-compose up -d --build
   ```
   
   - **Frontend:** `http://localhost:3000`
   - **API:** `http://localhost:3001`
   - **Prisma Studio:** `http://localhost:5555`

4. **Database Migration**
   Inside the API container (or locally):
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## Manual Production Build

### API (NestJS)
```bash
cd apps/api
npm install
npm run build
npm run start:prod
```

### Web (Next.js)
```bash
cd apps/web
npm install
npm run build
npm start
```

## Critical Configuration

- **M-Pesa Callback:** Ensure `MPESA_CALLBACK_URL` is publicly accessible (use ngrok for local testing).
- **Security:** Rotate `JWT_SECRET` and use strong database passwords in `.env`.
- **SSL:** Reverse proxy (Nginx/Caddy) should handle SSL termination before traffic hits the app.

## Troubleshooting

- **Database Connection:** Ensure `DATABASE_URL` matches the internal Docker network alias if running via Compose.
- **CORS:** Check `main.ts` in API to whitelist your frontend domain.
