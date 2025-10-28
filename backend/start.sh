#!/bin/bash

# Railway start script
echo "🚀 Starting 360-Web Backend..."

# Run database migrations
echo "📊 Running database migrations..."
npm run db:migrate:deploy

# Seed the database
echo "🌱 Seeding database..."
npm run db:seed:simple

# Start the application
echo "🎯 Starting NestJS application..."
node dist/src/main
