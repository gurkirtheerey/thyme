ALTER TABLE "services" RENAME COLUMN "catalog_id" TO "service_catalog_id";--> statement-breakpoint
ALTER TABLE "services" DROP CONSTRAINT "services_catalog_id_service_catalog_id_fk";
--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_service_catalog_id_service_catalog_id_fk" FOREIGN KEY ("service_catalog_id") REFERENCES "public"."service_catalog"("id") ON DELETE no action ON UPDATE no action;