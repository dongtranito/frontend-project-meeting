import React, { useContext, useState } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/auth-context";
import "./login-form.css";

// === Firebase cấu hình ===
const firebaseConfig = {
  apiKey: "AIzaSyDHdcsvn-HGr2BAPWKCxLZSedIKK-3VdWs",
  authDomain: "metting-fcbcf.firebaseapp.com",
  projectId: "metting-fcbcf",
  storageBucket: "metting-fcbcf.firebasestorage.app",
  messagingSenderId: "872922744229",
  appId: "1:872922744229:web:2c149e701ac46d415e944c",
  measurementId: "G-W8H5DSWSBW",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Gửi token Firebase sang backend để xác minh & nhận accessToken mới
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại.");

      console.log("Backend xác minh thành công:", data);

      // Lưu accessToken từ backend vào context
      const userData = {
        email: data.email,
        name: user.displayName,
        picture: user.photoURL,
        // token: data.accessToken,
      };

      login(userData);
      navigate("/");

    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
    <div className="login-card">
      <h2>
        Chào mừng đến với DocFu!
      </h2>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="login-button"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
        />
        <span className="text-sm font-medium">
          {loading ? "Đang đăng nhập..." : "Đăng nhập bằng Google"}
        </span>
      </button>

      {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}