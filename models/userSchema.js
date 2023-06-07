const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is a required field"],
    minLength: [5, "name should have more than 5 characters"],
    maxLength: [30, "name cannot have more than 30 characters"],
  },
  email: {
    type: String,
    required: [true, "please Enter a Password"],
    unique: [true, "email already exists"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  mobile: {
    type: Number,
    required: [true, "Mobile Number is a Mandatory Field"],
  },
  role: {
    type: String,
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please Enter a Password"],
    minLength: [8, "password should be more than 8 characters"],
    select: false,
    validate: [validator.isStrongPassword, "password validation failed"],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// saving passowd not to modify without intentions.
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// matching password at the time of login.
userSchema.methods.match_password = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generating hash for resetting password.
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and saving string
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
