import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  return;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createBlog = async (newBlog) => {
  const config = {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(baseUrl, newBlog, config);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating blog:",
      error.response ? error.response.data : error.message
    );
    throw error; // Propager l'erreur pour que l'appelant puisse la gérer
  }
};

const updateBlog = async (id, updatedBlogData) => {
  const config = {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.put(
      `${baseUrl}/${id}`,
      updatedBlogData,
      config
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating blog:",
      error.response ? error.response.data : error.message
    );
    throw error; // Propager l'erreur pour que l'appelant puisse la gérer
  }
};

const deleteBlog = async (id) => {
  if (!token) {
    throw new Error("No authorization token provided");
  }

  const config = {
    headers: {
      Authorization: token,
    },
  };

  try {
    await axios.delete(`${baseUrl}/${id}`, config);
  } catch (error) {
    console.error(
      "Error deleting blog:",
      error.response ? error.response.data : error.message
    );
    throw error; // Propager l'erreur pour que l'appelant puisse la gérer
  }
};

export default {
  getAll,
  setToken,
  createBlog,
  updateBlog,
  deleteBlog,
  setToken,
};
