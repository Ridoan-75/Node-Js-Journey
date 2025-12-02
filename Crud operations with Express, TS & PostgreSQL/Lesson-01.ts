=========================================================================================
                 CREATING A SIMPLE SERVER WITH EXPRESS.JS & TYPESCRIPT
=========================================================================================

#########################################################################################
# A. PROJECT SETUP (Express + TypeScript)
#########################################################################################

---------------------------------------------
A1. Initialize Node Project  
---------------------------------------------
npm init -y

---------------------------------------------
A2. Install Dependencies  
---------------------------------------------
npm install express
npm install -D typescript ts-node @types/node @types/express nodemon

---------------------------------------------
A3. Create tsconfig.json  
---------------------------------------------
npx tsc --init

tsconfig.json এ basic config:
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true
  }
}

#########################################################################################
# B. CREATE SIMPLE EXPRESS SERVER
#########################################################################################

---------------------------------------------
B1. Create src/server.ts  
---------------------------------------------
import express, { Request, Response } from "express";

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello Express + TypeScript Server!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

#########################################################################################
# C. ADD SCRIPTS IN package.json
#########################################################################################
"scripts": {
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}

#########################################################################################
# D. RUN THE SERVER
#########################################################################################
# Development:
npm run dev

# Build & Start:
npm run build
npm start

#########################################################################################
                                    THE END
#########################################################################################
