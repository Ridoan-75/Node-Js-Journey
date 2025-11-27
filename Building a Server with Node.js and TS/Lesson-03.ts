=========================================================================================
                 API ROUTES & THE DIFFERENCE BETWEEN GET AND POST
=========================================================================================

***********************************************
# 1. API Route কী?
***********************************************
API Route মানে হচ্ছে —  
client (browser, mobile app, frontend) যখন server এ request পাঠায়, তখন server সেই request
handle করার জন্য নির্দিষ্ট path তৈরি করে। সেই path-টাই হলো **API Route**।

যেমন:  
✔ `/users`  
✔ `/products`  
✔ `/login`  

প্রতিটি route একটি নির্দিষ্ট কাজ করে।



***********************************************
# 2. GET Request কী?
***********************************************
GET হলো এমন HTTP method যা server থেকে **ডেটা আনার জন্য** ব্যবহার করা হয়।

GET request এর বৈশিষ্ট্য:  
✔ শুধু ডেটা আনে  
✔ body পাঠায় না  
✔ URL এ ডেটা পাঠানো যায় (query/params)  
✔ শুধু read-only কাজের জন্য ব্যবহার করা উচিত  

-----------------------------------------------
# Example (Node.js + TypeScript)
-----------------------------------------------
// src/server.ts
import http from "http";

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/users") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        message: "All users fetched successfully!",
      })
    );
  }
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
-----------------------------------------------



***********************************************
# 3. POST Request কী?
***********************************************
POST হলো এমন method যা server এ **ডেটা পাঠাতে বা নতুন ডেটা তৈরি করতে** ব্যবহার করা হয়।

POST request এর বৈশিষ্ট্য:  
✔ body পাঠানো যায় (JSON, form-data)  
✔ sensitive ডেটা URL এ দেখা যায় না  
✔ server এ নতুন কিছু insert করতে ব্যবহৃত হয়  

-----------------------------------------------
# Example (Node.js + TypeScript)
-----------------------------------------------
// src/server.ts
import http from "http";

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/users") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsed = JSON.parse(body);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "New user created!",
          receivedData: parsed,
        })
      );
    });
  }
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
-----------------------------------------------



***********************************************
# 4. GET vs POST — Side-by-Side Comparison
***********************************************

| Feature                 | GET              | POST                 |
|-------------------------|------------------|----------------------|
| উদ্দেশ্য                  | Data fetch        | Data send/create    |
| Body পাঠানো যায়?        | ❌ No            | ✔ Yes               |
| URL এ data দেখা যায়?    | ✔ Yes            | ❌ No               |
| Use case                | Listing, reading | Creating, submitting |
| নিরাপত্তা                 | কম               | বেশি                 |


***********************************************
# 5. কখন GET ব্যবহার করবো?
***********************************************
✔ ডেটা আনার জন্য  
✔ কোনো কিছু দেখানোর জন্য  
✔ শুধু read-only request হলে  
✔ query দিয়ে filtering করতে হলে  



***********************************************
# 6. কখন POST ব্যবহার করবো?
***********************************************
✔ নতুন ডেটা তৈরি হলে  
✔ login/signup এর ক্ষেত্রে  
✔ ফর্ম submit হলে  
✔ body দিয়ে বড় ডেটা পাঠাতে হলে  



***********************************************
# 7. Complete Raw Node.js Server (GET + POST)
****************************************---------------
// src/server.ts
import http from "http";

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/products") {
    return res.end(JSON.stringify({ message: "Products fetched!" }));
  }

  if (req.method === "POST" && req.url === "/products") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsed = JSON.parse(body);

      res.end(
        JSON.stringify({
          message: "Product created!",
          data: parsed,
        })
      );
    });

    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
-----------------------------------------------



***********************************************
# 8. কেন GET/POST ঠিকভাবে জানা প্রয়োজন?
***********************************************
✔ REST API structure পরিষ্কার থাকে  
✔ client-server communication সঠিক হয়  
✔ ডেটা নিরাপদ থাকে  
✔ backend architecture standard থাকে  
✔ বড় project-এ maintain করা সহজ হয়  



==============================================================
                        THE END
==============================================================
