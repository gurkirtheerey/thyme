import { db } from "@/db";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { businesses, events } from "@/db/schema";
import { headers } from "next/headers";
/**
 * Get all events for a business
 * @param request
 * @returns all events for a business and the business
 */
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

  const allEvents = await db.query.events.findMany({
    where: eq(events.businessId, business.id),
  });
  return NextResponse.json({ business, events: allEvents });
}

/**
 * Create a new event
 * @param request
 * @returns the new event
 */
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Convert string dates to Date objects
    const eventData = {
      ...body,
      start: body.start ? new Date(body.start) : undefined,
      end: body.end ? new Date(body.end) : undefined,
    };

    const event = await db.insert(events).values(eventData);
    return NextResponse.json({ event });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

/**
 * Delete an event
 * @param request
 * @returns all events for a business
 */
export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await db.delete(events).where(eq(events.id, body.id));

  const allEvents = await db.query.events.findMany({
    where: eq(events.businessId, body.businessId),
  });

  allEvents.forEach((event) => {
    return {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    };
  });

  return NextResponse.json({ events: allEvents });
}
