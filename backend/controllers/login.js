const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  // Extract the body of the request
  const body = request.body;

  // Validate input
  if (!body.username || !body.password) {
    return response.status(400).json({
      error: "username and password are required",
    });
  }

  // Find the user with the username from the request
  const user = await User.findOne({ username: body.username });
  // console.log(user);

  // Check if the password is correct
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  // If the user does not exist or the password is incorrect, return an error
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  // Create a token for the user with expiration time of 1 hour
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
