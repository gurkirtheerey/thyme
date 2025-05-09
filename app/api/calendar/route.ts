import { db } from "@/db";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { businesses, events, clients } from "@/db/schema";
import { headers } from "next/headers";
/**
 * Get all events for a business
 * @param request
 * @returns all clients and events for a business
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

  const allClients = await db.query.clients.findMany({
    where: eq(clients.businessId, business.id),
  });

  const allEvents = await db.query.events.findMany({
    where: eq(events.businessId, business.id),
  });
  return NextResponse.json({
    business,
    events: allEvents,
    clients: allClients,
  });
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

    // Get the business ID from the request body
    const { businessId, start, end } = eventData;

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    // Check if there are any events that overlap with the new event's time range
    const overlappingEvents = await db.query.events.findMany({
      where: (eventTable, { and, eq, or, gt, lt }) => {
        return and(
          eq(eventTable.businessId, businessId),
          or(
            // Event starts before new event ends AND ends after new event starts
            and(lt(eventTable.start, end), gt(eventTable.end, start))
          )
        );
      },
    });

    if (overlappingEvents.length > 0) {
      return NextResponse.json(
        { error: "There is already an event scheduled during this time" },
        { status: 409 }
      );
    }

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
