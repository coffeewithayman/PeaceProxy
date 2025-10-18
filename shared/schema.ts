import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromPhone: text("from_phone").notNull(),
  toPhone: text("to_phone").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull(),
  moderationResult: text("moderation_result"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

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
