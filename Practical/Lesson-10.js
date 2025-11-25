=========================================================================================
              ENCRYPTING & DECRYPTING DATA WITH THE CRYPTO MODULE IN NODE.JS
=========================================================================================

#########################################################################################
# 1. ENCRYPTION কী?
#########################################################################################
/*
Encryption হলো একটি দ্বিমুখী (two-way) নিরাপত্তা প্রক্রিয়া যেখানে মূল ডেটাকে (plaintext)
একটি অ-পঠনযোগ্য ফর্মে (ciphertext) রূপান্তর করা হয়। পরে সঠিক key ব্যবহার করে আবার
ডিক্রিপ্ট (decrypt) করা যায়।

কেন প্রয়োজন?
✔ গোপন ডেটা সুরক্ষিত রাখা  
✔ Network এ ডেটা পাঠানোর সময় নিরাপত্তা  
✔ API keys, tokens, user information ইত্যাদি এনক্রিপ্ট করে রাখা  
✔ File/system-level নিরাপত্তা

Node.js–এ encryption/decryption করার জন্য `crypto` module ব্যবহৃত হয়।
*/
const crypto = require("crypto");


#########################################################################################
# 2. কোন Encryption Algorithms সবচেয়ে ব্যবহার হয়?
#########################################################################################
/*
Node.js এ সাধারণত symmetric encryption (একটি key দিয়ে encrypt + decrypt) ব্যবহার করা হয়।

সবচেয়ে ব্যবহৃত algorithm:
➡ AES-256-CBC  
➡ AES-256-GCM (authenticated encryption, আরও নিরাপদ)

Symmetric Encryption সবচেয়ে দ্রুত এবং tokens, files, configs encrypt করতে widely used।
*/


#########################################################################################
# 3. BASIC ENCRYPTION & DECRYPTION (AES-256-CBC)
#########################################################################################

# A) Encryption Function
function encrypt(text, key, iv) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

# B) Decryption Function
function decrypt(encryptedText, key, iv) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

# C) Usage Example
const key = crypto.randomBytes(32);  // 256-bit key
const iv = crypto.randomBytes(16);   // 128-bit IV

const message = "Hello Secure World!";
const encrypted = encrypt(message, key, iv);
const decrypted = decrypt(encrypted, key, iv);

console.log("Encrypted:", encrypted);
console.log("Decrypted:", decrypted);


#########################################################################################
# 4. ENCRYPTION ধাপে ধাপে ব্যাখ্যা
#########################################################################################
/*
Step 1 → randomBytes দিয়ে key + IV তৈরি  
Step 2 → createCipheriv("aes-256-cbc", key, iv)  
Step 3 → cipher.update(text) → মূল ডেটাকে রূপান্তর করা  
Step 4 → cipher.final() → অবশিষ্ট chunk যোগ করা  
Step 5 → output hex/base64 ফরম্যাটে return করা  
*/


#########################################################################################
# 5. AUTHENTICATED ENCRYPTION (AES-256-GCM)
#########################################################################################
/*
AES-GCM mode data + authenticity দুইটাই নিশ্চিত করে।  
এটি modern এবং production-grade systems এ বেশি ব্যবহৃত হয়।
*/

# A) Encrypt (AES-GCM)
function encryptGCM(text, key) {
  const iv = crypto.randomBytes(12); // recommended 12 bytes
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
    tag: tag.toString("hex"),
  };
}

# B) Decrypt (AES-GCM)
function decryptGCM(encryptedData, key) {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(encryptedData.iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(encryptedData.tag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData.content, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

# C) Usage Example
const keyGCM = crypto.randomBytes(32);

const encryptedGCM = encryptGCM("Top Secret Message!", keyGCM);
const decryptedGCM = decryptGCM(encryptedGCM, keyGCM);

console.log("Encrypted GCM:", encryptedGCM);
console.log("Decrypted GCM:", decryptedGCM);


#########################################################################################
# 6. PASSWORD-BASED ENCRYPTION (PBKDF2 দিয়ে key derive)
#########################################################################################

# A) Generate Key from Password
const password = "MyStrongPass123";
const salt = crypto.randomBytes(16);

crypto.pbkdf2(password, salt, 100000, 32, "sha256", (err, key) => {
  if (err) throw err;

  const iv = crypto.randomBytes(16);
  const encrypted = encrypt("Hello PBKDF2", key, iv);

  console.log({
    salt: salt.toString("hex"),
    iv: iv.toString("hex"),
    encrypted,
  });
});


#########################################################################################
# 7. FILE ENCRYPTION/DECRYPTION (Stream ভিত্তিক)
#########################################################################################

# A) Encrypt File
function encryptFile(inputPath, outputPath, key, iv) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  fs.createReadStream(inputPath)
    .pipe(cipher)
    .pipe(fs.createWriteStream(outputPath));
}

# B) Decrypt File
function decryptFile(inputPath, outputPath, key, iv) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  fs.createReadStream(inputPath)
    .pipe(decipher)
    .pipe(fs.createWriteStream(outputPath));
}


#########################################################################################
# 8. PRACTICAL SERVICE EXAMPLE — ENCRYPTION UTILITY
#########################################################################################

const EncryptionService = {
  key: crypto.randomBytes(32),
  iv: crypto.randomBytes(16),

  encrypt(text) {
    return encrypt(text, this.key, this.iv);
  },

  decrypt(text) {
    return decrypt(text, this.key, this.iv);
  },
};

const encryptedMsg = EncryptionService.encrypt("Service Layer Encryption");
console.log("Service Encrypted:", encryptedMsg);

console.log("Service Decrypted:", EncryptionService.decrypt(encryptedMsg));


#########################################################################################
# 9. REAL-LIFE USE CASES
#########################################################################################
/*
✔ Encryption at rest (database/file-level encryption)  
✔ API tokens/keys secure storage  
✔ Secure configuration files  
✔ Encrypted cookies এবং session data  
✔ Backend-to-backend secure communication  
✔ Webhook signatures  
✔ Hybrid encryption systems  
*/


#########################################################################################
# 10. SUMMARY
#########################################################################################
/*
▪ crypto module দিয়ে simple এবং advanced encryption করা যায়  
▪ AES-256-CBC → সাধারণ encryption  
▪ AES-256-GCM → authenticated, modern, production-grade  
▪ PBKDF2 দিয়ে password থেকে key derive করা যায়  
▪ Streams ব্যবহার করে বড় ফাইল encrypt/decrypt করা যায়  
▪ Encryption systems backend security–র গুরুত্বপূর্ণ অংশ  
*/

=========================================================================================
                                      THE END
=========================================================================================
