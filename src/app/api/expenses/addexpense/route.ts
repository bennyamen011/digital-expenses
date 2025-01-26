import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, amount, category, userId, date } = body;

    // Validate the input
    if (!name || !amount || !category || !userId || !date) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const newExpense = await prisma.expense.create({
      data: { name, amount, category, userId , date },
    });

    return NextResponse.json({ expense: newExpense }, { status: 201 });
  } catch (error) {
    console.error("Error adding expense:", error);
    return NextResponse.json(
      { error: "Failed to add expense" },
      { status: 500 }
    );
  }
}
