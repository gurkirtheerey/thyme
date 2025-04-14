import { db } from "@/db";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { businesses } from "@/db/schema";
import { headers } from "next/headers";
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const business = await db.query.businesses.findFirst({
    where: eq(businesses.userId, session.user.id),
  });
  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  console.log("business", business);

  //   const events = await db.query.event.findMany({
  //     where: eq(event.businessId, business.id),
  //   });
  return NextResponse.json({ business });
}
