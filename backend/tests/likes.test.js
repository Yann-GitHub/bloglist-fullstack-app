const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const testHelper = require("./test_helper");

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(testHelper.listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list has no blogs, equals 0", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has multiple blogs, equals the sum of all likes", () => {
    const result = listHelper.totalLikes(testHelper.blogs);
    assert.strictEqual(result, 36);
  });
});

describe("most liked blog", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.favoriteBlog(testHelper.listWithOneBlog);
    assert.deepStrictEqual(result, {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    });
  });
});

describe("most blogs", () => {
  test("when list has only one blog, equals the author of that", () => {
    const result = listHelper.mostBlogs(testHelper.listWithOneBlog);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      blogs: 1,
    });
  });

  test("when list has no blogs, equals null", () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, null);
  });

  test("when list has multiple blogs, equals the author with the most blogs", () => {
    const result = listHelper.mostBlogs(testHelper.blogs);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  test("when list has only one blog, equals the author of that", () => {
    const result = listHelper.mostLikes(testHelper.listWithOneBlog);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("when list has no blogs, equals null", () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, null);
  });

  test("when list has multiple blogs, equals the author with the most likes", () => {
    const result = listHelper.mostLikes(testHelper.blogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
