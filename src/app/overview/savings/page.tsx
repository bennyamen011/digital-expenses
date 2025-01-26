"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Saving {
  id: string;
  scheme: string;
  amount: number;
  years: number; 
  maturityAmount: number;
}

export default function SavingsPage() {
  const [scheme, setScheme] = useState<string>("FD");
  const [amount, setAmount] = useState<string>("");
  const [interestRate, setRate] = useState<string>("");
  const [years, setYears] = useState<string>("");
  const [savings, setSavings] = useState<Saving[]>([]);
  const [open, setOpen] = useState(false);

  const calculateSIP = (amount: number, rate: number, months: number): number => {
    const monthlyRate = rate / 12 / 100;
    const maturityAmount =
      (amount * ((1 + monthlyRate) ** months - 1) * (1 + monthlyRate)) /
      monthlyRate;
    return parseFloat(maturityAmount.toFixed(2));
  };

  const calculateResults = () => {
    const principal = parseFloat(amount || "0");
    const rate = parseFloat(interestRate || "0");
    const months = parseInt(years) * 12;

    if (principal && rate && months) {
      const maturityAmount = calculateSIP(principal, rate, months);
      return {
        investedAmount: principal * months, // Total principal over the period
        estimatedReturns: maturityAmount - principal * (months / 12), // Returns only
      };
    }
    return { investedAmount: 0, estimatedReturns: 0 };
  };

  const handleAddSaving = () => {
    const id = crypto.randomUUID();
    const principal = parseFloat(amount);
    const months = parseInt(years) * 12;
    const rate = parseFloat(interestRate);
    const maturityAmount = calculateSIP(principal, rate, months);

    setSavings((prev) => [
      ...prev,
      { id, scheme, amount: principal, years: months, maturityAmount },
    ]);

    // Reset fields
    setAmount("");
    setYears("12");
    setScheme("FD");
    setRate("");
    setOpen(false);
  };

  const { investedAmount, estimatedReturns } = calculateResults();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Savings Overview</h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-bold">Total Savings</h2>
          <p className="text-2xl">
            ₹
            {savings
              .reduce((sum, saving) => sum + saving.amount, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-bold">Estimated Maturity</h2>
          <p className="text-2xl">
            ₹
            {savings
              .reduce((sum, saving) => sum + saving.maturityAmount, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add Savings Section */}
      <div className="mb-4 flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="p-2 bg-blue-500 rounded-lg">
            Add Savings
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="text-lg font-bold mb-4">Add New Saving</DialogTitle>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddSaving();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium">Scheme</label>
                <select
                  value={scheme}
                  onChange={(e) => setScheme(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="FD">Fixed Deposit (FD)</option>
                  <option value="Mutual Fund">Mutual Fund</option>
                  <option value="Stock">Stock</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Monthly Investment (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="e.g., 5000"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Expected Return Rate (p.a) (%)</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="e.g., 8"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Time Period (Years)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="e.g., 10"
                />
              </div>
              <div className="mb-4">
                <h3 className="font-bold">Results</h3>
                <div>Invested Amount: ₹{investedAmount.toLocaleString()}</div>
                <div>Estimated Returns: ₹{estimatedReturns.toLocaleString()}</div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Add Saving
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
              <TableHead>Scheme</TableHead>
              <TableHead>Amount (₹)</TableHead>
              <TableHead>Duration (Months)</TableHead>
              <TableHead>Maturity Amount (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {savings.length > 0 ? (
              savings.map((saving) => (
                <TableRow key={saving.id}>
                  <TableCell>{saving.scheme}</TableCell>
                  <TableCell>{saving.amount.toLocaleString()}</TableCell>
                  <TableCell>{saving.years}</TableCell>
                  <TableCell>{saving.maturityAmount.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No savings added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
