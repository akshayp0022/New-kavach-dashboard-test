import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/endpoints";
import { toast } from "react-toastify";

export const AuthContext = createContext({
  user: null,
  token: null,
  login: async (username, password) => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`/auth/login`, { username, password });
      const token = response.data.data.token;
      const userData = {
        initials: response.data.userInitials,
        message: response.data.message,
      };

      setUser(userData);
      setToken(token);
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(userData));

      navigate("/teams");
      toast.success(response.data.message);
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
