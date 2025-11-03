// import React, { createContext, useEffect, useState } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);

//   // Load user từ localStorage khi app khởi động
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//       setIsLoggedIn(true);
//     }
//   }, []);

//   // Lưu toàn bộ userData (có cả token) vào context
//   const login = (userData) => {
//     setUser(userData);
//     setIsLoggedIn(true);
//     localStorage.setItem("user", JSON.stringify(userData)); // lưu để load lại khi refresh
//   };

//   const logout = () => {
//     setUser(null);
//     setIsLoggedIn(false);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null);

  // Khi app khởi động
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const token = userData?.token;
      if (token && !isTokenExpired(token)) {
        setUser(userData);
        setIsLoggedIn(true);
        startAutoLogout(token);
      } else {
        handleLogout();
      }
    }
  }, []);

  // Kiểm tra token hết hạn
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // Đặt timer tự động logout
  const startAutoLogout = (token) => {
    const decoded = jwtDecode(token);
    const expiresIn = decoded.exp * 1000 - Date.now();
    if (logoutTimer) clearTimeout(logoutTimer);
    const timer = setTimeout(() => {
      handleLogout();
    }, expiresIn);
    setLogoutTimer(timer);
  };

  // Login
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.token) startAutoLogout(userData.token);
  };

  // Logout (gọi API + xóa local)
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/logout", {
        method: "POST",
        credentials: "include", // gửi cookie nếu có
      });
    } catch (err) {
      console.error("Logout API failed:", err);
    }

    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    if (logoutTimer) clearTimeout(logoutTimer);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, login, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};