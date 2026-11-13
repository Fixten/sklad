DROP INDEX `materials_type_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `materials_type_name_unique` ON `materials` (`material_type_id`,trim("name") COLLATE NOCASE);--> statement-breakpoint
DROP INDEX `material_types_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `material_types_name_unique` ON `material_types` (trim("name") COLLATE NOCASE);--> statement-breakpoint
DROP INDEX `material_variants_material_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `material_variants_material_name_unique` ON `material_variants` (`material_id`,trim("name") COLLATE NOCASE);--> statement-breakpoint
DROP INDEX `suppliers_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `suppliers_name_unique` ON `suppliers` (trim("name") COLLATE NOCASE);--> statement-breakpoint
CREATE UNIQUE INDEX `product_templates_name_unique` ON `product_templates` (trim("name") COLLATE NOCASE);