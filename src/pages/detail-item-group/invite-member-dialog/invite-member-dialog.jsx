// import React, { useState, useContext } from "react";
// import {
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogActions,
//   TextField,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import { AuthContext } from './../../../auth/auth-context';

// export default function InviteMemberDialog({ groupId }) {
//   const [open, setOpen] = useState(false);
//   const [gmailInvite, setGmailInvite] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const { user } = useContext(AuthContext);

//   const handleClose = () => {
//     setOpen(false);
//     setGmailInvite("");
//     setMessage(null);
//   };

//   const handleInvite = async () => {
//     if (!gmailInvite.trim()) {
//       setMessage({ type: "error", text: "Vui lòng nhập email người cần mời." });
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     // try {
//     //   const res = await fetch("http://localhost:3001/invite-member", {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: `Bearer ${user?.token}`,
//     //     },
//     //     body: JSON.stringify({
//     //       groupId: groupId,
//     //       gmailInvite,
//     //     }),
//     //   });

//     //   const data = await res.json();

//     //   if (!res.ok || !data.success) {
//     //     throw new Error(data.error || data.message || "Mời thành viên thất bại");
//     //   }

//     //   setMessage({ type: "success", text: "✅ Mời thành viên thành công!" });
//     //   setGmailInvite("");
//     // } catch (err) {
//     //   console.error("Invite error:", err);
//     //   setMessage({
//     //     type: "error",
//     //     text: err.message || "❌ Có lỗi xảy ra khi mời thành viên.",
//     //   });
//     // } finally {
//     //   setLoading(false);
//     // }
//     try {
//       const res = await fetch("http://localhost:3001/invite-member", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user?.token}`,
//         },
//         body: JSON.stringify({
//           groupId: groupId,
//           gmailInvite,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         throw new Error(data.error || data.message || "Mời thành viên thất bại");
//       }

//       setMessage({ type: "success", text: "✅ Mời thành viên thành công!" });
//       setGmailInvite("");

//       // ✅ Gọi callback để reload danh sách thành viên
//       if (typeof refreshGroup === "function") {
//         await refreshGroup();
//       }
//     } catch (err) {
//       console.error("Invite error:", err);
//       setMessage({
//         type: "error",
//         text: err.message || "❌ Có lỗi xảy ra khi mời thành viên.",
//       });
//     } finally {
//       setLoading(false);
//     }

//   };

//   return (
//     <>
//       <Button variant="outlined" onClick={() => setOpen(true)}>
//         Mời thành viên
//       </Button>

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           sx: {
//             width: 400,
//             borderRadius: 3,
//             p: 2,
//           },
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
//           Mời thành viên vào nhóm
//         </DialogTitle>

//         <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//           <TextField
//             label="Nhập email thành viên"
//             placeholder="vd: example@gmail.com"
//             fullWidth
//             variant="outlined"
//             value={gmailInvite}
//             onChange={(e) => setGmailInvite(e.target.value)}
//             disabled={loading}
//           />

//           {message && (
//             <Alert severity={message.type} sx={{ mt: 1 }}>
//               {message.text}
//             </Alert>
//           )}
//         </DialogContent>

//         <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
//           <Button onClick={handleClose} variant="outlined" disabled={loading}>
//             Hủy
//           </Button>
//           <Button
//             onClick={handleInvite}
//             variant="contained"
//             color="primary"
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} color="inherit" /> : "Thêm"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }


import React, { useState, useContext } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AuthContext } from "../../../auth/auth-context";

export default function InviteMemberDialog({ groupId, refreshGroup }) {
  const [open, setOpen] = useState(false);
  const [gmailInvite, setGmailInvite] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { user } = useContext(AuthContext);

  const handleClose = () => {
    setOpen(false);
    setGmailInvite("");
    setMessage(null);
  };

  const handleInvite = async () => {
    if (!gmailInvite.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập email người cần mời." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:3001/invite-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          groupId: groupId,
          gmailInvite,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Mời thành viên thất bại");
      }

      setMessage({ type: "success", text: "✅ Mời thành viên thành công!" });
      setGmailInvite("");

      // ✅ Gọi API cập nhật danh sách trước khi đóng
      if (typeof refreshGroup === "function") {
        await refreshGroup();
      }

      // ✅ Đợi 0.5s cho alert hiển thị rồi đóng dialog
      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (err) {
      console.error("Invite error:", err);
      setMessage({
        type: "error",
        text: err.message || "❌ Có lỗi xảy ra khi mời thành viên.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Mời thành viên
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
          Mời thành viên vào nhóm
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Nhập email thành viên"
            placeholder="vd: example@gmail.com"
            fullWidth
            variant="outlined"
            value={gmailInvite}
            onChange={(e) => setGmailInvite(e.target.value)}
            disabled={loading}
          />

          {message && (
            <Alert severity={message.type} sx={{ mt: 1 }}>
              {message.text}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
          <Button onClick={handleClose} variant="outlined" disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleInvite}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

