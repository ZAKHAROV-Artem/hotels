# Hotel Reception - Guest Request Management

Modern web system for hotel reception staff to efficiently manage guest requests. Built with Next.js 15, TypeScript, and PostgreSQL.

## Key UX Solutions

**Room-First Design:**

- **Room number prominently displayed** in request cards - the most critical information for reception staff
- Room number shown in large, bold text for quick visual scanning
- Color-coded request status with room number always visible

**Receptionist-Focused Interface:**

- Guest requests sorted by urgency and room number
- One-click status updates (pending → in progress → done)
- Auto-assignment to appropriate staff by request type
- Quick filters: by room, status, and priority

**Request Card Design:**

- Room number as primary identifier (largest text)
- Guest name and request type as secondary info
- Visual priority indicators for urgent requests
- Estimated completion time for guest communication

## Features

- 🏨 Multi-hotel support with data isolation
- 📋 Request tracking (cleaning, maintenance, room service, etc.)
- 👥 Staff management by department
- 📊 Priority-based task assignment
- ⏰ Real-time status updates

## Quick Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
# Clone and install
git clone <repository-url>
cd hotels
npm install

# Setup environment
cp .env.example .env
# Add your DATABASE_URL to .env

# Setup database
npx prisma generate
npx prisma migrate deploy

# Start development
npm run dev
```

### Environment Variables

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/hotels_db"
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **UI:**ShadcnUI
