import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("campussathi_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("campussathi_token");
    if (!token) return;

    setLoading(true);
    api
      .get("/auth/profile")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("campussathi_user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("campussathi_token");
        localStorage.removeItem("campussathi_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (token, nextUser) => {
    localStorage.setItem("campussathi_token", token);
    localStorage.setItem("campussathi_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    persistSession(data.token, data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistSession(data.token, data.user);
    return data.user;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    localStorage.setItem("campussathi_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("campussathi_token");
    localStorage.removeItem("campussathi_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
