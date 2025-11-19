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
  DialogContentText,
} from "@mui/material";
import { AuthContext } from "../../../auth/auth-context";
import "./invite-member-dialog.css";
import { API_URL } from "../../../config/api.js";

export default function InviteMemberDialog({ groupId, refreshGroup }) {
  const [open, setOpen] = useState(false);
  const [gmailInvite, setGmailInvite] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { user } = useContext(AuthContext);

  const handleClose = () => {
    setOpen(false);
    setGmailInvite("");
    setName("");
    setMessage(null);
  };

  const handleInvite = async () => {
    if (!gmailInvite.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập email người cần mời." });
      return;
    }

    if (!name.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập tên gợi nhớ." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // const res = await fetch("http://localhost:3001/invite-member", {
      const res = await fetch(`${API_URL}/invite-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          groupId: groupId,
          gmailInvite,
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || data.message || "Mời thành viên thất bại"
        );
      }

      setMessage({ type: "success", text: "Mời thành viên thành công!" });
      setGmailInvite("");
      setName("");

      // Gọi API cập nhật danh sách trước khi đóng
      if (typeof refreshGroup === "function") {
        await refreshGroup();
      }

      // Đợi 0.5s cho alert hiển thị rồi đóng dialog
      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (err) {
      console.error("Invite error:", err);
      setMessage({
        type: "error",
        text: err.message || "Có lỗi xảy ra khi mời thành viên.",
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
        className="invite-member-dialog"
      >
        <DialogTitle>Mời thành viên vào nhóm</DialogTitle>

        <DialogContent>
          <DialogContentText>Nhập email thành viên:</DialogContentText>
          <TextField
            label="Email"
            placeholder="vd: example@gmail.com"
            fullWidth
            variant="outlined"
            value={gmailInvite}
            onChange={(e) => setGmailInvite(e.target.value)}
            disabled={loading}
          />

          <DialogContentText>
            Nhập tên gợi nhớ cho thành viên:
          </DialogContentText>
          <TextField
            label="Tên thành viên"
            placeholder="Tên gợi nhớ"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

          {message && <Alert severity={message.type}>{message.text}</Alert>}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            className="cancel-btn"
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleInvite}
            className="invite-btn"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
