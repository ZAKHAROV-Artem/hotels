import prisma from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { assignedToId } = body;

    // Verify request exists
    const existingRequest = await prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Verify employee exists and belongs to the same hotel
    const employee = await prisma.employee.findUnique({
      where: { id: assignedToId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    if (employee.hotelId !== existingRequest.hotelId) {
      return NextResponse.json(
        { error: "Employee does not belong to the same hotel" },
        { status: 400 }
      );
    }

    if (!employee.isActive) {
      return NextResponse.json(
        { error: "Employee is not active" },
        { status: 400 }
      );
    }

    // Update the request with assignment
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        assignedToId,
        updatedAt: new Date(),
      },
      include: {
        assignedTo: true, // Include employee details
      },
    });

    return NextResponse.json(updatedRequest);
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

    console.error("Error assigning request:", error);
    return NextResponse.json(
      { error: "Failed to assign request" },
      { status: 500 }
    );
  }
}
