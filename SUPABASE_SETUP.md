# Supabase Connection Setup Guide

## Current Configuration

Your `.env` file is now configured with:
- **Pooled Connection (DATABASE_URL)**: For application queries via port 6543
- **Direct Connection (DIRECT_URL)**: For Prisma migrations via port 5432

## Steps to Fix Connection Issues

### 1. Verify Supabase Settings

Go to [Supabase Database Settings](https://supabase.com/dashboard/project/ehnrbqooskikkclbropi/settings/database)

#### Check IP Restrictions:
- Scroll to "Connection Pooling" section
- Ensure "Restrict connections to specific IP addresses" is either:
  - **Disabled** (allows all IPs), OR
  - **Enabled** with your current IP added

#### Get the Correct Connection String:
1. In Database Settings, find "Connection string"
2. Select the **"Transaction"** tab (not Session mode)
3. Copy the connection string - it should look like:
   ```
   postgresql://postgres.ehnrbqooskikkclbropi:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual password

### 2. Update Password (If Needed)

If you're unsure about your password:
1. Go to [Database Settings](https://supabase.com/dashboard/project/ehnrbqooskikkclbropi/settings/database)
2. Click "Reset database password"
3. Copy the new password
4. Update `.env` file with URL-encoded password (replace `@` with `%40`)

### 3. Test Connection

```bash
# Navigate to API directory
cd apps/api

# Generate Prisma Client
npx prisma generate

# Test database connection
node test-db-connection.js

# Run migrations
npx prisma migrate dev --name init
```

### 4. Common Issues & Solutions

#### Issue: "Connection refused" or "timeout"
**Solution**: 
- Check IP restrictions in Supabase dashboard
- Ensure you're using the pooled connection string (port 6543)
- Verify your internet connection

#### Issue: "Authentication failed"
**Solution**:
- Reset password in Supabase dashboard
- Ensure password is URL-encoded in connection string
- Special characters need encoding: `@` → `%40`, `#` → `%23`, etc.

#### Issue: IPv6 connection problems
**Solution**:
- Use the pooled connection (already configured)
- The pooler handles IPv4/IPv6 compatibility

#### Issue: "Too many connections"
**Solution**:
- Use `DATABASE_URL` with `?pgbouncer=true&connection_limit=1`
- This is already configured in your `.env`

### 5. Verify Setup

After fixing connection issues, verify everything works:

```bash
# 1. Test connection
cd apps/api
node test-db-connection.js

# 2. Generate Prisma Client
npx prisma generate

# 3. Run migrations
npx prisma migrate dev

# 4. Seed database (optional)
npm run seed

# 5. Start the API
npm run dev
```

## Connection String Format

### For DATABASE_URL (Application):
```
postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### For DIRECT_URL (Migrations):
```
postgresql://postgres.PROJECT_REF:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
```

## Next Steps

Once connected:
1. ✅ Run `npx prisma migrate dev` to create tables
2. ✅ Run `npm run seed` to populate initial data
3. ✅ Start development: `npm run dev` from root directory
4. ✅ Access API at http://localhost:3001
5. ✅ Access Web at http://localhost:3000

## Need Help?

If you're still having issues:
1. Share the exact error message you're seeing
2. Confirm you've checked IP restrictions in Supabase
3. Verify you're using the Transaction mode connection string
