CREATE TABLE `campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`opens_at` integer,
	`closes_at` integer,
	`min_qty` integer,
	`price_table_json` text,
	`allowed_countries_json` text,
	`theme_json` text,
	`note` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `campaigns_slug_unique` ON `campaigns` (`slug`);--> statement-breakpoint
CREATE TABLE `countries` (
	`code` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`duties_type` text,
	`duties_value` real DEFAULT 0 NOT NULL,
	`duties_note` text,
	`shipping_json` text DEFAULT '[]' NOT NULL,
	`currency_display` text DEFAULT 'jpy' NOT NULL,
	`sort_order` integer DEFAULT 100 NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `countries_enabled_idx` ON `countries` (`enabled`);--> statement-breakpoint
CREATE TABLE `drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`front_key` text NOT NULL,
	`back_key` text,
	`design_json` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `drafts_created_idx` ON `drafts` (`created_at`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text,
	`stripe_session_id` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`quantity` integer NOT NULL,
	`country` text NOT NULL,
	`unit_jpy` integer NOT NULL,
	`back_addition_jpy` integer DEFAULT 0 NOT NULL,
	`subtotal_jpy` integer NOT NULL,
	`shipping_jpy` integer NOT NULL,
	`duties_jpy` integer NOT NULL,
	`total_jpy` integer NOT NULL,
	`currency_display` text DEFAULT 'jpy' NOT NULL,
	`charged_currency` text,
	`charged_amount` integer,
	`shipping_name` text,
	`shipping_address1` text,
	`shipping_address2` text,
	`shipping_city` text,
	`shipping_state` text,
	`shipping_postal` text,
	`shipping_country` text,
	`shipping_phone` text,
	`customer_email` text,
	`design_json` text NOT NULL,
	`preview_keys_json` text,
	`tracking_number` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_stripe_session_id_unique` ON `orders` (`stripe_session_id`);--> statement-breakpoint
CREATE INDEX `orders_status_idx` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `orders_created_idx` ON `orders` (`created_at`);--> statement-breakpoint
CREATE INDEX `orders_campaign_idx` ON `orders` (`campaign_id`);