import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function MemberItem({ member, groupId, isOwner, currentUserEmail, token, onRemoved }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleRemoveMember = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/remove-member", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          groupId: groupId,
          memberId: member.user_id,
        }),
      });

      const data = await res.json();
    //   if (!res.ok || !data.success) {
    //     throw new Error(data.error || "Không thể xóa thành viên");
    //   }
        if (!res.ok || !data.success) throw new Error(data.message);

        alert(data.message || "Đã xóa thành viên");

      onRemoved?.();
      handleCloseDialog();
    } catch (err) {
      console.error("Lỗi xóa thành viên:", err);
      alert(err.message || "Xóa thành viên thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="member-item"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 12px",
        borderBottom: "1px solid #e0e0e0",
        borderRadius: 6,
      }}
    >
      <div>
        <strong>{member.name}</strong>{" "}
        {member.role === "owner" && (
          <span style={{ color: "#1976d2", fontSize: 13 }}>
            (Chủ nhóm)
          </span>
        )}
      </div>

      {isOwner && member.role !== "owner" && member.user_id !== currentUserEmail && (
        <Tooltip title="Xóa thành viên">
          <IconButton color="error" size="small" onClick={handleOpenDialog}>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Bạn có chắc muốn xóa <b>{member.user_id}</b> khỏi nhóm không?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleRemoveMember}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
