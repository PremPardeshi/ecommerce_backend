import express from "express";
import pkg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Needed for Supabase
});

// Health Check
app.get("/", (req, res) => {
  res.send("✅ E-commerce backend is running!");
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get categories
app.get("/api/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to cart (basic example)
app.post("/api/cart", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO cart(user_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *",
      [user_id, product_id, quantity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
