import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust import based on your Prisma setup

export async function POST(req: Request) {
  try {
    // Ensure request body exists
    if (!req.body) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { userId, salary } = body;

    console.log("Received Data:", body);

    // Ensure required fields are provided
    if (!userId || salary === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update user salary in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        salary: Number(salary),
        is_first: false
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("Error updating salary:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
