=========================================================================================
                Update with PUT Method & Delete with DELETE Method
=========================================================================================

/*
এখন আমরা দুটি নতুন API বানাবো:

1) UPDATE USER (PUT Method)
   → URL params থেকে id নেবে
   → body থেকে name, email, age নেবে
   → Database এ update করবে

2) DELETE USER (DELETE Method)
   → URL params থেকে id নেবে
   → Database থেকে সেই user delete করবে

Everything inside ONE code block as always.
=========================================================================================
*/



#########################################################################################
# 1. user.route.ts — ADD PUT & DELETE ROUTES
#########################################################################################

// src/routes/user.route.ts
import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();



/*
=========================================================================================
# ROUTE 1: UPDATE USER USING PUT METHOD
URL: PUT /api/users/:id
=========================================================================================
*/
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, email, age } = req.body;

    // validation
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID! ID must be a number.",
      });
    }

    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        message: "name, email & age are required!",
      });
    }

    // check if user exists
    const userExists = await db`
      SELECT * FROM users WHERE id = ${id}
    `;

    if (userExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // update user
    const updated = await db`
      UPDATE users 
      SET name = ${name}, email = ${email}, age = ${age}
      WHERE id = ${id}
      RETURNING *;
    `;

    return res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: updated[0],
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
# ROUTE 2: DELETE USER USING DELETE METHOD
URL: DELETE /api/users/:id
=========================================================================================
*/
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    // validation
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID! ID must be a number.",
      });
    }

    // check if user exists
    const userExists = await db`
      SELECT * FROM users WHERE id = ${id}
    `;

    if (userExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // delete user
    await db`
      DELETE FROM users WHERE id = ${id}
    `;

    return res.status(200).json({
      success: true,
      message: "User deleted successfully!",
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
# 2. POSTMAN TESTING — UPDATE USER (PUT)
#########################################################################################

METHOD: PUT  
URL:
http://localhost:5000/api/users/1

BODY → raw → JSON:
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "age": 30
}

EXPECTED RESPONSE:
{
  "success": true,
  "message": "User updated successfully!",
  "data": {
    "id": 1,
    "name": "Updated Name",
    "email": "updated@example.com",
    "age": 30
  }
}



#########################################################################################
# 3. POSTMAN TESTING — DELETE USER (DELETE)
#########################################################################################

METHOD: DELETE  
URL:
http://localhost:5000/api/users/1

EXPECTED RESPONSE:
{
  "success": true,
  "message": "User deleted successfully!"
}



=========================================================================================
                                        THE END
=========================================================================================
