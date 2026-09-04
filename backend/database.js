import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL(".env", import.meta.url)),
});

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool;