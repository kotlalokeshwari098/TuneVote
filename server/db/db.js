import dotenv from "dotenv";
import pkg from "pg";
const { Pool : RealPool } = pkg;
import { newDb } from "pg-mem";

let pool;

if (process.env.NODE_ENV === "test") {
  // Use pg-mem in tests
  
  const mem = newDb();

  // Initialize tables for your app
   mem.public.none(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      role VARCHAR(50) NOT NULL,
      socket_id VARCHAR(100)
    );

    CREATE TABLE jamsessions(
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      jamname VARCHAR(100) NOT NULL,
      songslist jsonb,
      qrcodeurl VARCHAR(255),
      uniqueroomid VARCHAR(100) NOT NULL UNIQUE,
      qrcodepublicid VARCHAR(255),
      expires boolean DEFAULT false
    );
  `);

   const { Pool } = mem.adapters.createPg();
  pool = new Pool();

   console.log("DB MODE:", process.env.NODE_ENV);
 
} else {
  // Normal Postgres pool
  dotenv.config();

  pool = new RealPool({
    user: process.env.PGUSER,
    host: process.env.PGHOST || "db",
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });
}

export default pool;
