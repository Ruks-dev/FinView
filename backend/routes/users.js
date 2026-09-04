import express from "express";
import bcrypt from "bcrypt";
import pool from "../database.js";

const router = express.Router();

// ==========================================
// GET ALL USERS
// ==========================================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_id, name, email, created_at FROM users"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error getting users:", error.message);

    res.status(500).json({
      message: "Failed to get users",
    });
  }
});

// ==========================================
// GET ONE USER
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT user_id, name, email, created_at FROM users WHERE user_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting user:", error.message);

    res.status(500).json({
      message: "Failed to get user",
    });
  }
});

// ==========================================
// SIGN UP / CREATE USER
// ==========================================
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check whether email already exists
    const existingUser = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING user_id, name, email, created_at`,
      [name, email, passwordHash]
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating user:", error.message);

    res.status(500).json({
      message: "Failed to create user",
    });
  }
});

// ==========================================
// LOGIN
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user by email
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Successful login
    res.json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error.message);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// ==========================================
// UPDATE USER
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2
       WHERE user_id = $3
       RETURNING user_id, name, email, created_at`,
      [name, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user:", error.message);

    res.status(500).json({
      message: "Failed to update user",
    });
  }
});

// ==========================================
// DELETE USER
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING user_id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);

    res.status(500).json({
      message: "Failed to delete user",
    });
  }
});

export default router;