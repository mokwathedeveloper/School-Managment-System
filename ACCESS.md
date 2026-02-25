# Application Access & Credentials

This document provides a quick reference for accessing the SchoolOS platform during development and testing.

## 🚀 Running the Platform

1. **Start Services:** From the root directory, run:
   ```bash
   npm run dev
   ```
2. **URLs:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **API:** [http://localhost:3001](http://localhost:3001)
   - **API Docs (Swagger):** [http://localhost:3001/api](http://localhost:3001/api) (if enabled)

## 🔑 Test Credentials

The database is pre-populated with these accounts after running `npx prisma db seed`:

### Institutional Roles
| Email | Password | Role |
| :--- | :--- | :--- |
| `admin@school.com` | `password123` | **School Administrator** |
| `parent@test.com` | `password123` | **Parent** |
| `student@test.com` | `password123` | **Student** |

## 🛠️ Important Commands

- **Reset & Re-seed Database:**
  ```bash
  cd apps/api
  npx prisma migrate reset --force
  npx prisma db seed
  ```
- **Open Database Viewer (Prisma Studio):**
  ```bash
  cd apps/api
  npx prisma studio
  ```
