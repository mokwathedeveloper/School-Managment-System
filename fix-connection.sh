#!/bin/bash

echo "🔍 Supabase Connection String Helper"
echo "======================================"
echo ""
echo "Your project ref: ehnrbqooskikkclbropi"
echo ""
echo "Please go to: https://supabase.com/dashboard/project/ehnrbqooskikkclbropi/settings/database"
echo ""
echo "Then:"
echo "1. Find 'Connection string' section"
echo "2. Click 'Transaction' tab"
echo "3. Copy the FULL connection string"
echo ""
echo "Paste it here (or press Ctrl+C to cancel):"
read -r connection_string

if [ -z "$connection_string" ]; then
    echo "❌ No connection string provided"
    exit 1
fi

echo ""
echo "✅ Connection string received!"
echo ""
echo "Updating .env file..."

# Backup current .env
cp .env .env.backup

# Update DATABASE_URL
sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"${connection_string}?pgbouncer=true&connection_limit=1\"|" .env

# Extract direct URL components
direct_url=$(echo "$connection_string" | sed 's/@aws-0-[^.]*\.pooler\.supabase\.com:6543/@db.ehnrbqooskikkclbropi.supabase.co:5432/')
sed -i "s|^DIRECT_URL=.*|DIRECT_URL=\"${direct_url}\"|" .env

echo "✅ .env file updated!"
echo ""
echo "Testing connection..."
cd apps/api && node test-db-connection.js
