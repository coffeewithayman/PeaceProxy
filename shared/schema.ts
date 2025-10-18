import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const parentPairs = pgTable("parent_pairs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone1: text("phone1").notNull(),
  phone2: text("phone2").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromPhone: text("from_phone").notNull(),
  toPhone: text("to_phone").notNull(),
  recipientPhone: text("recipient_phone").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull(),
  moderationResult: text("moderation_result"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertParentPairSchema = createInsertSchema(parentPairs).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertParentPair = z.infer<typeof insertParentPairSchema>;
export type ParentPair = typeof parentPairs.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type MessageStatus = "approved" | "blocked" | "pending";

export interface ModerationAnalysis {
  isAppropriate: boolean;
  issues: string[];
  suggestions: string[];
  tone: string;
  severity: "low" | "medium" | "high";
}
