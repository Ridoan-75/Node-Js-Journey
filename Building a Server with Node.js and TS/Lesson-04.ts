=========================================================================================
                           CREATING A CUSTOM ROUTER 
=========================================================================================

***********************************************
# 1. Custom Router কি?
***********************************************
Custom Router মানে হলো —  
Node.js এ নিজের মতো করে এমন একটি structure তৈরি করা, যেখানে:

✔ সব Route আলাদা ফাইলে থাকবে  
✔ প্রতিটি Route আলাদা handler function ব্যবহার করবে  
✔ main server ফাইল clean থাকবে  
✔ Express ছাড়াই pure Node.js দিয়ে modular routing করা যাবে  

Exactly যেমন Express router কাজ করে — কিন্তু আমরা **নিজের custom router বানাচ্ছি**।



***********************************************
# 2. Project Structure
***********************************************
/src  
├── server.ts  
├── router  
│   ├── index.ts  
│   ├── user.router.ts  
│   └── product.router.ts  
└── controllers  
    ├── user.controller.ts  
    └── product.controller.ts  



***********************************************
# 3. Custom Router System (router/index.ts)
****************************************---------------
/*
Custom Router এর কাজ:
--------------------------------
1. method (GET/POST) অনুযায়ী ম্যাচ করা  
2. url অনুযায়ী route execute করা  
3. না মিললে 404 return করা  
*/

export type Handler = (
  req: any,
  res: any,
  body?: any
) => void;

interface Route {
  method: string;
  path: string;
  handler: Handler;
}

class Router {
  private routes: Route[] = [];

  register(method: string, path: string, handler: Handler) {
    this.routes.push({ method, path, handler });
  }

  match(method: string, path: string) {
    return this.routes.find(
      route => route.method === method && route.path === path
    );
  }
}

export const router = new Router();
-----------------------------------------------



***********************************************
# 4. Creating User Router (router/user.router.ts)
****************************************---------------
import { router } from "./index";
import { getUsers, createUser } from "../controllers/user.controller";

// GET → /users
router.register("GET", "/users", getUsers);

// POST → /users
router.register("POST", "/users", createUser);
-----------------------------------------------



***********************************************
# 5. User Controllers (controllers/user.controller.ts)
****************************************---------------
export const getUsers = (req: any, res: any) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "All users fetched!" }));
};

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
# 6. Product Router (router/product.router.ts)
**********************************************
import { router } from "./index";
import { getProducts } from "../controllers/product.controller";

router.register("GET", "/products", getProducts);
-----------------------------------------------



*****************************************************
# 7. Product Controller
****************************************************
export const getProducts = (req: any, res: any) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "All products retrieved!" }));
};
-----------------------------------------------



****************************************************************
# 8. Using Custom Router Inside Raw Node Server (server.ts)
****************************************************************
import http from "http";
import "./router/user.router";
import "./router/product.router";
import { router } from "./router";

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Match route
  const match = router.match(method || "", url || "");

  if (!match) {
    res.writeHead(404);
    return res.end(JSON.stringify({ error: "Route not found" }));
  }

  // If POST → collect body
  if (method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const parsed = JSON.parse(body || "{}");
      match.handler(req, res, parsed);
    });
    return;
  }

  // For GET
  match.handler(req, res);
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
-----------------------------------------------



***********************************************
# 9. Custom Router এর সুবিধা
***********************************************
✔ Express ছাড়া pure Node.js routing system  
✔ সব route আলাদা module এ  
✔ controller-based clean architecture  
✔ maintainability বৃদ্ধি  
✔ বড় project-এ সহজে scale করা যায়  



==============================================================
                        THE END
==============================================================
