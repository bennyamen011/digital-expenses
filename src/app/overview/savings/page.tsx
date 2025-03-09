"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Saving {
  id: string;
  name: string;
  amount: number;
  totalsavedAmount?: number
  date: Date;
  duration: number
  frequency: string
  totalAmount?: number;
  email?: string;
  savedList?: SavedList[]
}
interface SavedList {
  id: string;
  savingId: string;
  name: string;
  amount: number;
  date: string;
  status: string
}
export default function SavingsPage() {
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [savings, setSavings] = useState<Saving[]>([]);
  const [open, setOpen] = useState(false);
  const [savingName, setSavingName] = useState("")
  const [frequency, setFrequency] = useState("daily");
  const [duration, setDuration] = useState("");
  const [totalSavings, setTotalSavings] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [openSavedList, setOpensavedList] = useState<{
    id: string,
    open: boolean
  }>({
    id: "",
    open: false
  })
  const [savedlist,setSavedList]=useState<SavedList[]>([])

  // Function to fetch savings data from API
  const fetchSavings = async () => {
    try {
      const response = await fetch("/api/savings/list");

      if (!response.ok) {
        throw new Error("Failed to fetch savings");
      }

      const data = await response.json();
      setSavings(data); // Update state with fetched savings
    } catch (error) {
      console.error("Error fetching savings:", error);
    }
  };

  useEffect(() => {
    fetchSavings();
  }, []);

  const calculateSavings = () => {
    const savingAmount = parseFloat(amount);
    const savingDuration = parseInt(duration);
    if (!savingAmount || !savingDuration) return;

    let total = 0;
    total = savingAmount * savingDuration;

    setTotalSavings(total);
    suggestBestMethod(frequency);
  };

  const suggestBestMethod = (frequency: string) => {
    let bestMethod = ""
    if (frequency == "daily") {
      bestMethod = "Daily savings is the easiest way to build a habit.";
    } else if (frequency == "monthly") {
      bestMethod = "Saving monthly can help accumulate more over time.";
    } else if (frequency == "yearly") bestMethod = "Yearly savings requires patience but offers big results!";

    setSuggestion(bestMethod);
  };
  // Handle adding new saving
  const handleAddSaving = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const id = crypto.randomUUID();
    const savingAmount = parseFloat(amount);
    const savingDuration = parseInt(duration);
    const total = savingAmount * savingDuration;
    const newSaving: Saving = {
      id,
      name: savingName,
      amount: savingAmount,
      date: new Date(date),
      duration: savingDuration,
      frequency: frequency,
      totalAmount: total,
    };

    setSavings((prev) => [...prev, newSaving]);

    try {
      const response = await fetch("/api/savings/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSaving),
      });

      if (!response.ok) {
        throw new Error("Failed to add saving");
      }
      toast({
        variant: "success",
        title: "Savings Reminder Scheduled",
        description: "A reminder email will be sent one day before your savings due date.",
        duration: 5000, // Optional: Set duration in milliseconds
      });
      fetchSavings();
    } catch (error) {
      console.error("Error adding saving:", error);
    }

    setAmount("");
    setDate("");
    setOpen(false);
  };

  const handleSave = async (id: string, saved_id: string, amount: number) => {
    const res = await fetch("/api/savings/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, saved_id, amount })
    });

    if (res.ok) {
      setOpensavedList({
        id:"",
        open:false
      })
      fetchSavings()
    }else{
      console.log(res)
    }
  };

  // const saved = savings.find((saving) => saving.id === openSavedList.id) 

  const handleopenSavedlist =(id:string)=>{
    setOpensavedList({
      id: id,
      open: true
    })
    const saved =savings.find((saving) => saving.id === id)
    if(saved?.savedList){
      setSavedList(saved.savedList)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Goals Overview</h1>

      {/* Savings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-bold">Monthly Savings</h2>
          <p className="text-2xl">
            ₹
            {savings
              .filter((saving) => {
                const savingDate = new Date(saving.date);
                const today = new Date();
                return (
                  savingDate.getFullYear() === today.getFullYear() &&
                  savingDate.getMonth() === today.getMonth()
                );
              })
              .reduce((sum, saving) => sum + saving.amount, 0)
              .toLocaleString()}
          </p>
        </div> */}

        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-bold">Total Returns</h2>
          <p className="text-2xl">
            ₹{savings.reduce((sum, saving) => sum + (saving.totalAmount ?? 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add Savings Section */}
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Add Goal
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <DialogTitle className="text-lg font-bold mb-4 text-center">
              Goal Planner
            </DialogTitle>
            <form
              onSubmit={(e) => {
                handleAddSaving(e);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name the Goal
                </label>
                <input
                  type="text"
                  value={savingName}
                  onChange={(e) => setSavingName(e.target.value)}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                  placeholder="Bike"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Set the Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                  placeholder="e.g., 200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                  placeholder="e.g., 50 (days/months/years)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Starting Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                  placeholder="e.g., 50 (days/months/years)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <button
                type="button"
                onClick={calculateSavings}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
              >
                Calculate Goal
              </button>
              {totalSavings > 0 && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md text-center">
                  <h3 className="text-lg font-bold">Total Savings: ₹{totalSavings.toLocaleString()}</h3>
                  <p className="mt-2 text-sm text-gray-700">{suggestion}</p>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
              >
                Add Goal
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Savings Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Amount (₹)</TableHead>
              <TableHead>Saved Amount (₹)</TableHead>
              <TableHead>Starting Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Total Amount (₹)</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {savings.length > 0 ? (
              savings.map((saving) => (
                <TableRow key={saving.id}>
                  <TableCell>{saving.name}</TableCell>
                  <TableCell>{saving.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {saving.totalsavedAmount && saving.totalsavedAmount.toLocaleString()}
                      <Button onClick={()=>handleopenSavedlist(saving.id)}> Saved </Button>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(saving.date).toLocaleDateString()}</TableCell>
                  <TableCell>{saving.duration}{saving.frequency == "daily" ? "days" : saving.frequency == "monthly" ? "months" : saving.frequency == "yearly" ? "years" : ""}</TableCell>
                  <TableCell>{(saving.totalAmount ?? 0).toLocaleString()}</TableCell>
                  <TableCell className="px-4 py-2">
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center p-4">
                  No savings added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={openSavedList.open} onOpenChange={(value) => setOpensavedList({ id: openSavedList.id, open: value })}>
        <DialogContent className="max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View All Saved Amount</DialogTitle>
          </DialogHeader>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {savedlist.length !== 0 ? (
                savedlist.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.amount}</td>
                      <td className="px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {item.status}
                          {item.status !== "saved" && (
                            <Button onClick={() => handleSave(item.savingId, item.id, item.amount)}>
                              Save
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">No results found</td>
                </tr>
              )}
            </tbody>
          </table>
        </DialogContent>
      </Dialog>
    </div>
  );
}
