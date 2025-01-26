"use client";

import { MoreHorizontal } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
}

interface MonthlyExpense {
  month: string;
  total_expense: number;
  saving: number;
  expenses: Expense[];
}

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}


export default function Overview() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filtered, setFilterd] = useState<Expense[]>([])
  const [monthlyExpense, setMonthlyExpense] = useState<MonthlyExpense[]>([])
  const [openExpenses, setOpenExpenses] = useState<boolean>(false)
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('all')

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ffbb28"];
  // Fetch expenses
  async function fetchExpenses() {
    if (activeTab == 'monthly') {
      try {
        const response = await fetch("/api/expenses?type=monthly", { method: "GET" });
        if (!response.ok) throw new Error("Failed to fetch expenses");
        const data = await response.json();
        setMonthlyExpense(data.monthlyExpenses)
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await fetch("/api/expenses", { method: "GET" });
        if (!response.ok) throw new Error("Failed to fetch expenses");
        const data = await response.json();
        setExpenses(data.expenses);
        setFilterd(data.expenses)
      } catch (error) {
        console.error(error);
      }
    }

  }

  useEffect(() => {
    fetchExpenses();
    const user = localStorage.getItem('user')
    if (user) {
      setUser(JSON.parse(user))
    }

  }, []);

  useEffect(() => {
    if (!expenses) return;

    const now = new Date();
    let filteredExpenses = [];

    switch (activeTab) {
      case 'today':
        filteredExpenses = expenses.filter(
          (expense) =>
            new Date(expense.date).toLocaleDateString() === now.toLocaleDateString()
        );
        break;

      case 'weekly':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
        endOfWeek.setHours(23, 59, 59, 999); // End of the last day

        filteredExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
        });
        break;

      case 'monthly':
        fetchExpenses();
        const currentMonth = now.getMonth(); // 0-indexed (January = 0)
        const currentYear = now.getFullYear();

        filteredExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
          );
        });
        break;

      case 'year':
        const currentYearOnly = now.getFullYear();
        filteredExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getFullYear() === currentYearOnly;
        });
        break;

      case 'all':
      default:
        fetchExpenses(); // Fetch all expenses again
        return; // Exit to avoid resetting `expenses`
    }

    setFilterd(filteredExpenses);
  }, [activeTab]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    if (!user) {
      console.error("User is not logged in.");
      return;
    }

    try {
      const response = await fetch("/api/expenses/addexpense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          amount: parseFloat(amount),
          category,
          date: new Date(date),
          userId: user.id,
        }),
      });

      if (response.ok) {
        fetchExpenses();
        setName("");
        setAmount("");
        setDate('')
        setCategory("");
      }
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-bold">Total Expenses</h2>
          <p className="text-2xl">{expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-bold">Monthly Budget</h2>
          <p className="text-2xl">2,000</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-bold">Remaining Balance</h2>
          <p className="text-2xl">
            {(2000 - expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)).toFixed(2)}
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between mt-6 mb-2">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setOpen(true)}>
              Add Expense
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Expense Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Groceries"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., 1500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Food, Utilities"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Category</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="select the date of expense"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                  Add Expense
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex space-x-4 rounded-md p-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "all"
              ? "border-b-2 border-black text-black"
              : "text-gray-400"
              }`}
            onClick={() => {
              setActiveTab("all");
            }}
          >
            All
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "today"
              ? "border-b-2 border-black text-black"
              : "text-gray-400"
              }`}
            onClick={() => {
              setActiveTab("today");
            }}
          >
            Today
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "weekly"
              ? "border-b-2 border-black text-black"
              : "text-gray-400"
              }`}
            onClick={() => {
              setActiveTab("weekly");
            }}
          >
            Weekly
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "monthly"
              ? "border-b-2 border-black text-black"
              : "text-gray-400"
              }`}
            onClick={() => {
              setActiveTab("monthly");
            }}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "year"
              ? "border-b-2 border-black text-black"
              : "text-gray-400"
              }`}
            onClick={() => {
              setActiveTab("year");
            }}
          >
            Year
          </button>
        </div>
        {activeTab !== 'monthly' && (
          <div className="rounded-md border">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.amount}</td>
                      <td className="px-4 py-2">{item.category}</td>
                      <td className="px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger >
                            <MoreHorizontal />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit Expense</DropdownMenuItem>
                            <DropdownMenuItem>Delete Expense</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">No results found</td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        )}
        {activeTab == 'monthly' && (
          <div className="rounded-md border">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Month</th>
                  <th className="px-4 py-2 text-left">Total Expense</th>
                  <th className="px-4 py-2 text-left">Saving</th>
                  <th className="px-4 py-2 text-left"> Action</th>
                  <th className="px-4 py-2 text-left">Chart</th>
                </tr>
              </thead>
              <tbody>
                {monthlyExpense.length > 0 ? (
                  monthlyExpense.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{item.month}</td>
                      <td className="px-4 py-2">{item.total_expense}</td>
                      <td className="px-4 py-2">{item.saving}</td>
                      <td className="px-4 py-2"><Dialog open={openExpenses} onOpenChange={setOpenExpenses}>
                        <DialogTrigger className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setOpenExpenses(true)}>
                          View All
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Expenses for {item.month}</DialogTitle>
                          </DialogHeader>
                          <table className="w-full table-auto">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Amount</th>
                                <th className="px-4 py-2 text-left">Category</th>
                                <th className="px-4 py-2 text-left">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.expenses.length > 0 ? (
                                item.expenses.map((item, index) => (
                                  <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{item.name}</td>
                                    <td className="px-4 py-2">{item.amount}</td>
                                    <td className="px-4 py-2">{item.category}</td>
                                    <td className="px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={5} className="text-center py-4">No results found</td>
                                </tr>
                              )}
                            </tbody>

                          </table>
                        </DialogContent>
                      </Dialog>
                      </td>
                      <td className="px-4 py-2">
                        <PieChart width={120} height={120}>
                          <Pie
                            data={[
                              { name: "Expense", value: item.total_expense },
                              { name: "Savings", value: item.saving },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={50}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[item.total_expense, item.saving].map((_, i) => (
                              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">No results found</td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  )
}