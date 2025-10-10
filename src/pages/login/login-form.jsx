// import React, { useEffect } from "react";
// import "./login-form.css"; 

// export default function LoginForm() {
//   useEffect(() => {
//     const btn = document.querySelector(".img__btn");
//     const container = document.querySelector(".cont");

//     const handleClick = () => {
//       container.classList.toggle("s--signup");
//     };

//     if (btn) {
//       btn.addEventListener("click", handleClick);
//     }

//     // cleanup khi component unmount
//     return () => {
//       if (btn) {
//         btn.removeEventListener("click", handleClick);
//       }
//     };
//   }, []);

//   return (
//     <>
//       <br />
//       <br />
//       <div className="cont">
//         <div className="form sign-in">
//           <h2>Welcome</h2>
//           <label>
//             <span>Email</span>
//             <input type="email" />
//           </label>
//           <label>
//             <span>Password</span>
//             <input type="password" />
//           </label>
//           <p className="forgot-pass">Forgot password?</p>
//           <button type="button" className="submit">
//             Sign In
//           </button>
//         </div>

//         <div className="sub-cont">
//           <div className="img">
//             <div className="img__text m--up">
//               <h3>Don't have an account? Please Sign up!</h3>
//             </div>
//             <div className="img__text m--in">
//               <h3>If you already have an account, just sign in.</h3>
//             </div>
//             <div className="img__btn">
//               <span className="m--up">Sign Up</span>
//               <span className="m--in">Sign In</span>
//             </div>
//           </div>

//           <div className="form sign-up">
//             <h2>Create your Account</h2>
//             <label>
//               <span>Name</span>
//               <input type="text" />
//             </label>
//             <label>
//               <span>Email</span>
//               <input type="email" />
//             </label>
//             <label>
//               <span>Password</span>
//               <input type="password" />
//             </label>
//             <button type="button" className="submit">
//               Sign Up
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import React from "react";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode"; 
// import "./login-form.css";

// export default function LoginForm() {
//   const handleLoginSuccess = (credentialResponse) => {
//     const userInfo = jwtDecode(credentialResponse.credential); 
//     console.log("Google User Info:", userInfo);

//     // Gửi userInfo về backend hoặc lưu localStorage nếu cần
//   };

//   const handleLoginError = () => {
//     console.error("Login Failed!");
//   };

//   return (
//     <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
//       <div className="login-container">
//         <div className="login-card">
//           <h2>Welcome to DocFU</h2>
//           <p>Sign in quickly using your Google account</p>

//           <div className="google-btn-wrapper">
//             <GoogleLogin
//               onSuccess={handleLoginSuccess}
//               onError={handleLoginError}
//               shape="pill"
//               theme="filled_blue"
//               text="signin_with"
//             />
//           </div>
//         </div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// }

import React from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Button from "@mui/material/Button";
import "./login-form.css";

function GoogleLoginButton() {
  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      const userInfo = jwtDecode(credentialResponse.credential);
      console.log("Google User Info:", userInfo);
      // Lưu userInfo hoặc gửi lên backend tại đây
    },
    onError: () => {
      console.error("Login Failed!");
    },
    flow: "implicit", // hoặc "auth-code" nếu bạn dùng backend
  });

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={() => login()}
      sx={{
        textTransform: "none",
        borderRadius: "50px",
        padding: "10px 20px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google Logo"
        width="20"
        height="20"
        className="img-gg"
      />
      Đăng nhập với Google
    </Button>
  );
}

export default function LoginForm() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="login-container">
        <div className="login-card">
          <h2>Chào mừng đến với DocFU</h2>
          <p>Đăng nhập nhanh bằng tài khoản Google của bạn</p>

          <div className="google-btn-wrapper">
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
