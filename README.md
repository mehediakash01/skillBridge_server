# SkillBridge - Tutor Booking Platform

A comprehensive backend API for connecting students with tutors, managing bookings, reviews, and availability.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [🛠️ Tech Stack](#tech-stack)
- [📁 Folder Structure](#folder-structure)
- [🗄️ Database Schema](#database-schema)
- [🔌 API Endpoints](#api-endpoints)
- [⚙️ Installation & Setup](#installation--setup)
- [🚀 Running the Application](#running-the-application)
- [🔐 Environment Variables](#environment-variables)
- [📝 API Examples](#api-examples)

---

## Project Overview

**SkillBridge** is a backend platform that enables:

- ✅ User authentication with email/password and OAuth (Google)
- ✅ Tutor profile management and search
- ✅ Real-time availability scheduling
- ✅ Booking system with status tracking
- ✅ Student reviews and ratings for tutors
- ✅ Admin dashboard for user management
- ✅ Category-based course organization
- ✅ Email notifications for bookings

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | >=20.19 | Runtime environment |
| **Express.js** | 5.2.1 | REST API framework |
| **TypeScript** | 5.9.3 | Type-safe development |
| **Prisma** | 7.3.0 | Database ORM |
| **PostgreSQL** | - | Primary database |
| **Better-Auth** | 1.4.18 | Authentication & OAuth |
| **Nodemailer** | 7.0.13 | Email notifications |
| **CORS** | 2.8.6 | Cross-origin requests |
| **TSup** | 8.5.1 | TypeScript bundler |

---

## 📁 Folder Structure

```
SkillBridge_Client/
├── src/
│   ├── server.ts                 # Entry point
│   ├── lib/
│   │   ├── app.ts               # Express app configuration
│   │   ├── auth.ts              # Better-Auth setup
│   │   └── prisma.ts            # Prisma client instance
│   ├── modules/
│   │   ├── admin/               # Admin management
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.router.ts
│   │   │   └── admin.service.ts
│   │   ├── availability/        # Tutor availability
│   │   │   ├── available.controller.ts
│   │   │   ├── available.router.ts
│   │   │   └── available.service.ts
│   │   ├── booking/             # Booking management
│   │   │   ├── booking.controller.ts
│   │   │   ├── booking.router.ts
│   │   │   └── booking.service.ts
│   │   ├── category/            # Course categories
│   │   │   ├── category.controller.ts
│   │   │   ├── category.router.ts
│   │   │   └── category.service.ts
│   │   ├── reviews/             # Tutor reviews
│   │   │   ├── review.controller.ts
│   │   │   ├── review.router.ts
│   │   │   └── review.service.ts
│   │   └── tutor/               # Tutor profiles
│   │       ├── tutor.controller.ts
│   │       ├── tutor.router.ts
│   │       └── tutor.service.ts
│   ├── middlewares/
│   │   ├── authMiddleware.ts    # JWT verification
│   │   └── globalErrorHandler.ts # Error handling
│   ├── utils/
│   │   ├── catchAsync.ts        # Async error wrapper
│   │   └── sendResponse.ts      # Standard response format
│   └── scripts/
│       └── seedAdmin.ts         # Database seeding
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Migration history
├── .env                         # Environment variables
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 🗄️ Database Schema

### Core Models

```prisma
// User Model
model User {
  id                String
  email             String (unique)
  name              String
  image             String?
  emailVerified     Boolean
  role              Role (Admin, Tutor, Student)
  createdAt         DateTime
  tutorProfile      Tutor?
  bookings          Booking[]
  reviews           Review[]
}

// Tutor Model
model Tutor {
  id                String
  userId            String (unique, FK)
  bio               String?
  hourlyRate        Decimal
  expertise         String[]
  profileImage      String?
  ratings           Float
  totalReviews      Int
  categories        Category[]
  availability      Availability[]
  bookings          Booking[]
  reviews           Review[]
  createdAt         DateTime
  updatedAt         DateTime
}

// Booking Model
model Booking {
  id                String
  studentId         String (FK)
  tutorId           String (FK)
  categoryId        String (FK)
  startTime         DateTime
  endTime           DateTime
  duration          Int (minutes)
  status            BookingStatus
  meetingLink       String?
  createdAt         DateTime
  updatedAt         DateTime
}

// Availability Model
model Availability {
  id                String
  tutorId           String (FK)
  dayOfWeek         Int (0-6)
  startTime         String (HH:mm)
  endTime           String (HH:mm)
  isBooked          Boolean
  createdAt         DateTime
  updatedAt         DateTime
}

// Review Model
model Review {
  id                String
  studentId         String (FK)
  tutorId           String (FK)
  rating            Int (1-5)
  comment           String?
  createdAt         DateTime
  updatedAt         DateTime
}

// Category Model
model Category {
  id                String
  name              String (unique)
  description       String?
  tutors            Tutor[]
  bookings          Booking[]
  createdAt         DateTime
  updatedAt         DateTime
}
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/sign-up              # Register new user
POST   /api/auth/sign-in              # Login user
POST   /api/auth/sign-out             # Logout user
GET    /api/auth/session              # Get user session
POST   /api/auth/forgot-password      # Request password reset
POST   /api/auth/reset-password       # Reset password
```

### Tutors
```
GET    /api/tutors                    # Get all tutors with filters
GET    /api/tutors/:id                # Get tutor profile
POST   /api/tutors                    # Create tutor profile
PATCH  /api/tutors/:id                # Update tutor profile
DELETE /api/tutors/:id                # Delete tutor profile
GET    /api/tutors/search?query=...   # Search tutors by name/expertise
```

### Bookings
```
GET    /api/bookings                  # Get all bookings (user-specific)
GET    /api/bookings/:id              # Get booking details
POST   /api/bookings                  # Create new booking
PATCH  /api/bookings/:id              # Update booking status
DELETE /api/bookings/:id              # Cancel booking
GET    /api/bookings/statistics       # Get booking stats (admin)
```

### Reviews
```
GET    /api/reviews/tutor/:tutorId    # Get tutor reviews
POST   /api/reviews                   # Create review
PATCH  /api/reviews/:id               # Update review
DELETE /api/reviews/:id               # Delete review
GET    /api/reviews/statistics        # Get review stats
```

### Availability
```
GET    /api/availability/:tutorId     # Get tutor availability
POST   /api/availability              # Set availability
PATCH  /api/availability/:id          # Update availability
DELETE /api/availability/:id          # Delete availability slot
GET    /api/availability/free-slots   # Get free time slots
```

### Categories
```
GET    /api/categories                # Get all categories
GET    /api/categories/:id            # Get category details
POST   /api/categories                # Create category (admin)
PATCH  /api/categories/:id            # Update category (admin)
DELETE /api/categories/:id            # Delete category (admin)
```

### Admin
```
GET    /api/admin/users               # Get all users
GET    /api/admin/users/:id           # Get user details
PATCH  /api/admin/users/:id           # Update user role/status
DELETE /api/admin/users/:id           # Delete user
GET    /api/admin/statistics          # Dashboard statistics
GET    /api/admin/reports/bookings    # Booking reports
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js ≥ 20.19
- PostgreSQL database
- npm or yarn package manager

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd SkillBridge_Client
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

### Step 4: Setup Database
```bash
# Generate Prisma client
npm run postinstall

# Run migrations
npx prisma migrate deploy

# Seed initial admin user
npm run seed:admin
```

### Step 5: Verify Setup
```bash
npm run dev
```

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
Server runs on: `http://localhost:5000`

### Production Build
```bash
npm run build
```

### Run Built Application
```bash
node api/server.js
```

### Database Commands
```bash
# Create new migration
npx prisma migrate dev --name <migration_name>

# View database
npx prisma studio

# Reset database
npx prisma migrate reset
```

---

## 🔐 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database_name

# Server Configuration
PORT=5000
APP_URL=http://localhost:3000

# Authentication
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=https://your-domain.com/

# OAuth (Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration
APP_USER=your_email@gmail.com
APP_PASS=your_app_password

# Admin Credentials
ADMIN_NAME=Admin Name
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
```

---

## 📝 API Examples

### Register User
```bash
POST /api/auth/sign-up
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

### Get All Tutors
```bash
GET /api/tutors?expertise=mathematics&minRating=4.5
Authorization: Bearer <token>
```

### Create Booking
```bash
POST /api/bookings
Content-Type: application/json
Authorization: Bearer <token>

{
  "tutorId": "tutor_id_123",
  "categoryId": "category_id_456",
  "startTime": "2026-03-15T10:00:00Z",
  "endTime": "2026-03-15T11:00:00Z"
}
```

### Submit Review
```bash
POST /api/reviews
Content-Type: application/json
Authorization: Bearer <token>

{
  "tutorId": "tutor_id_123",
  "rating": 5,
  "comment": "Excellent tutor! Very helpful."
}
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

ISC License

## 📧 Support

For issues or questions, contact: **mehedi.akash.dev@gmail.com**

---

