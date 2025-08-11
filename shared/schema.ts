import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// USER MODEL
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  profileImage: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// BOOK MODEL
export const bookConditions = ["Like New", "Very Good", "Good", "Acceptable"] as const;
export const bookFormats = ["Hardcover", "Paperback", "Boxed Set"] as const;
export const bookCategories = ["Fiction", "Non-Fiction", "Fantasy", "Sci-Fi", "Romance", "Mystery", "Children", "History", "Biography", "Self-Help"] as const;

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  condition: text("condition").notNull().$type<typeof bookConditions[number]>(),
  format: text("format").notNull().$type<typeof bookFormats[number]>(),
  category: text("category").notNull().$type<typeof bookCategories[number]>(),
  imageUrl: text("image_url").notNull(),
  additionalImages: text("additional_images").array(),
  sellerId: integer("seller_id").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertBookSchema = createInsertSchema(books).pick({
  title: true,
  author: true,
  description: true,
  price: true,
  condition: true,
  format: true,
  category: true,
  imageUrl: true,
  additionalImages: true,
  sellerId: true,
  inStock: true
});

export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

// CART ITEM MODEL
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  bookId: true,
  quantity: true
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// ORDER MODEL
export const orderStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const;

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().$type<typeof orderStatuses[number]>().default("Pending"),
  total: doublePrecision("total").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  status: true,
  total: true,
  shippingAddress: true
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// ORDER ITEM MODEL
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  bookId: integer("book_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  bookId: true,
  quantity: true,
  price: true
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
