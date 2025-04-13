import { db } from "@/db";
import { businesses } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Business } from "@/types/Business";

/**
 * Creates a new business
 * @param req - The request object
 * @returns The created business
 */
export async function POST(req: Request) {
  const userSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!userSession) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body: Omit<Business, "id" | "createdAt" | "updatedAt"> =
    await req.json();

  const newBusiness = {
    ...body,
    userId: userSession.user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [createdBusiness] = await db
    .insert(businesses)
    .values(newBusiness)
    .returning();

  return NextResponse.json(createdBusiness);
}
