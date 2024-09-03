import { useState } from "react";
import loginService from "../services/login";
import blogService from "../services/blogs";

const LoginForm = ({ setNotificationMessage, setUser }) => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

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
    } catch (error) {
      console.log(error);
      setNotificationMessage({
        message: "⛔️ Wrong credentials",
        type: "error",
      });
      setTimeout(() => {
        setNotificationMessage(null);
      }, 4000);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <div>
          Username
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          Password
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>
      </form>
      <br />
    </>
  );
};

export default LoginForm;
