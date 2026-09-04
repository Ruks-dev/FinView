import express from "express";
import pool from "../database.js";
import { requireAuth } from "../auth.js";

const router = express.Router();

router.use(requireAuth);

//Get all consents (optionally filter by ?user_id=)
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;

    const result = user_id
      ? await pool.query("SELECT * FROM consents WHERE user_id = $1", [user_id])
      : await pool.query("SELECT * FROM consents");

    res.json(result.rows);
  } catch (error) {
    console.error("Error getting consents:", error.message);
    res.status(500).json({
      message: "Failed to get consents",
    });
  }
});

//Get a single consent by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM consents WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Consent not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting consent:", error.message);
    res.status(500).json({
      message: "Failed to get consent",
    });
  }
});

//add new consent
router.post("/", async (req, res) => {
  try {
    const { user_id, provider, status, granted_at, expires_at } = req.body;

    if (!user_id || !provider || !status) {
      return res
        .status(400)
        .json({ message: "user_id, provider and status are required" });
    }

    const result = await pool.query(
      `INSERT INTO consents
       (user_id, provider, status, granted_at, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, provider, status, granted_at, expires_at]
    );

    res.status(201).json({
      message: "Consent created successfully",
      consent: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating consent:", error.message);
    res.status(500).json({
      message: "Failed to create consent",
    });
  }
});

//Update a consent (e.g. revoke it by setting status)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, expires_at } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const result = await pool.query(
      "UPDATE consents SET status = $1, expires_at = COALESCE($2, expires_at) WHERE id = $3 RETURNING *",
      [status, expires_at, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Consent not found" });
    }

    res.json({ message: "Consent updated successfully", consent: result.rows[0] });
  } catch (error) {
    console.error("Error updating consent:", error.message);
    res.status(500).json({
      message: "Failed to update consent",
    });
  }
});

//Delete a consent
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM consents WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Consent not found" });
    }

    res.json({ message: "Consent deleted successfully" });
  } catch (error) {
    console.error("Error deleting consent:", error.message);
    res.status(500).json({
      message: "Failed to delete consent",
    });
  }
});

export default router;