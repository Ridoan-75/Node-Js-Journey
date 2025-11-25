=========================================================================================
                READING FILES WITH THE FS MODULE 
=========================================================================================

#########################################################################################
# 0. ভূমিকা
#########################################################################################
Node.js এ **fs (File System)** মডিউল ব্যবহার করে আমরা ফাইল তৈরি, পড়া, আপডেট, ডিলিট, rename—সব ধরনের
ফাইল অপারেশন করতে পারি। আজ আমরা শুধু **ফাইল রিডিং (Reading Files)** 


=========================================================================================
# 1. fs Module কি?
=========================================================================================
`fs` হলো Node.js এর বিল্ট-ইন মডিউল যেটা দিয়ে ফাইলের ভিতরের ডেটা আমরা Read/Write করতে পারি।
এটা Node.js এর core মডিউল, তাই আলাদা করে install করা লাগে না।

```js
// fs module কে লোড করছি
const fs = require("fs"); // CommonJS
// অথবা
import fs from "fs"; // ESM
```


=========================================================================================
# 2. ফাইল পড়ার ৩টি মূল পদ্ধতি
=========================================================================================
Node.js এ ফাইল পড়ার মূলত ৩টি উপায় আছে:

1. **Synchronous Method** → fs.readFileSync()
2. **Asynchronous Callback Method** → fs.readFile()
3. **Asynchronous Promise Method** → fs.promises.readFile()


#########################################################################################
# 3. Synchronous Method (Blocking) – fs.readFileSync()
#########################################################################################
এই মেথড ফাইল না পড়া পর্যন্ত Node.js এর execution থামিয়ে রাখে।
সাধারণত ছোট স্ক্রিপ্ট বা config লোড করতে ব্যবহার করা হয়।

```js
// ======================
// Reading Files using fs.readFileSync()
// ======================

const fs = require("fs"); 

try {
  // ফাইলের কনটেন্ট synchronous ভাবে পড়া হচ্ছে
  const data = fs.readFileSync("./data.txt", "utf-8");

  console.log("File Content:");
  console.log(data); // ডেটা প্রিন্ট করবে
  
} catch (error) {
  // ফাইল না পেলে বা error হলে এখানে আসবে
  console.error("Error reading file:", error.message);
}
```

### ব্যাখ্যা
- `"utf-8"` দিলে ডেটা string আকারে পাওয়া যায়।
- না দিলে Buffer রিটার্ন করবে।
- `try/catch` ব্যবহার করা লাগে, কারণ sync method এ error throw হয়।


#########################################################################################
# 4. Asynchronous Callback Method – fs.readFile()
#########################################################################################
এটা Non-Blocking। Node.js এর বাকি কোড থেমে থাকে না।  
সর্বাধিক ব্যবহৃত method।

```js
// ======================
// Reading Files using fs.readFile() (Asynchronous Callback)
// ======================

const fs = require("fs");

fs.readFile("./data.txt", "utf-8", (error, data) => {
  if (error) {
    // যদি ফাইল না পাওয়া যায় / permission সমস্যা থাকে
    console.error("Error reading file:", error.message);
    return;
  }

  // ফাইল সফলভাবে পড়া হয়েছে
  console.log("File Content:");
  console.log(data);
});
```

### ব্যাখ্যা
- Callback এর প্রথম প্যারাম হয় **error**
- দ্বিতীয় প্যারাম হয় **data**
- Non-blocking হওয়ায় performance ভালো


#########################################################################################
# 5. Asynchronous Promise Method – fs.promises.readFile()
#########################################################################################
এটা আধুনিক জাভাস্ক্রিপ্টের promise/async-await সাপোর্ট করে।

```js
// ======================
// Reading Files using fs.promises.readFile() (Async/Await)
// ======================

import fs from "fs/promises"; 
// বা
// const fs = require("fs").promises;

async function readFileExample() {
  try {
    const data = await fs.readFile("./data.txt", "utf-8");

    console.log("File Content (Async/Await):");
    console.log(data);

  } catch (error) {
    console.error("Error reading file:", error.message);
  }
}

readFileExample();
```

### ব্যাখ্যা
- async/await ব্যবহার করার জন্য কোড অনেক clean হয়।
- Production code এ সবচেয়ে বেশি ব্যবহার হয়।



=========================================================================================
# 6. ফাইল পড়ার সময় Buffer কি?
=========================================================================================
যদি `"utf-8"` না দাও তবে ফাইল Buffer আকারে আসবে:

```js
const fs = require("fs");

const buffer = fs.readFileSync("./data.txt"); 
console.log(buffer);                // <Buffer 48 65 6c ... >
console.log(buffer.toString());     // string এ convert
```

Buffer হলো binary data representation।



=========================================================================================
# 7. Error Handling 
=========================================================================================
ফাইল পড়তে গিয়ে যেসব error হতে পারে:

| Error Type | কেন হয় |
|-----------|------------------|
| ENOENT    | ফাইল পাওয়া যায়নি |
| EACCES    | Permission নেই   |
| EBADF     | Invalid file descriptor |
| ENOTDIR   | path ঠিক নয়      |
| UNKNOWN   | অন্যান্য সমস্যা     |

```js
// Error কে আলাদা করে ধরার উদাহরণ

fs.readFile("./unknown.txt", "utf-8", (err, data) => {
  if (err) {
    if (err.code === "ENOENT") {
      console.log("File does not exist!");
    } else {
      console.log("Other error:", err.message);
    }
    return;
  }

  console.log(data);
});
```



=========================================================================================
# 8. Large File পড়া (Stream ব্যবহার করে)
=========================================================================================
অনেক বড় ফাইল readFile বা readFileSync দিয়ে পড়লে RAM শেষ হয়ে যাবে।  
তাই আমরা ব্যবহার করি **fs.createReadStream()**।

```js
// ===========================
// Reading Large Files using Stream
// ===========================

const fs = require("fs");

const stream = fs.createReadStream("./large.txt", "utf-8");

stream.on("data", (chunk) => {
  console.log("Received chunk:");
  console.log(chunk);   // বড় ফাইল ছোট ছোট অংশে আসবে
});

stream.on("end", () => {
  console.log("Finished reading file.");
});

stream.on("error", (error) => {
  console.error("Stream Error:", error.message);
});
```

### কেন stream ব্যবহার করতে হবে?
- Memory usage কমে
- বড় ফাইল efficiently process করা যায়



=========================================================================================
# 9. Practical Real-Life Use Cases
=========================================================================================
✔ Config file লোড করা  
✔ Database JSON file পড়া  
✔ Server এর data log পড়া  
✔ Template HTML file read করে Response পাঠানো  
✔ বড় বড় ডেটা process করা (via stream)



=========================================================================================
# 10. Final Summary 
=========================================================================================
|        Method         |       Type    | Blocking? |       Best For        |
|-----------------------|---------------|-----------|-----------------------|
| fs.readFileSync       | Sync          | Yes       | ছোট config/read-only |
| fs.readFile           | Async         | No        | সাধারণ file read      |
| fs.promises.readFile  | Async/Promise | No        | Modern projects       |
| fs.createReadStream   | Stream        | No        | বড় ফাইল              |



=========================================================================================
                                  THE END
=========================================================================================

