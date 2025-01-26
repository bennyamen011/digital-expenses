import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.expense.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete expense ${error}` }, { status: 500 });
  }
}
