# 🔍 Frontend-Backend Connection Checklist

## 📋 **Systematic Testing Plan**

### **Phase 1: Core Authentication & User Management**

#### ✅ **1. Login Component (`/login`)**

- [ ] **Backend Endpoint**: `POST /api/auth/login`
- [ ] **Test Cases**:
  - [ ] Valid credentials (admin@360.com / admin123)
  - [ ] Invalid credentials
  - [ ] Empty fields validation
  - [ ] Redirect to admin dashboard for admin users
  - [ ] Redirect to home for regular users
- [ ] **Issues Found**:
- [ ] **Status**:

#### ✅ **2. Register Component (`/register`)**

- [ ] **Backend Endpoint**: `POST /api/auth/register`
- [ ] **Test Cases**:
  - [ ] Valid registration data
  - [ ] Password confirmation mismatch
  - [ ] Email already exists
  - [ ] Username already exists
  - [ ] Password length validation
- [ ] **Issues Found**:
- [ ] **Status**:

### **Phase 2: Product Management**

#### ✅ **3. Shop Component (`/shop`)**

- [ ] **Backend Endpoints**:
  - [ ] `GET /api/products` (with pagination)
  - [ ] `GET /api/categories`
- [ ] **Test Cases**:
  - [ ] Load products successfully
  - [ ] Filter by category
  - [ ] Search functionality
  - [ ] Pagination
  - [ ] Product images display
- [ ] **Issues Found**:
- [ ] **Status**:

#### ✅ **4. Product Detail Component (`/product/:id`)**

- [ ] **Backend Endpoint**: `GET /api/products/:id`
- [ ] **Test Cases**:
  - [ ] Load product details
  - [ ] Display product images
  - [ ] Stock information
  - [ ] Add to cart functionality
- [ ] **Issues Found**:
- [ ] **Status**:

#### ✅ **5. Admin Product Management**

- [ ] **Backend Endpoints**:
  - [ ] `GET /api/products` (admin)
  - [ ] `POST /api/products` (create)
  - [ ] `PUT /api/products/:id` (update)
  - [ ] `DELETE /api/products/:id` (delete)
  - [ ] `POST /api/upload/image` (image upload)
- [ ] **Test Cases**:
  - [ ] View all products
  - [ ] Add new product
  - [ ] Upload product image
  - [ ] Edit product
  - [ ] Delete product
- [ ] **Issues Found**:
- [ ] **Status**:

### **Phase 3: Cart & Checkout**

#### ✅ **6. Cart Component (`/cart`)**

- [ ] **Backend Endpoints**:
  - [ ] Local storage (no backend calls)
- [ ] **Test Cases**:
  - [ ] Add items to cart
  - [ ] Update quantities
  - [ ] Remove items
  - [ ] Calculate totals
- [ ] **Issues Found**:
- [ ] **Status**:

#### ✅ **7. Checkout Component (`/checkout`)**

- [ ] **Backend Endpoints**:
  - [ ] `POST /api/orders` (create order)
- [ ] **Test Cases**:
  - [ ] Create order
  - [ ] Payment processing
  - [ ] Order confirmation
- [ ] **Issues Found**:
- [ ] **Status**:

### **Phase 4: Admin Dashboard**

#### ✅ **8. Admin Dashboard (`/admin`)**

- [ ] **Backend Endpoints**:
  - [ ] `GET /api/analytics/dashboard`
  - [ ] `GET /api/users`
  - [ ] `GET /api/orders`
  - [ ] `GET /api/videos`
- [ ] **Test Cases**:
  - [ ] Load dashboard stats
  - [ ] User management
  - [ ] Order management
  - [ ] Video management
- [ ] **Issues Found**:
- [ ] **Status**:

#### ✅ **9. Admin User Management**

- [ ] **Backend Endpoints**:
  - [ ] `GET /api/users`
  - [ ] `PUT /api/users/:id/role`
  - [ ] `PUT /api/users/:id/status`
  - [ ] `DELETE /api/users/:id`
