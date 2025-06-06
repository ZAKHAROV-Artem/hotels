# Hotel Reception - Guest Request Management System

Modern web system for hotel reception staff that enables efficient management of guest requests. Built with Next.js 15, TypeScript, Prisma, PostgreSQL, and Tailwind CSS.

## 📋 System Description

Complete hotel management system that solves the problem of tracking and assigning guest requests. Includes employee management, task assignment, and real-time tracking. Each hotel operates in an isolated environment with its own data (multi-tenancy), enabling scalability as a SaaS product.

### Main Features

**Request Management:**

- ⏱️ Creation and tracking of guest requests
- 🎯 Automatic/manual assignment to employees
- 📊 Status and priorities with visual indicators
- 🔄 Estimated completion time

**Staff Management:**

- 👥 Employee registration by department
- 🏷️ Specific roles (housekeeping, maintenance, front_desk, etc.)
- 📋 Task assignment and workload tracking
- ✅ Active/inactive employee status

**Multi-Hotel System:**

- 🏨 Management of multiple independent hotels
- 🔒 Complete data isolation between properties
- 📈 Scalability as SaaS

## 🗄️ Updated Data Model

### Complete Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Hotel {
  id          String    @id @default(uuid())
  name        String
  address     String?
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  // Relations
  requests    Request[]
  employees   Employee[]

  @@map("hotels")
}

model Employee {
  id          String       @id @default(uuid())
  hotelId     String       @map("hotel_id")
  name        String
  role        EmployeeRole
  email       String?
  phone       String?
  isActive    Boolean      @default(true) @map("is_active")
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  // Relations
  hotel       Hotel        @relation(fields: [hotelId], references: [id], onDelete: Cascade)
  requests    Request[]

  @@map("employees")
}

model Request {
  id                  String      @id @default(uuid())
  hotelId             String      @map("hotel_id")
  guestName           String      @map("guest_name")
  roomNumber          String?     @map("room_number")
  requestType         RequestType @map("request_type")
  description         String?
  status              Status      @default(pending)
  priority            Priority?   @default(medium)
  assignedToId        String?     @map("assigned_to_id")
  estimatedCompletion DateTime?   @map("estimated_completion")
  createdAt           DateTime    @default(now()) @map("created_at")
  updatedAt           DateTime    @updatedAt @map("updated_at")

  // Relations
  hotel       Hotel       @relation(fields: [hotelId], references: [id], onDelete: Cascade)
  assignedTo  Employee?   @relation(fields: [assignedToId], references: [id], onDelete: SetNull)

  @@map("requests")
}

enum RequestType {
  cleaning        // Cleaning
  slippers        // Slippers
  late_checkout   // Late checkout
  towels          // Towels
  room_service    // Room service
  maintenance     // Maintenance
  other           // Other
}

enum Status {
  pending      // Pending
  in_progress  // In progress
  done         // Completed
}

enum Priority {
  low     // Low
  medium  // Medium
  high    // High
}

enum EmployeeRole {
  housekeeping  // Housekeeping
  maintenance   // Maintenance
  front_desk    // Front desk
  room_service  // Room service
  concierge     // Concierge
  manager       // Management
}
```

### New Schema Features

**Employee Management:**

- Complete employee management per hotel
- Specific roles for automatic task assignment
- Active/inactive status for availability control
- Contact information for communication

**Enhanced Requests:**

- Assignment of requests to specific employees
- Estimated completion time
- Detailed descriptions for better context
- Cascading deletes for referential integrity

**Improved Data Mapping:**

- Snake_case mapping for better DB consistency
- Proper indexing and relationships
- Soft deletes ready (isActive flag)

## 🚀 Technologies and Architecture

### Updated Technology Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, React 19
- **State:** Zustand + TanStack Query v5
- **UI:** Tailwind CSS v4, Radix UI, Lucide Icons
- **Backend:** Next.js API Routes with Zod validation
- **Database:** PostgreSQL with Prisma ORM v6.9
- **Deploy:** Vercel optimized
- **Real-time:** React Query with auto-refresh

### Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API Routes
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── modules/               # Feature modules
│   ├── requests/          # Request management
│   ├── employees/         # Employee management
│   └── hotels/            # Hotel management
└── shared/                # Shared components and utilities
```

### Updated API Endpoints

**Requests API:**

- `GET /api/requests?hotel_id=<>&status=<>&assigned_to=<>&sort=date`
- `POST /api/requests` - Create request (with auto-assignment)
- `PATCH /api/requests/:id/status` - Update status
- `PATCH /api/requests/:id/assign` - Assign employee
- `GET /api/requests/:id` - Request details

**Employees API:**

- `GET /api/employees?hotel_id=<>&role=<>&active=true`
- `POST /api/employees` - Register employee
- `PATCH /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Deactivate employee

**Hotels API:**

- `GET /api/hotels` - List hotels
- `POST /api/hotels` - Create hotel
- `GET /api/hotels/:id/stats` - Hotel statistics

## 🚀 Installation and Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Local Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd hotels

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# 4. Setup database
npx prisma generate
npx prisma db push

# 5. Start development server
npm run dev
```

### Environment Variables

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/hotels_db"
```

## 💡 UX Improvements and Features

### Intelligent Assignment System

**Auto-assignment by Role:**

- `cleaning` → `housekeeping` staff
- `maintenance` → `maintenance` staff
- `room_service` → `room_service` staff
- Automatic load balancer between active employees

### Enhanced Dashboard

**Advanced Filters:**

- 👤 By assigned employee
- 🏷️ By request type
- ⏰ By estimated time
- 📊 By hotel (if multi-hotel)

**Visual Indicators:**

- 🔴 **Pending + High Priority** - Immediate attention
- 🟡 **In Progress** - In process
- 🟢 **Done** - Completed
- ⚪ **Unassigned** - Unassigned

### Scalability

**Current Architecture:**

- ✅ One database, multiple tenants
- ✅ Isolation by `hotel_id`
- ✅ Automatically filtered APIs

**Ready for:**

- 🔄 Sharding by geographic region
- 📊 Centralized cross-hotel analytics
- 🔐 Granular roles and permissions system
- 🌐 Integration with existing PMS systems
