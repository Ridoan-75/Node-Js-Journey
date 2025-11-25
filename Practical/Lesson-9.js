=========================================================================================
                      HASHING DATA WITH THE CRYPTO MODULE IN NODE.JS
=========================================================================================

#########################################################################################
# 1. HASHING কী?
#########################################################################################
/*
Hashing হলো একটি one-way (একমুখী) গণনামূলক প্রক্রিয়া যেখানে কোনো ডেটাকে একটি
নির্দিষ্ট আকারের অক্ষরমালায় পরিণত করা হয়। এই হ্যাশ থেকে কখনও মূল ডেটা বের করা যায় না।

হ্যাশিং ব্যবহারের প্রধান কারণ:
✔ পাসওয়ার্ড নিরাপদভাবে সংরক্ষণ
✔ ডেটা পরিবর্তন হয়েছে কিনা যাচাই (Integrity check)
✔ টোকেন/সিগনেচার তৈরি
✔ ফাইল ফিঙ্গারপ্রিন্টিং (Git এর মতো সিস্টেম)

Node.js–এ এর জন্য ব্যবহৃত হয় বিল্ট–ইন `crypto` module।
*/

const crypto = require("crypto"); // crypto module import করা হচ্ছে


#########################################################################################
# 2. CRYPTO MODULE কেন ব্যবহার করা হয়?
#########################################################################################
/*
crypto module ব্যবহার করলে তুমি —
- দ্রুত হ্যাশ তৈরি করতে পারবে
- industry-standard algorithm (SHA256, SHA512 etc.) ব্যবহার করতে পারবে
- encryption, signing, HMAC—সব করতে পারবে
- কোনো external package install করতে হবে না

এটি security, authentication, data integrity—সব ধরনের কাজের জন্য অত্যন্ত গুরুত্বপূর্ণ।
*/


#########################################################################################
# 3. BASIC HASH তৈরি করার পদ্ধতি
#########################################################################################

# A) SHA256 algorithm দিয়ে string hash করা
const hash1 = crypto
  .createHash("sha256")
  .update("Hello World")
  .digest("hex");

console.log("SHA256 Hash:", hash1);


# B) SHA512 দিয়ে hash করা
const hash2 = crypto
  .createHash("sha512")
  .update("Secure Data")
  .digest("hex");

console.log("SHA512 Hash:", hash2);


# C) Base64 ফরম্যাটে hash তৈরি করা
const hash3 = crypto
  .createHash("sha256")
  .update("Hello Again")
  .digest("base64");

console.log("Base64 Hash:", hash3);


#########################################################################################
# 4. HASH তৈরির ধাপে ধাপে ব্যাখ্যা
#########################################################################################
/*
Step 1 → createHash("sha256")
          কোন algorithm ব্যবহার করবে সেটি নির্ধারণ করা হচ্ছে।

Step 2 → update(data)
          হ্যাশ করার জন্য ডেটা যোগ করা হচ্ছে।

Step 3 → digest("hex")
          আউটপুটকে কোন ফরম্যাটে চাই তা নির্ধারণ করা হচ্ছে (hex/base64/binary)।

Note:
✔ hex → সবচেয়ে বেশি ব্যবহৃত
✔ base64 → compact token/string তৈরিতে উপযোগী
*/


#########################################################################################
# 5. কী কী HASH ALGORITHM ব্যবহার করা যায়?
#########################################################################################
/*
➡ "md5"      → নিরাপত্তাহীন (কখনও ব্যবহার করা উচিত না)
➡ "sha1"     → দুর্বল (deprecated)
➡ "sha256"   → নিরাপদ, সবচেয়ে বেশি ব্যবহৃত
➡ "sha512"   → আরও শক্তিশালী নিরাপত্তা

⚠ পাসওয়ার্ড সংরক্ষণের জন্য SHA256 যথেষ্ট নয় — কারণ এটি খুব দ্রুত।
Brute-force আক্রমণের সুযোগ থাকে।

এর জন্য bcrypt, argon2 বা PBKDF2 ব্যবহার করা উচিত।
*/


#########################################################################################
# 6. PASSWORD HASHING (PBKDF2 ব্যবহার করে)
#########################################################################################

# A) PBKDF2 দিয়ে secure password hash তৈরি করা
const password = "MySecretPassword";
const salt = crypto.randomBytes(16).toString("hex");

crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
  if (err) throw err;
  console.log({
    salt,
    hash: derivedKey.toString("hex"),
  });
});


# B) Password verify করার পদ্ধতি
function verifyPassword(inputPassword, storedSalt, storedHash) {
  const hash = crypto.pbkdf2Sync(inputPassword, storedSalt, 100000, 64, "sha512");
  return hash.toString("hex") === storedHash;
}


#########################################################################################
# 7. HMAC কী এবং কেন ব্যবহার করা হয়?
#########################################################################################
/*
HMAC হলো Hash-based Message Authentication Code।
এটি message + secret key ব্যবহার করে একটি সিগনেচার তৈরি করে।

এর ব্যবহার:
✔ API authentication
✔ Webhook signature verification (GitHub, Stripe)
✔ Request tampering আটকানো
*/

# উদাহরণ:
const hmac = crypto
  .createHmac("sha256", "my-secret-key")
  .update("Hello HMAC")
  .digest("hex");

console.log("HMAC:", hmac);


#########################################################################################
# 8. RANDOM VALUE / TOKEN তৈরি করা (Security Tokens)
#########################################################################################

# A) randomBytes ব্যবহার করে token
const token = crypto.randomBytes(32).toString("hex");
console.log("Random Token:", token);

# B) Verification codes তৈরি করা
const code = crypto.randomInt(100000, 999999);
console.log("OTP Code:", code);


#########################################################################################
# 9. PRACTICAL PROJECT EXAMPLE: PASSWORD HASHING SERVICE
#########################################################################################

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { salt, hash };
}

function validatePassword(password, salt, hash) {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return verifyHash === hash;
}

const result = createPasswordHash("secret123");
console.log("Hashed Password Info:", result);

console.log(
  "Password Valid?",
  validatePassword("secret123", result.salt, result.hash)
);


#########################################################################################
# 10. REAL-LIFE USE CASES
#########################################################################################
/*
✔ Secure password storage (with PBKDF2/Bcrypt/Argon2)
✔ API key / token hashing
✔ Webhook signature verification
✔ File integrity checking (SHA256 checksum)
✔ Unique identifier generation
✔ Authentication & encryption সিস্টেমে প্রতিদিন ব্যবহৃত হয়
*/


#########################################################################################
# 11. SUMMARY
#########################################################################################
/*
▪ crypto module হলো Node.js এর বিল্ট–ইন security toolkit
▪ SHA256/SHA512 দিয়ে সাধারণ hash তৈরি করা যায়
▪ পাসওয়ার্ডের জন্য PBKDF2 বা bcrypt ব্যবহার করা উচিত
▪ HMAC API security ও request validation–এ ব্যবহৃত হয়
▪ crypto দিয়ে tokens, OTP, unique IDs—সব তৈরি করা যায়
*/


=========================================================================================
                                      THE END
=========================================================================================
