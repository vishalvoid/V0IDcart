// important imports
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const Formidable = require("express-formidable");

// dotenv declaration
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

// initializing express app
const app = express();

// middlewares
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL ?? "http://localhost:8000/",
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

// importing routes
const User = require("./routes/userRoutes");
const Products = require("./routes/productRoute");
const Order = require("./routes/orderRoutes");

app.use("/api/v1", User);
app.use("/api/v1", Products);
app.use("/api/v1", Order);

// middleware for Error
const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

module.exports = app;
