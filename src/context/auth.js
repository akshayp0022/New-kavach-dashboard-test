import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/index";

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
  console.log("user: ", user);
  
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
      const response = await axios.post(`/auth/login`, {
        username,
        password,
      });
      const userData = {
        initials: response.data.userInitials,
        message: response.data.message,
      };
      setUser(userData);
      sessionStorage.setItem("token", response.data.data.token);
      sessionStorage.setItem("user", JSON.stringify(userData));
      setToken(response.data.token);

      if (response.data.token) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUser(null)
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
