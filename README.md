# User Management System

React Technical Challenge - Back-office user-management system with local MySQL database.

## 🎯 Features

- **Authentication**: Sign up, sign in, and session management
- **User Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Pagination**: Navigate through users with 6 users per page
- **Theme Customization**: Dark and light mode support
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation support
- **Testing**: Complete Cypress E2E test coverage

## 🏗️ Architecture

- **Frontend:** React 18 + TypeScript + Vite + Material UI
- **Backend:** Node.js + Express
- **Database:** MySQL 8.0 (Docker)
- **Containerization:** Docker Compose
- **Testing:** Cypress E2E

## 📋 Prerequisites

- Node.js 18+ and pnpm 8+
- Docker and Docker Compose
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd test-app
pnpm install
cd backend && npm install && cd ..
```

### 2. Configure Environment

Copy the sample environment file:

```bash
cp .env.sample .env
```

Edit `.env` if you need to change default values (optional).

### 3. Start Services

Start Docker containers (MySQL + Backend):

```bash
docker compose up -d
```

Wait for services to be healthy (check with `docker compose ps`).

### 4. Seed Database (Optional)

Populate the database with 50 test users:

```bash
docker compose exec backend npm run seed
```

All seeded users have password: `password123`

### 5. Start Frontend

In a separate terminal:

```bash
pnpm dev
```

The application will be available at:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **MySQL:** localhost:3306

## 📚 Project Structure

```
test-app/
├── src/                    # Frontend React app
│   ├── components/         # Reusable components
│   │   ├── ErrorBoundary.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── PublicRoute.tsx
│   │   └── UserDialog.tsx
│   ├── context/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/             # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── SignInPage.tsx
│   │   └── SignUpPage.tsx
│   ├── services/          # API services
│   │   ├── api.ts
│   │   ├── authApi.ts
│   │   └── usersApi.ts
│   ├── types/             # TypeScript types
│   └── styles/            # Global styles
├── backend/               # Node.js/Express backend
│   ├── server.js          # Express server
│   └── seed.js           # Database seeder
├── cypress/              # E2E tests
│   ├── e2e/
│   └── support/
├── docker-compose.yml
└── package.json
```

## 🧪 Testing

### Running Cypress Tests

**Prerequisites:**
1. Docker containers must be running: `docker compose up -d`
2. Frontend dev server must be running: `pnpm dev` (in separate terminal)

**Run tests:**

```bash
# Interactive mode (recommended for development)
pnpm cypress:open

# Headless mode (for CI/CD)
pnpm cypress:run
# or
pnpm test
```

**Test Files:**
- `cypress/e2e/01-auth.cy.ts` - Authentication flows (13 tests)
- `cypress/e2e/02-dashboard.cy.ts` - User management (17 tests)
- `cypress/e2e/03-theme.cy.ts` - Theme customization (9 tests)

**Total:** 39 E2E tests

See [TESTING.md](./TESTING.md) for detailed manual testing instructions.

## 🐳 Docker Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f [service-name]

# Rebuild containers
docker compose up -d --build

# Check service status
docker compose ps

# Execute command in backend container
docker compose exec backend npm run seed
```

## 🔧 Environment Variables

All configuration is in `.env` file. See `.env.sample` for template.

**Default values:**
- `DB_HOST=mysql` (or `localhost` from host)
- `DB_PORT=3306`
- `DB_NAME=user_management`
- `DB_USER=appuser`
- `DB_PASSWORD=apppassword`
- `BACKEND_PORT=3001`

## 🔌 API Endpoints

### Authentication

- `POST /api/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```

- `POST /api/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Users

- `GET /api/users?page=1` - Get users with pagination
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🎨 Features in Detail

### Authentication
- Email/password registration and login
- Session persistence in localStorage
- Protected routes (redirects to sign-in if not authenticated)
- Public routes (redirects authenticated users to dashboard)

### User Management
- View all users in a paginated table (6 per page)
- Create new users with email, first name, and last name
- Edit existing users
- Delete users (prevents self-deletion)
- Current user highlighted in the list
- Avatar with user initials

### Theme Customization
- Toggle between dark and light mode
- Theme preference saved in localStorage
- Applies to all Material UI components

### Error Handling
- Error boundary catches React errors
- User-friendly error messages
- Network error handling
- Form validation errors

### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- Semantic HTML

## 🛠️ Development

### Available Scripts

```bash
# Frontend
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Testing
pnpm cypress:open # Open Cypress test runner
pnpm cypress:run  # Run Cypress tests headlessly
pnpm test         # Alias for cypress:run

# Backend (in backend/ directory)
npm run seed      # Seed database with test users
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Material UI for components
- Functional components with hooks

## 🐛 Troubleshooting

### "Failed to fetch" or connection errors

- Ensure Docker services are running: `docker compose ps`
- Check backend logs: `docker compose logs backend`
- Verify backend is accessible at `http://localhost:3001`
- Restart services: `docker compose restart`

### Database connection errors

- Wait for MySQL to be healthy: `docker compose ps`
- Check MySQL logs: `docker compose logs mysql`
- Verify environment variables in `.env`

### Backend not starting

- Rebuild containers: `docker compose up -d --build`
- Check if port 3001 is already in use
- Review backend logs: `docker compose logs backend`

### Tests failing

- Ensure Docker containers are running
- Ensure frontend dev server is running (`pnpm dev`)
- Check that backend is accessible
- Verify database is seeded (optional but recommended)

## 📝 License

This project is part of a technical challenge.

## 👤 Author

Created as part of a React technical challenge submission.

---

**Note:** This is a demonstration project. In production, you should:
- Use proper password hashing (bcrypt, argon2)
- Implement JWT tokens for authentication
- Add rate limiting
- Use environment-specific configurations
- Add comprehensive logging
- Implement proper error tracking
