=========================================================================================
             ADDING `.env` FILE & CONNECTING PROJECT WITH GITHUB (PRO LEVEL)
=========================================================================================

#########################################################################################
# A. ADDING ENVIRONMENT VARIABLES (.env)
#########################################################################################
/*
Security reason এ database credentials কখনই codebase এ রাখা যায় না।  
এজন্য আমরা `.env` file ব্যবহার করবো।
*/

---------------------------------------------
A1. Install dotenv package  
---------------------------------------------
npm install dotenv

---------------------------------------------
A2. Create `.env` file (root folder)  
---------------------------------------------
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=express_crud
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

---------------------------------------------
A3. Load `.env` inside project (src/db/pool.ts)  
---------------------------------------------
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

// test connection
pool.connect()
  .then(() => console.log("📌 PostgreSQL Connected Using Pool + ENV"))
  .catch(err => console.error("❌ Pool Connection Error:", err));

---------------------------------------------
A4. Update tsconfig.json (if needed)  
---------------------------------------------
"resolveJsonModule": true,
"esModuleInterop": true

---------------------------------------------
A5. Add `.env` to .gitignore  
---------------------------------------------
.env

/*
এইভাবে এখন sensitive information GitHub এ push হবে না।
*/

=========================================================================================
# B. CONNECT PROJECT WITH GITHUB (FULL STEP)
=========================================================================================

#########################################################################################
# B1. CREATE GITHUB REPOSITORY
#########################################################################################
/*
1) github.com → New Repository  
2) Repository Name দিন  
3) Public or Private নির্বাচন করুন  
4) Create Repository  
*/

=========================================================================================
# B2. CONNECT LOCAL PROJECT TO GITHUB
=========================================================================================

---------------------------------------------
B2.1 Initialize Git  
---------------------------------------------
git init

---------------------------------------------
B2.2 Add all project files  
---------------------------------------------
git add .

---------------------------------------------
B2.3 First Commit  
---------------------------------------------
git commit -m "Initial Express + TS + PostgreSQL setup"

---------------------------------------------
B2.4 Add remote origin  
---------------------------------------------
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

---------------------------------------------
B2.5 Push to GitHub  
---------------------------------------------
git push -u origin main

=========================================================================================
# C. FINAL CHECKLIST (VERY IMPORTANT)
=========================================================================================
✔ .env file exists  
✔ .gitignore includes `.env`  
✔ pool.ts loads env variables  
✔ Git repository created  
✔ Origin added  
✔ Code pushed successfully  

=========================================================================================
                                        THE END
=========================================================================================
