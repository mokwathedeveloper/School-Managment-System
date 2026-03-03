# SchoolOS — The Elite Multi-Tenant School Management Ecosystem

SchoolOS is a high-performance, enterprise-grade School Management System (SMS) designed for institutional scale. It transforms educational administration into a secure, data-driven engine through strict tenant isolation and specialized role-based command interfaces.

## 🎯 Institutional Value Proposition
Primary target: Modern private schools and educational groups requiring robust financial tracking (M-Pesa), elite security standards, and multi-tenant scalability across multiple regions or nodes.

## 🚀 Core Modules
- **System Control Plane:** Global platform oversight for Super Admins, institutional provisioning, and cross-tenant analytics.
- **Automated Finance:** Real-time M-Pesa STK reconciliation, bulk automated invoicing, and institutional expense tracking.
- **Security-First Onboarding:** Mandatory temporal password workflows and enforced security initialization for all staff and scholars.
- **Academic Hierarchy:** Modernized grade level and class stream organization with automated, downloadable academic transcripts.
- **Operational Matrix:** Professional terminals for Attendance, Examinations, Transport logistics, Hostel occupancy, and Library management.
- **Specialized Portals:** 15+ dedicated dashboards for every school tier, from Headteachers and Accountants to Nurses and Matrons.

## 🏗️ Technical Stack
- **Web:** Next.js 14 (App Router) • Tailwind CSS • Framer Motion.
- **Mobile:** Expo (React Native) for leadership and faculty dashboards.
- **Database:** PostgreSQL via Supabase with Prisma ORM.
- **Auth:** Custom JWT architecture with Edge-side Middleware guarding.
- **Real-time:** Pusher/WebSockets for instant institutional notifications.

## 🛠️ Local Setup

### 1. Installation
```bash
npm install
```

### 2. Database Synchronization
```bash
cd apps/web
npx prisma generate
npx prisma migrate deploy
npm run seed
```

### 3. Execution
```bash
npm run dev
```
*Note: If port 3000 is busy, the app will automatically increment (e.g., http://localhost:3001).*

## 🔐 Master Access & Security Flow

All new accounts use a **Temporal Password** system. You must update your password upon the first login.

| Authority | Email | Default Password |
| :--- | :--- | :--- |
| **System Super Admin** | `super@schoolos.com` | `password123` |
| **Institutional Admin** | `admin@schoolos.com` | `password123` |
| **Faculty (Teacher)** | `teacher@schoolos.com` | `password123` |

## 📂 Project Architecture
- `apps/web`: The primary Next.js ecosystem (API Routes, Dashboards, Landing Page).
- `apps/mobile`: React Native / Expo mobile application.
- `prisma`: The institutional schema and cross-tenant isolation rules.

---
© 2026 SchoolOS. Engineered for Educational Excellence.
