=========================================================================================
                      USING DOTENV WITH A CONFIGURATION SYSTEM (NODE.JS)
=========================================================================================

#########################################################################################
# 1. DOTENV কী?
#########################################################################################
/*
dotenv হলো একটি ছোট Node.js প্যাকেজ যা `.env` ফাইল থেকে environment variables লোড করে
`process.env`–তে যোগ করে। এর ফলে অ্যাপ্লিকেশন code-এর বাইরে নিরাপদভাবে configuration রাখা যায়।

কেন dotenv ব্যবহার করা হয়?
✔ API keys, DB credentials, secret values লুকিয়ে রাখা
✔ Dev, Staging, Production—সব জায়গায় আলাদা config রাখা
✔ Hard-coded sensitive data এড়ানো
✔ Configuration management সহজ করা
*/
require("dotenv").config(); // dotenv load করা হচ্ছে


#########################################################################################
# 2. ENVIRONMENT VARIABLES কী এবং কেন ব্যবহার করা হয়?
#########################################################################################
/*
Environment variables হলো এমন dynamic মান যা runtime-এ অ্যাপ্লিকেশন পড়তে পারে।

ব্যবহার:
- Database credentials
- API keys
- Tokens
- Server settings
- Feature flags
- Logging levels

এগুলো codebase-এর বাইরে রাখা হয় যাতে নিরাপত্তা বজায় থাকে এবং environment বদলানো সহজ হয়।
*/


#########################################################################################
# 3. BASIC DOTENV SETUP (Node.js)
#########################################################################################

# A) .env ফাইল তৈরি করা
PORT=5000
DB_URL=mongodb://localhost:27017/mydb
JWT_SECRET=somethingverysecret


# B) index.js ফাইল — dotenv লোড করা
require("dotenv").config();

console.log("PORT:", process.env.PORT);
console.log("DB_URL:", process.env.DB_URL);
console.log("JWT_SECRET:", process.env.JWT_SECRET);


#########################################################################################
# 4. CONFIGURATION ORGANIZATION (config folder ব্যবহার করে)
#########################################################################################
/*
সেরা practice হলো একটি central config সিস্টেম তৈরি করা।
*/

# A) config/index.js
require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    url: process.env.DB_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};


# B) main app (app.js)
const config = require("./config");

console.log("App running on PORT:", config.port);
console.log("Database URL:", config.db.url);
console.log("JWT Secret:", config.jwt.secret);


#########################################################################################
# 5. নিরাপদ CONFIG PATTERN — Validation সহ (Joi ব্যবহার করে)
#########################################################################################

# A) Install:
# npm install joi

# B) config/validate.js
const Joi = require("joi");

const envSchema = Joi.object({
  PORT: Joi.number().required(),
  DB_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(10).required(),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`❌ Env Validation Error: ${error.message}`);
}

module.exports = value;


# C) config/index.js
require("dotenv").config();
const env = require("./validate");

module.exports = {
  port: env.PORT,
  db: { url: env.DB_URL },
  jwt: { secret: env.JWT_SECRET },
};


#########################################################################################
# 6. TYPESCRIPT VERSION (Strongly typed configuration)
#########################################################################################

# A) type definition — config/types.ts
export interface Config {
  port: number;
  db: { url: string };
  jwt: { secret: string };
}


# B) config/index.ts
import * as dotenv from "dotenv";
dotenv.config();

import { Config } from "./types";

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  db: { url: process.env.DB_URL || "" },
  jwt: { secret: process.env.JWT_SECRET || "" },
};

export default config;


# C) ব্যবহার:
import config from "./config";
console.log(config);


#########################################################################################
# 7. MULTI-ENVIRONMENT CONFIG (dev/test/prod)
#########################################################################################

# A) ফোল্ডার স্ট্রাকচার:
config/
 ├── env/
 │    ├── .env.development
 │    ├── .env.production
 │    ├── .env.test
 └── index.js


# B) dotenv-flow ইনস্টল:
# npm install dotenv-flow

# C) config loader
require("dotenv-flow").config({
  path: "./config/env",
});

console.log(process.env.DB_URL);


#########################################################################################
# 8. SECURITY TIPS
#########################################################################################
/*
✔ `.env` কখনও GitHub এ push করবে না (সবসময় .gitignore এ রাখো)
✔ Production-এ environment variables server বা container-level এ set করবে
✔ Default/fallback values তৈরি করা উচিত
✔ Validation ছাড়া env values ব্যবহার নয়
✔ Secrets rotation policy রাখা উচিত
*/


#########################################################################################
# 9. PRACTICAL PROJECT EXAMPLE — Express App with Config
#########################################################################################

# app.js
const express = require("express");
const config = require("./config");

const app = express();

app.get("/", (req, res) => {
  res.send("Server running!");
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});


#########################################################################################
# 10. REAL-LIFE USE CASES
#########################################################################################
/*
✔ Web application config management  
✔ Database & API credentials  
✔ JWT / OAuth secret management  
✔ Feature toggles  
✔ Cloud/Container environment config  
✔ CI/CD pipeline configuration  
*/


#########################################################################################
# 11. SUMMARY
#########################################################################################
/*
▪ dotenv `.env` ফাইল থেকে secure ভাবে values লোড করে  
▪ central config system ব্যবহার করলে maintenance সহজ হয়  
▪ Typescript দিয়ে strongly typed config পাওয়া যায়  
▪ Validation (Joi) ব্যবহার করলে ভুল env value ধরা যায়  
▪ Multi-environment setup production-grade project–এ অত্যন্ত প্রয়োজনীয়  
*/

=========================================================================================
                                      THE END
=========================================================================================

