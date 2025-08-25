import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";


// Use a variável de ambiente DATABASE_URL do Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // necessário para Render
});

const db = drizzle(pool);

async function migrate() {
  console.log("Iniciando migração...");

  await db.execute(sql`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `);

  // Tabela de usuários
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email varchar(255) UNIQUE NOT NULL,
      password_hash varchar(255) NOT NULL,
      first_name varchar(255),
      last_name varchar(255),
      profile_image_url varchar(255),
      permission integer DEFAULT 1,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
  `);

  // Tabela de sessões
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS sessions (
      sid varchar(255) PRIMARY KEY,
      sess jsonb NOT NULL,
      expire timestamp NOT NULL
    );
  `);

  // Tabela de cartas
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS cards (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name varchar(255) NOT NULL,
      name_en varchar(255) NOT NULL,
      elixir_cost integer NOT NULL,
      type varchar(255) NOT NULL,
      rarity varchar(255) NOT NULL,
      image_url varchar(255),
      description text,
      description_en text,
      hitpoints integer,
      damage integer,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
  `);

  // Tabela de sessões de treinamento
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS training_sessions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id),
      mode varchar(255) NOT NULL,
      score integer NOT NULL,
      correct_answers integer NOT NULL,
      total_questions integer NOT NULL,
      time_elapsed integer,
      created_at timestamp DEFAULT now()
    );
  `);

  console.log("Migração concluída!");
  await pool.end();
}

migrate().catch((err) => {
  console.error("Erro na migração:", err);
  process.exit(1);
});
