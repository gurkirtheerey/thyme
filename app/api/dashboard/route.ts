import { db } from "@/db";
import { businesses } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Business } from "@/types/Business";
export async function GET() {
  const user = await auth.api.getSession({
    headers: await headers(),
  });
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userBusinesses: Business[] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.userId, user.user.id));

  return NextResponse.json(userBusinesses);
}

export async function POST() {
  const user = await auth.api.getSession({
    headers: await headers(),
  });
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const newBusiness = {
    name: "Test Business",
    description: "Test Description",
    address: "Test Address",
    phone: "Test Phone",
    website: "Test Website",
    userId: user.user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(businesses).values(newBusiness);

  return new Response("Business created", { status: 200 });
}
