#!/bin/bash

# API Integration Test Script
echo "🚀 Starting API Integration Tests..."

# Test 1: Backend Health
echo "
1️⃣ Testing Backend Health..."
curl -s http://localhost:5001/api/secure-auth/health | jq .

# Test 2: Office Users List  
echo "
2️⃣ Testing Office Users in Database..."
curl -s http://localhost:5001/api/debug/office-users | jq .

# Test 3: Unit Directors List
echo "
3️⃣ Testing Unit Directors in Database..."  
curl -s http://localhost:5001/api/debug/unit-directors | jq .

# Test 4: Password Verification
echo "
4️⃣ Testing Password Verification..."
echo "Office User Password Check:"
curl -s -X POST http://localhost:5001/api/debug/check-password \
  -H "Content-Type: application/json" \
  -d '{"email":"sdo@adzu.edu.ph","password":"sdo123","userType":"office_user"}' | jq .

echo "
Unit Director Password Check:"
curl -s -X POST http://localhost:5001/api/debug/check-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@adzu.edu.ph","password":"admin123","userType":"unit_director"}' | jq .

# Test 5: Authentication Flow
echo "
5️⃣ Testing Authentication Flow..."
echo "Office Login:"
OFFICE_RESPONSE=$(curl -s -X POST http://localhost:5001/api/secure-auth/login/office \
  -H "Content-Type: application/json" \
  -d '{"email":"sdo@adzu.edu.ph","password":"sdo123"}')

echo $OFFICE_RESPONSE | jq .

# Check if login was successful and extract token
if echo $OFFICE_RESPONSE | jq -e '.success' > /dev/null; then
    TOKEN=$(echo $OFFICE_RESPONSE | jq -r '.accessToken')
    echo "
6️⃣ Testing Authenticated Endpoints with Token..."
    
    echo "Profile Test:"
    curl -s -H "Authorization: Bearer $TOKEN" \
      http://localhost:5001/api/secure-auth/profile | jq .
    
    echo "
Office Programs Test:"
    curl -s -H "Authorization: Bearer $TOKEN" \
      http://localhost:5001/api/office/1/programs | jq .
else
    echo "❌ Login failed, skipping authenticated tests"
fi

echo "
🏁 API Integration Tests Complete!"
