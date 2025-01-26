import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Update with your Prisma instance path

interface Expense {
  id: string;
  name: string;
  amount: number;
  date: Date;
  category: string;
}

interface MonthlyExpense {
  month: string;
  total_expense: number;
  saving: number;
  expenses: Expense[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const monthlyIncome = 2000; // Replace with your dynamic income logic

  if (type !== "monthly") {
    // Fetch all expenses without grouping
    try {
      const expenses = await prisma.expense.findMany();
      return NextResponse.json({ expenses });
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to fetch expenses: ${error}` },
        { status: 500 }
      );
    }
  } else {
    // Fetch and group expenses by month
    try {
      const expenses = await prisma.expense.findMany();

      // Group expenses by month
      const monthlyExpenses = expenses.reduce((acc: Record<string, MonthlyExpense>, expense) => {
        const date = new Date(expense.date);
        const month = date.toLocaleString("default", { month: "long", year: "numeric" });
        if (!acc[month]) {
          acc[month] = {
            month,
            total_expense: 0,
            saving: 0,
            expenses: [],
          };
        }

        acc[month].total_expense += expense.amount;
        acc[month].expenses.push(expense);

        return acc;
      }, {});

      // Calculate savings and format the result
      const result = Object.values(monthlyExpenses).map((monthData) => ({
        ...monthData,
        saving: monthlyIncome - monthData.total_expense,
      }));

      return NextResponse.json({ monthlyExpenses: result });
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to fetch monthly expenses: ${error}` },
        { status: 500 }
      );
    }
  }
}
