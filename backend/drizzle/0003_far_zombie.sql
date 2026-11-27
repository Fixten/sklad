CREATE TABLE `template_materials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	`product_template_id` integer NOT NULL,
	`material_variant_id` integer NOT NULL,
	`default_quantity` integer NOT NULL,
	FOREIGN KEY (`product_template_id`) REFERENCES `product_templates`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`material_variant_id`) REFERENCES `material_variants`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "template_materials_default_quantity_positive" CHECK("template_materials"."default_quantity" > 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `template_materials_template_variant_unique` ON `template_materials` (`product_template_id`,`material_variant_id`);