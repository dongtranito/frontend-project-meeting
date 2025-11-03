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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./item-member.css";

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
  const [message, setMessage] = useState(null);

  const handleRemoveMember = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("http://localhost:3001/remove-member", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          groupId: groupId,
          memberId: member.user_id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      onRemoved?.();
      setOpenDeleteDialog(false);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Không thể xóa thành viên." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMember = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("http://localhost:3001/update-member", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          memberEmail: member.user_id,
          name: newName,
          is_editor: true,
          groupId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Cập nhật thất bại");
      }

      // Chỉ chạy khi server thực sự trả thành công
      setMessage({ type: "success", text: "Cập nhật thành công!" });

      // Cập nhật UI ngay sau khi thành công
      onUpdated?.({ ...member, name: newName });

      // Đóng dialog sau khi hiển thị thông báo một chút
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
        </div>
        <div className="email">
          <Typography variant="subtitle1" className="member-email">
            {member.user_id}
          </Typography>
        </div>
      </div>

      {isOwner && member.role !== "owner" && member.user_id !== currentUserEmail && (
        <div className="member-actions">
          <Tooltip title="Chỉnh sửa tên">
            <IconButton color="primary" size="small" onClick={() => setOpenUpdateDialog(true)}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Xóa thành viên">
            <IconButton color="error" size="small" onClick={() => setOpenDeleteDialog(true)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}

      {/* Dialog xóa */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa thành viên</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc muốn xóa{" "}
            <strong style={{ color: "#d32f2f" }}>{member.user_id}</strong> khỏi nhóm không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRemoveMember}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog cập nhật */}
      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        PaperProps={{ className: "update-dialog-paper" }}
      >
        <DialogTitle>Chỉnh sửa tên thành viên</DialogTitle>
        <DialogContent className="update-dialog-content">
          <TextField
            fullWidth
            label="Tên mới"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            variant="outlined"
          />

          {message && (
            <Alert severity={message.type} sx={{ mt: 2 }}>
              {message.text}
            </Alert>
          )}
        </DialogContent>
        <DialogActions className="update-dialog-actions">
          <Button onClick={() => setOpenUpdateDialog(false)} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleUpdateMember}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Lưu thay đổi"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
