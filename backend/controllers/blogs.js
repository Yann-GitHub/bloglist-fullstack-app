const Blog = require("../models/blog");
const blogsRouter = require("express").Router(); // Create an Express router

blogsRouter.get("/test", async (request, response, next) => {
  try {
    response.send(`<p>Root page</p><p>Test only :)</p>`);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes || 0,
  });
  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
