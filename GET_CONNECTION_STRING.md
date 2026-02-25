# 🔧 Quick Fix: Get Your Supabase Connection String

## ⚠️ Current Issue
You're getting "Tenant or user not found" error. This means the connection string format needs to be verified.

## ✅ Solution: Get the Correct Connection String from Supabase

### Step 1: Go to Supabase Dashboard
Visit: https://supabase.com/dashboard/project/ehnrbqooskikkclbropi/settings/database

### Step 2: Get Connection Pooling String
1. Scroll to **"Connection string"** section
2. Click on **"Transaction"** tab (NOT Session mode)
3. You'll see a string like this:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

### Step 3: Copy and Provide the String
**Please copy the EXACT connection string from the Transaction tab and provide it to me.**

The format should be:
```
postgresql://postgres.ehnrbqooskikkclbropi:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

### Step 4: Check IP Restrictions
While you're in the Database Settings:
1. Scroll to **"Connection Pooling"** section
2. Look for **"Restrict connections to specific IP addresses"**
3. Either:
   - ✅ **Disable** this restriction (recommended for development)
   - ✅ **Add your current IP** to the allowlist

### Step 5: Verify Password
If you're unsure about your password:
1. In Database Settings, find **"Database password"**
2. Click **"Reset database password"**
3. Copy the new password
4. Use it in the connection string (remember to URL-encode special characters)

## 🔐 Password Encoding
If your password contains special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

Example:
- Password: `MyPass@123#`
- Encoded: `MyPass%40123%23`

## 📋 What I Need From You

Please provide:
1. ✅ The **Transaction mode** connection string from Supabase
2. ✅ Confirm you've checked/disabled IP restrictions
3. ✅ Your actual password (I'll help encode it properly)

Once you provide these, I'll update your `.env` file with the correct configuration!

## 🧪 After Updating

Once we have the correct connection string, we'll test it:
```bash
cd apps/api
node test-db-connection.js
```

If successful, you'll see:
```
✅ Successfully connected to Supabase!
📊 Database info: [connection details]
```
