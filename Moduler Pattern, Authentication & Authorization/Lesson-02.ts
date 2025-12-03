=========================================================================================
                AUTHENTICATION & AUTHORIZATION (FIXED VERSION)
=========================================================================================


=========================================================================================
# 1. Authentication কি?
=========================================================================================
Authentication মানে হলো —  
👉 **User কে verify করা**, অর্থাৎ “তুমি কে?”

যেমন—  
✔ User login করার সময় email + password দিয়ে নিজের পরিচয় প্রমাণ করে  
✔ Token / JWT ব্যবহার করেও পরিচয় prove করা যায়  

=========================================================================================
# 2. Authorization কি?
=========================================================================================
Authorization মানে হলো —  
👉 **User কি করতে পারবে? কোন resource access করতে পারবে?**

যেমন—  
✔ সাধারণ user products দেখবে  
✔ admin নতুন product তৈরি করতে পারবে  
✔ moderator content approve করতে পারবে  

➡ তাহলে:  
**Authentication = পরিচয় যাচাই**  
**Authorization = Permission বা Access Control**

=========================================================================================
# 3. কেন Authentication & Authorization গুরুত্বপূর্ণ?
=========================================================================================
✔ Sensitive data protection  
✔ User specific dashboard/permissions  
✔ Database কে unauthorized access থেকে protect করা  
✔ API কে secure রাখা  
✔ Role-based access control  

=========================================================================================
# 4. Authentication Flow
=========================================================================================
1. User login request পাঠায় (email + password)  
2. Server email চেক করে  
3. Password hash মিলিয়ে দেখে  
4. সফল হলে JWT token generate  
5. Client token store করে  
6. Protected route এ token পাঠায়  
7. Server verify করে access দেয়  

=========================================================================================
# 5. Authorization Flow
=========================================================================================
1. User অবশ্যই authenticated হতে হবে  
2. Server token verify করবে  
3. User role বের করবে (admin/user)  
4. role allowed থাকলে access  
5. না থাকলে error (403)  

=========================================================================================
# 6. Express.js + TypeScript এ সম্পূর্ণ A–Z Implementation
=========================================================================================

#########################################################################################
# A. Project Setup
#########################################################################################
```ts
// Install packages:
// npm init -y
// npm install express jsonwebtoken bcryptjs dotenv
// npm install -D typescript ts-node-dev @types/express @types/jsonwebtoken @types/bcryptjs

// Initialize TypeScript:
// npx tsc --init

// tsconfig.json এ rootDir/outDir ঠিক করে নিবে
```

#########################################################################################
# B. Folder Structure
#########################################################################################
```ts
project/
 └── src/
      ├── app.ts
      ├── server.ts
      ├── config/
      │     └── index.ts
      ├── modules/
      │     ├── auth/
      │     │     ├── auth.controller.ts
      │     │     ├── auth.service.ts
      │     │     └── auth.route.ts
      │     └── users/
      │           └── user.model.ts
      └── middleware/
            └── auth.middleware.ts
.env
```

#########################################################################################
# C. Environment Variables
#########################################################################################

PORT=5000
JWT_SECRET=mySuperSecretKey
JWT_EXPIRES_IN=1d


=========================================================================================
# D. User Model (In-Memory)
=========================================================================================
// src/modules/users/user.model.ts

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // Hashed password
  role: "admin" | "user"; // Authorization এর role
}

// Simple in-memory database
export const users: User[] = [];


=========================================================================================
# E. Auth Service (Register + Login)
=========================================================================================
// src/modules/auth/auth.service.ts

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users, User } from "../users/user.model";
import config from "../../config";

export const AuthService = {
  registerUser: async (name: string, email: string, password: string) => {
    const exist = users.find((u) => u.email === email);
    if (exist) throw new Error("User already exists!");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      role: "user",
    };

    users.push(newUser);
    return newUser;
  },

  loginUser: async (email: string, password: string) => {
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("User not found!");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password!");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.JWT_SECRET!,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    return { message: "Login successful", token };
  },
};


=========================================================================================
# F. Auth Controller
=========================================================================================
// src/modules/auth/auth.controller.ts

import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.registerUser(name, email, password);

      res.json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.loginUser(email, password);

      res.json({
        success: true,
        message: result.message,
        token: result.token,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};


=========================================================================================
# G. Auth Routes
=========================================================================================
// src/modules/auth/auth.route.ts

import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

export default router;


=========================================================================================
# H. Authentication Middleware (JWT Verify)
=========================================================================================

// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


=========================================================================================
# I. Authorization Middleware (Role-Based)
=========================================================================================

 //src/middleware/auth.middleware.ts

export const authorize =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { role: string };

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "Access Denied. You don't have permission.",
      });
    }

    next();
  };


=========================================================================================
# J. Config File
=========================================================================================
```ts
// src/config/index.ts

import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
};
```

=========================================================================================
# K. App & Server Setup
=========================================================================================

// src/app.ts

import express from "express";
import authRoutes from "./modules/auth/auth.route";
import { authenticate, authorize } from "./middleware/auth.middleware";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/admin-dashboard", authenticate, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin! You have full access." });
});

app.get("/api/user-dashboard", authenticate, authorize("user", "admin"), (req, res) => {
  res.json({ message: "Welcome User!" });
});

export default app;


// src/server.ts

import app from "./app";
import config from "./config";

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});


=========================================================================================
# L. Final Summary
=========================================================================================
✔ Authentication → User verify  
✔ Authorization → Access control  
✔ Middleware → Token verify + Role check  
✔ Pure Express + TypeScript → Full secure system  

=========================================================================================
                                   THE END
=========================================================================================
