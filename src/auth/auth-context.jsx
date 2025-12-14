import React, { createContext, useState, useEffect, useRef, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const logoutTimer = useRef(null); 

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("check expire", token); 
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const clearTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };

  const startAutoLogout = useCallback((token) => {
    clearTimer();
    try {
      const { exp } = jwtDecode(token);
      const delay = exp * 1000 - Date.now();

      if (delay <= 0) return handleLogout();

      logoutTimer.current = setTimeout(() => {
        handleLogout();
      }, delay);

    } catch {
      handleLogout();
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    startAutoLogout(userData.token);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    clearTimer();
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const data = JSON.parse(stored);
    if (data.token && !isTokenExpired(data.token)) {
      setUser(data);
      startAutoLogout(data.token);
    } else {
      handleLogout();
    }
  }, [startAutoLogout]);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};