- [ ] **Test Cases**:
  - [ ] View all users
  - [ ] Update user role
  - [ ] Toggle user status
  - [ ] Delete user
- [ ] **Issues Found**:
- [ ] **Status**:

#### ✅ **10. Admin Order Management**

- [ ] **Backend Endpoints**:
  - [ ] `GET /api/orders`
  - [ ] `PUT /api/orders/:id/status`
  - [ ] `GET /api/orders/stats`
- [ ] **Test Cases**:
  - [ ] View all orders
  - [ ] Update order status
  - [ ] View order statistics
- [ ] **Issues Found**:
- [ ] **Status**:

#### ✅ **11. Admin Video Management**

- [ ] **Backend Endpoints**:
  - [ ] `GET /api/videos`
  - [ ] `POST /api/videos`
  - [ ] `PUT /api/videos/:id`
  - [ ] `DELETE /api/videos/:id`
  - [ ] `POST /api/upload/video`
  - [ ] `POST /api/upload/image`
- [ ] **Test Cases**:
  - [ ] View all videos
  - [ ] Add new video
  - [ ] Upload video file
  - [ ] Upload thumbnail
  - [ ] Edit video
  - [ ] Delete video
- [ ] **Issues Found**:
- [ ] **Status**:

#### ✅ **12. Admin Analytics**

- [ ] **Backend Endpoints**:
  - [ ] `GET /api/analytics/dashboard`
  - [ ] `GET /api/analytics/export`
- [ ] **Test Cases**:
  - [ ] Load analytics data
  - [ ] Display charts and stats
  - [ ] Export analytics
- [ ] **Issues Found**:
- [ ] **Status**:

### **Phase 5: Category Pages**

#### ✅ **13. Category Components**

- [ ] **Backend Endpoints**:
  - [ ] `GET /api/categories`
  - [ ] `GET /api/products?categoryId=:id`
- [ ] **Test Cases**:
  - [ ] Load category products
  - [ ] Category filtering
- [ ] **Issues Found**:
- [ ] **Status**:

### **Phase 6: Additional Features**

#### ✅ **14. Cashout Clips (`/cashout-clips`)**

- [ ] **Backend Endpoints**:
  - [ ] `GET /api/videos?category=cashout`
- [ ] **Test Cases**:
  - [ ] Load cashout videos
  - [ ] Video playback
- [ ] **Issues Found**:
- [ ] **Status**:

#### ✅ **15. Blog Component (`/blog`)**

- [ ] **Backend Endpoints**:
  - [ ] `GET /api/blog`
- [ ] **Test Cases**:
  - [ ] Load blog posts
  - [ ] Display blog content
- [ ] **Issues Found**:
- [ ] **Status**:

## 🚨 **Common Issues to Check**

### **Authentication Issues**

- [ ] JWT token handling
- [ ] Token expiration
- [ ] Refresh token functionality
- [ ] Role-based access control

### **API Issues**

- [ ] CORS configuration
- [ ] HTTP status codes
- [ ] Error handling
- [ ] Loading states

### **Data Issues**

- [ ] Data type mismatches
- [ ] Missing required fields
- [ ] Validation errors
- [ ] Image/video uploads

### **UI Issues**

- [ ] Loading indicators
- [ ] Error messages
- [ ] Success notifications
- [ ] Form validation

## 📝 **Testing Instructions**

1. **Start Backend**: `cd backend && npm run start:dev`
2. **Start Frontend**: `cd frontend && ng serve`
3. **Access Test Page**: Navigate to `http://localhost:4200/test-connections`
4. **Manual Testing**: Go through each component systematically
5. **Document Issues**: Note any problems found

## 🔧 **Quick Fix Commands**

```bash
# Check backend health
curl http://localhost:3000/api/health

# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@360.com","password":"admin123"}'

# Test products endpoint
curl http://localhost:3000/api/products

# Test categories endpoint
curl http://localhost:3000/api/categories
```

## 📊 **Status Summary**

- **Total Components**: 15
- **Components Tested**: 0
- **Components Working**: 0
- **Components with Issues**: 0
- **Overall Status**: ⏳ Pending
