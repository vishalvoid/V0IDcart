const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteproduct,
  getproductdetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticated, authorizeroles } = require("../utils/auth");

const router = express.Router();

// to get all products
router.route("/products").get(getAllProducts);

// to create product by admin
router
  .route("/admin/product/new")
  .post(isAuthenticated, authorizeroles("admin"), createProduct);

// to update and delete product by admin only
router
  .route("/admin/product/:id")
  .put(isAuthenticated, authorizeroles("admin"), updateProduct)
  .delete(isAuthenticated, authorizeroles("admin"), deleteproduct);

router.route("/product/review/:id").post(isAuthenticated, createProductReview);

// to get products details
router.route("/product/:id").get(getproductdetails);

// get all reviews and also authenticated user can delete user review
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticated, deleteReview);

module.exports = router;
