=========================================================================================
                EXPLORING ESM & TRANSFORMING COMMON.JS TO ESM IN NODE.JS
=========================================================================================


***********************************************
# 1. ESM কি এবং কেন ব্যবহার হয়?
***********************************************
ESM (ECMAScript Modules) হলো JavaScript-এর অফিসিয়াল module system,  
যা browser এবং Node.js—দুটিতেই কাজ করে।

Common.js ছিল Node.js এর পুরোনো সিস্টেম → require + module.exports  
ESM হলো modern → import + export

ESM asynchronous ভাবে কাজ করে (performance better)  
এবং tree-shaking, static analysis-এর সুবিধা দেয়।

-----------------------------------------------
# ESM = import + export (Modern JS Standard)
-----------------------------------------------



***********************************************
# 2. Common.js → ESM রূপান্তরের প্রয়োজন কেন?
***********************************************
Common.js:
✔ node-এর default  
✔ sync loading  
✔ browser compatible না  

ESM:
✔ async loading  
✔ browser friendly  
✔ top-level await allowed  
✔ clean syntax  
✔ modern tooling support  

তাই modern Node.js প্রজেক্টে ESM ব্যবহার করাই best.



***********************************************
# 3. Common.js Export → কিভাবে কাজ করত?
***********************************************

## (A) Single Value Export (CJS)
-----------------------------------------------
// math.js (Common.js)
const add = (a, b) => a + b;
module.exports = add;
-----------------------------------------------

## Import:
-----------------------------------------------
// app.js
const add = require("./math");
console.log(add(5, 7));
-----------------------------------------------


## (B) Multiple Export (CJS)
-----------------------------------------------
// utils.js
const add = (a, b) => a + b;
const sub = (a, b) => a - b;

module.exports = { add, sub };
-----------------------------------------------

## Import:
-----------------------------------------------
// app.js
const { add, sub } = require("./utils");
console.log(add(10, 5));
console.log(sub(10, 5));
-----------------------------------------------



***********************************************
# 4. Common.js Alias (name change)
***********************************************
-----------------------------------------------
// utils.js
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

module.exports = {
  addNumbers: add,   // alias
  multi: multiply
};
-----------------------------------------------

-----------------------------------------------
// app.js
const { addNumbers, multi } = require("./utils");

console.log(addNumbers(2, 3));
console.log(multi(2, 3));
-----------------------------------------------


***********************************************
# 5. module.exports vs exports এর পার্থক্য
***********************************************
🔹 `module.exports` → আসল export  
🔹 `exports` → শুধুই shortcut reference  

❗ Important Rule  
`exports = something` দিলে কাজ করবে না (reference break)  
`module.exports = something` সবসময় safe



***********************************************
# 6. Node.js এ কিভাবে ESM Enable করবো?
***********************************************

Option 1 → package.json এ:
-----------------------------------------------
{
  "type": "module"
}
-----------------------------------------------

Option 2 → `.mjs` extension ব্যবহার করা



***********************************************
# 7. ESM Export (Modern Syntax)
***********************************************

## (A) Named Export
-----------------------------------------------
// math.js (ESM)
export const add = (a, b) => a + b;
export const sub = (a, b) => a - b;
-----------------------------------------------

## Import:
-----------------------------------------------
// app.js
import { add, sub } from "./math.js";
console.log(add(10, 20));
-----------------------------------------------



## (B) Default Export
-----------------------------------------------
// calc.js
export default function calc(a, b) {
  return a + b;
}
-----------------------------------------------

## Import:
-----------------------------------------------
// app.js
import calc from "./calc.js";
console.log(calc(10, 10));
-----------------------------------------------



***********************************************
# 8. ESM Alias (name change)
***********************************************

## Export-side alias
-----------------------------------------------
// math.js
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

export {
  add as addNumbers,
  subtract as minus
};
-----------------------------------------------

## Import-side alias
-----------------------------------------------
// app.js
import {
  addNumbers as addFn,
  minus as minusFn
} from "./math.js";

console.log(addFn(5, 5));
console.log(minusFn(10, 3));
-----------------------------------------------



***********************************************
# 9. Default + Named একসাথে Export (ESM)
****************************************---------------
export const PI = 3.1416;

export default function area(r) {
  return PI * r * r;
}
-----------------------------------------------

-----------------------------------------------
// app.js
import area, { PI } from "./circle.js";

console.log(area(10));
console.log(PI);
-----------------------------------------------



***********************************************
# 10. Common.js → ESM রূপান্তরের A–Z Guide
***********************************************
✔ require() → import  
✔ module.exports → export default  
✔ module.exports = {} → export {}  
✔ exports.fn → export function fn()  
✔ __dirname → import.meta.url ব্যবহার  
✔ __filename → fileURLToPath ব্যবহার  

-----------------------------------------------
// ESM এ __dirname কিভাবে করবেন:
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
-----------------------------------------------



***********************************************
# 11. Common.js থেকে ESM এ পরিবর্তন (Full Example)
***********************************************

## Before (CJS)
-----------------------------------------------
// utils.js
const add = (a, b) => a + b;
const multi = (a, b) => a * b;

module.exports = { add, multi };
-----------------------------------------------

## After (ESM)
-----------------------------------------------
// utils.js
export const add = (a, b) => a + b;
export const multi = (a, b) => a * b;
-----------------------------------------------

## Before (CJS)
-----------------------------------------------
// app.js
const { add, multi } = require("./utils");
console.log(add(3, 4));
-----------------------------------------------

## After (ESM)
-----------------------------------------------
// app.js
import { add, multi } from "./utils.js";
console.log(add(3, 4));
-----------------------------------------------



***********************************************
# 12. Common.js vs ESM → Helper Table
***********************************************
| Feature     | CommonJS         | ES Module          |
|-------------|------------------|--------------------|
| Import      | require()        | import             |
| Export      | module.exports   | export / default   |
| Loading     | Synchronous      | Asynchronous       |
| Browser     | ❌               | ✔                 |
| Modern      | ❌               | ✔                 |
| Tree-shake  | ❌               | ✔                 |



***********************************************
# 13. কখন Common.js ব্যবহার করব?
***********************************************
✔ পুরোনো Node.js প্রজেক্ট  
✔ এমন npm প্যাকেজ যেগুলো CJS ভিত্তিক  
✔ Low-level synchronous module loading দরকার  
✔ বড় legacy কোডবেস  


***********************************************
# 14. কখন ES Module ব্যবহার করব?
***********************************************
✔ Modern Node.js project  
✔ Full-stack JS (browser + server shared code)  
✔ Top-level await লাগলে  
✔ Clean & readable syntax চাই  
✔ Tree-shakable build দরকার (Vite/Webpack)  



==============================================================
                        THE END
==============================================================
