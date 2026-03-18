import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const hospitalsTable = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  contact: text("contact").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertHospitalSchema = createInsertSchema(hospitalsTable).omit({ id: true, createdAt: true });
export type InsertHospital = z.infer<typeof insertHospitalSchema>;
export type Hospital = typeof hospitalsTable.$inferSelect;
