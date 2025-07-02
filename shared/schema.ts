import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contexts = pgTable("contexts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull().default("#3b82f6"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  comments: text("comments"),
  contextId: integer("context_id").references(() => contexts.id),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContextSchema = createInsertSchema(contexts).omit({
  id: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  name: true,
  description: true,
  comments: true,
  contextId: true,
}).extend({
  name: z.string().min(1, "Item name is required").max(50, "Item name cannot exceed 50 characters"),
  description: z.string().min(1, "Description is required").max(200, "Description cannot exceed 200 characters"),
  comments: z.string().max(1000, "Comments cannot exceed 1000 characters").optional(),
  contextId: z.number().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContext = z.infer<typeof insertContextSchema>;
export type Context = typeof contexts.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Extended types for API responses
export type TaskWithContext = Task & {
  context?: Context;
};
