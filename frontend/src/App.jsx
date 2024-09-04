import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);

  // Get all notes from the server
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  // Check if the user is already logged in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    window.localStorage.clear();
    blogService.setToken(null);
    setNotificationMessage({
      message: "Logged out. Goodbye!👋🏼",
      type: "success",
    });
    setTimeout(() => {
      setNotificationMessage(null);
    }, 4000);
  };

  const blogFormRef = useRef();

  return (
    <div>
      <Notification message={notificationMessage} />
      <h2>Blogs</h2>

      {!user ? (
        <LoginForm
          setNotificationMessage={setNotificationMessage}
          setUser={setUser}
        />
      ) : (
        <div>
          <div className="logout">
            <span>{`👨🏻 ${user.username} logged in`}</span>
            <button onClick={handleLogout}>logout</button>
          </div>
          <Togglable buttonLabel={"New blog"} ref={blogFormRef}>
            <BlogForm
              setNotificationMessage={setNotificationMessage}
              setBlogs={setBlogs}
              blogs={blogs}
              blogFormRef={blogFormRef}
            />
          </Togglable>

          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
