import express from "express";
import pool from "../database.js";
import { requireAuth } from "../auth.js";

const router = express.Router();

router.use(requireAuth);

// Get all balances
// Optionally filter by ?account_id=
router.get("/", async (req, res) => {
  try {
    const { account_id } = req.query;

    const result = account_id
      ? await pool.query(
          "SELECT * FROM balances WHERE account_id = $1 ORDER BY retrieved_at DESC",
          [account_id]
        )
      : await pool.query(
          "SELECT * FROM balances ORDER BY retrieved_at DESC"
        );

    res.json(result.rows);
  } catch (error) {
    console.error("Error getting balances:", error.message);

    res.status(500).json({
      message: "Failed to get balances",
    });
  }
});

// Get a single balance by balance_id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM balances WHERE balance_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Balance not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting balance:", error.message);

    res.status(500).json({
      message: "Failed to get balance",
    });
  }
});

// Create a new balance
router.post("/", async (req, res) => {
  try {
    const {
      account_id,
      available_balance,
      current_balance,
      currency,
    } = req.body;

    if (!account_id || current_balance === undefined) {
      return res.status(400).json({
        message: "account_id and current_balance are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO balances
      (
        account_id,
        available_balance,
        current_balance,
        currency
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        account_id,
        available_balance,
        current_balance,
        currency,
      ]
    );

    res.status(201).json({
      message: "Balance created successfully",
      balance: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating balance:", error.message);

    res.status(500).json({
      message: "Failed to create balance",
    });
  }
});

export default router;