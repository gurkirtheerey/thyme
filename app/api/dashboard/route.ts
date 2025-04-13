import { db } from "@/db";
import { businesses } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type NewBusiness = typeof businesses.$inferInsert;

export async function POST() {
  const user = await auth.api.getSession({
    headers: await headers(),
  });
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const newBusiness: NewBusiness = {
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
