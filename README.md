# User Management System

React Technical Challenge - Back-office user-management system with local MySQL database.

## Architecture

- **Frontend:** React + TypeScript + Vite + Material UI
- **Backend:** Node.js + Express
- **Database:** MySQL 8.0 (Docker)
- **Containerization:** Docker Compose

## Setup

1. **Install dependencies:**

```bash
pnpm install
cd backend && npm install && cd ..
```

2. **Configure environment variables:**

   - Copy `.env.sample` to `.env`: `cp .env.sample .env`
   - Edit `.env` if you need to change default values

3. **Start Docker containers (MySQL + Backend):**

```bash
docker compose up -d
```

4. **Run frontend development server:**

```bash
pnpm dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MySQL: localhost:3306

## Docker Commands

- **Start services:** `docker compose up -d`
- **Stop services:** `docker compose down`
- **View logs:** `docker compose logs -f`
- **Rebuild:** `docker compose up -d --build`

## Environment Variables

All configuration is in `.env` file. See `.env.sample` for template.

Default values:

- **Database Host:** localhost (or `mysql` from backend container)
- **Database Port:** 3306
- **Database Name:** user_management
- **Database User:** appuser
- **Database Password:** apppassword
- **Backend Port:** 3001

## Project Structure

```
test-app/
├── src/              # Frontend React app
├── backend/          # Node.js/Express backend
├── docker-compose.yml
└── package.json
```

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Material UI
- Node.js + Express
- MySQL 8.0
- Docker

## Testing

See [TESTING.md](./TESTING.md) for detailed testing instructions.
