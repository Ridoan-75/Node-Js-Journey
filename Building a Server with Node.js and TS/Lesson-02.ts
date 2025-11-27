=========================================================================================
                  WORKING WITH ENVIRONMENT-BASED CONFIGURATION
=========================================================================================

***********************************************
# 1. Environment-Based Configuration কি?
***********************************************
Environment-Based Configuration মানে হলো —  
**development, production, testing**—এই বিভিন্ন environment অনুযায়ী আলাদা configuration
ব্যবহার করা।

যেমন:
✔ Development → local database  
✔ Production → live database  
✔ Different API keys  
✔ Different log level  
✔ Sensitive values `.env` এ রাখা  

এতে করে:
✓ কোড clean থাকে  
✓ Security বাড়ে  
✓ বিভিন্ন environment shift করা সহজ হয়  

-----------------------------------------------
# .env ফাইল = আপনার গোপন তথ্য
-----------------------------------------------



***********************************************
# 2. Project Setup (TypeScript + dotenv)
***********************************************

## (A) Install dotenv
-----------------------------------------------
npm install dotenv
-----------------------------------------------

## (B) Create .env File
-----------------------------------------------
PORT=5000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/devdb
SECRET_KEY=supersecret123
-----------------------------------------------

⚠️ `.env` ফাইল কখনো GitHub এ push করবেন না  
→ `.gitignore` এ অবশ্যই যোগ করবেন।



***********************************************
# 3. Load ENV Variables (config.ts)
***********************************************

## (A) config.ts ফাইল তৈরি
-----------------------------------------------
// src/config.ts
import dotenv from "dotenv";

// Load .env
dotenv.config();

// Strongly typed interface
interface IConfig {
  port: number;
  env: string;
  dbUrl: string;
  secretKey: string;
}

export const config: IConfig = {
  port: Number(process.env.PORT) || 5000,
  env: process.env.NODE_ENV || "development",
  dbUrl: process.env.DB_URL || "",
  secretKey: process.env.SECRET_KEY || ""
};
-----------------------------------------------

TypeScript এর interface ব্যবহার করার ফলে ভুল key access করলে compile-time error পাবেন।



***********************************************
# 4. Using Config Inside Raw Node.js Server
****************************************---------------

// src/server.ts
import http from "http";
import { config } from "./config";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: "Server Running with Environment Config!",
      env: config.env,
      db: config.dbUrl
    })
  );
});

server.listen(config.port, () => {
  console.log(`Server running on PORT ${config.port}`);
});
-----------------------------------------------



***********************************************
# 5. Environment Wise Config (dev / prod)
***********************************************

## (A) .env.dev
-----------------------------------------------
PORT=5000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/devdb
SECRET_KEY=dev-key-123
-----------------------------------------------

## (B) .env.prod
-----------------------------------------------
PORT=8080
NODE_ENV=production
DB_URL=mongodb+srv://live-db-url
SECRET_KEY=prod-key-987
-----------------------------------------------

## (C) Smart loader (envLoader.ts)
-----------------------------------------------
import dotenv from "dotenv";
import path from "path";

const envFile = process.env.NODE_ENV === "production" 
  ? ".env.prod" 
  : ".env.dev";

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export {};
-----------------------------------------------

এখন automatic environment অনুযায়ী আলাদা .env লোড হবে।



***********************************************
# 6. package.json Scripts
****************************************---------------
// package.json
"scripts": {
  "dev": "cross-env NODE_ENV=development ts-node-dev src/server.ts",
  "prod": "cross-env NODE_ENV=production ts-node-dev src/server.ts"
}
-----------------------------------------------

✓ `dev` script → `.env.dev` load  
✓ `prod` script → `.env.prod` load  



***********************************************
# 7. Why Environment-Based Config is Important?
***********************************************
✔ Sensitive credentials নিরাপদ রাখা যায়  
✔ Production & Development behavior আলাদা রাখা যায়  
✔ Deployment খুব সহজ হয়  
✔ Large scale project এ maintainability বৃদ্ধি পায়  
✔ TypeScript এর সাথে config structure strongly typed হয়  



==============================================================
                        THE END
==============================================================
