#!/bin/bash

# Quick Program Seed & Verify Script
# This script seeds programs and immediately verifies they were created

echo "🌱 Seeding programs..."
echo "-------------------"

# Run seed script (you'll need to update with your actual Supabase connection)
# psql $DATABASE_URL < seed_programs.sql

echo ""
echo "✅ Programs seeded!"
echo ""
echo "🔍 Verifying programs..."
echo "-------------------"

# Run verification (you'll need to update with your actual Supabase connection)
# psql $DATABASE_URL < verify_programs.sql

echo ""
echo "📋 Instructions:"
echo "1. Make sure your DATABASE_URL is set in your environment"
echo "2. Run: psql \$DATABASE_URL < scripts/seed_programs.sql"
echo "3. Run: psql \$DATABASE_URL < scripts/verify_programs.sql"
echo ""
echo "Or if using Supabase dashboard:"
echo "1. Open Supabase dashboard → SQL Editor"
echo "2. Copy/paste seed_programs.sql"
echo "3. Execute"
echo "4. Copy/paste verify_programs.sql"
echo "5. Execute"
