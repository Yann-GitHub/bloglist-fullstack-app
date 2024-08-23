const Blog = require("../models/blog");
const User = require("../models/user");
const blogsRouter = require("express").Router();
const { authenticateToken } = require("../utils/middleware");

blogsRouter.get("/test", async (request, response, next) => {
  try {
    response.send(`<p>Root page</p><p>Test only :)</p>`);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (exception) {
    next(exception);
  }
});

// Use the verifyToken middleware for all routes below this line
// if the token is valid, the middleware will extract the user object from the token and add it to the request object
blogsRouter.use(authenticateToken);

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const user = await User.findById(request.user.id); // Find the user who created the blog

  // Create a new blog object
  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save(); // Save the blog to the database
    user.blogs = user.blogs.concat(savedBlog._id); // Add the blog's ID to the user's list of blogs
    await user.save(); // Save the user to the database
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).send({ error: "Blog not found" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (exception) {
    console.error(exception); // Log the exception for debugging
    next(exception);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
    response.json(updatedBlog);
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
