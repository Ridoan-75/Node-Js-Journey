=========================================================================================
                        JWT THEORY & TOKEN GENERATION
=========================================================================================

#########################################################################################
# A. JWT THEORY — JSON WEB TOKEN 
#########################################################################################

***********************************************
# 1. JWT কি?
***********************************************
/*
JWT = JSON Web Token  
এটা একটি **stateless authentication system**, যেখানে server user কে authenticate করার জন্য
একটি digitally-signed token দেয়।

এই token user পরে প্রতিটি request এর সাথে পাঠায়, এবং server সেই token verify করে user কে চিনে।

JWT = xxxxx.yyyyy.zzzzz
3 টি অংশ নিয়ে তৈরি:
1) Header  
2) Payload  
3) Signature  
*/

***********************************************
# 2. কেন JWT ব্যবহার করা হয়?
***********************************************
/*
✔ Stateless authentication — server কোনো session store করে না  
✔ Fast authentication system  
✔ Cross-platform (browser, mobile, backend সব জায়গায় কাজ করে)  
✔ Easy to verify  
✔ Scalability friendly  
*/

***********************************************
# 3. JWT এর তিনটি অংশ ব্যাখ্যা 
***********************************************

-----------------------------
# (1) HEADER
-----------------------------
/*
Header হলো token এর format + algorithm define করে।

{
  "alg": "HS256",
  "typ": "JWT"
}

- alg: কোন algorithm দিয়ে signature হবে  
- typ: JWT type
*/

-----------------------------
# (2) PAYLOAD
-----------------------------
/*
Payload এর ভিতরে user সম্পর্কিত public data থাকে:

{
  "userId": "1234",
  "email": "test@example.com",
  "role": "admin",
  "iat": 1712345678,
  "exp": 1712445678
}

IMPORTANT:
❌ এখানে কখনোই password এর মত sensitive data রাখা যাবে না  
*/

-----------------------------
# (3) SIGNATURE
-----------------------------
/*
Signature তৈরি হয় —
Header + Payload + Secret key দিয়ে hash করে।

Signature এর কাজ:
✔ Token tamper-proof রাখা  
✔ Token এর integrity maintain করা  
*/

***********************************************
# 4. JWT কিভাবে কাজ করে? (Step-by-Step Flow)
***********************************************
/*
1) User login → server user verify করে  
2) Server user এর জন্য একটি JWT token generate করে  
3) Token user কে পাঠানো হয়  
4) User যখন protected route hit করে → header এ token পাঠায়  
5) Server token verify করে user কে allow/deny করে  
*/

***********************************************
# 5. JWT কোথায় ব্যবহার হয়?
***********************************************
/*
✔ Authentication (login)  
✔ Authorization (role-based access)  
✔ API protection  
✔ Microservice communication  
*/



=========================================================================================
# B. TOKEN GENERATION — SIGNING A JWT TOKEN
=========================================================================================

#########################################################################################
# 1. Token Generation Logic 
#########################################################################################
/*
Token generate করতে jwt.sign() ব্যবহার করা হয়।

jwt.sign(payload, secretKey, options)

payload → user info  
secretKey → .env file এ store করা উচিত  
options → expiration time, issuer, audience ইত্যাদি  
*/

#########################################################################################
# 2. Example: JWT Token Generate (TypeScript + Express.js)
#########################################################################################

import jwt from "jsonwebtoken";

/*
এই function টি login successful হলে user এর জন্য JWT token generate করবে।
*/
export const createToken = (userId: string, email: string, role: string) => {
  const token = jwt.sign(
    {
      userId,
      email,
      role,
    },
    process.env.JWT_SECRET as string, // secret key always .env এ রাখতে হবে
    {
      expiresIn: "7d",     // token 7 দিন valid থাকবে
      issuer: "my-app",     // token কে issue করেছে
    }
  );

  return token;
};



#########################################################################################
# 3. Example: Login Controller with JWT Generation
#########################################################################################

import { Request, Response } from "express";
import bcrypt from "bcryptjs";

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // pretend user from DB
  const user = {
    id: "12345",
    email: "test@example.com",
    role: "admin",
    password: "$2a$10$dqi6BRlH5Nf8Wr6n1nB2xuGu6jRyHdFV8x7pX87By6jAgk6ZsFyHi", // hashed: "password123"
  };

  // 1. Password compare
  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    return res.status(401).json({
      success: false,
      message: "Invalid password!",
    });
  }

  // 2. Generate token
  const token = createToken(user.id, user.email, user.role);

  return res.json({
    success: true,
    message: "Login successful!",
    token,
  });
};



=========================================================================================
# C. COMPLETE SUMMARY 
=========================================================================================
/*
✔ JWT হলো stateless authentication token  
✔ 3 parts: header + payload + signature  
✔ Login successful হলে user এর জন্য token generate করা হয়  
✔ JWT verify করলে server বুঝতে পারে user কে  
✔ Password store হয় hashed, token store হয় signed  
✔ Token browser এ localStorage / cookies এ রাখা যায়  
✔ Secret key কখনোই codebase এ রাখা যাবে না (always .env)
*/

=========================================================================================
                                    THE END
=========================================================================================
