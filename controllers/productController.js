const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/productSchema");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apifeatures");

// GET ALL PRODUCTS

exports.getAllProducts = catchAsyncError(async (req, res) => {
  // for pagination -- it defines how many products will be sent to the user at a time.
  const resultPerPage = 4;

  // total products cound.
  const productsCount = await Product.countDocuments();

  // different type of searches filter and pagination. to add filter and categories.
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await apiFeature.query;

  // sending responses.
  res.status(200).json({
    success: true,
    productsCount,
    products,
  });
});

// CREATE PRODUCT -- ADMIN -- where admins can create different products.
exports.createProduct = catchAsyncError(async (req, res, next) => {
  const {
    name,
    description,
    price,
    rating,
    image,
    category,
    stock,
    reviews,
    skuid,
  } = req.body;

  const user = req.user._id;

  const product = await Product.create({
    name,
    description,
    price,
    rating,
    category,
    stock,
    reviews,
    skuid,
    user,
  });

  res.status(201).json({
    success: true,
    message: "Product Created",
    product,
  });
});

// UPDATE PRODUCT
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  var product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  // sanitizing the data to be sent on update.
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "product details updated",
    product,
  });
});

// DELETE PRODUCT
exports.deleteproduct = catchAsyncError(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});

// GET SINGLE PRODUCT DETAILS -- where users can check about every single product's all details
exports.getproductdetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// ADDING AND MODIFYING REVIEWS -- via logged in user only
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  // content to be sent
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  // checking if user has already reviewed this product.
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  //
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.rating = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review added successfully",
  });
});

// GET ALL REVIEWS OF A PRODUCT
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
