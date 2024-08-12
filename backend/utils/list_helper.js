const _ = require("lodash");

/**
 * Get the author with the most blogs.
 * @param {Array} blogs - List of blogs.
 * @returns {Object | null} - Author with the most blogs.
 */
const mostBlogs = (blogs = []) => {
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return null;
  }
  // 1. Group blogs by author
  const groupedByAuthor = _.groupBy(blogs, "author");

  // 2. Count the number of blogs for each author
  const authorBlogCounts = _.map(groupedByAuthor, (blogs, author) => ({
    author: author,
    blogs: blogs.length,
  }));

  // 3. Find the author with the most blogs
  return _.maxBy(authorBlogCounts, "blogs");
};

const mostLikes = (blogs = []) => {
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return null;
  }

  // 1. Group blogs by author
  const groupedByAuthor = _.groupBy(blogs, "author");

  // 2. Sum the likes for each author
  const authorLikes = _.map(groupedByAuthor, (blogs, author) => ({
    author: author,
    likes: _.sumBy(blogs, "likes"),
  }));

  // 3. Find the author with the most likes
  return _.maxBy(authorLikes, "likes");
};

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce(
    (max, blog) => (max.likes > blog.likes ? max : blog),
    blogs[0]
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
