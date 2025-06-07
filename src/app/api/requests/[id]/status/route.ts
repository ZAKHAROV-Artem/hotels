import prisma from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { RequestStatus } from "@/shared/types/request";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!Object.values(RequestStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Check if request exists
    const existingRequest = await prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Update the request status in the database
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        status: status as "pending" | "in_progress" | "done",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating request status:", error);
    return NextResponse.json(
      { error: "Failed to update request status" },
      { status: 500 }
    );
  }
}
