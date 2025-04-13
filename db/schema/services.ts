import { pgTable, uuid, text, numeric } from "drizzle-orm/pg-core";
import { businesses } from "./businesses";

export const serviceCatalog = pgTable("service_catalog", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  serviceCatalogId: uuid("service_catalog_id").references(
    () => serviceCatalog.id
  ),
  description: text("description"),
  price: numeric("price").notNull(),
});

export type Service = typeof services.$inferSelect;
export type ServiceCatalog = typeof serviceCatalog.$inferSelect;
