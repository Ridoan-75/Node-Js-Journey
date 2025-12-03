=========================================================================================
                CREATING PASSWORD FIELD & HASHING PASSWORDS 
=========================================================================================

/*
=========================================================================================
# 1. ভূমিকা — Password Field কেন লাগে?
=========================================================================================
User signup করার সময়, আমরা User-এর password database এ store করি —  
কিন্তু **raw/plain password কখনই database এ রাখা যায় না**।

কারণ:
✔ Database leak হলে সবাই password দেখে ফেলবে  
✔ User-এর privacy নষ্ট হবে  
✔ Security পুরোপুরি break হয়ে যাবে

তাই আমরা password কে hash করবো → bcrypt দিয়ে।
*/


/*
=========================================================================================
# 2. Password Field কীভাবে তৈরি করবো?
=========================================================================================
আমরা User model এ একটি password field রাখবো:
- type হবে String
- required হবে
- কিন্তু কখনোই plain text save হবে না
*/


/*
=========================================================================================
# 3. Bcrypt কী?
=========================================================================================
Bcrypt হলো একটি hashing algorithm, যা:
✔ Password কে irreversible hash বানায় (ফিরিয়ে আনা যায় না)  
✔ Extra salt যোগ করে আরও secure করে  
✔ Rainbow table attack resist করে  
*/


/*
=========================================================================================
# 4. Install bcrypt
=========================================================================================
bcrypt install করতে হবে:
---------------------------------
npm install bcrypt
---------------------------------
*/


/*
=========================================================================================
# 5. User Model লিখি (TypeScript + Mongoose)
=========================================================================================
*/

// src/models/user.model.ts

import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  name: string; // ← user name
  email: string; // ← unique identifier
  password: string; // ← hashed password থাকবে এখানে
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true, // ← name দরকার
  },
  email: {
    type: String,
    required: true,
    unique: true, // ← একই email allowed নয়
  },
  password: {
    type: String,
    required: true, // ← password অবশ্যই লাগবে
  },
});


/*
=========================================================================================
# 6. Password Hashing করার Logic
=========================================================================================
আমরা hashing করবো:
✔ userSchema.pre("save") hook দিয়ে  
✔ user.password change হলে তবেই hash করবো  
✔ bcrypt.hash(password, saltRounds) ব্যবহার করবো  
*/

userSchema.pre("save", async function (next) {
  // যদি password modify না হয় → hash করার দরকার নাই
  if (!this.isModified("password")) {
    return next();
  }

  // salt তৈরি করি
  const saltRounds = 10; // ← standard security level
  const hashedPassword = await bcrypt.hash(this.password, saltRounds);

  // hashed password set করে দিচ্ছি
  this.password = hashedPassword;

  next();
});


/*
=========================================================================================
# 7. Compare Password Function (LOGIN করার সময় লাগবে)
=========================================================================================
User login এর সময়:
✔ client থেকে আসা password (plain)
✔ database এ থাকা hashed password
এই দুইটার match check করতে bcrypt.compare ব্যবহার করবো।
*/

userSchema.methods.comparePassword = async function (givenPassword: string) {
  return bcrypt.compare(givenPassword, this.password); // ← true / false return করবে
};


/*
=========================================================================================
# 8. Model Export
=========================================================================================
*/

export const User = model<IUser>("User", userSchema);



/*
=========================================================================================
# 9. User Create Route (Password Auto-Hash হবে)
=========================================================================================
*/

import { Request, Response } from "express";
import { User } from "../models/user.model";

export const createUser = async (req: Request, res: Response) => {
  try {
    // client থেকে name, email, password আসবে
    const { name, email, password } = req.body;

    const createdUser = await User.create({
      name,
      email,
      password, // ← plain password দিলেও Mongoose pre-hook hash করে দেবে
    });

    res.status(201).json({
      success: true,
      message: "User Registered Successfully!",
      data: createdUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User registration failed",
      error,
    });
  }
};


/*
=========================================================================================
# 10. Flow Recap 
=========================================================================================
✔ User password আসে → plain text  
✔ Pre-save hook detect করে  
✔ bcrypt.hash → hashed password generate করে  
✔ Database এ শুধুমাত্র hashed password store হয়  
✔ Login এর সময় bcrypt.compare দিয়ে verify করা হয়  
*/


/*
=========================================================================================
                                THE END
=========================================================================================