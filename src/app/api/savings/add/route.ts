import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, amount, date, totalAmount, duration, frequency } =
      await req.json();

    if (!name || !amount || !totalAmount || !duration || !frequency) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Add this in .env.local
        pass: process.env.EMAIL_PASS // Add this in .env.local
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "bennyamenasirvatham@gmail.com",
      subject: "Your Savings Entry Confirmation & Suggestions",
      html: `
        <h2>Hello,</h2>
        <p>You've successfully added a new savings entry:</p>
        <ul>
          <li>Name: ${name}</li>
          <li>Type: ${frequency}</li>
          <li>Amount: ${amount}</li>
          <li>Starting Date: ${date}</li>
          <li>Total Amount:${totalAmount}</li>
        </ul>
        <h3>Suggestions:</h3>
        <p>💡 Consider investing in Mutual Funds for better long-term growth.</p>
        <p>📊 Diversify your savings across Stocks, FD, and Real Estate.</p>
      `
    };
    const result = await prisma.$transaction(async (prisma) => {
      // Create the Saving entry
      const saving = await prisma.saving.create({
        data: {
          name,
          amount,
          date,
          duration,
          totalsavedAmount:amount || 0,
          frequency,
          totalAmount
        }
      });

      // Generate a list of saved records
      const savedList = Array.from({ length: duration }, (_, i) => ({
        savingId: saving.id,
        name: saving.name,
        amount: saving.amount,
        date: new Date(new Date(date).getTime() + i * 24 * 60 * 60 * 1000), // Incrementing date
        status: i === 0 ? "saved" : "pending" // First one is saved, rest are pending
      }));

      // Insert saved list into database
      await prisma.saved.createMany({
        data: savedList
      });

      return saving;
    });
    // await transporter.sendMail(mailOptions);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
