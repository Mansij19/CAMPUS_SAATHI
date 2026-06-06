import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

const readStoredUser = () => {
  const storedUser = localStorage.getItem("campussathi_user");

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    localStorage.removeItem("campussathi_user");
    localStorage.removeItem("campussathi_token");
    console.warn("Ignoring invalid stored session:", error.message);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return readStoredUser();
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

  const persistSession = useCallback((token, nextUser) => {
    localStorage.setItem("campussathi_token", token);
    localStorage.setItem("token", token);
    localStorage.setItem("campussathi_user", JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const login = useCallback(async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    persistSession(data.token, data.user);
    return data.user;
  }, [persistSession]);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistSession(data.token, data.user);
    return data.user;
  }, [persistSession]);

  const updateProfile = useCallback(async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    localStorage.setItem("campussathi_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = () => {
    localStorage.removeItem("campussathi_token");
    localStorage.removeItem("token");
    localStorage.removeItem("campussathi_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile }),
    [user, loading, login, register, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
