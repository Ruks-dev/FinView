import express from "express";
import pool from "../database.js";
import { requireAuth } from "../auth.js";

const router = express.Router();

router.use(requireAuth);

// GET all transactions (optionally filter by ?account_id=)
router.get("/", async (req, res) => {
  try {
    const { account_id } = req.query;

    const result = account_id
      ? await pool.query(
          "SELECT * FROM transactions WHERE account_id = $1",
          [account_id]
        )
      : await pool.query("SELECT * FROM transactions");

    res.json(result.rows);
  } catch (error) {
    console.error("Error getting transactions:", error.message);

    res.status(500).json({
      message: "Failed to get transactions",
    });
  }
});

// GET a single transaction by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM transactions WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting transaction:", error.message);
    res.status(500).json({
      message: "Failed to get transaction",
    });
  }
});

// POST a new transaction
router.post("/", async (req, res) => {
  try {
    const {
      account_id,
      amount,
      transaction_type,
      description,
      category,
      transaction_date,
      currency,
      external_transaction_id,
    } = req.body;

    if (!account_id || amount === undefined || !transaction_type) {
      return res.status(400).json({
        message: "account_id, amount and transaction_type are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO transactions
      (
        account_id,
        amount,
        transaction_type,
        description,
        category,
        transaction_date,
        currency,
        external_transaction_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        account_id,
        amount,
        transaction_type,
        description,
        category,
        transaction_date,
        currency,
        external_transaction_id,
      ]
    );

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating transaction:", error.message);

    res.status(500).json({
      message: "Failed to create transaction",
    });
  }
});

export default router;