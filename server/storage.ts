// Versão expandida do storage para autenticação local com PostgreSQL
// Use esta versão quando não estiver usando Replit Auth

import {
  users,
  cards,
  trainingSessions,
  type User,
  type Card,
  type TrainingSession,
  type InsertUser,
  type InsertCard,
  type InsertTrainingSession,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // Operações de usuário - expandidas para autenticação local
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { passwordHash: string }): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Operações de cartas
  getCards(): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: string, updates: Partial<Card>): Promise<Card>;
  deleteCard(id: string): Promise<void>;
  
  // Operações de sessões de treinamento
  getTrainingSessions(userId: string): Promise<TrainingSession[]>;
  createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession>;
  getTopScores(mode: string, limit: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // Operações de usuário
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser & { passwordHash: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Operações de cartas
  async getCards(): Promise<Card[]> {
    return await db.select().from(cards).orderBy(cards.name);
  }

  async getCard(id: string): Promise<Card | undefined> {
    const [card] = await db.select().from(cards).where(eq(cards.id, id));
    return card;
  }

  async createCard(cardData: InsertCard): Promise<Card> {
    const [card] = await db.insert(cards).values(cardData).returning();
    return card;
  }

  async updateCard(id: string, updates: Partial<Card>): Promise<Card> {
    const [card] = await db
      .update(cards)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(cards.id, id))
      .returning();
    return card;
  }

  async deleteCard(id: string): Promise<void> {
    await db.delete(cards).where(eq(cards.id, id));
  }

  // Operações de sessões de treinamento
  async getTrainingSessions(userId: string): Promise<TrainingSession[]> {
    return await db
      .select()
      .from(trainingSessions)
      .where(eq(trainingSessions.userId, userId))
      .orderBy(desc(trainingSessions.createdAt));
  }

  async createTrainingSession(sessionData: InsertTrainingSession): Promise<TrainingSession> {
    const [session] = await db
      .insert(trainingSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  // Operação de Leaderboard
  async getTopScores(mode: string, limit: number): Promise<any[]> {
    // Retorna os melhores scores para um modo de jogo específico
    const result = await db
      .select({
        userId: trainingSessions.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        score: sql<number>`max(${trainingSessions.score})`.as("max_score"),
      })
      .from(trainingSessions)
      .leftJoin(users, eq(trainingSessions.userId, users.id))
      .where(eq(trainingSessions.mode, mode))
      .groupBy(trainingSessions.userId, users.firstName, users.lastName)
      .orderBy(desc(sql`max_score`))
      .limit(limit);

    return result;
  }
}

export const storage = new DatabaseStorage();
