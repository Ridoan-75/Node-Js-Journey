=========================================================================================
                CREATING PARSEBODY & BUILDING A CLEAN POST API
=========================================================================================

***********************************************
# 1. parseBody() ফাংশন কী?
***********************************************
parseBody() হলো একটি utility function যেটা incoming request-এর raw JSON body  
→ collect করে  
→ parse করে  
→ final object হিসেবে return করে।

✔ Node.js default ভাবে body parse করে না  
✔ তাই manually chunk data নিয়ে JSON.parse() করতে হয়  



***********************************************
# 2. parseBody() কিভাবে কাজ করে?
***********************************************
1) req.on("data") → chunk জমাও  
2) req.on("end") → join করে JSON parse করো  
3) try/catch → invalid JSON detect করো  
4) Promise return → async handler-এ সহজে ব্যবহার করা যায়  



***********************************************
# 3. parseBody() Implementation (utils/parseBody.ts)
***********************************************
import { IncomingMessage } from "http";

export const parseBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (err) {
        reject(new Error("❌ Invalid JSON format"));
      }
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
};



***********************************************
# 4. sendJson() – Clean Response Utility
***********************************************
import { ServerResponse } from "http";

export const sendJson = (
  res: ServerResponse,
  status: number,
  data: any
) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data, null, 2));
};



***********************************************
# 5. Clean POST API তৈরি (Handler + Body Parsing)
***********************************************
এবার আমরা একটি clean POST API বানাচ্ছি যেটা:

✔ parseBody() দিয়ে body collect করবে  
✔ validation করবে  
✔ sendJson() দিয়ে proper response দেবে  



****************************************---------------
# Example: POST /api/users (routes/user.route.ts)
****************************************---------------
import { parseBody } from "../utils/parseBody";
import { sendJson } from "../utils/sendJson";

export const createUser = async (req: any, res: any) => {
  try {
    const body = await parseBody(req);

    if (!body.name || !body.email) {
      return sendJson(res, 400, { error: "name এবং email প্রয়োজন" });
    }

    const user = {
      id: Date.now(),
      name: body.name,
      email: body.email,
    };

    return sendJson(res, 201, {
      message: "User created successfully!",
      data: user,
    });
  } catch (err) {
    return sendJson(res, 500, { error: "Invalid JSON body" });
  }
};



***********************************************
# 6. Custom Router-এ POST Route Register
***********************************************
import { router } from "../router";
import { createUser } from "./user.route";

router.post("/api/users", createUser);



**************************************************
# 7. Final server.ts (Clean + parseBody + Router)
**************************************************
import http from "http";
import "./router/user.route";
import { router } from "./router";

const server = http.createServer((req, res) => {
  router.handle(req, res);
});

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});



***********************************************
# 8. Clean POST API এর Benefits
***********************************************
✔ নিজস্ব Express-like Routing system  
✔ Body parsing fully controlled  
✔ sendJson() দিয়ে clean response  
✔ Maintainable architecture  
✔ Core Node.js concept crystal clear  



==============================================================
                         THE END ✔
==============================================================
