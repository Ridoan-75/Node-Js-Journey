=========================================================================================
                INSTALLING POSTGRES AS DATABASE AND CONNECTION 
=========================================================================================

#########################################################################################
# A. INSTALLING POSTGRESQL (2 PROFESSIONAL METHODS)
#########################################################################################

=========================================================================================
# A1. METHOD 1 — INSTALLING FROM OFFICIAL WEBSITE
=========================================================================================

1) Visit: https://www.postgresql.org/download/  
2) Your OS নির্বাচন করুন  
3) Installer Download করুন  
4) Install করার সময়:
   ✔ PostgreSQL Server  
   ✔ pgAdmin 4  
   ✔ Command Line Tools  
   সব tick রাখবেন  
5) Password সেট করুন  
6) Default Port রাখুন → **5432**  
7) Installation Finish  
8) Verify:
   psql --version

=========================================================================================
# A2. METHOD 2 — INSTALL USING PACKAGE MANAGERS (FASTER FOR DEVELOPERS)
=========================================================================================

---------------------------------------------
Windows (Chocolatey)
---------------------------------------------
choco install postgresql

---------------------------------------------
macOS (Homebrew)
---------------------------------------------
brew install postgresql
brew services start postgresql

---------------------------------------------
Ubuntu / Debian (APT)
---------------------------------------------
sudo apt update
sudo apt install postgresql postgresql-contrib

---------------------------------------------
Fedora / RHEL / CentOS (DNF)
---------------------------------------------
sudo dnf install postgresql-server postgresql-contrib

=========================================================================================
# B. CREATE A DATABASE FOR EXPRESS PROJECT
=========================================================================================
psql -U postgres
CREATE DATABASE express_crud;

অথবা pgAdmin → Create → Database → **express_crud**

=========================================================================================
# C. EXPRESS + TYPESCRIPT + POSTGRES CONNECTION SETUP
=========================================================================================

#########################################################################################
# C1. INSTALL BACKEND PACKAGES
#########################################################################################
npm install express pg
npm install -D typescript ts-node @types/node @types/express nodemon @types/pg

#########################################################################################
# C2. PROJECT STRUCTURE
#########################################################################################
/*
src/
 ├── db/
 │    └── index.ts          → PostgreSQL connection setup
 ├── app.ts                 → Express configuration
 └── server.ts              → Server bootstrap
*/

=========================================================================================
# C3. CREATE CONNECTION FILE (src/db/index.ts)
=========================================================================================
import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "express_crud",
  password: "your_password",
  port: 5432,
});

// testing connection
pool.connect()
  .then(() => console.log("📌 PostgreSQL Connected Successfully"))
  .catch(err => console.error("❌ PostgreSQL Connection Error:", err));

=========================================================================================
# C4. CREATE EXPRESS APP (src/app.ts)
=========================================================================================
import express from "express";

const app = express();

// middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express + TypeScript + PostgreSQL Ready!");
});

export default app;

=========================================================================================
# C5. SERVER BOOTSTRAP (src/server.ts)
=========================================================================================
import app from "./app";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

=========================================================================================
# C6. PACKAGE.JSON SCRIPTS
=========================================================================================
"scripts": {
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}

=========================================================================================
# D. RUN THE PROJECT
=========================================================================================
# Development mode:
npm run dev

# Production build:
npm run build
npm start

=========================================================================================
                                    THE END
=========================================================================================
