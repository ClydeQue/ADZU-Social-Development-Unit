#!/bin/bash

# Frontend-Backend Authentication Integration Test
# Tests complete flow from frontend to backend for both user types

echo "🧪 Testing Frontend-Backend Authentication Integration"
echo "=================================================="
echo

# Test 1: Office User Login
echo "📋 Test 1: Office User Login"
echo "----------------------------"
OFFICE_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login/office \
  -H "Content-Type: application/json" \
  -d '{"email": "sdo@adzu.edu.ph", "password": "sdo123"}')

echo "Response: $OFFICE_RESPONSE"
echo

# Extract access token for office user
OFFICE_TOKEN=$(echo $OFFICE_RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')

if [ ! -z "$OFFICE_TOKEN" ]; then
  echo "✅ Office login successful! JWT token received."
  echo "🔑 Token length: $(echo -n "$OFFICE_TOKEN" | wc -c) characters"
  
  # Test token verification
  echo
  echo "🔍 Testing Office Token Verification..."
  VERIFY_RESPONSE=$(curl -s -X GET http://localhost:5001/api/auth/verify \
    -H "Authorization: Bearer $OFFICE_TOKEN")
  echo "Verification Response: $VERIFY_RESPONSE"
else
  echo "❌ Office login failed!"
fi

echo
echo "=================================================="
echo

# Test 2: Unit Director Login
echo "📋 Test 2: Unit Director Login"
echo "------------------------------"
DIRECTOR_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login/unit-director \
  -H "Content-Type: application/json" \
  -d '{"email": "director@adzu.edu.ph", "password": "admin123"}')

echo "Response: $DIRECTOR_RESPONSE"
echo

# Extract access token for unit director
DIRECTOR_TOKEN=$(echo $DIRECTOR_RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')

if [ ! -z "$DIRECTOR_TOKEN" ]; then
  echo "✅ Unit Director login successful! JWT token received."
  echo "🔑 Token length: $(echo -n "$DIRECTOR_TOKEN" | wc -c) characters"
  
  # Test token verification
  echo
  echo "🔍 Testing Director Token Verification..."
  VERIFY_RESPONSE=$(curl -s -X GET http://localhost:5001/api/auth/verify \
    -H "Authorization: Bearer $DIRECTOR_TOKEN")
  echo "Verification Response: $VERIFY_RESPONSE"
else
  echo "❌ Unit Director login failed!"
fi

echo
echo "=================================================="
echo "🎯 Authentication Integration Test Complete!"
echo "=================================================="
