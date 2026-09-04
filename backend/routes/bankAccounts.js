import express from "express";
import pool from "../database.js";
import { requireAuth } from "../auth.js";

const router = express.Router();

router.use(requireAuth);

//Get all bank accounts (optionally filter by ?user_id=)
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;

    const result = user_id
      ? await pool.query("SELECT * FROM bank_accounts WHERE user_id = $1", [user_id])
      : await pool.query("SELECT * FROM bank_accounts");

    res.json(result.rows);
  } catch (error) {
    console.error("Error getting bank accounts:", error.message);
    res.status(500).json({
      message: "Failed to get bank accounts",
    });
  }
});

//Get a single bank account by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM bank_accounts WHERE account_id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting bank account:", error.message);
    res.status(500).json({
      message: "Failed to get bank account",
    });
  }
});

//Add a new Bank Account
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      consent_id,
      bank_name,
      account_name,
      account_number,
      account_type,
      currency,
      external_account_id,
    } = req.body;

    if (!user_id || !bank_name || !account_number) {
      return res.status(400).json({
        message: "user_id, bank_name and account_number are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO bank_accounts
      (
        user_id,
        consent_id,
        bank_name,
        account_name,
        account_number,
        account_type,
        currency,
        external_account_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        user_id,
        consent_id,
        bank_name,
        account_name,
        account_number,
        account_type,
        currency,
        external_account_id,
      ]
    );

    res.status(201).json({
      message: "Bank account created successfully",
      account: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating bank account:", error.message);
    res.status(500).json({
      message: "Failed to create bank account",
    });
  }
});

//Delete a bank account
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM bank_accounts WHERE account_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    res.json({ message: "Bank account deleted successfully" });
  } catch (error) {
    console.error("Error deleting bank account:", error.message);
    res.status(500).json({
      message: "Failed to delete bank account",
    });
  }
});

export default router;