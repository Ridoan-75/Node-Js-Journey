=========================================================================================
                        USING OUR CUSTOM ROUTE HANDLER (NODE + TS)
=========================================================================================

***********************************************
# 1. আমাদের Custom Route Handler কী?
***********************************************
Custom Route Handler মানে হলো —  
আমাদের তৈরি Router system কে ব্যবহার করে প্রতিটি API route এর request  
handle করা। অর্থাৎ:

✔ body collect করা  
✔ correct handler call করা  
✔ response পাঠানো  
✔ GET/POST method অনুযায়ী কাজ করা  

এটা Express এর মতোই কিন্তু pure Node.js দিয়ে আমরা own system বানাচ্ছি।



***********************************************
# 2. Route Handler আসলে কি করে?
***********************************************
Route Handler এর মূল কাজগুলো:

1) কোন route hit হয়েছে match করা  
2) GET হলে সরাসরি handler call  
3) POST হলে body collect করা  
4) তারপর parsed body সহ handler execute  
5) না মিললে 404 return  



***********************************************
# 3. আমাদের Custom Route Handler Logic (server.ts)
****************************************---------------
import http from "http";
import "./router/user.router";
import "./router/product.router";
import { router } from "./router";

const server = http.createServer((req, res) => {
  const method = req.method || "";
  const url = req.url || "";

  // 1️⃣ Route match করা
  const route = router.match(method, url);

  if (!route) {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Route not found" }));
  }

  // 2️⃣ POST হলে body collect করা
  if (method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedBody = body ? JSON.parse(body) : {};
      route.handler(req, res, parsedBody); // handler call
    });

    return;
  }

  // 3️⃣ GET হলে body ছাড়াই handler call
  route.handler(req, res);
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
-----------------------------------------------



***********************************************
# 4. Custom Handlers কীভাবে কাজ করছে?
***********************************************
Handler actually তিনটা parameter নেয়:

| Parameter | Explanation |
|----------|-------------|
| `req` | request object |
| `res` | response object |
| `body` | POST হলে parsed JSON body |

যেমন:  
→ GET handler body নেয় না  
→ POST handler body নেয়  


-----------------------------------------------
# Example GET Handler
-----------------------------------------------
export const getUsers = (req: any, res: any) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "All users fetched!" }));
};
-----------------------------------------------

-----------------------------------------------
# Example POST Handler
-----------------------------------------------
export const createUser = (req: any, res: any, body: any) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "User created successfully!",
      received: body,
    })
  );
};
-----------------------------------------------



***********************************************
# 5. Custom Route Handler কেন গুরুত্বপূর্ণ?
***********************************************
✔ Express ছাড়াই Router system তৈরি  
✔ Low-level HTTP handling শেখা  
✔ Backend architecture strong হয়  
✔ Real framework কিভাবে কাজ করে ভিতর থেকে বোঝা যায়  
✔ Future এ Express/NestJS সহজ হবে কারণ base already clear  



==============================================================
                        THE END
==============================================================
