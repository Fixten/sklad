DROP INDEX `materials_type_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `materials_type_name_unique` ON `materials` (`material_type_id`,"name" COLLATE NOCASE) WHERE "materials"."deleted_at" IS NULL;--> statement-breakpoint
DROP INDEX `material_types_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `material_types_name_unique` ON `material_types` ("name" COLLATE NOCASE) WHERE "material_types"."deleted_at" IS NULL;--> statement-breakpoint
DROP INDEX `material_variants_material_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `material_variants_material_name_unique` ON `material_variants` (`material_id`,"name" COLLATE NOCASE) WHERE "material_variants"."deleted_at" IS NULL;--> statement-breakpoint
DROP INDEX `suppliers_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `suppliers_name_unique` ON `suppliers` ("name" COLLATE NOCASE) WHERE "suppliers"."deleted_at" IS NULL;