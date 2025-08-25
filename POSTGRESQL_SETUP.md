# Configuração para PostgreSQL Padrão

Este documento explica como migrar a aplicação do Replit para um ambiente PostgreSQL padrão.

## Dependências Necessárias

Adicione estas dependências ao seu `package.json`:

```bash
npm install pg bcrypt
npm install --save-dev @types/pg @types/bcrypt
```

Remova as dependências específicas do Replit:
```bash
npm uninstall @neondatabase/serverless @replit/vite-plugin-runtime-error-modal @replit/vite-plugin-cartographer
```

## Arquivos a Substituir

### 1. Database Configuration

Substitua `server/db.ts` pelo conteúdo de `server/db.postgresql.ts`:

```typescript
// server/db.ts
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Example: postgresql://user:password@localhost:5432/dbname",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
export const db = drizzle({ client: pool, schema });
```

### 2. Vite Configuration

Substitua `vite.config.ts` pelo conteúdo de `vite.config.postgresql.ts`:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    port: 5173,
    host: "0.0.0.0",
  },
});
```

### 3. Authentication System

Para usar autenticação local (email/senha) em vez do Replit Auth:

1. Substitua `server/replitAuth.ts` por `server/auth.postgresql.ts`
2. Substitua `server/storage.ts` por `server/storage.postgresql.ts`
3. Substitua `shared/schema.ts` por `shared/schema.postgresql.ts`

### 4. Environment Variables

Configure estas variáveis de ambiente:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
SESSION_SECRET=your-very-secure-secret-key-here
NODE_ENV=development
```

### 5. Frontend Changes

Atualize os componentes de autenticação para usar login local:

```typescript
// Em vez de redirecionar para /api/login (OAuth)
window.location.href = '/api/login';

// Use formulário de login local
const loginForm = {
  email: 'user@example.com',
  password: 'password123'
};

await apiRequest('POST', '/api/login', loginForm);
```

## Setup do Banco de Dados

1. Instale PostgreSQL
2. Crie um banco de dados
3. Configure a DATABASE_URL
4. Execute as migrações:

```bash
npm run db:push
```

## Rotas de Autenticação

Com a autenticação local, você terá estas rotas:

- `POST /api/login` - Login com email/senha
- `POST /api/register` - Registro de nova conta
- `POST /api/logout` - Logout
- `GET /api/auth/user` - Dados do usuário logado

## Diferenças Principais

### Replit Auth vs Local Auth

| Recurso | Replit Auth | Local Auth |
|---------|-------------|------------|
| Login | OAuth/OpenID | Email/Senha |
| Registro | Automático | Manual |
| Dados do usuário | Do Replit | Do seu banco |
| Sessões | Replit gerencia | Você gerencia |

### Frontend Updates Necessários

1. Criar componentes de login/registro
2. Atualizar `useAuth` hook se necessário
3. Remover redirecionamentos OAuth
4. Adicionar validação de formulários

## Componentes de Login

Exemplo de componente de login:

```typescript
// client/src/components/LoginForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/queryClient';

export function LoginForm() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('POST', '/api/login', credentials);
      window.location.reload(); // Ou redirecionar
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        type="email" 
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
      />
      <Input 
        type="password" 
        placeholder="Senha"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
      />
      <Button type="submit">Login</Button>
    </form>
  );
}
```

Este setup permite que a aplicação funcione independentemente do Replit, usando PostgreSQL padrão e autenticação local.