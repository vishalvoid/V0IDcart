// important imports
const mongoose = require("mongoose");
const app = require("./app");

// handling uncaught error
// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log(`Shutting down the server due to Uncaught Exception`);
//   process.exit(1);
// });

// replacing password within url inside .env
const mongoDB = process.env.DB_URL.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);

// connecting to MongoDB using mongoose
mongoose.set("strictQuery", true);
mongoose
  .connect(mongoDB, { useNewUrlParser: true })
  .then((con) => console.log(`Database Connected : ${con.connection.host}`))
  .catch((error) => {
    console.log(error);
  });

// starting server.
const server = app.listen(process.env.PORT, () => {
  console.log(`Server Running on port ${process.env.PORT}`);
});

// Unhandled Promise Rejection
// process.on("unhandledRejection", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log(`Shutting down the server due to Unhandled Promise Rejection`);

//   server.close(() => {
//     process.exit(1);
//   });
// });
