// Used to create and populate test-database with initial data /
require("dotenv").config();
const mongoose = require("mongoose");

const url =
  process.env.TEST_MONGODB_URI ||
  (() => {
    if (process.argv.length < 3) {
      console.log("give password as argument or set TEST_MONGODB_URI");
      process.exit(1);
    }
    const password = process.argv[2];
    return `mongodb+srv://ybarlet:${password}@cluster0.8uk7oql.mongodb.net/testBloglistApp?retryWrites=true&w=majority`;
  })();

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then(() => {
    const blogSchema = new mongoose.Schema({
      title: String,
      author: String,
      url: String,
      likes: Number,
    });

    const Blog = mongoose.model("Blog", blogSchema);

    const blogsToAdd = [
      {
        title: "First Blog",
        author: "Bob Brown",
        url: "www.google.fr",
        likes: 2,
      },
      {
        title: "Second Blog",
        author: "Billy Mahoney",
        url: "www.yahoo.com",
        likes: 10,
      },
    ];

    blogsToAdd.forEach((blogData) => {
      Blog.findOne(blogData).then((existingBlog) => {
        if (!existingBlog) {
          const blog = new Blog(blogData);
          blog.save().then(() => {
            console.log("blog saved!");
            if (blogsToAdd.indexOf(blogData) === blogsToAdd.length - 1) {
              mongoose.connection.close();
            }
          });
        } else {
          console.log("blog already exists!");
          if (blogsToAdd.indexOf(blogData) === blogsToAdd.length - 1) {
            mongoose.connection.close();
          }
        }
      });
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
