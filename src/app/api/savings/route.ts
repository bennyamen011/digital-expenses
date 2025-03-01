import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const savings = await prisma.saving.findMany();
      return NextResponse.json(savings, { status: 200 });
    } catch (error) {
      console.error("Failed to fetch savings:", error);
      return NextResponse.json({ error: "Failed to fetch savings" }, { status: 500 });
    }
  }