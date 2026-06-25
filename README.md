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

Copy environment file and update values:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/store_rating_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
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

Copy environment file:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

The app will run at `http://localhost:5173`

## Default Seed Credentials

| Role        | Email                    | Password   |
|-------------|--------------------------|------------|
| Admin       | admin@storerating.com    | Admin@123  |
| Store Owner | owner@storerating.com    | Owner@123  |
| User        | user@storerating.com     | User@1234  |

## API Endpoints

### Authentication
| Method | Endpoint                  | Access        | Description           |
|--------|---------------------------|---------------|-----------------------|
| POST   | /api/auth/register        | Public        | Register normal user  |
| POST   | /api/auth/login           | Public        | Login                 |
| POST   | /api/auth/logout          | Authenticated | Logout                |
| GET    | /api/auth/profile         | Authenticated | Get profile           |
| PUT    | /api/auth/change-password | Authenticated | Change password       |

### Users (Admin only)
| Method | Endpoint          | Description                    |
|--------|-------------------|--------------------------------|
| POST   | /api/users        | Create user/admin/store owner  |
| GET    | /api/users        | List users (search, filter, sort, paginate) |
| GET    | /api/users/:id    | Get user by ID                 |

### Stores
| Method | Endpoint                | Access              | Description              |
|--------|-------------------------|---------------------|--------------------------|
| GET    | /api/stores             | All authenticated   | List stores              |
| GET    | /api/stores/my-store    | Store Owner         | Get owned store          |
| GET    | /api/stores/:id         | All authenticated   | Get store by ID          |
| GET    | /api/stores/:id/ratings| Store Owner         | Get store ratings        |
| POST   | /api/stores             | Admin               | Create store             |

### Ratings (User only)
| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| GET    | /api/ratings            | Get user's ratings       |
| POST   | /api/ratings            | Submit rating            |
| GET    | /api/ratings/:storeId   | Get user's rating for store |
| PUT    | /api/ratings/:storeId   | Update rating            |

### Dashboard
| Method | Endpoint                    | Access      | Description        |
|--------|-----------------------------|-------------|--------------------|
| GET    | /api/dashboard/admin        | Admin       | Admin dashboard    |
| GET    | /api/dashboard/store-owner  | Store Owner | Owner dashboard    |

## Validation Rules

| Field    | Rules                                                                 |
|----------|-----------------------------------------------------------------------|
| Name     | 20-60 characters                                                      |
| Address  | Max 400 characters                                                    |
| Password | 8-16 characters, 1 uppercase, 1 special character                   |
| Email    | Standard email format                                                 |
| Rating   | 1-5 (one rating per user per store)                                   |

## User Roles & Features

### Admin
- Dashboard with total users, stores, and ratings
- Create users, admins, and store owners
- Create stores and assign owners
- View/search/filter/sort all users and stores
- View store average ratings

### User
- Register and login
- Browse and search stores
- Submit and update ratings (1-5 stars)
- View own submitted ratings
- Change password

### Store Owner
- Login and change password
- View owned store average rating
- View all users who rated the store
- Dashboard with rating distribution

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
