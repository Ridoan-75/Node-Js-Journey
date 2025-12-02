=========================================================================================
                     Getting All Users & single user using params
=========================================================================================

/*
এখন আমরা দুটি নতুন API বানাবো:

1) GET /api/users/all  
   → সব Users list করবে (Neon DB থেকে)

2) GET /api/users/:id  
   → URL params থেকে id নিবে এবং সেই একক user return করবে

Everything inside ONE code block as always.
=========================================================================================
*/



#########################################################################################
# 1. user.route.ts — ADD TWO NEW ROUTES
#########################################################################################

// src/routes/user.route.ts
import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();


/*
=========================================================================================
# ROUTE 1: GET ALL USERS
URL: GET /api/users/all
=========================================================================================
*/
router.get("/all", async (_req: Request, res: Response) => {
  try {
    const users = await db`SELECT * FROM users ORDER BY id ASC`;

    return res.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Database Error",
      error: error.message,
    });
  }
});



/*
=========================================================================================
# ROUTE 2: GET SINGLE USER USING PARAMS
URL: GET /api/users/:id
=========================================================================================
*/
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);  // param থেকে id নেওয়া

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format! ID must be a number.",
      });
    }

    const result = await db`SELECT * FROM users WHERE id = ${id}`;

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: result[0],
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
# 2. POSTMAN TESTING — GET ALL USERS
#########################################################################################

STEP 1: Method = GET  
STEP 2: URL →  
http://localhost:5000/api/users/all  

EXPECTED OUTPUT:
---------------------------------------------
{
  "success": true,
  "total": 5,
  "data": [
    { "id": 1, "name": "...", "email": "...", "age": 22 },
    { "id": 2, "name": "...", "email": "...", "age": 25 }
  ]
}



#########################################################################################
# 3. POSTMAN TESTING — GET SINGLE USER USING PARAMS
#########################################################################################

STEP 1: Method = GET  
STEP 2: URL →  
http://localhost:5000/api/users/1  

EXPECTED OUTPUT:
---------------------------------------------
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ridoan",
    "email": "ridoan@example.com",
    "age": 22
  }
}

IF INVALID ID:
---------------------------------------------
http://localhost:5000/api/users/abc
→ returns 400 error

IF NOT FOUND:
---------------------------------------------
http://localhost:5000/api/users/999
→ returns 404 error



=========================================================================================
                                    THE END
=========================================================================================