import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "node:url";
import usersRouter from "./backend/routes/users.js";
import consentsRouter from "./backend/routes/consents.js";
import bankAccountsRouter from "./backend/routes/bankAccounts.js";
import balancesRouter from "./backend/routes/balances.js";
import transactionsRouter from "./backend/routes/transactions.js";
import spendingPatternsRouter from "./backend/routes/spendingPatterns.js";
import pool from "./backend/database.js";

dotenv.config({
  path: fileURLToPath(new URL("./backend/.env", import.meta.url)),
});

const app = express();
const port = Number(process.env.PORT || 3000);
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

app.get("/", (_req, res) => {
  res.send("FinView Backend is Running!");
});

app.get("/api/health", (_req, res) => {
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
