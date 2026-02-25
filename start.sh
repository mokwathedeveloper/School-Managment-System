#!/bin/bash

echo "🚀 Starting School Management System..."
echo ""

# Start API
cd apps/api
npm run dev > /tmp/api.log 2>&1 &
API_PID=$!
echo "✅ Backend starting on http://localhost:3001 (PID: $API_PID)"

# Start Web
cd ../web
npm run dev > /tmp/web.log 2>&1 &
WEB_PID=$!
echo "✅ Frontend starting on http://localhost:3000 (PID: $WEB_PID)"

echo ""
echo "📊 Logs:"
echo "   API: tail -f /tmp/api.log"
echo "   Web: tail -f /tmp/web.log"
echo ""
echo "🛑 To stop: kill $API_PID $WEB_PID"
