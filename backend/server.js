import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "node:url";
import usersRouter from "./routes/users.js";
import consentsRouter from "./routes/consents.js";
import bankAccountsRouter from "./routes/bankAccounts.js";
import balancesRouter from "./routes/balances.js";
import transactionsRouter from "./routes/transactions.js";
import spendingPatternsRouter from "./routes/spendingPatterns.js";

import pool from "./database.js";

dotenv.config({
  path: fileURLToPath(new URL(".env", import.meta.url)),
});

const app = express();

// Allow the frontend dev server (and any origins listed in .env) to call this API.
// Set FRONTEND_URL in .env, e.g. FRONTEND_URL=http://localhost:5173
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/users", usersRouter); 
app.use("/api/consents", consentsRouter);
app.use("/api/bank-accounts", bankAccountsRouter);
app.use("/api/balances", balancesRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/spending-patterns", spendingPatternsRouter);


const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("FinView Backend is Running!");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});



pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database connected successfully!");
    console.log("Database time:", result.rows[0].now);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});