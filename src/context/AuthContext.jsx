import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    return t ? jwtDecode(t) : null;
  });

  const login = async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    localStorage.setItem("token", res.data.token);
    setUser(jwtDecode(res.data.token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
