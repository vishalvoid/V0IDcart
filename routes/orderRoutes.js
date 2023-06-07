const express = require("express");

const router = express.Router();

const { isAuthenticated, authorizeroles } = require("../utils/auth");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.route("/order/new").post(isAuthenticated, newOrder);
router.route("/order/:id").get(isAuthenticated, getSingleOrder);
router.route("/orders/me").get(isAuthenticated, myOrders);
router
  .route("/admin/orders")
  .get(isAuthenticated, authorizeroles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticated, authorizeroles("admin"), updateOrder)
  .delete(isAuthenticated, authorizeroles("admin"), deleteOrder);

module.exports = router;
