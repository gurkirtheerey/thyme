import { db } from "@/db";
import {
  businesses as businessesTable,
  clients as clientsTable,
  user as userTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Business, User, Client } from "@/db/schema";

/**
 * Get user and their data based on role
 * @returns User and their data - User
 */
export async function GET() {
  const userSession = await auth.api.getSession({
    headers: await headers(),
  });
  if (!userSession) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = userSession.user.id;

  const user_response: User[] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId));

  const user = user_response[0];

  if (user.role === "client") {
    // call client api
    const businesses_response: Business[] = await db
      .select()
      .from(businessesTable);

    const businesses = businesses_response;

    return NextResponse.json({ user, businesses });
  } else {
    // call business api
    const business_response: Business[] = await db
      .select()
      .from(businessesTable)
      .where(eq(businessesTable.userId, userId));

    if (business_response.length === 0) {
      return NextResponse.json({ user, business: null, clients: [] });
    }

    const clients: Client[] = await db
      .select()
      .from(clientsTable)
      .where(eq(clientsTable.businessId, business_response[0].id));

    const business = business_response[0];
    return NextResponse.json({ user, business, clients });
  }
}

/**
 * Create a new business
 * @returns New business - Business
 */
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

  await db.insert(businessesTable).values(newBusiness);

  return NextResponse.json(newBusiness);
}
