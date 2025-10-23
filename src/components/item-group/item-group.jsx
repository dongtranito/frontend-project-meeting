import React, { useState, useContext } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import './item-group.css';
import { AuthContext } from './../../auth/auth-context';

export default function ItemGroup({ id, title, subheader, description }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [newName, setNewName] = useState(title || "");
  const [newDescription, setNewDescription] = useState(description || "");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const isOwner = user?.email === subheader;

  const handleCardClick = () => navigate(`/detail-group/${id}`);
  const handleOpenDialog = (e) => {
    e.stopPropagation();
    setOpenDialog(true);
  };
  const handleCloseDialog = () => setOpenDialog(false);

  const handleLeaveGroup = async () => {
    try {
      if (isOwner) {
        const res = await fetch(`http://localhost:3001/delete-group/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!res.ok) throw new Error("Xóa nhóm thất bại");
        alert(`✅ Nhóm "${title}" đã được xóa thành công.`);
      } else {
        const res = await fetch(`http://localhost:3001/leave-group`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ groupId: id, userId: user.uid }),
        });
        if (!res.ok) throw new Error("Rời nhóm thất bại");
        alert(`🚪 Bạn đã rời khỏi nhóm "${title}".`);
      }
      setOpenDialog(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("❌ Có lỗi xảy ra khi xử lý yêu cầu.");
    }
  };

  const handleOpenUpdate = (e) => {
    e.stopPropagation();
    setNewName(title || "");
    setNewDescription(description || "");
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdate = () => setOpenUpdateDialog(false);

  const handleUpdateGroup = async () => {
    try {
      const res = await fetch(`http://localhost:3001/update-group/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
        }),
      });

      if (!res.ok) throw new Error("Cập nhật nhóm thất bại");
      alert("✅ Nhóm đã được cập nhật thành công!");
      setOpenUpdateDialog(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Có lỗi xảy ra khi cập nhật nhóm.");
    }
  };

  return (
    <Card className="item-group-card">
      <CardHeader
        onClick={handleCardClick}
        className="item-group-header"
        title={title || "Tên nhóm chưa có"}
        subheader={subheader || "Chưa có chủ nhóm"}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="group">
            {title ? title.charAt(0).toUpperCase() : "?"}
          </Avatar>
        }
      />

      <CardContent className="item-group-description">
        <Typography variant="body2">
          {description && description.trim() !== ""
            ? description
            : "Nhóm này chưa có mô tả."}
        </Typography>
      </CardContent>

      <div className="item-group-actions">
        {isOwner && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleOpenUpdate}
          >
            Cập nhật
          </Button>
        )}
        <IconButton aria-label="settings" onClick={handleOpenDialog}>
          <MoreVertIcon />
        </IconButton>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Xác nhận</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isOwner ? (
              <>
                Bạn có chắc chắn muốn <b>xóa nhóm</b> <b>{title}</b> không?
              </>
            ) : (
              <>
                Bạn có chắc chắn muốn <b>rời khỏi nhóm</b> <b>{title}</b> không?
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleLeaveGroup} color="error" variant="contained">
            {isOwner ? "Xóa nhóm" : "Rời khỏi nhóm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateDialog} onClose={handleCloseUpdate}>
        <DialogTitle>Cập nhật nhóm</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên nhóm"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Mô tả nhóm"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate}>Hủy</Button>
          <Button
            onClick={handleUpdateGroup}
            variant="contained"
            color="primary"
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </Card>

  );
}
