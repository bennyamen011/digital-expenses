// /app/api/signup/route.ts

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: { username, email, password: password },
    });
    return NextResponse.json({ message: "User created successfully", user },{ status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `User already exists or invalid data ${error}` }, { status: 400 });
  }
}
