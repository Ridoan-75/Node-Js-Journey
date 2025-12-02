=========================================================================================
                                        TODO POST
=========================================================================================


#########################################################################################
# 1. CREATE TODO TABLE IN NEON (RUN ONCE)
#########################################################################################

/*
Neon Dashboard → SQL Editor → নিচের query রান করো:
*/

CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



#########################################################################################
# 2. PROJECT STRUCTURE (UPDATED)
#########################################################################################
project/
 ├── src/
 │    ├── app.ts
 │    ├── server.ts
 │    ├── db.ts
 │    └── routes/
 │         ├── user.route.ts
 │         └── todo.route.ts   <-- NEW
 ├── .env
 ├── tsconfig.json
 ├── package.json



#########################################################################################
# 3. ADD TODO ROUTER IN app.ts
#########################################################################################

// src/app.ts
import express, { Application } from "express";
import userRouter from "./routes/user.route";
import todoRouter from "./routes/todo.route";  // <-- NEW

const app: Application = express();

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/todos", todoRouter);  // <-- NEW

export default app;



#########################################################################################
# 4. todo.route.ts — CREATE TODO USING POST
#########################################################################################

// src/routes/todo.route.ts
import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

/*
=========================================================================================
# POST /api/todos/create
নতুন TODO তৈরি করবে এবং database এ insert করবে
=========================================================================================
*/

router.post("/create", async (req: Request, res: Response) => {
  try {
    const { title, description, user_id } = req.body;

    // validation
    if (!title || !user_id) {
      return res.status(400).json({
        success: false,
        message: "title & user_id are required!",
      });
    }

    // insert query
    const insertedTodo = await db`
      INSERT INTO todos (title, description, user_id)
      VALUES (${title}, ${description || null}, ${user_id})
      RETURNING *;
    `;

    return res.status(201).json({
      success: true,
      message: "Todo created successfully!",
      data: insertedTodo[0],
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
# 5. POSTMAN TEST (CREATE TODO — POST)
#########################################################################################

METHOD: POST  
URL:
http://localhost:5000/api/todos/create

BODY → raw → JSON:
{
  "title": "Learn Express.js",
  "description": "Finish CRUD operations today",
  "user_id": 1
}

EXPECTED RESPONSE:
{
  "success": true,
  "message": "Todo created successfully!",
  "data": {
    "id": 1,
    "title": "Learn Express.js",
    "description": "Finish CRUD operations today",
    "completed": false,
    "user_id": 1,
    "created_at": "2025-12-02T10:20:00.000Z"
  }
}



=========================================================================================
                                        THE END
=========================================================================================