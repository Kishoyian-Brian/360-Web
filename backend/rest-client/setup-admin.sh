#!/bin/bash

# Setup Admin User for Testing
# This script helps create an admin user for API testing

echo "🔧 Setting up Admin User for API Testing"
echo "========================================"

# Check if backend is running
if ! curl -s http://localhost:3000/api > /dev/null; then
    echo "❌ Backend is not running on http://localhost:3000"
    echo "Please start the backend first: npm run start:dev"
    exit 1
fi

echo "✅ Backend is running"

# Create admin user
echo "📝 Creating admin user..."

ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@360web.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }')

echo "Response: $ADMIN_RESPONSE"

# Login to get token
echo "🔑 Logging in to get admin token..."

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')

echo "Login Response: $LOGIN_RESPONSE"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo "Admin credentials:"
echo "Username: admin"
echo "Password: admin123"
echo "Email: admin@360web.com"
echo ""
echo "Use these credentials to test admin endpoints in the HTTP files."
echo "Copy the access_token from the login response to use in your tests." 