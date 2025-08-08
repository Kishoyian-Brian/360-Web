# REST Client API Testing

This folder contains HTTP files for testing the 360-Web Backend API endpoints.

## 📁 Files

- `user-api.http` - Complete user management API tests
- `http-client.env.json` - Environment variables for tokens and IDs

## 🚀 How to Use

### Prerequisites

1. **VS Code Extension**: Install "REST Client" extension by Huachao Mao
2. **Backend Running**: Ensure your NestJS backend is running on `http://localhost:3000`
3. **Database**: Make sure PostgreSQL is running and database exists

### Setup Instructions

#### 1. Start the Backend

```bash
cd backend
npm run start:dev
```

#### 2. Create Admin User (First Time Only)

You need to create an admin user first. You can either:

**Option A: Use Prisma Studio**

```bash
npx prisma studio
```

Then manually create a user with role "ADMIN"

**Option B: Use the register endpoint**

- Open `user-api.http`
- Find the register endpoint
- Send the request to create an admin user

#### 3. Get Authentication Tokens

1. Open `user-api.http` in VS Code
2. Find the login endpoints
3. Send the login requests to get JWT tokens
4. Copy the tokens from the response
5. Update `http-client.env.json` with the tokens

#### 4. Update Environment Variables

Edit `http-client.env.json` and add your tokens:

```json
{
  "development": {
    "userToken": "your_jwt_token_here",
    "adminToken": "your_admin_jwt_token_here",
    "userId": "user_id_from_response",
    "adminId": "admin_id_from_response"
  }
}
```

## 🧪 Testing Workflow

### 1. Authentication Tests

- Register new users
- Login to get tokens
- Test token refresh
- Test logout

### 2. User Management Tests (Admin Only)

- Create users
- Get all users with filtering
- Update users
- Delete users

### 3. Profile Management Tests

- Get own profile
- Update own profile
- Change password

### 4. Password Reset Tests

- Request password reset
- Reset password with token

### 5. Error Testing

- Test duplicate usernames/emails
- Test invalid passwords
- Test unauthorized access

## 📋 Test Scenarios

### Scenario 1: Complete User Lifecycle

1. Register a new user
2. Login to get token
3. Update profile
4. Change password
5. Test admin operations (if admin)

### Scenario 2: Admin Operations

1. Login as admin
2. Create multiple users
3. List users with filters
4. Update user details
5. Delete users

### Scenario 3: Error Handling

1. Try to create duplicate users
2. Try invalid passwords
3. Try unauthorized operations
4. Test invalid tokens

## 🔧 Environment Variables

The `http-client.env.json` file stores:

- `baseUrl`: API base URL
- `userToken`: JWT token for regular user
- `adminToken`: JWT token for admin user
- `refreshToken`: Refresh token for token renewal
- `userId`: ID of test user
- `adminId`: ID of admin user

## 📝 Notes

- **Authentication**: Most endpoints require JWT tokens in the Authorization header
- **Admin Access**: User management endpoints require admin role
- **Error Responses**: Check response status codes and error messages
- **Token Expiry**: JWT tokens expire after 7 days (configurable)
- **Database**: All operations affect the actual database

## 🐛 Troubleshooting

### Common Issues:

1. **401 Unauthorized**
   - Check if token is valid
   - Ensure token is in Authorization header
   - Verify token hasn't expired

2. **403 Forbidden**
   - Check if user has required role (ADMIN for user management)
   - Verify user is active

3. **404 Not Found**
   - Check if user ID exists
   - Verify endpoint URL is correct

4. **409 Conflict**
   - Username or email already exists
   - Try different username/email

5. **500 Internal Server Error**
   - Check backend logs
   - Verify database connection
   - Check if all required fields are provided

## 📊 Expected Response Examples

### Successful User Creation

```json
{
  "id": "clx1234567890abcdef",
  "username": "testuser",
  "email": "testuser@example.com",
  "role": "USER",
  "isActive": true,
  "firstName": "Test",
  "lastName": "User",
  "phone": "+1234567890",
  "country": "USA",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Successful Login

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx1234567890abcdef",
    "username": "testuser",
    "email": "testuser@example.com",
    "role": "USER"
  }
}
```

### Error Response

```json
{
  "statusCode": 409,
  "message": "Username or email already exists",
  "error": "Conflict"
}
```
