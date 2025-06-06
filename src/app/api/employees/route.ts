import prisma from "@/shared/lib/prisma";
import { EmployeeRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const hotelId = searchParams.get("hotelId");
    const role = searchParams.get("role");
    const isActive = searchParams.get("isActive");

    if (!hotelId) {
      return NextResponse.json(
        { error: "Hotel ID is required" },
        { status: 400 }
      );
    }

    const where: {
      hotelId: string;
      role?: EmployeeRole;
      isActive?: boolean;
    } = {
      hotelId: hotelId,
    };

    if (role) {
      where.role = role as EmployeeRole;
    }

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const employees = await prisma.employee.findMany({
      where,
      orderBy: [{ name: "asc" }],
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}
