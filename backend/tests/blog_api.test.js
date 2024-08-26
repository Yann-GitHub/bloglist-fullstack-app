const { test, describe, beforeEach, after, before } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest"); // Used to make HTTP requests to the application
const app = require("../app");
const api = supertest(app); // Used to make HTTP requests to the application

const testHelper = require("./test_helper"); // Helper functions for recurring operations
const Blog = require("../models/blog");
const User = require("../models/user");

let token;

// Before each test, we empty the database and insert the initial blogs
// This ensures that the db is the same before each test
beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  let blogObject = new Blog(testHelper.initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(testHelper.initialBlogs[1]);
  await blogObject.save();

  const user = {
    username: "root",
    password: "sekret",
  };

  // Create the user
  await api
    .post("/api/users")
    .send(user)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  // Login to get the token
  const response = await api
    .post("/api/login")
    .send(user)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  token = response.body.token;
});
describe("when there are initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are two blogs", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, testHelper.initialBlogs.length);
  });
});

describe("when a new blog is added", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "www.test.com",
      likes: 5,
    };

    // console.log(token);

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await testHelper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, testHelper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    assert.ok(titles.includes("Test Blog"));
  });

  test("the unique identifier property of the blog posts is named id", async () => {
    const newBlog = {
      title: "Test another Blog",
      author: "Test Author2",
      url: "www.test2.com",
      likes: 5,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog);
    const blog = response.body;

    // Verify that the blog has an 'id' property
    assert.ok(blog.id);

    // Verify that the blog does not have an '_id' property
    assert.strictEqual(blog._id, undefined);
  });

  test("if the likes property is missing from the request, it will default to 0", async () => {
    const newBlog = {
      title: "Test again Blog",
      author: "Test Author",
      url: "www.test.com",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog);
    const blog = response.body;

    assert.strictEqual(blog.likes, 0);
  });

  test("if the title and url properties are missing, the backend responds with status code 400 Bad Request", async () => {
    const newBlog = {
      author: "Test Author",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "www.test.com",
      likes: 5,
    };

    // console.log(token);

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtStart = await testHelper.blogsInDb();
    const blogToDelete = blogsAtStart[2];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await testHelper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);
    assert(!titles.includes(blogToDelete.title));
  });
});

describe("updating a blog", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const newBlogg = {
      title: "Test Blogg",
      author: "Test Authorr",
      url: "www.test.comm",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlogg)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtStart = await testHelper.blogsInDb();
    const blogToUpdate = blogsAtStart[2];

    const updatedBlog = { ...blogToUpdate, likes: 10 };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await testHelper.blogsInDb();
    const updatedBlogAtEnd = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id
    );

    assert.strictEqual(updatedBlogAtEnd.likes, 10);
  });
});

after(async () => {
  await mongoose.connection.close();
});
