// Sistema de autenticação alternativo para PostgreSQL padrão
// Substitua server/replitAuth.ts por este conteúdo quando usar PostgreSQL fora do Replit

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import * as bcrypt from "bcrypt";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Configuração de sessão com PostgreSQL
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 semana
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true, // Cria tabela automaticamente
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-here-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true, // HTTPS é obrigatório com SameSite='none'
      maxAge: sessionTtl,
      sameSite: 'none', // Permite que o cookie seja enviado de diferentes domínios (necessário para o Render)
    },
  });
}

// Middleware para verificar autenticação
export const isAuthenticated: RequestHandler = (req, res, next) => {
  console.log(`[Auth Check] Path: ${req.path}, Authenticated: ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) {
    console.log('[Auth Check] User is authenticated, proceeding.');
    return next();
  }
  console.log('[Auth Check] User is not authenticated, sending 401.');
  res.status(401).json({ message: "Unauthorized" });
};


// Configuração de autenticação local
export async function setupAuth(app: Express) {
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Estratégia de autenticação local (email/senha)
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Email não encontrado' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash || '');
        if (!isValid) {
          return done(null, false, { message: 'Senha incorreta' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Rotas de autenticação
  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: 'Erro interno do servidor' });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Credenciais inválidas' });
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao fazer login' });
        }
        return res.json({ message: 'Login realizado com sucesso', user });
      });
    })(req, res, next);
  });

  app.post('/api/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Verificar se o usuário já existe
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso' });
      }

      // Hash da senha
      const passwordHash = await bcrypt.hash(password, 10);

      // Criar usuário
      const user = await storage.createUser({
        email,
        passwordHash,
        firstName,
        lastName,
        permission: 1, // Usuário normal
      });

      // Fazer login automaticamente
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Usuário criado, mas erro ao fazer login' });
        }
        return res.json({ message: 'Usuário criado e logado com sucesso', user });
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.post('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao fazer logout' });
      }
      res.json({ message: 'Logout realizado com sucesso' });
    });
  });
}
