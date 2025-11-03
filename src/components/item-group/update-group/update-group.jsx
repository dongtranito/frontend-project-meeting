import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import "./update-group.css";

export default function UpdateGroupDialog({
  open,
  onClose,
  onSubmit,
  initialName = "",
  initialDescription = "",
  loading,
}) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Đồng bộ dữ liệu mỗi khi props thay đổi
  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [initialName, initialDescription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Tên nhóm không được để trống");
      return;
    }

    try {
      await onSubmit({ name, description });
      setSuccess("Cập nhật thành công!");
    } catch (err) {
      setError("Lỗi khi cập nhật nhóm");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="update-group-dialog">
      <DialogTitle>Cập nhật nhóm</DialogTitle>
      <DialogContent>
        <DialogContentText>Chỉnh sửa thông tin nhóm:</DialogContentText>

        <form onSubmit={handleSubmit} id="update-group-form">
          <TextField
            autoFocus
            required
            margin="dense"
            id="groupName"
            name="groupName"
            label="Tên nhóm"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Mô tả nhóm"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </form>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} className="cancel-btn">
          Hủy
        </Button>
        <Button
          type="submit"
          form="update-group-form"
          className="update-btn"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
