import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../config/api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("✅ Token decode:", decoded);
      console.log("exp:", decoded.exp * 1000, "now:", Date.now());
      return decoded.exp * 1000 < Date.now();
    } catch (err) {
      console.error("❌ Decode lỗi:", err);
      return true;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("🔍 storedUser:", storedUser);

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const token = userData?.token;
      console.log("🔍 token:", token);

      if (token && !isTokenExpired(token)) {
        console.log("✅ Token hợp lệ, giữ đăng nhập");
        setUser(userData);
        setIsLoggedIn(true);
        startAutoLogout(token);
      } else {
        console.warn("⚠️ Token hết hạn hoặc lỗi, logout");
        // handleLogout();
      }
    } else {
      console.warn("❌ Không tìm thấy user trong localStorage");
    }
  }, []);

  const startAutoLogout = (token) => {
    const decoded = jwtDecode(token);
    console.log("iat:", new Date(decoded.iat * 1000));
    console.log("exp:", new Date(decoded.exp * 1000));
    console.log("Token sống (phút):", (decoded.exp - decoded.iat) / 60);

    const expiresIn = decoded.exp * 1000 - Date.now();
    console.log("Auto logout in (ms):", expiresIn);
    if (logoutTimer) clearTimeout(logoutTimer);
    if (expiresIn <= 0) {
      console.warn("Token expired already!");
      handleLogout();
      return;
    }
    const timer = setTimeout(() => {
      console.log("Token expired, logging out...");
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
      // await fetch("http://localhost:3001/logout", {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user?.token || ""}`,
        },
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
