=========================================================================================
                  DELETING FILES WITH THE FS MODULE IN NODE.JS
=========================================================================================

*****************************************************************
# 1. ফাইল Delete করার জন্য কোন fs ফাংশনগুলো ব্যবহার হয়?
*****************************************************************
Node.js এ ফাইল delete করতে মূলত ৩টি মেথড ব্যবহার হয়:

1. `fs.unlink()` → Asynchronous delete  
2. `fs.unlinkSync()` → Synchronous delete  
3. `fs.rm()` / `fs.rmSync()` → Modern delete method (Node 14.14+)  
   ✔ ফাইল  
   ✔ ফোল্ডার  
   ✔ recursive delete — সবই করতে পারে  

-----------------------------------------------
# Common Methods:
-----------------------------------------------
| Method       | Type    | কাজ                 |
|--------------|---------|----------------------|
| unlink()     | async   | File delete          |
| unlinkSync() | sync    | File delete          |
| rm()         | async   | File + Folder delete |
| rmSync()     | sync    | File + Folder delete |

***********************************************
# 2. fs.unlink() — Async File Delete
***********************************************
`fs.unlink()` হলো পুরোনো কিন্তু widely-used method।

-----------------------------------------------
// delete.js
const fs = require("fs");

/*
  unlink() asynchronous ভাবে কাজ করে।
  এখানে "test.txt" নামের ফাইল delete করা হচ্ছে।
*/
fs.unlink("test.txt", (err) => {
  if (err) {
    console.error("Error deleting file:", err);
    return;
  }
  console.log("File deleted successfully!");
});
-----------------------------------------------


***********************************************
# 3. fs.unlinkSync() — Sync File Delete
***********************************************
Synchronous delete — file delete না হওয়া পর্যন্ত code থেমে থাকবে।

-----------------------------------------------
// deleteSync.js
const fs = require("fs");

try {
  fs.unlinkSync("test.txt");
  console.log("File deleted (sync)!");
} catch (err) {
  console.error("Error:", err);
}
-----------------------------------------------


***********************************************
# 4. Modern Method → fs.rm() (Async)
***********************************************
Node.js 14.14+ থেকে `fs.rm()` এসেছে  
যা unlink() এর পরিবর্তে বেশি powerful।

-----------------------------------------------
// deleteWithRm.js
const fs = require("fs");

/*
  rm() দিয়ে ফাইল delete করা হচ্ছে।
*/
fs.rm("test.txt", (err) => {
  if (err) throw err;
  console.log("File deleted using rm()!");
});
-----------------------------------------------


***********************************************
# 5. fs.rmSync() — Sync Version
****************************************---------------

-----------------------------------------------
// deleteWithRmSync.js
const fs = require("fs");

try {
  fs.rmSync("test.txt");
  console.log("File deleted using rmSync()!");
} catch (err) {
  console.error(err);
}
-----------------------------------------------


***********************************************
# 6. Directory Delete করা (Recursive)
***********************************************
✔ সম্পূর্ণ ফোল্ডার delete  
✔ সাব-ফাইল + সাব-ফোল্ডারসহ সব মুছে ফেলে  

## (A) Async Recursive Delete
-----------------------------------------------
// deleteFolder.js
const fs = require("fs");

fs.rm("myFolder", { recursive: true, force: true }, (err) => {
  if (err) throw err;
  console.log("Folder deleted recursively!");
});
-----------------------------------------------

## (B) Sync Recursive Delete
-----------------------------------------------
// deleteFolderSync.js
const fs = require("fs");

try {
  fs.rmSync("myFolder", { recursive: true, force: true });
  console.log("Folder deleted recursively (sync)");
} catch (err) {
  console.error(err);
}
-----------------------------------------------


***********************************************
# 7. Error Handling — Common Cases
***********************************************
| Error     | কারণ                             |
|-----------|----------------------------------|
| ENOENT    | ফাইল খুঁজে পাওয়া যায়নি             |
| EACCES    | Permission denied                |
| EPERM     | Windows-এ system protected ফাইল |
| EBUSY     | অন্য প্রক্রিয়া ফাইল ব্যবহার করছে     |


***********************************************
# 8. fs/promises দিয়ে Modern Async/Await Delete
****************************************---------------

-----------------------------------------------
// promisesDelete.js
import { rm } from "fs/promises";

async function run() {
  try {
    await rm("test.txt");
    console.log("File deleted using fs/promises!");
  } catch (err) {
    console.error(err);
  }
}

run();
-----------------------------------------------


***********************************************
# 9. কখন কোন Method ব্যবহার করবেন?
***********************************************
✔ `unlink()`  
→ Simple file delete, পুরোনো প্রজেক্টে

✔ `unlinkSync()`  
→ ছোট script যেখানে synchronous flow দরকার

✔ `rm()`  
→ Modern Node.js  
→ File + Folder delete  
→ Recursive delete

✔ `rmSync()`  
→ সিম্পল admin script / CLIs  


==============================================================
                        THE END 
==============================================================
