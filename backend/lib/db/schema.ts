import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  deviceId: text("device_id").unique().notNull(),
  subscriptionTier: text("subscription_tier").default("free").notNull(),
  subscriptionExpiresAt: timestamp("subscription_expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const scanUsage = pgTable(
  "scan_usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    scanType: text("scan_type").notNull(), // 'photo' | 'description' | 'barcode'
    modelUsed: text("model_used"), // 'haiku' | 'sonnet'
    tokensUsed: integer("tokens_used").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_scan_usage_user_date").on(table.userId, table.createdAt),
  ]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ScanUsage = typeof scanUsage.$inferSelect;
export type NewScanUsage = typeof scanUsage.$inferInsert;
