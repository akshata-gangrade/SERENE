import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load token when app starts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(token);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser(token);
  };

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};