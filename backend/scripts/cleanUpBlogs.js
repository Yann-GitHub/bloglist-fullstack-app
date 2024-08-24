// Used to clean up the user's blogs array by removing any invalid blog references

const config = require("../utils/config");
const mongoose = require("mongoose");
const User = require("../models/user");
const Blog = require("../models/blog");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// IIFE  - Immediately Invoked Function Expression
(async () => {
  const users = await User.find({});

  for (const user of users) {
    const validBlogs = [];

    console.log(`User ${user._id} initial blogs:`, user.blogs);

    for (const blogId of user.blogs) {
      const blogExists = await Blog.exists({ _id: blogId });
      if (blogExists) {
        validBlogs.push(blogId);
      }
    }

    user.blogs = validBlogs;
    await user.save();

    console.log(`User ${user._id} updated blogs:`, user.blogs);
  }

  console.log("Cleanup complete");
  mongoose.connection.close();
})();
