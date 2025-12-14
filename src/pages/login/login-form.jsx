import React, { useContext, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./login-form.css";
import { AuthContext } from "../../auth/auth-context";
import { API_URL } from "../../config/api";
import { auth } from "../../config/firebase";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const firebaseToken = await result.user.getIdToken();

      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: firebaseToken }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");

      login({
        email: data.email,
        name: result.user.displayName,
        picture: result.user.photoURL,
        token: data.accessToken, // JWT backend
      });

      navigate("/home");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Chào mừng đến với DYD!</h2>

        <div className="intro-card">
          <img src="icon-app.png" alt="DYD" className="intro-logo" />

          <div className="intro-text">
            <h2 className="intro-title">DYD</h2>
            <h4 className="intro-slogan">Idea – Ideal – Ido</h4>

            <p className="intro-description">
              DYD mang đến trải nghiệm quản lý cuộc họp thông minh – nhanh chóng – trực quan.
              Tất cả được tối ưu để hỗ trợ bạn làm việc hiệu quả hơn mỗi ngày.
            </p>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="login-button"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
          <span>{loading ? "Đang đăng nhập..." : "Đăng nhập bằng Google"}</span>
        </button>

        {error && <p className="error">{error}</p>}
      </div>
    </div>

  );
}