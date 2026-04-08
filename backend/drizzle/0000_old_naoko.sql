CREATE TABLE `material` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`material_type_id` integer,
	`deleted` integer DEFAULT false,
	FOREIGN KEY (`material_type_id`) REFERENCES `material_type`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `material_name_unique` ON `material` (`name`);--> statement-breakpoint
CREATE TABLE `material_type` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `material_type_name_unique` ON `material_type` (`name`);--> statement-breakpoint
CREATE TABLE `material_variant` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`variant` text NOT NULL,
	`photo_url` text,
	`material_id` integer NOT NULL,
	`deleted` integer DEFAULT false,
	FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `material_variant_variant_unique` ON `material_variant` (`variant`);--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`work_hour_cost` integer DEFAULT 500 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `supplier` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`description` text,
	`supplier` text NOT NULL,
	`supply_url` text,
	`deleted` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `supply` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer,
	`created_at` integer NOT NULL,
	`description` text,
	`unit` text,
	`price` integer,
	`count` integer,
	`material_variant_id` integer NOT NULL,
	`supplier_id` integer,
	FOREIGN KEY (`material_variant_id`) REFERENCES `material_variant`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON UPDATE no action ON DELETE no action
);
