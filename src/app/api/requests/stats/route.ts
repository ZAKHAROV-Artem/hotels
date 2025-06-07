import prisma from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("hotelId");

    // Hotel ID is required for SaaS mode
    if (!hotelId) {
      return NextResponse.json(
        { error: "Hotel ID is required" },
        { status: 400 }
      );
    }

    // Get stats using Prisma aggregation
    const [pending, inProgress, done, total] = await Promise.all([
      prisma.request.count({
        where: { hotelId, status: "pending" },
      }),
      prisma.request.count({
        where: { hotelId, status: "in_progress" },
      }),
      prisma.request.count({
        where: { hotelId, status: "done" },
      }),
      prisma.request.count({
        where: { hotelId },
      }),
    ]);

    const stats = {
      pending,
      inProgress,
      done,
      total,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
