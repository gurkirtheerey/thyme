import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { account, user, session, verification } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      account,
      user,
      session,
      verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
});
