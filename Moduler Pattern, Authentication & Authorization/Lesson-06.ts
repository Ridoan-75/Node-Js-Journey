=========================================================================================
                  HIGHER-ORDER FUNCTIONS & AUTH MIDDLEWARE 
=========================================================================================

#########################################################################################
# A. HIGHER-ORDER FUNCTIONS (HOF) 
#########################################################################################

***********************************************
# 1. Higher-Order Function (HOF) কি?
***********************************************
/*
Higher-Order Function (HOF) হলো এমন function —
👉 যেটা আরেকটি function কে argument হিসেবে নেয়  
অথবা  
👉 যেটা আরেকটি function return করে  

Express.js এ HOF খুবই গুরুত্বপূর্ণ কারণ middleware, wrapper, error handler —
সবই HOF দিয়ে তৈরি করা যায়।
*/

***********************************************
# 2. কেন Higher-Order Function দরকার?
***********************************************
/*
✔ Code পুনঃব্যবহারযোগ্য করা যায়  
✔ Repeated logic এক জায়গায় রাখা যায়  
✔ Authentication / Role-base Authorization সহজ হয়  
✔ Clean & maintainable code  
*/

***********************************************
# 3. Simple HOF Example (Basic JavaScript Concept)
***********************************************
const multiply = (a: number) => {
  return (b: number) => a * b; // inner function return করছে
};

/*
multiply(5) → return করে function  
multiply(5)(10) → 50
*/


***********************************************
# 4. Real-Life Express.js Example (Request Handler Wrapper)
***********************************************
/*
Route handler এ try-catch বারবার লিখতে চাই না।
একটি HOF বানাবো → সব handler কে wrap করবে।
*/

export const catchAsync = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};



=========================================================================================
# B. AUTH MIDDLEWARE — JWT VERIFY USING HOF
=========================================================================================

#########################################################################################
# 1. Auth Middleware কি?
#########################################################################################
/*
Auth Middleware user কে authenticate করে:
👉 Token আছে কিনা  
👉 Token valid কিনা  
👉 Token decode করে request.user এ save করে  
*/

#########################################################################################
# 2. কেন Middleware ব্যবহার করা হয়?
#########################################################################################
/*
✔ প্রতিটি protected route এ security check করার দরকার পড়ে  
✔ এক জায়গায় logic লিখে সব route এ use করা যায়  
✔ Clear & scalable structure
*/

#########################################################################################
# 3. JWT Verification Middleware (Using HOF)
#########################################################################################

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

/*
এই function higher-order কারণ:
👉 এটা parameter নেয় (roles),
👉 return করে middleware function।
*/

export const auth =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Authorization header আছে কিনা
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "No token provided!",
        });
      }

      // 2. Bearer token থেকে actual token বের করা
      const token = authHeader.split(" ")[1];

      // 3. Token verify
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as any;

      // 4. decoded data request এ attach করা
      (req as any).user = decoded;

      // 5. যদি role check করতে হয়
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden — You don't have permission!",
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



#########################################################################################
# 4. Example Protected Route (Using Auth Middleware)
#########################################################################################

import express from "express";
const router = express.Router();

/*
auth() → only authentication check  
auth("admin") → admin-only route  
auth("user", "admin") → multiple role allow  
*/

router.get(
  "/profile",
  auth(), // শুধু verify করবে
  (req, res) => {
    res.json({
      success: true,
      message: "User profile accessed",
      user: (req as any).user,
    });
  }
);

router.get(
  "/admin/dashboard",
  auth("admin"), // only admin allowed
  (req, res) => {
    res.json({
      success: true,
      message: "Admin dashboard accessed",
    });
  }
);



=========================================================================================
# C. SUMMARY 
=========================================================================================
/*
✔ Higher-Order Function হলো function যা আরেক function নেয় বা return করে  
✔ Express.js এ HOF দিয়ে powerful reusable middlewares বানানো যায়  
✔ catchAsync() → async error handler  
✔ auth() → authentication + role verification middleware  
✔ HOF ব্যবহার করলে code clean, scalable & structured হয়  
*/

=========================================================================================
                                    THE END
=========================================================================================
