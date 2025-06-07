-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('cleaning', 'slippers', 'late_checkout', 'towels', 'room_service', 'maintenance', 'other');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'in_progress', 'done');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('housekeeping', 'maintenance', 'front_desk', 'room_service', 'concierge', 'manager');

-- CreateTable
CREATE TABLE "hotels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "EmployeeRole" NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "guest_name" TEXT NOT NULL,
    "room_number" TEXT,
    "request_type" "RequestType" NOT NULL,
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "priority" "Priority" DEFAULT 'medium',
    "assigned_to_id" TEXT,
    "estimated_completion" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Insert Mock Hotels
INSERT INTO "hotels" ("id", "name", "address", "created_at", "updated_at") VALUES
('hotel-1', 'Grand Plaza Hotel', '123 Main Street, Downtown City', NOW(), NOW()),
('hotel-2', 'Luxury Resort & Spa', '456 Beach Boulevard, Coastal Town', NOW(), NOW()),
('hotel-3', 'Business Center Inn', '789 Corporate Drive, Business District', NOW(), NOW());

-- Insert Mock Employees
INSERT INTO "employees" ("id", "hotel_id", "name", "role", "email", "phone", "created_at", "updated_at") VALUES
('emp-1', 'hotel-1', 'Anna Johnson', 'housekeeping', 'anna.johnson@grandplaza.com', '+1-555-0101', NOW(), NOW()),
('emp-2', 'hotel-1', 'Peter Smith', 'front_desk', 'peter.smith@grandplaza.com', '+1-555-0102', NOW(), NOW()),
('emp-3', 'hotel-1', 'Maria Petrova', 'room_service', 'maria.petrova@grandplaza.com', '+1-555-0103', NOW(), NOW()),
('emp-4', 'hotel-1', 'James Wilson', 'maintenance', 'james.wilson@grandplaza.com', '+1-555-0104', NOW(), NOW()),
('emp-5', 'hotel-2', 'Sarah Connor', 'housekeeping', 'sarah.connor@luxuryresort.com', '+1-555-0201', NOW(), NOW()),
('emp-6', 'hotel-2', 'Mike Torres', 'maintenance', 'mike.torres@luxuryresort.com', '+1-555-0202', NOW(), NOW()),
('emp-7', 'hotel-2', 'Lisa Chen', 'concierge', 'lisa.chen@luxuryresort.com', '+1-555-0203', NOW(), NOW()),
('emp-8', 'hotel-3', 'David Park', 'housekeeping', 'david.park@businessinn.com', '+1-555-0301', NOW(), NOW()),
('emp-9', 'hotel-3', 'Jennifer Lee', 'front_desk', 'jennifer.lee@businessinn.com', '+1-555-0302', NOW(), NOW()),
('emp-10', 'hotel-3', 'Robert Garcia', 'manager', 'robert.garcia@businessinn.com', '+1-555-0303', NOW(), NOW());

-- Insert Mock Requests
INSERT INTO "requests" ("id", "hotel_id", "guest_name", "room_number", "request_type", "description", "status", "priority", "assigned_to_id", "created_at", "updated_at") VALUES
('req-1', 'hotel-1', 'John Peterson', '101', 'cleaning', 'Please provide additional room cleaning', 'pending', 'high', NULL, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('req-2', 'hotel-1', 'Maria Sidorova', '205', 'slippers', 'Need additional slippers', 'in_progress', 'medium', 'emp-1', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 hour'),
('req-3', 'hotel-1', 'Alex Kozlov', '312', 'late_checkout', 'Please extend checkout time until 4:00 PM', 'done', 'low', 'emp-2', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '30 minutes'),
('req-4', 'hotel-1', 'Elena Volkova', '150', 'towels', 'Additional towels needed', 'pending', 'medium', NULL, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('req-5', 'hotel-1', 'Dmitry Orlov', '225', 'room_service', 'Breakfast order for room delivery at 8:30 AM', 'in_progress', 'high', 'emp-3', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '4 hours'),
('req-6', 'hotel-2', 'Sarah Williams', '301', 'maintenance', 'Air conditioning not working properly', 'pending', 'high', NULL, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
('req-7', 'hotel-2', 'Michael Brown', '402', 'cleaning', 'Room needs deep cleaning', 'pending', 'medium', NULL, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),
('req-8', 'hotel-3', 'Jennifer Davis', '501', 'towels', 'Extra towels for extended stay', 'done', 'low', 'emp-8', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '2 hours'),
('req-9', 'hotel-3', 'Robert Miller', '203', 'other', 'Need extra pillows and blankets', 'in_progress', 'medium', 'emp-8', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour');
