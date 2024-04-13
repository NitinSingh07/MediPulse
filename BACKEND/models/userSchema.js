import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First name must be at least 3 characters long"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last name must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: Number,
    required: true,
    minLength: [10, "Phone number must be at least 10 characters long"],
    maxLength: [11, "Phone number must be at most 10 characters long"],
  },
  nic: {
    type: String,
    required: true,
    minLength: [10, "nic must be at least 10 characters long"],
    maxLength: [13, "nic number must be at most 10 characters long"],
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  role: {
    type: String,
    required: true,
    enum: ["Patient", "Admin", "Doctor"],
  },
  doctorDepartment: {
    type: String,
  },
  docQualification: {
    type: String,
  },
  docExperience: {
    type: Number,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);
