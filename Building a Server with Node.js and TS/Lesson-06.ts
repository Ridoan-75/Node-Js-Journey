=========================================================================================
                 IMPLEMENTING sendJson() & CLEANING UP server.ts
=========================================================================================

***********************************************
# 1. sendJson() কি?
***********************************************
`sendJson()` হলো একটি ছোট utility function, যেটা pure Node.js HTTP server ব্যবহার করার সময়  
বারবার যেসব কাজ করতে হয় — সেগুলোকে এক জায়গায় এনে সহজ করে দেয়।

এই কাজগুলো হলো:

✔ `writeHead()` দিয়ে status + JSON header সেট করা  
✔ `JSON.stringify()` দিয়ে object কে JSON বানানো  
✔ `res.end()` দিয়ে response পাঠানো  

অর্থাৎ — যেটা Express এর `res.json()` করে, আমরা pure Node.js এ তার নিজের version বানাচ্ছি।



***********************************************
# 2. Project Structure
***********************************************
/src  
├── server.ts  
└── utils  
    └── sendJson.ts  



***********************************************
# 3. sendJson() Utility Function (utils/sendJson.ts)
****************************************---------------
```ts
// ------------------------------------------------------------------------------------
// utils/sendJson.ts
// ------------------------------------------------------------------------------------
// এই function টি JSON response পাঠানোর কাজকে সহজ এবং reusable করে তোলে।

import { ServerResponse } from "http";

export function sendJson(
  res: ServerResponse,     // Response object যেখানে data পাঠানো হবে
  statusCode: number,      // HTTP status code (যেমন 200, 404, 500)
  data: any                // যে data object আকারে পাঠানো হবে
) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json", // JSON টাইপ সেট
  });

  res.end(JSON.stringify(data, null, 2)); // Pretty JSON response
}
```
-----------------------------------------------



***********************************************
# 4. Cleaning Up server.ts Using sendJson()
****************************************---------------
```ts
// ------------------------------------------------------------------------------------
// server.ts
// ------------------------------------------------------------------------------------
// আগের messy কোডকে clean, readable, এবং reusable করা হয়েছে sendJson() ব্যবহার করে।

import http from "http";
import { sendJson } from "./utils/sendJson";

const PORT = 5000;

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // ----------------------------
  // GET /
  // ----------------------------
  if (url === "/" && method === "GET") {
    return sendJson(res, 200, {
      message: "Welcome to our clean Node.js server!",
    });
  }

  // ----------------------------
  // GET /about
  // ----------------------------
  if (url === "/about" && method === "GET") {
    return sendJson(res, 200, {
      app: "Node.js Custom Server",
      author: "Md Ridoan",
    });
  }

  // ----------------------------
  // POST /data
  // ----------------------------
  if (url === "/data" && method === "POST") {
    let body = "";

    req.on("data", chunk => (body += chunk));

    req.on("end", () => {
      const parsed = JSON.parse(body || "{}");
      return sendJson(res, 200, {
        message: "Data received successfully!",
        received: parsed,
      });
    });

    return;
  }

  // ----------------------------
  // No Route Found → 404
  // ----------------------------
  return sendJson(res, 404, {
    error: "Route not found",
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

-----------------------------------------------



***********************************************
# 5. কেন sendJson() দরকার?
***********************************************
✔ server.ts clean হয়ে যায়  
✔ বারবার JSON header + stringify লেখার দরকার নেই  
✔ reusable utility তৈরি হয়  
✔ বড় project এ response handling সহজ হয়  
✔ controller/router system বানাতে perfect foundation



==============================================================
                        THE END
==============================================================
