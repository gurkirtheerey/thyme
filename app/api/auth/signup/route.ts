import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, role } = await req.json();
  await db
    .update(user)
    .set({
      role,
    })
    .where(eq(user.email, email));
  return NextResponse.json({ message: "User role updated" });
}
