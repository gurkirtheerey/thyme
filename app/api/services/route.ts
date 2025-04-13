import { NextResponse } from "next/server";
import { db } from "@/db";
import { serviceCatalog, services } from "@/db/schema/services";

/**
 * Get all services
 * @returns {Promise<NextResponse>}
 */
export async function GET() {
  const services = await db.select().from(serviceCatalog);
  return NextResponse.json({ services });
}

/**
 * Create a new service
 * @param {Request} req
 * @returns {Promise<NextResponse>}
 */
export async function POST(req: Request) {
  const { businessId, serviceCatalogId } = await req.json();
  const service = await db.insert(services).values({
    businessId,
    serviceCatalogId,
    price: "0",
    description: "",
  });
  return NextResponse.json({ service });
}
