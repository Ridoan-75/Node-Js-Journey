=========================================================================================
                      SETTING UP A FAKE JSON DATABASE (NODE + TS)
=========================================================================================

***********************************************
# 1. Fake JSON Database কী?
***********************************************
Fake JSON Database মানে হলো একটি সাধারণ `.json` ফাইলকে ছোটখাটো database হিসেবে
ব্যবহার করা। এতে আপনি:

✔ Read করতে পারবেন  
✔ Write করতে পারবেন  
✔ Update/Delete করতে পারবেন  
✔ কোনো external database ছাড়াই কাজ করতে পারবেন  



***********************************************
# 2. কেন Fake JSON Database ব্যবহার করবো?
***********************************************
✔ খুব দ্রুত setup  
✔ File-based simple storage  
✔ কোনো install/config নেই  
✔ CRUD practice করার জন্য perfect  
✔ Demo বা ছোট project এর জন্য ideal  



***********************************************
# 3. ফাইল Structure কেমন হবে?
***********************************************
project/
│
├── data/
│   └── db.json
│
├── utils/
│   ├── readDB.ts
│   └── writeDB.ts
│
└── server.ts



***********************************************
# 4. db.json তৈরি করা
***********************************************
{
  "users": [],
  "products": []
}



***********************************************
# 5. readDB() Function – JSON ফাইল থেকে Data পড়া
***********************************************
import fs from "fs";
import path from "path";

const dbPath = path.join(__dirname, "../data/db.json");

export const readDB = () => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};



***********************************************
# 6. writeDB() Function – JSON ফাইলে Data লেখা
***********************************************
import fs from "fs";
import path from "path";

const dbPath = path.join(__dirname, "../data/db.json");

export const writeDB = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};



***********************************************
# 7. POST API → User Add করা (createUser)
***********************************************
import { parseBody } from "../utils/parseBody";
import { readDB } from "../utils/readDB";
import { writeDB } from "../utils/writeDB";
import { sendJson } from "../utils/sendJson";

export const createUser = async (req: any, res: any) => {
  try {
    const body = await parseBody(req);
    const db = readDB();

    const newUser = {
      id: Date.now(),
      name: body.name,
      email: body.email,
    };

    db.users.push(newUser);
    writeDB(db);

    return sendJson(res, 201, {
      message: "User added!",
      data: newUser,
    });
  } catch (err) {
    return sendJson(res, 500, { error: "Something went wrong" });
  }
};



***********************************************
# 8. GET API → All Users Fetch করা (getUsers)
***********************************************
import { readDB } from "../utils/readDB";
import { sendJson } from "../utils/sendJson";

export const getUsers = (req: any, res: any) => {
  const db = readDB();
  return sendJson(res, 200, db.users);
};



***********************************************
# 9. Advantages of JSON Fake DB
***********************************************
✔ কোনো SQL লাগছে না  
✔ Setup অত্যন্ত সহজ  
✔ File-based data store  
✔ Beginners-friendly  
✔ দ্রুত API test করা যায়  



==============================================================
                         THE END ✔
==============================================================
