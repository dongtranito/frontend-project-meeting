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
  Box,
  Alert,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import "./item-group.css";
import { AuthContext } from "./../../auth/auth-context";
import UpdateGroupDialog from "./update-group/update-group";

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { API_URL } from "../../config/api.js";

export default function ItemGroup({
  id,
  title,
  subheader,
  description,
  reload,
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [newName, setNewName] = useState(title || "");
  const [newDescription, setNewDescription] = useState(description || "");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const isOwner = user?.email === subheader;

  const handleCardClick = () => navigate(`/detail-group/${id}`);
  const handleOpenDialog = (e) => {
    e.stopPropagation();
    setOpenDialog(true);
  };
  const handleCloseDialog = () => setOpenDialog(false);

  // const handleLeaveGroup = async () => {
  //   setMessage(null);
  //   try {
  //     if (isOwner) {
  //       // const res = await fetch(`http://localhost:3001/delete-group/${id}`, {
  //       const res = await fetch(`${API_URL}/delete-group/${id}`, {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //         credentials: "include",
  //       });
  //       if (!res.ok) throw new Error("Xóa nhóm thất bại");
  //       // alert(`Nhóm "${title}" đã được xóa thành công.`);
  //       setMessage(`Nhóm ${title} đã được xóa thành công.`);
  //     } else {
  //       // const res = await fetch(`http://localhost:3001/leave-group`, {
  //       const res = await fetch(`${API_URL}/leave-group`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //         credentials: "include",
  //         body: JSON.stringify({ groupId: id, userId: user.uid }),
  //       });
  //       if (!res.ok) throw new Error("Rời nhóm thất bại");
  //       // alert(`🚪 Bạn đã rời khỏi nhóm "${title}".`);
  //       setMessage(`Bạn đã rời khỏi nhóm ${title}.`);
  //     }
  //     setOpenDialog(false);
  //     window.location.reload();
  //   } catch (error) {
  //     console.error(error);
  //     // alert("Có lỗi xảy ra khi xử lý yêu cầu.");
  //     setMessage("Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau!");
  //   }
  // };
  const handleLeaveGroup = async () => {
    setMessage(null);
    try {
      let successText = "";

      if (isOwner) {
        const res = await fetch(`${API_URL}/delete-group/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Xóa nhóm thất bại");
        successText = `Nhóm "${title}" đã được xóa thành công.`;

      } else {
        const res = await fetch(`${API_URL}/leave-group`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify({ groupId: id, userId: user.uid }),
        });

        if (!res.ok) throw new Error("Rời nhóm thất bại");
        successText = `Bạn đã rời khỏi nhóm "${title}".`;
      }

      setMessage({ type: "success", text: successText });
      setOpenDialog(false);

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau!",
      });
    }
  };


  const handleOpenUpdate = (e) => {
    e.stopPropagation();
    setNewName(title || "");
    setNewDescription(description || "");
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdate = () => setOpenUpdateDialog(false);

  const handleUpdateGroup = async ({ name, description }) => {
    setLoading(true);
    try {
      // const res = await fetch(`http://localhost:3001/update-group/${id}`, {
      const res = await fetch(`${API_URL}/update-group/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || ""}`,
        },
        credentials: "include",
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      console.log("Cập nhật nhóm thành công:", data);
      setNewName(name);
      setNewDescription(description);

      await reload();

      handleCloseUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const randomHex = "#" + Math.floor(Math.random() * 16777215).toString(16);

  const avatarColors = [
    "#e57373", // red
    "#64b5f6", // blue
    "#81c784", // green
    "#ffb74d", // orange
    "#ba68c8", // purple
    "#4db6ac", // teal
    "#7986cb", // indigo
  ];

  const getColorFromSubheader = (text) => {
    if (!text) return "#9e9e9e"; // màu default

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash % avatarColors.length);
    return avatarColors[index];
  };

  return (
    <Card className="item-group-card">
      <CardHeader
        onClick={handleCardClick}
        className="item-group-header"
        title={title || "Tên nhóm chưa có"}
        subheader={subheader || "Chưa có chủ nhóm"}
        avatar={
          <Avatar
            sx={{ bgcolor: getColorFromSubheader(subheader) }}
            aria-label="group"
          >
            {subheader ? subheader.charAt(0).toUpperCase() : "?"}
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

      {message && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Alert
            severity={message.type}
            onClose={() => setMessage(null)}
            sx={{ mb: 1 }}
          >
            {message.text}
          </Alert>
        </Box>
      )}

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
          <DeleteOutlinedIcon />
        </IconButton>
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
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
            {isOwner ? (
              <>
                Bạn có chắc chắn muốn xóa nhóm {title} không?
              </>
            ) : (
              <>
                Bạn có chắc chắn muốn rời khỏi nhóm {title} không?
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} className="cancel-btn">
            Hủy
          </Button>
          <Button
            onClick={handleLeaveGroup}
            className="create-btn"
            variant="contained"
          >
            {isOwner ? "Xóa nhóm" : "Rời khỏi nhóm"}
          </Button>
        </DialogActions>
      </Dialog>

      <UpdateGroupDialog
        open={openUpdateDialog}
        onClose={handleCloseUpdate}
        onSubmit={handleUpdateGroup}
        initialName={newName}
        initialDescription={newDescription}
        loading={loading}
      />
    </Card>
  );
}
