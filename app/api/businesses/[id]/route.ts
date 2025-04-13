import { db } from "@/db";
import { businesses } from "@/db/schema";
import { Business } from "@/types/Business";
import { eq } from "drizzle-orm";

/**
 * Updates a business with the given id
 * @param req - The request object
 * @param params - The parameters object
 * @returns A response object
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body: Business = await req.json();

  // Convert dates to Date objects
  const business = {
    ...body,
    createdAt: new Date(body.createdAt),
    updatedAt: new Date(), // Always update the updatedAt timestamp
  };

  await db.update(businesses).set(business).where(eq(businesses.id, params.id));

  return new Response("Business updated", { status: 200 });
}
