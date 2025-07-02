import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  comments: text("comments"),
  context: text("context"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  name: true,
  description: true,
  comments: true,
  context: true,
}).extend({
  name: z.string().min(1, "Item name is required").max(50, "Item name cannot exceed 50 characters"),
  description: z.string().min(1, "Description is required").max(200, "Description cannot exceed 200 characters"),
  comments: z.string().max(1000, "Comments cannot exceed 1000 characters").optional(),
  context: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
