// import React, { useContext, useState } from "react";
// import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../auth/auth-context";
// import "./login-form.css";
// import { API_URL } from "../../config/api";

// // === Firebase cấu hình ===
// const firebaseConfig = {
//   apiKey: "AIzaSyDHdcsvn-HGr2BAPWKCxLZSedIKK-3VdWs",
//   authDomain: "metting-fcbcf.firebaseapp.com",
//   projectId: "metting-fcbcf",
//   storageBucket: "metting-fcbcf.firebasestorage.app",
//   messagingSenderId: "872922744229",
//   appId: "1:872922744229:web:2c149e701ac46d415e944c",
//   measurementId: "G-W8H5DSWSBW",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// export default function LoginForm() {
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     setError("");
//     setLoading(true);

//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       const idToken = await user.getIdToken();

//       // Gửi token Firebase sang backend để xác minh & nhận accessToken mới
//       const res = await fetch(`${API_URL}/login`, {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",           
//           // Authorization: `Bearer ${user?.token || ""}`,
//         },
//         body: JSON.stringify({ idToken }),
//         credentials: "include",
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại.");

//       console.log("Backend xác minh thành công:", data);

//       // Lưu accessToken từ backend vào context
//       const userData = {
//         email: data.email,
//         name: user.displayName,
//         picture: user.photoURL,
//         token: data.accessToken,
//       };

//       login(userData);
//       console.log('data user: ', userData);
//       navigate("/home");

//     } catch (err) {
//       console.error("Lỗi đăng nhập:", err);
//       setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//     <div className="login-card">
//       <h2>
//         Chào mừng đến với DYD!
//       </h2>

//       <button
//         onClick={handleLogin}
//         disabled={loading}
//         className="login-button"
//       >
//         <img
//           src="https://www.svgrepo.com/show/475656/google-color.svg"
//           alt="Google"
//         />
//         <span className="text-sm font-medium">
//           {loading ? "Đang đăng nhập..." : "Đăng nhập bằng Google"}
//         </span>
//       </button>

//       {error && <p className="error">{error}</p>}
//       </div>
//     </div>
//   );
// }


//new flow login
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
    //old UI
    // <div className="login-container">
    //   <div className="login-card">
    //     <h2>Chào mừng đến với DYD!</h2>

    //     <button
    //       onClick={handleLogin}
    //       disabled={loading}
    //       className="login-button"
    //     >
    //       <img
    //         src="https://www.svgrepo.com/show/475656/google-color.svg"
    //         alt="Google"
    //       />
    //       <span>{loading ? "Đang đăng nhập..." : "Đăng nhập bằng Google"}</span>
    //     </button>

    //     {error && <p className="error">{error}</p>}
    //   </div>
    // </div>
    <div className="login-container">
      <div className="login-card">
        <h2>Chào mừng đến với DYD!</h2>

        {/* Intro section mới */}
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