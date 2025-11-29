=========================================================================================
                    DYNAMIC ROUTE HANDLING FOR PUT REQUESTS 
=========================================================================================

***********************************************
# 1. PUT Request কী?
***********************************************
PUT মানে হলো → **existing data পুরোপুরি update করা**  
Dynamic route থাকলে আমরা সাধারণত এভাবে লিখি:

/api/users/:id  
/api/products/:id  

PUT Request =  
✔ URL থেকেও data লাগবে (id)  
✔ Body থেকেও new updated data লাগবে  



***********************************************
# 2. আমাদের Custom Router-এ PUT Support যোগ করা
***********************************************
PUT route register করতে হলে router-এ put() method add করতে হবে।

export class Router {
  private routes: any[] = [];

  get(path: string, handler: any) {
    this.routes.push({ method: "GET", path, handler });
  }

  post(path: string, handler: any) {
    this.routes.push({ method: "POST", path, handler });
  }

  put(path: string, handler: any) {
    this.routes.push({ method: "PUT", path, handler });
  }

  match(method: string, url: string) {
    const urlParts = url.split("/").filter(Boolean);

    for (const route of this.routes) {
      if (route.method !== method) continue;

      const routeParts = route.path.split("/").filter(Boolean);

      if (routeParts.length !== urlParts.length) continue;

      const params: any = {};
      let matched = true;

      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(":")) {
          params[routeParts[i].substring(1)] = urlParts[i];
        } else if (routeParts[i] !== urlParts[i]) {
          matched = false;
          break;
        }
      }

      if (matched) return { ...route, params };
    }

    return null;
  }
}

export const router = new Router();



***********************************************
# 3. Server.ts — PUT Handler Execute করা
***********************************************
import http from "http";
import "./router/user.route";
import { router } from "./router";
import { parseBody } from "./utils/parseBody";

const server = http.createServer(async (req, res) => {
  const method = req.method || "";
  const url = req.url || "";

  const route = router.match(method, url);

  if (!route) {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Route not found" }));
  }

  if (method === "PUT" || method === "POST") {
    const body = await parseBody(req);
    return route.handler(req, res, route.params, body);
  }

  return route.handler(req, res, route.params);
});

server.listen(5000, () => {
  console.log("⚡ Server running on port 5000");
});



***********************************************
# 4. PUT Route Register করা (user.route.ts)
***********************************************
import { router } from "../router";
import { updateUser } from "../handlers/user.handler";

router.put("/api/users/:id", updateUser);



***********************************************
# 5. PUT Handler Implementation (Update User)
***********************************************
import { readDB } from "../utils/readDB";
import { writeDB } from "../utils/writeDB";
import { sendJson } from "../utils/sendJson";

export const updateUser = (req: any, res: any, params: any, body: any) => {
  const db = readDB();

  const index = db.users.findIndex((u: any) => u.id == params.id);

  if (index === -1) {
    return sendJson(res, 404, { error: "User not found" });
  }

  db.users[index] = {
    ...db.users[index],
    ...body, // overwrite with new data
  };

  writeDB(db);

  return sendJson(res, 200, {
    message: "User updated successfully!",
    data: db.users[index],
  });
};



***********************************************
# 6. PUT Dynamic Route কীভাবে Handle হয়?
***********************************************
✔ Step 1: URL → `/api/users/20`  
✔ Step 2: router.match() → `id = 20` extract  
✔ Step 3: parseBody() → নতুন updated data নেয়  
✔ Step 4: handler(req, res, params, body) কল করা হয়  
✔ Step 5: File database overwrite করে updated user save করা হয়  



***********************************************
# 7. এখন তুমি এই PUT Route দিয়ে যা করতে পারো:
***********************************************
✔ User update  
✔ Product update  
✔ Category update  
✔ Blog edit  
✔ Profile update  

Dynamic route + PUT = Full REST API power!  



==============================================================
                         THE END ✔  
==============================================================
