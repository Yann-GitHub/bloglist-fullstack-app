import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import CreateBlogForm from "./components/CreateBlogForm";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
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

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setNotificationMessage({
        message: "You are loggin 🎉",
        type: "success",
      });
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
    } catch (exception) {
      console.log(exception);
      setNotificationMessage({
        message: "⛔️ Wrong credentials",
        type: "error",
      });
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
    }
  };

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
        message: "You are succesfully create a blog 🎉",
        type: "success",
      });
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
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

  const handleLogout = () => {
    setUser(null);
    window.localStorage.clear();
    blogService.setToken(null);
    setNotificationMessage({
      message: "Log out, Bye 👋🏼",
      type: "success",
    });
    setTimeout(() => {
      setNotificationMessage(null);
    }, 4000);
  };

  return (
    <div>
      <Notification message={notificationMessage} />
      <h2>Blogs</h2>

      {user === null ? (
        <LoginForm
          password={password}
          setPassword={setPassword}
          username={username}
          setUsername={setUsername}
          handleLogin={handleLogin}
        />
      ) : (
        <div>
          <div className="logout">
            <span>{`👨🏻 ${user.username} logged in`}</span>
            <button onClick={handleLogout}>logout</button>
          </div>
          <CreateBlogForm
            handleCreateBlog={handleCreateBlog}
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            url={url}
            setUrl={setUrl}
          />

          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
