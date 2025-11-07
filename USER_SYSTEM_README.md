# User Authentication System - Implementation Guide

## Overview
A complete user authentication system has been implemented for your full-stack application with JWT-based authentication and role-based access control.

## Backend Implementation

### Files Created/Modified

1. **`server/models/User.js`** - User model with:
   - `name` (String, unique, required)
   - `password` (String, hashed with bcrypt, required)
   - `courses` (Array of ObjectIds referencing Subject collection)
   - `role` (String: "student", "teacher", or "admin", default: "student")
   - Automatic password hashing before save
   - Password comparison method
   - JSON serialization that excludes password

2. **`server/controllers/authController.js`** - Authentication controller with:
   - `login()` - Validates credentials and returns JWT token with user data
   - `getCurrentUser()` - Returns current authenticated user information

3. **`server/middleware/auth.js`** - JWT authentication middleware:
   - Verifies JWT tokens from Authorization header
   - Attaches user data to `req.user` for use in route handlers

4. **`server/middleware/role.js`** - Role-based access control:
   - `requireRole(roles)` - Middleware factory for role checking
   - `requireAdmin`, `requireTeacher`, `requireStudent` - Convenience middleware

5. **`server/routes/auth.js`** - Authentication routes:
   - `POST /auth/login` - Login endpoint
   - `GET /auth/me` - Get current user (protected)

6. **`server/server.js`** - Updated to include auth routes

### Dependencies Installed
- `jsonwebtoken` - For JWT token generation and verification
- `bcryptjs` - For password hashing

### API Endpoints

#### POST /auth/login
Login with username and password.

**Request:**
```json
{
  "name": "username",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "username",
    "role": "student",
    "courses": []
  }
}
```

#### GET /auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "username",
    "role": "student",
    "courses": []
  }
}
```

### Using Authentication Middleware

To protect a route, use the `authenticate` middleware:

```javascript
import { authenticate } from '../middleware/auth.js';

router.get('/protected', authenticate, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

### Using Role-Based Access Control

To restrict a route to specific roles:

```javascript
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

router.delete('/admin-only', authenticate, requireAdmin, (req, res) => {
  // Only admins can access this
});
```

Or use the flexible `requireRole`:

```javascript
import { requireRole } from '../middleware/role.js';

router.post('/teacher-or-admin', authenticate, requireRole(['teacher', 'admin']), (req, res) => {
  // Teachers and admins can access
});
```

## Frontend Implementation

### Files Created/Modified

1. **`client/src/contexts/UserContext.jsx`** - User context provider:
   - Manages user authentication state
   - Handles JWT token storage in localStorage
   - Decodes JWT to extract user data
   - Provides `login()`, `logout()`, `isAuthenticated()`, `hasRole()`, etc.

2. **`client/src/components/Login/Login.jsx`** - Login page component:
   - Beautiful, modern UI matching your app's design
   - Form validation
   - Error handling
   - Redirects to intended page after login

3. **`client/src/components/ProtectedRoute/ProtectedRoute.jsx`** - Route protection:
   - Wraps routes that require authentication
   - Optional role-based access control
   - Redirects to login if not authenticated
   - Shows loading state while checking auth

4. **`client/src/api/api.js`** - Updated with:
   - Auth API endpoints (`login`, `getCurrentUser`)
   - Axios interceptors to automatically include JWT token in requests

5. **`client/src/App.jsx`** - Updated with:
   - Login route
   - Protected routes (e.g., AddNewSubject)
   - User info and logout button in navigation

6. **`client/src/main.jsx`** - Updated to include UserProvider

### Using UserContext

```javascript
import { useUser } from '../contexts/UserContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated, hasRole } = useUser();

  if (isAuthenticated()) {
    return <div>Welcome, {user.name}!</div>;
  }

  return <div>Please log in</div>;
}
```

### Protecting Routes

```javascript
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

<Route 
  path="/admin" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminPanel />
    </ProtectedRoute>
  } 
/>
```

## Creating Users

Since there's no registration endpoint, users must be created manually. You can do this via:

1. **MongoDB directly:**
```javascript
// In MongoDB shell or Compass
db.users.insertOne({
  name: "testuser",
  password: "$2a$12$...", // Hashed password (use bcrypt)
  role: "student",
  courses: []
})
```

2. **Create a script** (optional):
```javascript
// server/scripts/createUser.js
import User from '../models/User.js';
import mongoose from 'mongoose';

const user = new User({
  name: 'admin',
  password: 'admin123', // Will be hashed automatically
  role: 'admin',
  courses: []
});

await user.save();
```

## Environment Variables

Make sure your `.env` file includes:
```
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
```

## Testing the System

1. **Start the backend:**
```bash
cd server
npm run dev
```

2. **Start the frontend:**
```bash
cd client
npm run dev
```

3. **Create a test user** (see "Creating Users" above)

4. **Test login:**
   - Navigate to `/login`
   - Enter credentials
   - Should redirect and show user info in nav

5. **Test protected routes:**
   - Try accessing `/AddNewSubject` without logging in
   - Should redirect to login
   - After login, should access successfully

## Notes

- JWT tokens are stored in `localStorage` on the frontend
- Tokens include all user data except password
- Tokens expire after 24 hours (configurable in config.js)
- Password hashing uses bcrypt with 12 rounds (configurable)
- The `courses` field in User model references the `Subject` collection. If you create a separate `Course` model, update the reference in `User.js`

## Security Features

- Passwords are hashed with bcrypt before storage
- JWT tokens are signed and verified
- CORS is configured for your frontend origins
- Rate limiting is applied to all routes
- Helmet security headers are enabled
- Password is excluded from JSON responses
- Token validation on protected routes

