#!/bin/bash

echo "🔍 Frontend-Backend Connection Test"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test backend health
echo -e "\n${YELLOW}Testing Backend Health...${NC}"
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is not accessible${NC}"
    echo "Please start the backend server: cd backend && npm run start:dev"
    exit 1
fi

# Test authentication endpoint
echo -e "\n${YELLOW}Testing Authentication Endpoint...${NC}"
AUTH_RESPONSE=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@360.com","password":"admin123"}')

HTTP_CODE="${AUTH_RESPONSE: -3}"
RESPONSE_BODY="${AUTH_RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Authentication endpoint working${NC}"
    echo "Response: $RESPONSE_BODY"
elif [ "$HTTP_CODE" = "401" ]; then
    echo -e "${YELLOW}⚠️  Authentication endpoint accessible (expected 401 for invalid credentials)${NC}"
else
    echo -e "${RED}❌ Authentication endpoint not working (HTTP $HTTP_CODE)${NC}"
fi

# Test products endpoint
echo -e "\n${YELLOW}Testing Products Endpoint...${NC}"
PRODUCTS_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/api/products)

HTTP_CODE="${PRODUCTS_RESPONSE: -3}"
RESPONSE_BODY="${PRODUCTS_RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Products endpoint working${NC}"
    echo "Products found: $(echo $RESPONSE_BODY | jq '.products | length' 2>/dev/null || echo 'unknown')"
else
    echo -e "${RED}❌ Products endpoint not working (HTTP $HTTP_CODE)${NC}"
fi

# Test categories endpoint
echo -e "\n${YELLOW}Testing Categories Endpoint...${NC}"
CATEGORIES_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/api/categories)

HTTP_CODE="${CATEGORIES_RESPONSE: -3}"
RESPONSE_BODY="${CATEGORIES_RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Categories endpoint working${NC}"
    echo "Categories found: $(echo $RESPONSE_BODY | jq '.categories | length' 2>/dev/null || echo 'unknown')"
else
    echo -e "${RED}❌ Categories endpoint not working (HTTP $HTTP_CODE)${NC}"
fi

# Test orders endpoint (should require auth)
echo -e "\n${YELLOW}Testing Orders Endpoint (should require auth)...${NC}"
ORDERS_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/api/orders)

HTTP_CODE="${ORDERS_RESPONSE: -3}"

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Orders endpoint properly protected (HTTP 401)${NC}"
else
    echo -e "${YELLOW}⚠️  Orders endpoint returned HTTP $HTTP_CODE${NC}"
fi

# Test users endpoint (should require admin auth)
echo -e "\n${YELLOW}Testing Users Endpoint (should require admin auth)...${NC}"
USERS_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/api/users)

HTTP_CODE="${USERS_RESPONSE: -3}"

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Users endpoint properly protected (HTTP 401)${NC}"
else
    echo -e "${YELLOW}⚠️  Users endpoint returned HTTP $HTTP_CODE${NC}"
fi

# Test videos endpoint (should require auth)
echo -e "\n${YELLOW}Testing Videos Endpoint (should require auth)...${NC}"
VIDEOS_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/api/videos)

HTTP_CODE="${VIDEOS_RESPONSE: -3}"

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Videos endpoint properly protected (HTTP 401)${NC}"
else
    echo -e "${YELLOW}⚠️  Videos endpoint returned HTTP $HTTP_CODE${NC}"
fi

# Test analytics endpoint (should require admin auth)
echo -e "\n${YELLOW}Testing Analytics Endpoint (should require admin auth)...${NC}"
ANALYTICS_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/api/analytics/dashboard)

HTTP_CODE="${ANALYTICS_RESPONSE: -3}"

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Analytics endpoint properly protected (HTTP 401)${NC}"
else
    echo -e "${YELLOW}⚠️  Analytics endpoint returned HTTP $HTTP_CODE${NC}"
fi

echo -e "\n${GREEN}🎉 Backend connectivity test completed!${NC}"
echo -e "\nNext steps:"
echo "1. Start frontend: cd frontend && ng serve"
echo "2. Navigate to: http://localhost:4200/test-connections"
echo "3. Test each component manually using the checklist" 