import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, saved_id, amount } = await req.json();

    if (!saved_id || !amount) {
      return NextResponse.json(
        { error: "Saving ID, amount are required" },
        { status: 400 }
      );
    }

    const saving = await prisma.saving.findUnique({
      where: { id }
    });

    if (!saving) {
      return NextResponse.json({ error: "Saving not found" }, { status: 404 });
    }

    await prisma.saved.update({
      where: { id: saved_id },
      data: {
        status: "saved"
      }
    });

    const updatedSaving = await prisma.saving.update({
      where: { id },
      data: {
        totalsavedAmount: saving.totalsavedAmount + amount
      }
    });

    return NextResponse.json({ success: true, updatedSaving }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
