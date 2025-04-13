import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { serviceCatalog } from "./services";

export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address"),
  phone: text("phone"),
  website: text("website"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  serviceCatalogId: uuid("service_catalog_id").references(
    () => serviceCatalog.id,
    {
      onDelete: "cascade",
    }
  ),
});

export type Business = typeof businesses.$inferSelect;
