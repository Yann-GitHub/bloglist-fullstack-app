const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: "Password must be at least 3 characters long",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

usersRouter.get("/", async (request, response) => {
  try {
    const users = await User.find({}).populate("blogs", {
      title: 1,
    });
    response.json(users);
  } catch (exception) {
    response.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = usersRouter;
