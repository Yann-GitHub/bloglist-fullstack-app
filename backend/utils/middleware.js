// Used for custom middleware functions
const logger = require("./logger");
const jwt = require("jsonwebtoken");
const { getTokenFromRequest } = require("./token_helper");

// Middleware executed for every incoming request - logs the request method, path, and body to the console - alternative to morgan package
// Not used in this project - using morgan package instead
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

// Define a middleware function that returns an error message if the request is made to a non-existent route.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Define middleware that handle errors in a centralized way - Express error handler
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  }

  next(error);
};

// Middleware function that verifies the token in the request header, extracts the user object from the token, and adds it to the request object
const authenticateToken = (request, response, next) => {
  const token = getTokenFromRequest(request);
  if (!token) {
    return response.status(401).json({ error: "token missing" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }
    request.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return response.status(401).json({ error: "token invalid" });
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  authenticateToken,
};
