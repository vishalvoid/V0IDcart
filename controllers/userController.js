// critically important imports
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

// creating token with secret message.
const jwttoken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET);
};

// REGISTER NEW USER
exports.register = catchAsyncError(async (req, res, next) => {
  const { name, email, mobile, password } = req.body;

  // checking if user already exists.
  const userExist = await User.findOne({ email });

  if (userExist) {
    return next(new ErrorHandler("User with same email already exists", 400));
  }

  const data = await User.create({
    name,
    email,
    password,
    mobile,
  });

  const user = await User.findById(data._id);

  // jwt verification for login.
  const token = await jwttoken(data._id);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: false,
  };

  // sending cookie
  res
    .status(201)
    .cookie("pyracookie", token, options)
    .json({
      success: true,
      user,
      message: `Welcome ${name}, Registration Successfull`,
    });
});

// LOGIN
exports.login = catchAsyncError(async (req, res, next) => {
  // checking if user exists
  const { email, password } = req.body;

  // console.log(req.body);

  if (!email || !password) {
    return next(new ErrorHandler("Email and Password is required*", 400));
  }

  // error handling for user not found or have been modified.
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not Found", 400));
  }

  // comparing password
  const isMatched = await user.match_password(password);
  if (!isMatched) {
    return next(new ErrorHandler("Incorrect Credentials", 400));
  }

  // creating jwt for login. and storing it in cookies.
  const token = await jwttoken(user._id);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
    sameSite: "none",
  };

  res.cookie("pyracookie", token, options);

  res.status(200).json({
    success: true,
    message: `welcome ${user.name}, Login Successfull`,
  });
});

// LOGOUT

exports.logout = catchAsyncError(async (req, res, next) => {
  // make cookie expire now and replacing it with the last one.
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
  };

  res.status(200).cookie("pyracookie", "tokenexpired", options).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

// forgot password

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  // checking if user exists.
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not Found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  // sending message.
  const message = ` Hi ${
    user.name
  } \n \n We received a request for a password change on your ${req.get(
    "host"
  )} account. You can reset your password here. \n \n Your new password must: \n • Contain 8-36 characters \n • Contain at least one mixed-case letter \n • Contain at least one number \n • Nat be the same as yaur Screen Name \n
  This link will expire in 15 minutes. After that, you'll need ta submit a new request in order to reset yaur password.  If you don't want to reset it, simply disregard this email. 
  If you need more help or believe this email was sent in error, feel free to contact us. (Please don't reply to this message it's automated.) \n
  Thanks, \n  ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  // contents to be sent.
  try {
    await sendEmail({
      email: user.email,
      subject: `Password recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    // undefining the password change request from the database.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// resetting password

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // validating token
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  // error handling
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successfully! login again",
  });
});

// GET USER DETAILS -- where user can check it's own details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// UPDATE USER PASSWORD -- user can update it's own password.
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // comparing passwords
  const isPasswordMatched = await user.match_password(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // double checking password with confirm password
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  // logging out user to login ogain. so that it can validate user login.
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
  };

  res.status(200).cookie("pyracookie", "tokenexpired", options).json({
    success: true,
    message: "Password changed Successfully! kindly login",
  });
});

//  CHANGE USER PROFILE -- where user can change it's own details like name, email, and mobile details.
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Details Updated",
    user,
  });
});

// GET ALL USERS -(ADMIN) - where admin can see all the available users.
exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// GET SINGLE USER (ADMIN) --where admin can check about users.
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// UPDATE USER ROLES (ADMIN) -- where we can change any user's roles to admin and again make
// them user back agian.
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    mobile: req.body.mobile,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "updated",
  });
});

// DELETE USER (ADMIN) -- where admin can delete any user
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  // checking if user exists.
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  // seding response.
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
