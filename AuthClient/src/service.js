import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    console.error("API error:", error.response?.status, error.message);
    if (error.response?.status === 401 && error.config.url !== "/login") {
      localStorage.removeItem("token");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default {
  login: async (username, password) => {
    const result = await axios.post("/login", { username, password });
    localStorage.setItem("token", result.data.token);
  },

  register: async (username, password) => {
    const result = await axios.post("/register", { username, password });
    localStorage.setItem("token", result.data.token);
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.reload();
  },

  getTasks: async () => {
    const result = await axios.get(`/items`)
    return result.data;
  },

  addTask: async (name) => {
    const result = await axios.post(`/items`, { name })
    return result.data;
  },

  setCompleted: async (id, isComplete) => {
    const result = await axios.put(`/items/${id}`, { isComplete })
    return result.data
  },

  deleteTask: async (id) => {
    const result = await axios.delete(`/items/${id}`)
    return result.data;
  }
};