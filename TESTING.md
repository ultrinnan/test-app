# Testing Guide - Part 1

## Quick Start

1. **Install dependencies:**

   ```bash
   pnpm install
   cd backend && npm install && cd ..
   ```

2. **Start Docker services (MySQL + Backend):**

   ```bash
   docker compose up -d
   ```

3. **Start frontend development server:**

   ```bash
   pnpm dev
   ```

4. **Open browser:**
   - The app should automatically open at `http://localhost:3000`
   - If not, navigate to that URL manually

## Test Credentials

You can use any email and password to register. The database is local and will store your users.

### For Registration:

- **Email:** Any valid email (e.g., `test@example.com`)
- **Password:** Any password (minimum 6 characters for validation)

### For Login:

- **Email:** Use an email you've registered
- **Password:** The password you used during registration

## Testing Scenarios

### 1. Test Sign Up Flow

**Steps:**

1. Navigate to `http://localhost:3000` (should redirect to `/signin`)
2. Click "Sign Up" link
3. Fill in the form:
   - Email: `test@example.com` (any email works)
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Sign Up" button
5. **Expected:** Should redirect to `/welcome` page showing "Hello {first_name}!"

**Test Password Validation:**

- Try entering different passwords in "Password" and "Confirm Password" fields
- **Expected:** Error message "Passwords do not match" should appear
- Try password shorter than 6 characters
- **Expected:** Error message "Password must be at least 6 characters long"

### 2. Test Sign In Flow

**Steps:**

1. If you're logged in, click "Logout" first
2. Navigate to `/signin` page
3. Fill in the form:
   - Email: Use an email you registered (e.g., `test@example.com`)
   - Password: The password you used during registration
4. Click "Sign In" button
5. **Expected:** Should redirect to `/welcome` page showing "Hello {first_name}!"

**Test Error Handling:**

- Try invalid credentials (wrong email or password)
- **Expected:** Error message "Invalid credentials" should be displayed

### 3. Test Session Persistence

**Steps:**

1. Sign in or sign up successfully
2. You should see the Welcome page
3. Refresh the browser (F5 or Cmd+R)
4. **Expected:** You should still be logged in and see the Welcome page (session persisted in localStorage)

### 4. Test Protected Routes

**Steps:**

1. Make sure you're logged out
2. Try to navigate directly to `http://localhost:3000/welcome`
3. **Expected:** Should redirect to `/signin` page

**Steps (when logged in):**

1. Make sure you're logged in
2. Try to navigate to `http://localhost:3000/signin` or `/signup`
3. **Expected:** Should redirect to `/welcome` page (authenticated users can't access sign-in/sign-up pages)

### 5. Test Navigation Between Pages

**Steps:**

1. On Sign In page, click "Sign Up" link
2. **Expected:** Should navigate to Sign Up page
3. On Sign Up page, click "Sign In" link
4. **Expected:** Should navigate to Sign In page

### 6. Test Logout

**Steps:**

1. Sign in successfully
2. Click "Logout" button on Welcome page
3. **Expected:** Should redirect to `/signin` page
4. Try to navigate to `/welcome` again
5. **Expected:** Should redirect back to `/signin` (session cleared)

## Browser DevTools Testing

### Check localStorage:

1. Open Browser DevTools (F12)
2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Click on "Local Storage" → `http://localhost:3000`
4. **Expected:** You should see:
   - `auth_user`: JSON string with user data

### Check Network Requests:

1. Open Browser DevTools (F12)
2. Go to "Network" tab
3. Perform sign in/sign up
4. **Expected:** You should see API calls to:
   - `POST http://localhost:3001/api/login` or `/api/register`
   - `GET http://localhost:3001/api/users` (for dashboard)

## Common Issues

### Issue: "Failed to fetch" or connection errors

- **Solution:** Make sure Docker services are running: `docker compose ps`
- **Solution:** Check backend logs: `docker compose logs backend`
- **Solution:** Ensure backend is accessible at `http://localhost:3001`

### Issue: Database connection errors

- **Solution:** Wait for MySQL to be healthy: `docker compose ps` (should show "healthy")
- **Solution:** Check MySQL logs: `docker compose logs mysql`

### Issue: Backend not starting

- **Solution:** Rebuild containers: `docker compose up -d --build`
- **Solution:** Check if port 3001 is already in use

## Manual Test Checklist

- [ ] Sign Up with matching passwords works
- [ ] Sign Up with non-matching passwords shows error
- [ ] Sign Up with short password shows error
- [ ] Sign In works with valid credentials
- [ ] Sign In with invalid credentials shows error
- [ ] Navigation between Sign In and Sign Up pages works
- [ ] Session persists after page refresh
- [ ] Protected route redirects unauthenticated users
- [ ] Authenticated users are redirected from sign-in/sign-up pages
- [ ] Logout clears session and redirects
- [ ] Welcome page displays correct user first name
- [ ] Error messages are displayed appropriately
- [ ] Loading states work during API calls
