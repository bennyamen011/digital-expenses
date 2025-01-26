import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name, amount, category, date } = await req.json();

  try {
    const updatedExpense = await prisma.expense.update({
      where: { id: id },
      data: {
        name,
        amount,
        category,
        date: new Date(date), // Make sure to handle the date format properly
      },
    });
    return NextResponse.json(updatedExpense);
  } catch (error) {
    return NextResponse.json({ error: `Failed to update expense ${error}` }, { status: 500 });
  }
}
