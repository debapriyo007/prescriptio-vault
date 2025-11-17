import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("doctorToken");
    const doctorData = localStorage.getItem("doctorData");
    if (token && doctorData) {
      try {
        setDoctor(JSON.parse(doctorData));
      } catch (error) {
        console.error("Error parsing doctor data:", error);
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("doctorData");
      }
    }
    setLoading(false);
  }, []);

  const login = (token, doctorData) => {
    localStorage.setItem("doctorToken", token);
    localStorage.setItem("doctorData", JSON.stringify(doctorData));
    setDoctor(doctorData);
  };

  const logout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorData");
    setDoctor(null);
  };

  const value = { doctor, login, logout, loading, isAuthenticated: !!doctor };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};