import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './create-group-dialog.css';

import { useState } from 'react';

export default function CreateGroupDialog({ onGroupCreated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleClickOpen = () => setOpen(true);

  const handleClose = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    setError("");
    setSuccess("");
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const { groupName, nameOwner } = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:3001/creat-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: groupName, nameOwner: nameOwner }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Tạo nhóm thất bại");

      setSuccess("Tạo nhóm thành công!");

      // Gọi callback để cập nhật danh sách nhóm
      if (onGroupCreated) onGroupCreated(data);

      setTimeout(() => handleClose(), 800);
    } catch (err) {
      console.error("Lỗi tạo nhóm:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Tạo nhóm
      </Button>

      <Dialog open={open} onClose={handleClose} className="create-group-dialog">
        <DialogTitle>Tạo nhóm</DialogTitle>
        <DialogContent>
          <DialogContentText>Nhập tên nhóm bạn muốn tạo:</DialogContentText>

          <form onSubmit={handleSubmit} id="create-group-form">
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
            />

            <DialogContentText>Nhập tên trưởng nhóm:</DialogContentText>
            <TextField
              required
              margin="dense"
              id="nameOwner"
              name="nameOwner"
              label="Tên trưởng nhóm"
              type="text"
              fullWidth
              variant="outlined"
            />

            {/* <DialogActions>
              <Button onClick={handleClose}>Hủy</Button>
              <Button type="submit" variant="contained">
                Tạo nhóm
              </Button>
            </DialogActions> */}
          </form>


          {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
          {success && <p style={{ color: "green", marginTop: "8px" }}>{success}</p>}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} className="cancel-btn">
            Hủy
          </Button>
          <Button
            type="submit"
            form="create-group-form"
            className="create-btn"
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

