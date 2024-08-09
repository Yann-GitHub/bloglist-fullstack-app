const Blog = require("../models/blog");
const blogsRouter = require("express").Router(); // Create an Express router

blogsRouter.get("/test", (request, response) => {
  response.send(`<p>Root page</p><p>Test only :)</p>`);
});

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = blogsRouter;
