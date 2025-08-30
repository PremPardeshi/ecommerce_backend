import express from "express";
import cors from "cors";
import pkg from 'pg';

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Supabase DB (Postgres)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Routes
app.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
});

app.post("/orders", async (req, res) => {
  const { user_id, items, total } = req.body;
  const order = await pool.query(
    "INSERT INTO orders(user_id,total) VALUES($1,$2) RETURNING *",
    [user_id, total]
  );
  for (let item of items) {
    await pool.query(
      "INSERT INTO order_items(order_id,product_id,quantity) VALUES($1,$2,$3)",
      [order.rows[0].id, item.product_id, item.quantity]
    );
  }
  res.json({ message: "Order placed!", order: order.rows[0] });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
