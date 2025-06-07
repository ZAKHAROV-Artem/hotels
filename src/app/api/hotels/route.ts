import prisma from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createHotelSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  address: z.string().optional(),
});

// GET /api/hotels - Fetch all hotels
export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotels" },
      { status: 500 }
    );
  }
}

// POST /api/hotels - Create a new hotel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createHotelSchema.parse(body);

    const hotel = await prisma.hotel.create({
      data: {
        name: validatedData.name,
        address: validatedData.address,
      },
    });

    return NextResponse.json(hotel, { status: 201 });
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

    console.error("Error creating hotel:", error);
    return NextResponse.json(
      { error: "Failed to create hotel" },
      { status: 500 }
    );
  }
}
