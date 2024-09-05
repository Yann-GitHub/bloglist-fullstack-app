import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, blogs, setBlogs, setNotificationMessage }) => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = () => setVisible(!visible);
  const optionalClass = visible ? "" : "hidden";

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.deleteBlog(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        setNotificationMessage({
          message: "Blog deleted successfully 🗑",
          type: "success",
        });
        setTimeout(() => {
          setNotificationMessage(null);
        }, 4000);
      } catch (error) {
        console.log(error);
        setNotificationMessage({
          message: `Failed to delete blog: ${error.response.data.error}`,
          type: "error",
        });
        setTimeout(() => {
          setNotificationMessage(null);
        }, 4000);
      }
    }
  };

  const handleLike = async () => {
    if (isLoading) return; // Prevent multiple clicks while the request is in progress

    setIsLoading(true);
    try {
      const updatedBlog = await blogService.updateBlog(blog.id, {
        ...blog,
        likes: blog.likes + 1,
      });
      setBlogs(blogs.map((b) => (b.id !== blog.id ? b : updatedBlog)));
      console.log("Updated Blog:", updatedBlog);
    } catch (error) {
      console.log(error);
      setNotificationMessage({
        message: `Failed to update likes: ${error.response.data.error}`,
        type: "error",
      });
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="blog">
      <div className="blog__title">
        {blog.title}{" "}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      <div className={`blog__info ${optionalClass}`}>
        <span>{blog.author}</span>
        <span>
          <a href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
        </span>
        <span>
          {blog.likes} likes <button onClick={handleLike}>like</button>
        </span>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default Blog;
