=========================================================================================
                   BCRYPT COMPARISON & INTRODUCTION TO JWT 
=========================================================================================

#########################################################################################
# A. BCRYPT COMPARISON — PASSWORD CHECKING 
#########################################################################################
/*
User signup করার সময় আমরা password hash করে database এ store করি।
কিন্তু login করার সময় আসল কাজ হলো —  
👉 User যে plain password দিচ্ছে সেটা কি stored hash এর সাথে মেলে?

🔐 এখানে ব্যবহৃত হয় bcrypt.compare()  
এটা plain text password এবং hashed password compare করে বলে দেয়:
✔ Password match করেছে কিনা
✔ Error হলে সেটা handle করতে হবে
*/

-----------------------------------------------------------------------------------------
# 1. কেন bcrypt.compare() দরকার?
-----------------------------------------------------------------------------------------
/*
কারণ hash কখনোই decrypt করা যায় না।  
তাই comparison always করা হয় — plain password VS hashed password  
bcrypt internally hashing algorithm + salt ব্যবহার করে match check করে।
*/

-----------------------------------------------------------------------------------------
# 2. bcrypt.compare() কিভাবে কাজ করে?
-----------------------------------------------------------------------------------------
/*
bcrypt.compare(plainPassword, hashedPassword) → Promise<boolean>

→ true  → password match  
→ false → password wrong  
*/

-----------------------------------------------------------------------------------------
# 3. Example: Password Comparison (TypeScript + Express.js)
-----------------------------------------------------------------------------------------
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

/* 
এই function টি user login এর সময় ব্যবহার করা হয়। 
যখন user email এবং password দেয়, তখন database থেকে hashedPassword আনা হয়,
তারপর bcrypt.compare() দিয়ে match check করা হয়।
*/
export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // pretend DB data
  const userFromDB = {
    email: "test@example.com",
    password: "$2a$10$2YgC2LNuR0tC4N7mJrZ1fO1Zq5Vj6Oax5N0UnzGJ.SL7Zhnoz0Ydi", // hashed
  };

  // 1. password compare
  const isPasswordMatched = await bcrypt.compare(password, userFromDB.password);

  if (!isPasswordMatched) {
    return res.status(401).json({
      success: false,
      message: "Invalid password!",
    });
  }

  // 2. password ok
  return res.json({
    success: true,
    message: "Login successful!",
  });
};




=========================================================================================
# B. INTRODUCTION TO JWT — JSON WEB TOKEN (A–Z)
=========================================================================================

#########################################################################################
# 1. JWT কি?
#########################################################################################
/*
JWT = JSON Web Token  
এটা একটি digitally signed token, যা user কে authenticate এবং authorize করতে ব্যবহার করা হয়।

👉 Login successful হওয়ার পর server user কে একটি token দেয়।
👉 User পরের request গুলোতে সেই token পাঠায়।
👉 Server token verify করে user কে access দেয়।

Benefits:
✔ Stateless authentication  
✔ Secure (signature ব্যবহার করে verify)  
✔ Fast  
✔ Cookies বা localStorage এ store করা যায়  
*/

-----------------------------------------------------------------------------------------
# 2. JWT কিভাবে কাজ করে? (Step-by-Step)
-----------------------------------------------------------------------------------------
/*
JWT 3 টা Part নিয়ে তৈরি:

1) Header  
2) Payload (user info, exp)  
3) Signature (secret দিয়ে hash করা)

ফরম্যাট:  
xxxxx.yyyyy.zzzzz

যেমন:  
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*/

-----------------------------------------------------------------------------------------
# 3. কখন JWT ব্যবহার করা হয়?
-----------------------------------------------------------------------------------------
/*
✔ User Login  
✔ User Verification  
✔ Private Route Protection  
✔ Role-based Authorization (admin/user)  
*/

-----------------------------------------------------------------------------------------
# 4. JWT Generate করার Example (TypeScript + Express.js)
-----------------------------------------------------------------------------------------
import jwt from "jsonwebtoken";

/*
User login successful হলে নিচের মত করা হয়:
*/
export const generateToken = (userId: string, email: string) => {
  const token = jwt.sign(
    {
      userId,
      email,
    },
    "MY_SECRET_KEY", // সাধারণত .env এ থাকে
    {
      expiresIn: "7d", // token কতদিন valid থাকবে
    }
  );

  return token;
};

-----------------------------------------------------------------------------------------
# 5. JWT Verify Example (Middleware)
-----------------------------------------------------------------------------------------
import { NextFunction } from "express";

/*
এই middleware টি কোনো private route এ ব্যবহার করা হয়।
যদি token valid হয় → next()  
যদি invalid হয় → access denied
*/
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized!",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "MY_SECRET_KEY");

    // decoded এর ভিতরে userId, email থাকে
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token!",
    });
  }
};



=========================================================================================
# C. SUMMARY
========================================================================================
/*
✔ bcrypt.compare() → plain password VS hashed password compare করে  
✔ JWT ব্যবহার হয় → authentication + authorization  
✔ Login successful হলে → token generate  
✔ Private route access দিতে → verify middleware  
✔ Token এ থাকে → user info + expiration + signature  
✔ JWT stateless → server কোনো session store করে না  
*/

=========================================================================================
                                        THE END
=========================================================================================
