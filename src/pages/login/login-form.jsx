// import React, { useState, useContext } from "react";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import GoogleLogin from "./google-login";
// import { useNavigate } from "react-router-dom";
// import "./login-form.css";
// import { AuthContext } from "../../auth/auth-context";

// export default function LoginForm() {
//   const [user, setUser] = useState(null);
//   const { setIsLoggedIn, setUser: setAuthUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLoginSuccess = (userData) => {
//     console.log("✅ Google User Info:", userData);

//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//     setAuthUser(userData);
//     setIsLoggedIn(true);

//     navigate("/");
//   };

//   return (
//     <GoogleOAuthProvider clientId="685799942721-d6788imj63cv34kiu5n6hrsd2kln3j2n.apps.googleusercontent.com">
//       <div className="login-container">
//         <div className="login-card">
//           <h2>Chào mừng đến với DocFU</h2>

//           {!user ? (
//             <>
//               <p>Đăng nhập nhanh bằng tài khoản Google của bạn</p>
//               <div className="google-btn-wrapper">
//                 <GoogleLogin onLoginSuccess={handleLoginSuccess} />
//               </div>
//             </>
//           ) : (
//             <>
//               <img
//                 src={user.picture}
//                 alt="Avatar"
//                 style={{ borderRadius: "50%", width: 80, height: 80 }}
//               />
//               <h3>{user.name}</h3>
//               <p>{user.email}</p>
//             </>
//           )}
//         </div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// const API_URL = import.meta.env.VITE_API_URL;
// console.log ("login",API_URL);
// console.log("import", import.meta.env)
// const firebaseConfig = {
//     apiKey: "AIzaSyDHdcsvn-HGr2BAPWKCxLZSedIKK-3VdWs",
//     authDomain: "metting-fcbcf.firebaseapp.com",
//     projectId: "metting-fcbcf",
//     storageBucket: "metting-fcbcf.firebasestorage.app",
//     messagingSenderId: "872922744229",
//     appId: "1:872922744229:web:2c149e701ac46d415e944c",
//     measurementId: "G-W8H5DSWSBW"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// const Login = () => {
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const handleLogin = async () => {
//         setError("");
//         setLoading(true);

//         try {

//             const provider = new GoogleAuthProvider();
//             const result = await signInWithPopup(auth, provider);
//             const user = result.user;
//             const idToken = await user.getIdToken();

//             const res = await fetch(`/login`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ idToken }),
//                 credentials: "include",
//             });

//             if (res.ok) {
//                 const data = await res.json();
//                 console.log("✅ Server xác minh:", data);
//                 navigate("/"); 
//             } else {
//                 const errorData = await res.json();
//                 setError(errorData.message || "Đăng nhập thất bại.");
//             }

//         } catch (err) {
//             console.error("❌ Đăng nhập thất bại:", err);
//             setError("Đăng nhập thất bại. Vui lòng thử lại.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
//             <h2 className="text-2xl font-semibold mb-6">Đăng nhập bằng Google</h2>

//             <button
//                 onClick={handleLogin}
//                 disabled={loading}
//                 className="flex items-center px-5 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl shadow hover:shadow-md hover:bg-gray-50 transition duration-200 disabled:opacity-60"
//             >
//                 <img
//                     src="https://www.svgrepo.com/show/475656/google-color.svg"
//                     alt="Google"
//                     className="w-6 h-6 mr-3"
//                 />
//                 <span className="text-sm font-medium">
//                     {loading ? "Đang đăng nhập..." : "Login with Google"}
//                 </span>
//             </button>

//             {error && (
//                 <p className="mt-4 text-red-500 text-sm">{error}</p>
//             )}
//         </div>
//     );
// };

// export default Login;


// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { AuthContext } from "../../auth/auth-context"; // dùng context bạn đã tạo

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

// // === Đường dẫn backend ===
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// export default function Login() {
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

//       // Gửi token sang backend
//       const res = await fetch(`${API_URL}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ idToken }),
//         credentials: "include", // gửi cookie từ backend
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Đăng nhập thất bại.");
//       }

//       const data = await res.json();
//       console.log("✅ Backend xác minh thành công:", data);

//       // Cập nhật AuthContext và lưu user
//       const userData = {
//         email: data.email,
//         name: user.displayName,
//         picture: user.photoURL,
//         token: data.accessToken, // ⚠️ thêm dòng này
//       };
//       login(userData);

//       // Điều hướng sang trang chủ
//       navigate("/");
//     } catch (err) {
//       console.error("❌ Lỗi đăng nhập:", err);
//       setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
//       <h2 className="text-2xl font-semibold mb-6 text-gray-700">
//         Đăng nhập bằng Google
//       </h2>

//       <button
//         onClick={handleLogin}
//         disabled={loading}
//         className="flex items-center px-5 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl shadow hover:shadow-md hover:bg-gray-50 transition duration-200 disabled:opacity-60"
//       >
//         <img
//           src="https://www.svgrepo.com/show/475656/google-color.svg"
//           alt="Google"
//           className="w-6 h-6 mr-3"
//         />
//         <span className="text-sm font-medium">
//           {loading ? "Đang đăng nhập..." : "Login with Google"}
//         </span>
//       </button>

//       {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
//     </div>
//   );
// }


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

      // ✅ Gửi token Firebase sang backend để xác minh & nhận accessToken mới
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại.");

      console.log("✅ Backend xác minh thành công:", data);

      // ✅ Lưu accessToken từ backend vào context
      const userData = {
        email: data.email,
        name: user.displayName,
        picture: user.photoURL,
        token: data.accessToken, // ⚠️ rất quan trọng
      };

      login(userData);
      navigate("/");

    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
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