import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { RequestStatus, RequestType } from "@/shared/types/request";
import prisma from "@/shared/lib/prisma";

const createRequestSchema = z.object({
  hotelId: z.string().uuid("Hotel ID must be a valid UUID"),
  guestName: z.string().min(1, "Guest name is required"),
  roomNumber: z.string().optional(),
  requestType: z.nativeEnum(RequestType, {
    errorMap: () => ({ message: "Invalid request type" }),
  }),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const hotelId = searchParams.get("hotelId");
    const status = searchParams.get("status") as RequestStatus | null;
    const requestType = searchParams.get("requestType") as RequestType | null;
    const priority = searchParams.get("priority") as
      | "low"
      | "medium"
      | "high"
      | null;
    const roomNumber = searchParams.get("roomNumber");
    const assignedToId = searchParams.get("assignedToId");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Hotel ID is required for SaaS mode
    if (!hotelId) {
      return NextResponse.json(
        { error: "Hotel ID is required" },
        { status: 400 }
      );
    }

    // Build filter conditions
    const where: {
      hotelId: string;
      status?: RequestStatus;
      requestType?: RequestType;
      priority?: "low" | "medium" | "high";
      roomNumber?: { contains: string; mode: "insensitive" };
      assignedToId?: string;
    } = {
      hotelId: hotelId,
    };

    if (status) {
      where.status = status;
    }

    if (requestType) {
      where.requestType = requestType;
    }

    if (priority) {
      where.priority = priority;
    }

    if (roomNumber) {
      where.roomNumber = {
        contains: roomNumber,
        mode: "insensitive",
      };
    }

    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    // Build order by clause
    const getOrderBy = (sortBy: string, sortOrder: string) => {
      const order = sortOrder === "asc" ? ("asc" as const) : ("desc" as const);

      switch (sortBy) {
        case "priority":
          return { priority: order };
        case "status":
          return { status: order };
        case "roomNumber":
          return { roomNumber: order };
        case "guestName":
          return { guestName: order };
        case "requestType":
          return { requestType: order };
        case "createdAt":
        default:
          return { createdAt: order };
      }
    };

    const orderBy = getOrderBy(sortBy, sortOrder);

    // Fetch requests with pagination and include employee data
    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        where,
        include: {
          assignedTo: true, // Include employee details
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.request.count({ where }),
    ]);

    const response = {
      requests,
      total,
      page,
      limit,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createRequestSchema.parse(body);

    // Verify hotel exists
    const hotel = await prisma.hotel.findUnique({
      where: { id: validatedData.hotelId },
    });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const newRequest = await prisma.request.create({
      data: {
        hotelId: validatedData.hotelId,
        guestName: validatedData.guestName,
        roomNumber: validatedData.roomNumber,
        requestType: validatedData.requestType,
        description: validatedData.description,
        priority: validatedData.priority,
      },
      include: {
        assignedTo: true, // Include employee details
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}
