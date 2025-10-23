// import React from "react";
// import { useGoogleLogin } from "@react-oauth/google";
// import axios from "axios";
// import Button from "@mui/material/Button";

// export default function GoogleLogin({ onLoginSuccess }) {
//   const login = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       try {
//         const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
//           headers: {
//             Authorization: `Bearer ${tokenResponse.access_token}`,
//           },
//         });

//         console.log("Google User Info:", res.data);
//         // Lưu user vào localStorage
//         localStorage.setItem("user", JSON.stringify(res.data));

//         // Gọi callback của cha
//         if (onLoginSuccess) onLoginSuccess(res.data);
//       } catch (err) {
//         console.error("❌ Failed to fetch user info:", err);
//       }
//     },
//     onError: () => {
//       console.error("❌ Google Login Failed!");
//     },
//   });

//   return (
//     <Button
//       variant="outlined"
//       color="primary"
//       onClick={() => login()}
//       sx={{
//         textTransform: "none",
//         borderRadius: "50px",
//         padding: "10px 20px",
//         fontWeight: 500,
//         display: "flex",
//         alignItems: "center",
//         gap: "10px",
//       }}
//     >
//       <img
//         src="https://developers.google.com/identity/images/g-logo.png"
//         alt="Google Logo"
//         width="20"
//         height="20"
//       />
//       Đăng nhập với Google
//     </Button>
//   );
// }
