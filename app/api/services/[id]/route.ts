import { db } from "@/db";
import { eq } from "drizzle-orm";
import { services } from "@/db/schema/services";
import { NextResponse } from "next/server";

/**
 * Update a service
 * @param {Request} req
 * @param {Object} params
 * @returns {Promise<NextResponse>}
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { businessId, serviceCatalogId } = await req.json();
  const service = await db
    .update(services)
    .set({ businessId, serviceCatalogId })
    .where(eq(services.id, id));
  return NextResponse.json({ service });
}
