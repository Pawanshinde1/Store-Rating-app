# Store Rating Management System

A full-stack store rating management application with role-based access control (Admin, User, Store Owner), JWT authentication, and PostgreSQL database.

## Tech Stack

### Frontend
- React.js (Vite)
- React Router
- Axios
- Material UI
- React Hot Toast

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt (password hashing)
- Prisma ORM

### Database
- PostgreSQL

## Project Structure

```
Store rating app/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   │   └── 20240624000000_init/
│   │   │       └── migration.sql
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── user/
│   │   │   └── owner/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js v18+
- PostgreSQL v14+
- npm

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE store_rating_db;
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Run Prisma migrations and seed:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Start the backend server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The app will run at `http://localhost:5173`

## Scripts

### Backend
```bash
npm run dev          # Start dev server with watch
npm start            # Start production server
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## License

MIT
