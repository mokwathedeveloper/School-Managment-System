#!/bin/bash

echo "🔍 Supabase Connection Diagnostic"
echo "=================================="
echo ""

# Check network connectivity
echo "1️⃣  Testing network connectivity to Supabase..."
if ping -c 2 aws-0-eu-west-1.pooler.supabase.com > /dev/null 2>&1; then
    echo "   ✅ Can reach Supabase pooler"
else
    echo "   ⚠️  Cannot ping Supabase pooler (this might be normal if ICMP is blocked)"
fi
echo ""

# Check if port is accessible
echo "2️⃣  Testing port 6543 connectivity..."
if timeout 5 bash -c "cat < /dev/null > /dev/tcp/aws-0-eu-west-1.pooler.supabase.com/6543" 2>/dev/null; then
    echo "   ✅ Port 6543 is accessible"
else
    echo "   ❌ Port 6543 is not accessible"
    echo "   This could mean:"
    echo "   - IP restrictions are enabled in Supabase"
    echo "   - Firewall is blocking the connection"
fi
echo ""

# Get current public IP
echo "3️⃣  Your current public IP address:"
curl -s https://api.ipify.org
echo ""
echo ""

echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/ehnrbqooskikkclbropi/settings/database"
echo ""
echo "2. Scroll to 'Connection Pooling' section"
echo ""
echo "3. Check 'Restrict connections to specific IP addresses'"
echo "   - If enabled, add your IP above to the allowlist"
echo "   - OR disable IP restrictions for development"
echo ""
echo "4. Verify your database password:"
echo "   - In Database Settings, you can reset the password"
echo "   - Make sure it matches: Johnosiemo@1"
echo ""
echo "5. Get the correct connection string:"
echo "   - Find 'Connection string' section"
echo "   - Click 'Transaction' tab"
echo "   - Copy the full string and run: ./fix-connection.sh"
echo ""
