=========================================================================================
                            Not Found Route & Middleware
=========================================================================================

/*
এখন আমরা Express.js এ দুইটি জিনিস শিখবো:

1) **Not Found Route (404 Handler)**  
   → যেকোনো invalid route হিট করলে একটি সুন্দর JSON response দেবে।

2) **Custom Middleware**  
   → Request আসার আগেই custom middleware চলবে।
   → লগিং middleware উদাহরণ হিসেবে ব্যবহার করবো।

সবকিছু ONE code block এর ভিতরে, আপনার style অনুযায়ী।
=========================================================================================
*/



#########################################################################################
# 1. PROJECT STRUCTURE (UPDATED)
#########################################################################################
project/
 ├── src/
 │    ├── app.ts
 │    ├── server.ts
 │    ├── middlewares/
 │    │        └── logger.ts        <-- NEW
 │    └── routes/
 │         ├── user.route.ts
 │         └── todo.route.ts
 ├── .env
 ├── tsconfig.json
 ├── package.json



#########################################################################################
# 2. CREATE CUSTOM LOGGER MIDDLEWARE
#########################################################################################

// src/middlewares/logger.ts
import { Request, Response, NextFunction } from "express";

/*
=========================================================================================
# LOGGER MIDDLEWARE
→ প্রতিটি request এর info console এ log করবে
=========================================================================================
*/
export const logger = (req: Request, _res: Response, next: NextFunction) => {
  console.log(
    `📌 ${req.method} Request → ${req.originalUrl}    Time: ${new Date().toISOString()}`
  );
  next(); // → middleware শেষ, এবার পরের অংশে যাক
};



#########################################################################################
# 3. UPDATE app.ts — ADD LOGGER MIDDLEWARE + NOT FOUND HANDLER + ERROR HANDLER
#########################################################################################

// src/app.ts
import express, { Application, Request, Response, NextFunction } from "express";
import userRouter from "./routes/user.route";
import todoRouter from "./routes/todo.route";
import { logger } from "./middlewares/logger"; // <-- import middleware

const app: Application = express();

app.use(express.json());

// register custom middleware
app.use(logger);

// register routes
app.use("/api/users", userRouter);
app.use("/api/todos", todoRouter);



/*
=========================================================================================
# 404 NOT FOUND ROUTE
সবচেয়ে শেষে রাখতে হবে → কোনো route match না করলে এটি চলবে
=========================================================================================
*/
app.all("*", (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: `Route Not Found → ${req.originalUrl}`,
  });
});



/*
=========================================================================================
# GLOBAL ERROR HANDLER (BONUS)
Express এ error ধরার শেষ জায়গা
=========================================================================================
*/
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

export default app;



#########################################################################################
# 4. TEST NOT FOUND ROUTE USING POSTMAN
#########################################################################################

METHOD: GET  
URL:
http://localhost:5000/unknown/route

EXPECTED RESPONSE:
{
  "success": false,
  "message": "Route Not Found → /unknown/route"
}



#########################################################################################
# 5. TEST LOGGER MIDDLEWARE (CHECK CONSOLE)
#########################################################################################

Example console output:
📌 GET Request → /api/users/all    Time: 2025-12-02T18:20:44.120Z
📌 POST Request → /api/todos/create    Time: 2025-12-02T18:20:51.998Z



=========================================================================================
                                    THE END
=========================================================================================
