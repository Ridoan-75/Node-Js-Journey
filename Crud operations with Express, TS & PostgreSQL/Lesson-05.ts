=========================================================================================
                     Create our first User using POST
=========================================================================================

#########################################################################################
# 1. INSTALL REQUIRED PACKAGES
#########################################################################################

npm install express @types/express
npm install @neondatabase/serverless
npm install dotenv
npm install typescript ts-node-dev --save-dev



#########################################################################################
# 2. PROJECT STRUCTURE
#########################################################################################
project/
 ├── src/
 │    ├── app.ts
 │    ├── server.ts
 │    ├── db.ts
 │    └── routes/
 │         └── user.route.ts
 ├── .env
 ├── tsconfig.json
 ├── package.json
 └── node_modules/



#########################################################################################
# 3. .env — NEON DATABASE CONNECTION URL
#########################################################################################
/*
Neon Dashboard → Connection Details থেকে URL কপি করে এখানে রাখবে
*/

NEON_DATABASE_URL="postgres://USER:PASSWORD@YOUR-NEON-HOST/neondb?sslmode=require"



#########################################################################################
# 4. db.ts — CONNECT EXPRESS APP WITH NEON POSTGRESQL
#########################################################################################

// src/db.ts
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config();  
// ↑ .env ফাইল লোড করার জন্য

export const db = neon(process.env.NEON_DATABASE_URL as string);

// test connection
(async () => {
  try {
    await db`SELECT NOW()`;
    console.log("📌 Neon PostgreSQL Connected Successfully!");
  } catch (error) {
    console.error("❌ Neon Connection Error:", error);
  }
})();



#########################################################################################
# 5. CREATE TABLE IN NEON (RUN ONLY ONCE)
#########################################################################################
/*
Neon SQL Editor → Query এ paste করবে:
*/

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INT NOT NULL
);



#########################################################################################
# 6. app.ts — EXPRESS APP SETUP
#########################################################################################

// src/app.ts
import express, { Application } from "express";
import userRouter from "./routes/user.route";

const app: Application = express();

app.use(express.json()); // JSON body গ্রহণের জন্য middleware

app.use("/api/users", userRouter); // সব user route mount করা

export default app;



#########################################################################################
# 7. server.ts — START SERVER
#########################################################################################

// src/server.ts
import app from "./app";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



#########################################################################################
# 8. user.route.ts — CREATE USER USING POST + SAVE TO NEON DB
#########################################################################################

// src/routes/user.route.ts
import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

/*
=========================================================================================
# POST /api/users/create
Database এ নতুন User Insert করার route
=========================================================================================
*/

router.post("/create", async (req: Request, res: Response) => {
  try {
    const { name, email, age } = req.body;

    // Validation check
    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        message: "name, email & age are required!",
      });
    }

    // Insert into Neon DB
    const inserted = await db`
      INSERT INTO users (name, email, age)
      VALUES (${name}, ${email}, ${age})
      RETURNING *;
    `;

    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: inserted[0],
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Database Error",
      error: error.message,
    });
  }
});

export default router;



#########################################################################################
# 9. POSTMAN TESTING — FINAL STEP
#########################################################################################

STEP 1: Server run করো
---------------------------------------------
npm run dev  
অথবা  
npx ts-node-dev src/server.ts

STEP 2: Postman → New Request  
---------------------------------------------
Method: POST  
URL: http://localhost:5000/api/users/create

STEP 3: Body → raw → JSON
---------------------------------------------
{
  "name": "Ridoan",
  "email": "ridoan@example.com",
  "age": 22
}

STEP 4: Send চাপ দাও  
---------------------------------------------

EXPECTED RESPONSE:
---------------------------------------------
{
  "success": true,
  "message": "User created successfully!",
  "data": {
    "id": 1,
    "name": "Ridoan",
    "email": "ridoan@example.com",
    "age": 22
  }
}



=========================================================================================
                                    THE END
=========================================================================================