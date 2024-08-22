const config = require("./utils/config");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const morgan = require("morgan");

mongoose.set("strictQuery", false); // Disable the strict query mode - allows to use the find method without a query object

logger.info("connecting to", config.MONGODB_URI); // Log the connection to MongoDB

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

const app = express();

// Define custom token for morgan
morgan.token("body", (req) => JSON.stringify(req.body));
// Define a custom logging format for morgan
const myFormat =
  ":method :url :status :res[content-length] - :response-time ms :body";

app.use(cors()); // Middleware function that enables CORS - Cross-Origin Resource Sharing
app.use(express.json()); // Middleware function that parses incoming requests with JSON payloads

// Use Morgan with a custom format only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(myFormat)); // Middleware function that logs the request method, path, status, response time, and body to the console
}

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint); // Middleware function that returns an error message if the request is made to a non-existent route
app.use(middleware.errorHandler); // Middleware function that handles errors in a centralized way

module.exports = app;
