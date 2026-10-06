CREATE TABLE `materials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	`name` text NOT NULL,
	`description` text,
	`material_type_id` integer NOT NULL,
	FOREIGN KEY (`material_type_id`) REFERENCES `material_types`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `materials_type_name_unique` ON `materials` (`material_type_id`,`name`) WHERE "materials"."deleted_at" IS NULL;--> statement-breakpoint
CREATE TABLE `material_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `material_types_name_unique` ON `material_types` (`name`) WHERE "material_types"."deleted_at" IS NULL;--> statement-breakpoint
CREATE TABLE `material_usages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	`product_item_id` integer NOT NULL,
	`material_variant_id` integer NOT NULL,
	`actual_quantity` integer NOT NULL,
	FOREIGN KEY (`product_item_id`) REFERENCES `product_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`material_variant_id`) REFERENCES `material_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `material_variants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	`name` text NOT NULL,
	`unit` text NOT NULL,
	`material_id` integer NOT NULL,
	FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `material_variants_material_name_unique` ON `material_variants` (`material_id`,`name`) WHERE "material_variants"."deleted_at" IS NULL;--> statement-breakpoint
CREATE TABLE `product_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	`product_template_id` integer NOT NULL,
	`notes` text,
	`modifications` text,
	`actual_production_work_hours` integer,
	`additional_cost` integer,
	FOREIGN KEY (`product_template_id`) REFERENCES `product_templates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `product_templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	`name` text NOT NULL,
	`description` text,
	`production_instructions` text,
	`drawing_description` text,
	`expected_production_work_hours` integer,
	`development_work_hours` integer
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	`work_hour_cost` integer DEFAULT 500 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	`name` text NOT NULL,
	`description` text,
	`url` text,
	`contact` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `suppliers_name_unique` ON `suppliers` (`name`) WHERE "suppliers"."deleted_at" IS NULL;--> statement-breakpoint
CREATE TABLE `supply_consumptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	`material_usage_id` integer NOT NULL,
	`supply_id` integer NOT NULL,
	`consumed_quantity` integer NOT NULL,
	FOREIGN KEY (`material_usage_id`) REFERENCES `material_usages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supply_id`) REFERENCES `supplies`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `supplies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	`description` text,
	`purchase_price` integer NOT NULL,
	`quantity` integer NOT NULL,
	`url` text,
	`material_variant_id` integer NOT NULL,
	`supplier_id` integer,
	FOREIGN KEY (`material_variant_id`) REFERENCES `material_variants`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "supplies_quantity_positive" CHECK("supplies"."quantity" > 0),
	CONSTRAINT "supplies_purchase_price_non_negative" CHECK("supplies"."purchase_price" >= 0)
);
