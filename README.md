# SchoolOS — The Ultimate Multi-Tenant School Management Ecosystem

SchoolOS is a high-performance, production-grade School Management System (SMS) designed specifically for private educational institutions in Africa. It transforms traditional school record-keeping into a dynamic, data-driven revenue and operations engine.

## 🎯 Ideal Customer Profile (ICP)
Primary target: Mid-tier private schools (300–2000 students) in East Africa requiring robust financial reconciliation (M-Pesa), automated academic reporting, and multi-tenant scalability.

## 🚀 Core Modules
- **Admissions Pipeline:** Fully integrated lead tracking from public application to enrollment.
- **Automated Finance:** Real-time M-Pesa reconciliation, bulk invoicing, and institutional expense tracking.
- **Academic Core:** Multi-curriculum grading rubrics, automated report card generation, and LMS Lite features.
- **Operations:** Clash-free timetabling, hostel/dormitory occupancy tracking, and transport fleet logistics.
- **Security & Safety:** Digital visitor gate logs and a centralized student medical/health infirmary.
- **Stakeholder Hubs:** Specialized portals for Parents, Staff, and a Platform-wide Super Admin Command Center.

## 🏗️ Architecture Overview
- **Frontend:** Next.js 14 (App Router) with Tailwind CSS and shadcn/ui.
- **Backend:** NestJS (Modular Monolith) for secure, scalable domain logic.
- **Database:** PostgreSQL with Prisma ORM, utilizing a high-performance multi-tenant schema.
- **Multi-tenancy:** Strict data isolation via `school_id` with institutional-specific branding and configuration.

## 🛠️ Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL
- npm or turbo

### 1. Installation
```bash
npm install
```

### 2. Configuration
Create a `.env` file in the root based on `.env.example`:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/school_db"

# Auth
JWT_SECRET="your-secure-secret"

# Finance
MPESA_SHORTCODE="174379"
```

### 3. Database Migration & Seeding
```bash
cd apps/api
npx prisma migrate dev
npm run seed
```

### 4. Start Development
```bash
npm run dev
```

## 🔐 Quick Access & Test Credentials

Once the system is running, access the login portal at: **`http://localhost:3000/login`**

The following accounts are available via the default seed script (`npx prisma db seed`):

| Role | Email | Password |
| :--- | :--- | :--- |
| **School Admin** | `admin@school.com` | `password123` |
| **Parent** | `parent@test.com` | `password123` |
| **Student** | `student@test.com` | `password123` |

## 📂 Folder Structure
- `apps/api`: NestJS backend source, Prisma schema, and seed scripts.
- `apps/web`: Next.js frontend application, dashboards, and landing page.
- `supabase`: Configuration for managed PostgreSQL infrastructure.

## 🗺️ Roadmap
- [ ] Mobile App for Teachers/Parents (Flutter/React Native)
- [ ] AI-Powered Performance Forecasting
- [ ] Integrated Virtual Classrooms (WebRTC)
- [ ] Automated Bulk SMS/Email Campaigns

---
© 2024 SchoolOS. Engineered for Educational Excellence.
