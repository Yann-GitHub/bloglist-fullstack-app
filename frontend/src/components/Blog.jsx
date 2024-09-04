import { useState } from "react";

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);
  const optionalClass = visible ? "" : "hidden";

  return (
    <div className="blog">
      <div className="blog__title">
        {blog.title}{" "}
        <button onClick={toggleVisibility}>{visible ? "close" : "view"}</button>
      </div>
      <div className={`blog__info ${optionalClass}`}>
        <span>{blog.author}</span>
        <span>{blog.url}</span>
        <span>
          {blog.likes} likes <button>like</button>
        </span>
      </div>
    </div>
  );
};

export default Blog;
