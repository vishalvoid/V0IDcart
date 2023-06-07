const express = require("express");

const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");
const { isAuthenticated, authorizeroles } = require("../utils/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isAuthenticated, logout);
router.route("/password/forgot").post(isAuthenticated, forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticated, getUserDetails);
router.route("/update/password").put(isAuthenticated, updatePassword);
router.route("/me/update").put(isAuthenticated, updateProfile);
router
  .route("/admin/users")
  .get(isAuthenticated, authorizeroles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizeroles("admin"), getSingleUser)
  .put(isAuthenticated, authorizeroles("admin"), updateUserRole)
  .delete(isAuthenticated, authorizeroles("admin"), deleteUser);

module.exports = router;
