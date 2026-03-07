import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";

// Admin roles
export const adminRoleEnum = pgEnum("admin_role", [
  "super_admin",
  "admin",
  "viewer",
]);

// App users (iOS devices)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  deviceId: text("device_id").unique().notNull(),
  pushToken: text("push_token"),
  subscriptionTier: text("subscription_tier").default("free").notNull(),
  subscriptionExpiresAt: timestamp("subscription_expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// AI scan usage tracking
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

// Admin users (dashboard access)
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: adminRoleEnum("role").default("viewer").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  author: text("author").default("NourishAI Team").notNull(),
  category: text("category").default("nutrition").notNull(),
  tags: text("tags"), // comma-separated
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ScanUsage = typeof scanUsage.$inferSelect;
export type NewScanUsage = typeof scanUsage.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
