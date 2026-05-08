CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_name_not_empty" CHECK (length(trim("categories"."name")) > 0)
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category_id" text,
	"stock" integer DEFAULT 0 NOT NULL,
	"minimum_stock" integer DEFAULT 20 NOT NULL,
	"unit" text NOT NULL,
	"package_size" text,
	"purchase_price" integer DEFAULT 0 NOT NULL,
	"selling_price" integer NOT NULL,
	"photo_url" text,
	"storage_location" text,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "items_name_unique" UNIQUE("name"),
	CONSTRAINT "items_name_not_empty" CHECK (length(trim("items"."name")) > 0),
	CONSTRAINT "items_unit_not_empty" CHECK (length(trim("items"."unit")) > 0),
	CONSTRAINT "items_stock_non_negative" CHECK ("items"."stock" >= 0),
	CONSTRAINT "items_minimum_stock_non_negative" CHECK ("items"."minimum_stock" >= 0),
	CONSTRAINT "items_purchase_price_non_negative" CHECK ("items"."purchase_price" >= 0),
	CONSTRAINT "items_selling_price_non_negative" CHECK ("items"."selling_price" >= 0)
);
--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categories_name_idx" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "items_name_idx" ON "items" USING btree ("name");--> statement-breakpoint
CREATE INDEX "items_category_id_idx" ON "items" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "items_stock_idx" ON "items" USING btree ("stock");