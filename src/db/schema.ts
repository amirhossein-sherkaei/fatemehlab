import { pgTable, text, timestamp, integer, boolean, uuid, jsonb, index } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sku: text("sku").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => categories.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sku: text("sku").unique(),
  brand: text("brand"),
  countryOfOrigin: text("country_of_origin"),
  description: text("description"),
  price: integer("price").notNull().default(0),
  compareAtPrice: integer("compare_at_price"),
  stock: integer("stock").notNull().default(0),
  status: text("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  mainImage: text("main_image"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  specifications: jsonb("specifications").$type<{ key: string; value: string }[]>().default([]),
  ingredients: text("ingredients"),
  usage: text("usage"),
  skinType: text("skin_type"),
  warnings: text("warnings"),
  expiryDate: text("expiry_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  brandIdx: index("products_brand_idx").on(table.brand),
  statusIdx: index("products_status_idx").on(table.status),
  categoryIdx: index("products_category_idx").on(table.categoryId),
}));

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  avatar: text("avatar"),
  loyaltyPoints: integer("loyalty_points").notNull().default(0),
  tier: text("tier").notNull().default("bronze"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  phoneIdx: index("customers_phone_idx").on(table.phone),
}));

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  title: text("title").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  province: text("province").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  postalCode: text("postal_code").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  customerIdx: index("addresses_customer_idx").on(table.customerId),
}));

export const wishlist = pgTable("wishlist", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  customerIdx: index("wishlist_customer_idx").on(table.customerId),
}));

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  notes: text("notes"),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  trackingCode: text("tracking_code").notNull().unique().default("FL-PENDING"),
  paymentAuthority: text("payment_authority"),
  paymentRefId: text("payment_ref_id"),
  couponCode: text("coupon_code"),
  discountAmount: integer("discount_amount").notNull().default(0),
  usedPoints: integer("used_points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  customerIdx: index("orders_customer_idx").on(table.customerId),
  statusIdx: index("orders_status_idx").on(table.status),
  trackingCodeIdx: index("orders_tracking_idx").on(table.trackingCode),
}));

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  productName: text("product_name").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
}, (table) => ({
  orderIdx: index("order_items_order_idx").on(table.orderId),
  productIdx: index("order_items_product_idx").on(table.productId),
}));

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: text("category").notNull().default("education"),
  coverImage: text("cover_image"),
  status: text("status").notNull().default("draft"),
  readTime: text("read_time").default("۵ دقیقه"),
  author: text("author").default("تیم فاطمه بیوتی لند"),
  featured: boolean("featured").notNull().default(false),
  editorsPick: boolean("editors_pick").notNull().default(false),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("articles_status_idx").on(table.status),
  categoryIdx: index("articles_category_idx").on(table.category),
}));

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  name: text("name").notNull(),
  email: text("email"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  verifiedPurchase: boolean("verified_purchase").notNull().default(false),
  helpfulCount: integer("helpful_count").notNull().default(0),
  notHelpfulCount: integer("not_helpful_count").notNull().default(0),
  adminReply: text("admin_reply"),
  adminReplyAt: timestamp("admin_reply_at"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  productIdx: index("reviews_product_idx").on(table.productId),
  statusIdx: index("reviews_status_idx").on(table.status),
}));

export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  subject: text("subject").notNull(),
  category: text("category").notNull().default("other"),
  status: text("status").notNull().default("open"),
  unreadByCustomer: integer("unread_by_customer").notNull().default(0),
  unreadByAdmin: integer("unread_by_admin").notNull().default(1),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  customerIdx: index("tickets_customer_idx").on(table.customerId),
  statusIdx: index("tickets_status_idx").on(table.status),
}));

export const supportMessages = pgTable("support_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketId: uuid("ticket_id").references(() => supportTickets.id, { onDelete: 'cascade' }).notNull(),
  senderType: text("sender_type").notNull(),
  senderName: text("sender_name").notNull(),
  message: text("message").notNull(),
  attachmentUrl: text("attachment_url"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  ticketIdx: index("messages_ticket_idx").on(table.ticketId),
}));

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  type: text("type").notNull().default("percent"),
  value: integer("value").notNull(),
  minOrderAmount: integer("min_order_amount").notNull().default(0),
  maxDiscountAmount: integer("max_discount_amount"),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").notNull().default(0),
  startsAt: timestamp("starts_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stockNotifications = pgTable("stock_notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: 'cascade' }).notNull(),
  phoneOrEmail: text("phone_or_email").notNull(),
  status: text("status").notNull().default("pending"), // pending | notified
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  productIdx: index("stock_notify_product_idx").on(table.productId),
  statusIdx: index("stock_notify_status_idx").on(table.status),
}));