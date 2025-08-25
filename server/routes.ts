import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertCardSchema, insertTrainingSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, (req: any, res) => {
    // O middleware isAuthenticated garante que req.user está definido.
    // O passport.deserializeUser já buscou o usuário do banco.
    res.json(req.user);
  });

  // Card routes
  app.get('/api/cards', async (req, res) => {
    try {
      const cards = await storage.getCards();
      res.json(cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  app.get('/api/cards/:id', async (req, res) => {
    try {
      const card = await storage.getCard(req.params.id);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      console.error("Error fetching card:", error);
      res.status(500).json({ message: "Failed to fetch card" });
    }
  });

  // Admin-only card management routes
  app.post('/api/cards', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user; // O usuário já está em req.user
      
      if (!user || user.permission !== 10) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const cardData = insertCardSchema.parse(req.body);
      const card = await storage.createCard(cardData);
      res.status(201).json(card);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid card data", errors: error.errors });
      }
      console.error("Error creating card:", error);
      res.status(500).json({ message: "Failed to create card" });
    }
  });

  app.put('/api/cards/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user; // O usuário já está em req.user
      
      if (!user || user.permission !== 10) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const cardData = insertCardSchema.partial().parse(req.body);
      const card = await storage.updateCard(req.params.id, cardData);
      res.json(card);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid card data", errors: error.errors });
      }
      console.error("Error updating card:", error);
      res.status(500).json({ message: "Failed to update card" });
    }
  });

  app.delete('/api/cards/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user; // O usuário já está em req.user
      
      if (!user || user.permission !== 10) {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteCard(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting card:", error);
      res.status(500).json({ message: "Failed to delete card" });
    }
  });

  // Training session routes
  app.post('/api/training-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id; // O ID do usuário vem de req.user
      const sessionData = insertTrainingSessionSchema.parse({
        ...req.body,
        userId,
      });
      
      const session = await storage.createTrainingSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      console.error("Error creating training session:", error);
      res.status(500).json({ message: "Failed to create training session" });
    }
  });

  app.get('/api/training-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id; // O ID do usuário vem de req.user
      const sessions = await storage.getTrainingSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching training sessions:", error);
      res.status(500).json({ message: "Failed to fetch training sessions" });
    }
  });

  app.get('/api/leaderboard/:mode', async (req, res) => {
    try {
      const { mode } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const topScores = await storage.getTopScores(mode, limit);
      res.json(topScores);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Clash Royale API proxy routes

  app.get('/api/clash-royale/players/:playerTag', async (req, res) => {
    try {
      const { playerTag } = req.params;
      const apiKey = process.env.CLASH_ROYALE_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ message: "Clash Royale API key not configured" });
      }

      const encodedTag = encodeURIComponent(playerTag);
      const response = await fetch(`https://api.clashroyale.com/v1/tournaments?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Clash Royale API error: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) { // Explicitly type error as any for easier access to properties
      console.error("Error fetching player:", error);
      // Attempt to parse the error message from the Clash Royale API
      let errorMessage = "Failed to fetch player";
      let statusCode = 500;

      if (error.message && error.message.startsWith("Clash Royale API error:")) {
        // Extract status code from "Clash Royale API error: 403"
        const match = error.message.match(/Clash Royale API error: (\d+)/);
        if (match && match[1]) {
          statusCode = parseInt(match[1], 10);
        }
        // Use the original error message from the API
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      res.status(statusCode).json({ message: errorMessage });
    }
  });

  app.get('/api/clash-royale/tournaments', async (req, res) => {
    try {
      const { name } = req.query;
      const apiKey = process.env.CLASH_ROYALE_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ message: "Clash Royale API key not configured" });
      }

      const searchParams = new URLSearchParams();
      if (name) searchParams.append('name', name as string);

      const response = await fetch(`https://api.clashroyale.com/v1/clans?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Clash Royale API error: ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) { // Explicitly type error as any for easier access to properties
      console.error("Error fetching tournaments:", error);
      // Attempt to parse the error message from the Clash Royale API
      let errorMessage = "Failed to fetch tournaments";
      let statusCode = 500;

      if (error.message && error.message.startsWith("Clash Royale API error:")) {
        // Extract status code from "Clash Royale API error: 403"
        const match = error.message.match(/Clash Royale API error: (\d+)/);
        if (match && match[1]) {
          statusCode = parseInt(match[1], 10);
        }
        // Use the original error message from the API
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      res.status(statusCode).json({ message: errorMessage });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
