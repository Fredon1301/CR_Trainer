// Schema expandido para PostgreSQL com autenticação local
// Use este schema quando não estiver usando Replit Auth

import { sql } from 'drizzle-orm';
import { z } from 'zod';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
} from "drizzle-orm/pg-core";

// Tabela de sessões (obrigatória para autenticação)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Tabela de usuários expandida para autenticação local
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(), // Para autenticação local
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  permission: integer("permission").default(1), // 1=normal, 10=admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela de cartas do Clash Royale
export const cards = pgTable("cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  nameEn: varchar("name_en").notNull(),
  elixirCost: integer("elixir_cost").notNull(),
  type: varchar("type").notNull(), // spell, troop, building
  rarity: varchar("rarity").notNull(), // common, rare, epic, legendary
  imageUrl: varchar("image_url"),
  description: text("description"),
  descriptionEn: text("description_en"),
  hitpoints: integer("hitpoints"),
  damage: integer("damage"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela de sessões de treinamento
export const trainingSessions = pgTable("training_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  mode: varchar("mode").notNull(), // 'grid' ou 'simulation'
  score: integer("score").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  timeElapsed: integer("time_elapsed"), // em segundos
  createdAt: timestamp("created_at").defaultNow(),
});

// Tipos TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Card = typeof cards.$inferSelect;
export type InsertCard = typeof cards.$inferInsert;
export type TrainingSession = typeof trainingSessions.$inferSelect;
export type InsertTrainingSession = typeof trainingSessions.$inferInsert;

// Zod Schemas for validation
export const insertCardSchema = z.object({
  name: z.string(),
  nameEn: z.string(),
  elixirCost: z.number().int(),
  type: z.string(),
  rarity: z.string(),
  imageUrl: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  hitpoints: z.number().int().optional().nullable(),
  damage: z.number().int().optional().nullable(),
});

export const insertTrainingSessionSchema = z.object({
  userId: z.string(),
  mode: z.string(),
  score: z.number().int(),
  correctAnswers: z.number().int(),
  totalQuestions: z.number().int(),
  timeElapsed: z.number().int().optional().nullable(),
});
