=========================================================================================
                  BUILDING A SERVER WITH RAW NODE.JS & TYPESCRIPT
=========================================================================================

***********************************************
# 1. RAW SERVER কি?
***********************************************
Raw Server মানে — কোনো framework (Express) ছাড়া শুধু Node.js এর `http` module দিয়ে  
server বানানো। এখানে সবকিছু manually handle করতে হয়:

✔ Routing  
✔ Body parsing  
✔ Response headers  
✔ Status codes  
✔ JSON handling  

Low-level backend কিভাবে চলবে তা বুঝতে এটি অত্যন্ত গুরুত্বপূর্ণ।

-----------------------------------------------
# Node.js + TypeScript = Safe + Predictable Backend
-----------------------------------------------

***********************************************
# 2. Project Setup (A → Z)
***********************************************

## (A) Folder Create
-----------------------------------------------
mkdir raw-node-ts-server
cd raw-node-ts-server
-----------------------------------------------

## (B) Initialize npm
-----------------------------------------------
npm init -y
-----------------------------------------------

## (C) Install TypeScript & Tools
-----------------------------------------------
npm install typescript ts-node-dev @types/node --save-dev
-----------------------------------------------

## (D) TypeScript Config
-----------------------------------------------
npx tsc --init
-----------------------------------------------

## (E) tsconfig.json Essential Changes
-----------------------------------------------
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true
  }
}
-----------------------------------------------



***********************************************
# 3. Creating a RAW HTTP SERVER (TypeScript)
***********************************************

## (A) Basic Server Structure
-----------------------------------------------
// src/server.ts
import http, { IncomingMessage, ServerResponse } from "http";

const PORT: number = 5000;

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const method = req.method;
    const url = req.url;

    // Home Route
    if (url === "/" && method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Home Route Working!" }));
    }

    // About Route
    if (url === "/about" && method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "About Route Working!" }));
    }

    // POST Route Example
    if (url === "/data" && method === "POST") {
      let body = "";

      req.on("data", (chunk: Buffer) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const parsed = JSON.parse(body);

        res.writeHead(201, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            message: "Data Received Successfully!",
            received: parsed
          })
        );
      });

      return;
    }

    // Not Found
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route Not Found!" }));
  }
);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
-----------------------------------------------



***********************************************
# 4. Run the Server
***********************************************
-----------------------------------------------
npm run dev
-----------------------------------------------

(reference script ↓)
-----------------------------------------------
// package.json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts"
}
-----------------------------------------------



***********************************************
# 5. Testing The Server (POSTMAN দিয়ে)
***********************************************

## GET Requests
-----------------------------------------------
GET  http://localhost:5000/
GET  http://localhost:5000/about
-----------------------------------------------

## POST Request
-----------------------------------------------
POST http://localhost:5000/data
Body → raw → JSON:
{
  "name": "Ridoan",
  "age": 21
}
-----------------------------------------------



***********************************************
# 6. What You Learned (Core Concepts)
***********************************************
✔ http module কিভাবে কাজ করে  
✔ TypeScript দিয়ে server তৈরি  
✔ Manual routing system  
✔ How to read request body  
✔ How to send JSON response  
✔ How to handle headers + status codes  


==============================================================
                        THE END
==============================================================
