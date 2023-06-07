const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("./errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.pyracookie;

  if (!token) {
    return next(new ErrorHandler("Kindly Login first."));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded._id);

  next();
});

exports.authorizeroles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`You are not allowed to access this resource`, 403)
      );
    }

    next();
  };
};
