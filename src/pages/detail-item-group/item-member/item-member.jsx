import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Tooltip,
  TextField,
  Alert,
  Typography,
  DialogContentText,
  Box,
  Checkbox,
  FormControlLabel,
  Snackbar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./item-member.css";
import { API_URL } from "../../../config/api.js";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function MemberItem({
  member,
  groupId,
  isOwner,
  currentUserEmail,
  onRemoved,
  onUpdated,
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState(member.name);
  const [permission, setPermission] = useState(member.is_editor);
  const [message, setMessage] = useState(null);

  // const handleRemoveMember = async () => {
  //   setLoading(true);
  //   setMessage(null);
  //   try {
  //     // const res = await fetch("http://localhost:3001/remove-member", {
  //     const res = await fetch(`${API_URL}/remove-member`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // Authorization: `Bearer ${user?.token || ""}`,
  //       },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         groupId: groupId,
  //         memberId: member.user_id,
  //       }),
  //     });

  //     const data = await res.json();
  //     if (!res.ok || !data.success) throw new Error(data.message);
  //     onRemoved?.();
  //     setOpenDeleteDialog(false);
  //   } catch (err) {
  //     setMessage({
  //       type: "error",
  //       text: err.message || "Không thể xóa thành viên.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleRemoveMember = async () => {
    setOpenDeleteDialog(false); // ✅ đóng dialog ngay
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/remove-member`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          groupId: groupId,
          memberId: member.user_id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      setMessage({
        type: "success",
        text: `Đã xóa thành viên "${member.name}" thành công!`,
      });

      onRemoved?.();

      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Không thể xóa thành viên.",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateMember = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // const res = await fetch("http://localhost:3001/update-member", {
      const res = await fetch(`${API_URL}/update-member`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${user?.token || ""}`,
        },
        credentials: "include",
        body: JSON.stringify({
          memberEmail: member.user_id,
          name: newName,
          is_editor: permission,
          groupId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Cập nhật thất bại");
      }

      setMessage({ type: "success", text: "Cập nhật thành công!" });

      onUpdated?.({ ...member, name: newName, is_editor: permission });

      setTimeout(() => handleCloseUpdateDialog(), 800);
    } catch (err) {
      console.error("Lỗi cập nhật thành viên:", err);
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setMessage(null);
  };

  return (
    <div className="member-item">
      <div className="member-info">
        <div className="name-role">
          <Typography variant="subtitle1" className="member-name">
            {member.name}
          </Typography>

          {member.role === "owner" && (
            <Typography variant="body2" className="member-role">
              (Chủ nhóm)
            </Typography>
          )}

          {member.is_editor && (
            <CheckCircleIcon color="primary" sx={{ fontSize: 16 }} />

          )}
        </div>
        <div className="email">
          <Typography variant="subtitle1" className="member-email">
            {member.user_id}
          </Typography>
        </div>
      </div>

      {isOwner &&
        member.role !== "owner" &&
        member.user_id !== currentUserEmail && (
          <div className="member-actions">
            <Tooltip title="Chỉnh sửa tên">
              <IconButton
                color="primary"
                size="small"
                onClick={() => setOpenUpdateDialog(true)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xóa thành viên">
              <IconButton
                color="error"
                size="small"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        className="create-prompt-dialog confirmation-dialog"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WarningAmberIcon sx={{ mr: 1 }} />
            Xác nhận
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có muốn xóa thành viên <strong>{member.name}</strong> khỏi nhóm không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} className="cancel-btn">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleRemoveMember}
            className="create-btn"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!message}
        autoHideDuration={5000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box sx={{ px: 2, pb: 1 }}>
          <Alert
            severity={message?.type}
            onClose={() => setMessage(null)}
            sx={{
              mb: 1,
              borderRadius: 2,
              boxShadow: 3,
              alignItems: "center",
            }}
          >
            {message?.text}
          </Alert>
        </Box>
      </Snackbar>

      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        className="update-member-dialog"
      >
        <DialogTitle>Chỉnh sửa tên thành viên</DialogTitle>

        <DialogContent>
          <DialogContentText>Nhập tên mới cho thành viên:</DialogContentText>

          <TextField
            autoFocus
            required
            margin="dense"
            label="Tên mới"
            type="text"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <DialogContentText>Cấp quyền chỉnh sửa:</DialogContentText>
          <FormControlLabel
            control={
              <Checkbox
                checked={permission}
                onChange={(e) => setPermission(e.target.checked)}
                sx={{
                  color: "#006b7f",
                  '&.Mui-checked': {
                    color: "#006b7f",
                  },
                }}
              />
            }
            label="Người chỉnh sửa"
          />

          {message && (
            <p
              className={
                message.type === "error" ? "error-text" : "success-text"
              }
            >
              {message.text}
            </p>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenUpdateDialog(false)}
            className="cancel-btn"
          >
            Hủy
          </Button>

          <Button
            onClick={handleUpdateMember}
            className="update-btn"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
