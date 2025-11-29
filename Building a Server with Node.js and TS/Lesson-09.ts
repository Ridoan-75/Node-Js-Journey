=========================================================================================
                           HANDLING DYNAMIC ROUTES 
=========================================================================================

***********************************************
# 1. Dynamic Route কী?
***********************************************
Dynamic Route মানে:

➡ URL-এর ভিতরে variable থাকে  
➡ যেমন: `/api/users/10` → এখানে **10** হলো dynamic value  
➡ এই value আমরা params হিসেবে ধরতে পারি  

Express হলে `req.params.id`  
কিন্তু আমরা **নিজস্ব Router System** বানাচ্ছি, তাই manually extract করতে হবে।  



***********************************************
# 2. Dynamic Route কেমন দেখায়?
***********************************************
Examples:

/api/users/:id  
/api/products/:productId  
/blog/:slug  

✔ Colon (:) এর পরের অংশটুকু হলো dynamic parameter।  



***********************************************
# 3. আমাদের Router-এ Dynamic Path Match করার Logic
***********************************************
Dynamic path match করার rule:

1) URL-কে split করে parts বানাই  
2) Route-এর path-ও split করি  
3) একই length হলে compare করি  
4) কোনো segment যদি ":" দিয়ে শুরু হয় → সেটাকে param ধরব  
5) না হলে exact match হবে  
6) সব match হলে params collect করে return দেব  



****************************************---------------
# 4. Router Class – Dynamic Route Support
****************************************---------------
export class Router {
  private routes: any[] = [];

  get(path: string, handler: any) {
    this.routes.push({ method: "GET", path, handler });
  }

  post(path: string, handler: any) {
    this.routes.push({ method: "POST", path, handler });
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
          const key = routeParts[i].substring(1);
          params[key] = urlParts[i];
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
# 5. Example: Dynamic Route Register
***********************************************
import { router } from "../router";
import { getUserById } from "../handlers/user.handler";

router.get("/api/users/:id", getUserById);



***********************************************
# 6. Example Handler with Dynamic Params
***********************************************
import { sendJson } from "../utils/sendJson";
import { readDB } from "../utils/readDB";

export const getUserById = (req: any, res: any, params: any) => {
  const db = readDB();
  const user = db.users.find((u: any) => u.id == params.id);

  if (!user) {
    return sendJson(res, 404, { error: "User not found" });
  }

  return sendJson(res, 200, user);
};



***********************************************
# 7. Server.ts – Handler Call With Params
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

  if (method === "POST") {
    const body = await parseBody(req);
    return route.handler(req, res, route.params, body);
  }

  return route.handler(req, res, route.params);
});

server.listen(5000, () => {
  console.log("🔥 Server running on port 5000");
});



***********************************************
# 8. Dynamic Routes দিয়ে কী করতে পারো?
***********************************************
✔ Single user fetch  
✔ Product details page  
✔ Delete by id  
✔ Update by id  
✔ Slug based blog fetch  
✔ Category-based filtering  

==============================================================
                         THE END ✔  
==============================================================
