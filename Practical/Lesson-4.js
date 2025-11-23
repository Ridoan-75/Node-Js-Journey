=========================================================================================
        WRITING & APPENDING FILES WITH THE FS MODULE IN NODE.JS
=========================================================================================

***********************************************
# 1. fs Module কী?
***********************************************
`fs` (File System) হলো Node.js এর built-in module  
যা ব্যবহার করে ফাইল তৈরি, লেখা, পড়া, আপডেট, ডিলিটসহ সব ধরনের ফাইল অপারেশন করা যায়।

Node.js এ এটি ব্যবহার করতে হয়:

-----------------------------------------------
const fs = require("fs");
-----------------------------------------------


***********************************************
# 2. ফাইলে Write করা (Write → Overwrite)
***********************************************
`fs.writeFile()` → asynchronous  
`fs.writeFileSync()` → synchronous  

## (A) Async Write
-----------------------------------------------
// write.js
const fs = require("fs");

/*
  writeFile() ফাইল না থাকলে বানাবে,
  আর থাকলে পুরো ফাইল overwrite করে দেবে।
*/
fs.writeFile("data.txt", "Hello Node.js!", (err) => {
  if (err) throw err;
  console.log("File written successfully!");
});
-----------------------------------------------

## (B) Sync Write
-----------------------------------------------
// writeSync.js
const fs = require("fs");

try {
  fs.writeFileSync("data.txt", "This is sync write.");
  console.log("Sync write complete!");
} catch (err) {
  console.error(err);
}
-----------------------------------------------


***********************************************
# 3. ফাইলে Append করা (Existing ফাইলের শেষে লেখা)
***********************************************
`fs.appendFile()` → async  
`fs.appendFileSync()` → sync  

## (A) Async Append
-----------------------------------------------
// append.js
const fs = require("fs");

/*
  appendFile() ফাইল না থাকলে নতুন ফাইল তৈরি করবে।
*/
fs.appendFile("data.txt", "\nThis is appended content.", (err) => {
  if (err) throw err;
  console.log("Append complete!");
});
-----------------------------------------------

## (B) Sync Append
-----------------------------------------------
// appendSync.js
const fs = require("fs");

try {
  fs.appendFileSync("data.txt", "\nAppend using sync!");
  console.log("Sync append complete!");
} catch (err) {
  console.error(err);
}
-----------------------------------------------


***********************************************
# 4. Write বনাম Append → পার্থক্য
***********************************************
| Method | কাজ |
|--------|-------------------------------------------------|
| writeFile() | ফাইল overwrite করে |
| appendFile() | পুরোনো ফাইলের শেষে লিখে |
| writeFileSync() | synchronous overwrite |
| appendFileSync() | synchronous append |


***********************************************
# 5. fs/promises দিয়ে Modern Async/Await Style
***********************************************
Node.js এ Promise-based file system API ও আছে।

-----------------------------------------------
// promises.js
import { writeFile, appendFile } from "fs/promises";

async function run() {
  try {
    await writeFile("data.txt", "Hello from promises API!");
    await appendFile("data.txt", "\nMore data added...");
    console.log("Promise-based write + append done!");
  } catch (err) {
    console.error(err);
  }
}

run();
-----------------------------------------------


***********************************************
# 6. Real-Life Use Cases
***********************************************
✔ User log save করা  
✔ API request history লিখে রাখা  
✔ Error logging  
✔ File-based database তৈরি করা  
✔ Temp ফাইল overwrite/append  


==============================================================
                        THE END 
==============================================================
