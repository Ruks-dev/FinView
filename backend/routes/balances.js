import express from "express";
import pool from "../database.js";

const router = express.Router();

//Get all balances (optionally filter by ?account_id=)
router.get("/", async (req, res) => {
  try {
    const { account_id } = req.query;

    const result = account_id
      ? await pool.query("SELECT * FROM balances WHERE account_id = $1", [account_id])
      : await pool.query("SELECT * FROM balances");

    res.json(result.rows);
  } catch (error) {
    console.error("Error getting balances:", error.message);
    res.status(500).json({
      message: "Failed to get balances",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      account_id,
      available_balance,
      current_balance,
      currency,
    } = req.body;

    if (!account_id || current_balance === undefined) {
      return res
        .status(400)
        .json({ message: "account_id and current_balance are required" });
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