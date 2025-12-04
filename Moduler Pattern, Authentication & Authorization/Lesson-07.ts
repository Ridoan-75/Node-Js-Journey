=========================================================================================
          AUTH MIDDLEWARE & DECLARING USER IN A NAMESPACE 
=========================================================================================

#########################################################################################
# A. কেন “User” কে Request Object এর ভিতরে Declare করতে হয়?
#########################################################################################
/*
যখন আমরা JWT verify করে req.user = decoded সেট করি,
TypeScript তখন error দেয়:

❌ Property 'user' does not exist on type 'Request'

কারণ Express এর default Request টাইপে “user” নামে কোনো property নেই।

👉 তাই আমাদের নিজেই TypeScript namespace declare করে Request interface কে extend করতে হয়।
এটাই হলো — Declaration Merging (A–Z important concept)
*/


=========================================================================================
# B. DECLARING USER IN A NAMESPACE 
=========================================================================================

#########################################################################################
# 1. Step 1: Create a folder “types” (optional but recommended)
#########################################################################################
/*
src/
 └── types/
      └── express.d.ts     // এখানে namespace declare করা হবে
*/

#########################################################################################
# 2. Step 2: Declare namespace and extend Request interface
#########################################################################################

// src/types/express.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    // Request এর ভিতরে "user" নামে data add হবে
    interface Request {
      user?: string | JwtPayload; 
      // এখানে যেকোনো decoded token type set করতে পারো
    }
  }
}

/*
⚠ VERY IMPORTANT:
এই ফাইল অবশ্যই TypeScript compiler কে জানাতে হবে।
package.json এ “typeRoots” দিলে আরও perfect হয়।

Example tsconfig.json:
{
  "compilerOptions": {
    "typeRoots": ["./src/types", "./node_modules/@types"]
  }
}
*/




=========================================================================================
# C. AUTH MIDDLEWARE — JWT VERIFY 
=========================================================================================

#########################################################################################
# 1. এই middleware user কে authenticate করে:
#########################################################################################
/*
✔ Token আছে কিনা check করে  
✔ Token verify করে  
✔ decoded info req.user এ যোগ করে  
✔ Role থাকলে role-check করে  
*/

#########################################################################################
# 2. Full Auth Middleware (Higher-Order Function + JWT Verify)
#########################################################################################

// src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

/*
auth(...) → Higher-Order Function
auth() → শুধু authentication
auth("admin") → শুধুমাত্র admin user allow
*/
export const auth =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Authorization header check
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "No token provided!",
        });
      }

      // 2. Token extract
      const token = authHeader.split(" ")[1];

      // 3. Token verify
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      // 4. Add decoded user data into req.user (TypeScript এখন জানে req.user allowed!)
      req.user = decoded;

      // 5. Role-based authorization
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden — Access Denied!",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token!",
      });
    }
  };




=========================================================================================
# D. USING AUTH MIDDLEWARE IN ROUTES 
=========================================================================================

#########################################################################################
# 1. Example Route — Only Logged-in User Can Access
#########################################################################################

import express from "express";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.get("/profile", auth(), (req, res) => {
  res.json({
    success: true,
    message: "Profile accessed",
    user: req.user, // এখন TypeScript error দিবে না
  });
});

#########################################################################################
# 2. Admin-only route
#########################################################################################

router.get("/admin", auth("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Admin panel accessed",
  });
});

export default router;



=========================================================================================
# E. COMPLETE SUMMARY 
=========================================================================================
/*
✔ req.user default Express type এ নেই → তাই namespace দিয়ে extend করতে হয়  
✔ Declaration Merging দিয়ে Request interface এ নতুন property যোগ করা যায়  
✔ JWT verify করার পরে req.user এ decoded data রাখা হয়  
✔ auth() হলো HOF → authentication + role authorization  
✔ admin-only route → auth("admin")  
✔ সবকিছু TypeScript-compatible & error-free  
*/

=========================================================================================
                                    THE END
=========================================================================================
