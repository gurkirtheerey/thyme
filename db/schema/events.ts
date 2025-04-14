import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { businesses } from "./businesses";
import { clients } from "./clients";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  notes: text("notes"),
  allDay: boolean("all_day").notNull().default(false),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Event = typeof events.$inferSelect;
