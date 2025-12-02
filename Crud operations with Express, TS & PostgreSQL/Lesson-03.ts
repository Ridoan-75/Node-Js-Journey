=========================================================================================
                    Connect with database using pool
=========================================================================================

#########################################################################################
# A. INSTALL REQUIRED PACKAGES
#########################################################################################
npm install pg
npm install -D @types/pg

#########################################################################################
# B. PROJECT STRUCTURE (RECOMMENDED)
#########################################################################################
/*
src/
 ├── db/
 │    └── pool.ts        → Pool connection setup
 ├── app.ts              → Express config
 └── server.ts           → Server bootstrap
*/

=========================================================================================
# C. CREATE DATABASE POOL CONNECTION (src/db/pool.ts)
=========================================================================================
/*
Pool = Multiple clients handle করতে পারে  
যেটা production environment এ best practice।
*/

import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",           // your postgres user
  host: "localhost",
  database: "express_crud",   // your DB name
  password: "your_password",
  port: 5432,
});

// Test connection
pool.connect()
  .then(() => console.log("📌 PostgreSQL Connected Using Pool"))
  .catch((err) => console.error("❌ Pool Connection Error:", err));

=========================================================================================
# D. USE POOL IN EXPRESS APP (src/app.ts)
=========================================================================================
import express from "express";
import { pool } from "./db/pool";

const app = express();
app.use(express.json());

// Test route to check DB query
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully!",
      server_time: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: "Database query failed", details: err });
  }
});

export default app;

=========================================================================================
# E. SERVER BOOTSTRAP (src/server.ts)
=========================================================================================
import app from "./app";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

=========================================================================================
# F. RUN THE PROJECT
=========================================================================================
npm run dev
# Visit:
http://localhost:5000/users

=========================================================================================
# G. RESULT
=========================================================================================
/*
Pool connection সফল হলে তুমি JSON response পাবে:
{
  "message": "Database connected successfully!",
  "server_time": { "now": "2025-01-01T12:00:00.000Z" }
}
*/

=========================================================================================   
                                    THE END
=========================================================================================