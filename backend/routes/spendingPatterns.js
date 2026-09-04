import express from "express";
import pool from "../database.js";
import { requireAuth } from "../auth.js";

const router = express.Router();

router.use(requireAuth);

// Get spending patterns for an account
router.get("/:account_id", async (req, res) => {
  try {
    const { account_id } = req.params;

    // Calculate total income and expenses
    const summaryResult = await pool.query(
      `SELECT
        SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END) AS total_expenses
      FROM transactions
      WHERE account_id = $1`,
      [account_id]
    );

    // Calculate spending by category
    const categoryResult = await pool.query(
      `SELECT
        category,
        SUM(amount) AS total_amount,
        COUNT(*) AS transaction_count
      FROM transactions
      WHERE account_id = $1
        AND transaction_type = 'debit'
      GROUP BY category
      ORDER BY total_amount DESC`,
      [account_id]
    );

    const totalIncome = Number(summaryResult.rows[0].total_income || 0);
    const totalExpenses = Number(summaryResult.rows[0].total_expenses || 0);

    const netCashFlow = totalIncome - totalExpenses;

    res.json({
      account_id,
      total_income: totalIncome,
      total_expenses: totalExpenses,
      net_cash_flow: netCashFlow,
      spending_patterns: categoryResult.rows,
    });
  } catch (error) {
    console.error("Error getting spending patterns:", error.message);

    res.status(500).json({
      message: "Failed to get spending patterns",
    });
  }
});

export default router;