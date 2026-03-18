import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const requestsTable = pgTable("blood_requests", {
  id: serial("id").primaryKey(),
  bloodGroup: text("blood_group").notNull(),
  location: text("location").notNull(),
  urgency: text("urgency").notNull().default("normal"),
  patientName: text("patient_name").notNull(),
  units: integer("units").notNull().default(1),
  contactNumber: text("contact_number").notNull(),
  description: text("description"),
  createdBy: text("created_by").notNull(),
  createdByName: text("created_by_name").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRequestSchema = createInsertSchema(requestsTable).omit({ id: true, createdAt: true });
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type BloodRequest = typeof requestsTable.$inferSelect;
