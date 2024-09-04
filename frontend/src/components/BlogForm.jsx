import { useState } from "react";
import blogService from "../services/blogs";

const BlogForm = ({ setBlogs, blogs, setNotificationMessage, blogFormRef }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    try {
      const newBlog = await blogService.createBlog({
        title,
        author,
        url,
      });

      setBlogs(blogs.concat(newBlog));
      setTitle("");
      setAuthor("");
      setUrl("");
      setNotificationMessage({
        message: "You have successfully created a blog 🎉",
        type: "success",
      });
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      console.log(exception);
      setNotificationMessage({
        message: "Something wrong here 🤷🏻‍♂️",
        type: "error",
      });
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
    }
  };

  return (
    <>
      <form onSubmit={handleCreateBlog}>
        <div>
          Title
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          Author
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          Url
          <input
            type="text"
            placeholder="Url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button type="submit">Save blog</button>
      </form>
    </>
  );
};

export default BlogForm;
