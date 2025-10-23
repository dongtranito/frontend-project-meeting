import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from "@mui/material";
import "./item-meeting.css";

export default function MeetingItem({ meeting, onUpdated, onDeleted }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [newTitle, setNewTitle] = useState(meeting.title);
  const [newDescription, setNewDescription] = useState(meeting.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const handleDelete = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await fetch(`http://localhost:3001/delete-meeting/${meeting.meetingId}`, {
  //       method: "DELETE",
  //       credentials: "include",
  //     });
  //     const data = await res.json();
  //     if (!res.ok || !data.success) throw new Error(data.error || "Xóa cuộc họp thất bại");

  //     if (onDeleted) onDeleted(meeting.meetingId);
  //     setOpenConfirm(false);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDeleteMeeting = async () => {
    try {
      const res = await fetch(`http://localhost:3001/delete-meeting/${meeting.meetingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message);


      onDeleted(meeting.meetingId);

      setMessage({ type: "success", text: "Xóa cuộc họp thành công!" });
      setOpenConfirm(false);
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      setMessage({ type: "error", text: "Không thể xóa cuộc họp." });
    }
  };

  const handleUpdateMeeting = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/update-meeting/${meeting.meetingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: newTitle,
          description: newDescription
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      if (onUpdated) onUpdated(data.data);
      setMessage({ type: "success", text: "Cập nhật thành công!" });
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      setMessage({ type: "error", text: "Không thể cập nhật cuộc họp." });
    } finally {
      setLoading(false);
      setOpenUpdate(false); // Đảm bảo dialog luôn đóng sau khi hoàn tất
    }
  };




  return (
    <Card className="meeting-item">
      <CardContent className="meeting-content">
        <div className="meeting-header">
          <Typography variant="h6" className="meeting-title">
            {meeting.title}
          </Typography>
          <Typography variant="h6" className="meeting-title">
            {meeting.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            🕒 {new Date(meeting.scheduledAt).toLocaleString()}
          </Typography>
        </div>

        <div className="meeting-actions">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => setOpenUpdate(true)}
            className="btn-update"
          >
            Cập nhật
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => setOpenConfirm(true)}
            disabled={loading}
            className="btn-delete"
          >
            Xóa
          </Button>
        </div>
      </CardContent>

      {/* Dialog cập nhật */}
      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <DialogTitle>Cập nhật cuộc họp</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tên cuộc họp"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            variant="outlined"
            margin="dense"
          />

          <TextField
            fullWidth
            label="Mô tả cuộc họp"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            variant="outlined"
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Hủy</Button>
          <Button onClick={handleUpdateMeeting} variant="contained" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "8px 0",
          },
        }}
      >
        <DialogTitle>Xác nhận xóa cuộc họp</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn <strong>xóa</strong> cuộc họp{" "}
            <span style={{ color: "#d32f2f" }}>{meeting.title}</span> không?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteMeeting}
            disabled={loading}
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        message={error}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Card>
  );
}
