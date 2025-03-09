import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const savings = await prisma.saving.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        savedList: true, // Include the savedList related to each saving
      },
    });


    return NextResponse.json(savings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch savings" }, { status: 500 });
  }
}
