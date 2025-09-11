#!/bin/bash

echo "🚀 Starting Shop Management System..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "📦 Starting MongoDB..."
    brew services start mongodb-community || echo "⚠️  Please start MongoDB manually"
fi

# Start backend
echo "🔧 Starting backend server on port 5001..."
cd backend
node server.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server on port 3000..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ System Status:"
echo "   Backend:  http://localhost:5001"
echo "   Frontend: http://localhost:3000"
echo "   MongoDB:  Running"
echo ""
echo "🎯 Ready to use! Open http://localhost:3000 in your browser"
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
