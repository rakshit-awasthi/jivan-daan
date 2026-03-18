import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("donor"),
  bloodGroup: text("blood_group").notNull(),
  location: text("location").notNull(),
  pinCode: text("pin_code"),
  image: text("image"),
  hospitalName: text("hospital_name"),
  contact: text("contact"),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
