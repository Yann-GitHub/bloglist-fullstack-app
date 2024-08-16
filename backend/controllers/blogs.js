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
