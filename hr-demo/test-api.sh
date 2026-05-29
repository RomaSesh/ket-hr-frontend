#!/bin/bash

echo "=== Testing HR API ==="

# 1. Health check
echo -e "\n1. Health check:"
curl -s http://localhost:3000/health | jq .

# 2. Login
echo -e "\n2. Login test:"
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq .

# 3. Get all employees
echo -e "\n3. Get employees:"
curl -s -X GET http://localhost:3000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" | jq .

echo -e "\n=== Test Complete ==="