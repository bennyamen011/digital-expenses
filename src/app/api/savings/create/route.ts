import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newSaving = await prisma.saving.create({ data });
    return NextResponse.json(newSaving, { status: 201 });
  } catch (error) {
    console.error("Failed to save saving:", error);
    return NextResponse.json({ error: "Failed to save saving" }, { status: 500 });
  }
}
